import { transactionsQueries } from "@/database/repositories";

export const deleteCategoryHandler = async (
  id: string
): Promise< boolean | undefined > => {
  try {
    await transactionsQueries.deleteTransaction(id);
    return true
  } catch (error) {
    console.log(error)
  }
};
