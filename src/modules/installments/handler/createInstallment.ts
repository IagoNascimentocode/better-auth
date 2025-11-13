import { ICreateInstallmentsPayload } from "../interfaces/ICreateInstallmentsPayload";
import { createInstallment } from "@/database/repositories/installments.queries";

export const createInstallmentHandler = async (
  payload: typeof ICreateInstallmentsPayload.static
) => {
  console.log(payload)
  const result = await createInstallment(payload);
  return result;
};
