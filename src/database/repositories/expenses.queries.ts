import { db } from "../client";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { expenses } from "../schema/expenses";
import { ICreateExpensesPayload } from "@/modules/expenses/interfaces/ICreateExpensesPayload";
import { expenseInsertSchema } from "../interfaces/operarionSchemas";
import { IUpdateExpensesPayload } from "@/modules/expenses/interfaces/IUpdateExpensesPayload";

type ExpensesFilters = {
  from?: Date;
  to?: Date;
  categoryId?: string;
};

export type OperationType = "purchase" | "recurring";
export type PaymentType =
  | "credit_card"
  | "pix"
  | "boleto"
  | "cash"
  | "transfer";

export type SummaryFilters = {
  from?: Date;
  to?: Date;
  categoryId?: string;
  operationType?: OperationType;
  paymentType?: PaymentType;
};

export const getExpensesTotal = async (
  userId: string,
  filters: SummaryFilters,
): Promise<{ total: number }> => {
  const {
    from,
    to,
    categoryId,
    operationType,
    paymentType,
  } = filters;

  const [row] = await db
    .select({
      totalAmount: sql<string>`COALESCE(SUM(
        CASE
          WHEN ${expenses.operationType} = 'recurring'
           AND ${expenses.installments} > 1
          THEN ${expenses.totalAmount}::numeric * ${expenses.installments}
          ELSE ${expenses.totalAmount}::numeric
        END
      ), 0)::text`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        from ? gte(expenses.date, from) : undefined,
        to ? lte(expenses.date, to) : undefined,
        categoryId ? eq(expenses.categoryId, categoryId) : undefined,
        operationType ? eq(expenses.operationType, operationType) : undefined,
        paymentType ? eq(expenses.paymentType, paymentType) : undefined,
      )
    );

  const total = Number(row?.totalAmount ?? "0");

  return { total };
};


export const getUserExpensesTotal = async (
  userId: string,
  filters: ExpensesFilters = {}
) => {
  const where = and(
    eq(expenses.userId, userId),
    filters.from ? gte(expenses.date, filters.from) : undefined,
    filters.to ? lte(expenses.date, filters.to) : undefined,
    filters.categoryId ? eq(expenses.categoryId, filters.categoryId) : undefined
  );

  const [row] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${expenses.totalAmount}::numeric), 0)::text`,
    })
    .from(expenses)
    .where(where);

  return row?.total ?? "0";
};

export const createExpense = async (
  payload: typeof ICreateExpensesPayload.static
): Promise<typeof expenseInsertSchema.static | any> => {
  const expensesInstance = await db
    .insert(expenses)
    .values({
      ...payload,
      totalAmount: String(payload.totalAmount),
      date: new Date(payload.date),
    })
    .returning();

  return expensesInstance;
};

export const updateExpense = async (
  id: string,
  payload: typeof IUpdateExpensesPayload.static
): Promise<typeof expenseInsertSchema.static | any> => {
  if (!id) throw new Error("ID is required");

  const updateData: Partial<typeof expenses.$inferInsert> = {};

  if (payload.title !== undefined) updateData.title = payload.title;

  if (payload.totalAmount !== undefined) {
    updateData.totalAmount = String(payload.totalAmount);
  }

  if (payload.installments !== undefined) {
    updateData.installments = payload.installments;
  }

  if (payload.notes !== undefined) updateData.notes = payload.notes;

  if (payload.categoryId !== undefined) updateData.categoryId = payload.categoryId;

  if (payload.date !== undefined) {
    const raw = payload.date as unknown as string;
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

    updateData.date = parsed;
  }

  if (Object.keys(updateData).length === 0) {
    return [];
  }

  const expensesInstance = await db
    .update(expenses)
    .set(updateData)
    .where(eq(expenses.id, id))
    .returning();

  return expensesInstance;
};

export const listAllExpenses = async (
  userId: string
): Promise<typeof expenseInsertSchema.static | any> => {
  const expensesInstance = await db.query.expenses.findMany({
    where: eq(expenses.userId, userId),
    orderBy: desc(expenses.createdAt),
  });

  return expensesInstance;
};

export const deleteExpense = async (id: string) => {
  const expensesInstance = await db
    .delete(expenses)
    .where(eq(expenses.id, id))
    .returning();

  return expensesInstance;
};
