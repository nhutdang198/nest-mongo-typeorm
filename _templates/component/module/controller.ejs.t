---
to: src/modules/<%= name %>/controller.ts
---
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
import { <%= h.capitalize(name) %>OutLayer } from './layers';
import {
  DeleteOne<%= h.capitalize(name) %>Param,
  DeleteOne<%= h.capitalize(name) %>Response,
  UpdateOne<%= h.capitalize(name) %>Body,
  UpdateOne<%= h.capitalize(name) %>Param,
  UpdateOne<%= h.capitalize(name) %>Response,
  GetMany<%= h.capitalize(name) %>sByIdQuery,
  GetMany<%= h.capitalize(name) %>sByIdResponse,
  CreateMany<%= h.capitalize(name) %>sBody,
  CreateMany<%= h.capitalize(name) %>sResponse,
  Search<%= h.capitalize(name) %>sBody,
  Search<%= h.capitalize(name) %>sResponse,
} from './dtos/service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerAbstract } from './abstracts';

@ApiTags('<%= name %>s')
@Controller({
  path: 'metadata/<%= name %>s',
})
export class <%= h.capitalize(name) %>Controller implements ControllerAbstract {
  constructor(private readonly <%= name %>OutLayer: <%= h.capitalize(name) %>OutLayer) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateMany<%= h.capitalize(name) %>sResponse })
  async createMany(
    @Body() body: CreateMany<%= h.capitalize(name) %>sBody,
  ): Promise<CreateMany<%= h.capitalize(name) %>sResponse> {
    return await this.<%= name %>OutLayer.createMany(body);
  }

  @Get('many')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: GetMany<%= h.capitalize(name) %>sByIdResponse })
  async getManyByUuid(
    @Query() query: GetMany<%= h.capitalize(name) %>sByIdQuery,
  ): Promise<GetMany<%= h.capitalize(name) %>sByIdResponse> {
    return await this.<%= name %>OutLayer.getManyByUuid(query);
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: UpdateOne<%= h.capitalize(name) %>Response })
  async updateOneByUuid(
    @Param() param: UpdateOne<%= h.capitalize(name) %>Param,
    @Body() body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<UpdateOne<%= h.capitalize(name) %>Response> {
    return await this.<%= name %>OutLayer.updateOneByUuid(param, body);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: DeleteOne<%= h.capitalize(name) %>Response })
  async deleteOneByUuid(
    @Param() param: DeleteOne<%= h.capitalize(name) %>Param,
  ): Promise<DeleteOne<%= h.capitalize(name) %>Response> {
    return await this.<%= name %>OutLayer.deleteOneByUuid(param);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: Search<%= h.capitalize(name) %>sResponse })
  async search(@Body() body: Search<%= h.capitalize(name) %>sBody): Promise<Search<%= h.capitalize(name) %>sResponse> {
    return await this.<%= name %>OutLayer.search(body);
  }
}
