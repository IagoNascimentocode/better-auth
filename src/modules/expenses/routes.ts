import Elysia, { t } from "elysia";
import { createExpenseHandler } from "./handler/createExpense";
import { updateExpenseHandler } from "./handler/updateExpense";
import { listAllExpensesHandler } from "./handler/listAllExpenses";
import { deleteExpenseHandler } from "./handler/deleteExpense";
import { ICreateExpensesPayload } from "./interfaces/ICreateExpensesPayload";
import { IUpdateExpensesPayload } from "./interfaces/IUpdateExpensesPayload";
import { createExpenseWithInstallmentsiHandler } from "./handler/createExpenseWithInstallments";

const expenseRoutes = new Elysia().group("/expenses", (app) =>
  app
    .post(
      "/create",
      async ({ body }) => {
        return await createExpenseWithInstallmentsiHandler(body);
      },
      {
        auth: true,
        body: { ...ICreateExpensesPayload },
        detail: {
          tags: ["Expenses"],
          summary: "Criar nova Despesa",
          description:
            "Cria uma nova despesa associada ao usuário. Valida, normaliza e registra todas as informações fornecidas.",
        },
      }
    )
    .put(
      "/:id",
      async ({ body, params }) => {
        return await updateExpenseHandler(params.id, body);
      },
      {
        auth: true,
        params: t.Object({
          id: t.String(),
        }),
        body: { ...IUpdateExpensesPayload },
        detail: {
          tags: ["Expenses"],
          summary: "Atualizar Despesa",
          description:
            "Atualiza uma despesa existente associada ao usuário com os dados fornecidos.",
        },
      }
    )
    .get(
      "/:userId",
      async ({ params }) => {
        return await listAllExpensesHandler(params.userId);
      },
      {
        auth: true,
        params: t.Object({
          userId: t.String(),
        }),
        detail: {
          tags: ["Expenses"],
          summary: "Listar Despesas por Usuário",
          description:
            "Lista todas as despesas registradas para o usuário informado.",
        },
      }
    )
    .delete(
      "/:id",
      async ({ params }) => {
        return await deleteExpenseHandler(params.id);
      },
      {
        auth: true,
        params: t.Object({
          id: t.String(),
        }),
        detail: {
          tags: ["Expenses"],
          summary: "Deletar Despesa",
          description:
            "Remove uma despesa existente associada ao usuário com base no identificador fornecido.",
        },
      }
    )
);

export default expenseRoutes;
