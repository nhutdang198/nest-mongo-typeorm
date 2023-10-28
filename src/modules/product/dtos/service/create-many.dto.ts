import {
  ArrayNotEmpty,
  IsArray,
  // IsNotEmpty,
  // IsString,
  // MaxLength,
  // MinLength,
  ValidateNested,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '@/modules/product/entities';

@Exclude()
export class CreateOneProductEntity {}

@Exclude()
export class CreateManyProductsBody {
  @ApiProperty({ required: true, type: [CreateOneProductEntity] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOneProductEntity)
  @Expose()
  products: CreateOneProductEntity[];
}

@Exclude()
class CreateProductMetadata {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class CreateManyProductsResponse {
  @Expose()
  @ApiProperty()
  metadata: CreateProductMetadata;

  @ApiProperty({ type: [ProductEntity] })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ProductEntity)
  data: Array<ProductEntity>;
}
