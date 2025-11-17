import { db } from "../client";
import { expenses } from "../schema/expenses";
import { installments } from "../schema/installments";
import { and, asc, eq, gte, lte, sql } from "drizzle-orm";
import { installmentInsertSchema } from "../interfaces/operarionSchemas";
import { ICreateInstallmentsPayload } from "@/modules/installments/interfaces/ICreateInstallmentsPayload";
import { IUpdateInstallmentsPayload } from "@/modules/installments/interfaces/IUpdateInstallmentsPayload";

import type { SummaryFilters } from "./expenses.queries";

export const getInstallmentsSummary = async (
  userId: string,
  filters: SummaryFilters,
) => {
  const {
    from,
    to,
    categoryId,
    operationType,
    paymentType,
  } = filters;

  const rows = await db
    .select({
      totalPaid: sql<string>`COALESCE(SUM(
        CASE
          WHEN ${installments.paid} = true
          THEN ${installments.amount}::numeric
          ELSE 0
        END
      ), 0)::text`,
      totalPending: sql<string>`COALESCE(SUM(
        CASE
          WHEN ${installments.paid} = false
          THEN ${installments.amount}::numeric
          ELSE 0
        END
      ), 0)::text`,
      countPaid: sql<number>`COUNT(*) FILTER (WHERE ${installments.paid} = true)`,
      countPending: sql<number>`COUNT(*) FILTER (WHERE ${installments.paid} = false)`,
    })
    .from(installments)
    .innerJoin(
      expenses,
      eq(installments.expenseId, expenses.id),
    )
    .where(
      and(
        eq(expenses.userId, userId),
        from ? gte(installments.dueDate, from) : undefined,
        to ? lte(installments.dueDate, to) : undefined,
        categoryId ? eq(expenses.categoryId, categoryId) : undefined,
        operationType ? eq(expenses.operationType, operationType) : undefined,
        paymentType ? eq(expenses.paymentType, paymentType) : undefined,
      ),
    );

  const [row] = rows;

  return [
    {
      totalPaid: Number(row?.totalPaid ?? "0"),
      totalPending: Number(row?.totalPending ?? "0"),
      countPaid: Number(row?.countPaid ?? 0),
      countPending: Number(row?.countPending ?? 0),
    },
  ];
};

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
