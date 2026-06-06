# KiteAgentOS — Project Prompt Pack

## One-line summary
Full operating system/control plane for autonomous Kite agents.

## Product positioning
Create, configure, monitor, approve, pause, and audit agents that use Kite wallets, tools, budgets, and services.

## Why this exists
AgentPilot is a chat surface. KiteAgentOS is the full operational control plane for production agents: identity, tools, budget, permissions, runs, approvals, and logs.

## Repository name
`kiteagentos`

## Header subtitle
`AGENTOS`

## Core routes
- `/`
- `/agents`
- `/agents/new`
- `/agents/:id`
- `/agents/:id/tools`
- `/agents/:id/budget`
- `/approvals`
- `/runs`
- `/settings`


## Core modules
1. **Agent Builder** — Create agent profiles with goals, instructions, wallet, and risk level.
2. **Tool Connector Registry** — Register tools/MCP connectors the agent can use.
3. **Budget + Policy Manager** — Set spending and action policies for every agent.
4. **Human Approval Inbox** — Inbox for risky actions before execution.
5. **Run Logs + Observability** — Timeline view of agent runs, tool calls, approvals, and txs.

## API surface
- `GET /agents`
- `POST /agents`
- `PATCH /agents/:id`
- `POST /agents/:id/pause`
- `GET /agents/:id/runs`
- `POST /agents/:id/run`
- `GET /approvals`
- `POST /approvals/:id/approve`
- `POST /approvals/:id/deny`


## Safety requirements
- Agent cannot execute wallet actions without policy pass
- Private keys never stored in web app
- All agents default to approval-required mode
- Risky connectors are PREVIEW until backend secrets are configured


## Build philosophy
This is not a small demo. Build it as a serious productivity platform for Kite AI agents. Every UI screen must move the user toward a real workflow, decision, payment, approval, or operational outcome.
