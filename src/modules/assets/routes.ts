import Elysia, { t } from "elysia";
import { deleteAsset } from "./handler/deleteAsset";
import { listAssetsHandler } from "./handler/listAsset";
import { createAssetHandler } from "./handler/CreateAsset";
import { AssetTypeEnum, ICreateAssetsPayload } from "./interface/ICreateAssetsPayload";

const assetRoutes = new Elysia().group("/assets", (app) => app
    .post("/create", ({ body }) => createAssetHandler(body), {
      auth: true,
      body: { ...ICreateAssetsPayload },
      detail: {
        tags: ["Categories"],
        description: `Cria uma nova categoria associada a um usuário no sistema.
        \nValida os dados recebidos e retorna uma resposta 200 em caso de sucesso.`,
        summary: "Criar nova categoria",
      },
    })
    .get(
      "/list",
      async ({ query }) => {
        // Elysia já valida/coerce baseado no schema
        return listAssetsHandler({
          type: query.type,
          search: query.search,
        });
      },
      {
        auth: true,
        query: t.Object({
          type: t.Optional(AssetTypeEnum), // "fii" | "stock" | "crypto" | ...
          search: t.Optional(t.String()),
        }),
        detail: {
          tags: ["Assets"],
          description: `
Lista os assets disponíveis no sistema, com filtros opcionais:
- type: tipo do ativo (fii, stock, crypto, fixed_income, other)
- search: trecho do nome para busca parcial
          `,
          summary: "Listar assets",
        },
      },
    )
    .delete("/:assetId",({ params }) => deleteAsset(params.assetId),{
        auth:true,
        params: t.Object({
          assetId: t.String({ format: "uuid" }),
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

export default assetRoutes;
