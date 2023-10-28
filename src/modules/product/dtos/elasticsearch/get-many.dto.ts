import { ProductEntity } from 'src/modules/product/entities';

export class GetManyProductsByUuidArguments {
  uuid: string[];
}

export class GetManyProductsByUuidResult {
  metadata: { total: number };
  data: ProductEntity[];
}
