import { t } from "elysia";

export const IUpdateInstallmentsPayload = t.Object({
  installmentNum: t.Optional(t.Number()),
  dueDate: t.Optional(t.String()),
  amount: t.Optional(t.Number()),
  paid: t.Optional(t.Boolean()),
  paymentType: t.Optional(t.String()),
  expenseId: t.Optional(t.String()),
});
