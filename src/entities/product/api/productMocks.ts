import { ProductFilters, ProductItem } from '../model/types';

const DEMO_PRODUCTS: ProductItem[] = [
  { id: 1, title: 'Беспроводные наушники Pro', category: 'electronics', price: 4990 },
  { id: 2, title: 'Умные часы FitPulse', category: 'electronics', price: 8490 },
  { id: 3, title: 'Механическая клавиатура RGB', category: 'electronics', price: 6200 },
  { id: 4, title: 'Портативная колонка Boom', category: 'electronics', price: 3500 },
  { id: 5, title: 'Худи базовое Oversize', category: 'clothes', price: 4200 },
];

function parsePriceBounds(priceRange: string): [number | null, number | null] {
  const parts = priceRange.split(',').map((part) => Number(part.trim()));
  const min = Number.isFinite(parts[0]) && parts[0] > 0 ? parts[0] : null;
  const max = Number.isFinite(parts[1]) && parts[1] > 0 ? parts[1] : null;
  return [min, max];
}

export async function getMockProducts(filters: ProductFilters): Promise<ProductItem[]> {
  const [minPrice, maxPrice] = parsePriceBounds(filters.priceRange);

  const filtered = DEMO_PRODUCTS.filter((item) => {
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (minPrice !== null && item.price < minPrice) {
      return false;
    }
    if (maxPrice !== null && item.price > maxPrice) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) =>
    filters.sort === 'price,desc' ? b.price - a.price : a.price - b.price
  );
}
