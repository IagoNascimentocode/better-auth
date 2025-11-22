// src/modules/investmentTransactions/handler/listInvestmentTransactions.ts
import {
  InvestmentTransactionsFilters,
  listInvestmentTransactions,
} from "@/database/repositories/investmentTransactions.queries";

export const listInvestmentTransactionsHandler = async (
  userId: string,
  filters: InvestmentTransactionsFilters = {},
) => {
  const transactions = await listInvestmentTransactions(userId, filters);
  return transactions;
};
