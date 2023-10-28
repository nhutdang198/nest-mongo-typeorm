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
} from 'src/modules/user/dtos/service';

export abstract class ControllerAbstract {
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
}
