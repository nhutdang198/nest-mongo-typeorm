---
to: src/modules/<%= name %>/layers/caching.layer.ts
---
import { Inject, Injectable } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import {
  CreateMany<%= h.capitalize(name) %>sBody,
  CreateMany<%= h.capitalize(name) %>sResponse,
  DeleteOne<%= h.capitalize(name) %>Param,
  DeleteOne<%= h.capitalize(name) %>Response,
  UpdateOne<%= h.capitalize(name) %>Body,
  UpdateOne<%= h.capitalize(name) %>Param,
  UpdateOne<%= h.capitalize(name) %>Response,
  GetMany<%= h.capitalize(name) %>sByIdEntity,
  GetMany<%= h.capitalize(name) %>sByIdQuery,
  GetMany<%= h.capitalize(name) %>sByIdResponse,
  Search<%= h.capitalize(name) %>sBody,
  Search<%= h.capitalize(name) %>sResponse,
} from '../dtos/service';
import { RedisClientType } from 'redis';
import * as _ from 'lodash';
import { <%= h.capitalize(name) %>SyncLayer } from './sync.layer';

@Injectable()
export class <%= h.capitalize(name) %>CachingLayer extends ServiceAbstract {
  constructor(
    private <%= name %>SyncLayer: <%= h.capitalize(name) %>SyncLayer,
    @Inject('X_REDIS_CLIENT') private xredisService: RedisClientType,
  ) {
    super();
  }

  async createMany(
    body: CreateMany<%= h.capitalize(name) %>sBody,
  ): Promise<CreateMany<%= h.capitalize(name) %>sResponse> {
    return await this.<%= name %>SyncLayer.createMany(body);
  }

  async getManyByUuid(
    query: GetMany<%= h.capitalize(name) %>sByIdQuery,
  ): Promise<GetMany<%= h.capitalize(name) %>sByIdResponse> {
    const { uuid: uuids } = query;
    let cloneIdList = _.cloneDeep(uuids);
    const cachedData = await this.xredisService.mGet(
      _.map(uuids, (uuid) => `Metadata:<%= h.capitalize(name) %>s:${_.toLower(_.trim(uuid))}`),
    );
    const cleanData = [];
    for (const rawData of cachedData) {
      if (rawData) {
        const data = JSON.parse(rawData);
        cloneIdList = cloneIdList.filter((y) => y !== data?.uuid);
        cleanData.push(data);
      }
    }

    if (cleanData.length === uuids.length) {
      return {
        metadata: {
          total: cleanData.length,
          notFounds: [],
          source: 'cache',
        },
        data: cleanData as unknown as GetMany<%= h.capitalize(name) %>sByIdEntity[],
      };
    }

    const { metadata, data } = await this.<%= name %>SyncLayer.getManyByUuid({
      uuid: cloneIdList,
    });

    for (const <%= name %> of data) {
      await this.xredisService.set(
        `Metadata:<%= h.capitalize(name) %>s:${<%= name %>.uuid}`,
        JSON.stringify(<%= name %>),
        { EX: 86400 },
      );
    }
    const source = [
      metadata.total > 0 ? 'elasticsearch' : '',
      cleanData.length > 0 ? 'cache' : '',
    ]
      .filter((x) => x)
      .join(' + ');
    return {
      metadata: {
        total: metadata.total + cleanData.length,
        notFounds: metadata.notFounds,
        source: source,
      },
      data: data.concat(cleanData as unknown as GetMany<%= h.capitalize(name) %>sByIdEntity[]),
    };
  }

  async updateOneByUuid(
    param: UpdateOne<%= h.capitalize(name) %>Param,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<UpdateOne<%= h.capitalize(name) %>Response> {
    const { uuid } = param;
    const response = await this.<%= name %>SyncLayer.updateOneByUuid(param, body);
    await this.xredisService.set(
      `Metadata:<%= h.capitalize(name) %>s:${uuid}`,
      JSON.stringify(response.data),
      {
        EX: 86400,
      },
    );
    response.metadata.source = response.metadata.source + ' + redis';
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOne<%= h.capitalize(name) %>Param,
  ): Promise<DeleteOne<%= h.capitalize(name) %>Response> {
    const { uuid } = param;
    const response = await this.<%= name %>SyncLayer.deleteOneByUuid(param);
    await this.xredisService.del(`Metadata:<%= h.capitalize(name) %>s:${_.toLower(_.trim(uuid))}`);
    response.metadata.source = response.metadata.source + ' + redis';
    return response;
  }

  async search(body: Search<%= h.capitalize(name) %>sBody): Promise<Search<%= h.capitalize(name) %>sResponse> {
    return await this.<%= name %>SyncLayer.search(body);
  }
}
