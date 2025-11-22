import { AssetsFilters, listAllAssets } from "@/database/repositories/assets.queries";

export const listAssetsHandler = async (filters: AssetsFilters) => {
  const assets = await listAllAssets(filters);
  return assets;
};;
