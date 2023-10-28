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
import { UserEntity } from '../../entities';

@Exclude()
export class UpdateOneUserParam {
  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}

@Exclude()
export class UpdateOneUserBody {
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
export class UpdateOneUserEntity {
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
export class UpdateOneUserMetadata {
  @ApiProperty()
  @Expose()
  update: boolean;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class UpdateOneUserResponse {
  @ApiProperty()
  @Expose()
  metadata: UpdateOneUserMetadata;

  @ApiProperty({ type: UserEntity })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserEntity)
  data: UserEntity;
}
