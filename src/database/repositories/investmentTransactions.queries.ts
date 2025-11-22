import { db } from "../client";
import { assets } from "../schema/assets";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { investmentTransactions } from "../schema/investmentTransactions";
import { investmentTransactionInsertSchema  } from "../interfaces/operarionSchemas";
import { ICreateInvestmentTransactionsPayload } from "@/modules/investmentTransactions/interface/ICreateInvestmentTransactionsPayload";
import { IUpdateInvestmentTransactionsPayload } from "@/modules/investmentTransactions/interface/IUpdateInvestmentTransactionsPayload";

export type InvestmentOperationType = "buy" | "sell";

export type InvestmentTransactionsFilters = {
  from?: Date;
  to?: Date;
  assetId?: string;
  categoryId?: string;
  operationType?: InvestmentOperationType;
  isCashMovement?: boolean;
};

export type InvestmentPosition = {
  assetId: string;
  name: string;
  type: "fii" | "stock" | "crypto" | "fixed_income" | "other";
  quantity: number; // quantidade líquida (buy - sell)
  invested: number; // valor líquido investido (buy - sell)
  };

export const listInvestmentTransactions = async (
  userId: string,
  filters: InvestmentTransactionsFilters = {},
): Promise<typeof investmentTransactionInsertSchema.static[] | any> => {
  const where = and(
    eq(investmentTransactions.userId, userId),
    filters.from ? gte(investmentTransactions.date, filters.from) : undefined,
    filters.to ? lte(investmentTransactions.date, filters.to) : undefined,
    filters.assetId
      ? eq(investmentTransactions.assetId, filters.assetId)
      : undefined,
    filters.operationType
      ? eq(investmentTransactions.operationType, filters.operationType)
      : undefined,
    filters.isCashMovement !== undefined
      ? eq(investmentTransactions.isCashMovement, filters.isCashMovement)
      : undefined,
  );

  const instances = await db.query.investmentTransactions.findMany({
    where,
    orderBy: desc(investmentTransactions.date),
  });

  return instances;
};

export const getInvestmentTransactionById = async (
  id: string,
  userId: string,
): Promise<typeof investmentTransactionInsertSchema.static | null | any> => {
  const result = await db.query.investmentTransactions.findFirst({
    where: and(
      eq(investmentTransactions.id, id),
      eq(investmentTransactions.userId, userId),
    ),
  });

  return result ?? null;
};

export const createInvestmentTransaction = async (
  payload: typeof ICreateInvestmentTransactionsPayload.static,
): Promise<typeof investmentTransactionInsertSchema.static | any> => {
  const instance = await db
    .insert(investmentTransactions)
    .values({
      ...payload,
      date: new Date(payload.date as unknown as string),
      amount: String(payload.amount),
      price: String(payload.price),
      total: String(payload.total),
    })
    .returning();

  return instance;
};

export const updateInvestmentTransaction = async (
  id: string,
  payload: typeof IUpdateInvestmentTransactionsPayload.static,
): Promise<typeof investmentTransactionInsertSchema.static | any> => {
  if (!id) throw new Error("ID is required");

  const updateData: Partial<typeof investmentTransactions.$inferInsert> = {};

    updateData.assetId = payload.assetId;
  if (payload.assetId !== undefined) {
  }

  if (payload.operationType !== undefined) {
    updateData.operationType = payload.operationType as InvestmentOperationType;
  }

  if (payload.isCashMovement !== undefined) {
    updateData.isCashMovement = payload.isCashMovement;
  }

  if (payload.amount !== undefined) {
    updateData.amount = String(payload.amount);
  }

  if (payload.price !== undefined) {
    updateData.price = String(payload.price);
  }

  if (payload.total !== undefined) {
    updateData.total = String(payload.total);
  }

  if (payload.notes !== undefined) {
    updateData.notes = payload.notes;
  }

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
        "Invalid date format. Use ISO 8601 (e.g., 2025-10-19T12:34:56Z) ou YYYY-MM-DD.",
      );
    }

    updateData.date = parsed;
  }

  if (Object.keys(updateData).length === 0) {
    return [];
  }

  const instance = await db
    .update(investmentTransactions)
    .set(updateData)
    .where(eq(investmentTransactions.id, id))
    .returning();

  return instance;
};

export const deleteInvestmentTransaction = async (id: string) => {
  const instance = await db
    .delete(investmentTransactions)
    .where(eq(investmentTransactions.id, id))
    .returning();

  return instance;
};

// === Posição atual por ativo (buy - sell) ===
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../client";
import { investmentTransactions } from "../schema/investmentTransactions";
import { assets } from "../schema/assets";

export type InvestmentOperationType = "buy" | "sell";

export type InvestmentTransactionsFilters = {
  from?: Date;
  to?: Date;
  assetId?: string;
  categoryId?: string;
  operationType?: InvestmentOperationType;
  isCashMovement?: boolean;
};

