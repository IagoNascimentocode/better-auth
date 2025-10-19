import { categorieQueries } from "@/database/repositories";

export const deleteCategoryHandler = async (
  id: string
): Promise< boolean | undefined > => {
  try {
    await categorieQueries.deleteCategory(id);
    return true
  } catch (error) {
    console.log(error)
  }
};
