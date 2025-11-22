import { investmentsTransactionsQueries } from "@/database/repositories";
import { investmentTransactionSelectSchema } from "@/database/interfaces/operarionSchemas";


export const deleteInvestmentTransactionHandler = async (
  transactionId: string
): Promise<typeof investmentTransactionSelectSchema.static | any> => {
   try {
    return await investmentsTransactionsQueries.deleteInvestmentTransaction(transactionId);
  } catch (error) {
    console.log(error)
  }
};
