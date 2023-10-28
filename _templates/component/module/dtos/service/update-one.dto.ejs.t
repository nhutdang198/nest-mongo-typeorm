---
to: src/modules/<%= name %>/dtos/service/update-one.dto.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { <%= h.capitalize(name) %>Entity } from '@/modules/<%= name %>/entities';

@Exclude()
export class UpdateOne<%= h.capitalize(name) %>Param {
  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}

@Exclude()
export class UpdateOne<%= h.capitalize(name) %>Body {
  @ApiProperty()
  @Expose()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, {
    message: 'First name must be shorter than or equal to 50 characters',
  })
  firstName: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, {
    message: 'Last name must be shorter than or equal to 50 characters',
  })
  lastName: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, {
    message: 'Password must be shorter than or equal to 100 characters',
  })
  password: string;
}

@Exclude()
export class UpdateOne<%= h.capitalize(name) %>Entity {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  @ApiProperty()
  @Expose()
  id: string;
}

@Exclude()
export class UpdateOne<%= h.capitalize(name) %>Metadata {
  @ApiProperty()
  @Expose()
  update: boolean;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class UpdateOne<%= h.capitalize(name) %>Response {
  @ApiProperty()
  @Expose()
  metadata: UpdateOne<%= h.capitalize(name) %>Metadata;

  @ApiProperty({ type: <%= h.capitalize(name) %>Entity })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => <%= h.capitalize(name) %>Entity)
  data: <%= h.capitalize(name) %>Entity;
}
