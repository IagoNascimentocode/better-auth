import { t } from "elysia";

export const IUpdateTransactionPayload = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 256 })),
  amount: t.Optional(t.Union([t.Number(), t.String()])),
  type: t.Optional(t.Union([t.Literal("income"), t.Literal("expense")])),
  date: t.Optional(
    t.Union([
      t.String({ format: "date-time" }),   // 2025-10-19T12:34:56Z
      t.String({ format: "date" }),        // 2025-10-19
    ])
  ),
  notes: t.Optional(t.String()),
  categoryId: t.Optional(t.String({ format: "uuid" })),
});
