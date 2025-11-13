import { t } from "elysia";

export const IUpdateExpensesPayload = t.Object({
  title: t.Optional(t.String()),
  totalAmount: t.Optional(t.Number()),
  installments: t.Optional(t.Number()),
  date: t.Optional(t.String()),
  notes: t.Optional(t.String()),
  categoryId: t.Optional(t.String()),
});
