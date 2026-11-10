import {
  Button,
  Card,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import classes from './CatalogPage.module.css';

interface ProductItem {
  id: number;
  title: string;
  category: string;
  price: number;
}

const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: 'Беспроводные наушники Pro',
    category: 'electronics',
    price: 4990,
  },
  { id: 2, title: 'Умные часы FitPulse', category: 'electronics', price: 8490 },
  {
    id: 3,
    title: 'Механическая клавиатура RGB',
    category: 'electronics',
    price: 6200,
  },
  {
    id: 4,
    title: 'Портативная колонка Boom',
    category: 'electronics',
    price: 3500,
  },
];

export function CatalogPage() {
  const [category, setCategory] = useState<string | null>('electronics');
  const [priceRange, setPriceRange] = useState('1000,25000');
  const [sort, setSort] = useState<string | null>('price,asc');

  return (
    <Stack gap={24}>
      <div>
        <Title order={1} className={classes.title}>
          Каталог товаров
        </Title>
        <Text className={classes.subtitle}>
          Пример интеграции параметров фильтрации по контракту (GET /api/v1/products)
        </Text>
      </div>

      {/* Панель фильтров в едином гармоничном стиле */}
      <Paper className={classes.filtersCard} radius="sm" withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Select
            label="Категория (f[category])"
            size="sm"
            value={category}
            onChange={setCategory}
            data={[
              { value: 'all', label: 'Все категории' },
              { value: 'electronics', label: 'Электроника (electronics)' },
              { value: 'clothes', label: 'Одежда (clothes)' },
            ]}
          />

          <TextInput
            label="Диапазон цен (f[price])"
            size="sm"
            value={priceRange}
            onChange={(e) => setPriceRange(e.currentTarget.value)}
            placeholder="1000,25000"
          />

          <Select
            label="Сортировка (sort)"
            size="sm"
            value={sort}
            onChange={setSort}
            data={[
              { value: 'price,asc', label: 'Сначала дешевле (price,asc)' },
              { value: 'price,desc', label: 'Сначала дороже (price,desc)' },
            ]}
          />
        </SimpleGrid>
      </Paper>

      {/* Карточки товаров */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={16}>
        {DEMO_PRODUCTS.map((prod) => (
          <Card key={prod.id} padding="md" radius="sm" withBorder className={classes.productCard}>
            <Text className={classes.category}>{prod.category}</Text>
            <Text className={classes.productTitle}>{prod.title}</Text>
            <Text className={classes.price}>{prod.price.toLocaleString('ru-RU')} ₽</Text>
            <Button color="brandBlue" fullWidth radius="sm" size="xs">
              В корзину
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default CatalogPage;
