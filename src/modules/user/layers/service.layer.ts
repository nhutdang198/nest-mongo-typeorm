import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserElasticsearchService, UserModel } from '../models';
import { ServiceAbstract } from '../abstracts/service.abstract';
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
import { plainToInstance } from 'class-transformer';
import { toLower, trim } from 'lodash';
import { UserEntity } from '../entities';
import * as _ from 'lodash';

@Injectable()
export class UserService extends ServiceAbstract {
  constructor(
    private userModel: UserModel,
    private elaService: UserElasticsearchService,
  ) {
    super();
  }

  async createMany(
    body: CreateManyUsersBody,
  ): Promise<CreateManyUsersResponse> {
    const { users } = body;
    const data = await this.userModel.createMany(users as UserEntity[]);
    const response: CreateManyUsersResponse = {
      metadata: {
        total: data.length,
        source: 'database',
      },
      data,
    };
    return plainToInstance(CreateManyUsersResponse, response);
  }

  async getManyByUuid(
    query: GetManyUsersByIdQuery,
  ): Promise<GetManyUsersByIdResponse> {
    const { uuid: uuids } = query;
    const uuidMap = {};
    uuids.forEach((rawUuid) => {
      const oneUuid = toLower(trim(rawUuid));
      uuidMap[oneUuid] = rawUuid;
    });
    const { metadata, data: users } = await this.elaService.getManyByUuid({
      uuid: Object.keys(uuidMap),
    });
    users.forEach((user) => {
      const cleanUuid = toLower(trim(user.uuid));
      user.uuid = uuidMap[cleanUuid];
      delete uuidMap[cleanUuid];
    });
    const notFounds = Object.keys(uuidMap).map((uuid) => uuidMap[uuid]);
    const response = {
      metadata: {
        total: metadata.total,
        notFounds,
        source: 'elasticsearch',
      },
      data: users,
    };
    return plainToInstance(GetManyUsersByIdResponse, response);
  }

  async updateOneByUuid(
    param: UpdateOneUserParam,
    body: UpdateOneUserBody,
  ): Promise<UpdateOneUserResponse> {
    const { uuid } = param;
    const data = await this.userModel.updateOneByUuid(uuid, body);
    if (!_.isEmpty(_.get(data, 'value', ''))) {
      data.value.id = data.value._id;
      delete data.value._id;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'bad uuid at /users/updateOneByUuid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response: UpdateOneUserResponse = {
      metadata: {
        update: true,
        source: 'database',
      },
      data: data?.value,
    };
    return plainToInstance(UpdateOneUserResponse, response);
  }

  async deleteOneByUuid(
    param: DeleteOneUserParam,
  ): Promise<DeleteOneUserResponse> {
    const { uuid } = param;
    const data = await this.userModel.deleteOneByUuid(uuid);
    if (!_.isEmpty(_.get(data, 'value', ''))) {
      data.value.id = data.value._id;
      delete data.value._id;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'bad uuid at /users/updateOneByUuid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response: DeleteOneUserResponse = {
      metadata: {
        delete: true,
        source: 'database',
      },
      data: data?.value,
    };
    return plainToInstance(DeleteOneUserResponse, response);
  }

  async search(body: SearchUsersBody): Promise<SearchUsersResponse> {
    const { filter, sort, paginate } = body;
    const data = await this.elaService.search({ filter, sort, paginate });
    const response: SearchUsersResponse = {
      metadata: {
        ...data.metadata,
        source: 'elasticsearch',
      },
      data: data.data,
    };
    return response;
  }
}
