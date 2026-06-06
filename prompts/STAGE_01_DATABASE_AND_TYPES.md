# Stage 01 — Database and Domain Types for KiteAgentOS

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Design and implement the domain model, database schema, migrations, seed data, and TypeScript types for **KiteAgentOS**.

Do not build final UI screens yet. Build the data foundation that later stages will use.

## Required entities from PRD
Implement types and database tables for these domain objects:

- `Agent{id, name, description, owner_address, wallet_address, status, risk_level, system_prompt, created_at}`
- `ToolConnector{id, agent_id, type, name, config_json, permission_json, active}`
- `ToolCall{id, run_id, connector_id, args_json, result_json, status, created_at}`
- `AgentPolicy{id, agent_id, daily_limit, monthly_limit, per_tx_limit, allowed_tokens_json, allowed_recipients_json, approval_required, active}`
- `Approval{id, agent_id, run_id, action_type, payload_json, status, requested_at, decided_at, decided_by, reason}`
- `AgentRun{id, agent_id, status, input_json, output_json, started_at, finished_at, error}`
- `RunLog{id, run_id, level, message, payload_json, created_at}`


## Database choice
Use SQLite for local MVP with Drizzle ORM or a clean query layer. Keep the schema portable so it can move to Postgres later.

## Required files

```txt
packages/core/src/types.ts
packages/core/src/validation.ts
packages/core/src/errors.ts
packages/api/src/db/schema.ts
packages/api/src/db/client.ts
packages/api/src/db/migrate.ts
packages/api/src/db/seed.ts
packages/api/src/repositories/
```

## Schema requirements
- Every table must have `id`, `created_at`, and where useful `updated_at`.
- Store addresses lowercase, but preserve display formatting in UI.
- Use JSON columns for flexible config payloads, but validate shape at API boundaries.
- Add indexes for address, status, created_at, foreign keys, and tx_hash where relevant.
- Add uniqueness constraints where duplicates would be dangerous.
- Add status enums in TypeScript and database-safe string values.

## TypeScript requirements
- Define strict types for every core entity.
- Define create/update input types separately from persisted entity types.
- Add Zod schemas for API request validation.
- Add helper functions for validating Kite addresses, tx hashes, amounts, and URLs.

## Seed data
Add realistic local seed data for demo mode:
- At least 3 users/owners.
- At least 5 main entities for the product.
- At least 10 events/logs/history rows where relevant.
- Seeded Kite-like addresses must be valid `0x` addresses.
- Mark all fake/demo records with `demo: true` or a clear `[MOCK]` label field.

## Acceptance criteria
- Migrations run from a clean database.
- Seed script populates useful demo data.
- API can import repositories without circular dependencies.
- Domain types are exported from `packages/core`.
- No UI claims seeded mock data is real.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.

