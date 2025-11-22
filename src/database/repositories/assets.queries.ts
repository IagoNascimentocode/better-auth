import { assets } from "../schema/assets";
import { and, asc, eq, ilike } from "drizzle-orm";
import { assetInsertSchema } from "../interfaces/operarionSchemas";
import { db } from "../client";
import { ICreateAssetsPayload } from "@/modules/assets/interface/ICreateAssetsPayload";
import { IUpdateAssetsPayload } from "@/modules/assets/interface/IUpdateAssetsPayload";


export type AssetType =
  | "fii"
  | "stock"
  | "crypto"
  | "fixed_income"
  | "other";

export type AssetsFilters = {
  type?: AssetType;
  search?: string; // busca por nome
};

export const listAllAssets = async (
  filters: AssetsFilters = {},
): Promise<typeof assets.$inferSelect[]> => {
  const where = and(
    filters.type ? eq(assets.type, filters.type) : undefined,
    filters.search
      ? ilike(assets.name, `%${filters.search}%`)
      : undefined,
  );

  const instances = await db.query.assets.findMany({
    where,
    orderBy: asc(assets.name),
  });

  return instances;
};

export const getAssetById = async (
  id: string,
): Promise<typeof assetInsertSchema.static | null | any> => {
  const result = await db.query.assets.findFirst({
    where: and(eq(assets.id, id))
  });

  return result ?? null;
};

export const createAsset = async (
  payload: typeof ICreateAssetsPayload.static,
): Promise<typeof assetInsertSchema.static | any> => {
  const assetInstance = await db
    .insert(assets)
    .values({
      ...payload,
      // sem conversão de date/numeric aqui porque o schema não tem
    })
    .returning();

  return assetInstance;
};

export const updateAsset = async (
  id: string,
  payload: typeof IUpdateAssetsPayload.static,
): Promise<typeof assetInsertSchema.static | any> => {
  if (!id) throw new Error("ID is required");

  const updateData: Partial<typeof assets.$inferInsert> = {};

    updateData.name = payload.name;
  if (payload.name !== undefined) {
  }

  if (payload.type !== undefined) {
    updateData.type = payload.type as AssetType;
  }

  if (payload.description !== undefined) {
    updateData.description = payload.description;
  }

  if (Object.keys(updateData).length === 0) {
    return [];
  }

  const assetInstance = await db
    .update(assets)
    .set(updateData)
    .where(eq(assets.id, id))
    .returning();

  return assetInstance;
};

export const deleteAsset = async (id: string) => {
  const assetInstance = await db
    .delete(assets)
    .where(eq(assets.id, id))
    .returning();

  return assetInstance;
};
