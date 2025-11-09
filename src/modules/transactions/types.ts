export interface BalanceFilters {
  from?: Date;
  to?: Date;
  categoryId?: string;
}

export interface BalanceConverted {
  brl: string;
  usd: string | null;
  btc: string | null;
  rates: unknown | null;
  error?: string;
}
