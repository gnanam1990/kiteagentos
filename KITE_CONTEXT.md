# Shared Kite AI + UI Context for All OpenCode Prompts

Use this file as the first context file for every project in this pack.

## Kite network constants

```txt
Kite Mainnet RPC:       https://rpc.gokite.ai/
Kite Mainnet Chain ID:  2366
Kite Mainnet Explorer:  https://kitescan.ai/
Kite Mainnet API:       https://kitescan.ai/api/v2/
Kite Testnet RPC:       https://rpc-testnet.gokite.ai/
Kite Testnet Chain ID:  2368
Kite Testnet Explorer:  https://testnet.kitescan.ai/
Kite Testnet API:       https://testnet.kitescan.ai/api/v2/
Native token:           KITE, 18 decimals
Testnet USDT:           0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63, 18 decimals
```

## Product philosophy

These products are not simple dashboard clones. They are serious agentic products for Kite AI: agent control planes, workflow automation, API monetization, agent work marketplaces, payment verification, agent-safe treasury controls, research agents, and security systems.

Every product must be useful, productive, and defensible as a real business-grade tool.

## Global UI design rules

```txt
Frontend default: Vite + React 19 + TypeScript + Tailwind v4
Typography: Geist + Geist Mono only
Colors: sand #9B8564 / cream #FEF8F0 / olive #485C11 / deep brown #1F1A14
Errors/destructive: warm rust #A23A1A
No violet, no cyan, no indigo, no neon green, no electric blue
No glassmorphism, no neon glow, no gradient text, no 3D shadows
All numbers, addresses, hashes, tx IDs, balances, block numbers: font-mono
Flat cards, subtle borders, no shadow-heavy SaaS look
PREVIEW / ESTIMATED / COMING V0.2 badges on anything heuristic, mock, unaudited, or incomplete
```

## Global engineering rules

1. Never trust client-submitted payment claims. Always verify on-chain receipts and token transfer logs.
2. Any fund-moving flow requires explicit user approval before signing.
3. Any smart-contract, trading, vault, escrow, or bridge functionality must be testnet-first and labeled PREVIEW/UNAUDITED until audited.
4. Any agent decision must be logged with input, tool calls, prompt, model, output, approval status, tx hash, and result.
5. Cross-link addresses to AgentID / AgentScore-style profiles wherever possible.
6. Never imply airdrops, rewards, guaranteed profit, guaranteed yield, or investment performance.
7. Prefer Hono + SQLite/Postgres + worker queues for APIs; Vite React for UI unless SSR is truly required.
8. Keep all risky execution behind a policy layer and an approval layer.
9. Store secrets only in backend environment variables; never expose private keys to frontend.
10. Every project must include README, .env.example, and verification commands.

## Shared monorepo shape

```txt
packages/web/          Vite + React 19 frontend
packages/api/          Hono API
packages/worker/       background jobs, schedulers, queues
packages/core/         domain engine, pure TypeScript logic
packages/connectors/   KiteScan, RPC, webhook, LLM, wallet, API connectors
packages/contracts/    Foundry, only for products that need contracts
```

## Required verification commands

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm dev

# UI rules
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html
# Expected: zero hits

grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src
# Expected: zero hits in non-comment context
```
