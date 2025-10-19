import { categorieQueries, userQueries } from "@/database/repositories";
import { ICreateCategoryPayload } from "../interface/ICreateCategoryPayload";

export const createCategoryHandler = async (
  payload: typeof ICreateCategoryPayload.static,
): Promise<void> => {
  try {
    const { userId, name } = payload;

    return await categorieQueries.createCategorie( name, userId);
  } catch (error) {
    console.log(error)
  }
};
