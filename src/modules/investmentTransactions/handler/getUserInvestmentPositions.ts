import { getUserInvestmentPositions } from "@/database/repositories/investmentTransactions.queries";
import type { InvestmentTransactionsFilters } from "@/database/repositories/investmentTransactions.queries";

export const getUserInvestmentPositionsHandler = async (
  userId: string,
  filters: InvestmentTransactionsFilters = {},
) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const positions = await getUserInvestmentPositions(userId, filters);

  console.log(positions)
  return positions;
};
