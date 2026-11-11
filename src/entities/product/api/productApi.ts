import { apiClient } from '@/shared/api';
import { ENV } from '@/shared/config';
import { ProductFilters, ProductItem, ProductListResponse } from '../model/types';
import { getMockProducts } from './productMocks';

export const productApi = {
  list: async (filters: ProductFilters): Promise<ProductItem[]> => {
    if (ENV.USE_MOCKS) {
      return getMockProducts(filters);
    }

    const params: Record<string, string> = {
      sort: filters.sort,
    };

    if (filters.category && filters.category !== 'all') {
      params['f[category]'] = filters.category;
    }

    if (filters.priceRange.trim()) {
      params['f[price]'] = filters.priceRange.trim();
    }

    const res = await apiClient.get<ProductListResponse | ProductItem[]>('/products', {
      params,
    });

    return Array.isArray(res.data) ? res.data : res.data.items;
  },
};
