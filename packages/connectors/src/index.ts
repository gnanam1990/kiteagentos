import { createPublicClient, http } from "viem";
import { defineChain } from "viem";

export const kiteMainnet = defineChain({
  id: 2366,
  name: "Kite Mainnet",
  nativeCurrency: { name: "KITE", symbol: "KITE", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.gokite.ai/"] } },
  blockExplorers: { default: { name: "KiteScan", url: "https://kitescan.ai" } },
});

export const kiteTestnet = defineChain({
  id: 2368,
  name: "Kite Testnet",
  nativeCurrency: { name: "KITE", symbol: "KITE", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc-testnet.gokite.ai/"] } },
  blockExplorers: { default: { name: "KiteScan Testnet", url: "https://testnet.kitescan.ai" } },
});

export const kiteScanApi = {
  mainnet: "https://kitescan.ai/api/v2",
  testnet: "https://testnet.kitescan.ai/api/v2",
} as const;

export type KiteNetwork = keyof typeof kiteScanApi;

export function getKiteScanUrl(path: string, network: KiteNetwork = "mainnet") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${kiteScanApi[network]}${normalized}`;
}

const cache = new Map<string, { expiresAt: number; value: unknown }>();

export async function cachedJson<T>(url: string, ttlMs = 60_000, fetcher: typeof fetch = fetch): Promise<T> {
  const cached = cache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.value as T;
  const response = await fetcher(url);
  if (!response.ok) throw new Error(`Kite connector request failed: ${response.status}`);
  const value = (await response.json()) as T;
  cache.set(url, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function createKitePublicClient(network: KiteNetwork = "mainnet") {
  const chain = network === "mainnet" ? kiteMainnet : kiteTestnet;
  return createPublicClient({ chain, transport: http(chain.rpcUrls.default.http[0]) });
}

export function maskSecret(secret: string) {
  if (secret.length <= 8) return "********";
  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}
