# Т-Маркет — Frontend Базовый Шаблон (Base Scaffolding)

Репозиторий клиентской части маркетплейса «Т-Маркет».
Шаблон настроен под требования команды бэкенда и ментора курса.

---

## Технологический стек

- **UI-библиотека:** [Mantine v7](https://mantine.dev/) (`@mantine/core`, `@mantine/hooks`)
- **Стейт данных:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Сетевой клиент:** [Axios](https://axios-http.com/) с интерцепторами, очередью запросов и silent refresh
- **Клиентская маршрутизация:** [React Router v7](https://reactrouter.com/)
- **Сборщик:** [Vite](https://vite.dev/) + React 18 + TypeScript 5
- **Архитектура:** Feature-Sliced Design (FSD)

---

## Согласованный API Контракт

Полный текст утверждённого контракта между фронтендом и бэкендом зафиксирован в:
**[`docs/api-contract.md`](./docs/api-contract.md)**

### Краткая выжимка договорённостей:

1. **Аутентификация (JWT + Silent Refresh):**
   - `accessToken` сохраняется в `localStorage` для мгновенного восстановления сессии при F5.
   - `refreshToken` передаётся бэкендом в защищённой `HttpOnly; Secure; SameSite=Strict` Cookie с директивой `Path=/api/v1/auth`.
   - При 401 перехватчик Axios автоматически запрашивает новый токен через `POST /api/v1/auth/refresh`.
2. **Разделение сущностей пользователей и организаций:**
   - `User` — физлицо (покупатель).
   - Кабинет продавца вынесен в отдельную сущность `Organization` (магазин/юрлицо), к которой сотрудники подключаются через `OrganizationMember` с ролями (CASL).
3. **Единый контракт обработки ошибок (RFC 7807):**
   - Ошибки полей форм: статус `422 Unprocessable Entity` с объектом `"details": { "fieldName": "текст" }`.
   - Общие бизнес-ошибки: статус `400/409/500` с `title` / `detail` для вывода во всплывающие тосты.
4. **Фильтрация и пагинация каталога:**
   - Формат запроса: `GET /api/v1/products?f[category]=electronics&f[price]=1000,25000&sort=price,asc`.
   - Для бесконечной ленты каталога используется курсорная пагинация (`cursor=...&limit=20`).

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
