import Elysia, { t } from "elysia";
import { listInvestmentTransactionsHandler } from "./handler/listInvestmentTransactions";
import { createInvestmentTransactionHandler } from "./handler/createInvestmentTransaction";
import { ICreateInvestmentTransactionsPayload, InvestmentOperationTypeEnum } from "./interface/ICreateInvestmentTransactionsPayload";
import { deleteInvestmentTransactionHandler } from "./handler/deleteInvestmentTransaction";
import { getUserInvestmentPositionsWithFxHandler } from "./handler/getUserInvestmentPositionsWithFx";
import { getUserInvestmentPositionsHandler } from "./handler/getUserInvestmentPositions";

const investmentTransactionsRoutes = new Elysia().group(
  "/investment-transactions",
  (app) =>
    app
      // CRIAR TRANSAÇÃO
      .post(
        "/create",
        ({ body }) => createInvestmentTransactionHandler(body),
        {
          auth: true,
          body: { ...ICreateInvestmentTransactionsPayload },
          detail: {
            tags: ["InvestmentTransactions"],
            summary: "Criar transação de investimento",
            description: `
Cria uma nova transação de investimento (buy/sell).
O usuário informa usuário, asset, data, quantidade e preço/total.
            `,
          },
        },
      )

      // LISTAR TRANSAÇÕES POR USUÁRIO + FILTROS
      .get(
        "/list/:userId",
        async ({ params, query }) => {
          return listInvestmentTransactionsHandler(params.userId, {
            from: query.from ? new Date(query.from) : undefined,
            to: query.to ? new Date(query.to) : undefined,
            assetId: query.assetId,
            operationType: query.operationType,
            isCashMovement: query.isCashMovement,
          });
        },
        {
          auth: true,
          params: t.Object({
            userId: t.String({ format: "uuid" }),
          }),
          query: t.Object({
            from: t.Optional(
              t.String({
                description: "Data inicial (YYYY-MM-DD ou ISO 8601)",
              }),
            ),
            to: t.Optional(
              t.String({
                description: "Data final (YYYY-MM-DD ou ISO 8601)",
              }),
            ),
            assetId: t.Optional(t.String({ format: "uuid" })),
            categoryId: t.Optional(t.String({ format: "uuid" })),
            operationType: t.Optional(InvestmentOperationTypeEnum),
            isCashMovement: t.Optional(t.Boolean()),
          }),
          detail: {
            tags: ["InvestmentTransactions"],
            summary: "Listar transações de investimento",
            description: `
Lista as transações de investimento de um usuário com filtros opcionais:
- from / to: intervalo de datas
- assetId: filtra por um único ativo
- categoryId: filtra pela categoria
- operationType: buy ou sell
- isCashMovement: se a transação movimenta caixa ou não
            `,
          },
        },
      )
      .get(
        "/positions/:userId",
        async ({ params, query }) => {
          return getUserInvestmentPositionsHandler(params.userId, {
            from: query.from ? new Date(query.from) : undefined,
            to: query.to ? new Date(query.to) : undefined,
            assetId: query.assetId,
            operationType: query.operationType,
            isCashMovement: query.isCashMovement,
          });
        },
        {
          auth: true,
          params: t.Object({
            userId: t.String({ format: "uuid" }),
          }),
          query: t.Object({
            from: t.Optional(t.String()),
            to: t.Optional(t.String()),
            assetId: t.Optional(t.String({ format: "uuid" })),
            operationType: t.Optional(InvestmentOperationTypeEnum),
            isCashMovement: t.Optional(t.Boolean()),
          }),
          detail: {
            tags: ["InvestmentTransactions"],
            summary: "Obter posição patrimonial consolidada",
            description: `
Retorna a posição líquida do usuário por ativo:
- quantidade (buy - sell)
- investido líquido
- tipo do ativo (fii, stock, crypto...)
- nome do ativo
`,
          },
        },
      )

      .delete(
        "/:transactionId",
        ({ params }) => deleteInvestmentTransactionHandler(params.transactionId),
        {
          auth: true,
          params: t.Object({
            transactionId: t.String({ format: "uuid" }),
          }),
          detail: {
            tags: ["InvestmentTransactions"],
            summary: "Excluir transação de investimento",
            description: `Exclui uma transação pelo seu ID.`,
          },
        },
      ).get(
        "/investment-transactions/positions-with-fx/:userId",
        async ({ params, query }) => {
          return getUserInvestmentPositionsWithFxHandler(params.userId, {
            from: query.from ? new Date(query.from) : undefined,
            to: query.to ? new Date(query.to) : undefined,
            assetId: query.assetId,
            categoryId: query.categoryId,
            operationType: query.operationType,
            isCashMovement: query.isCashMovement,
          });
        },
        {
          auth: true,
          params: t.Object({
            userId: t.String({ format: "uuid" }),
          }),
          query: t.Object({
            from: t.Optional(t.String()),
            to: t.Optional(t.String()),
            assetId: t.Optional(t.String({ format: "uuid" })),
            categoryId: t.Optional(t.String({ format: "uuid" })),
            operationType: t.Optional(InvestmentOperationTypeEnum),
            isCashMovement: t.Optional(t.Boolean()),
          }),
          detail: {
            tags: ["InvestmentPositions"],
            summary: "Posição de investimentos com preço médio em BRL e USD",
            description: "Retorna posições consolidadas + preço médio em BRL/USD usando getFxRatesHandler.",
          },
        },
      )
      );

export default investmentTransactionsRoutes;
