export interface FxRates {
  btc_usd: number;   // USD por 1 BTC
  btc_brl: number;   // BRL por 1 BTC
  brl_usd: number;   // USD por 1 BRL
  source: string;
  fetchedAt: string; // ISO
}
