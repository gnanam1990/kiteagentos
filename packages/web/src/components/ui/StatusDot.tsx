export function StatusDot({ active = false }: { active?: boolean }) {
  return <span className={`inline-flex h-2.5 w-2.5 rounded-full ${active ? "pulse-live" : "bg-kite-sand"}`} />;
}
