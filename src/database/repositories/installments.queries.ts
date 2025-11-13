import { db } from "../client";
import { and, asc, eq, sql } from "drizzle-orm";
import { installments } from "../schema/installments";
import { installmentInsertSchema } from "../interfaces/operarionSchemas";
import { ICreateInstallmentsPayload } from "@/modules/installments/interfaces/ICreateInstallmentsPayload";
import { IUpdateInstallmentsPayload } from "@/modules/installments/interfaces/IUpdateInstallmentsPayload";

export const createInstallment = async (
  payload: typeof ICreateInstallmentsPayload.static
): Promise<typeof installmentInsertSchema.static | any> => {
  const installmentInstance = await db
    .insert(installments)
    .values({
      ...payload,
      amount: String(payload.amount),
      dueDate: new Date(payload.dueDate),
    })
    .returning();

  return installmentInstance;
};

export const updateInstallment = async (
  id: string,
  payload: typeof IUpdateInstallmentsPayload.static
): Promise<typeof installmentInsertSchema.static | any> => {
  if (!id) throw new Error("ID is required");

  const updateData: Partial<typeof installments.$inferInsert> = {};

  if (payload.installmentNum !== undefined) {
    updateData.installmentNum = payload.installmentNum;
  }

  if (payload.amount !== undefined) {
    updateData.amount = String(payload.amount);
  }

  if (payload.paid !== undefined) {
    updateData.paid = payload.paid;
  }

  if (payload.paymentType !== undefined) {
    updateData.paymentType = payload.paymentType;
  }

  if (payload.expenseId !== undefined) {
    updateData.expenseId = payload.expenseId;
  }

  if (payload.dueDate !== undefined) {
    const raw = payload.dueDate as unknown as string;
    let parsed: Date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      parsed = new Date(`${raw}T00:00:00`);
    } else {
      parsed = new Date(raw);
    }

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(
        "Invalid date format. Use ISO 8601 (e.g., 2025-10-19T12:34:56Z) ou YYYY-MM-DD."
      );
    }

    updateData.dueDate = parsed;
  }

  if (Object.keys(updateData).length === 0) {
    return [];
  }

  const installmentInstance = await db
    .update(installments)
    .set(updateData)
    .where(eq(installments.id, id))
    .returning();

  return installmentInstance;
};

export const listInstallmentsByExpense = async (
  expenseId: string
): Promise<typeof installmentInsertSchema.static | any> => {
  const instances = await db.query.installments.findMany({
    where: eq(installments.expenseId, expenseId),
    orderBy: asc(installments.dueDate),
  });

  return instances;
};

export const deleteInstallment = async (id: string) => {
  const instances = await db
    .delete(installments)
    .where(eq(installments.id, id))
    .returning();

  return instances;
};
