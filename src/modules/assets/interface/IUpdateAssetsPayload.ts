import { t } from "elysia";
import { AssetTypeEnum } from "./ICreateAssetsPayload";

export const IUpdateAssetsPayload = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  type: t.Optional(AssetTypeEnum),
  description: t.Optional(t.String()),
});

// opcional
export type UpdateAssetsPayload = typeof IUpdateAssetsPayload.static;
