import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserEndpointLayer } from './layers';
import {
  DeleteOneUserParam,
  DeleteOneUserResponse,
  UpdateOneUserBody,
  UpdateOneUserParam,
  UpdateOneUserResponse,
  GetManyUsersByIdQuery,
  GetManyUsersByIdResponse,
  CreateManyUsersBody,
  CreateManyUsersResponse,
  SearchUsersBody,
  SearchUsersResponse,
} from './dtos/service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerAbstract } from './abstracts';

@ApiTags('users')
@Controller({
  path: 'metadata/users',
})
export class UserController implements ControllerAbstract {
  constructor(private readonly userEndpointLayer: UserEndpointLayer) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateManyUsersResponse })
  async createMany(
    @Body() body: CreateManyUsersBody,
  ): Promise<CreateManyUsersResponse> {
    return await this.userEndpointLayer.createMany(body);
  }

  @Get('many')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: GetManyUsersByIdResponse })
  async getManyByUuid(
    @Query() query: GetManyUsersByIdQuery,
  ): Promise<GetManyUsersByIdResponse> {
    return await this.userEndpointLayer.getManyByUuid(query);
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: UpdateOneUserResponse })
  async updateOneByUuid(
    @Param() param: UpdateOneUserParam,
    @Body() body: UpdateOneUserBody,
  ): Promise<UpdateOneUserResponse> {
    return await this.userEndpointLayer.updateOneByUuid(param, body);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: DeleteOneUserResponse })
  async deleteOneByUuid(
    @Param() param: DeleteOneUserParam,
  ): Promise<DeleteOneUserResponse> {
    return await this.userEndpointLayer.deleteOneByUuid(param);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SearchUsersResponse })
  async search(@Body() body: SearchUsersBody): Promise<SearchUsersResponse> {
    return await this.userEndpointLayer.search(body);
  }
}
