import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().startsWith("postgresql://"),
  // FX_TTL_MS: z.number(Number(process.env.FX_TTL_MS ?? 60_000)),
  // FETCH_TIMEOUT_MS: Number(process.env.FETCH_TIMEOUT_MS ?? 3500),
});

export const env = envSchema.parse(Bun.env);
