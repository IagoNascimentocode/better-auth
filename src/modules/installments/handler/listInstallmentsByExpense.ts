import { listInstallmentsByExpense } from "@/database/repositories/installments.queries";

export const listInstallmentsByExpenseHandler = async (expenseId: string) => {
  const result = await listInstallmentsByExpense(expenseId);
  return result;
};
