import { Box, Button, Container, Group, Skeleton, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/entities/user';
import { Formatter } from '@/shared/lib';
import classes from './Header.module.css';

const navLinks = [
  { link: '/', label: 'Обзор' },
  { link: '/catalog', label: 'Каталог' },
];

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        {/* Логотип */}
        <Link to="/" className={classes.brand}>
          <Text fw={600} fz={18}>
            Т-Маркет
          </Text>
        </Link>

        {/* Навигационные ссылки (СТРОГО СКРЫТЫ НА МОБИЛКЕ через visibleFrom="sm") */}
        <Group gap={6} className={classes.links} visibleFrom="sm">
          {navLinks.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className={`${classes.link} ${location.pathname === item.link ? classes.linkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </Group>

        {/* Блок пользователя (СТРОГО СКРЫТ НА МОБИЛКЕ через visibleFrom="sm") */}
        <Box visibleFrom="sm" className={classes.userGroup}>
          {isLoading ? (
            <Group gap={8}>
              <Skeleton height={14} width={70} radius="xs" />
              <Skeleton height={30} width={60} radius="sm" />
            </Group>
          ) : isAuthenticated && user ? (
            <Group gap={6} align="center" wrap="nowrap">
              <Link to="/profile" className={classes.userLink} title="Перейти в профиль">
                <Text fz={13} fw={500} style={{ whiteSpace: 'nowrap' }}>
                  {user.name}
                </Text>
                <Text className={classes.bonusText}>{Formatter.bonus(user.bonusBalance)}</Text>
              </Link>
            </Group>
          ) : (
            <Group gap={8}>
              <Button
                component={Link}
                to="/register"
                variant="subtle"
                color="gray"
                radius="sm"
                size="xs"
              >
                Регистрация
              </Button>
              <Button component={Link} to="/login" color="brandBlue" radius="sm" size="xs">
                Войти
              </Button>
            </Group>
          )}
        </Box>
      </Container>
    </header>
  );
}

export default Header;
