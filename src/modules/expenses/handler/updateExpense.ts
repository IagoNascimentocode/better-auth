import { expensesQueries } from "@/database/repositories";
import { IUpdateExpensesPayload } from "../interfaces/IUpdateExpensesPayload";

export const updateExpenseHandler = async (
  id:string,
  payload: typeof IUpdateExpensesPayload.static,
): Promise<void> => {
  try {
    return await expensesQueries.updateExpense( id, payload )
  } catch (error) {
    console.log(error)
  }
};
