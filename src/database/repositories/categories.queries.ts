import { db } from "../client";
import { desc, eq } from "drizzle-orm";
import { categoryInsertSchema, categorySelectSchema } from "../interfaces/operarionSchemas";
import { categories } from "../schema/categories";

export const createCategorie = async (
  name: string,
  userId: string
): Promise<typeof categoryInsertSchema.static | any> => {
  const categoriesInstance = await db.insert(categories).values({
    name,
    userId,
  }).returning();

  return categoriesInstance;
};

export const listAllCategories = async (
  userId: string
): Promise<typeof categorySelectSchema.static | any> => {
  const categoriesInstance = await db.query.categories.findMany({
    where: eq(categories.userId, userId),
    orderBy: desc(categories.createdAt),
  });

  return categoriesInstance;
};

export const deleteCategory = async (
  id: string
): Promise<typeof categorySelectSchema.static | any> => {
  const categoriesInstance = await db.delete(categories)
    .where(eq(categories.id, id))
    .returning();

  return categoriesInstance;
}
