import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { UserEntity } from '../entities';
import { ElasticsearchAbstract } from '../abstracts';
import {
  GetManyUsersByUuidArguments,
  GetManyUsersByUuidResult,
  SearchUsersArguments,
  SearchUsersResult,
} from 'src/modules/user/dtos/elasticsearch';

@Injectable()
export class UserElasticsearchService implements ElasticsearchAbstract {
  private readonly logger = new Logger(UserElasticsearchService.name);

  constructor(
    private readonly elaService: ElasticsearchService,
    private configService: ConfigService,
  ) {}

  async search(args: SearchUsersArguments): Promise<SearchUsersResult> {
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
          fields: ['firstName', 'lastName', 'username'],
          query: keyword,
        },
      });
      query.query.bool.should.push({
        query_string: {
          fields: ['firstName', 'lastName', 'username'],
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
    const data = await this.elaService.search<UserEntity>({
      index: this.configService.get<string>('ELA_METADATA_USER_INDEX'),
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
    args: GetManyUsersByUuidArguments,
  ): Promise<GetManyUsersByUuidResult> {
    const { uuid } = args;
    const data = await this.elaService.search<UserEntity>({
      index: this.configService.get<string>('ELA_METADATA_USER_INDEX'),
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
