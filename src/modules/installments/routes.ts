import Elysia, { t } from "elysia";
import { createInstallmentHandler } from "./handler/createInstallment";
import { updateInstallmentHandler } from "./handler/updateInstallment";
import { listInstallmentsByExpenseHandler } from "./handler/listInstallmentsByExpense";
import { deleteInstallmentHandler } from "./handler/deleteInstallment";
import { ICreateInstallmentsPayload } from "./interfaces/ICreateInstallmentsPayload";
import { IUpdateInstallmentsPayload } from "./interfaces/IUpdateInstallmentsPayload";

const installmentsRoutes = new Elysia().group("/installments", (app) =>
  app
    .post(
      "/create",
      async ({ body }) => {
        return await createInstallmentHandler(body);
      },
      {
        auth: true,
        body: { ...ICreateInstallmentsPayload },
        detail: {
          tags: ["Installments"],
          summary: "Criar parcela",
          description:
            "Cria uma nova parcela associada a uma despesa existente.",
        },
      }
    )
    .put(
      "/:id",
      async ({ params, body }) => {
        return await updateInstallmentHandler(params.id, body);
      },
      {
        auth: true,
        params: t.Object({
          id: t.String(),
        }),
        body: { ...IUpdateInstallmentsPayload },
        detail: {
          tags: ["Installments"],
          summary: "Atualizar parcela",
          description:
            "Atualiza uma parcela existente com os dados fornecidos.",
        },
      }
    )
    .get(
      "/:expenseId",
      async ({ params }) => {
        return await listInstallmentsByExpenseHandler(params.expenseId);
      },
      {
        auth: true,
        params: t.Object({
          expenseId: t.String(),
        }),
        detail: {
          tags: ["Installments"],
          summary: "Listar parcelas por despesa",
          description:
            "Lista todas as parcelas associadas a uma despesa específica.",
        },
      }
    )
    .delete(
      "/:id",
      async ({ params }) => {
        return await deleteInstallmentHandler(params.id);
      },
      {
        auth: true,
        params: t.Object({
          id: t.String(),
        }),
        detail: {
          tags: ["Installments"],
          summary: "Deletar parcela",
          description:
            "Remove uma parcela existente com base no identificador fornecido.",
        },
      }
    )
);

export default installmentsRoutes;
