import { expensesQueries } from "@/database/repositories";
import { IUpdateExpensesPayload } from "../interfaces/IUpdateExpensesPayload";

export const listAllExpensesHandler = async (
  userId:string,
): Promise<void> => {
  try {
    return await expensesQueries.listAllExpenses(userId)
  } catch (error) {
    console.log(error)
  }
};
