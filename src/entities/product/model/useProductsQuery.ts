import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import type { ProductFilters, ProductListResponse } from './types';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => ['products', filters] as const,
  detail: (id: string) => ['products', id] as const,
} as const;

const PAGE_SIZE = 20;

export function useProductsQuery(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam, signal }) => productApi.list(filters, pageParam, PAGE_SIZE, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: ProductListResponse) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    placeholderData: keepPreviousData,
  });
}
