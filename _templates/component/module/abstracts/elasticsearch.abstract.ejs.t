---
to: src/modules/<%= name %>/abstracts/elasticsearch.abstract.ts
---
import {
  GetMany<%= h.capitalize(name) %>sByUuidArguments,
  GetMany<%= h.capitalize(name) %>sByUuidResult,
  Search<%= h.capitalize(name) %>sArguments,
  Search<%= h.capitalize(name) %>sResult,
} from '@/modules/<%= name %>/dtos/elasticsearch';

export abstract class ElasticsearchAbstract {
  abstract search(args: Search<%= h.capitalize(name) %>sArguments): Promise<Search<%= h.capitalize(name) %>sResult>;
  abstract getManyByUuid(
    args: GetMany<%= h.capitalize(name) %>sByUuidArguments,
  ): Promise<GetMany<%= h.capitalize(name) %>sByUuidResult>;
}
