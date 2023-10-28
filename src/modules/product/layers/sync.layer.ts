import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ServiceAbstract } from '../abstracts/service.abstract';
import { ProductService } from './service.layer';
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
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductSyncLayer extends ServiceAbstract implements OnModuleInit {
  private readonly logger = new Logger(ProductSyncLayer.name);

  async onModuleInit() {
    const exist = await this.elaService.indices.exists({
      index: this.configService.get<string>('ELA_METADATA_PRODUCT_INDEX'),
    });
    if (!exist) {
      await this.elaService.indices.create({
        index: this.configService.get<string>('ELA_METADATA_PRODUCT_INDEX'),
      });
    }
  }

  constructor(
    private productService: ProductService,
    private readonly elaService: ElasticsearchService,
    private configService: ConfigService,
  ) {
    super();
  }

  async createMany(
    body: CreateManyProductsBody,
  ): Promise<CreateManyProductsResponse> {
    const response = await this.productService.createMany(body);
    for (const product of response.data) {
      await this.elaService
        .index({
          index: this.configService.get<string>('ELA_METADATA_Product_INDEX'),
          id: product.uuid,
          document: product,
        })
        .finally(() => {
          this.logger.log(
            `[create] sync product ${product.uuid} to elasticsearch`,
          );
        });
    }
    return response;
  }

  async getManyByUuid(
    query: GetManyProductsByIdQuery,
  ): Promise<GetManyProductsByIdResponse> {
    return await this.productService.getManyByUuid(query);
  }

  async updateOneByUuid(
    param: UpdateOneProductParam,
    body: UpdateOneProductBody,
  ): Promise<UpdateOneProductResponse> {
    const { uuid } = param;
    const response = await this.productService.updateOneByUuid(param, body);
    await this.elaService
      .index({
        index: this.configService.get<string>('ELA_METADATA_Product_INDEX'),
        id: uuid,
        document: response.data,
      })
      .finally(() => {
        this.logger.verbose(
          `[update] sync updated product ${uuid} to elasticsearch`,
        );
      });
    response.metadata.source = response.metadata.source + ' + elasticsearch';
    return response;
  }

  async deleteOneByUuid(
    param: DeleteOneProductParam,
  ): Promise<DeleteOneProductResponse> {
    const { uuid } = param;
    const response = await this.productService.deleteOneByUuid(param);
    await this.elaService
      .delete({
        index: this.configService.get<string>('ELA_METADATA_Product_INDEX'),
        id: uuid,
      })
      .finally(() => {
        this.logger.verbose(
          `[delete] delete product ${uuid} from elasticsearch`,
        );
      });
    response.metadata.source = response.metadata.source + ' + elasticsearch';
    return response;
  }

  async search(body: SearchProductsBody): Promise<SearchProductsResponse> {
    return await this.productService.search(body);
  }
}
