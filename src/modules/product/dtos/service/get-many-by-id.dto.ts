import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';
import * as _ from 'lodash';

export class GetManyProductsByIdQuery {
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
export class GetManyProductsByIdMetadata {
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
export class GetManyProductsByIdEntity {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  uuid: string;
}

@Exclude()
export class GetManyProductsByIdResponse {
  @ApiProperty({ type: GetManyProductsByIdMetadata })
  @Expose()
  metadata: GetManyProductsByIdMetadata;

  @ApiProperty({ type: [GetManyProductsByIdEntity] })
  @Expose()
  data: GetManyProductsByIdEntity[];
}
