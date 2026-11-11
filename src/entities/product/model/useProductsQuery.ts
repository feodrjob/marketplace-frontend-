import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { ProductFilters, ProductItem } from './types';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => ['products', filters] as const,
} as const;

export function useProductsQuery(filters: ProductFilters) {
  return useQuery<ProductItem[]>({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => productApi.list(filters),
  });
}
