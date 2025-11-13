import { t } from "elysia";

export const ICreateInstallmentsPayload = t.Object({
  installmentNum: t.Number(),
  dueDate: t.String(),
  amount: t.Number(),
  paid: t.Boolean(),
  paymentType: t.String(),
  expenseId: t.String(),
});
