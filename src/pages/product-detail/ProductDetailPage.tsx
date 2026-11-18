import { Anchor, Button, Divider, Group, Paper, Skeleton, Stack, Text, Title } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import { getProductCategoryLabel, useProductQuery } from '@/entities/product';
import { Formatter, getErrorMessage } from '@/shared/lib';
import classes from './ProductDetailPage.module.css';

export function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error, refetch, isFetching } = useProductQuery(id);

  const backLink = (
    <Anchor component={Link} to="/catalog" className={classes.backLink}>
      ← Каталог
    </Anchor>
  );

  if (isLoading) {
    return (
      <Stack gap={20}>
        {backLink}
        <div className={classes.layout}>
          <Skeleton className={classes.imageSkeleton} radius="sm" />
          <Stack gap="sm">
            <Skeleton height={14} width={110} />
            <Skeleton height={30} width="75%" />
            <Skeleton height={26} width={170} />
            <Skeleton height={12} width={140} mt="sm" />
            <Skeleton height={72} mt="sm" />
          </Stack>
        </div>
      </Stack>
    );
  }

  if (isError || !product) {
    return (
      <Stack gap={20}>
        {backLink}
        <Paper p="lg" radius="sm" withBorder ta="center">
          <Stack align="center" gap="sm">
            <Text fz={14} c="dimmed">
              {getErrorMessage(error, 'Не удалось загрузить товар')}
            </Text>
            <Group gap="sm">
              <Button
                variant="default"
                size="sm"
                h={44}
                onClick={() => void refetch()}
                loading={isFetching}
              >
                Повторить
              </Button>
              <Button component={Link} to="/catalog" size="sm" h={44} color="brandBlue">
                Вернуться в каталог
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    );
  }

  const sellerName = product.seller.companyName ?? 'Магазин';

  return (
    <Stack gap={20}>
      {backLink}

      <div className={classes.layout}>
        <div className={classes.image}>
          <span className={classes.imageLabel}>Без фото</span>
        </div>

        <div>
          <Text className={classes.category}>{getProductCategoryLabel(product.category)}</Text>
          <Title order={1} className={classes.title}>
            {product.title}
          </Title>
          <Text className={classes.price}>{Formatter.bonus(product.price)}</Text>

          <Divider my="md" />

          <Text className={classes.metaLabel}>Продавец</Text>
          <Text className={classes.metaValue}>{sellerName}</Text>

          <Divider my="md" />

          <Text className={classes.metaLabel}>Описание</Text>
          <Text className={classes.description}>
            {product.description ?? 'Продавец не добавил описание.'}
          </Text>
        </div>
      </div>
    </Stack>
  );
}

export default ProductDetailPage;
