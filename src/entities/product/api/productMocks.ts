import type {
  CreateProductData,
  Product,
  ProductFilters,
  ProductListResponse,
} from '../model/types';

const PAGE_SIZE = 20;
const DAY_MS = 24 * 60 * 60 * 1000;

const PRODUCT_SEEDS: Array<Omit<Product, 'id' | 'status' | 'images' | 'createdAt' | 'updatedAt'>> =
  [
    {
      title: 'Беспроводные наушники Pro',
      category: 'electronics',
      price: 4990,
      seller: { id: 'seller-1', companyName: 'CyberGear' },
      description: 'Накладные наушники с активным шумоподавлением и зарядкой на 30 часов.',
    },
    {
      title: 'Умные часы FitPulse',
      category: 'electronics',
      price: 8490,
      seller: { id: 'seller-1', companyName: 'CyberGear' },
      description: 'Часы с пульсометром, сном и уведомлениями со смартфона.',
    },
    {
      title: 'Механическая клавиатура RGB',
      category: 'electronics',
      price: 6200,
      seller: { id: 'seller-2', companyName: 'ТехноМаркет' },
      description: 'Клавиатура с горячей заменой переключателей и подсветкой.',
    },
    {
      title: 'Портативная колонка Boom',
      category: 'electronics',
      price: 3500,
      seller: { id: 'seller-2', companyName: 'ТехноМаркет' },
      description: 'Колонка с защитой от брызг и Bluetooth 5.3.',
    },
    {
      title: 'Худи базовое Oversize',
      category: 'clothes',
      price: 4200,
      seller: { id: 'seller-3', companyName: 'Стиль' },
      description: 'Плотное худи свободного кроя из хлопка.',
    },
    {
      title: 'Футболка хлопковая',
      category: 'clothes',
      price: 1800,
      seller: { id: 'seller-3', companyName: 'Стиль' },
      description: 'Базовая футболка из плотного хлопка, прямой крой.',
    },
    {
      title: 'Джинсы прямые',
      category: 'clothes',
      price: 5400,
      seller: { id: 'seller-3', companyName: 'Стиль' },
      description: 'Джинсы с высокой посадкой и прямым кроем.',
    },
    {
      title: 'Кроссовки Everyday',
      category: 'clothes',
      price: 6900,
      seller: { id: 'seller-4', companyName: 'Лавка Уюта' },
      description: 'Лёгкие кроссовки для города и прогулок.',
    },
    {
      title: 'Рюкзак городской',
      category: 'clothes',
      price: 3900,
      seller: { id: 'seller-4', companyName: 'Лавка Уюта' },
      description: 'Рюкзак с отделением для ноутбука 14 дюймов.',
    },
    {
      title: 'Лампа настольная',
      category: 'home',
      price: 2400,
      seller: { id: 'seller-4', companyName: 'Лавка Уюта' },
      description: 'Настольная лампа с тёплым и холодным светом.',
    },
    {
      title: 'Кружка керамическая',
      category: 'home',
      price: 900,
      seller: { id: 'seller-4', companyName: 'Лавка Уюта' },
      description: 'Керамическая кружка 350 мл, можно мыть в посудомойке.',
    },
    {
      title: 'Плед вязаный',
      category: 'home',
      price: 3200,
      seller: { id: 'seller-3', companyName: 'Стиль' },
      description: 'Мягкий плед 130 на 170 см из смесовой пряжи.',
    },
    {
      title: 'Наушники TWS Mini',
      category: 'electronics',
      price: 2900,
      seller: { id: 'seller-1', companyName: 'CyberGear' },
      description: 'Компактные TWS-наушники с кейсом для зарядки.',
    },
    {
      title: 'Мышь беспроводная',
      category: 'electronics',
      price: 1700,
      seller: { id: 'seller-2', companyName: 'ТехноМаркет' },
      description: 'Беспроводная мышь с тихими кнопками и USB-C.',
    },
    {
      title: 'Монитор 24 дюйма',
      category: 'electronics',
      price: 15900,
      seller: { id: 'seller-2', companyName: 'ТехноМаркет' },
      description: 'Монитор Full HD с частотой 100 Гц и тонкими рамками.',
    },
    {
      title: 'Хаб USB-C',
      category: 'electronics',
      price: 2800,
      seller: { id: 'seller-1', companyName: 'CyberGear' },
      description: 'Хаб с HDMI, USB 3.0 и кардридером.',
    },
    {
      title: 'Свитшот с капюшоном',
      category: 'clothes',
      price: 3800,
      seller: { id: 'seller-3', companyName: 'Стиль' },
      description: 'Свитшот из футера с мягкой изнанкой.',
    },
    {
      title: 'Шапка вязаная',
      category: 'clothes',
      price: 1400,
      seller: { id: 'seller-4', companyName: 'Лавка Уюта' },
      description: 'Тёплая шапка с отворотом, подходит на осень и зиму.',
    },
    {
      title: 'Носки набор 3 пары',
      category: 'clothes',
      price: 800,
      seller: { id: 'seller-3', companyName: 'Стиль' },
      description: 'Набор базовых носков из хлопка, размеры 39-45.',
    },
    {
      title: 'Органайзер для стола',
      category: 'home',
      price: 1600,
      seller: { id: 'seller-4', companyName: 'Лавка Уюта' },
      description: 'Деревянный органайзер с отделениями для мелочей.',
    },
    {
      title: 'Термокружка 500 мл',
      category: 'home',
      price: 2100,
      seller: { id: 'seller-2', companyName: 'ТехноМаркет' },
      description: 'Термокружка из нержавеющей стали, держит тепло 8 часов.',
    },
    {
      title: 'Настольные часы',
      category: 'home',
      price: 1300,
      seller: { id: 'seller-4', companyName: 'Лавка Уюта' },
      description: 'Минималистичные часы с подсветкой и будильником.',
    },
    {
      title: 'Сумка через плечо',
      category: 'clothes',
      price: 3100,
      seller: { id: 'seller-3', companyName: 'Стиль' },
      description: 'Компактная сумка с регулируемым ремнём.',
    },
    {
      title: 'Кабель USB-C 2 м',
      category: 'electronics',
      price: 1100,
      seller: { id: 'seller-1', companyName: 'CyberGear' },
      description: 'Кабель для зарядки и передачи данных, 100 Вт.',
    },
  ];

