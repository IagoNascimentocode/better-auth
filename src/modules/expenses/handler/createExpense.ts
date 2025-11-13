import { ICreateExpensesPayload } from "../interfaces/ICreateExpensesPayload";
import { expensesQueries } from "@/database/repositories";

export const createExpenseHandler = async (
  payload: typeof ICreateExpensesPayload.static,
): Promise<void> => {
  try {
    return await expensesQueries.createExpense(payload);
  } catch (error) {
    console.log(error)
  }
};
