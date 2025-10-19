import { db } from "../client";
import { desc, eq } from "drizzle-orm";
import { transactions } from "../schema/transactions";
import { transactionInsertSchema } from "../interfaces/operarionSchemas";
import { ICreateTransactionPayload } from "@/modules/transactions/interface/ICreateTransactionPayload";
import { IUpdateTransactionPayload } from "@/modules/transactions/interface/IUpdateTransactionPayload";

export const createTransactions = async (
  payload: typeof ICreateTransactionPayload.static
): Promise<typeof transactionInsertSchema.static | any> => {
  const transactionsInstance = await db
    .insert(transactions)
    .values({
      ...payload,
      amount: String(payload.amount),
      date: new Date(payload.date),
    })
    .returning();

  return transactionsInstance;
};

export const updatetransaction = async (
  payload: typeof IUpdateTransactionPayload.static,
  id: string
): Promise<typeof transactionInsertSchema.static | any> => {
  if (!id) throw new Error("ID is required");

  // Monta objeto de update apenas com campos definidos
  const updateData: Partial<typeof transactions.$inferInsert> = {};

  if (payload.title !== undefined) updateData.title = payload.title;

  if (payload.amount !== undefined) {
    // aceita number ou string e persiste como string p/ decimal do Drizzle
    updateData.amount = String(payload.amount);
  }

  if (payload.type !== undefined) updateData.type = payload.type;

  if (payload.notes !== undefined) updateData.notes = payload.notes;

  if (payload.categoryId !== undefined) updateData.categoryId = payload.categoryId;

  if (payload.date !== undefined) {
    // Aceita "YYYY-MM-DD" ou ISO completo
    const raw = payload.date as unknown as string;
    let parsed: Date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      // só data → meia-noite local
      parsed = new Date(`${raw}T00:00:00`);
    } else {
      parsed = new Date(raw);
    }

    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Invalid date format. Use ISO 8601 (e.g., 2025-10-19T12:34:56Z) ou YYYY-MM-DD.");
    }
    updateData.date = parsed;
  }

  if (Object.keys(updateData).length === 0) {
    // nada pra atualizar
    return [];
  }

  const transactionsInstance = await db
    .update(transactions)
    .set(updateData)
    .where(eq(transactions.id, id))
    .returning();

  return transactionsInstance;
};

export const listAllTransactions = async (
  userId: string
): Promise<typeof transactionInsertSchema.static | any> => {
  const transactionsInstance = await db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    orderBy: desc(transactions.createdAt),
  });

  return transactionsInstance;
};

export const deleteTransaction = async (id: string) => {
  const transactionsInstance = await db
    .delete(transactions)
    .where(eq(transactions.id, id))
    .returning();

  return transactionsInstance;
};
