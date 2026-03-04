# Changelog

All notable changes to AetherOS are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.0] — 2025-02-25

### Added — New Pages
- **Agent Terminal** — Direct command-line access to any agent. Commands: `status`, `agents`, `projects`, `memory`, `cost`, `ping`, `scan`, `clear`, `whoami`. Command history with ↑↓ navigation.
- **Model Benchmarks** — Full LLM leaderboard comparing Claude Opus 4, GPT-4o, Claude Sonnet 4, Gemini 1.5 Pro, DeepSeek-R1, and Llama 3.1 70B across Coding, Reasoning, Speed, and Cost dimensions. Radar chart for top-3 comparison.
- **SaaS Clients** — Multi-tenant management page. Track MRR, health scores, plan tiers (Enterprise/Pro/Starter), and client status.
- **AI Chat Assistant** — Live Claude-powered floating chat with full platform context awareness.

### Added — Completed Flows
- **Spawn Agent modal** — Full form with name, specialisation, model selection, icon picker. Adds agent to live roster.
- **Agent Pause/Stop** — Actually mutates agent state (status → idle), disables button when already idle.
- **Agent Task Log modal** — Animated real-time log stream for selected agent.
- **Project Logs modal** — Animated agent activity stream with colour-coded output.
- **Project Pipeline modal** — Visual CI/CD stage tracker with status indicators.
- **Project Deploy modal** — 8-step animated deployment flow (pre-flight → DNS propagation).
- **Approval Details modal** — Full agent output preview with risk assessment and expected impact.
- **Add Task modal** — Real form that adds cards to the correct Kanban column with live state.
- **Security Scan modal** — 6-stage animated adversarial testing suite with pass/warn results.
- **Onboard Client modal** — Plan selection UI that adds client to live grid with MRR tracking.
- **Client Upgrade** — Inline upgrade flow that mutates plan and MRR in state.
- **Compact DB modal** — 7-step animated Pinecone index optimisation flow.
- **Benchmark Runner modal** — Animated benchmark test per model with live score display.
- **Integration Connect modal** — API key input + 1.8s animated verification flow.
- **Integration Settings modal** — Disconnect, Refresh Token, status display.
- **Custom Integration modal** — Webhook builder (name, endpoint, signing secret).
- **Settings dirty tracking** — Save Changes grayed out until changes made; unsaved-changes banner.
- **Danger Zone confirmation** — Requires typing CONFIRM before proceeding.
- **CSV Export (Analytics)** — Downloads real `aetheros-analytics.csv` with 7-month data.
- **CSV Export (Financials)** — Downloads real `aetheros-financials.csv` with 12-month forecast.
- **CSV Export (Audit Log)** — Downloads filtered log entries as `aetheros-audit.csv`.
- **Help Modal** — 12-section step-by-step user guide with sidebar navigation.
- **Help Button** — Gold `?` icon in topbar.

### Fixed
- `return<Tag` (no space) syntax error causing `return_react2 is not defined` in the artifact renderer.
- Stray `;` after `.map()` expression inside SVG JSX in `RadarChart`.
- `RESPONSES` object in TerminalPage was a static snapshot at component mount, causing stale agent data on dropdown switch. Converted to `getResponse(cmd)` with `useCallback([agent])`.
- `fmtT` naming collision between global helper and App-level clock formatter.
- Missing `React` default import (needed for classic JSX transform: `React.createElement`).
- Dead `runCompact` in MemoryPage calling non-existent `setScanStep`, causing runtime crash.

---

## [3.0.0] — 2025-02-24

### Added
- Full 12-page dashboard: Overview, Agents, Projects, Approvals, Task Queue, BI Analytics, Financials, RAG Memory, Security, Audit Log, Integrations, Settings.
- Command Palette (⌘K) with search across all pages.
- Notification Drawer.
- New Project modal.
- Drag-and-drop Kanban board (HTML5 native).
- Custom SVG charts: Sparkline, Ring, LineChart, RadarChart.
- Toast notification system.

---

## [2.0.0] — 2025-02-23

### Added
- Initial dark luxury design system.
- Agent roster with inspector panel.
- Project portfolio with progress rings.
- Approval workflow.

---

## [1.0.0] — 2025-02-22

### Added
- Initial scaffold.
