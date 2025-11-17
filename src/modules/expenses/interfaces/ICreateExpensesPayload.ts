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
    t.Literal("recurring"),
  ]),
  paymentType: t.Union([
    t.Literal("credit_card"),
    t.Literal("pix"),
    t.Literal("boleto"),
    t.Literal("cash"),
    t.Literal("transfer"),
  ]),
});
;
