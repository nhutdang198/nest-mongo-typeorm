import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UserEntity } from 'src/modules/user/entities';

@Exclude()
export class SearchUsersFilter {
  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsString()
  keyword: string;
}

export class SearchUsersPaginate {
  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @Min(1)
  @Max(1024)
  size: number;
}

@Exclude()
export class SearchUsersSort {
  @ApiProperty()
  @Expose()
  @IsIn(['asc', 'desc'])
  createdAt: string;
}

@Exclude()
export class SearchUsersBody {
  @ApiProperty()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => SearchUsersFilter)
  @IsNotEmpty()
  filter: SearchUsersFilter;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SearchUsersPaginate)
  paginate: SearchUsersPaginate;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SearchUsersSort)
  sort: SearchUsersSort;
}

@Exclude()
export class SearchUsersMetadata {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  source: string;

  @ApiProperty()
  @Expose()
  filter: SearchUsersFilter;

  @ApiProperty()
  @Expose()
  paginate: SearchUsersPaginate;

  @ApiProperty()
  @Expose()
  sort: SearchUsersSort;
}

@Exclude()
export class SearchUsersResponse {
  @ApiProperty({ type: SearchUsersMetadata })
  @Expose()
  metadata: SearchUsersMetadata;

  @ApiProperty({ type: [UserEntity] })
  @Expose()
  data: UserEntity[];
}
