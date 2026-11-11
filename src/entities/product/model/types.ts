export interface ProductItem {
  id: number | string;
  title: string;
  category: string;
  price: number;
}

export interface ProductFilters {
  category: string;
  priceRange: string;
  sort: string;
}

export interface ProductListResponse {
  items: ProductItem[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}
