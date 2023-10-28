import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductEntity } from '@/modules/product/entities';

@Exclude()
export class SearchProductsFilter {
  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsString()
  keyword: string;
}

export class SearchProductsPaginate {
  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(1)
  @Max(1024)
  size: number;
}

@Exclude()
export class SearchProductsSort {
  @ApiProperty()
  @Expose()
  @IsIn(['asc', 'desc'])
  createdAt: string;
}

@Exclude()
export class SearchProductsBody {
  @ApiProperty()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => SearchProductsFilter)
  @IsNotEmpty()
  filter: SearchProductsFilter;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SearchProductsPaginate)
  paginate: SearchProductsPaginate;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SearchProductsSort)
  sort: SearchProductsSort;
}

@Exclude()
export class SearchProductsMetadata {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  source: string;

  @ApiProperty()
  @Expose()
  filter: SearchProductsFilter;

  @ApiProperty()
  @Expose()
  paginate: SearchProductsPaginate;

  @ApiProperty()
  @Expose()
  sort: SearchProductsSort;
}

@Exclude()
export class SearchProductsResponse {
  @ApiProperty({ type: SearchProductsMetadata })
  @Expose()
  metadata: SearchProductsMetadata;

  @ApiProperty({ type: [ProductEntity] })
  @Expose()
  data: ProductEntity[];
}
