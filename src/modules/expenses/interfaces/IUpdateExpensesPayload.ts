import { t } from "elysia";

export const IUpdateExpensesPayload = t.Object({
  title: t.Optional(t.String()),
  totalAmount: t.Optional(t.Number()),
  installments: t.Optional(t.Number()),
  date: t.Optional(t.String()),
  notes: t.Optional(t.String()),
  categoryId: t.Optional(t.String()),
  operationType: t.Optional(
    t.Union([
      t.Literal("purchase"),
      t.Literal("recurring"),
    ])
  ),
  paymentType: t.Optional(
    t.Union([
      t.Literal("credit_card"),
      t.Literal("pix"),
      t.Literal("boleto"),
      t.Literal("cash"),
      t.Literal("transfer"),
    ])
  ),
});
