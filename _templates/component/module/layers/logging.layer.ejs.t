---
to: src/modules/<%= name %>/layers/logging.layer.ts
---
import { Injectable, Logger } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import { <%= h.capitalize(name) %>CachingLayer } from './caching.layer';
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

@Injectable()
export class <%= h.capitalize(name) %>LoggingLayer extends ServiceAbstract {
  private readonly logger = new Logger(<%= h.capitalize(name) %>LoggingLayer.name);

  constructor(private <%= name %>CachingLayer: <%= h.capitalize(name) %>CachingLayer) {
    super();
  }

  async createMany(
    body: CreateMany<%= h.capitalize(name) %>sBody,
  ): Promise<CreateMany<%= h.capitalize(name) %>sResponse> {
    const response = await this.<%= name %>CachingLayer.createMany(body);
    this.logger.debug(JSON.stringify(body));
    this.logger.verbose(response.data.length + ' <%= name %> are created');
    return response;
  }

  async getManyByUuid(
    query: GetMany<%= h.capitalize(name) %>sByIdQuery,
  ): Promise<GetMany<%= h.capitalize(name) %>sByIdResponse> {
    const response = await this.<%= name %>CachingLayer.getManyByUuid(query);
    this.logger.debug(JSON.stringify(query));
    this.logger.verbose(response.metadata.total + ' <%= name %> are gotten');
    return response;
  }

  async updateOneByUuid(
    param: UpdateOne<%= h.capitalize(name) %>Param,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<UpdateOne<%= h.capitalize(name) %>Response> {
    const response = await this.<%= name %>CachingLayer.updateOneByUuid(param, body);
    this.logger.debug('param ' + JSON.stringify(param));
    this.logger.debug('body: ' + JSON.stringify(body));
    this.logger.verbose('<%= name %> ' + response.data.uuid + ' are updated');
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOne<%= h.capitalize(name) %>Param,
  ): Promise<DeleteOne<%= h.capitalize(name) %>Response> {
    const response = await this.<%= name %>CachingLayer.deleteOneByUuid(param);
    this.logger.debug('param ' + JSON.stringify(param));
    this.logger.verbose('<%= name %> ' + response.data.uuid + ' are deleted');
    return response;
  }

  async search(body: Search<%= h.capitalize(name) %>sBody): Promise<Search<%= h.capitalize(name) %>sResponse> {
    const response = await this.<%= name %>CachingLayer.search(body);
    this.logger.debug('body ' + JSON.stringify(body));
    this.logger.verbose('<%= name %> ' + response.metadata.total + ' are gotten');
    return response;
  }
}
