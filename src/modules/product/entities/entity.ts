import { Entity, Column, ObjectIdColumn } from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  // MinLength,
  // MaxLength,
  IsUUID,
} from 'class-validator';
import { TimeBaseEntity } from 'src/common/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class ProductEntity extends TimeBaseEntity {
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
