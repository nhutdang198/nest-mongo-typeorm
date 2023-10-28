---
to: src/modules/<%= name %>/layers/sync.layer.ts
---
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import { <%= h.capitalize(name) %>Service } from './service.layer';
import {
  CreateMany<%= h.capitalize(name) %>sBody,
  CreateMany<%= h.capitalize(name) %>sResponse,
  DeleteOne<%= h.capitalize(name) %>Param,
  DeleteOne<%= h.capitalize(name) %>Response,
  UpdateOne<%= h.capitalize(name) %>Body,
  UpdateOne<%= h.capitalize(name) %>Param,
  UpdateOne<%= h.capitalize(name) %>Response,
  GetMany<%= h.capitalize(name) %>sByIdQuery,
  GetMany<%= h.capitalize(name) %>sByIdResponse,
  Search<%= h.capitalize(name) %>sBody,
  Search<%= h.capitalize(name) %>sResponse,
} from '../dtos/service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class <%= h.capitalize(name) %>SyncLayer extends ServiceAbstract implements OnModuleInit {
  private readonly logger = new Logger(<%= h.capitalize(name) %>SyncLayer.name);

  async onModuleInit() {
    const exist = await this.elaService.indices.exists({
      index: this.configService.get<string>('ELA_METADATA_<%= name.toUpperCase() %>_INDEX'),
    });
    if (!exist) {
      await this.elaService.indices.create({
        index: this.configService.get<string>('ELA_METADATA_<%= name.toUpperCase() %>_INDEX'),
      });
    }
  }

  constructor(
    private <%= name %>Service: <%= h.capitalize(name) %>Service,
    private readonly elaService: ElasticsearchService,
    private configService: ConfigService,
  ) {
    super();
  }

  async createMany(
    body: CreateMany<%= h.capitalize(name) %>sBody,
  ): Promise<CreateMany<%= h.capitalize(name) %>sResponse> {
    const response = await this.<%= name %>Service.createMany(body);
    for (const <%= name %> of response.data) {
      await this.elaService
        .index({
          index: this.configService.get<string>('ELA_METADATA_<%= h.capitalize(name) %>_INDEX'),
          id: <%= name %>.uuid,
          document: <%= name %>,
        })
        .finally(() => {
          this.logger.log(`[create] sync <%= name %> ${<%= name %>.uuid} to elasticsearch`);
        });
    }
    return response;
  }

  async getManyByUuid(
    query: GetMany<%= h.capitalize(name) %>sByIdQuery,
  ): Promise<GetMany<%= h.capitalize(name) %>sByIdResponse> {
    return await this.<%= name %>Service.getManyByUuid(query);
  }

  async updateOneByUuid(
    param: UpdateOne<%= h.capitalize(name) %>Param,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<UpdateOne<%= h.capitalize(name) %>Response> {
    const { uuid } = param;
    const response = await this.<%= name %>Service.updateOneByUuid(param, body);
    await this.elaService
      .index({
        index: this.configService.get<string>('ELA_METADATA_<%= h.capitalize(name) %>_INDEX'),
        id: uuid,
        document: response.data,
      })
      .finally(() => {
        this.logger.verbose(
          `[update] sync updated <%= name %> ${uuid} to elasticsearch`,
        );
      });
    response.metadata.source = response.metadata.source + ' + elasticsearch';
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOne<%= h.capitalize(name) %>Param,
  ): Promise<DeleteOne<%= h.capitalize(name) %>Response> {
    const { uuid } = param;
    const response = await this.<%= name %>Service.deleteOneByUuid(param);
    await this.elaService
      .delete({
        index: this.configService.get<string>('ELA_METADATA_<%= h.capitalize(name) %>_INDEX'),
        id: uuid,
      })
      .finally(() => {
        this.logger.verbose(`[delete] delete <%= name %> ${uuid} from elasticsearch`);
      });
    response.metadata.source = response.metadata.source + ' + elasticsearch';
    return response;
  }

  async search(body: Search<%= h.capitalize(name) %>sBody): Promise<Search<%= h.capitalize(name) %>sResponse> {
    return await this.<%= name %>Service.search(body);
  }
}
