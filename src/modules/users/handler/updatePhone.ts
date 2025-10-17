import { userQueries } from "@/database/repositories";
import { IUpdatePhonePayload } from "../interfaces/IUpdatePhonePayload";

export const updatePhoneHandler = async (
  payload: typeof IUpdatePhonePayload.static,
): Promise<void> => {
  try {
    const { id, phone } = payload;

    await userQueries.updatePhone(id, phone);

  } catch (error) {
    console.log(error)
  }
};
