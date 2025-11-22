import { assetsQueries } from "@/database/repositories";
import { assetSelectSchema } from "@/database/interfaces/operarionSchemas";

export const deleteAsset = async (
  id: string
): Promise<typeof assetSelectSchema.static | any> => {
   try {
    return await assetsQueries.deleteAsset(id);
  } catch (error) {
    console.log(error)
  }
};
