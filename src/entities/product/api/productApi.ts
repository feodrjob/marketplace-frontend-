import { apiClient } from '@/shared/api';
import { ENV } from '@/shared/config';
import type { CreateProductData, Product } from '../model/types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.categorySlug === 'string' &&
    typeof value.price === 'number'
  );
}

export const productApi = {
  // Эндпоинта создания товара в OpenAPI каталога пока нет,
  // поэтому этот вызов остаётся ручным до появления контракта US-3.3.
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
