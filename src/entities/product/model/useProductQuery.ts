import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import type { Product } from './types';
import { PRODUCT_QUERY_KEYS } from './useProductsQuery';

export function useProductQuery(id: string | undefined) {
  return useQuery<Product>({
    queryKey: PRODUCT_QUERY_KEYS.detail(id ?? ''),
    queryFn: ({ signal }) => productApi.detail(id as string, signal),
    enabled: Boolean(id),
    retry: false,
    // Страница товара показывает ошибку сама (404, нет сети, 5xx),
    // чтобы не подменять весь экран общим ErrorBoundary.
    throwOnError: false,
  });
}
