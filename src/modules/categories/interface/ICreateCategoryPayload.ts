import { t } from "elysia";

export const ICreateCategoryPayload = t.Object({
  userId: t.String(),
  name: t.String(),
});
