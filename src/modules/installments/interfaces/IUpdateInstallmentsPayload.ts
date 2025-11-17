import { t } from "elysia";

export const IUpdateInstallmentsPayload = t.Object({
  installmentNum: t.Optional(t.Number()),
  dueDate: t.Optional(t.String()),
  amount: t.Optional(t.Number()),
  paid: t.Optional(t.Boolean()),
  paymentType: t.Optional(
    t.Union([
      t.Literal("credit_card"),
      t.Literal("pix"),
      t.Literal("boleto"),
      t.Literal("cash"),
      t.Literal("transfer"),
    ])
  ),
  expenseId: t.Optional(t.String()),
});
