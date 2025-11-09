import { fetchWithTimeout } from "../../../shared/fetchWithTimeout";

export function toNumber(n: unknown): number {
  const x = typeof n === "string" ? Number(n) : (n as number);
  if (!Number.isFinite(x)) throw new Error("Valor numérico inválido");
  return x;
}

export async function getCoinbaseUsdPerBtc(): Promise<number | null> {
  const res = await fetchWithTimeout("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
  if (!res.ok) return null;

  const j = await res.json() as { data?: { rates?: Record<string, string> } };
  const rates = j?.data?.rates ?? {};
  // Coinbase expõe quantos BTC por 1 unidade da moeda. Inverter para obter USD por BTC.
  const usdPerBtc = rates["USD"] ? 1 / toNumber(rates["USD"]) : NaN;
  return Number.isFinite(usdPerBtc) ? usdPerBtc : null;
}
