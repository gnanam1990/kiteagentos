import { buildActivity, demoAddress, type ActivityEvent, type ApprovalRequest, type ProductItem, type ProductModule } from "@kiteagentos/core";

export const modules: ProductModule[] = [
  {
    "id": "module_1",
    "name": "Agent Builder",
    "description": "Create agent profiles with goals, instructions, wallet, and risk level.",
    "preview": "live"
  },
  {
    "id": "module_2",
    "name": "Tool Connector Registry",
    "description": "Register tools and MCP connectors the agent can use.",
    "preview": "preview"
  },
  {
    "id": "module_3",
    "name": "Budget + Policy Manager",
    "description": "Set spending and action policies for every agent.",
    "preview": "preview"
  },
  {
    "id": "module_4",
    "name": "Human Approval Inbox",
    "description": "Inbox for risky actions before execution.",
    "preview": "preview"
  },
  {
    "id": "module_5",
    "name": "Run Logs + Observability",
    "description": "Timeline of agent runs, tool calls, approvals, and txs.",
    "preview": "preview"
  }
];

export const items: ProductItem[] = [
  {
    "id": "agent_1",
    "name": "Agent Builder",
    "description": "Create agent profiles with goals, instructions, wallet, and risk level.",
    "owner": demoAddress,
    "status": "active",
    "risk": "medium",
    "moduleId": "module_1",
    "budgetKite": "5",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "agent_2",
    "name": "Tool Connector Registry",
    "description": "Register tools and MCP connectors the agent can use.",
    "owner": demoAddress,
    "status": "active",
    "risk": "high",
    "moduleId": "module_2",
    "budgetKite": "50",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "agent_3",
    "name": "Budget + Policy Manager",
    "description": "Set spending and action policies for every agent.",
    "owner": demoAddress,
    "status": "draft",
    "risk": "low",
    "moduleId": "module_3",
    "budgetKite": "0",
    "createdAt": "2026-06-06T02:00:00.000Z"
  }
];

export const activity: ActivityEvent[] = [
  buildActivity(items[0], "KiteAgentOS preview event accepted", new Date("2026-06-06T02:10:00.000Z")),
  buildActivity(items[1], "Risky Kite action queued for explicit approval", new Date("2026-06-06T02:20:00.000Z")),
];

export const approvals: ApprovalRequest[] = [
  {
    id: "approval_1",
    itemId: items[1].id,
    status: "pending",
    reason: "High-risk or fund-moving Kite action requires explicit approval.",
    risk: "high",
    requestedAt: "2026-06-06T02:20:00.000Z",
  },
];

export function createItem(input: Pick<ProductItem, "name" | "description" | "owner">) {
  const item: ProductItem = {
    id: `agent_${Date.now()}`,
    name: input.name,
    description: input.description,
    owner: input.owner,
    status: "draft",
    risk: "low",
    moduleId: modules[0].id,
    budgetKite: "0",
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  return item;
}
