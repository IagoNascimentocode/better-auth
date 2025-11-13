import { IUpdateInstallmentsPayload } from "../interfaces/IUpdateInstallmentsPayload";
import { updateInstallment } from "@/database/repositories/installments.queries";

export const updateInstallmentHandler = async (
  id: string,
  payload: typeof IUpdateInstallmentsPayload.static
) => {
  const result = await updateInstallment(id, payload);
  return result;
};
