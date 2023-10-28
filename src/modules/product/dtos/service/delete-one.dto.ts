import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { ProductEntity } from '@/modules/product/entities';

@Exclude()
export class DeleteOneProductParam {
  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}

@Exclude()
export class DeleteOneProductMetadata {
  @ApiProperty()
  @Expose()
  delete: boolean;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class DeleteOneProductResponse {
  @ApiProperty()
  @Expose()
  metadata: DeleteOneProductMetadata;

  @ApiProperty({ type: ProductEntity })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ProductEntity)
  data: ProductEntity;
}
