# AetherOS — Autonomous AI Platform Dashboard

> Manage your AI agent workforce, projects, finances, and clients from one command center.

![Version](https://img.shields.io/badge/version-4.0.0-gold)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-silver)

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Docker](#docker)
8. [CI/CD](#cicd)
9. [Pages & Features](#pages--features)
10. [Keyboard Shortcuts](#keyboard-shortcuts)
11. [Architecture](#architecture)
12. [Deployment](#deployment)
13. [Security](#security)
14. [Troubleshooting](#troubleshooting)

---

## Overview

AetherOS is a production-grade single-page React application for managing an autonomous AI software company. One human CEO oversees 10+ AI agents that autonomously handle architecture, development, QA, DevOps, security, analytics, finance, design, and sales.

**Key capabilities:**

- 15 fully interactive pages
- Live Claude-powered AI assistant (Anthropic API)
- Real-time agent command terminal
- Drag-and-drop Kanban sprint board
- Animated CI/CD pipeline & deploy flows
- LLM benchmark leaderboard + radar chart
- Multi-tenant SaaS client management
- Real CSV exports (analytics, financials, audit)
- Security scan with animated 6-stage output
- Custom integration builder (webhooks)
- Danger zone with typed confirmation
- Production Docker + Nginx setup

---

## Folder Structure

```
aetheros-dashboard/
│
├── .github/
│   └── workflows/
│       ├── ci.yml              ← Test + build on every push
│       └── deploy.yml          ← Build, push to registry, deploy
│
├── docker/
│   ├── nginx.conf              ← Nginx config (gzip, security headers, SPA routing)
│   └── entrypoint.sh           ← Runtime env var injection into built JS
│
├── public/
│   ├── index.html              ← HTML shell with meta tags, PWA, preconnect
│   ├── manifest.json           ← PWA manifest
│   ├── favicon.svg             ← SVG favicon (no bitmap needed)
│   └── robots.txt              ← Disallow all crawlers (private platform)
│
├── scripts/
│   ├── setup.sh                ← First-time setup (env, npm install)
│   └── deploy.sh               ← Full deploy: test → build → docker → up
│
├── src/
│   ├── App.jsx                 ← Main application (~3000 lines, all 15 pages)
│   ├── App.test.js             ← Jest + React Testing Library tests
│   ├── index.js                ← React root mount + Web Vitals
│   └── reportWebVitals.js      ← Core Web Vitals reporter
│
├── .dockerignore               ← Exclude dev files from Docker build context
├── .env.example                ← Environment variable template (commit this)
├── .env.production             ← Production defaults without secrets (commit)
├── .gitignore                  ← Git ignore rules
├── CHANGELOG.md                ← Version history
├── Dockerfile                  ← Multi-stage: Node (build) → Nginx (serve)
├── docker-compose.yml          ← Development compose (hot reload)
├── docker-compose.prod.yml     ← Production compose (Nginx, restart policy)
├── LICENSE                     ← MIT
├── package.json                ← Dependencies + scripts
└── README.md                   ← This file
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 18.0 | JavaScript runtime |
| npm | ≥ 9.0 | Package manager |
| Docker | ≥ 24.0 | Containerised deployment |
| Git | any | Version control |

---

## Quick Start

### 1. Clone and setup

```bash
git clone https://github.com/your-org/aetheros-dashboard.git
cd aetheros-dashboard

# Automated first-time setup
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or manually:

```bash
cp .env.example .env
# Edit .env — add your Anthropic API key
npm install
```

### 2. Add your API key

Open `.env` and set:

```env
REACT_APP_ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

### 3. Start development server

```bash
npm start
# Opens http://localhost:3000
```

### 4. Build for production

```bash
npm run build
# Output in /build — ready to deploy
```

---

## Environment Variables

All environment variables must be prefixed with `REACT_APP_` to be bundled by Create React App.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_ANTHROPIC_API_KEY` | Yes* | — | Anthropic API key for AI Chat. App works without it but AI chat will show an error. |
| `REACT_APP_VERSION` | No | `4.0.0` | App version shown in Settings → Platform Info |
| `REACT_APP_ENV` | No | `development` | Environment label |
| `REACT_APP_ENABLE_AI_CHAT` | No | `true` | Feature flag to disable AI Chat entirely |
| `REACT_APP_ENABLE_DEMO_MODE` | No | `false` | Demo mode (future use) |

> **Security note:** In production, inject the API key at Docker run-time (not build-time) using the `entrypoint.sh` approach to avoid baking secrets into the image layer.

---

## Available Scripts

```bash
npm start           # Dev server with hot reload — http://localhost:3000
npm run build       # Production build → /build
npm test            # Interactive test watcher
npm run test:ci     # Non-interactive test run (for CI)
npm run analyze     # Bundle size analysis (requires source-map-explorer)

# Docker shortcuts
npm run docker:build          # docker build -t aetheros-dashboard .
npm run docker:run            # docker run -p 3000:80 aetheros-dashboard
npm run docker:compose        # docker-compose up --build (development)
npm run docker:compose:prod   # docker-compose -f docker-compose.prod.yml up --build -d
```

---

## Docker

### Development (hot reload)

```bash
docker-compose up --build
# App available at http://localhost:3000
# Source code is mounted — changes auto-reload
```

### Production (Nginx)

```bash
docker-compose -f docker-compose.prod.yml up --build -d
# App available at http://localhost:80
```

### Manual build and run

```bash
# Build
docker build \
  --build-arg REACT_APP_ANTHROPIC_API_KEY=sk-ant-... \
  -t aetheros-dashboard:4.0.0 .

# Run
docker run -d \
  --name aetheros \
  -p 80:80 \
  --restart unless-stopped \
  aetheros-dashboard:4.0.0
```

### What's inside the Nginx container

- **gzip compression** — all JS/CSS/JSON compressed
- **Security headers** — X-Frame-Options, CSP, X-Content-Type-Options, HSTS
- **Static asset caching** — content-hashed JS/CSS cached 1 year; HTML never cached
- **SPA routing** — all routes fallback to `index.html`
- **Health check endpoint** — `GET /health` returns `200 healthy`
- **Non-root user** — runs as `aetheros` (uid 1001)

---

## CI/CD

### GitHub Actions Workflows

#### `ci.yml` — Runs on every push and PR

1. **Lint & Test** — `npm run test:ci` with coverage
2. **Production Build** — `npm run build`, reports bundle size
3. **Docker Build** — Builds image, runs health check (main branch only)

#### `deploy.yml` — Runs on push to main or version tags

1. Logs into GitHub Container Registry (GHCR)
2. Builds and pushes image with semantic version tags
3. (Uncomment SSH deploy block to auto-deploy to your server)

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (injected at build time) |
| `DEPLOY_HOST` | Server IP/hostname (optional, for SSH deploy) |
| `DEPLOY_USER` | SSH username (optional) |
| `DEPLOY_SSH_KEY` | Private SSH key (optional) |

---

## Pages & Features

| Page | Route Key | Description |
|------|-----------|-------------|
| **Overview** | `dashboard` | KPI cards, agent roster, activity feed, roadmap |
| **Agents** | `agents` | Spawn modal, pause/stop with state mutation, task log stream |
| **Projects** | `projects` | Portfolio, logs modal, CI/CD pipeline viewer, deploy animation |
| **Approvals** | `approvals` | Decision queue, details modal with agent output preview |
| **Task Queue** | `tasks` | Drag-and-drop Kanban, add task modal, sprint progress |
| **Terminal** | `terminal` | Agent CLI, command history, animated responses |
| **BI Analytics** | `analytics` | Revenue charts, throughput, agent leaderboard, CSV export |
| **Financials** | `financials` | 12-month forecast, unit economics, CSV export |
| **Benchmarks** | `benchmarks` | LLM comparison, animated benchmark runner, radar chart |
| **SaaS Clients** | `clients` | Multi-tenant grid, onboard modal, plan upgrade, MRR tracking |
| **RAG Memory** | `memory` | Semantic search, compact DB animation |
| **Security** | `security` | Threat feed, compliance bars, animated 6-stage security scan |
| **Audit Log** | `audit` | Filterable event trail, real CSV export |
| **Integrations** | `integrations` | Connect/settings modals, custom webhook builder |
| **Settings** | `settings` | Dirty-state tracking, save confirmation, danger zone with CONFIRM gate |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open Command Palette |
| `Escape` | Close any overlay |
| `↑` `↓` | Navigate Command Palette |
| `Enter` | Execute selected command |
| `↑` `↓` (Terminal) | Cycle command history |

---

## Architecture

### Technology Stack

| Layer | Choice | Why |
|-------|--------|-----|
| UI Framework | React 18 | Hooks, concurrent features |
| Build Tool | Create React App | Zero-config, production-optimised |
| Styling | CSS Custom Properties (in-JS) | No build step, scoped tokens |
| Charts | Custom SVG | No dependency, full control |
| Drag & Drop | HTML5 native API | No library needed |
| AI Integration | Anthropic API (fetch) | Direct, no SDK bloat |
| Server | Nginx 1.25 alpine | ~25MB image, fast, configurable |
| Containerisation | Docker multi-stage | Builder (Node) → Serve (Nginx) |

### Design System

```
Fonts:     Cormorant Garamond (headings) · Syne (labels) · DM Mono (body/code)
Palette:   --ink: #080810 (background)
           --gold: #c9a84c (primary accent)
           --cream: #f0e8d5 (text)
           --success: #3ecf8e
           --warn: #f5a623
           --danger: #e55353
           --accent: #7c6af7
Radius:    --r: 12px
```

### State Management

No external state library — all state is managed with React hooks:

- `useState` — all page, modal, form, and animation state
- `useEffect` — side effects (API calls, timers, keyboard listeners)
- `useCallback` — memoised event handlers (toast, terminal getResponse)
- `useMemo` — derived data (filtered lists, sorted tables)
- `useRef` — DOM references (scroll containers, input focus)

---

## Deployment

### Option 1: Docker (recommended)

```bash
./scripts/deploy.sh production
```

### Option 2: Static hosting (Vercel, Netlify, S3+CloudFront)

```bash
npm run build
# Upload /build directory to your host
```

**Vercel:**
```bash
npx vercel --prod
```

**Netlify:**
```bash
npx netlify deploy --prod --dir=build
```

**AWS S3 + CloudFront:**
```bash
aws s3 sync build/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Option 3: Traditional server (Nginx)

```bash
npm run build
sudo cp -r build/* /var/www/aetheros/
# Copy docker/nginx.conf to /etc/nginx/sites-available/aetheros
sudo nginx -t && sudo systemctl reload nginx
```

---

## Security

### What's built in

- **CSP headers** — restricts script/style/connect sources via Nginx
- **X-Frame-Options: SAMEORIGIN** — prevents clickjacking
- **Non-root Docker user** — container runs as uid 1001
- **No secrets in image layers** — API key injected at runtime via entrypoint
- **robots.txt** — disallows all crawlers (private platform)

### What you should add for production

1. **HTTPS** — Put Nginx behind a reverse proxy (Caddy, Traefik) or use Nginx with Let's Encrypt
2. **Authentication** — Add an auth layer (OAuth, SSO, or HTTP Basic) in front of the app
3. **Rate limiting** — Add Nginx rate limiting to the `/` location block
4. **Secrets manager** — Use AWS Secrets Manager, Vault, or GitHub Secrets instead of `.env`

---

## Troubleshooting

### `return_react2 is not defined`
JSX compiled without React in scope. Ensure `import React from 'react'` is the first line of `App.jsx`.

### AI Chat shows "Connection error"
- Check `REACT_APP_ANTHROPIC_API_KEY` is set in `.env`
- Verify the key starts with `sk-ant-`
- In the Claude.ai artifact environment, the key is injected automatically — no action needed

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

### Docker build fails: `ENOENT: no such file or directory`
Make sure you're running Docker commands from the project root (where `Dockerfile` is).

### Fonts not loading (offline/firewall)
The app loads Google Fonts via CDN. In a restricted environment, download the fonts and serve them locally, then update the `@import` in `STYLES` inside `App.jsx`.

---

## License

MIT © 2025 AetherOS. See [LICENSE](LICENSE) for details.

---

*Built with Claude — AetherOS v4.0*
