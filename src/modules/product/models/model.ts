import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Document, MongoError, MongoRepository } from 'typeorm';
import { ProductEntity } from '../entities/entity';
import { ModelAbstract } from '../abstracts';
// import * as _ from 'lodash';
import { General } from 'src/common/general';
import { KeyDuplicatedException } from 'src/common/exceptions';
import { UpdateOneProductBody } from '../dtos/service';

@Injectable()
export class ProductModel implements ModelAbstract {
  private readonly logger = new Logger(ProductModel.name);

  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productService: MongoRepository<ProductEntity>,
  ) {}

  async createMany(
    productEntity: Array<ProductEntity>,
  ): Promise<Array<ProductEntity>> {
    return await this.productService
      .save(productEntity)
      .catch((error: MongoError) => {
        if (error.code === 11000) {
          this.logger.debug(JSON.stringify(productEntity));
          this.logger.error(error.message);
          throw new KeyDuplicatedException({
            message: 'key duplicated at products/createMany',
          });
        }
        this.logger.error(error.message);
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'bad db query at /products/createMany',
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async updateOneByUuid(
    uuid: string,
    body: UpdateOneProductBody,
  ): Promise<Document> {
    const updateData = {
      ...body,
      password: General.hashPassword(body.password),
    };
    return await this.productService
      .findOneAndUpdate(
        { uuid: uuid },
        { $set: updateData },
        {
          returnDocument: 'after',
        },
      )
      .catch((error: MongoError) => {
        if (error.code === 11000) {
          this.logger.debug(JSON.stringify(updateData));
          this.logger.error(error.message);
          throw new KeyDuplicatedException({
            message: 'key duplicated at products/updateOne',
          });
        }
        this.logger.error(error.message);
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'bad db query at /products/updateOne',
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async getManyByUuid(listUuid: Array<string>): Promise<Array<ProductEntity>> {
    return (
      await this.productService.aggregate([
        {
          $match: {
            uuid: {
              $in: listUuid,
            },
          },
        },
      ])
    ).toArray();
  }

  async deleteOneByUuid(uuid: string): Promise<Document> {
    return (await this.productService.findOneAndDelete({
      uuid: uuid,
    })) as ProductEntity;
  }
}
