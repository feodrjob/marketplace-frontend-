import type {
  ProductImageResponse,
  ProductPageResponse,
  ProductResponse,
} from '@/shared/api/generated/catalog';

export type Product = ProductResponse;

export type ProductImage = ProductImageResponse;

export type ProductListResponse = ProductPageResponse;

export interface ProductFilters {
  q: string;
  category: string;
  priceMin: string;
  priceMax: string;
  sort: string;
}

export interface CreateProductData {
  title: string;
  category: string;
  price: number;
  description?: string;
  imageIds?: string[];
}
