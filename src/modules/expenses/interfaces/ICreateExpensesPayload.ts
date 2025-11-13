// src/modules/expenses/interfaces/ICreateExpensesPayload.ts
import { t } from "elysia";

export const ICreateExpensesPayload = t.Object({
  title: t.String(),
  totalAmount: t.Number(),
  installments: t.Number(),
  date: t.String(),
  notes: t.Optional(t.String()),
  categoryId: t.String(),
  userId: t.String(),
  operationType: t.Union([
    t.Literal("purchase"),
    t.Literal("recurring_expense"),
  ]),
});
