# ─────────────────────────────────────────────────────────────
# AetherOS Dashboard — Production Dockerfile
# Multi-stage build: Node (build) → Nginx (serve)
# Final image: ~25MB, no Node.js runtime in production
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .

# Pass build-time env vars (set via --build-arg or CI secrets)
ARG REACT_APP_ANTHROPIC_API_KEY
ENV REACT_APP_ANTHROPIC_API_KEY=$REACT_APP_ANTHROPIC_API_KEY

ARG REACT_APP_VERSION=4.0.0
ENV REACT_APP_VERSION=$REACT_APP_VERSION

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy entrypoint script for runtime env injection
COPY docker/entrypoint.sh /docker-entrypoint.d/40-inject-env.sh
RUN chmod +x /docker-entrypoint.d/40-inject-env.sh

# Security: run as non-root
RUN addgroup -g 1001 -S aetheros && \
    adduser -S -u 1001 -G aetheros aetheros && \
    chown -R aetheros:aetheros /usr/share/nginx/html && \
    chown -R aetheros:aetheros /var/cache/nginx && \
    chown -R aetheros:aetheros /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown aetheros:aetheros /var/run/nginx.pid

USER aetheros

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:80/health || exit 1

EXPOSE 80

LABEL maintainer="AetherOS"
LABEL version="4.0.0"
LABEL description="AetherOS Autonomous AI Platform Dashboard"
