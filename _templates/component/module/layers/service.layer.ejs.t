---
to: src/modules/<%= name %>/layers/service.layer.ts
---
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { <%= h.capitalize(name) %>ElasticsearchService, <%= h.capitalize(name) %>Model } from '../models';
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
} from 'src/modules/<%= name %>/dtos/service';
import { plainToInstance } from 'class-transformer';
import { toLower, trim } from 'lodash';
import { <%= h.capitalize(name) %>Entity } from '../entities';
import * as _ from 'lodash';

@Injectable()
export class <%= h.capitalize(name) %>Service extends ServiceAbstract {
  constructor(
    private <%= name %>Model: <%= h.capitalize(name) %>Model,
    private elaService: <%= h.capitalize(name) %>ElasticsearchService,
  ) {
    super();
  }

  async createMany(
    body: CreateMany<%= h.capitalize(name) %>sBody,
  ): Promise<CreateMany<%= h.capitalize(name) %>sResponse> {
    const { <%= name %>s } = body;
    const data = await this.<%= name %>Model.createMany(<%= name %>s as <%= h.capitalize(name) %>Entity[]);
    const response: CreateMany<%= h.capitalize(name) %>sResponse = {
      metadata: {
        total: data.length,
        source: 'database',
      },
      data,
    };
    return plainToInstance(CreateMany<%= h.capitalize(name) %>sResponse, response);
  }

  async getManyByUuid(
    query: GetMany<%= h.capitalize(name) %>sByIdQuery,
  ): Promise<GetMany<%= h.capitalize(name) %>sByIdResponse> {
    const { uuid: uuids } = query;
    const uuidMap = {};
    uuids.forEach((rawUuid) => {
      const oneUuid = toLower(trim(rawUuid));
      uuidMap[oneUuid] = rawUuid;
    });
    const { metadata, data: <%= name %>s } = await this.elaService.getManyByUuid({
      uuid: Object.keys(uuidMap),
    });
    <%= name %>s.forEach((<%= name %>) => {
      const cleanUuid = toLower(trim(<%= name %>.uuid));
      <%= name %>.uuid = uuidMap[cleanUuid];
      delete uuidMap[cleanUuid];
    });
    const notFounds = Object.keys(uuidMap).map((uuid) => uuidMap[uuid]);
    const response = {
      metadata: {
        total: metadata.total,
        notFounds,
        source: 'elasticsearch',
      },
      data: <%= name %>s,
    };
    return plainToInstance(GetMany<%= h.capitalize(name) %>sByIdResponse, response);
  }

  async updateOneByUuid(
    param: UpdateOne<%= h.capitalize(name) %>Param,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<UpdateOne<%= h.capitalize(name) %>Response> {
    const { uuid } = param;
    const data = await this.<%= name %>Model.updateOneByUuid(uuid, body);
    if (!_.isEmpty(_.get(data, 'value', ''))) {
      data.value.id = data.value._id;
      delete data.value._id;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'bad uuid at /<%= name %>s/updateOneByUuid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response: UpdateOne<%= h.capitalize(name) %>Response = {
      metadata: {
        update: true,
        source: 'database',
      },
      data: data?.value,
    };
    return plainToInstance(UpdateOne<%= h.capitalize(name) %>Response, response);
  }

  async deleteOneByUuid(
    param: DeleteOne<%= h.capitalize(name) %>Param,
  ): Promise<DeleteOne<%= h.capitalize(name) %>Response> {
    const { uuid } = param;
    const data = await this.<%= name %>Model.deleteOneByUuid(uuid);
    if (!_.isEmpty(_.get(data, 'value', ''))) {
      data.value.id = data.value._id;
      delete data.value._id;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'bad uuid at /<%= name %>s/updateOneByUuid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response: DeleteOne<%= h.capitalize(name) %>Response = {
      metadata: {
        delete: true,
        source: 'database',
      },
      data: data?.value,
    };
    return plainToInstance(DeleteOne<%= h.capitalize(name) %>Response, response);
  }

  async search(body: Search<%= h.capitalize(name) %>sBody): Promise<Search<%= h.capitalize(name) %>sResponse> {
    const { filter, sort, paginate } = body;
    const data = await this.elaService.search({ filter, sort, paginate });
    const response: Search<%= h.capitalize(name) %>sResponse = {
      metadata: {
        ...data.metadata,
        source: 'elasticsearch',
      },
      data: data.data,
    };
    return response;
  }
}
