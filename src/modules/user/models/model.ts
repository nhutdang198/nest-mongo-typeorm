import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Document, MongoError, MongoRepository } from 'typeorm';
import { UserEntity } from '../entities/entity';
import { ModelAbstract } from '../abstracts';
import * as _ from 'lodash';
import { General } from 'src/common/general';
import { KeyDuplicatedException } from 'src/common/exceptions';
import { UpdateOneUserBody } from '../dtos/service';

@Injectable()
export class UserModel implements ModelAbstract {
  private readonly logger = new Logger(UserModel.name);

  constructor(
    @Inject('USER_REPOSITORY') private userService: MongoRepository<UserEntity>,
  ) {}

  async createMany(userEntity: Array<UserEntity>): Promise<Array<UserEntity>> {
    const preSaveData = _.map(userEntity, (x) => ({
      ...x,
      password: General.hashPassword(x.password),
      uuid: General.generateId(),
    }));
    return await this.userService
      .save(preSaveData)
      .catch((error: MongoError) => {
        if (error.code === 11000) {
          this.logger.debug(JSON.stringify(userEntity));
          this.logger.error(error.message);
          throw new KeyDuplicatedException({
            message: 'key duplicated at users/createMany',
          });
        }
        this.logger.error(error.message);
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'bad db query at /users/createMany',
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async updateOneByUuid(
    uuid: string,
    body: UpdateOneUserBody,
  ): Promise<Document> {
    const updateData = {
      ...body,
      password: General.hashPassword(body.password),
    };
    return await this.userService
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
            message: 'key duplicated at users/updateOne',
          });
        }
        this.logger.error(error.message);
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'bad db query at /users/updateOne',
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async getManyByUuid(listUuid: Array<string>): Promise<Array<UserEntity>> {
    return (
      await this.userService.aggregate([
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
    return (await this.userService.findOneAndDelete({
      uuid: uuid,
    })) as UserEntity;
  }
}
