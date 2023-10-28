import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import { UserService } from './service.layer';
import {
  CreateManyUsersBody,
  CreateManyUsersResponse,
  DeleteOneUserParam,
  DeleteOneUserResponse,
  UpdateOneUserBody,
  UpdateOneUserParam,
  UpdateOneUserResponse,
  GetManyUsersByIdQuery,
  GetManyUsersByIdResponse,
  SearchUsersBody,
  SearchUsersResponse,
} from '../dtos/service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSyncLayer extends ServiceAbstract implements OnModuleInit {
  private readonly logger = new Logger(UserSyncLayer.name);

  async onModuleInit() {
    const exist = await this.elaService.indices.exists({
      index: this.configService.get<string>('ELA_METADATA_USER_INDEX'),
    });
    if (!exist) {
      await this.elaService.indices.create({
        index: this.configService.get<string>('ELA_METADATA_USER_INDEX'),
      });
    }
  }

  constructor(
    private userService: UserService,
    private readonly elaService: ElasticsearchService,
    private configService: ConfigService,
  ) {
    super();
  }

  async createMany(
    body: CreateManyUsersBody,
  ): Promise<CreateManyUsersResponse> {
    const response = await this.userService.createMany(body);
    for (const user of response.data) {
      await this.elaService
        .index({
          index: this.configService.get<string>('ELA_METADATA_USER_INDEX'),
          id: user.uuid,
          document: user,
        })
        .finally(() => {
          this.logger.log(`[create] sync user ${user.uuid} to elasticsearch`);
        });
    }
    return response;
  }

  async getManyByUuid(
    query: GetManyUsersByIdQuery,
  ): Promise<GetManyUsersByIdResponse> {
    return await this.userService.getManyByUuid(query);
  }

  async updateOneByUuid(
    param: UpdateOneUserParam,
    body: UpdateOneUserBody,
  ): Promise<UpdateOneUserResponse> {
    const { uuid } = param;
    const response = await this.userService.updateOneByUuid(param, body);
    await this.elaService
      .index({
        index: this.configService.get<string>('ELA_METADATA_USER_INDEX'),
        id: uuid,
        document: response.data,
      })
      .finally(() => {
        this.logger.verbose(
          `[update] sync updated user ${uuid} to elasticsearch`,
        );
      });
    response.metadata.source = response.metadata.source + ' + elasticsearch';
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOneUserParam,
  ): Promise<DeleteOneUserResponse> {
    const { uuid } = param;
    const response = await this.userService.deleteOneByUuid(param);
    await this.elaService
      .delete({
        index: this.configService.get<string>('ELA_METADATA_USER_INDEX'),
        id: uuid,
      })
      .finally(() => {
        this.logger.verbose(`[delete] delete user ${uuid} from elasticsearch`);
      });
    response.metadata.source = response.metadata.source + ' + elasticsearch';
    return response;
  }

  async search(body: SearchUsersBody): Promise<SearchUsersResponse> {
    return await this.userService.search(body);
  }
}
