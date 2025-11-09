import { getCachedRates, setCachedRates } from "../cache";
import { getCoinbaseUsdPerBtc } from "../providers/coinbase";
import { getFromCoinGecko } from "../providers/coingecko";
import { getBrlUsd } from "../providers/exchangerateHost";
import { FxRates } from "../types";

export class ExternalRateError extends Error {
  constructor(message = "Falha ao obter cotações externas") { super(message); }
}


export async function getFxRatesHandler(): Promise<FxRates> {
  const cached = getCachedRates();
  if (cached) return cached;

  // 1) CoinGecko
  for (let i = 0; i < 2; i++) {
    try {
      const cg = await getFromCoinGecko();
      if (cg) { setCachedRates(cg); return cg; }
    } catch {/* tenta de novo */}
    await new Promise(r => setTimeout(r, 200));
  }

  // 2) Coinbase + Exchangerate
  try {
    const usdPerBtc = await getCoinbaseUsdPerBtc(); // USD/BTC
    if (usdPerBtc) {
      const brl_usd = await getBrlUsd();
      if (brl_usd) {
        const data: FxRates = {
          btc_usd: usdPerBtc,
          btc_brl: usdPerBtc / brl_usd,
          brl_usd,
          source: "coinbase(+fx)",
          fetchedAt: new Date().toISOString(),
        };
        setCachedRates(data);
        return data;
      }
    }
  } catch {/* segue */}

  throw new ExternalRateError("Não foi possível obter cotações (rede bloqueada?).");
}
