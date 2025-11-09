import { fetchWithTimeout } from "../../../shared/fetchWithTimeout";

export function toNumber(n: unknown): number {
  const x = typeof n === "string" ? Number(n) : (n as number);
  if (!Number.isFinite(x)) throw new Error("Valor numérico inválido");
  return x;
}

export async function getBrlUsd(): Promise<number | null> {
  const res = await fetchWithTimeout("https://api.exchangerate.host/latest?base=BRL&symbols=USD");
  if (!res.ok) return null;

  const j = await res.json() as { rates?: { USD?: number } };
  const brl_usd = toNumber(j?.rates?.USD);
  return Number.isFinite(brl_usd) ? brl_usd : null;
}
