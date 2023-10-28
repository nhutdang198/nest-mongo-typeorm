---
to: src/modules/<%= name %>/dtos/service/create-many.dto.ts
---
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { <%= h.capitalize(name) %>Entity } from '@/modules/<%= name %>/entities';

@Exclude()
export class CreateOne<%= h.capitalize(name) %>Entity {}

@Exclude()
export class CreateMany<%= h.capitalize(name) %>sBody {
  @ApiProperty({ required: true, type: [CreateOne<%= h.capitalize(name) %>Entity] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOne<%= h.capitalize(name) %>Entity)
  @Expose()
  <%= name %>s: CreateOne<%= h.capitalize(name) %>Entity[];
}

@Exclude()
class Create<%= h.capitalize(name) %>Metadata {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class CreateMany<%= h.capitalize(name) %>sResponse {
  @Expose()
  @ApiProperty()
  metadata: Create<%= h.capitalize(name) %>Metadata;

  @ApiProperty({ type: [<%= h.capitalize(name) %>Entity] })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => <%= h.capitalize(name) %>Entity)
  data: Array<<%= h.capitalize(name) %>Entity>;
}
