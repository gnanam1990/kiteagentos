# Stage 10 — Kite Wallet and Payment Integration for KiteAgentOS

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Add safe Kite chain integration to **KiteAgentOS**. This stage should wire KiteScan, RPC, wallet connection, address views, tx verification, and payment-safety patterns where relevant.

## Required connector files

```txt
packages/connectors/src/kite-chain.ts
packages/connectors/src/kitescan.ts
packages/connectors/src/rpc.ts
packages/connectors/src/payment-verifier.ts
packages/connectors/src/address.ts
packages/web/src/lib/wallet.ts
packages/web/src/lib/chains.ts
```

## Kite constants
Use these defaults:

```txt
Mainnet RPC: https://rpc.gokite.ai/
Mainnet Chain ID: 2366
Mainnet Explorer: https://kitescan.ai/
Mainnet API: https://kitescan.ai/api/v2/
Testnet RPC: https://rpc-testnet.gokite.ai/
Testnet Chain ID: 2368
Native token: KITE, 18 decimals
Testnet USDT: 0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63, 18 decimals
```

## Wallet connection
- Add wagmi + RainbowKit only if this product needs wallet connection.
- Customize RainbowKit theme to sand accent, not default blue/violet.
- Add network switch UI for mainnet/testnet when appropriate.
- Never store private keys.

## Payment verification pattern
If the product accepts payment tx hashes, implement:

1. Fetch transaction receipt by hash.
2. Confirm receipt status success.
3. Confirm chain/network.
4. For ERC-20 payment, parse Transfer logs.
5. Verify token contract address.
6. Verify recipient address.
7. Verify amount is greater than or equal to expected amount.
8. Store verification result.
9. Reject invalid tx with clear reason.
10. Never grant access from client-claimed payment alone.

## UI integration
- Every address links to KiteScan.
- Every tx hash links to KiteScan.
- Use `font-mono` for address/hash/amount/block.
- Mark any unverified payment as PENDING or UNVERIFIED.
- Mark any mock/demo payment as `[MOCK]`.

## Product-specific integration points
- Agent Builder
- Tool Connector Registry
- Budget + Policy Manager
- Human Approval Inbox
- Run Logs + Observability


For each module, identify whether it needs:
- address lookup,
- tx hash lookup,
- token balance,
- payment verification,
- wallet approval,
- receipt display,
- explorer links.

## Acceptance criteria
- KiteScan client can fetch latest transactions or address data in demo mode.
- Payment verifier has unit tests for valid, invalid, wrong-recipient, wrong-token, and insufficient-amount cases using mocked receipts.
- Wallet UI does not use forbidden RainbowKit colors.
- No mainnet payment feature is presented as production-ready unless token/contract addresses are confirmed.

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

