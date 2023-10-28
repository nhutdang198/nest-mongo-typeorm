import { Injectable } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
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
import { ProductLoggingLayer } from './logging.layer';

@Injectable()
export class ProductOutLayer extends ServiceAbstract {
  constructor(private productLoggingLayer: ProductLoggingLayer) {
    super();
  }

  async createMany(
    body: CreateManyProductsBody,
  ): Promise<CreateManyProductsResponse> {
    return await this.productLoggingLayer.createMany(body);
  }

  async getManyByUuid(
    query: GetManyProductsByIdQuery,
  ): Promise<GetManyProductsByIdResponse> {
    return await this.productLoggingLayer.getManyByUuid(query);
  }

  async updateOneByUuid(
    param: UpdateOneProductParam,
    body: UpdateOneProductBody,
  ): Promise<UpdateOneProductResponse> {
    return await this.productLoggingLayer.updateOneByUuid(param, body);
  }

  async deleteOneByUuid(
    param: DeleteOneProductParam,
  ): Promise<DeleteOneProductResponse> {
    return await this.productLoggingLayer.deleteOneByUuid(param);
  }

  async search(body: SearchProductsBody): Promise<SearchProductsResponse> {
    return await this.productLoggingLayer.search(body);
  }
}
