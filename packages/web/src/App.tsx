import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, KeyRound, ListChecks, Play, ShieldCheck, Wallet } from "lucide-react";
import { AppShell } from "./components/layout/AppShell";
import { AddressDisplay } from "./components/ui/AddressDisplay";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { EmptyState } from "./components/ui/EmptyState";
import { ErrorState } from "./components/ui/ErrorState";
import { MonoValue } from "./components/ui/MonoValue";
import { PreviewBadge } from "./components/ui/PreviewBadge";
import { Select } from "./components/ui/Select";
import { Textarea } from "./components/ui/Textarea";
import { product } from "./lib/product";
import { fallbackActivity, fallbackApprovals, fallbackItems, fetchActivity, fetchApprovals, fetchItems, type ActivityEvent, type ApprovalRequest, type ProductItem } from "./lib/api";

function StatusBadge({ status }: { status: string }) {
  const isGood = status === "active" || status === "succeeded" || status === "approved" || status === "live";
  const isRisk = status === "waiting-approval" || status === "pending" || status === "high" || status === "critical";
  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold ${isGood ? "bg-secondary text-kite-olive" : isRisk ? "bg-secondary text-kite-rust" : "bg-secondary text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2 text-muted-foreground"><Activity size={22} /><PreviewBadge /></div>
      <h1 className="text-4xl font-bold tracking-tight text-kite-brown">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function HomePage({ items, activity, approvals }: { items: ProductItem[]; activity: ActivityEvent[]; approvals: ApprovalRequest[] }) {
  const metrics = [
    ["Active " + product.entity, items.filter((item) => item.status === "active").length.toString()],
    ["Events today", activity.length.toString()],
    ["Approval queue", approvals.filter((item) => item.status === "pending").length.toString()],
    ["Kite chain", "2366"],
  ];

  return (
    <>
      <section className="rounded-xl border border-border bg-secondary p-8">
        <PreviewBadge label="PREVIEW HONESTY" />
        <h1 className="mt-6 max-w-4xl text-6xl font-bold tracking-tight text-kite-brown">{product.hero}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{product.positioning} Every risky or fund-moving action is approval-first and labeled honestly.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={product.entityRoute}><Button><Play size={16} /> Open {product.entity}</Button></a>
          <a href="/approvals"><Button variant="secondary"><ShieldCheck size={16} /> Review approvals</Button></a>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-3 font-mono text-2xl font-bold text-kite-brown">{value}</p>
          </Card>
        ))}
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-5">
        {product.modules.map((module) => (
          <Card key={module.id}>
            <ListChecks className="mb-4 text-kite-olive" size={22} />
            <h3 className="text-xl font-semibold text-kite-brown">{module.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
            <div className="mt-4"><StatusBadge status={module.preview} /></div>
          </Card>
        ))}
      </section>
    </>
  );
}

