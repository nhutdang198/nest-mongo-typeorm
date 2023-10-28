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
} from '@/modules/product/dtos/service';

export abstract class ControllerAbstract {
  abstract createMany(
    body: CreateManyProductsBody,
  ): Promise<CreateManyProductsResponse>;

  abstract getManyByUuid(
    query: GetManyProductsByIdQuery,
  ): Promise<GetManyProductsByIdResponse>;

  abstract updateOneByUuid(
    param: UpdateOneProductParam,
    body: UpdateOneProductBody,
  ): Promise<UpdateOneProductResponse>;

  abstract deleteOneByUuid(
    param: DeleteOneProductParam,
  ): Promise<DeleteOneProductResponse>;
}
