import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

export function Button({ children, variant = "primary" }: { children: ReactNode; variant?: ButtonVariant }) {
  const base = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold";
  const style = {
    primary: "bg-primary text-primary-foreground",
    secondary: "border border-border bg-secondary text-kite-brown",
    danger: "bg-kite-rust text-white",
  }[variant];
  return <button className={`${base} ${style}`}>{children}</button>;
}
