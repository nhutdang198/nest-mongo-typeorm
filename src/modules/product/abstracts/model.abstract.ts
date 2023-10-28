import { Document } from 'typeorm';
import {
  CreateOneProductEntity,
  UpdateOneProductBody,
} from '@/modules/product/dtos/service';
import { ProductEntity } from '@/modules/product/entities';

export abstract class ModelAbstract {
  abstract createMany(
    body: Array<CreateOneProductEntity>,
  ): Promise<Array<ProductEntity>>;
  abstract getManyByUuid(query: Array<string>): Promise<Array<ProductEntity>>;
  abstract updateOneByUuid(
    uuid: string,
    body: UpdateOneProductBody,
  ): Promise<Document>;
  abstract deleteOneByUuid(id: string): Promise<Document>;
}
