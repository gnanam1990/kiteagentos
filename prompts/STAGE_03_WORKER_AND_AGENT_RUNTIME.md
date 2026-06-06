# Stage 03 — Worker and Agent Runtime for KiteAgentOS

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the background worker/runtime layer for **KiteAgentOS**. This product should feel productive and agentic, not just CRUD screens.

## Worker package structure

```txt
packages/worker/src/index.ts
packages/worker/src/queue.ts
packages/worker/src/jobs/
packages/worker/src/scheduler.ts
packages/worker/src/logger.ts
packages/worker/src/config.ts
```

## Core runtime requirements
- Implement a simple durable job queue abstraction.
- Local MVP can use SQLite polling or an in-memory queue with persistent job table.
- Every job has `id`, `type`, `status`, `attempts`, `max_attempts`, `payload_json`, `last_error`, `created_at`, `run_at`, `finished_at`.
- Add exponential backoff helper.
- Add idempotency key support where a job can cause external effects.
- Add structured logs.

## Agentic requirements
Where this product needs AI/agent behavior, implement a provider abstraction:

```ts
interface AgentModelProvider {
  generateObject<T>(input: AgentPromptInput<T>): Promise<AgentResult<T>>;
  generateText(input: AgentTextInput): Promise<AgentTextResult>;
}
```

- Add a mock provider for local development.
- Add environment placeholders for real LLM provider later.
- Every AI output must be stored with prompt, model, input, output, and timestamp.
- Any action proposed by AI that can move funds or affect users must enter approval flow.

## Product-specific jobs
Create worker job stubs for each module:

- Agent Builder
- Tool Connector Registry
- Budget + Policy Manager
- Human Approval Inbox
- Run Logs + Observability


Each job should have:
- input schema,
- handler,
- success path,
- failure path,
- timeline/audit log write,
- unit test with mock data.

## Acceptance criteria
- Worker starts locally.
- Worker can process at least one seeded/demo job.
- Failed jobs retry and eventually mark failed.
- Job logs are visible through API or database.
- AI/mock provider outputs are stored, not hidden.

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

