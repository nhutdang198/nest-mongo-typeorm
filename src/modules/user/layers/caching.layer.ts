import { Inject, Injectable } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import {
  CreateManyUsersBody,
  CreateManyUsersResponse,
  DeleteOneUserParam,
  DeleteOneUserResponse,
  UpdateOneUserBody,
  UpdateOneUserParam,
  UpdateOneUserResponse,
  GetManyUsersByIdEntity,
  GetManyUsersByIdQuery,
  GetManyUsersByIdResponse,
  SearchUsersBody,
  SearchUsersResponse,
} from '../dtos/service';
import { RedisClientType } from 'redis';
import * as _ from 'lodash';
import { UserSyncLayer } from './sync.layer';

@Injectable()
export class UserCachingLayer extends ServiceAbstract {
  constructor(
    private userSyncLayer: UserSyncLayer,
    @Inject('X_REDIS_CLIENT') private xredisService: RedisClientType,
  ) {
    super();
  }

  async createMany(
    body: CreateManyUsersBody,
  ): Promise<CreateManyUsersResponse> {
    return await this.userSyncLayer.createMany(body);
  }

  async getManyByUuid(
    query: GetManyUsersByIdQuery,
  ): Promise<GetManyUsersByIdResponse> {
    const { uuid: uuids } = query;
    let cloneIdList = _.cloneDeep(uuids);
    const cachedData = await this.xredisService.mGet(
      _.map(uuids, (uuid) => `Metadata:Users:${_.toLower(_.trim(uuid))}`),
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
        data: cleanData as unknown as GetManyUsersByIdEntity[],
      };
    }

    const { metadata, data } = await this.userSyncLayer.getManyByUuid({
      uuid: cloneIdList,
    });

    for (const user of data) {
      await this.xredisService.set(
        `Metadata:Users:${user.uuid}`,
        JSON.stringify(user),
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
      data: data.concat(cleanData as unknown as GetManyUsersByIdEntity[]),
    };
  }

  async updateOneByUuid(
    param: UpdateOneUserParam,
    body: UpdateOneUserBody,
  ): Promise<UpdateOneUserResponse> {
    const { uuid } = param;
    const response = await this.userSyncLayer.updateOneByUuid(param, body);
    await this.xredisService.set(
      `Metadata:Users:${uuid}`,
      JSON.stringify(response.data),
      {
        EX: 86400,
      },
    );
    response.metadata.source = response.metadata.source + ' + redis';
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOneUserParam,
  ): Promise<DeleteOneUserResponse> {
    const { uuid } = param;
    const response = await this.userSyncLayer.deleteOneByUuid(param);
    await this.xredisService.del(`Metadata:Users:${_.toLower(_.trim(uuid))}`);
    response.metadata.source = response.metadata.source + ' + redis';
    return response;
  }

  async search(body: SearchUsersBody): Promise<SearchUsersResponse> {
    return await this.userSyncLayer.search(body);
  }
}
