import { t } from "elysia";

export const ICreateTransactionPayload = t.Object({
  title: t.String({ minLength: 1, maxLength: 256 }),
  amount: t.String(),
  type: t.Union([t.Literal("income"), t.Literal("expense")]),
  date: t.String(),
  notes: t.Optional(t.String()),
  categoryId: t.String({ format: "uuid" }),
  userId: t.String({ format: "uuid" }),
});
