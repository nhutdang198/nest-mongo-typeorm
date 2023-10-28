import { Inject, Injectable } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import {
  CreateManyProductsBody,
  CreateManyProductsResponse,
  DeleteOneProductParam,
  DeleteOneProductResponse,
  UpdateOneProductBody,
  UpdateOneProductParam,
  UpdateOneProductResponse,
  GetManyProductsByIdEntity,
  GetManyProductsByIdQuery,
  GetManyProductsByIdResponse,
  SearchProductsBody,
  SearchProductsResponse,
} from '../dtos/service';
import { RedisClientType } from 'redis';
import * as _ from 'lodash';
import { ProductSyncLayer } from './sync.layer';

@Injectable()
export class ProductCachingLayer extends ServiceAbstract {
  constructor(
    private productSyncLayer: ProductSyncLayer,
    @Inject('X_REDIS_CLIENT') private xredisService: RedisClientType,
  ) {
    super();
  }

  async createMany(
    body: CreateManyProductsBody,
  ): Promise<CreateManyProductsResponse> {
    return await this.productSyncLayer.createMany(body);
  }

  async getManyByUuid(
    query: GetManyProductsByIdQuery,
  ): Promise<GetManyProductsByIdResponse> {
    const { uuid: uuids } = query;
    let cloneIdList = _.cloneDeep(uuids);
    const cachedData = await this.xredisService.mGet(
      _.map(uuids, (uuid) => `Metadata:Products:${_.toLower(_.trim(uuid))}`),
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
        data: cleanData as unknown as GetManyProductsByIdEntity[],
      };
    }

    const { metadata, data } = await this.productSyncLayer.getManyByUuid({
      uuid: cloneIdList,
    });

    for (const product of data) {
      await this.xredisService.set(
        `Metadata:Products:${product.uuid}`,
        JSON.stringify(product),
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
      data: data.concat(cleanData as unknown as GetManyProductsByIdEntity[]),
    };
  }

  async updateOneByUuid(
    param: UpdateOneProductParam,
    body: UpdateOneProductBody,
  ): Promise<UpdateOneProductResponse> {
    const { uuid } = param;
    const response = await this.productSyncLayer.updateOneByUuid(param, body);
    await this.xredisService.set(
      `Metadata:Products:${uuid}`,
      JSON.stringify(response.data),
      {
        EX: 86400,
      },
    );
    response.metadata.source = response.metadata.source + ' + redis';
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOneProductParam,
  ): Promise<DeleteOneProductResponse> {
    const { uuid } = param;
    const response = await this.productSyncLayer.deleteOneByUuid(param);
    await this.xredisService.del(
      `Metadata:Products:${_.toLower(_.trim(uuid))}`,
    );
    response.metadata.source = response.metadata.source + ' + redis';
    return response;
  }

  async search(body: SearchProductsBody): Promise<SearchProductsResponse> {
    return await this.productSyncLayer.search(body);
  }
}
