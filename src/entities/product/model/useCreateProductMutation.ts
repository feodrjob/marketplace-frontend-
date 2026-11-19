import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import type { CreateProductData, Product } from './types';
import { PRODUCT_QUERY_KEYS } from './useProductsQuery';

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation<Product, unknown, CreateProductData>({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
}