const DEMO_PRODUCTS: Product[] = PRODUCT_SEEDS.map((seed, index) => {
  // Разные даты добавления, чтобы в каталоге были и свежие товары, и старые.
  const createdAt = new Date(Date.now() - index * DAY_MS).toISOString();

  return {
    ...seed,
    id: `product-${index + 1}`,
    status: 'ACTIVE' as const,
    images: [],
    createdAt,
    updatedAt: createdAt,
  };
});

function parseBound(value: string): number | null {
  const number = Number(value.trim());
  return Number.isFinite(number) && number > 0 ? number : null;
}

export async function getMockProducts(
  filters: ProductFilters,
  cursor: string | null = null,
  limit = PAGE_SIZE
): Promise<ProductListResponse> {
  const minPrice = parseBound(filters.priceMin);
  const maxPrice = parseBound(filters.priceMax);

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

  const sorted = [...filtered].sort((a, b) =>
    filters.sort === 'price,desc' ? b.price - a.price : a.price - b.price
  );

  const cursorIndex = cursor ? sorted.findIndex((item) => item.id === cursor) : -1;
  const start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  const items = sorted.slice(start, start + limit);
  const hasMore = start + items.length < sorted.length;
  const lastItem = items[items.length - 1];

  return {
    items,
    nextCursor: hasMore && lastItem ? lastItem.id : null,
    hasMore,
    total: sorted.length,
  };
}

export async function getMockProduct(id: string): Promise<Product> {
  const product = DEMO_PRODUCTS.find((item) => item.id === id);
  if (!product) {
    throw new Error('Товар не найден');
  }
  return product;
}

export async function createMockProduct(data: CreateProductData): Promise<Product> {
  const now = new Date().toISOString();
  const product: Product = {
    id: `product-${Date.now()}`,
    title: data.title.trim(),
    category: data.category,
    description: data.description?.trim() || undefined,
    price: data.price,
    status: 'ACTIVE',
    images: [],
    seller: { id: 'seller-demo', companyName: 'Мой магазин' },
    createdAt: now,
    updatedAt: now,
  };
  DEMO_PRODUCTS.unshift(product);
  return product;
}
