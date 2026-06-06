import { product } from "./product";

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: string;
  risk: string;
  moduleId: string;
  budgetKite: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  itemId: string;
  actor: string;
  message: string;
  at: string;
  status: string;
  preview?: string;
}

export interface ApprovalRequest {
  id: string;
  itemId: string;
  status: string;
  reason: string;
  risk: string;
  requestedAt: string;
}

const configuredApiBase = (import.meta.env.VITE_API_URL ?? "").trim();
const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalPage = typeof window !== "undefined" && localHostnames.has(window.location.hostname);

function resolveApiBase(value: string) {
  if (!value) return isLocalPage ? "http://localhost:8787" : "";
  try {
    const url = new URL(value);
    if (localHostnames.has(url.hostname) && !isLocalPage) return "";
    return value.replace(/\/$/, "");
  } catch {
    return "";
  }
}

const apiBase = resolveApiBase(configuredApiBase);

async function getJson<T>(path: string, fallback: T): Promise<T> {
  if (!apiBase) return fallback;
  try {
    const response = await fetch(`${apiBase}${path}`);
    if (!response.ok) throw new Error(String(response.status));
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const fallbackItems: ProductItem[] = product.modules.slice(0, 3).map((module, index) => ({
  id: `${product.entitySingular.replace(/\s+/g, "_")}_${index + 1}`,
  name: module.name,
  description: module.description,
  owner: "0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043",
  status: index === 2 ? "draft" : "active",
  risk: index === 0 ? "medium" : index === 1 ? "high" : "low",
  moduleId: module.id,
  budgetKite: index === 1 ? "50" : index === 0 ? "5" : "0",
  createdAt: "2026-06-06T02:00:00.000Z",
}));

export const fallbackActivity: ActivityEvent[] = [
  {
    id: "activity_1",
    itemId: fallbackItems[0].id,
    actor: "connector",
    message: `${product.name} preview event accepted`,
    at: "2026-06-06T02:10:00.000Z",
    status: "succeeded",
    preview: "preview",
  },
  {
    id: "activity_2",
    itemId: fallbackItems[1].id,
    actor: "approval",
    message: "Risky Kite action queued for explicit approval",
    at: "2026-06-06T02:20:00.000Z",
    status: "waiting-approval",
    preview: "preview",
  },
];

export const fallbackApprovals: ApprovalRequest[] = [
  {
    id: "approval_1",
    itemId: fallbackItems[1].id,
    status: "pending",
    reason: "High-risk or fund-moving Kite action requires explicit approval.",
    risk: "high",
    requestedAt: "2026-06-06T02:20:00.000Z",
  },
];

export function fetchItems() {
  return getJson<{ items: ProductItem[] }>(product.entityRoute, { items: fallbackItems });
}

export function fetchActivity() {
  return getJson<{ activity: ActivityEvent[] }>("/runs", { activity: fallbackActivity });
}

export function fetchApprovals() {
  return getJson<{ approvals: ApprovalRequest[] }>("/approvals", { approvals: fallbackApprovals });
}
