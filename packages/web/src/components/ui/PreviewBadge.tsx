import { Badge } from "./Badge";

export function PreviewBadge({ label = "PREVIEW" }: { label?: string }) {
  return <Badge>{label}</Badge>;
}
