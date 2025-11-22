import { t } from "elysia";
import { InvestmentOperationTypeEnum } from "./ICreateInvestmentTransactionsPayload";

export const IUpdateInvestmentTransactionsPayload = t.Object({
  assetId: t.Optional(t.String({ format: "uuid" })),
  categoryId: t.Optional(t.String({ format: "uuid" })),

  date: t.Optional(
    t.String({
      description: "ISO 8601 (e.g. 2025-10-19T12:34:56Z) ou YYYY-MM-DD",
    }),
  ),

  operationType: t.Optional(InvestmentOperationTypeEnum),

  amount: t.Optional(t.Number()),
  price: t.Optional(t.Number()),
  total: t.Optional(t.Number()),

  isCashMovement: t.Optional(t.Boolean()),
  notes: t.Optional(t.String()),
});

// opcional
export type UpdateInvestmentTransactionsPayload =
  typeof IUpdateInvestmentTransactionsPayload.static;
