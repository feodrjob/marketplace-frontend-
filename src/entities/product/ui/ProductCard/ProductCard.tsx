import { Card, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Formatter } from '@/shared/lib';
import { getProductCategoryLabel } from '../../model/categories';
import type { Product } from '../../model/types';
import classes from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const sellerName = product.seller.companyName ?? 'Магазин';

  return (
    <Card
      component={Link}
      to={`/product/${product.id}`}
      state={{ fromCatalog: true }}
      padding="sm"
      radius="sm"
      withBorder
      className={classes.card}
    >
      <Card.Section>
        <div className={classes.image}>
          <span className={classes.imageLabel}>Без фото</span>
        </div>
      </Card.Section>

      <Text className={classes.category}>{getProductCategoryLabel(product.category)}</Text>
      <Text className={classes.title} lineClamp={2}>
        {product.title}
      </Text>
      {product.description ? (
        <Text className={classes.description} lineClamp={2}>
          {product.description}
        </Text>
      ) : null}
      <Text className={classes.seller} lineClamp={1}>
        {sellerName}
      </Text>
      <Text className={classes.price}>{Formatter.price(product.price)}</Text>
    </Card>
  );
}
