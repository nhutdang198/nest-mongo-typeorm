import { Injectable } from '@nestjs/common';
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
} from '../dtos/service';
import { UserLoggingLayer } from './logging.layer';

@Injectable()
export class UserEndpointLayer extends ServiceAbstract {
  constructor(private userLoggingLayer: UserLoggingLayer) {
    super();
  }

  async createMany(
    body: CreateManyUsersBody,
  ): Promise<CreateManyUsersResponse> {
    return await this.userLoggingLayer.createMany(body);
  }

  async getManyByUuid(
    query: GetManyUsersByIdQuery,
  ): Promise<GetManyUsersByIdResponse> {
    return await this.userLoggingLayer.getManyByUuid(query);
  }

  async updateOneByUuid(
    param: UpdateOneUserParam,
    body: UpdateOneUserBody,
  ): Promise<UpdateOneUserResponse> {
    return await this.userLoggingLayer.updateOneByUuid(param, body);
  }

  async deleteOneByUuid(
    param: DeleteOneUserParam,
  ): Promise<DeleteOneUserResponse> {
    return await this.userLoggingLayer.deleteOneByUuid(param);
  }

  async search(body: SearchUsersBody): Promise<SearchUsersResponse> {
    return await this.userLoggingLayer.search(body);
  }
}
