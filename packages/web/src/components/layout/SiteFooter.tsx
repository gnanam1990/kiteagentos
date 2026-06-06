import { product } from "../../lib/product";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>{product.name} is community-built and preview-safe.</span>
        <div className="flex flex-wrap gap-4">
          <a href="https://gokite.ai">Kite</a>
          <a href="https://kitescan.ai">KiteScan</a>
          <a href="https://docs.gokite.ai">Docs</a>
          <a href="https://discord.gg/gokite">Discord</a>
        </div>
      </div>
    </footer>
  );
}
