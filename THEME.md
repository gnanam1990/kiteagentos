# THEME.md — Kite AI Ecosystem Design System
# Canonical version — reflects what is actually shipped across all 7 live projects
# Last updated: 2026-05

---

## Overview

Every project in the Kite AI ecosystem shares this design system. The goal is one coherent product family — seven apps that look and feel like siblings, not seven unrelated demos.

This file goes in the root of every project repo. Every Claude Code prompt references it.

**Do not improvise. Copy these values exactly.**

---

## Stack (applies to all frontend projects)

```
Vite + React 19 + TypeScript + Tailwind v4
```

NOT Next.js (unless explicitly specified). NOT Create React App. NOT Remix.

Install Tailwind v4:
```bash
pnpm add tailwindcss @tailwindcss/vite viem
```

Tailwind v4 uses inline `@theme` in CSS — no `tailwind.config.ts` file needed.

---

## Color Palette

### Core brand colors

| Name | Hex | Role |
|------|-----|------|
| Sand | `#9B8564` | Primary — CTAs, highlights, active states |
| Cream | `#FEF8F0` | Background (light mode), page base |
| Olive | `#485C11` | Accent — success states, secondary CTAs |
| Deep Brown | `#1F1A14` | Foreground — body text, headings |

### Extended palette

| Name | Hex | Use |
|------|-----|-----|
| Sand 50 | `#FAF7F2` | Hover backgrounds |
| Sand 100 | `#F1EBE0` | Cards on cream, muted surfaces |
| Sand 200 | `#E3D7C2` | Borders |
| Sand 400 | `#B8A487` | Muted text |
| Sand 600 | `#7D6A4F` | Hover state of primary sand |
| Sand 800 | `#4E4232` | Strong text, subheadings |
| Olive 50 | `#F3F5E8` | Success background |
| Olive 400 | `#6B8429` | Success border |
| Warm Rust | `#A23A1A` | Errors, warnings, destructive actions |
| Amber Warm | `#92400E` | Caution states |

### What is forbidden

```
NO violet     (#7C3AED, #8B5CF6, #6D28D9, etc.)
NO indigo     (#4F46E5, #4338CA, etc.)
NO cyan       (#06B6D4, #0891B2, etc.)
NO neon green (#22C55E, #16A34A in isolation — only olive is allowed)
NO electric blue (any blue that doesn't appear in this file)
NO glassmorphism (backdrop-blur + opacity + fake depth)
NO neon glow  (box-shadow with color, text-shadow with color)
NO gradient text
NO 3D shadows
```

If you're ever unsure — if the color isn't in this file, it doesn't belong.

---

## Typography

### Fonts in use

```
Geist          → all UI text (headings, body, labels, nav)
Geist Mono     → all numbers, addresses, hashes, code, amounts
```

Load via Google Fonts link in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

### What is forbidden

```
NO Instrument Serif
NO italic serif headlines
NO font-serif utility class anywhere
NO font-instrument
```

Run this check before every commit:
```bash
grep -rn "Instrument\|font-instrument\|font-serif" src/ index.html
# Expected: zero hits
```

### Type scale

| Role | Tailwind class | When |
|------|---------------|------|
| Display hero | `text-6xl font-bold tracking-tight` | Landing page headline only |
| H1 | `text-4xl font-bold tracking-tight` | Page titles |
| H2 | `text-2xl font-semibold` | Section headers |
| H3 | `text-xl font-semibold` | Card titles, sub-sections |
| Body | `text-base leading-relaxed` | Paragraph text |
| Small | `text-sm` | Labels, captions |
| Mono number | `text-2xl font-bold font-mono` | Balances, counts |
| Mono small | `text-sm font-mono` | Addresses, hashes, amounts inline |

---

