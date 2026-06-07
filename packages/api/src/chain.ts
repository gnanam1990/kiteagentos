import { cachedJson, createKitePublicClient, getKiteScanUrl } from "@kiteagentos/connectors";

export interface ChainStats {
  network: "mainnet";
  chainId: number;
  blockNumber: number;
  gasPrices?: { slow: number; average: number; fast: number };
  averageBlockTimeMs?: number;
  source: string;
  live: true;
  preview: false;
}

interface KiteScanStats {
  gas_prices?: { slow: number; average: number; fast: number };
  average_block_time?: number;
}

/**
 * Real Kite Mainnet read. Pulls the current block height over JSON-RPC (viem)
 * and gas/network stats from the KiteScan explorer. No preview data: every
 * field here is fetched live from chain infrastructure at request time.
 */
export async function getChainStats(): Promise<ChainStats> {
  const client = createKitePublicClient("mainnet");
  const [blockNumber, stats] = await Promise.all([
    client.getBlockNumber(),
    cachedJson<KiteScanStats>(getKiteScanUrl("/stats", "mainnet"), 30_000).catch(() => ({}) as KiteScanStats),
  ]);

  return {
    network: "mainnet",
    chainId: 2366,
    blockNumber: Number(blockNumber),
    gasPrices: stats.gas_prices,
    averageBlockTimeMs: stats.average_block_time,
    source: "rpc.gokite.ai + kitescan.ai",
    live: true,
    preview: false,
  };
}
