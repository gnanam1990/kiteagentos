# KiteAgentOS

> A control plane for operating autonomous agents on the Kite network — with profiles, tools, budgets, policies, human approvals, and full run observability.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/gnanam1990/kiteagentos/actions/workflows/ci.yml/badge.svg)](https://github.com/gnanam1990/kiteagentos/actions/workflows/ci.yml)

## Overview

KiteAgentOS is a pnpm/TypeScript monorepo that pairs a React single-page app with a Hono API to manage agents on the Kite network. It provides agent profiles, a tool/connector registry, budget and policy controls, a human approval inbox, and a run/activity log. The API exposes a real, live read of Kite Mainnet (current block height plus gas/network stats) and degrades gracefully to bundled preview data when backend infrastructure is unreachable. Several product modules are at PREVIEW maturity — see [Status](#status).

## Features

- **Agent profiles** — create agents with a name, description, and owner (validated EVM address); list and fetch individual agents.
- **Live Kite Mainnet read** — `GET /chain/stats` fetches the current block height over JSON-RPC via `viem`, plus gas/network stats from the KiteScan explorer.
- **Tool / connector registry** — surface for registering tools and MCP connectors an agent can use (PREVIEW).
- **Budget + policy controls** — spending and action policy model with risk levels and an approval-required rule for high-risk or fund-moving actions.
- **Human approval inbox** — list pending approvals and approve/deny them.
- **Run logs + observability** — activity timeline of agent runs, tool calls, approvals, and txs.
- **Worker runtime** — a preview job runtime (`PreviewRuntime`) wired into the API at `POST /runs/simulate`.
- **Graceful degradation** — the SPA falls back to bundled preview data on any API error, so the UI never breaks.

## Tech stack

- **Frontend:** Vite, React 19, TypeScript, Tailwind CSS v4, lucide-react
- **API:** Hono, `@hono/node-server` (Vercel adapter for serverless)
- **Chain access:** viem (custom Kite Mainnet/Testnet chain definitions)
- **Build/tooling:** pnpm workspaces, TypeScript, esbuild, Vitest

## Architecture

This is a pnpm monorepo of five workspace packages plus a serverless entry point.

| Path | Purpose |
| --- | --- |
| `packages/web/` | Vite + React 19 SPA (the UI). |
| `packages/api/` | Hono API: app, routes, in-memory preview data, and the live chain read. |
| `packages/worker/` | Background/run runtime (`PreviewRuntime`) for preview job simulation. |
| `packages/core/` | Pure-TypeScript domain logic: address/tx validation, risk weighting, approval rules, types. |
| `packages/connectors/` | Kite chain definitions, viem public client, KiteScan URL helper, cached JSON fetch. |
| `server/index.ts` | Vercel Serverless Function that mounts the Hono app under `/api`. |

In production the SPA and the API ship in the same Vercel deployment, so the frontend calls the API at the same-origin `/api/*` path; locally it calls the dev API server on `:8787`.

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 9 (the repo pins `pnpm@9.15.9`)

### Installation

```bash
pnpm install
```

### Configuration

Copy `.env.example` and adjust as needed. The variables the project reads:

| Variable | Purpose |
| --- | --- |
| `KITE_NETWORK` | Active Kite network (e.g. `mainnet`). |
| `KITE_MAINNET_RPC` | Kite Mainnet JSON-RPC endpoint. |
| `KITE_MAINNET_API` | KiteScan Mainnet explorer API base. |
| `KITE_TESTNET_RPC` | Kite Testnet JSON-RPC endpoint. |
| `KITE_TESTNET_API` | KiteScan Testnet explorer API base. |
| `API_PORT` | Local API server port (default `8787`). |
| `WEB_ORIGIN` | Allowed CORS origin for the API (default `http://localhost:5173`). |
| `VITE_API_URL` | Frontend API base for local dev. Ignored in production, where the SPA calls same-origin `/api`. |
| `WEBHOOK_SECRET_DEMO` | Local-only webhook secret placeholder. |
| `LLM_PROVIDER` | LLM provider selector (`preview` by default). |

Never commit real secret values; keep secrets in backend environment variables only.

### Running

Start the web app and API together:

```bash
pnpm dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8787`

Quick checks against the local API:

```bash
curl http://localhost:8787/health        # { "ok": true, "service": "kiteagentos" }
curl http://localhost:8787/chain/stats   # live Kite Mainnet block height + gas
```

## Usage

The API is mounted under `/api` in production and served at the root in local dev. Endpoints:

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Service health probe. |
| GET | `/meta` | Product + module metadata. |
| GET | `/modules` | Product modules. |
| GET | `/agents` | List agents. |
| POST | `/agents` | Create an agent (`name`, `description`, `owner` required; `owner` must be a valid EVM address). |
| GET | `/agents/:id` | Fetch one agent. |
| GET | `/runs` | Activity / run log. |
| POST | `/runs/simulate` | Simulate a run through the worker runtime. |
| GET | `/approvals` | Pending approvals. |
| POST | `/approvals/:id/approve` · `/deny` | Resolve an approval. |
| GET | `/chain/stats` | Live Kite Mainnet block height + gas (degrades to preview if infra is down). |
| POST | `/webhooks/:triggerId` | Preview webhook intake. |

## Testing

```bash
pnpm -r typecheck                       # type-check all packages
pnpm -r test                            # run the test suites
pnpm --filter @kiteagentos/web build    # production build of the SPA
```

Tests cover core domain logic (`packages/core`), API routes including the chain and worker endpoints (`packages/api`), and the worker runtime (`packages/worker`). CI runs install, typecheck, test, and a web build via `.github/workflows/ci.yml`.

## Project structure

```txt
server/index.ts          Vercel Serverless Function — mounts the Hono app at /api
scripts/vercel-build.mjs Vercel Build Output API builder (SPA + bundled API function)
packages/web/            Vite + React 19 frontend
packages/api/            Hono API (app, routes, preview data, live chain read)
packages/worker/         preview run runtime
packages/core/           pure TypeScript domain logic
packages/connectors/     Kite chain defs, viem client, KiteScan + cached fetch
```

## Status

Preview. The architecture, build, tests, and the live Kite Mainnet chain read are real and working. The frontend and API are deployed to Vercel, and the SPA falls back to bundled preview data whenever the API is unreachable.

What is real:

- Live Kite Mainnet read at `GET /chain/stats` (block height via `viem`, gas/network stats via KiteScan).
- Pure-TypeScript core for address/tx validation, risk policy, approval rules, and activity logging.
- The worker runtime exercised by `POST /runs/simulate`.
- Tests for core, API routes, and the worker.

What is PREVIEW:

- Agents, modules, approvals, and run logs are served from in-memory sample data; there is no persistent database.
- The Tool/Connector Registry, Budget + Policy Manager, Approval Inbox, and Run Logs modules are preview-stage surfaces.
- Agentic decisions, payment verification, fund movement, and trading are not implemented. Client-submitted payment claims are not trusted, and fund-moving or risky actions require explicit approval.
- No official Kite mainnet contract address is asserted in this repo.

## License

[MIT](LICENSE) © 2026 Gnanam (gnanam1990)
