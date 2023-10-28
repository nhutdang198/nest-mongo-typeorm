import {
  GetManyUsersByUuidArguments,
  GetManyUsersByUuidResult,
  SearchUsersArguments,
  SearchUsersResult,
} from 'src/modules/user/dtos/elasticsearch';

export abstract class ElasticsearchAbstract {
  abstract search(args: SearchUsersArguments): Promise<SearchUsersResult>;
  abstract getManyByUuid(
    args: GetManyUsersByUuidArguments,
  ): Promise<GetManyUsersByUuidResult>;
}
