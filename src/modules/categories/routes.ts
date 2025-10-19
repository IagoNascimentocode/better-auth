import Elysia, { t } from "elysia";
import { createCategoryHandler } from "./handler/createCategory";
import { ICreateCategoryPayload } from "./interface/ICreateCategoryPayload";
import { listCategoryHandler } from "./handler/listCategories";
import { deleteCategory } from "@/database/repositories/categories.queries";

const categoryRoutes = new Elysia().group("/categories", (app) => app
    .post("/create", ({ body }) => createCategoryHandler(body), {
      auth: true,
      body: { ...ICreateCategoryPayload },
      detail: {
        tags: ["Categories"],
        description: `Cria uma nova categoria associada a um usuário no sistema.
        \nValida os dados recebidos e retorna uma resposta 200 em caso de sucesso.`,
        summary: "Criar nova categoria",
      },
    })
    .get("/list/:userId", ({ params }) => listCategoryHandler(params.userId), {
      auth: true,
      params: t.Object({
        userId: t.String({ format: "uuid" }),
      }),
      detail: {
        tags: ["Categories"],
        description: `Cria uma nova categoria associada a um usuário no sistema.
        \nValida os dados recebidos e retorna uma resposta 200 em caso de sucesso.`,
        summary: "Criar nova categoria",
      },
    })
    .delete("/:categoryId",({ params }) => deleteCategory(params.categoryId),{
        auth:true,
        params: t.Object({
          categoryId: t.String({ format: "uuid" }),
        }),
        detail: {
          tags: ["Categories"],
          summary: "Excluir categoria",
          description:
            "Exclui a categoria pelo seu ID. Retorna 200 em caso de sucesso.",
        },
      }
    )
);

export default categoryRoutes;
