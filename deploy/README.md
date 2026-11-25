# Frontend в Docker Swarm

Push в **main** запускает `build.yml`: CI → образ GHCR с тегом commit SHA →
SSH-деплой `marketplace-frontend`. Обновление фронтенда не меняет backend/data/edge.
Ветка `codex/swarm-deploy` только проверяет и публикует образ, без деплоя.

Адрес: `https://87.242.102.190.nip.io`. TLS обслуживает Traefik, API использует
относительный `/api/v1`. Auth/users направляются Traefik прямо в backend;
BACKEND_URL nginx указывает на `marketplace-backend_auth:8081` в overlay-сети.
Порт frontend наружу не публикуется, host.docker.internal не используется.

Предварительно на VM должны быть выполнены prepare.sh/cutover.sh из backend
репозитория и развернут backend. Создаются общая сеть `marketplace-edge` и marker
`~/.marketplace-swarm/ready`. БД и Traefik фронтенд pipeline не изменяет.

Actions secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`,
`DEPLOY_KNOWN_HOSTS`. Variables: `DEPLOY_PORT` (22), `APP_DOMAIN`
(`87.242.102.190.nip.io`). Токен GHCR берётся из github.token, получает
packages:read и передаётся по SSH stdin, временный Docker config удаляется.
Package должен разрешать Actions access этому репозиторию.

Образы скачиваются перед stack deploy. release.sh ждёт обновление и HTTP 200
по HTTPS с проверкой сертификата; при ошибке возвращает предыдущий успешный
manifest и завершает job ошибкой. Проверка / не заменяет функциональные проверки
авторизации и каталога. Catalog временно выключен на стороне backend.

Успешные спецификации и SHA: `~/.marketplace-swarm/marketplace-frontend.*`.
Старые образы нужны для отката. Токен Actions истекает: для новых Swarm-узлов или
после удаления локального кеша понадобится долговременный read:packages token.

Локальный `docker-compose.yml` сохраняет прежний способ разработки. На VM
его параллельно с новым деплоем не запускать.
