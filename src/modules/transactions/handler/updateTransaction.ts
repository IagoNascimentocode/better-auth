 import { transactionsQueries } from "@/database/repositories";
 import { IUpdateTransactionPayload } from "../interface/IUpdateTransactionPayload";

 export const updateTransactionHandler = async (
   payload: typeof IUpdateTransactionPayload.static,
   transactionId: string
 ) => {
   try {
     const updated = await transactionsQueries.updatetransaction(payload, transactionId);
     return updated; // retorna a linha atualizada
   } catch (error) {
     console.error("[updateTransactionHandler] error:", error);
     throw error;
   }
 };
