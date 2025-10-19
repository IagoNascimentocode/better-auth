import { categorieQueries, userQueries } from "@/database/repositories";

export const listCategoryHandler = async (
  userId: string
): Promise<void> => {
  try {
    return await categorieQueries.listAllCategories(userId);
  } catch (error) {
    console.log(error)
  }
};
