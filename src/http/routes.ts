import Elysia from "elysia";
import { BaseError } from "@/errors/BaseError";
import userRoutes from "@/modules/users/routes";
import categoryRoutes from "@/modules/categories/routes.ts";

export const routes = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      console.log(error.all);
      const name = error.all.find((x) => x.summary);
      return name;
    }

    if (error instanceof BaseError) {
      set.status = error.statusCode;
      return {
        success: false,
        message: error.message,
        status: error.statusCode,
        exception_type: error.name,
      };
    }

    console.error("[UNHANDLED ERROR]", code, error);
    set.status = 500;
    return {
      success: false,
      message: "Internal server error"
    };
  })
  .use(userRoutes)
  .use(categoryRoutes)


export default routes;
