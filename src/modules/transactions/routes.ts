// modules/transactions/routes.ts
import Elysia, { t } from "elysia";
import { ICreateTransactionPayload } from "./interface/ICreateTransactionPayload";
import { createTransactionHandler } from "./handler/createTransaction";
import { getUserBalance, listAllTransactions } from "@/database/repositories/transactions.queries";
import { updateTransactionHandler } from "./handler/updateTransaction";
import { IUpdateTransactionPayload } from "./interface/IUpdateTransactionPayload";
import { deleteCategoryHandler } from "./handler/deleteTransaction";

const transactionRoutes = new Elysia().group("/transactions", (app) =>
  app
    .post(
      "/create",
      async ({ body }) => {
        return await createTransactionHandler(body);
      },
      {
        auth: true,
        body: { ...ICreateTransactionPayload },
        detail: {
          tags: ["Transactions"],
          summary: "Criar nova transação",
          description:
            "Cria uma nova transação associada a um usuário. Valida e normaliza os dados.",
        },
      }
    )
    .patch(
      "/update/:transactionId",
      async ({ body, params }) => {
        return await updateTransactionHandler(body, params.transactionId);
      },
      {
        auth: true,
        body: { ...IUpdateTransactionPayload },
        params: t.Object({
          transactionId: t.String({ format: "uuid" }),
        }),
        detail: {
          tags: ["Transactions"],
          summary: "Atualizar transação",
          description:
            "Atualiza parcialmente uma transação existente, apenas com os campos enviados.",
        },
      }
    )
    .get(
      "/list/:userId",
      async ({ params }) => {
        return await listAllTransactions(params.userId);
      },
      {
        auth: true,
        params: t.Object({
          userId: t.String({ format: "uuid" }),
        }),
        detail: {
          tags: ["Transactions"],
          summary: "Listar transações do usuário",
        },
      }
    )
    .get(
      "/balance/:userId",
      async ({ params }) => {
        const balance = await getUserBalance(params.userId);
        return { balance };
      },
      {
        auth: true,
        params: t.Object({
          userId: t.String({ format: "uuid" }),
        }),
        detail: {
          tags: ["Transactions"],
          summary: "Listar transações do usuário",
        },
      }
    )
    .delete(
      "/delete/:transactionId",
      async ({ params }) => {
        return await deleteCategoryHandler(params.transactionId);
      },
      {
        auth: true,
        params: t.Object({
          transactionId: t.String({ format: "uuid" }),
        }),
        detail: {
          tags: ["Transactions"],
          summary: "Excluir transação",
        },
      }
    )
);

export default transactionRoutes;
