import { eq } from "drizzle-orm";
import { db } from "../client";
import { userSelectSchema } from "../interfaces/operarionSchemas";
import { users } from "../schema/users";

export const findByEmail = async (
  email: string,
): Promise<typeof userSelectSchema.static | undefined> => {
  const userInstance = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return userInstance;
};

export const findById = async (
  id: string,
): Promise<typeof userSelectSchema.static | undefined> => {
  const userInstance = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return userInstance;
};

export const updatePhone = async (
  user_id: string,
  phone: string,
): Promise<typeof userSelectSchema.static> => {
  const [instanceUpdated] = await db
    .update(users)
    .set({
      phone,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user_id))
    .returning();

  return instanceUpdated;
};
