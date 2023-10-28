---
to: src/modules/<%= name %>/models/model.ts
---
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Document, MongoError, MongoRepository } from 'typeorm';
import { <%= h.capitalize(name) %>Entity } from '../entities/entity';
import { ModelAbstract } from '../abstracts';
import * as _ from 'lodash';
import { General } from 'src/common/general';
import { KeyDuplicatedException } from 'src/common/exceptions';
import { UpdateOne<%= h.capitalize(name) %>Body } from '../dtos/service';

@Injectable()
export class <%= h.capitalize(name) %>Model implements ModelAbstract {
  private readonly logger = new Logger(<%= h.capitalize(name) %>Model.name);

  constructor(
    @Inject('<%= name.toUpperCase() %>_REPOSITORY') private <%= name %>Service: MongoRepository<<%= h.capitalize(name) %>Entity>,
  ) {}

  async createMany(<%= name %>Entity: Array<<%= h.capitalize(name) %>Entity>): Promise<Array<<%= h.capitalize(name) %>Entity>> {
    return await this.<%= name %>Service
      .save(<%= name %>Entity)
      .catch((error: MongoError) => {
        if (error.code === 11000) {
          this.logger.debug(JSON.stringify(<%= name %>Entity));
          this.logger.error(error.message);
          throw new KeyDuplicatedException({
            message: 'key duplicated at <%= name %>s/createMany',
          });
        }
        this.logger.error(error.message);
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'bad db query at /<%= name %>s/createMany',
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async updateOneByUuid(
    uuid: string,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<Document> {
    const updateData = {
      ...body,
      password: General.hashPassword(body.password),
    };
    return await this.<%= name %>Service
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
            message: 'key duplicated at <%= name %>s/updateOne',
          });
        }
        this.logger.error(error.message);
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'bad db query at /<%= name %>s/updateOne',
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async getManyByUuid(listUuid: Array<string>): Promise<Array<<%= h.capitalize(name) %>Entity>> {
    return (
      await this.<%= name %>Service.aggregate([
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
    return (await this.<%= name %>Service.findOneAndDelete({
      uuid: uuid,
    })) as <%= h.capitalize(name) %>Entity;
  }
}
