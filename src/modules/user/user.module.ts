import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { UserModel, UserElasticsearchService } from './models';
import {
  UserService,
  UserSyncLayer,
  UserCachingLayer,
  UserLoggingLayer,
  UserEndpointLayer,
} from './layers';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities';
import { XRedisClientModule } from 'src/common/xredis/redis-client.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    XRedisClientModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getMongoRepository(UserEntity),
      inject: ['DATA_SOURCE'],
    },
    UserModel,
    UserService,
    UserSyncLayer,
    UserLoggingLayer,
    UserCachingLayer,
    UserEndpointLayer,
    UserElasticsearchService,
  ],
  exports: [UserModel, UserService, UserElasticsearchService],
})
export class UserModule {}
