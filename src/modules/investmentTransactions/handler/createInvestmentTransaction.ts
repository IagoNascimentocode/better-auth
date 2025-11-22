import { investmentsTransactionsQueries } from "@/database/repositories";
import { ICreateInvestmentTransactionsPayload } from "./interface/ICreateInvestmentTransactionsPayload";

export const createInvestmentTransactionHandler = async (
  payload: typeof ICreateInvestmentTransactionsPayload.static,
): Promise<void> => {
  try {
    return await investmentsTransactionsQueries.createInvestmentTransaction(payload);
  } catch (error) {
    console.log(error)
  }
}
