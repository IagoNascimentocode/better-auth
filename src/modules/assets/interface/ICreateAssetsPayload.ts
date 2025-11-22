import { t } from "elysia";

export const AssetTypeEnum = t.Union([
  t.Literal("fii"),
  t.Literal("stock"),
  t.Literal("crypto"),
  t.Literal("fixed_income"),
  t.Literal("other"),
]);

export const ICreateAssetsPayload = t.Object({
  name: t.String({ minLength: 1, maxLength: 100 }),
  type: AssetTypeEnum,
  description: t.Optional(t.String()),
});

// opcional, se quiser o tipo direto
export type CreateAssetsPayload = typeof ICreateAssetsPayload.static;
