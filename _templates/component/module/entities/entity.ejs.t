---
to: src/modules/<%= name %>/entities/entity.ts
---
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { TimeBaseEntity } from 'src/common/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: '<%= name %>s' })
export class <%= h.capitalize(name) %>Entity extends TimeBaseEntity {
  @ObjectIdColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  uuid: string;
}
