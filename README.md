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

### 4. Запуск в Docker

Сборка и запуск контейнера через Docker Compose:

```bash
cp .env.example .env   # при необходимости поправь BACKEND_URL и FRONTEND_PORT
docker compose up --build -d
```

Приложение будет доступно по адресу `http://localhost:8082`.

Или стандартными командами Docker CLI:

```bash
# Сборка multi-stage образа
docker build -t marketplace-frontend:latest .

# Запуск контейнера
docker run -d -p 8082:80 \
  --add-host host.docker.internal:host-gateway \
  -e BACKEND_URL=http://host.docker.internal:8080 \
  --name marketplace-frontend marketplace-frontend:latest
```

#### Переменные окружения

| Переменная | Тип | Где задаётся | Назначение |
|---|---|---|---|
| `BACKEND_URL` | runtime | `docker compose` / `docker run -e` | Адрес API Gateway, на который nginx проксирует `/api/*`. Меняется без пересборки образа |
| `FRONTEND_PORT` | runtime | `.env` для compose | Порт фронтенда на хосте (по умолчанию `8082`) |
| `VITE_USE_MOCKS` | build-time | `build.args` / `--build-arg` | Включает моки API. В Docker-образе всегда `false` |
| `VITE_API_URL` | build-time | `--build-arg` (опционально) | Базовый URL API. Обычно не нужен: используется относительный `/api/v1` |

Почему так:

- **`VITE_*` — compile-time.** Vite вшивает значения в JS на этапе `vite build`, поэтому они передаются только build-аргументами. `docker run -e VITE_...` на собранный образ не влияет.
- **`BACKEND_URL` — runtime.** Nginx при старте контейнера подставляет его в `nginx.conf.template` через `envsubst`. Один и тот же образ работает в dev/stage/prod, а смена бэкенда — это перезапуск контейнера без пересборки и повторного пуша в ghcr.
- **Cookies и CORS.** Фронтенд и API находятся на одном origin (`/api/v1`), поэтому HttpOnly-cookie с refresh-токеном работает без настройки CORS и `SameSite`.

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
