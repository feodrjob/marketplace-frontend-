import { Button, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from '@/entities/user';
import classes from './HomePage.module.css';

const FEATURES = [
  {
    title: 'Каталог без регистрации',
    text: 'Смотрите товары, цены и магазины продавцов без входа в аккаунт.',
  },
  {
    title: 'Цены в рублях',
    text: 'Стоимость указана в карточке товара, без сюрпризов на последнем шаге.',
  },
  {
    title: 'Продавцам',
    text: 'Создайте профиль продавца и публикуйте товары в каталоге.',
  },
] as const;

export function HomePage() {
  const { isAuthenticated, isSeller } = useAuth();

  return (
    <Stack gap={28}>
      <Paper className={classes.heroCard} withBorder radius="sm">
        <Title order={1} className={classes.title}>
          Т-Маркет
        </Title>
        <Text className={classes.description}>
          Маркетплейс с товарами продавцов. Найдите нужное в каталоге или разместите свои товары.
        </Text>

        <Group mt="lg" gap="sm">
          <Button component={Link} to="/catalog" color="brandBlue" radius="sm" h={44}>
            Перейти в каталог
          </Button>

          {isSeller ? (
            <Button component={Link} to="/seller/products/new" variant="default" radius="sm" h={44}>
              Добавить товар
            </Button>
          ) : !isAuthenticated ? (
            <Button component={Link} to="/register/seller" variant="default" radius="sm" h={44}>
              Стать продавцом
            </Button>
          ) : null}
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {FEATURES.map((feature) => (
          <Paper key={feature.title} withBorder radius="sm" p="md" bg="white">
            <Text fw={600} fz={14}>
              {feature.title}
            </Text>
            <Text fz={13} c="dimmed" mt={4}>
              {feature.text}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default HomePage;
