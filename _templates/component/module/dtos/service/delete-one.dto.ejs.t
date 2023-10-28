---
to: src/modules/<%= name %>/dtos/service/delete-one.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { <%= h.capitalize(name) %>Entity } from '@/modules/<%= name %>/entities';

@Exclude()
export class DeleteOne<%= h.capitalize(name) %>Param {
  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}

@Exclude()
export class DeleteOne<%= h.capitalize(name) %>Metadata {
  @ApiProperty()
  @Expose()
  delete: boolean;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class DeleteOne<%= h.capitalize(name) %>Response {
  @ApiProperty()
  @Expose()
  metadata: DeleteOne<%= h.capitalize(name) %>Metadata;

  @ApiProperty({ type: <%= h.capitalize(name) %>Entity })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => <%= h.capitalize(name) %>Entity)
  data: <%= h.capitalize(name) %>Entity;
}
