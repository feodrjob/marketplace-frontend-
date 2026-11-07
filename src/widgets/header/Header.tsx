import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Group, Box, Button, Skeleton, Text } from "@mantine/core";
import { useAuth } from "@/entities/user";
import classes from "./Header.module.css";

const navLinks = [
  { link: "/", label: "Обзор" },
  { link: "/catalog", label: "Каталог" },
];

export function Header() {
  const { user, isAuthenticated, isInitializing, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        {/* Логотип */}
        <Link to="/" className={classes.brand}>
          <Text fw={600} fz={18} c="#111827">
            Т-Маркет
          </Text>
        </Link>

        {/* Навигационные ссылки (СТРОГО СКРЫТЫ НА МОБИЛКЕ через visibleFrom="sm") */}
        <Group gap={6} className={classes.links} visibleFrom="sm">
          {navLinks.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className={`${classes.link} ${location.pathname === item.link ? classes.linkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </Group>

        {/* Блок пользователя (СТРОГО СКРЫТ НА МОБИЛКЕ через visibleFrom="sm") */}
        <Box visibleFrom="sm" className={classes.userGroup}>
          {isInitializing ? (
            <Group gap={8}>
              <Skeleton height={14} width={70} radius="xs" />
              <Skeleton height={30} width={60} radius="sm" />
            </Group>
          ) : isAuthenticated && user ? (
            <Group gap={6} align="center" wrap="nowrap">
              <Link
                to="/profile"
                className={classes.userLink}
                title="Перейти в профиль"
              >
                <Text
                  fz={13}
                  fw={500}
                  c="#111827"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {user.name}
                </Text>
                <Text className={classes.bonusText}>
                  {user.bonusBalance.toLocaleString("ru-RU")} бонусов
                </Text>
              </Link>
            </Group>
          ) : (
            <Group gap={8}>
              <Button
                variant="subtle"
                color="gray"
                radius="sm"
                size="xs"
                onClick={() => navigate("/register")}
              >
                Регистрация
              </Button>
              <Button
                color="brandBlue"
                radius="sm"
                size="xs"
                onClick={() => navigate("/login")}
              >
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
