import { Hono } from "hono";
import { cors } from "hono/cors";
import { assertEvmAddress } from "@kiteagentos/core";
import { PreviewRuntime } from "@kiteagentos/worker";
import { getChainStats } from "./chain.js";
import { activity, approvals, createItem, items, modules } from "./data.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: [process.env.WEB_ORIGIN ?? "http://localhost:5173"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true, service: "kiteagentos" }));
app.get("/modules", (c) => c.json({ modules }));
app.get("/agents", (c) => c.json({ agents: items, items }));

app.post("/agents", async (c) => {
  const body = (await c.req.json().catch(() => null)) as { name?: string; description?: string; owner?: string } | null;
  if (!body?.name || !body.description || !body.owner) return c.json({ error: "name, description, and owner are required" }, 400);
  try {
    return c.json({ item: createItem({ name: body.name, description: body.description, owner: assertEvmAddress(body.owner) }) }, 201);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Invalid item" }, 400);
  }
});

app.get("/agents/:id", (c) => {
  const item = items.find((entry) => entry.id === c.req.param("id"));
  if (!item) return c.json({ error: "Item not found" }, 404);
  return c.json({ item });
});

app.get("/runs", (c) => c.json({ runs: activity, activity }));
app.get("/approvals", (c) => c.json({ approvals }));

app.post("/approvals/:id/approve", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "approved";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/approvals/:id/deny", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "denied";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/webhooks/:triggerId", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, string>;
  return c.json({
    accepted: true,
    triggerId: c.req.param("triggerId"),
    preview: true,
    message: "Webhook accepted into preview runtime. Production secrets must be env-only.",
    receivedKeys: Object.keys(body),
  });
});

// Single product/route metadata endpoint. Replaces the previous per-route stubs,
// which registered "/runs" and "/approvals" a second time (dead, shadowed code)
// and registered "/agents/new" after "/agents/:id" so it was never reachable.
app.get("/meta", (c) =>
  c.json({
    service: "kiteagentos",
    product: "KiteAgentOS",
    modules,
    preview: true,
  }),
);

// Real Kite Mainnet read via the connectors package. Degrades to a preview-safe
// payload (HTTP 200) if chain infrastructure is unreachable, so clients never break.
app.get("/chain/stats", async (c) => {
  try {
    return c.json(await getChainStats());
  } catch (error) {
    return c.json({
      network: "mainnet",
      chainId: 2366,
      live: false,
      preview: true,
      error: error instanceof Error ? error.message : "chain read failed",
    });
  }
});

// Worker-backed preview run simulation. Exercises the @kiteagentos/worker runtime.
app.post("/runs/simulate", (c) => {
  const item = items[0];
  if (!item) return c.json({ error: "No items to simulate" }, 404);
  const runtime = new PreviewRuntime();
  runtime.enqueue({ item, message: `${item.name} preview run simulated` });
  return c.json({ event: runtime.tick(), preview: true }, 201);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((error, c) => c.json({ error: error instanceof Error ? error.message : "Internal error" }, 500));
