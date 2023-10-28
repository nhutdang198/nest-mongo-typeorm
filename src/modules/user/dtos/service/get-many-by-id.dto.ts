import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';
import * as _ from 'lodash';

export class GetManyUsersByIdQuery {
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
export class GetManyUsersByIdMetadata {
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
export class GetManyUsersByIdEntity {
  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  password: string;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;

  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  uuid: string;

  @Expose()
  removeAt: string;
}

@Exclude()
export class GetManyUsersByIdResponse {
  @ApiProperty({ type: GetManyUsersByIdMetadata })
  @Expose()
  metadata: GetManyUsersByIdMetadata;

  @ApiProperty({ type: [GetManyUsersByIdEntity] })
  @Expose()
  data: GetManyUsersByIdEntity[];
}
