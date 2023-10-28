import { ProductEntity } from 'src/modules/product/entities';

export class SearchProductsFilter {
  keyword: string;
}

export class SearchProductsPaginate {
  page: number;
  size: number;
}

export class SearchProductsSort {
  createdAt: string = 'desc' || 'asc';
}

export class SearchProductsArguments {
  filter: SearchProductsFilter;
  paginate: SearchProductsPaginate;
  sort: SearchProductsSort;
}

export class SearchProductsMetadata {
  total: number;
  filter: SearchProductsFilter;
  paginate: {
    page: number;
    size: number;
    lastPage: number;
  };
  sort: SearchProductsSort;
}

export class SearchProductsResult {
  metadata: SearchProductsMetadata;
  data: ProductEntity[];
}
