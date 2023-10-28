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
import { UserEntity } from '../../entities';

@Exclude()
export class CreateOneUserEntity {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, {
    message: 'First name must be shorter than or equal to 50 characters',
  })
  @Expose()
  firstName?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, {
    message: 'Last name must be shorter than or equal to 50 characters',
  })
  @Expose()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(20, {
    message: 'Username must be shorter than or equal to 20 characters',
  })
  @Expose()
  username?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, {
    message: 'Password must be shorter than or equal to 100 characters',
  })
  @Expose()
  password?: string;
}

@Exclude()
export class CreateManyUsersBody {
  @ApiProperty({ required: true, type: [CreateOneUserEntity] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOneUserEntity)
  @Expose()
  users: CreateOneUserEntity[];
}

@Exclude()
class CreateUserMetadata {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class CreateManyUsersResponse {
  @Expose()
  @ApiProperty()
  metadata: CreateUserMetadata;

  @ApiProperty({ type: [UserEntity] })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserEntity)
  data: Array<UserEntity>;
}
