---
to: src/modules/<%= name %>/module.ts
---
import { Module } from '@nestjs/common';
import { <%= h.capitalize(name) %>Controller } from './controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { <%= h.capitalize(name) %>Model, <%= h.capitalize(name) %>ElasticsearchService } from './models';
import {
  <%= h.capitalize(name) %>Service,
  <%= h.capitalize(name) %>SyncLayer,
  <%= h.capitalize(name) %>CachingLayer,
  <%= h.capitalize(name) %>LoggingLayer,
  <%= h.capitalize(name) %>OutLayer,
} from './layers';
import { DataSource } from 'typeorm';
import { <%= h.capitalize(name) %>Entity } from './entities';
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
  controllers: [<%= h.capitalize(name) %>Controller],
  providers: [
    {
      provide: '<%= name.toUpperCase() %>_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getMongoRepository(<%= h.capitalize(name) %>Entity),
      inject: ['DATA_SOURCE'],
    },
    <%= h.capitalize(name) %>Model,
    <%= h.capitalize(name) %>Service,
    <%= h.capitalize(name) %>SyncLayer,
    <%= h.capitalize(name) %>LoggingLayer,
    <%= h.capitalize(name) %>CachingLayer,
    <%= h.capitalize(name) %>OutLayer,
    <%= h.capitalize(name) %>ElasticsearchService,
  ],
  exports: [<%= h.capitalize(name) %>Model, <%= h.capitalize(name) %>Service, <%= h.capitalize(name) %>ElasticsearchService],
})
export class <%= h.capitalize(name) %>Module {}
