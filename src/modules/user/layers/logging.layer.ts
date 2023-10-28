import { Injectable, Logger } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import { UserCachingLayer } from './caching.layer';
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

@Injectable()
export class UserLoggingLayer extends ServiceAbstract {
  private readonly logger = new Logger(UserLoggingLayer.name);

  constructor(private userCachingLayer: UserCachingLayer) {
    super();
  }

  async createMany(
    body: CreateManyUsersBody,
  ): Promise<CreateManyUsersResponse> {
    const response = await this.userCachingLayer.createMany(body);
    this.logger.debug(JSON.stringify(body));
    this.logger.verbose(response.data.length + ' user are created');
    return response;
  }

  async getManyByUuid(
    query: GetManyUsersByIdQuery,
  ): Promise<GetManyUsersByIdResponse> {
    const response = await this.userCachingLayer.getManyByUuid(query);
    this.logger.debug(JSON.stringify(query));
    this.logger.verbose(response.metadata.total + ' user are gotten');
    return response;
  }

  async updateOneByUuid(
    param: UpdateOneUserParam,
    body: UpdateOneUserBody,
  ): Promise<UpdateOneUserResponse> {
    const response = await this.userCachingLayer.updateOneByUuid(param, body);
    this.logger.debug('param ' + JSON.stringify(param));
    this.logger.debug('body: ' + JSON.stringify(body));
    this.logger.verbose('user ' + response.data.uuid + ' are updated');
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOneUserParam,
  ): Promise<DeleteOneUserResponse> {
    const response = await this.userCachingLayer.deleteOneByUuid(param);
    this.logger.debug('param ' + JSON.stringify(param));
    this.logger.verbose('user ' + response.data.uuid + ' are deleted');
    return response;
  }

  async search(body: SearchUsersBody): Promise<SearchUsersResponse> {
    const response = await this.userCachingLayer.search(body);
    this.logger.debug('body ' + JSON.stringify(body));
    this.logger.verbose('user ' + response.metadata.total + ' are gotten');
    return response;
  }
}
