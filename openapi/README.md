# OpenAPI

Здесь лежат копии спецификаций из репозитория `marketplace-Backend`:

- `auth.yaml` — `auth/resources/static/openapi/auth.yaml`;
- `catalog.yaml` — `catalog/resources/static/openapi/catalog.yaml`.

Обновление контракта:

1. Взять актуальные файлы из бэкенда или `GET /v3/api-docs` у запущенных сервисов.
2. Положить их сюда.
3. Выполнить `pnpm run gen:api`.

Сгенерированные клиенты лежат в `src/shared/api/generated/auth.ts` и
`src/shared/api/generated/catalog.ts`. Редактировать их руками нельзя —
изменения потеряются при следующей генерации.
