# Stage 04 — Frontend Shell and Kite Theme for KiteAgentOS

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the frontend shell for **KiteAgentOS** with the attached Kite design system. Do not improvise the visual style.

## Required routes
Create route/page shells for:

- `/`
- `/agents`
- `/agents/new`
- `/agents/:id`
- `/agents/:id/tools`
- `/agents/:id/budget`
- `/approvals`
- `/runs`
- `/settings`


## Required layout
- Sticky `SiteHeader` with Kite logo and `AGENTOS` subtitle.
- Main content container with cream background.
- `SiteFooter` linking to Kite, KiteScan, docs, and Discord.
- Left sidebar only if needed for app dashboards.
- Responsive mobile layout.

## Required shared UI components

```txt
components/ui/Button.tsx
components/ui/Card.tsx
components/ui/Input.tsx
components/ui/Textarea.tsx
components/ui/Select.tsx
components/ui/Tabs.tsx
components/ui/Badge.tsx
components/ui/PreviewBadge.tsx
components/ui/MonoValue.tsx
components/ui/AddressDisplay.tsx
components/ui/StatusDot.tsx
components/ui/EmptyState.tsx
components/ui/ErrorState.tsx
components/ui/ConfirmDialog.tsx
components/layout/AppShell.tsx
components/layout/SiteHeader.tsx
components/layout/SiteFooter.tsx
```

## Page shell requirements
Every route should have:
- Page title.
- Short description.
- At least one useful card/table/form placeholder.
- PREVIEW badge for data not wired yet.
- Empty state that explains what the user should do next.

## Visual rules
- Background: cream `#FEF8F0`.
- Primary CTA: sand `#9B8564`.
- Success: olive `#485C11`.
- Destructive/warning: warm rust `#A23A1A`.
- Cards: flat white/cream with `#E3D7C2` border.
- No glassmorphism, glow, violet, cyan, indigo, blue gradients, or neon.
- All addresses/hashes/numbers use Geist Mono.

## Data integration
- Create API client in `packages/web/src/lib/api.ts`.
- Load seeded/demo data from backend where possible.
- Show loading, error, and empty states.

## Acceptance criteria
- All routes render.
- Header/footer consistent.
- No forbidden colors/fonts.
- Demo data appears in at least 2 pages.
- UI looks like a sibling of the existing Kite product family.

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

