FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS install_prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

FROM base AS release
COPY --from=install_prod /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/ .

RUN bun db:migrate

USER bun
ENTRYPOINT [ "bun", "run", "src/product.index.ts" ]