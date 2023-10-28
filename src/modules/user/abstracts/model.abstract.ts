import { Document } from 'typeorm';
import {
  CreateOneUserEntity,
  UpdateOneUserBody,
} from 'src/modules/user/dtos/service';
import { UserEntity } from 'src/modules/user/entities';

export abstract class ModelAbstract {
  abstract createMany(
    body: Array<CreateOneUserEntity>,
  ): Promise<Array<UserEntity>>;
  abstract getManyByUuid(query: Array<string>): Promise<Array<UserEntity>>;
  abstract updateOneByUuid(
    uuid: string,
    body: UpdateOneUserBody,
  ): Promise<Document>;
  abstract deleteOneByUuid(id: string): Promise<Document>;
}
