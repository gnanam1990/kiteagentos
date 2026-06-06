import { describe, expect, it } from "vitest";
import { assertEvmAddress, buildActivity, demoAddress, isTxHash, requiresApproval, type ProductItem } from "@kiteagentos/core";

const item: ProductItem = {
  id: "item_1",
  name: "Preview item",
  description: "A preview-safe Kite product item.",
  owner: demoAddress,
  status: "active",
  risk: "high",
  moduleId: "module_1",
  budgetKite: "25",
  createdAt: "2026-06-06T00:00:00.000Z",
};

describe("Kite core safety", () => {
  it("validates addresses and transaction hashes", () => {
    expect(assertEvmAddress(demoAddress)).toBe(demoAddress);
    expect(isTxHash("0x" + "a".repeat(64))).toBe(true);
  });

  it("requires approval for risky or fund-moving actions", () => {
    expect(requiresApproval("high")).toBe(true);
    expect(requiresApproval("low", true)).toBe(true);
    expect(requiresApproval("low", false)).toBe(false);
  });

  it("builds approval-gated activity events", () => {
    const activity = buildActivity(item, "Queued for approval", new Date("2026-06-06T01:00:00.000Z"));
    expect(activity.status).toBe("waiting-approval");
    expect(activity.actor).toBe("approval");
  });
});
