import type { ReactNode } from "react";
import { Button } from "./Button";

export function ConfirmDialog({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-xl font-semibold text-kite-brown">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
      <div className="mt-4 flex gap-2">{children ?? <><Button>Confirm</Button><Button variant="secondary">Cancel</Button></>}</div>
    </div>
  );
}
