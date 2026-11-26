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
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  q: '',
  category: 'all',
  priceMin: '',
  priceMax: '',
  sort: '',
};

const CATEGORY_VALUES = new Set(Object.keys(PRODUCT_CATEGORY_LABELS));

const SORT_VALUES = new Set(['', 'createdAt,desc', 'createdAt,asc', 'price,asc', 'price,desc']);

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Все категории' },
  ...Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

function digits(value: string | null): string {
  return (value ?? '').replace(/\D/g, '');
}

function parseFilters(params: URLSearchParams): ProductFilters {
  const category = params.get('category') ?? 'all';
  const sort = params.get('sort') ?? '';

  return {
    q: (params.get('q') ?? '').trim(),
    category: category === 'all' || CATEGORY_VALUES.has(category) ? category : 'all',
    priceMin: digits(params.get('priceMin')),
    priceMax: digits(params.get('priceMax')),
    sort: SORT_VALUES.has(sort) ? sort : '',
  };
}

function buildSearchParams(filters: ProductFilters): URLSearchParams {
  const next = new URLSearchParams();

  if (filters.q) {
    next.set('q', filters.q);
  }
  if (filters.category !== 'all') {
    next.set('category', filters.category);
  }
  if (filters.priceMin) {
    next.set('priceMin', filters.priceMin);
  }
  if (filters.priceMax) {
    next.set('priceMax', filters.priceMax);
  }
  if (filters.sort) {
    next.set('sort', filters.sort);
  }

  return next;
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialFilters] = useState(() => parseFilters(searchParams));

  const form = useForm<ProductFilters>({
    initialValues: initialFilters,
  });

  const [debouncedQ] = useDebouncedValue(form.values.q, 300);
  const [debouncedPriceMin] = useDebouncedValue(form.values.priceMin, 300);
  const [debouncedPriceMax] = useDebouncedValue(form.values.priceMax, 300);

  const filters: ProductFilters = {
    q: debouncedQ.trim(),
    category: form.values.category,
    priceMin: debouncedPriceMin,
    priceMax: debouncedPriceMax,
    sort: form.values.sort,
  };

  const minPrice = filters.priceMin ? Number(filters.priceMin) : null;
  const maxPrice = filters.priceMax ? Number(filters.priceMax) : null;
  const priceError =
    minPrice !== null && maxPrice !== null && minPrice > maxPrice
      ? 'Минимальная цена больше максимальной'
      : null;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsQuery(filters, priceError === null);

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

  const sortOptions = useMemo(
    () => [
      { value: '', label: filters.q ? 'По релевантности' : 'Сначала новые' },
      ...(filters.q ? [{ value: 'createdAt,desc', label: 'Сначала новые' }] : []),
      { value: 'createdAt,asc', label: 'Сначала старые' },
      { value: 'price,asc', label: 'Сначала дешевле' },
      { value: 'price,desc', label: 'Сначала дороже' },
    ],
    [filters.q]
  );

  useEffect(() => {
    if (!filters.q && form.values.sort === 'createdAt,desc') {
      form.setFieldValue('sort', '');
    }
  }, [filters.q, form.values.sort, form.setFieldValue]);

  useEffect(() => {
    const next = buildSearchParams({
      q: filters.q,
      category: filters.category,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      sort: filters.sort,
    });
    const current = new URLSearchParams(searchParams);

    if (next.toString() === current.toString()) {
      return;
    }

    setSearchParams(next, { replace: true });
  }, [
    filters.q,
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.sort,
    searchParams,
    setSearchParams,
  ]);

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
          <TextInput
            label="Поиск"
            size="sm"
            placeholder="Название или описание"
            rightSection={
              form.values.q ? (
                <CloseButton
                  aria-label="Очистить поиск"
                  onClick={() => form.setFieldValue('q', '')}
                />
              ) : null
            }
            {...form.getInputProps('q')}
          />

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
              error={priceError}
              onChange={(event) =>
                form.setFieldValue('priceMax', event.currentTarget.value.replace(/\D/g, ''))
              }
            />
          </SimpleGrid>

          <Select
            label="Сортировка"
            size="sm"
            allowDeselect={false}
            data={sortOptions}
            {...form.getInputProps('sort')}
          />
        </SimpleGrid>

        <Group justify="flex-end" gap={0}>
          <Anchor component="button" onClick={resetFilters} className={classes.resetLink}>
            Сбросить фильтры
          </Anchor>
        </Group>
      </Paper>

      {priceError ? (
        <Paper p="lg" radius="sm" withBorder ta="center">
          <Text fz={14} c="dimmed">
            Проверьте диапазон цены: минимальная цена больше максимальной.
          </Text>
        </Paper>
      ) : isLoading ? (
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
              {filters.q
                ? `По запросу «${filters.q}» ничего не найдено.`
                : 'По выбранным фильтрам товаров нет.'}
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
