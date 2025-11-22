import { t } from "elysia";

export const IListInvestmentTransactionsPayload= t.Object({
  userId: t.String({ format: "uuid" }),
  filter: InvestmentTransactionsFilters
  });

// opcional
export type ListInvestmentTransactionsPayload =
  typeof IListInvestmentTransactionsPayload.static;
