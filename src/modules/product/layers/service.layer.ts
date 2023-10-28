import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductElasticsearchService, ProductModel } from '../models';
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
} from 'src/modules/product/dtos/service';
import { plainToInstance } from 'class-transformer';
import { toLower, trim } from 'lodash';
import { ProductEntity } from '../entities';
import * as _ from 'lodash';

@Injectable()
export class ProductService extends ServiceAbstract {
  constructor(
    private productModel: ProductModel,
    private elaService: ProductElasticsearchService,
  ) {
    super();
  }

  async createMany(
    body: CreateManyProductsBody,
  ): Promise<CreateManyProductsResponse> {
    const { products } = body;
    const data = await this.productModel.createMany(
      products as ProductEntity[],
    );
    const response: CreateManyProductsResponse = {
      metadata: {
        total: data.length,
        source: 'database',
      },
      data,
    };
    return plainToInstance(CreateManyProductsResponse, response);
  }

  async getManyByUuid(
    query: GetManyProductsByIdQuery,
  ): Promise<GetManyProductsByIdResponse> {
    const { uuid: uuids } = query;
    const uuidMap = {};
    uuids.forEach((rawUuid) => {
      const oneUuid = toLower(trim(rawUuid));
      uuidMap[oneUuid] = rawUuid;
    });
    const { metadata, data: products } = await this.elaService.getManyByUuid({
      uuid: Object.keys(uuidMap),
    });
    products.forEach((product) => {
      const cleanUuid = toLower(trim(product.uuid));
      product.uuid = uuidMap[cleanUuid];
      delete uuidMap[cleanUuid];
    });
    const notFounds = Object.keys(uuidMap).map((uuid) => uuidMap[uuid]);
    const response = {
      metadata: {
        total: metadata.total,
        notFounds,
        source: 'elasticsearch',
      },
      data: products,
    };
    return plainToInstance(GetManyProductsByIdResponse, response);
  }

  async updateOneByUuid(
    param: UpdateOneProductParam,
    body: UpdateOneProductBody,
  ): Promise<UpdateOneProductResponse> {
    const { uuid } = param;
    const data = await this.productModel.updateOneByUuid(uuid, body);
    if (!_.isEmpty(_.get(data, 'value', ''))) {
      data.value.id = data.value._id;
      delete data.value._id;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'bad uuid at /products/updateOneByUuid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response: UpdateOneProductResponse = {
      metadata: {
        update: true,
        source: 'database',
      },
      data: data?.value,
    };
    return plainToInstance(UpdateOneProductResponse, response);
  }

  async deleteOneByUuid(
    param: DeleteOneProductParam,
  ): Promise<DeleteOneProductResponse> {
    const { uuid } = param;
    const data = await this.productModel.deleteOneByUuid(uuid);
    if (!_.isEmpty(_.get(data, 'value', ''))) {
      data.value.id = data.value._id;
      delete data.value._id;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'bad uuid at /products/updateOneByUuid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response: DeleteOneProductResponse = {
      metadata: {
        delete: true,
        source: 'database',
      },
      data: data?.value,
    };
    return plainToInstance(DeleteOneProductResponse, response);
  }

  async search(body: SearchProductsBody): Promise<SearchProductsResponse> {
    const { filter, sort, paginate } = body;
    const data = await this.elaService.search({ filter, sort, paginate });
    const response: SearchProductsResponse = {
      metadata: {
        ...data.metadata,
        source: 'elasticsearch',
      },
      data: data.data,
    };
    return response;
  }
}
