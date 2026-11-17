import { apiClient } from '@/shared/api';
import { ENV } from '@/shared/config';
import type { ProductFilters, ProductItem, ProductListResponse } from '../model/types';

export const productApi = {
  list: async (filters: ProductFilters): Promise<ProductItem[]> => {
    if (ENV.USE_MOCKS) {
      const { getMockProducts } = await import('./productMocks');
      return getMockProducts(filters);
    }

    const params: Record<string, string> = {
      sort: filters.sort,
    };

    if (filters.category && filters.category !== 'all') {
      params['f[category]'] = filters.category;
    }

    const priceRange = typeof filters.priceRange === 'string' ? filters.priceRange.trim() : '';
    if (priceRange) {
      params['f[price]'] = priceRange;
    }

    const res = await apiClient.get<ProductListResponse | ProductItem[]>('/products', {
      params,
    });

    const items = Array.isArray(res.data) ? res.data : res.data?.items;
    if (!Array.isArray(items)) {
      throw new Error('Некорректный ответ API: ожидался список товаров');
    }

    return items;
  },
};
