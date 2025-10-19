import { transactionsQueries } from "@/database/repositories";
import { ICreateTransactionPayload } from "../interface/ICreateTransactionPayload";

export const createTransactionHandler = async (
  payload: typeof ICreateTransactionPayload.static,
): Promise<void> => {

  try {
    return await transactionsQueries.createTransactions(payload);
  } catch (error) {
    console.log(error)
  }
};
