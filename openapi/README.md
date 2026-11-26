# OpenAPI

`auth.yaml` — копия спецификации Auth Service из репозитория `marketplace-Backend`.

Обновление контракта:

1. Взять актуальный `auth/resources/static/openapi/auth.yaml` из бэкенда
   или `GET /v3/api-docs` у запущенного Auth Service.
2. Положить файл сюда.
3. Выполнить `pnpm run gen:api`.

Сгенерированный клиент лежит в `src/shared/api/generated/auth.ts`.
Редактировать его руками нельзя — изменения потеряются при следующей генерации.
