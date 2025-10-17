import Elysia, { t } from "elysia";
import { IUpdatePhonePayload } from "./interfaces/IUpdatePhonePayload";
import { updatePhoneHandler } from "./handler/updatePhone";

const userRoutes = new Elysia().group("/user", (app) =>
  app
    .post("/updatePhone", ({ body }) => updatePhoneHandler(body), {
      auth: true,
      body: { ...IUpdatePhonePayload },
      detail: {
        tags: ["Users"],
        description: `Atualiza o número de telefone de um usuário existente no sistema com base nos dados fornecidos.
        \nGarante que o telefone seja válido e retorna uma resposta 200 em caso de sucesso.`,
        summary: "Atualizar telefone do usuário",
      },
    })
);

export default userRoutes;
