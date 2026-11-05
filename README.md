# Т-Маркет — Frontend Базовый Шаблон (Base Scaffolding)

Репозиторий клиентской части маркетплейса «Т-Маркет».
Шаблон настроен под требования команды бэкенда и ментора курса.

---

## Технологический стек

- **UI-библиотека:** [Mantine v7](https://mantine.dev/) (`@mantine/core`, `@mantine/hooks`)
- **Сетевой клиент:** [Axios](https://axios-http.com/) с интерцепторами, очередью запросов и In-Memory авторизацией
- **Клиентская маршрутизация:** [React Router v7](https://reactrouter.com/)
- **Сборщик:** [Vite](https://vite.dev/) + React 18 + TypeScript 5
- **Архитектура:** Feature-Sliced Design (FSD)

---

## Согласованный API Контракт

Полный текст утверждённого контракта между фронтендом и бэкендом зафиксирован в:
**[`docs/api-contract.md`](./docs/api-contract.md)**

### Краткая выжимка договорённостей:

1. **Аутентификация (In-Memory Access Token + Silent Refresh):**
   - `accessToken` хранится **строго в оперативной памяти** приложения (JS closure), в `localStorage` не сохраняется (защита от XSS).
   - `refreshToken` передаётся бэкендом в `HttpOnly; Secure; SameSite=Strict` Cookie с директивой `Path=/api/v1/auth`.
   - При F5 или получении 401 перехватчик Axios автоматически запрашивает новый токен через `POST /api/v1/auth/refresh`.
   - Защита от мигания интерфейса (FOUS) реализована через Mantine `<Skeleton />` при первичном старте.
2. **Разделение сущностей пользователей:**
   - Единая учётная запись `User`, к которой привязаны `BuyerProfile` (обязательный) и `SellerProfile` (опциональный).
   - Защита от самопокупки на уровне валидации `seller_id`.
3. **Фильтрация и пагинация каталога:**
   - Формат запроса: `GET /api/v1/products?f[category]=electronics&f[price]=1000,25000&sort=price,asc`.
   - Для бесконечного скролла используется курсорная пагинация (`cursor=...&limit=20`).

---

## Быстрый старт

### 1. Установка зависимостей

```bash
pnpm install
# или npm install
```

### 2. Запуск локального сервера разработки

```bash
pnpm run dev
# или npm run dev
```

Приложение откроется по адресу `http://localhost:3000`.

### 3. Сборка для продакшена

```bash
pnpm run build
```

---

## Структура проекта (Feature-Sliced Design)

```text
src/
├── app/                  # Инициализация приложения, провайдеры (MantineProvider), роутер
│   ├── providers/        # Обёртка AppProviders (Mantine + Auth + Router)
│   ├── router/           # AppRouter с маршрутами
│   └── App.tsx           # Корневой лейаут (Header + Content + Footer)
├── pages/                # Страницы маркетплейса
│   ├── home/             # Главная страница
│   ├── catalog/          # Каталог с фильтрами по контракту
│   ├── login/            # Форма входа
│   └── not-found/        # 404
├── widgets/              # Композиционные блоки (Header, Footer)
├── entities/             # Бизнес-сущности (user / AuthContext)
├── shared/               # Переиспользуемый код
│   └── api/              # Сконфигурированный Axios-клиент (client.ts)
├── theme.ts              # Конфигурация темы Mantine Т-Банка
├── main.tsx              # Точка монтирования React
└── index.css             # Глобальные базовые стили
```
