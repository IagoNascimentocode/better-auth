import { assetsQueries } from "@/database/repositories";
import { ICreateAssetsPayload } from "../interface/ICreateAssetsPayload";

export const createAssetHandler = async (
  payload: typeof ICreateAssetsPayload.static,
): Promise<void> => {
  try {
    return await assetsQueries.createAsset(payload);
  } catch (error) {
    console.log(error)
  }
};
