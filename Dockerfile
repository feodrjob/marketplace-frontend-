# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Install dependencies with layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Compile-time env. Vite вшивает VITE_* в бандл на этапе сборки,
# поэтому такие значения передаются build-arg'ами.
# Адрес API здесь не нужен: фронтенд ходит на относительный /api/v1,
# а на бэкенд его проксирует nginx (см. BACKEND_URL в runner-стадии).
ARG VITE_USE_MOCKS=false
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS

# Copy source code and build production assets
COPY . .
RUN pnpm run build

# ==========================================
# Stage 2: Production runtime stage
# ==========================================
FROM nginx:1.27-alpine AS runner

# Runtime env. Читается nginx при старте контейнера (envsubst),
# поэтому смена адреса бэкенда не требует пересборки образа.
ENV BACKEND_URL=http://host.docker.internal:8080

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Официальный образ nginx подставит BACKEND_URL в шаблон при старте
# и положит результат в /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose standard HTTP port
EXPOSE 80

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
