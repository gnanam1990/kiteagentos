# Stage 12 — Final Polish, README, and Demo Script for KiteAgentOS

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Prepare **KiteAgentOS** for a public-quality GitHub repo and product demo.

## README requirements
Rewrite `README.md` with:
- Product name and one-line summary.
- What problem it solves.
- Why it matters for Kite AI agents.
- Feature list by module.
- Architecture diagram in text form.
- Local development instructions.
- Environment variable list.
- Safety/PREVIEW/UNAUDITED notes.
- Verification commands.
- Deployment notes.
- Roadmap v0.2/v0.3.

## Demo script
Create `docs/DEMO_SCRIPT.md` with a 3–5 minute demo flow:
1. Open landing page.
2. Show main dashboard.
3. Create or inspect a core object.
4. Trigger the most important workflow.
5. Show audit/log/payment/approval output.
6. Explain what is real vs PREVIEW.

## Product polish
- Replace generic placeholder copy with product-specific text.
- Add helpful empty states.
- Add tooltips for complex chain/agent concepts.
- Add skeleton/loading states.
- Add error recovery messages.
- Add cross-links to KiteScan for all addresses/txs.
- Add visible “Built on Kite” footer.

## v0.2 roadmap
Create a roadmap section with:
- Production auth.
- Postgres migration.
- Real provider integrations.
- WebSocket/event subscriptions if relevant.
- Mainnet-safe execution only after confirmation/audit.
- Team/multi-user support.
- Usage-based billing if relevant.

## Final acceptance criteria
- A new developer can run the repo from README alone.
- A demo user can understand the product in under 30 seconds.
- The app feels like a serious Kite agent product, not a toy dashboard.
- All PREVIEW limitations are honest.
- Final grep checks pass.

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

