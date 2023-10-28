import { Injectable, Logger } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import { ProductCachingLayer } from './caching.layer';
import {
  CreateManyProductsBody,
  CreateManyProductsResponse,
  DeleteOneProductParam,
  DeleteOneProductResponse,
  UpdateOneProductBody,
  UpdateOneProductParam,
  UpdateOneProductResponse,
  GetManyProductsByIdQuery,
  GetManyProductsByIdResponse,
  SearchProductsBody,
  SearchProductsResponse,
} from '../dtos/service';

@Injectable()
export class ProductLoggingLayer extends ServiceAbstract {
  private readonly logger = new Logger(ProductLoggingLayer.name);

  constructor(private productCachingLayer: ProductCachingLayer) {
    super();
  }

  async createMany(
    body: CreateManyProductsBody,
  ): Promise<CreateManyProductsResponse> {
    const response = await this.productCachingLayer.createMany(body);
    this.logger.debug(JSON.stringify(body));
    this.logger.verbose(response.data.length + ' product are created');
    return response;
  }

  async getManyByUuid(
    query: GetManyProductsByIdQuery,
  ): Promise<GetManyProductsByIdResponse> {
    const response = await this.productCachingLayer.getManyByUuid(query);
    this.logger.debug(JSON.stringify(query));
    this.logger.verbose(response.metadata.total + ' product are gotten');
    return response;
  }

  async updateOneByUuid(
    param: UpdateOneProductParam,
    body: UpdateOneProductBody,
  ): Promise<UpdateOneProductResponse> {
    const response = await this.productCachingLayer.updateOneByUuid(
      param,
      body,
    );
    this.logger.debug('param ' + JSON.stringify(param));
    this.logger.debug('body: ' + JSON.stringify(body));
    this.logger.verbose('product ' + response.data.uuid + ' are updated');
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOneProductParam,
  ): Promise<DeleteOneProductResponse> {
    const response = await this.productCachingLayer.deleteOneByUuid(param);
    this.logger.debug('param ' + JSON.stringify(param));
    this.logger.verbose('product ' + response.data.uuid + ' are deleted');
    return response;
  }

  async search(body: SearchProductsBody): Promise<SearchProductsResponse> {
    const response = await this.productCachingLayer.search(body);
    this.logger.debug('body ' + JSON.stringify(body));
    this.logger.verbose('product ' + response.metadata.total + ' are gotten');
    return response;
  }
}
