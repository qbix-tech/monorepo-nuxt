###########################
#     BASE CONTAINER      #
###########################
# FROM node:22-alpine AS base
FROM node:22-alpine AS base

# provide ability to do health checks with `curl`
RUN apk --no-cache add curl

###########################
#   INSTALLER CONTAINER   #
###########################
FROM base AS installer

# Increase the max old space size for Node.js to handle larger memory requirements
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Setup corepack and pnpm – see https://pnpm.io/docker
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# disable corepack integrity keys
# see: https://github.com/nodejs/corepack/issues/625
ENV COREPACK_INTEGRITY_KEYS=0

WORKDIR /app

# disable husky from installing hooks
ENV HUSKY=0
ENV DOCKER_OUTPUT=1

# nx workspace
COPY nx.json ./
ENV NX_SKIP_NX_CACHE=true

# root workspace
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# packages workspace
COPY packages/utils/package.json packages/utils/
COPY packages/storage/package.json packages/storage/
COPY packages/database/package.json packages/database/

# workers workspace
COPY workers/database-manager/package.json workers/database-manager/

# PNPM install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# packages workspace
COPY packages/utils packages/utils
COPY packages/storage packages/storage
COPY packages/database packages/database

# workers workspace
COPY workers/database-manager workers/database-manager

###########################
#    BUILDER CONTAINER    #
###########################
FROM installer AS builder

RUN pnpm build:database-manager

###########################
#      APP CONTAINER      #
###########################
FROM base AS database-manager
COPY --from=builder /app/workers/database-manager/.output /app/.output

ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80
ENV NODE_ENV=production

ENTRYPOINT ["node", "/app/.output/server/index.mjs" ]
