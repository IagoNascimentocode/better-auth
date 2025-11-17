import { t } from "elysia";

export const ICreateInstallmentsPayload = t.Object({
  installmentNum: t.Number(),
  dueDate: t.String(),
  amount: t.Number(),
  paid: t.Boolean(),
  paymentType: t.Union([
    t.Literal("credit_card"),
    t.Literal("pix"),
    t.Literal("boleto"),
    t.Literal("cash"),
    t.Literal("transfer"),
  ]),
  expenseId: t.String(),
});
