import { MonoValue } from "./MonoValue";

export function AddressDisplay({ value }: { value: string }) {
  return <MonoValue value={`${value.slice(0, 8)}...${value.slice(-6)}`} />;
}