## Full `index.css` (Tailwind v4 — copy this exactly)

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-background: #FEF8F0;
  --color-foreground: #1F1A14;
  --color-card: #FFFFFF;
  --color-card-foreground: #1F1A14;
  --color-primary: #9B8564;
  --color-primary-foreground: #FFFFFF;
  --color-secondary: #F1EBE0;
  --color-secondary-foreground: #1F1A14;
  --color-muted: #F1EBE0;
  --color-muted-foreground: #7D6A4F;
  --color-accent: #485C11;
  --color-accent-foreground: #FFFFFF;
  --color-destructive: #A23A1A;
  --color-destructive-foreground: #FFFFFF;
  --color-border: #E3D7C2;
  --color-ring: #9B8564;

  /* Kite brand tokens */
  --color-kite-sand: #9B8564;
  --color-kite-cream: #FEF8F0;
  --color-kite-olive: #485C11;
  --color-kite-brown: #1F1A14;
  --color-kite-rust: #A23A1A;

  /* Typography */
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", "Fira Mono", monospace;

  /* Radius */
  --radius: 0.5rem;
}

/* Base resets */
* {
  box-sizing: border-box;
  border-color: var(--color-border);
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Kite gradient — use on hero sections only */
.kite-gradient {
  background: linear-gradient(135deg, #FEF8F0 0%, #F1EBE0 50%, #E3D7C2 100%);
}

/* Live indicator pulse — olive only */
@keyframes pulse-live {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}
.pulse-live {
  animation: pulse-live 2s ease-in-out infinite;
  background-color: var(--color-kite-olive);
}

/* New item flash — for live feeds */
@keyframes new-item-flash {
  0% { background-color: #F1EBE0; }
  100% { background-color: transparent; }
}
.new-item-flash {
  animation: new-item-flash 2s ease-out;
}

/* Shiki code block warm theme overrides */
.shiki, .shiki span {
  background-color: #2A241B !important;
  color: #F1EBE0 !important;
}
.shiki .token-keyword { color: #B8A487 !important; }
.shiki .token-string { color: #9BAC54 !important; }
.shiki .token-comment { color: #7D6A4F !important; }
.shiki .token-number { color: #E3D7C2 !important; }
```

---

## Shared Library Files

These files are created in **AgentID** (project 1) and copied verbatim to every subsequent project. Never rewrite them — copy then extend if needed.

### `src/lib/kite-chain.ts`

```typescript
import { defineChain } from "viem";

export const kiteMainnet = defineChain({
  id: 2366,
  name: "Kite Mainnet",
  nativeCurrency: { name: "KITE", symbol: "KITE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.gokite.ai/"] },
  },
  blockExplorers: {
    default: { name: "KiteScan", url: "https://kitescan.ai" },
  },
});

export const kiteTestnet = defineChain({
  id: 2368,
  name: "Kite Testnet",
  nativeCurrency: { name: "KITE", symbol: "KITE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-testnet.gokite.ai/"] },
  },
  blockExplorers: {
    default: { name: "KiteScan Testnet", url: "https://testnet.kitescan.ai" },
  },
});

export type KiteNetwork = "mainnet" | "testnet";

export function getChain(network: KiteNetwork) {
  return network === "mainnet" ? kiteMainnet : kiteTestnet;
}

export function getExplorerUrl(network: KiteNetwork) {
  return network === "mainnet"
    ? "https://kitescan.ai"
    : "https://testnet.kitescan.ai";
}
```

### `src/lib/cache.ts`

```typescript
interface CacheEntry<T> {
  data: T;
  expires_at: number;
}

const store = new Map<string, CacheEntry<any>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires_at) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttl_ms = 60_000): void {
  store.set(key, { data, expires_at: Date.now() + ttl_ms });
}

export function clearCache(prefix?: string): void {
  if (!prefix) { store.clear(); return; }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
```

### `src/lib/kitescan-api.ts` (base — extend in each project)

```typescript
import { getCached, setCached } from "./cache";
import type { KiteNetwork } from "./kite-chain";

export class KiteScanError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "KiteScanError";
  }
}

function apiBase(network: KiteNetwork): string {
  return network === "mainnet"
    ? "https://kitescan.ai/api/v2"
    : "https://testnet.kitescan.ai/api/v2";
}

