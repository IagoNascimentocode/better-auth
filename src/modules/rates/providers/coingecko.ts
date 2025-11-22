import { fetchWithTimeout } from "../../../shared/fetchWithTimeout";
import type { FxRates } from "../types";

export function toNumber(n: unknown): number {
  const x = typeof n === "string" ? Number(n) : (n as number);
  if (!Number.isFinite(x)) throw new Error("Valor numérico inválido");
  return x;
}

export async function getFromCoinGecko(): Promise<FxRates | null> {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,brl";
  const res = await fetchWithTimeout(url);

  if (!res.ok) return null;

  const j = await res.json() as { bitcoin?: { usd?: number; brl?: number } };
  const btc_usd = toNumber(j?.bitcoin?.usd);
  const btc_brl = toNumber(j?.bitcoin?.brl);
  const usd_brl = btc_brl / btc_usd;

  return {
    btc_usd,
    btc_brl,
    usd_brl,
    source: "coingecko",
    fetchedAt: new Date().toISOString(),
  };
}
