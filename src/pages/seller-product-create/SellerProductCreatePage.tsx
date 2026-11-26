import { Anchor, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { CreateProductForm } from '@/features/product-create';
import classes from './SellerProductCreatePage.module.css';

export function SellerProductCreatePage() {
  return (
    <Stack gap={20} maw={640}>
      <Anchor component={Link} to="/profile" className={classes.backLink}>
        ← Профиль
      </Anchor>

      <div>
        <Title order={1} className={classes.title}>
          Новый товар
        </Title>
        <Text className={classes.subtitle}>
          Заполните карточку — товар сразу появится в каталоге.
        </Text>
      </div>

      <CreateProductForm />

      <Text fz={12} c="dimmed">
        Загрузка фото появится в следующем релизе: пока товар публикуется без изображения.
      </Text>
    </Stack>
  );
}

export default SellerProductCreatePage;
