# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Base: General configuration
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Enable pnpm via corepack (avoids manual pnpm installation)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Required system tools
RUN apk add --no-cache bash git

# Metro variable for Expo (LAN resolution)
ARG REACT_NATIVE_PACKAGER_HOSTNAME
ENV REACT_NATIVE_PACKAGER_HOSTNAME=$REACT_NATIVE_PACKAGER_HOSTNAME

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Dependencies: Install monorepo dependencies
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS dependencies
WORKDIR /usr/src/app

# Copy only the files required for installation
# (optimizes Docker cache: if code changes but deps don't, no reinstall)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

COPY apps/employer-app/package.json ./apps/employer-app/
COPY apps/worker-app/package.json ./apps/worker-app/
COPY packages/koudmain-ui/package.json ./packages/koudmain-ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install all dependencies (frozen for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Build: Compile both apps via Turborepo
# ─────────────────────────────────────────────────────────────────────────────
FROM dependencies AS build
WORKDIR /usr/src/app

RUN pnpm turbo run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 4 — Build Employer only
# ─────────────────────────────────────────────────────────────────────────────
FROM dependencies AS build-employer
WORKDIR /usr/src/app

RUN pnpm turbo run build --filter=@koudmain/employer

# ─────────────────────────────────────────────────────────────────────────────
# Stage 5 — Build Worker only
# ─────────────────────────────────────────────────────────────────────────────
FROM dependencies AS build-worker
WORKDIR /usr/src/app

RUN pnpm turbo run build --filter=@koudmain/worker

# ─────────────────────────────────────────────────────────────────────────────
# Stage 6 — Development Employer
# ─────────────────────────────────────────────────────────────────────────────
FROM dependencies AS development-employer
WORKDIR /usr/src/app

# Expo Metro ports + dev tools
EXPOSE 19000 19001 19002 19003 19006 8082

CMD ["pnpm", "--filter", "@koudmain/employer", "start", "--", "--lan", "--go", "--port", "8082"]

# ─────────────────────────────────────────────────────────────────────────────
# Stage 7 — Development Worker
# ─────────────────────────────────────────────────────────────────────────────
FROM dependencies AS development-worker
WORKDIR /usr/src/app

EXPOSE 19000 19001 19002 19003 19006 8083

CMD ["pnpm", "--filter", "@koudmain/worker", "start", "--", "--lan", "--go", "--port", "8083"]

# ─────────────────────────────────────────────────────────────────────────────
# Stage 8 — Production Employer
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS production-employer
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/employer-app/package.json ./apps/employer-app/
COPY packages/koudmain-ui/package.json ./packages/koudmain-ui/

RUN pnpm install --frozen-lockfile --prod

COPY --from=build-employer /usr/src/app/apps/employer-app/dist ./apps/employer-app/dist

EXPOSE 8082

CMD ["node", "apps/employer-app/dist/index.js"]

# ─────────────────────────────────────────────────────────────────────────────
# Stage 9 — Production Worker
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS production-worker
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/worker-app/package.json ./apps/worker-app/
COPY packages/koudmain-ui/package.json ./packages/koudmain-ui/

RUN pnpm install --frozen-lockfile --prod

COPY --from=build-worker /usr/src/app/apps/worker-app/dist ./apps/worker-app/dist

EXPOSE 8083

CMD ["node", "apps/worker-app/dist/index.js"]
