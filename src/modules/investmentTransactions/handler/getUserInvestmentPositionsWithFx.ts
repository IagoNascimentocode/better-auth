import {
  getUserInvestmentPositions,
  type InvestmentTransactionsFilters,
  type InvestmentPosition,
} from "@/database/repositories/investmentTransactions.queries";
import { getFxRatesHandler } from "@/modules/rates/handler/getFxRates";

export type InvestmentPositionWithFx = InvestmentPosition & {
  averagePriceBRL: string | null; // formatado com casas decimais
  averagePriceUSD: string | null;
};

export type UserInvestmentPositionsResponse = {
  positions: InvestmentPositionWithFx[];
  rates: {
    btc_usd: number;
    btc_brl: number;
    usd_brl: number;
    source: string;
    fetchedAt: string;
  } | null;
  error?: string;
};

export const getUserInvestmentPositionsWithFxHandler = async (
  userId: string,
  filters: InvestmentTransactionsFilters = {},
): Promise<UserInvestmentPositionsResponse> => {
  const basePositions = await getUserInvestmentPositions(userId, filters);

  // se não tem posição, já retorna vazio sem tentar FX
  if (!basePositions.length) {
    return {
      positions: [],
      rates: null,
    };
  }

  try {
    const rates = await getFxRatesHandler(); // já usa seu cache/busca externa
    const usdBrl = rates.usd_brl; // USD por 1 BRL

    const positions: InvestmentPositionWithFx[] = basePositions.map((p) => {
      const avgBrl =
        p.quantity !== 0 ? p.invested / p.quantity : 0; // BRL por unidade do ativo

      const avgUsd = avgBrl / usdBrl;

      return {
        ...p,
        averagePriceBRL: avgBrl.toFixed(2), // ex.: 2 casas
        averagePriceUSD: avgUsd.toFixed(2),
      };
    });

    return {
      positions,
      rates,
    };
  } catch (e) {
    // falhou acesso externo → degrade igual ao getUserBalanceConverted
    const positions: InvestmentPositionWithFx[] = basePositions.map((p) => ({
      ...p,
      averagePriceBRL: null,
      averagePriceUSD: null,
    }));

    return {
      positions,
      rates: null,
      error: "Falha ao obter cotações (sem acesso externo HTTPS no servidor).",
    };
  }
};
