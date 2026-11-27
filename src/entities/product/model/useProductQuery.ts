import { useQuery } from '@tanstack/react-query';
import { getCatalogProduct, getGetCatalogProductQueryKey } from '@/shared/api/generated/catalog';
import type { Product } from './types';

export function useProductQuery(id: string | undefined) {
  return useQuery<Product>({
    queryKey: getGetCatalogProductQueryKey(id ?? ''),
    queryFn: ({ signal }) => getCatalogProduct(id as string, undefined, signal),
    enabled: Boolean(id),
    retry: false,
    // Страница товара показывает ошибку сама (404, нет сети, 5xx),
    // чтобы не подменять весь экран общим ErrorBoundary.
    throwOnError: false,
  });
}