async function fetchJson<T>(url: string): Promise<T> {
  const cached = getCached<T>(url);
  if (cached) return cached;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new KiteScanError(res.status, `KiteScan API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as T;
  setCached(url, data, 60_000);
  return data;
}

// === ADDRESS ===

export interface BlockscoutAddress {
  hash: string;
  coin_balance: string | null;
  transactions_count: string | null;
  token_transfers_count: string | null;
  ens_domain_name: string | null;
  is_contract: boolean;
  name: string | null;
  creation_tx_hash: string | null;
}

export async function getAddress(
  address: string,
  network: KiteNetwork = "mainnet"
): Promise<BlockscoutAddress> {
  return fetchJson<BlockscoutAddress>(`${apiBase(network)}/addresses/${address}`);
}

// === TRANSACTIONS ===

export interface BlockscoutTx {
  hash: string;
  block_number: number;
  timestamp: string;
  from: { hash: string; ens_domain_name: string | null; is_contract: boolean };
  to: { hash: string; ens_domain_name: string | null; is_contract: boolean } | null;
  value: string;
  fee: { value: string };
  method: string | null;
  status: "ok" | "error";
  transaction_types: string[];
}

export async function getAddressTransactions(
  address: string,
  opts: { network?: KiteNetwork; cursor?: any } = {}
): Promise<{ items: BlockscoutTx[]; next_page_params: any }> {
  const network = opts.network ?? "mainnet";
  let url = `${apiBase(network)}/addresses/${address}/transactions`;
  if (opts.cursor) {
    const params = new URLSearchParams(opts.cursor).toString();
    url += `?${params}`;
  }
  return fetchJson(url);
}

export async function getLatestTransactions(
  network: KiteNetwork = "mainnet"
): Promise<{ items: BlockscoutTx[]; next_page_params: any }> {
  return fetchJson(`${apiBase(network)}/transactions`);
}

// === TOKEN BALANCES ===

export interface BlockscoutTokenBalance {
  token: { address: string; name: string; symbol: string; decimals: string; type: string };
  value: string;
}

export async function getTokenBalances(
  address: string,
  network: KiteNetwork = "mainnet"
): Promise<BlockscoutTokenBalance[]> {
  const res = await fetchJson<{ items: BlockscoutTokenBalance[] }>(
    `${apiBase(network)}/addresses/${address}/token-balances`
  );
  return res.items;
}

// === STATS ===

export interface BlockscoutStats {
  total_addresses: string;
  total_blocks: string;
  total_transactions: string;
  average_block_time: number;
  coin_price: string | null;
  gas_prices: { slow: number; average: number; fast: number } | null;
  network_utilization_percentage: number;
}

export async function getNetworkStats(
  network: KiteNetwork = "mainnet"
): Promise<BlockscoutStats> {
  return fetchJson<BlockscoutStats>(`${apiBase(network)}/stats`);
}

// === NATIVE HOLDERS ===

export interface BlockscoutHolderItem {
  hash: string;
  coin_balance: string;
  transactions_count: string;
  ens_domain_name: string | null;
  is_contract: boolean;
  name: string | null;
}

export async function getNativeHolders(
  network: KiteNetwork = "mainnet"
): Promise<{ items: BlockscoutHolderItem[]; next_page_params: any }> {
  return fetchJson(`${apiBase(network)}/addresses`);
}

// === TOKEN HOLDERS ===

export interface BlockscoutTokenHolder {
  address: { hash: string; ens_domain_name: string | null; is_contract: boolean };
  value: string;
  token: { decimals: string; symbol: string; name: string; address: string };
}

export async function getTokenHolders(
  tokenAddress: string,
  network: KiteNetwork = "mainnet"
): Promise<{ items: BlockscoutTokenHolder[]; next_page_params: any }> {
  return fetchJson(`${apiBase(network)}/tokens/${tokenAddress}/holders`);
}

// === TOKEN LIST ===

export interface BlockscoutTokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  type: string;
  holders: string;
  total_supply: string;
}

export async function listTokens(
  network: KiteNetwork = "mainnet"
): Promise<{ items: BlockscoutTokenInfo[]; next_page_params: any }> {
  return fetchJson(`${apiBase(network)}/tokens`);
}
```

---

## Shared Component Files

Copy these from AgentID to every new project. Change only the subtitle in `site-header.tsx`.

### `src/components/address-display.tsx`

```tsx
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  address: string;
  length?: number;
  showCopy?: boolean;
  className?: string;
}

export function AddressDisplay({ address, length = 6, showCopy = true, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const short = `${address.slice(0, length + 2)}...${address.slice(-length)}`;

  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-sm ${className}`}>
      <span title={address}>{short}</span>
      {showCopy && (
        <button
          onClick={copy}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy address"
        >
          {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
    </span>
  );
}
```

### `src/components/preview-badge.tsx`

```tsx
import { Info } from "lucide-react";

interface Props {
  label?: string;
  tooltip?: string;
}

export function PreviewBadge({
  label = "PREVIEW",
  tooltip = "This data is estimated or not yet fully implemented.",
}: Props) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border cursor-help"
      title={tooltip}
    >
      <Info className="w-3 h-3" />
      {label}
    </span>
  );
}
```

### `src/components/kite-logo.tsx`

```tsx
interface Props { className?: string; showWordmark?: boolean }

