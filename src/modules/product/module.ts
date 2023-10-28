import { Module } from '@nestjs/common';
import { ProductController } from './controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { ProductModel, ProductElasticsearchService } from './models';
import {
  ProductService,
  ProductSyncLayer,
  ProductCachingLayer,
  ProductLoggingLayer,
  ProductOutLayer,
} from './layers';
import { DataSource } from 'typeorm';
import { ProductEntity } from './entities';
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
  controllers: [ProductController],
  providers: [
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getMongoRepository(ProductEntity),
      inject: ['DATA_SOURCE'],
    },
    ProductModel,
    ProductService,
    ProductSyncLayer,
    ProductLoggingLayer,
    ProductCachingLayer,
    ProductOutLayer,
    ProductElasticsearchService,
  ],
  exports: [ProductModel, ProductService, ProductElasticsearchService],
})
export class ProductModule {}
