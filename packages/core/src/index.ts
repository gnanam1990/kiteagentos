export type KiteAddress = `0x${string}`;
export type TxHash = `0x${string}`;
export type ISODate = string;
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type PreviewStatus = "live" | "preview" | "estimated" | "coming-v0.2";
export type ItemStatus = "draft" | "active" | "paused" | "archived";
export type ApprovalStatus = "pending" | "approved" | "denied";

export interface ProductModule {
  id: string;
  name: string;
  description: string;
  preview: PreviewStatus;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  owner: KiteAddress;
  status: ItemStatus;
  risk: RiskLevel;
  moduleId: string;
  budgetKite: string;
  createdAt: ISODate;
}

export interface ActivityEvent {
  id: string;
  itemId: string;
  actor: "agent" | "operator" | "system" | "connector" | "approval";
  message: string;
  at: ISODate;
  status: "queued" | "running" | "waiting-approval" | "succeeded" | "failed";
  preview?: PreviewStatus;
  txHash?: TxHash;
}

export interface ApprovalRequest {
  id: string;
  itemId: string;
  status: ApprovalStatus;
  reason: string;
  risk: RiskLevel;
  requestedAt: ISODate;
  decidedAt?: ISODate;
}

const evmAddressPattern = /^0x[a-fA-F0-9]{40}$/;
const txHashPattern = /^0x[a-fA-F0-9]{64}$/;

export function isEvmAddress(value: string): value is KiteAddress {
  return evmAddressPattern.test(value);
}

export function isTxHash(value: string): value is TxHash {
  return txHashPattern.test(value);
}

export function assertEvmAddress(value: string): KiteAddress {
  if (!isEvmAddress(value)) throw new Error(`Invalid Kite/EVM address: ${value}`);
  return value;
}

export function assertTxHash(value: string): TxHash {
  if (!isTxHash(value)) throw new Error(`Invalid transaction hash: ${value}`);
  return value;
}

export function requiresApproval(risk: RiskLevel, fundMoving = false) {
  return fundMoving || risk === "high" || risk === "critical";
}

export function riskWeight(risk: RiskLevel) {
  return { low: 1, medium: 2, high: 3, critical: 4 }[risk];
}

export function highestRisk(risks: RiskLevel[]) {
  return risks.reduce<RiskLevel>((current, next) => (riskWeight(next) > riskWeight(current) ? next : current), "low");
}

export function buildActivity(item: ProductItem, message: string, now = new Date()): ActivityEvent {
  return {
    id: `evt_${item.id}_${now.getTime()}`,
    itemId: item.id,
    actor: requiresApproval(item.risk, Number(item.budgetKite) > 0) ? "approval" : "system",
    message,
    at: now.toISOString(),
    status: requiresApproval(item.risk, Number(item.budgetKite) > 0) ? "waiting-approval" : "succeeded",
    preview: "preview",
  };
}

export const demoAddress = assertEvmAddress("0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043");
export const demoTxHash = assertTxHash("0x1111111111111111111111111111111111111111111111111111111111111111");
