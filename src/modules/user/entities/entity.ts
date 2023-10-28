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

@Entity({ name: 'users' })
export class UserEntity extends TimeBaseEntity {
  @ObjectIdColumn()
  @ApiProperty()
  id: string;

  @Column()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, {
    message: 'First name must be shorter than or equal to 50 characters',
  })
  @ApiProperty()
  firstName: string;

  @Column()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, {
    message: 'Last name must be shorter than or equal to 50 characters',
  })
  @ApiProperty()
  lastName: string;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(20, {
    message: 'Username must be shorter than or equal to 20 characters',
  })
  @ApiProperty()
  username: string;

  @Column()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, {
    message: 'Password must be shorter than or equal to 100 characters',
  })
  @ApiProperty()
  password: string;

  @Column()
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  uuid: string;
}
