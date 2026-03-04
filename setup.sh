#!/bin/bash
# ─────────────────────────────────────────────────────────────
# AetherOS — First-Time Setup Script
# Usage: ./scripts/setup.sh
# ─────────────────────────────────────────────────────────────

set -e

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║     AetherOS — First-Time Setup       ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# ── Check requirements ───────────────────────────────────────
echo "Checking requirements..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js 18+ is required: https://nodejs.org"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "❌ npm is required"; exit 1; }

NODE_VER=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"

# ── Set up environment ───────────────────────────────────────
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
  echo ""
  echo "⚠️  ACTION REQUIRED:"
  echo "   Open .env and add your Anthropic API key:"
  echo "   REACT_APP_ANTHROPIC_API_KEY=sk-ant-..."
  echo "   Get one at: https://console.anthropic.com"
  echo ""
else
  echo "✅ .env already exists"
fi

# ── Install dependencies ─────────────────────────────────────
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# ── Make scripts executable ──────────────────────────────────
chmod +x scripts/deploy.sh scripts/setup.sh 2>/dev/null || true

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  Setup complete! To start:            ║"
echo "║                                       ║"
echo "║    npm start                          ║"
echo "║                                       ║"
echo "║  Opens at: http://localhost:3000      ║"
echo "╚═══════════════════════════════════════╝"
echo ""
