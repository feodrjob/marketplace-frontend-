import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getListCatalogProductsQueryKey,
  type ListCatalogProductsParams,
  type ListCatalogProductsSort,
  listCatalogProducts,
} from '@/shared/api/generated/catalog';
import type { ProductFilters, ProductListResponse } from './types';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => ['products', filters] as const,
  detail: (id: string) => ['products', id] as const,
} as const;

const PAGE_SIZE = 20;

function toParams(filters: ProductFilters, size: number): ListCatalogProductsParams {
  const params: ListCatalogProductsParams = { size };

  if (filters.q) {
    params.q = filters.q;
  }
  if (filters.sort) {
    params.sort = filters.sort as ListCatalogProductsSort;
  }
  if (filters.category !== 'all') {
    params['f[category]'] = filters.category;
  }

  const priceMin = filters.priceMin.trim();
  const priceMax = filters.priceMax.trim();
  if (priceMin || priceMax) {
    // Бэкенд принимает только пару min,max, оба значения обязательны.
    params['f[price]'] = `${priceMin || '0'},${priceMax || '999999999'}`;
  }

  return params;
}

export function useProductsQuery(filters: ProductFilters, enabled = true) {
  const params = toParams(filters, PAGE_SIZE);

  return useInfiniteQuery({
    queryKey: getListCatalogProductsQueryKey(params),
    queryFn: ({ pageParam, signal }) =>
      listCatalogProducts({ ...params, page: pageParam }, undefined, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ProductListResponse) => {
      const loaded = (lastPage.page + 1) * lastPage.size;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    enabled,
  });
}
