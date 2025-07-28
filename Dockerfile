# Base stage with common settings
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Development dependencies installation
FROM base AS install
COPY package.json bun.lock ./
RUN bun install

# Production dependencies installation
FROM base AS install_prod
COPY package.json bun.lock ./
RUN bun install --production

# Build stage
FROM base AS build
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
COPY .env.prod .env

# Production stage
FROM base AS release
COPY --from=install_prod /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/ ./
COPY --from=build /usr/src/app/.env ./.env
RUN bun x prisma generate

# Set production environment
ENV NODE_ENV=production

# Use non-root user for security
USER bun

# Label
LABEL org.opencontainers.image.source https://github.com/xiro/xiro-discord-bot-music

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD bun run src/health.check.ts

# Start the application
CMD ["bun", "run", "src/index.ts"]