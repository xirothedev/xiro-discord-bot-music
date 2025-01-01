# Base stage with common settings
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Development dependencies installation
FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Production dependencies installation
FROM base AS install_prod
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Build stage
FROM base AS build
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
COPY .env.prod .env
COPY ./bots.prod.json ./bots.json

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

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD bun run src/health.check.ts

# Start the application
CMD ["bun", "run", "src/index.ts"]