---
to: src/modules/<%= name %>/dtos/service/search.dto.ts
---
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
import { <%= h.capitalize(name) %>Entity } from '@/modules/<%= name %>/entities';

@Exclude()
export class Search<%= h.capitalize(name) %>sFilter {
  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsString()
  keyword: string;
}

export class Search<%= h.capitalize(name) %>sPaginate {
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
export class Search<%= h.capitalize(name) %>sSort {
  @ApiProperty()
  @Expose()
  @IsIn(['asc', 'desc'])
  createdAt: string;
}

@Exclude()
export class Search<%= h.capitalize(name) %>sBody {
  @ApiProperty()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Search<%= h.capitalize(name) %>sFilter)
  @IsNotEmpty()
  filter: Search<%= h.capitalize(name) %>sFilter;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Search<%= h.capitalize(name) %>sPaginate)
  paginate: Search<%= h.capitalize(name) %>sPaginate;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Search<%= h.capitalize(name) %>sSort)
  sort: Search<%= h.capitalize(name) %>sSort;
}

@Exclude()
export class Search<%= h.capitalize(name) %>sMetadata {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  source: string;

  @ApiProperty()
  @Expose()
  filter: Search<%= h.capitalize(name) %>sFilter;

  @ApiProperty()
  @Expose()
  paginate: Search<%= h.capitalize(name) %>sPaginate;

  @ApiProperty()
  @Expose()
  sort: Search<%= h.capitalize(name) %>sSort;
}

@Exclude()
export class Search<%= h.capitalize(name) %>sResponse {
  @ApiProperty({ type: Search<%= h.capitalize(name) %>sMetadata })
  @Expose()
  metadata: Search<%= h.capitalize(name) %>sMetadata;

  @ApiProperty({ type: [<%= h.capitalize(name) %>Entity] })
  @Expose()
  data: <%= h.capitalize(name) %>Entity[];
}
