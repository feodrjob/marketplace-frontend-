# Деплой frontend по примеру ментора

Build после проверок публикует образ ghcr.io/feodrjob/marketplace-frontend с тегами
latest и SHA. Deploy (.github/workflows/deploy-swarm.yml) запускается через workflow_run после успешного Build для
main, копирует infra/app-stack.yml в /opt/marketplace и выполняет docker stack deploy
для общего стека marketplace. Используется существующий secret DEPLOY_SSH_KEY и
GitHub environment production.

Конфигурация приложения совпадает с infra/app-stack.yml backend-репозитория.
Обе копии поддерживать одинаковыми. Каждый Deploy применяет весь общий стек,
используя образы и параметры из серверного /opt/marketplace/.env.

Traefik, .env, сети и существующий том PostgreSQL предварительно готовятся по
инструкции infra/README.md backend-репозитория. Новый frontend не публикует порт
8082: вход выполняется через Traefik на https://87.242.102.190.nip.io.
Backend nginx upstream внутри стека — http://auth:8081, браузер использует /api/v1.
Catalog временно выключен. Локальный docker-compose.yml остаётся для разработки.
