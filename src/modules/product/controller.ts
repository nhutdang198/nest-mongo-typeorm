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
import { ProductOutLayer } from './layers';
import {
  DeleteOneProductParam,
  DeleteOneProductResponse,
  UpdateOneProductBody,
  UpdateOneProductParam,
  UpdateOneProductResponse,
  GetManyProductsByIdQuery,
  GetManyProductsByIdResponse,
  CreateManyProductsBody,
  CreateManyProductsResponse,
  SearchProductsBody,
  SearchProductsResponse,
} from './dtos/service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerAbstract } from './abstracts';

@ApiTags('products')
@Controller({
  path: 'metadata/products',
})
export class ProductController implements ControllerAbstract {
  constructor(private readonly productOutLayer: ProductOutLayer) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateManyProductsResponse })
  async createMany(
    @Body() body: CreateManyProductsBody,
  ): Promise<CreateManyProductsResponse> {
    return await this.productOutLayer.createMany(body);
  }

  @Get('many')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: GetManyProductsByIdResponse })
  async getManyByUuid(
    @Query() query: GetManyProductsByIdQuery,
  ): Promise<GetManyProductsByIdResponse> {
    return await this.productOutLayer.getManyByUuid(query);
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: UpdateOneProductResponse })
  async updateOneByUuid(
    @Param() param: UpdateOneProductParam,
    @Body() body: UpdateOneProductBody,
  ): Promise<UpdateOneProductResponse> {
    return await this.productOutLayer.updateOneByUuid(param, body);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: DeleteOneProductResponse })
  async deleteOneByUuid(
    @Param() param: DeleteOneProductParam,
  ): Promise<DeleteOneProductResponse> {
    return await this.productOutLayer.deleteOneByUuid(param);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SearchProductsResponse })
  async search(
    @Body() body: SearchProductsBody,
  ): Promise<SearchProductsResponse> {
    return await this.productOutLayer.search(body);
  }
}
