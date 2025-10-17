import { db } from "./database/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, openAPI } from "better-auth/plugins";
import { updatePhoneHandler } from "./modules/users/handler/updatePhone";

export const auth = betterAuth({
  basePath: "/auth",
  trustedOrigins: [
    'http://localhost:5173'],
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    database: {
      generateId: false,
      user:{
        extend:{
          phone:{
            type: "string",
            required: false,
          }
        }
      }
    },
  },
  user: {
    additionalFields: {
      phone: { type: "string" },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const newUserId = ctx.context?.newSession?.user?.id;
        const phone = ctx.body?.phone as string | undefined;

        if (newUserId && phone) {
          try {
            await updatePhoneHandler({ id: newUserId, phone });
          } catch (err) {
            console.error("[hooks.after] update phone error:", err);
          }
        }
      }
    }),
  },
});
