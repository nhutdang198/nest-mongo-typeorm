import { UserEntity } from 'src/modules/user/entities';

export class SearchUsersFilter {
  keyword: string;
}

export class SearchUsersPaginate {
  page: number;
  size: number;
}

export class SearchUsersSort {
  createdAt: string = 'desc' || 'asc';
}

export class SearchUsersArguments {
  filter: SearchUsersFilter;
  paginate: SearchUsersPaginate;
  sort: SearchUsersSort;
}

export class SearchUsersMetadata {
  total: number;
  filter: SearchUsersFilter;
  paginate: {
    page: number;
    size: number;
    lastPage: number;
  };
  sort: SearchUsersSort;
}

export class SearchUsersResult {
  metadata: SearchUsersMetadata;
  data: UserEntity[];
}
