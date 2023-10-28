import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductEntity } from '../entities';
import { ElasticsearchAbstract } from '../abstracts';
import {
  GetManyProductsByUuidArguments,
  GetManyProductsByUuidResult,
  SearchProductsArguments,
  SearchProductsResult,
} from 'src/modules/product/dtos/elasticsearch';

@Injectable()
export class ProductElasticsearchService implements ElasticsearchAbstract {
  private readonly logger = new Logger(ProductElasticsearchService.name);

  constructor(
    private readonly elaService: ElasticsearchService,
    private configService: ConfigService,
  ) {}

  async search(args: SearchProductsArguments): Promise<SearchProductsResult> {
    const { page = 1, size = 20 } = args.paginate;
    const { keyword = '' } = args.filter;
    const query: any = {
      query: {
        bool: {
          should: [],
          must: [],
          filter: [],
        },
      },
      from: (page - 1) * size,
      size: size,
      sort: [],
      track_total_hits: true,
    };
    if (!_.isEmpty(keyword)) {
      query.query.bool.should.push({
        multi_match: {
          fields: [],
          query: keyword,
        },
      });
      query.query.bool.should.push({
        query_string: {
          fields: [],
          default_operator: 'and',
          query: '*' + keyword + '*',
        },
      });
      query.query.bool.minimum_should_match = 1;
    }
    if (!_.isEmpty(args.sort)) {
      for (const key of Object.keys(args.sort)) {
        query.sort.push({
          [key]: {
            order: args.sort[key],
          },
        });
      }
    }
    this.logger.debug('elasticsearch query: ' + JSON.stringify(query));
    const data = await this.elaService.search<ProductEntity>({
      index: this.configService.get<string>('ELA_METADATA_PRODUCT_INDEX'),
      body: query,
    });
    const cleanData = _.map(data.hits.hits, (x) => x._source);
    const total = data.hits.total['value'];
    return {
      metadata: {
        total: total,
        filter: args.filter,
        sort: args.sort,
        paginate: {
          page,
          size,
          lastPage: Math.ceil(total / size),
        },
      },
      data: cleanData,
    };
  }

  async getManyByUuid(
    args: GetManyProductsByUuidArguments,
  ): Promise<GetManyProductsByUuidResult> {
    const { uuid } = args;
    const data = await this.elaService.search<ProductEntity>({
      index: this.configService.get<string>('ELA_METADATA_PRODUCT_INDEX'),
      query: {
        bool: {
          filter: [
            {
              terms: {
                'uuid.keyword': uuid,
              },
            },
          ],
        },
      },
      from: 0,
      size: uuid.length,
    });
    const cleanData = _.map(data.hits.hits, (x) => x._source);
    return {
      metadata: {
        total: cleanData.length,
      },
      data: cleanData,
    };
  }
}
