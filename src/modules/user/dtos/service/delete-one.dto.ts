import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { UserEntity } from '@/modules/user/entities';

@Exclude()
export class DeleteOneUserParam {
  @ApiProperty()
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}

@Exclude()
export class DeleteOneUserMetadata {
  @ApiProperty()
  @Expose()
  delete: boolean;

  @ApiProperty()
  @Expose()
  source: string;
}

@Exclude()
export class DeleteOneUserResponse {
  @ApiProperty()
  @Expose()
  metadata: DeleteOneUserMetadata;

  @ApiProperty({ type: UserEntity })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UserEntity)
  data: UserEntity;
}
