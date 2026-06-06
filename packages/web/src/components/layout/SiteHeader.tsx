import kiteMark from "../../assets/brand/kite-logo-mark-black.png";
import { product } from "../../lib/product";

export function SiteHeader({ activePath }: { activePath: string }) {
  const links = product.routes.filter((route) => !route.includes(":")).map((route) => [route, route === "/" ? "Home" : route.split("/").filter(Boolean)[0]]);
  const uniqueLinks = Array.from(new Map(links.map(([route, label]) => [label, route])).entries()).slice(0, 7).map(([label, route]) => [route, label]);
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a className="flex items-center gap-3" href="/" aria-label={product.name}>
          <img className="h-10 w-10 object-contain" src={kiteMark} alt="Kite logo mark" />
          <div>
            <div className="kite-brand-word text-lg font-bold text-kite-brown">{product.name}</div>
            <div className="text-xs font-bold uppercase text-muted-foreground">{product.subtitle}</div>
          </div>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {uniqueLinks.map(([href, label]) => (
            <a key={href} className={`rounded-lg px-3 py-2 text-sm font-medium ${activePath === href ? "bg-secondary text-kite-brown" : "text-muted-foreground hover:bg-secondary"}`} href={href}>
              {String(label).charAt(0).toUpperCase() + String(label).slice(1)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
