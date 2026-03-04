#!/bin/bash
# ─────────────────────────────────────────────────────────────
# AetherOS — Deployment Script
# Usage: ./scripts/deploy.sh [production|staging]
# ─────────────────────────────────────────────────────────────

set -euo pipefail

ENV=${1:-production}
VERSION=$(node -p "require('./package.json').version")
IMAGE="aetheros-dashboard"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  AetherOS — Deployment Script v$VERSION"
echo "║  Target: $ENV | $TIMESTAMP"
echo "╚═══════════════════════════════════════╝"
echo ""

# ── Pre-flight checks ────────────────────────────────────────
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v node   >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }

if [ ! -f ".env" ] && [ ! -f ".env.production" ]; then
  echo "⚠️  Warning: No .env file found. Copy .env.example to .env and configure it."
fi

# ── Run tests ────────────────────────────────────────────────
echo "🧪 Running test suite..."
npm run test:ci
echo "✅ Tests passed"

# ── Build production bundle ──────────────────────────────────
echo "📦 Building production bundle..."
npm run build
echo "✅ Build complete: $(du -sh build/ | cut -f1)"

# ── Build Docker image ───────────────────────────────────────
echo "🐳 Building Docker image: $IMAGE:$VERSION..."
docker build \
  --target production \
  --build-arg REACT_APP_VERSION="$VERSION" \
  --build-arg REACT_APP_ANTHROPIC_API_KEY="${REACT_APP_ANTHROPIC_API_KEY:-}" \
  -t "$IMAGE:$VERSION" \
  -t "$IMAGE:latest" \
  .
echo "✅ Docker image built: $IMAGE:$VERSION"

# ── Deploy ───────────────────────────────────────────────────
if [ "$ENV" = "production" ]; then
  echo "🚀 Deploying to production..."
  docker-compose -f docker-compose.prod.yml down --remove-orphans
  docker-compose -f docker-compose.prod.yml up -d
  echo "✅ Deployed to production — http://localhost:80"
else
  echo "🚀 Deploying to staging..."
  docker-compose up --build -d
  echo "✅ Deployed to staging — http://localhost:3000"
fi

# ── Health check ─────────────────────────────────────────────
echo "🏥 Running health check..."
sleep 5
PORT=$( [ "$ENV" = "production" ] && echo 80 || echo 3000 )
curl -sf "http://localhost:$PORT/health" >/dev/null && \
  echo "✅ Health check passed" || \
  echo "⚠️  Health check failed — check logs with: docker logs aetheros-prod"

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  ✓ AetherOS $VERSION deployed ($ENV)"
echo "╚═══════════════════════════════════════╝"
echo ""
