import { getUserBalance } from "@/database/repositories/transactions.queries";
import { BalanceFilters } from "@/modules/transactions/types";
import { getFxRatesHandler } from "./getFxRates";

export const getUserBalanceConverted = async (userId: string) => {
  const brlStr = await getUserBalance(userId);
  const brl = Number(brlStr);

  try {
    const rates = await getFxRatesHandler();

    const usd = brl * rates.brl_usd;
    const btc = brl / rates.btc_brl; // conversão direta BRL→BTC

    return {
      brl: brl.toFixed(2),
      usd: usd.toFixed(2),
      btc: btc.toFixed(8),
      rates,
    };
  } catch (e) {
    // rede bloqueada: degrade graciosamente
    return {
      brl: brl.toFixed(2),
      usd: null,
      btc: null,
      rates: null,
      error: "Falha ao obter cotações (sem acesso externo HTTPS no servidor).",
    };
  }
};
