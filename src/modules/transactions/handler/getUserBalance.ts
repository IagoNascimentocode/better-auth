
import { getUserBalanceConverted } from "@/modules/rates/handler/getUserBalanceConverted";

export const getUserBalanceHandler = async (user_id: string): Promise<any> => {
  try {
    return await getUserBalanceConverted(user_id);
  } catch (error) {
    console.log(error);
  }

};
