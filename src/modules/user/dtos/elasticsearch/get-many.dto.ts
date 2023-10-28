import { UserEntity } from 'src/modules/user/entities';

export class GetManyUsersByUuidArguments {
  uuid: string[];
}

export class GetManyUsersByUuidResult {
  metadata: { total: number };
  data: UserEntity[];
}
