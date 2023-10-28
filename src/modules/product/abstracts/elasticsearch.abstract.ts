import {
  GetManyProductsByUuidArguments,
  GetManyProductsByUuidResult,
  SearchProductsArguments,
  SearchProductsResult,
} from '@/modules/product/dtos/elasticsearch';

export abstract class ElasticsearchAbstract {
  abstract search(args: SearchProductsArguments): Promise<SearchProductsResult>;
  abstract getManyByUuid(
    args: GetManyProductsByUuidArguments,
  ): Promise<GetManyProductsByUuidResult>;
}
