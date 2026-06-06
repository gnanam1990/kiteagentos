import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  Code2,
  FileText,
  Gauge,
  GitBranch,
  KeyRound,
  LineChart,
  ListChecks,
  LockKeyhole,
  Network,
  PackageCheck,
  Radar,
  ReceiptText,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  TerminalSquare,
  TrendingUp,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import kiteMark from "./assets/brand/kite-logo-mark-black.png";
import kiteMarkWhite from "./assets/brand/kite-logo-mark-white.png";
import { product } from "./lib/product";
import {
  fallbackActivity,
  fallbackApprovals,
  fallbackItems,
  fetchActivity,
  fetchApprovals,
  fetchItems,
  type ActivityEvent,
  type ApprovalRequest,
  type ProductItem,
} from "./lib/api";

type ExperienceConfig = {
  experience: "agentos" | "api" | "security" | "workforce" | "commerce" | "treasury" | "credit" | "research" | "trade";
  chrome: "rail" | "top" | "dark" | "profile" | "terminal";
  accent: string;
  primary: string;
  secondary: string;
  heroLabel: string;
};

const experience: ExperienceConfig = {
  "experience": "agentos",
  "chrome": "rail",
  "accent": "Agent command",
  "primary": "Open agent roster",
  "secondary": "Review policies",
  "heroLabel": "Autonomous agent operating layer"
};

type NavItem = [string, string];

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const good = ["active", "succeeded", "approved", "live", "safe", "paid"].includes(normalized);
  const risk = ["waiting-approval", "pending", "high", "critical", "blocked"].includes(normalized);
  return (
    <span className={cx(
      "inline-flex items-center rounded px-2.5 py-1 text-xs font-bold uppercase",
      good && "bg-[#e4eadf] text-[#45543f]",
      risk && "bg-[#ead9d0] text-kite-rust",
      !good && !risk && "bg-secondary text-muted-foreground"
    )}>
      {value}
    </span>
  );
}

function BrandLockup({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <a className="flex items-center gap-3" href="/" aria-label={product.name}>
      <img className={cx("object-contain", compact ? "h-8 w-8" : "h-10 w-10")} src={inverse ? kiteMarkWhite : kiteMark} alt="Kite logo mark" />
      <div>
        <div className={cx("kite-brand-word font-bold", compact ? "text-base" : "text-lg", inverse ? "text-kite-cream" : "text-kite-brown")}>{product.name}</div>
        <div className={cx("text-xs font-bold uppercase", inverse ? "text-kite-cream/60" : "text-muted-foreground")}>{product.subtitle}</div>
      </div>
    </a>
  );
}

function navItems(): NavItem[] {
  const labels = product.routes
    .filter((route) => !route.includes(":"))
    .map((route) => [route, route === "/" ? "Home" : titleCase(route.split("/").filter(Boolean)[0])] as NavItem);
  return Array.from(new Map(labels.map(([route, label]) => [label, route])).entries()).slice(0, 7).map(([label, route]) => [route, label]);
}

