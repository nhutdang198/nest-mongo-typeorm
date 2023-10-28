---
to: src/modules/<%= name %>/dtos/service/get-many-by-id.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';
import * as _ from 'lodash';

export class GetMany<%= h.capitalize(name) %>sByIdQuery {
  @ApiProperty()
  @IsString({ each: true })
  @Transform(({ value }) =>
    _.isArray(value)
      ? _.filter(value, (x) => x)
      : _.filter(Array(value), (z) => z),
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  uuid: string[];
}

@Exclude()
export class GetMany<%= h.capitalize(name) %>sByIdMetadata {
  @Expose()
  @ApiProperty()
  total: number;

  @Expose()
  @ApiProperty()
  notFounds: string[];

  @Expose()
  @ApiProperty()
  source: string;
}

@Exclude()
export class GetMany<%= h.capitalize(name) %>sByIdEntity {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  uuid: string;
}

@Exclude()
export class GetMany<%= h.capitalize(name) %>sByIdResponse {
  @ApiProperty({ type: GetMany<%= h.capitalize(name) %>sByIdMetadata })
  @Expose()
  metadata: GetMany<%= h.capitalize(name) %>sByIdMetadata;

  @ApiProperty({ type: [GetMany<%= h.capitalize(name) %>sByIdEntity] })
  @Expose()
  data: GetMany<%= h.capitalize(name) %>sByIdEntity[];
}
