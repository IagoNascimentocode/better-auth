import Elysia, { t } from "elysia";
import { getExpenseAndInstallmentSummaryHandler } from "../expenses/handler/getExpenseAndInstallmentSummary";

const dashboardRoutes = new Elysia().group("/dashboard", (app) =>
  app.get(
    "/summary",
    async ({ query }) => {
      const { userId, from, to, categoryId, operationType, paymentType } = query;

      const fromDate = from ? new Date(from) : undefined;
      const toDate = to ? new Date(to) : undefined;

      return await getExpenseAndInstallmentSummaryHandler(userId, {
        from: fromDate,
        to: toDate,
        categoryId,
        operationType,
        paymentType,
      });
    },
    {
      auth: true,
      query: t.Object({
        userId: t.String(),
        from: t.Optional(t.String()),
        to: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
        operationType: t.Optional(
          t.Union([
            t.Literal("purchase"),
            t.Literal("recurring"),
          ]),
        ),
        paymentType: t.Optional(
          t.Union([
            t.Literal("credit_card"),
            t.Literal("pix"),
            t.Literal("boleto"),
            t.Literal("cash"),
            t.Literal("transfer"),
          ]),
        ),
      }),
      detail: {
        tags: ["Dashboard"],
        summary: "Resumo de despesas e parcelas",
        description:
          "Retorna o resumo de despesas e parcelas (installments) do usuário no período informado, com filtros opcionais por categoria, tipo de operação e forma de pagamento.",
      },
    }
  )
);

export default dashboardRoutes;
