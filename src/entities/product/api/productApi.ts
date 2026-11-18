import { apiClient } from '@/shared/api';
import { ENV } from '@/shared/config';
import type {
  CreateProductData,
  Product,
  ProductFilters,
  ProductListResponse,
} from '../model/types';

const DEFAULT_LIMIT = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.category === 'string' &&
    typeof value.price === 'number'
  );
}

function isProductListResponse(value: unknown): value is ProductListResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isProduct) &&
    (typeof value.nextCursor === 'string' || value.nextCursor === null) &&
    typeof value.hasMore === 'boolean' &&
    typeof value.total === 'number'
  );
}

export const productApi = {
  list: async (
    filters: ProductFilters,
    cursor: string | null = null,
    limit = DEFAULT_LIMIT,
    signal?: AbortSignal
  ): Promise<ProductListResponse> => {
    if (ENV.USE_MOCKS) {
      const { getMockProducts } = await import('./productMocks');
      return getMockProducts(filters, cursor, limit);
    }

    const params: Record<string, string | number> = {
      sort: filters.sort,
      limit,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    if (filters.category && filters.category !== 'all') {
      params['f[category]'] = filters.category;
    }

    const priceMin = filters.priceMin.trim();
    const priceMax = filters.priceMax.trim();
    if (priceMin || priceMax) {
      params['f[price]'] = `${priceMin || '0'},${priceMax}`;
    }

    const res = await apiClient.get<unknown>('/catalog/products', {
      params,
      signal,
    });

    if (!isProductListResponse(res.data)) {
      throw new Error('Некорректный ответ API: ожидался список товаров');
    }

    return res.data;
  },

  detail: async (id: string, signal?: AbortSignal): Promise<Product> => {
    if (ENV.USE_MOCKS) {
      const { getMockProduct } = await import('./productMocks');
      return getMockProduct(id);
    }

    const res = await apiClient.get<unknown>(`/catalog/products/${id}`, { signal });

    if (!isProduct(res.data)) {
      throw new Error('Некорректный ответ API: ожидался товар');
    }

    return res.data;
  },

  create: async (data: CreateProductData): Promise<Product> => {
    if (ENV.USE_MOCKS) {
      const { createMockProduct } = await import('./productMocks');
      return createMockProduct(data);
    }

    const res = await apiClient.post<unknown>('/seller/products', data);

    if (!isProduct(res.data)) {
      throw new Error('Некорректный ответ API: ожидался созданный товар');
    }

    return res.data;
  },
};