function EntityPage({ items }: { items: ProductItem[] }) {
  return (
    <>
      <PageHeader title={product.entity.charAt(0).toUpperCase() + product.entity.slice(1)} description={product.positioning} />
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-semibold text-kite-brown">{item.name}</h2><StatusBadge status={item.status} /><StatusBadge status={item.risk} /></div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <p className="mt-3 text-sm text-muted-foreground">Owner <AddressDisplay value={item.owner} /> · Budget <span className="font-mono">{item.budgetKite} KITE</span></p>
              </div>
              <a href={`${product.entityRoute}/${item.id}`}><Button variant="secondary">Open</Button></a>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function NewItemPage() {
  return (
    <>
      <PageHeader title={`New ${product.entitySingular}`} description="Draft a preview-safe object with explicit risk, policy, and approval posture before execution." />
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-kite-brown">Name<input className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" defaultValue={product.modules[0].name} /></label>
          <label className="text-sm font-semibold text-kite-brown">Risk policy<Select defaultValue="medium"><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></Select></label>
        </div>
        <Textarea className="mt-4 min-h-28" defaultValue={product.modules[0].description} />
        <div className="mt-4 flex gap-3"><Button><Play size={16} /> Save draft</Button><Button variant="secondary">Run preview check</Button></div>
      </Card>
    </>
  );
}

function DetailPage({ items }: { items: ProductItem[] }) {
  const id = window.location.pathname.split("/").at(-1);
  const item = items.find((entry) => entry.id === id) ?? items[0];
  return (
    <>
      <PageHeader title={item.name} description={item.description} />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-2xl font-semibold text-kite-brown">Operating plan</h2>
          <div className="mt-5 grid gap-3">
            {product.modules.map((module) => (
              <div key={module.id} className="rounded-lg border border-border bg-secondary p-4">
                <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-semibold text-kite-brown">{module.name}</h3><StatusBadge status={module.preview} /></div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold text-kite-brown">Safety policy</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>Fund-moving actions require explicit approval.</li>
            <li>Payment claims are verified server-side before trust decisions.</li>
            <li>Preview decisions are advisory until audited.</li>
            <li>All addresses and transaction references stay visible in mono text.</li>
          </ul>
        </Card>
      </div>
    </>
  );
}

function ActivityPage({ activity }: { activity: ActivityEvent[] }) {
  return (
    <>
      <PageHeader title="Activity runs" description="Inspect every queued, approval-gated, succeeded, or failed preview runtime event." />
      <div className="grid gap-4">
        {activity.map((event) => (
          <Card key={event.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div><MonoValue value={event.id} /><p className="mt-2 text-sm text-muted-foreground">{event.message}</p></div>
              <div className="flex gap-2"><StatusBadge status={event.status} /><StatusBadge status={event.actor} /></div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function ApprovalsPage({ approvals }: { approvals: ApprovalRequest[] }) {
  return (
    <>
      <PageHeader title="Approvals" description="Review risky or fund-moving actions before they can proceed." />
      {approvals.length === 0 ? <EmptyState title="No approvals waiting" body="Risky actions will appear here before execution." /> : (
        <div className="grid gap-4">
          {approvals.map((approval) => <Card key={approval.id}><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><MonoValue value={approval.id} /><p className="mt-2 text-sm text-muted-foreground">{approval.reason}</p></div><div className="flex gap-2"><Button><CheckCircle2 size={16} /> Approve</Button><Button variant="danger"><AlertTriangle size={16} /> Deny</Button></div></div></Card>)}
        </div>
      )}
    </>
  );
}

function GenericRoutePage() {
  const path = window.location.pathname;
  const label = path.split("/").filter(Boolean)[0] ?? "home";
  return (
    <>
      <PageHeader title={label.charAt(0).toUpperCase() + label.slice(1)} description={`${product.name} route for ${label}. This screen is wired as a preview-safe shell with product-specific modules.`} />
      <Card>
        <div className="flex items-center gap-3"><KeyRound className="text-kite-olive" /><h2 className="text-2xl font-semibold text-kite-brown">Route workspace</h2></div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Use this area to inspect policy, connectors, settings, and module data for <span className="font-semibold">{label}</span>.</p>
      </Card>
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Configure Kite network, policy thresholds, webhook secrets, and approval defaults." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card><Wallet className="mb-3 text-kite-olive" /><h2 className="text-2xl font-semibold text-kite-brown">Network</h2><p className="mt-2 text-sm text-muted-foreground">Mainnet RPC <span className="font-mono">https://rpc.gokite.ai/</span> and chain ID <span className="font-mono">2366</span>.</p></Card>
        <Card><ShieldCheck className="mb-3 text-kite-olive" /><h2 className="text-2xl font-semibold text-kite-brown">Approval-first</h2><p className="mt-2 text-sm text-muted-foreground">Risky and fund-moving actions are blocked until explicitly approved.</p></Card>
      </div>
    </>
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
    if (path.startsWith(product.entityRoute + "/")) return <DetailPage items={items} />;
    if (path === "/runs" || path === "/executions") return <ActivityPage activity={activity} />;
    if (path === "/approvals") return <ApprovalsPage approvals={approvals} />;
    if (path === "/settings") return <SettingsPage />;
    if (product.routes.some((route) => path === route || (!route.includes(":") && path.startsWith(route + "/")))) return <GenericRoutePage />;
    return <ErrorState body="Route not found." />;
  }, [activity, approvals, items, path]);

  return <AppShell activePath={path}>{page}</AppShell>;
}