export function KiteLogo({ className = "h-8", showWordmark = true }: Props) {
  return (
    <div className="flex items-center gap-2">
      <img src="/kite-logo.svg" alt="Kite" className={className} />
      {showWordmark && (
        <span className="text-xl font-bold tracking-tight text-foreground">Kite</span>
      )}
    </div>
  );
}
```

### `src/components/site-header.tsx`

```tsx
import { KiteLogo } from "./kite-logo";

interface Props {
  subtitle?: string;  // e.g. "PAY" | "SUBS" | "MARKET" | "LEADERBOARD"
  rightSlot?: React.ReactNode;
}

export function SiteHeader({ subtitle, rightSlot }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <KiteLogo showWordmark={false} className="h-6" />
          <span className="font-bold text-lg tracking-tight">
            Kite
            {subtitle && (
              <span className="text-primary ml-0.5 font-medium text-sm">{subtitle}</span>
            )}
          </span>
        </a>
        {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
      </div>
    </header>
  );
}
```

### `src/components/site-footer.tsx`

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-20 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>Built on <a href="https://gokite.ai" className="underline underline-offset-2 hover:text-foreground">Kite</a></div>
        <div className="flex gap-6">
          <a href="https://kitescan.ai" className="hover:text-foreground">Explorer</a>
          <a href="https://docs.gokite.ai" className="hover:text-foreground">Docs</a>
          <a href="https://discord.com/invite/gokiteai" className="hover:text-foreground">Discord</a>
        </div>
      </div>
    </footer>
  );
}
```

---

## Verified Chain Facts

Use these exact values. Never improvise.

```
Mainnet RPC:     https://rpc.gokite.ai/
Mainnet Chain ID: 2366
Mainnet Explorer: https://kitescan.ai/
Mainnet API:     https://kitescan.ai/api/v2/

Testnet RPC:     https://rpc-testnet.gokite.ai/
Testnet Chain ID: 2368
Testnet Explorer: https://testnet.kitescan.ai/
Testnet API:     https://testnet.kitescan.ai/api/v2/

Native token:    KITE (18 decimals)
Testnet USDT:    0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63 (18 decimals)
Mainnet USDC.e:  [TODO — confirm before mainnet payments]
```

---

## Visual Rules (quick-reference card)

Put this at the top of every Claude Code prompt as a reminder:

```
VISUAL RULES — NON-NEGOTIABLE:
- Typography: Geist (body) + Geist Mono (numbers/addresses). ZERO Instrument Serif.
- Colors: sand #9B8564 / cream #FEF8F0 / olive #485C11 / deep brown #1F1A14 ONLY.
- Zero violet, cyan, indigo, neon green, electric blue.
- Zero glassmorphism, neon glow, gradient text, 3D shadows.
- All numbers/addresses/hashes: font-mono.
- Cards: flat cream/card bg, subtle border only. No depth effects.
- Errors: warm rust #A23A1A. NOT bright red.
- Success: olive #485C11. NOT neon green.
- PREVIEW badge on anything not fully live/real.
- Hover states: subtle bg lighten only. No scale, no shadow pop.
```

---

## PREVIEW Badge Usage Guide

