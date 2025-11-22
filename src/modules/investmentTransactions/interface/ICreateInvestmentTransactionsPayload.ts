import { t } from "elysia";

export const InvestmentOperationTypeEnum = t.Union([
  t.Literal("buy"),
  t.Literal("sell"),
]);

export const ICreateInvestmentTransactionsPayload = t.Object({
  userId: t.String({ format: "uuid" }),
  assetId: t.String({ format: "uuid" }),
  date: t.String({
    description: "ISO 8601 (e.g. 2025-10-19T12:34:56Z) ou YYYY-MM-DD",
  }),
  operationType: InvestmentOperationTypeEnum,
  amount: t.Number(), // quantidade de cotas/moedas
  price: t.Number(),  // preço unitário
  total: t.Number(),  // amount * price
  isCashMovement: t.Optional(t.Boolean()),
  notes: t.Optional(t.String()),
});

// opcional
export type CreateInvestmentTransactionsPayload =
  typeof ICreateInvestmentTransactionsPayload.static;
