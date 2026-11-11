import React from 'react';
import {
  Title,
  Text,
  Stack,
  Paper,
  TextInput,
  Select,
  SimpleGrid,
  Card,
  Button,
  Skeleton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { ProductFilters, useProductsQuery } from '@/entities/product';
import { Formatter } from '@/shared/lib';
import classes from './CatalogPage.module.css';

export function CatalogPage() {
  const form = useForm<ProductFilters>({
    initialValues: {
      category: 'electronics',
      priceRange: '1000,25000',
      sort: 'price,asc',
    },
  });

  const [debouncedPriceRange] = useDebouncedValue(form.values.priceRange, 300);

  const { data: products = [], isLoading } = useProductsQuery({
    category: form.values.category,
    priceRange: debouncedPriceRange,
    sort: form.values.sort,
  });

  return (
    <Stack gap={24}>
      <div>
        <Title order={1} className={classes.title}>
          Каталог товаров
        </Title>
        <Text className={classes.subtitle}>
          Интеграция фильтрации и TanStack Query по контракту (GET /api/v1/products)
        </Text>
      </div>

      {/* Панель фильтров на базе @mantine/form */}
      <Paper className={classes.filtersCard} radius="sm" withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Select
            label="Категория (f[category])"
            size="sm"
            allowDeselect={false}
            data={[
              { value: 'all', label: 'Все категории' },
              { value: 'electronics', label: 'Электроника (electronics)' },
              { value: 'clothes', label: 'Одежда (clothes)' },
            ]}
            {...form.getInputProps('category')}
          />

          <TextInput
            label="Диапазон цен (f[price])"
            size="sm"
            placeholder="1000,25000"
            {...form.getInputProps('priceRange')}
          />

          <Select
            label="Сортировка (sort)"
            size="sm"
            allowDeselect={false}
            data={[
              { value: 'price,asc', label: 'Сначала дешевле (price,asc)' },
              { value: 'price,desc', label: 'Сначала дороже (price,desc)' },
            ]}
            {...form.getInputProps('sort')}
          />
        </SimpleGrid>
      </Paper>

      {/* Карточки товаров */}
      {isLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={16}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height={156} radius="sm" />
          ))}
        </SimpleGrid>
      ) : products.length === 0 ? (
        <Paper p="lg" radius="sm" withBorder bg="white" ta="center">
          <Text fz={14} c="dimmed">
            Товары по выбранным параметрам не найдены.
          </Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={16}>
          {products.map((prod) => (
            <Card
              key={prod.id}
              padding="md"
              radius="sm"
              withBorder
              className={classes.productCard}
            >
              <Text className={classes.category}>{prod.category}</Text>
              <Text className={classes.productTitle}>{prod.title}</Text>
              <Text className={classes.price}>{Formatter.price(prod.price)}</Text>
              <Button color="brandBlue" fullWidth radius="sm" size="xs">
                В корзину
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}

export default CatalogPage;
