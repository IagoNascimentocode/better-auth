import { expensesQueries, installmentsQueries } from "@/database/repositories";
import type { SummaryFilters } from "@/database/repositories/expenses.queries";

export async function getExpenseAndInstallmentSummaryHandler(
  userId: string,
  filters: SummaryFilters,
) {
  const { total } = await expensesQueries.getExpensesTotal(userId, filters);
  const [installmentsRow] = await installmentsQueries.getInstallmentsSummary(userId, filters);

  return {
    period: {
      from: filters.from ? filters.from.toISOString() : null,
      to: filters.to ? filters.to.toISOString() : null,
    },
    expenses: {
      total,
    },
    installments: {
      totalPaid: Number(installmentsRow?.totalPaid ?? "0"),
      totalPending: Number(installmentsRow?.totalPending ?? "0"),
      countPaid: Number(installmentsRow?.countPaid ?? 0),
      countPending: Number(installmentsRow?.countPending ?? 0),
    },
  };
}
