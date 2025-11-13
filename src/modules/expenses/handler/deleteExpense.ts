import { expensesQueries } from "@/database/repositories";

export const deleteExpenseHandler = async (
 id:string
): Promise<any> => {
  try {
    return await expensesQueries.deleteExpense(id);
  } catch (error) {
    console.log(error)
  }
};