| Data type | Badge label | Badge tooltip |
|-----------|-------------|---------------|
| Heuristic score | `ESTIMATED` | "Derived from on-chain data. Not an official metric." |
| Incomplete endpoint | `PREVIEW` | Explain what's missing specifically |
| Feature not built | `COMING V0.2` | "This feature is planned for v0.2." |
| Mock/placeholder data | `[MOCK]` | Must prefix in the text itself, not just badge |

Rules:
- If you would be embarrassed for a user to trust the number, badge it.
- Never remove a badge to make the app look more complete.
- Badges build trust. Fake-complete UIs destroy it.

---

## ERC-20 ABI (copy to every project that does payments)

```typescript
// src/lib/erc20-abi.ts
export const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
] as const;
```

---

## Verification Checklist (run before every commit)

```bash
# 1. Type check
npx tsc --noEmit

# 2. No forbidden fonts
grep -rn "Instrument\|font-instrument\|font-serif" src/ index.html
# Expected: zero hits

# 3. No forbidden colors
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" src/
# Expected: zero hits in non-comment context

# 4. Dev server runs clean
pnpm dev
# Expected: no TypeScript errors, no console errors, no CORS errors

# 5. Visual check in browser
# - Background is cream #FEF8F0, not white, not gray
# - Primary button is sand #9B8564, not blue
# - Numbers are in Geist Mono
# - No visible purple/violet anywhere
```

---

## Wallet Setup (projects that need transactions)

For any project requiring wallet connection, add:

```bash
pnpm add wagmi @tanstack/react-query @rainbow-me/rainbowkit
```

RainbowKit theme override (match Kite palette):

```typescript
import { lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

export const kiteRainbowTheme = lightTheme({
  accentColor: "#9B8564",          // sand
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
});
```

**Do NOT use the default dark RainbowKit theme.** It will show violet — the opposite of the Kite palette.

WalletConnect Project ID: free at https://cloud.walletconnect.com — user must provide before deployment.

---

## Project Register

All live projects sharing this design system:

| Project | URL | Role | Repo |
|---------|-----|------|------|
| AgentID | agentid.xyz | Identity | gnanam1990/agentid |
| KitePay | kitepay-weld.vercel.app | Payments | gnanam1990/kitepay |
| KiteSubs | kitesubs.vercel.app | Subscriptions | gnanam1990/kitesubs |
| AgentMarket | agentmarket-self.vercel.app | API Directory | gnanam1990/agentmarket |
| KiteDocs | kitedocs.vercel.app | Documentation | gnanam1990/kitedocs |
| KiteStreaks | kitestreaks.vercel.app | Activity Heatmaps | gnanam1990/kitestreaks |
| KitePoints | kitepoints.vercel.app | Relationship Graph | gnanam1990/kitepoints |

Every project footer links to kitescan.ai, docs.gokite.ai, and the Kite Discord.
Every address in every project links to its AgentID profile.

---

## How to start a new project using this theme

```bash
# 1. Create project
mkdir -p ~/dev/{project-name} && cd ~/dev/{project-name}
pnpm create vite@latest . --template react-ts
pnpm install
pnpm add tailwindcss @tailwindcss/vite viem

# 2. Copy shared files from AgentID
cp ~/dev/agentid/src/index.css src/index.css
cp ~/dev/agentid/src/lib/kite-chain.ts src/lib/kite-chain.ts
cp ~/dev/agentid/src/lib/kitescan-api.ts src/lib/kitescan-api.ts
cp ~/dev/agentid/src/lib/cache.ts src/lib/cache.ts
cp ~/dev/agentid/src/components/address-display.tsx src/components/
cp ~/dev/agentid/src/components/preview-badge.tsx src/components/
cp ~/dev/agentid/src/components/kite-logo.tsx src/components/
cp ~/dev/agentid/src/components/site-header.tsx src/components/
cp ~/dev/agentid/src/components/site-footer.tsx src/components/
cp ~/dev/agentid/public/kite-logo.svg public/

# 3. Copy THEME.md to repo root
cp ~/dev/agentid/THEME.md THEME.md

# 4. Update vite.config.ts with @tailwindcss/vite plugin
# 5. Add Google Fonts link to index.html
# 6. Start building new project-specific files
```

---

*This file is the single source of truth for the Kite AI ecosystem design system.*
*When in doubt: check this file. If it's not here, don't use it.*