function NavLinks({ activePath, vertical = false, inverse = false }: { activePath: string; vertical?: boolean; inverse?: boolean }) {
  return (
    <nav className={cx(vertical ? "grid gap-1" : "hidden items-center gap-1 lg:flex")}>
      {navItems().map(([href, label]) => (
        <a
          key={href}
          className={cx(
            "rounded-lg px-3 py-2 text-sm font-semibold transition",
            activePath === href && (inverse ? "bg-kite-cream text-kite-brown" : "bg-secondary text-kite-brown"),
            activePath !== href && (inverse ? "text-kite-cream/70 hover:bg-kite-cream/10" : "text-muted-foreground hover:bg-secondary")
          )}
          href={href}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

function Shell({ children, activePath }: { children: ReactNode; activePath: string }) {
  if (experience.chrome === "rail") {
    return (
      <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-border bg-card px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <BrandLockup />
          <div className="mt-8 hidden lg:block">
            <NavLinks activePath={activePath} vertical />
            <div className="mt-8 rounded-lg border border-border bg-secondary p-4">
              <p className="text-xs font-bold uppercase text-muted-foreground">{experience.accent}</p>
              <p className="mt-2 text-sm leading-6 text-kite-brown">{experience.heroLabel}</p>
            </div>
          </div>
        </aside>
        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    );
  }

  if (experience.chrome === "dark" || experience.chrome === "terminal") {
    return (
      <div className="min-h-screen bg-[#241a18] text-kite-cream">
        <header className="border-b border-kite-cream/10 bg-[#1f1715]/95 px-5 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <BrandLockup inverse />
            <NavLinks activePath={activePath} inverse />
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-7">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <BrandLockup />
          <NavLinks activePath={activePath} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-7">{children}</main>
    </div>
  );
}

function ButtonLink({ href, children, variant = "primary", inverse = false }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "danger"; inverse?: boolean }) {
  return (
    <a
      href={href}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition",
        variant === "primary" && !inverse && "bg-primary text-primary-foreground hover:bg-kite-brown",
        variant === "primary" && inverse && "bg-kite-cream text-kite-brown hover:bg-white",
        variant === "secondary" && !inverse && "border border-border bg-card text-kite-brown hover:bg-secondary",
        variant === "secondary" && inverse && "border border-kite-cream/20 bg-kite-cream/10 text-kite-cream hover:bg-kite-cream/15",
        variant === "danger" && "bg-kite-rust text-white"
      )}
    >
      {children}
    </a>
  );
}

function Surface({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <section className={cx("rounded-lg border p-5", dark ? "border-kite-cream/10 bg-kite-cream/[0.06]" : "border-border bg-card", className)}>
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title, body, inverse = false }: { icon: LucideIcon; title: string; body: string; inverse?: boolean }) {
  return (
    <div>
      <div className={cx("mb-3 flex items-center gap-2 text-sm font-bold uppercase", inverse ? "text-kite-cream/60" : "text-muted-foreground")}><Icon size={18} /> {experience.accent}</div>
      <h1 className={cx("max-w-4xl text-4xl font-bold leading-none sm:text-5xl", inverse ? "text-kite-cream" : "text-kite-brown")}>{title}</h1>
      <p className={cx("mt-4 max-w-3xl text-base leading-7", inverse ? "text-kite-cream/70" : "text-muted-foreground")}>{body}</p>
    </div>
  );
}

function Metric({ label, value, hint, dark = false }: { label: string; value: string; hint?: string; dark?: boolean }) {
  return (
    <div className={cx("rounded-lg border p-4", dark ? "border-kite-cream/10 bg-kite-cream/[0.05]" : "border-border bg-card")}>
      <p className={cx("text-xs font-bold uppercase", dark ? "text-kite-cream/50" : "text-muted-foreground")}>{label}</p>
      <p className={cx("mt-2 text-2xl font-bold", dark ? "text-kite-cream" : "text-kite-brown")}>{value}</p>
      {hint ? <p className={cx("mt-1 text-xs", dark ? "text-kite-cream/50" : "text-muted-foreground")}>{hint}</p> : null}
    </div>
  );
}

function Bars({ values, dark = false }: { values: number[]; dark?: boolean }) {
  return (
    <div className="flex h-28 items-end gap-2">
      {values.map((value, index) => (
        <div key={index} className={cx("w-full rounded-t", dark ? "bg-kite-cream" : "bg-primary")} style={{ height: `${value}%`, opacity: 0.35 + index * 0.06 }} />
      ))}
    </div>
  );
}

function ModuleList({ dark = false, dense = false }: { dark?: boolean; dense?: boolean }) {
  return (
    <div className="grid gap-3">
      {product.modules.map((module, index) => (
        <div key={module.id} className={cx("rounded-lg border p-4", dark ? "border-kite-cream/10 bg-kite-cream/[0.05]" : "border-border bg-secondary")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={cx("font-semibold", dark ? "text-kite-cream" : "text-kite-brown")}>{module.name}</p>
              {!dense ? <p className={cx("mt-2 text-sm leading-6", dark ? "text-kite-cream/60" : "text-muted-foreground")}>{module.description}</p> : null}
            </div>
            <StatusPill value={index === 0 ? "live" : module.preview} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentOsHome({ items, activity, approvals }: { items: ProductItem[]; activity: ActivityEvent[]; approvals: ApprovalRequest[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionTitle icon={Bot} title="Agent operating system with policy rails." body={product.hero} />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric label="Agents" value={String(items.length)} hint="registered" />
          <Metric label="Policies" value="18" hint="guardrails" />
          <Metric label="Approvals" value={String(approvals.length)} hint="pending" />
        </div>
        <div className="mt-6 grid gap-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-kite-brown text-kite-cream"><Bot size={18} /></div>
                <div><p className="font-semibold text-kite-brown">{item.name}</p><p className="text-xs text-muted-foreground">wallet policy-{index + 1} · {item.budgetKite} KITE cap</p></div>
              </div>
              <StatusPill value={item.risk} />
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-5">
        <Surface>
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-kite-brown">Policy console</h2><ShieldCheck className="text-kite-olive" /></div>
          <div className="mt-5 grid gap-3">
            {["fund movement requires approval", "tool access scoped by task", "budget resets after review"].map((rule) => <div key={rule} className="rounded border border-border bg-background px-3 py-2 text-sm font-semibold text-kite-brown">{rule}</div>)}
          </div>
        </Surface>
        <Surface>
          <h2 className="text-2xl font-bold text-kite-brown">Live run stream</h2>
          <div className="mt-4 grid gap-3">
            {activity.map((event) => <div key={event.id} className="flex gap-3 text-sm"><Activity className="mt-1 text-kite-sand" size={16} /><div><p className="font-semibold text-kite-brown">{event.actor}</p><p className="text-muted-foreground">{event.message}</p></div></div>)}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function ApiHome({ items }: { items: ProductItem[] }) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <SectionTitle icon={Code2} title="API products metered for Kite agents." body={product.hero} />
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={product.entityRoute}><Zap size={16} /> {experience.primary}</ButtonLink>
            <ButtonLink href="/usage" variant="secondary"><BarChart3 size={16} /> {experience.secondary}</ButtonLink>
          </div>
        </div>
        <Surface className="bg-[#fffdf9]">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-kite-brown">Endpoint revenue</h2><StatusPill value="live" /></div>
          <Bars values={[32, 48, 42, 68, 57, 82, 73, 91]} />
          <div className="mt-4 grid gap-2">
            {["GET /agent/profile", "POST /payments/verify", "GET /usage/meter"].map((endpoint, index) => (
              <div key={endpoint} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded border border-border bg-secondary px-3 py-2 text-sm">
                <span className="font-mono text-kite-brown">{endpoint}</span><span className="text-muted-foreground">{1200 + index * 340} calls</span><StatusPill value={index === 0 ? "paid" : "active"} />
              </div>
            ))}
          </div>
        </Surface>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {items.map((item) => <Metric key={item.id} label={item.name} value={`${item.budgetKite} KITE`} hint={item.description} />)}
      </section>
    </div>
  );
}

function SecurityHome({ items, approvals }: { items: ProductItem[]; approvals: ApprovalRequest[] }) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-kite-cream/10 bg-kite-cream/[0.06] p-6">
          <SectionTitle icon={ShieldCheck} title="Security command center for agent wallets." body={product.hero} inverse />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Metric label="Critical" value="2" dark />
            <Metric label="Scans" value={String(items.length + 9)} dark />
            <Metric label="Queues" value={String(approvals.length)} dark />
          </div>
        </div>
        <Surface dark>
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-kite-cream">Wallet scan panel</h2><Radar /></div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["Signature preview", "Contract risk", "Emergency revoke"].map((lane, index) => (
              <div key={lane} className="min-h-40 rounded-lg border border-kite-cream/10 bg-[#1c1412] p-4">
                <p className="text-sm font-bold text-kite-cream">{lane}</p>
                <p className="mt-3 text-xs leading-5 text-kite-cream/55">{product.modules[index]?.description}</p>
                <div className="mt-4"><StatusPill value={index === 0 ? "high" : "preview"} /></div>
              </div>
            ))}
          </div>
        </Surface>
      </section>
      <Surface dark>
        <h2 className="text-xl font-bold text-kite-cream">Incident lanes</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["Triage", "Contain", "Revoke", "Audit"].map((stage, index) => <div key={stage} className="rounded-lg bg-kite-cream/[0.05] p-4 text-sm text-kite-cream/70"><p className="font-bold text-kite-cream">{stage}</p><p className="mt-2">{index + 1} active runbooks</p></div>)}
        </div>
      </Surface>
    </div>
  );
}

function WorkforceHome({ items }: { items: ProductItem[] }) {
  const lanes = [
    { name: "Posted tasks", status: "active", cards: items.map((item, index) => ({ title: item.name, body: item.description, meta: `${index + 2} agent bids` })) },
    { name: "Agent bids", status: "active", cards: [
      { title: "Support Agent", body: "Can finish triage with transcript proof and response summary.", meta: "12 KITE · 2h" },
      { title: "Audit Agent", body: "Offers deterministic checks and contract diff notes.", meta: "34 KITE · 6h" },
      { title: "Research Agent", body: "Produces source-linked market brief with wallet evidence.", meta: "18 KITE · 4h" },
    ] },
    { name: "Proof review", status: "pending", cards: [
      { title: "Transcript bundle", body: "Customer support task submitted two artifacts for review.", meta: "2 files" },
      { title: "Scan report", body: "Contract audit delivered findings with severity labels.", meta: "pending" },
      { title: "Brief draft", body: "Research output waits for source verification.", meta: "needs review" },
    ] },
    { name: "Escrow release", status: "active", cards: [
      { title: "Milestone 1", body: "Proof accepted. Payout queued for operator approval.", meta: "120 KITE" },
      { title: "Dispute hold", body: "Buyer challenged artifact quality before settlement.", meta: "on hold" },
      { title: "Reputation update", body: "Successful delivery raises agent reliability score.", meta: "+4 trust" },
    ] },
  ];
  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle icon={Briefcase} title="A paid task floor for autonomous agents." body={product.hero} />
          <div className="flex gap-3"><ButtonLink href="/tasks/new"><Briefcase size={16} /> {experience.primary}</ButtonLink><ButtonLink href="/escrow" variant="secondary"><Wallet size={16} /> {experience.secondary}</ButtonLink></div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-4">
        {lanes.map((lane) => (
          <div key={lane.name} className="rounded-lg border border-border bg-secondary p-4">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-kite-brown">{lane.name}</h2><StatusPill value={lane.status} /></div>
            {lane.cards.map((entry) => (
              <div key={entry.title} className="mb-3 rounded-lg border border-border bg-card p-3">
                <p className="font-semibold text-kite-brown">{entry.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{entry.body}</p>
                <p className="mt-3 text-xs font-bold text-kite-sand">{entry.meta}</p>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}

function CommerceHome() {
  const flow = [
    ["Buyer agent", "Compares options within policy", ShoppingBag],
    ["Merchant agent", "Confirms availability and terms", Bot],
    ["Payment receipt", "Verifies Kite transaction proof", ReceiptText],
    ["Refund lane", "Handles disputes and reversals", RefreshCcw],
  ] as const;
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionTitle icon={Network} title="Agent-to-agent commerce, mapped end to end." body={product.hero} />
        <div className="mt-6 grid gap-3">
          {product.modules.slice(0, 3).map((module) => <Surface key={module.id} className="bg-secondary"><p className="font-bold text-kite-brown">{module.name}</p><p className="mt-2 text-sm text-muted-foreground">{module.description}</p></Surface>)}
        </div>
      </section>
      <Surface>
        <h2 className="text-2xl font-bold text-kite-brown">Commerce flow</h2>
        <div className="mt-6 grid gap-4">
          {flow.map(([name, body, Icon], index) => (
            <div key={name} className="grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-lg border border-border bg-secondary p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-kite-brown text-kite-cream"><Icon size={20} /></div>
              <div><p className="font-bold text-kite-brown">{name}</p><p className="text-sm text-muted-foreground">{body}</p></div>
              {index < flow.length - 1 ? <ArrowRight className="text-kite-sand" /> : <StatusPill value="settled" />}
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function TreasuryHome({ approvals }: { approvals: ApprovalRequest[] }) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <SectionTitle icon={CircleDollarSign} title="Treasury desk for balances, budgets, and spend approvals." body={product.hero} />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Total balance" value="18,420 KITE" hint="across agent wallets" />
            <Metric label="Runway" value="74 days" hint="forecast window" />
            <Metric label="Pending spend" value={String(approvals.length)} hint="approval queue" />
          </div>
        </div>
        <Surface>
          <h2 className="text-2xl font-bold text-kite-brown">Spend forecast</h2>
          <Bars values={[28, 34, 31, 45, 52, 49, 63, 59]} />
        </Surface>
      </section>
      <section className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <Surface><h2 className="text-xl font-bold text-kite-brown">Approval ledger</h2><ModuleList dense /></Surface>
        <Surface><h2 className="text-xl font-bold text-kite-brown">Anomaly watch</h2><div className="mt-4 grid gap-3">{["Spike in API spend", "New counterparty wallet", "Budget nearing policy cap"].map((item) => <div key={item} className="rounded border border-border bg-secondary px-3 py-3 text-sm font-semibold text-kite-brown">{item}</div>)}</div></Surface>
      </section>
    </div>
  );
}

function CreditHome({ items }: { items: ProductItem[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionTitle icon={Gauge} title="Agent reliability profiles with explainable scoring." body={product.hero} />
        <div className="mt-7 rounded-lg bg-kite-brown p-6 text-kite-cream">
          <p className="text-sm font-bold uppercase text-kite-cream/60">Trust score</p>
          <p className="mt-2 text-7xl font-bold">842</p>
          <p className="mt-3 text-sm text-kite-cream/70">strong payment reliability · medium counterparty concentration</p>
        </div>
      </section>
      <div className="grid gap-5">
        <Surface>
          <h2 className="text-2xl font-bold text-kite-brown">Factor breakdown</h2>
          <div className="mt-5 grid gap-3">
            {["Payment success", "Dispute history", "Counterparty graph", "Execution consistency"].map((factor, index) => (
              <div key={factor}>
                <div className="flex justify-between text-sm font-semibold text-kite-brown"><span>{factor}</span><span>{88 - index * 9}%</span></div>
                <div className="mt-2 h-2 rounded bg-secondary"><div className="h-2 rounded bg-primary" style={{ width: `${88 - index * 9}%` }} /></div>
              </div>
            ))}
          </div>
        </Surface>
        <Surface>
          <h2 className="text-xl font-bold text-kite-brown">Ranked agents</h2>
          <div className="mt-4 grid gap-3">
            {items.map((item, index) => <div key={item.id} className="flex items-center justify-between rounded border border-border bg-secondary px-3 py-2"><span className="font-semibold text-kite-brown">{item.name}</span><span className="font-mono text-sm text-muted-foreground">#{index + 1}</span></div>)}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function ResearchHome() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionTitle icon={Search} title="A research desk for Kite ecosystem intelligence." body={product.hero} />
        <div className="mt-6 rounded-lg border border-border bg-[#fffdf9] p-5">
          <div className="flex items-center justify-between"><p className="text-sm font-bold uppercase text-muted-foreground">Draft brief</p><StatusPill value="preview" /></div>
          <h2 className="mt-4 text-3xl font-bold text-kite-brown">Kite daily signal brief</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Wallet movement, contract changes, product updates, and alert conditions organized into a publish-ready research note.</p>
          <div className="mt-5 grid gap-2">
            {["Wallet activity crossed watch threshold", "Three product repos changed since last brief", "No critical contract alerts detected"].map((line) => <div key={line} className="rounded border border-border bg-secondary px-3 py-2 text-sm text-kite-brown">{line}</div>)}
          </div>
        </div>
      </section>
      <div className="grid gap-5">
        <Surface><h2 className="text-xl font-bold text-kite-brown">Watchlists</h2><ModuleList dense /></Surface>
        <Surface><h2 className="text-xl font-bold text-kite-brown">Alert feed</h2><div className="mt-4 grid gap-3">{["New wallet cluster", "Repository release note", "RPC anomaly sample"].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-kite-brown"><Activity size={16} className="text-kite-sand" /> {item}</div>)}</div></Surface>
      </div>
    </div>
  );
}

function TradeHome({ items }: { items: ProductItem[] }) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-kite-cream/10 bg-kite-cream/[0.06] p-6">
          <SectionTitle icon={TrendingUp} title="Trading strategies with guardrails first." body={product.hero} inverse />
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={product.entityRoute} inverse><LineChart size={16} /> {experience.primary}</ButtonLink>
            <ButtonLink href="/risk" variant="secondary" inverse><ShieldCheck size={16} /> {experience.secondary}</ButtonLink>
          </div>
        </div>
        <Surface dark>
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-kite-cream">Portfolio curve</h2><StatusPill value="approval-first" /></div>
          <Bars values={[35, 44, 39, 58, 51, 68, 64, 79]} dark />
        </Surface>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <Surface dark><h2 className="text-xl font-bold text-kite-cream">Strategies</h2><div className="mt-4 grid gap-3">{items.map((item) => <div key={item.id} className="rounded border border-kite-cream/10 bg-[#1c1412] p-4"><p className="font-bold text-kite-cream">{item.name}</p><p className="mt-2 text-sm text-kite-cream/60">{item.description}</p></div>)}</div></Surface>
        <Surface dark><h2 className="text-xl font-bold text-kite-cream">Guardrails</h2><div className="mt-4 grid gap-3">{["Max slippage locked", "Recipient allowlist", "Loss stop requires approval", "Execution audit active"].map((item) => <div key={item} className="flex items-center justify-between rounded border border-kite-cream/10 bg-kite-cream/[0.05] px-3 py-3 text-sm text-kite-cream/75"><span>{item}</span><LockKeyhole size={16} /></div>)}</div></Surface>
      </section>
    </div>
  );
}

function HomePage({ items, activity, approvals }: { items: ProductItem[]; activity: ActivityEvent[]; approvals: ApprovalRequest[] }) {
  switch (experience.experience) {
    case "agentos": return <AgentOsHome items={items} activity={activity} approvals={approvals} />;
    case "api": return <ApiHome items={items} />;
    case "security": return <SecurityHome items={items} approvals={approvals} />;
    case "workforce": return <WorkforceHome items={items} />;
    case "commerce": return <CommerceHome />;
    case "treasury": return <TreasuryHome approvals={approvals} />;
    case "credit": return <CreditHome items={items} />;
    case "research": return <ResearchHome />;
    case "trade": return <TradeHome items={items} />;
    default: return <AgentOsHome items={items} activity={activity} approvals={approvals} />;
  }
}

function EntityPage({ items }: { items: ProductItem[] }) {
  const inverse = experience.chrome === "dark" || experience.chrome === "terminal";
  return (
    <div className="grid gap-5">
      <SectionTitle icon={PackageCheck} title={titleCase(product.entity)} body={product.positioning} inverse={inverse} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Surface key={item.id} dark={inverse}>
            <div className="flex items-start justify-between gap-3">
              <div><h2 className={cx("text-xl font-bold", inverse ? "text-kite-cream" : "text-kite-brown")}>{item.name}</h2><p className={cx("mt-2 text-sm leading-6", inverse ? "text-kite-cream/60" : "text-muted-foreground")}>{item.description}</p></div>
              <StatusPill value={item.risk} />
            </div>
            <div className={cx("mt-5 rounded border px-3 py-2 text-sm", inverse ? "border-kite-cream/10 bg-kite-cream/[0.05] text-kite-cream/70" : "border-border bg-secondary text-muted-foreground")}>Budget <span className="font-mono">{item.budgetKite} KITE</span></div>
          </Surface>
        ))}
      </div>
    </div>
  );
}

function NewItemPage() {
  const inverse = experience.chrome === "dark" || experience.chrome === "terminal";
  return (
    <div className="grid gap-5">
      <SectionTitle icon={ListChecks} title={`New ${product.entitySingular}`} body="Draft the object, policy, owner, and approval posture before it can move funds or trust state." inverse={inverse} />
      <Surface dark={inverse}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={cx("text-sm font-bold", inverse ? "text-kite-cream" : "text-kite-brown")}>Name<input className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-kite-brown" defaultValue={product.modules[0].name} /></label>
          <label className={cx("text-sm font-bold", inverse ? "text-kite-cream" : "text-kite-brown")}>Risk policy<select className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-kite-brown" defaultValue="medium"><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select></label>
        </div>
        <textarea className="mt-4 min-h-28 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-kite-brown" defaultValue={product.modules[0].description} />
      </Surface>
    </div>
  );
}

function ActivityPage({ activity }: { activity: ActivityEvent[] }) {
  const inverse = experience.chrome === "dark" || experience.chrome === "terminal";
  return (
    <div className="grid gap-5">
      <SectionTitle icon={Activity} title="Activity runs" body="Queued, approval-gated, succeeded, or failed runtime events for this product." inverse={inverse} />
      <div className="grid gap-3">
        {activity.map((event) => (
          <Surface key={event.id} dark={inverse}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div><p className={cx("font-mono text-sm", inverse ? "text-kite-cream" : "text-kite-brown")}>{event.id}</p><p className={cx("mt-2 text-sm", inverse ? "text-kite-cream/60" : "text-muted-foreground")}>{event.message}</p></div>
              <div className="flex gap-2"><StatusPill value={event.status} /><StatusPill value={event.actor} /></div>
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}

function ApprovalsPage({ approvals, onResolve }: { approvals: ApprovalRequest[]; onResolve: (id: string, status: string) => void }) {
  const inverse = experience.chrome === "dark" || experience.chrome === "terminal";
  return (
    <div className="grid gap-5">
      <SectionTitle icon={ShieldCheck} title="Approvals" body="Risky or fund-moving actions wait here until an operator resolves them." inverse={inverse} />
      {approvals.length === 0 ? (
        <Surface dark={inverse}><p className={cx("font-bold", inverse ? "text-kite-cream" : "text-kite-brown")}>No approvals waiting</p><p className={cx("mt-2 text-sm", inverse ? "text-kite-cream/60" : "text-muted-foreground")}>Resolved actions stay recorded in the audit stream.</p></Surface>
      ) : (
        <div className="grid gap-3">
          {approvals.map((approval) => (
            <Surface key={approval.id} dark={inverse}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div><p className={cx("font-mono text-sm", inverse ? "text-kite-cream" : "text-kite-brown")}>{approval.id}</p><p className={cx("mt-2 text-sm", inverse ? "text-kite-cream/60" : "text-muted-foreground")}>{approval.reason}</p></div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => onResolve(approval.id, "approved")} className={cx("inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold", inverse ? "bg-kite-cream text-kite-brown" : "bg-primary text-primary-foreground")}><CheckCircle2 size={16} /> Approve</button>
                  <button type="button" onClick={() => onResolve(approval.id, "denied")} className="inline-flex items-center gap-2 rounded-lg bg-kite-rust px-4 py-2 text-sm font-bold text-white"><AlertTriangle size={16} /> Deny</button>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      )}
    </div>
  );
}

function GenericRoutePage() {
  const inverse = experience.chrome === "dark" || experience.chrome === "terminal";
  const path = window.location.pathname;
  const label = titleCase(path.split("/").filter(Boolean)[0] ?? "workspace");
  return (
    <div className="grid gap-5">
      <SectionTitle icon={TerminalSquare} title={label} body={`${product.name} operational workspace for ${label.toLowerCase()}.`} inverse={inverse} />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Surface dark={inverse}><h2 className={cx("text-2xl font-bold", inverse ? "text-kite-cream" : "text-kite-brown")}>Module map</h2><div className="mt-4"><ModuleList dark={inverse} /></div></Surface>
        <Surface dark={inverse}><h2 className={cx("text-2xl font-bold", inverse ? "text-kite-cream" : "text-kite-brown")}>Network policy</h2><div className="mt-4 grid gap-3">{["Kite chain 2366", "Approval-first execution", "Preview labels visible", "No production localhost calls"].map((item) => <div key={item} className={cx("rounded border px-3 py-2 text-sm", inverse ? "border-kite-cream/10 bg-kite-cream/[0.05] text-kite-cream/70" : "border-border bg-secondary text-kite-brown")}>{item}</div>)}</div></Surface>
      </div>
    </div>
  );
}

export function App() {
  const [items, setItems] = useState(fallbackItems);
  const [activity, setActivity] = useState(fallbackActivity);
  const [approvals, setApprovals] = useState(fallbackApprovals);
  const path = window.location.pathname;

  useEffect(() => {
    fetchItems().then((data) => setItems(data.items));
    fetchActivity().then((data) => setActivity(data.activity));
    fetchApprovals().then((data) => setApprovals(data.approvals));
  }, []);

  const page = useMemo(() => {
    if (path === "/") return <HomePage items={items} activity={activity} approvals={approvals} />;
    if (path === product.entityRoute) return <EntityPage items={items} />;
    if (path.endsWith("/new")) return <NewItemPage />;
    if (path.startsWith(product.entityRoute + "/")) return <EntityPage items={items} />;
    if (path === "/runs" || path === "/executions") return <ActivityPage activity={activity} />;
    if (path === "/approvals") return <ApprovalsPage approvals={approvals} onResolve={(id, status) => setApprovals((current) => current.map((approval) => approval.id === id ? { ...approval, status } : approval).filter((approval) => approval.status === "pending"))} />;
    if (product.routes.some((route) => path === route || (!route.includes(":") && path.startsWith(route + "/")))) return <GenericRoutePage />;
    return <GenericRoutePage />;
  }, [activity, approvals, items, path]);

  return <Shell activePath={path}>{page}</Shell>;
}
