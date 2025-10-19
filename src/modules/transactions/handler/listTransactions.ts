import { transactionsQueries } from "@/database/repositories";

export const listCategoryHandler = async (
  userId: string
): Promise<void> => {
  try {
    return await transactionsQueries.listAllTransactions(userId);
  } catch (error) {
    console.log(error)
  }
};
