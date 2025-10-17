import { t } from "elysia";

export const IUpdatePhonePayload = t.Object({
  id: t.String(),
  phone: t.String(),
});
