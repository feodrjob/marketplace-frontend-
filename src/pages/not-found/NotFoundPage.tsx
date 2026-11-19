import { Button, Container, Paper, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Container size={460} my={60} ta="center">
      <Paper p={32} radius="sm" withBorder bg="white">
        <Stack align="center" gap={12}>
          <Text fz={36} fw={600} c="brandBlue.6" lh={1}>
            404
          </Text>
          <Title order={2} fz={18} fw={600}>
            Страница не найдена
          </Title>
          <Text fz={13} c="dimmed">
            Запрашиваемый адрес не существует или был перемещён.
          </Text>
          <Button component={Link} to="/" color="brandBlue" radius="sm" size="sm" mt={8}>
            На главную
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default NotFoundPage;
