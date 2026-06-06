export const product = {
  name: "KiteAgentOS",
  repo: "kiteagentos",
  subtitle: "AGENTOS",
  hero: "Operate autonomous Kite agents with policies, tools, budgets, approvals, and full run observability.",
  positioning: "Full operating system/control plane for autonomous Kite agents.",
  entity: "agents",
  entitySingular: "agent",
  entityRoute: "/agents",
  routes: [
  "/",
  "/agents",
  "/agents/new",
  "/agents/:id",
  "/agents/:id/tools",
  "/agents/:id/budget",
  "/approvals",
  "/runs",
  "/settings"
],
  modules: [
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
],
};
