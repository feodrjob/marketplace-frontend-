import {
  Anchor,
  Button,
  CloseButton,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue, useIntersection } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import {
  PRODUCT_CATEGORY_LABELS,
  type Product,
  ProductCard,
  type ProductFilters,
  useProductsQuery,
} from '@/entities/product';
import { getErrorMessage } from '@/shared/lib';
import classes from './CatalogPage.module.css';

const SKELETON_KEYS = [
  'skeleton-1',
  'skeleton-2',
  'skeleton-3',
  'skeleton-4',
  'skeleton-5',
  'skeleton-6',
  'skeleton-7',
  'skeleton-8',
] as const;

const INITIAL_FILTERS: ProductFilters = {
  category: 'all',
  priceMin: '',
  priceMax: '',
  sort: 'price,asc',
};

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Все категории' },
  ...Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

const SORT_OPTIONS = [
  { value: 'price,asc', label: 'Сначала дешевле' },
  { value: 'price,desc', label: 'Сначала дороже' },
];

export function CatalogPage() {
  const form = useForm<ProductFilters>({
    initialValues: INITIAL_FILTERS,
  });

  const [debouncedPriceMin] = useDebouncedValue(form.values.priceMin, 300);
  const [debouncedPriceMax] = useDebouncedValue(form.values.priceMax, 300);

  const filters: ProductFilters = {
    category: form.values.category,
    priceMin: debouncedPriceMin,
    priceMax: debouncedPriceMax,
    sort: form.values.sort,
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsQuery(filters);

  const { ref: loadMoreRef, entry } = useIntersection({ rootMargin: '300px' });

  const products = useMemo(() => {
    const seen = new Set<string>();
    const result: Product[] = [];

    for (const page of data?.pages ?? []) {
      for (const item of page.items) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          result.push(item);
        }
      }
    }

    return result;
  }, [data]);

  const total = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    if (!entry?.isIntersecting || !hasNextPage || isFetchingNextPage) {
      return;
    }
    void fetchNextPage();
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const resetFilters = () => {
    form.setValues(INITIAL_FILTERS);
  };

  return (
    <Stack gap={24}>
      <div>
        <Title order={1} className={classes.title}>
          Каталог товаров
        </Title>
        <Text className={classes.subtitle}>Товары продавцов маркетплейса</Text>
      </div>

      <Paper className={classes.filtersCard} radius="sm" withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Select
            label="Категория"
            size="sm"
            allowDeselect={false}
            data={CATEGORY_OPTIONS}
            {...form.getInputProps('category')}
          />

          <SimpleGrid cols={2} spacing="sm">
            <TextInput
              label="Цена от, ₽"
              size="sm"
              inputMode="numeric"
              placeholder="1000"
              rightSection={
                form.values.priceMin ? (
                  <CloseButton
                    aria-label="Очистить минимальную цену"
                    onClick={() => form.setFieldValue('priceMin', '')}
                  />
                ) : null
              }
              {...form.getInputProps('priceMin')}
              onChange={(event) =>
                form.setFieldValue('priceMin', event.currentTarget.value.replace(/\D/g, ''))
              }
            />

            <TextInput
              label="Цена до, ₽"
              size="sm"
              inputMode="numeric"
              placeholder="25000"
              rightSection={
                form.values.priceMax ? (
                  <CloseButton
                    aria-label="Очистить максимальную цену"
                    onClick={() => form.setFieldValue('priceMax', '')}
                  />
                ) : null
              }
              {...form.getInputProps('priceMax')}
              onChange={(event) =>
                form.setFieldValue('priceMax', event.currentTarget.value.replace(/\D/g, ''))
              }
            />
          </SimpleGrid>

          <Select
            label="Сортировка"
            size="sm"
            allowDeselect={false}
            data={SORT_OPTIONS}
            {...form.getInputProps('sort')}
          />
        </SimpleGrid>

        <Group justify="flex-end" gap={0}>
          <Anchor component="button" onClick={resetFilters} className={classes.resetLink}>
            Сбросить фильтры
          </Anchor>
        </Group>
      </Paper>

      {isLoading ? (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing={16}>
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} height={240} radius="sm" />
          ))}
        </SimpleGrid>
      ) : isError ? (
        <Paper p="lg" radius="sm" withBorder ta="center">
          <Stack gap="sm" align="center">
            <Text fz={14} c="dimmed">
              {getErrorMessage(error, 'Не удалось загрузить каталог')}
            </Text>
            <Button variant="default" size="sm" h={44} onClick={() => void refetch()}>
              Повторить
            </Button>
          </Stack>
        </Paper>
      ) : products.length === 0 ? (
        <Paper p="lg" radius="sm" withBorder ta="center">
          <Stack gap="sm" align="center">
            <Text fz={14} c="dimmed">
              По выбранным фильтрам товаров нет.
            </Text>
            <Button variant="default" size="sm" h={44} onClick={resetFilters}>
              Сбросить фильтры
            </Button>
          </Stack>
        </Paper>
      ) : (
        <>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing={16}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>

          {hasNextPage ? (
            <>
              <div ref={loadMoreRef} style={{ height: 1 }} />
              <Button
                variant="default"
                h={44}
                onClick={() => void fetchNextPage()}
                loading={isFetchingNextPage}
              >
                Показать ещё
              </Button>
            </>
          ) : (
            <Text ta="center" c="dimmed" fz="sm">
              Показано {products.length} из {total}
            </Text>
          )}
        </>
      )}
    </Stack>
  );
}

export default CatalogPage;
