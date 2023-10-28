---
to: src/modules/<%= name %>/dtos/elasticsearch/search.dto.ts
---
import { <%= h.capitalize(name) %>Entity } from 'src/modules/<%= name %>/entities';

export class Search<%= h.capitalize(name) %>sFilter {
  keyword: string;
}

export class Search<%= h.capitalize(name) %>sPaginate {
  page: number;
  size: number;
}

export class Search<%= h.capitalize(name) %>sSort {
  createdAt: string = 'desc' || 'asc';
}

export class Search<%= h.capitalize(name) %>sArguments {
  filter: Search<%= h.capitalize(name) %>sFilter;
  paginate: Search<%= h.capitalize(name) %>sPaginate;
  sort: Search<%= h.capitalize(name) %>sSort;
}

export class Search<%= h.capitalize(name) %>sMetadata {
  total: number;
  filter: Search<%= h.capitalize(name) %>sFilter;
  paginate: {
    page: number;
    size: number;
    lastPage: number;
  };
  sort: Search<%= h.capitalize(name) %>sSort;
}

export class Search<%= h.capitalize(name) %>sResult {
  metadata: Search<%= h.capitalize(name) %>sMetadata;
  data: <%= h.capitalize(name) %>Entity[];
}
