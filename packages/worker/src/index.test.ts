import { describe, expect, it } from "vitest";
import { demoAddress, type ProductItem } from "@kiteagentos/core";
import { PreviewRuntime } from "./index.js";

const item: ProductItem = {
  id: "worker_item",
  name: "Agent Builder",
  description: "Create agent profiles with goals, instructions, wallet, and risk level.",
  owner: demoAddress,
  status: "active",
  risk: "low",
  moduleId: "module_1",
  budgetKite: "0",
  createdAt: "2026-06-06T00:00:00.000Z",
};

describe("PreviewRuntime", () => {
  it("runs queued preview activity", () => {
    const runtime = new PreviewRuntime();
    expect(runtime.enqueue({ item, message: "preview job" })).toBe(1);
    const event = runtime.tick(new Date("2026-06-06T03:00:00.000Z"));
    expect(event?.status).toBe("succeeded");
    expect(runtime.getHistory()).toHaveLength(1);
  });
});
