export function ErrorState({ body }: { body: string }) {
  return <div className="rounded-lg border border-kite-rust bg-secondary p-4 text-sm text-kite-rust">{body}</div>;
}
