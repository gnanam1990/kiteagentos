import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function AppShell({ children, activePath }: { children: ReactNode; activePath: string }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader activePath={activePath} />
      <main className="mx-auto min-h-[calc(100vh-156px)] max-w-7xl px-5 py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
