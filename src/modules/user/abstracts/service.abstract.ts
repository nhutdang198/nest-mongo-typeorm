import {
  CreateManyUsersBody,
  CreateManyUsersResponse,
  DeleteOneUserParam,
  DeleteOneUserResponse,
  UpdateOneUserBody,
  UpdateOneUserParam,
  UpdateOneUserResponse,
  GetManyUsersByIdQuery,
  GetManyUsersByIdResponse,
  SearchUsersBody,
  SearchUsersResponse,
} from 'src/modules/user/dtos/service';

export abstract class ServiceAbstract {
  abstract createMany(
    body: CreateManyUsersBody,
  ): Promise<CreateManyUsersResponse>;

  abstract getManyByUuid(
    query: GetManyUsersByIdQuery,
  ): Promise<GetManyUsersByIdResponse>;

  abstract updateOneByUuid(
    param: UpdateOneUserParam,
    body: UpdateOneUserBody,
  ): Promise<UpdateOneUserResponse>;

  abstract deleteOneByUuid(
    param: DeleteOneUserParam,
  ): Promise<DeleteOneUserResponse>;

  abstract search(body: SearchUsersBody): Promise<SearchUsersResponse>;
}
