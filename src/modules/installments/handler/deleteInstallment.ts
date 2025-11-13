import { deleteInstallment } from "@/database/repositories/installments.queries";

export const deleteInstallmentHandler = async (id: string) => {
  const result = await deleteInstallment(id);
  return result;
};
