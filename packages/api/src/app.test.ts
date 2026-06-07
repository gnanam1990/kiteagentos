import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("kiteagentos API", () => {
  it("returns health", async () => {
    const response = await app.request("/health");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, service: "kiteagentos" });
  });

  it("lists primary agents", async () => {
    const response = await app.request("/agents");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.items.length).toBeGreaterThan(0);
  });

  it("lists activity and approvals", async () => {
    const runs = await app.request("/runs");
    const approvals = await app.request("/approvals");
    expect(runs.status).toBe(200);
    expect(approvals.status).toBe(200);
  });

  it("exposes product metadata on a single /meta route", async () => {
    const response = await app.request("/meta");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.service).toBe("kiteagentos");
    expect(Array.isArray(body.modules)).toBe(true);
  });

  it("returns a chain stats payload for the mainnet network", async () => {
    // Hits live infra when reachable; otherwise degrades to a preview payload.
    // Either way the contract is: HTTP 200 and network === "mainnet".
    const response = await app.request("/chain/stats");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.network).toBe("mainnet");
    expect(body.chainId).toBe(2366);
  });

  it("simulates a run through the worker runtime", async () => {
    const response = await app.request("/runs/simulate", { method: "POST" });
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.event).toBeTruthy();
    expect(body.preview).toBe(true);
  });

  it("returns JSON 404 for unknown routes", async () => {
    const response = await app.request("/does-not-exist");
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Not found" });
  });
});
