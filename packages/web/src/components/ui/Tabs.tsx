export function Tabs({ tabs, active }: { tabs: string[]; active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <span key={tab} className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === active ? "bg-secondary text-kite-brown" : "text-muted-foreground"}`}>
          {tab}
        </span>
      ))}
    </div>
  );
}
