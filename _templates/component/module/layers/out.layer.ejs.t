---
to: src/modules/<%= name %>/layers/out.layer.ts
---
import { Injectable } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
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
import { <%= h.capitalize(name) %>LoggingLayer } from './logging.layer';

@Injectable()
export class <%= h.capitalize(name) %>OutLayer extends ServiceAbstract {
  constructor(private <%= name %>LoggingLayer: <%= h.capitalize(name) %>LoggingLayer) {
    super();
  }

  async createMany(
    body: CreateMany<%= h.capitalize(name) %>sBody,
  ): Promise<CreateMany<%= h.capitalize(name) %>sResponse> {
    return await this.<%= name %>LoggingLayer.createMany(body);
  }

  async getManyByUuid(
    query: GetMany<%= h.capitalize(name) %>sByIdQuery,
  ): Promise<GetMany<%= h.capitalize(name) %>sByIdResponse> {
    return await this.<%= name %>LoggingLayer.getManyByUuid(query);
  }

  async updateOneByUuid(
    param: UpdateOne<%= h.capitalize(name) %>Param,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<UpdateOne<%= h.capitalize(name) %>Response> {
    return await this.<%= name %>LoggingLayer.updateOneByUuid(param, body);
  }

  async deleteOneByUuid(
    param: DeleteOne<%= h.capitalize(name) %>Param,
  ): Promise<DeleteOne<%= h.capitalize(name) %>Response> {
    return await this.<%= name %>LoggingLayer.deleteOneByUuid(param);
  }

  async search(body: Search<%= h.capitalize(name) %>sBody): Promise<Search<%= h.capitalize(name) %>sResponse> {
    return await this.<%= name %>LoggingLayer.search(body);
  }
}
