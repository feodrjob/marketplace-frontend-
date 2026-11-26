export type ProductStatus = 'ACTIVE' | 'HIDDEN' | 'ARCHIVED';

export interface ProductImage {
  id: string;
  url?: string;
  sortOrder: number;
}

export interface ProductSeller {
  id: string;
  companyName?: string | null;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description?: string;
  price: number;
  status: ProductStatus;
  images: ProductImage[];
  seller: ProductSeller;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  q: string;
  category: string;
  priceMin: string;
  priceMax: string;
  sort: string;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  size: number;
  total: number;
}

export interface CreateProductData {
  title: string;
  category: string;
  price: number;
  description?: string;
  imageIds?: string[];
}