export type InvestmentPosition = {
  assetId: string;
  name: string;
  type: "fii" | "stock" | "crypto" | "fixed_income" | "other";
  quantity: number;     // buy - sell
  invested: number;     // total buy - total sell
  averagePrice: number; // invested / quantity
};

export const getUserInvestmentPositions = async (
  userId: string,
  filters: InvestmentTransactionsFilters = {},
): Promise<InvestmentPosition[]> => {
  const where = and(
    eq(investmentTransactions.userId, userId),
    filters.from ? gte(investmentTransactions.date, filters.from) : undefined,
    filters.to ? lte(investmentTransactions.date, filters.to) : undefined,
    filters.assetId
      ? eq(investmentTransactions.assetId, filters.assetId)
      : undefined,
    filters.categoryId
      ? eq(investmentTransactions.categoryId, filters.categoryId)
      : undefined,
    filters.operationType
      ? eq(investmentTransactions.operationType, filters.operationType)
      : undefined,
    filters.isCashMovement !== undefined
      ? eq(investmentTransactions.isCashMovement, filters.isCashMovement)
      : undefined,
  );

  // 👇 Join manual em vez de `with: { asset: true }`
  const rows = await db
    .select({
      assetId: investmentTransactions.assetId,
      name: assets.name,
      type: assets.type,
      amount: investmentTransactions.amount,
      total: investmentTransactions.total,
      operationType: investmentTransactions.operationType,
    })
    .from(investmentTransactions)
    .innerJoin(assets, eq(investmentTransactions.assetId, assets.id))
    .where(where);

  // Agrupa por assetId
  const grouped = new Map<
    string,
    { assetId: string; name: string; type: InvestmentPosition["type"]; quantity: number; invested: number }
  >();

  for (const row of rows) {
    const amountNum = Number(row.amount);
    const totalNum = Number(row.total);

    const isBuy = row.operationType === "buy";
    const isSell = row.operationType === "sell";

    const qtyChange = isBuy ? amountNum : -amountNum;
    const investedChange = isBuy ? totalNum : -totalNum;

    if (!grouped.has(row.assetId)) {
      grouped.set(row.assetId, {
        assetId: row.assetId,
        name: row.name,
        type: row.type as InvestmentPosition["type"],
        quantity: 0,
        invested: 0,
      });
    }

    const g = grouped.get(row.assetId)!;
    g.quantity += qtyChange;
    g.invested += investedChange;
  }

  // Monta resultado final com preço médio
  const result: InvestmentPosition[] = [...grouped.values()].map((item) => {
    const averagePrice =
      item.quantity !== 0 ? item.invested / item.quantity : 0;

    return {
      ...item,
      averagePrice: Number(averagePrice.toFixed(10)),
    };
  });

  return result;
};


// export const getUserInvestmentPositions = async (
//   userId: string,
//   filters: InvestmentTransactionsFilters = {},
// ): Promise<InvestmentPosition[]> => {
//   const where = and(
//     eq(investmentTransactions.userId, userId),
//     filters.from ? gte(investmentTransactions.date, filters.from) : undefined,
//     filters.to ? lte(investmentTransactions.date, filters.to) : undefined,
//     filters.assetId
//       ? eq(investmentTransactions.assetId, filters.assetId)
//       : undefined,
//     filters.operationType
//       ? eq(investmentTransactions.operationType, filters.operationType)
//       : undefined,
//     filters.isCashMovement !== undefined
//       ? eq(investmentTransactions.isCashMovement, filters.isCashMovement)
//       : undefined,
//   );

//   const rows = await db
//     .select({
//       assetId: assets.id,
//       name: assets.name,
//       type: assets.type,
//       quantity: sql<string>`COALESCE(SUM(
//         CASE
//           WHEN ${investmentTransactions.operationType} = 'buy'
//           THEN ${investmentTransactions.amount}::numeric
//           ELSE -${investmentTransactions.amount}::numeric
//         END
//       ), 0)::text`,
//       invested: sql<string>`COALESCE(SUM(
//         CASE
//           WHEN ${investmentTransactions.operationType} = 'buy'
//           THEN ${investmentTransactions.total}::numeric
//           ELSE -${investmentTransactions.total}::numeric
//         END
//       ), 0)::text`,
//     })
//     .from(investmentTransactions)
//     .innerJoin(assets, eq(investmentTransactions.assetId, assets.id))
//     .where(where)
//     .groupBy(assets.id, assets.name, assets.type)
//     .orderBy(asc(assets.name));

//   return rows.map((row) => ({
//     assetId: row.assetId,
//     name: row.name,
//     type: row.type as InvestmentPosition["type"],
//     quantity: Number(row.quantity ?? "0"),
//     invested: Number(row.invested ?? "0"),
//   }));
// };
