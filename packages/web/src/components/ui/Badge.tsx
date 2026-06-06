import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded border border-kite-sand bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">{children}</span>;
}
