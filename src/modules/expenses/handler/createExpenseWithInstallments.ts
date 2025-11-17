import { addMonths } from "date-fns";
import { expensesQueries, installmentsQueries } from "@/database/repositories";
import { ICreateExpensesPayload } from "../interfaces/ICreateExpensesPayload";
import { OperationType, PaymentType } from "@/database/repositories/expenses.queries";


type CreateExpenseInput = typeof ICreateExpensesPayload.static;
function generateInstallments(data: {
  expenseId: string;
  totalAmount: number;
  installments: number;
  startDate: Date;
  operationType: OperationType;
  paymentType: PaymentType;
}) {
  let amountPerInstallment: number;

  if (data.operationType === "purchase") {
    amountPerInstallment = Number(
      (data.totalAmount / data.installments).toFixed(2)
    );
  } else {
    // mesma cobrança todo mês (recorrente)
    amountPerInstallment = Number(data.totalAmount.toFixed(2));
  }

  return Array.from({ length: data.installments }, (_, i) => ({
    installmentNum: i + 1,
    dueDate: addMonths(data.startDate, i).toISOString(),
    amount: amountPerInstallment,
    paid: false,
    paymentType: data.paymentType,
    expenseId: data.expenseId,
  }));
}

export async function createExpenseWithInstallmentsiHandler(
  payload: CreateExpenseInput
) {
  const [expense] = await expensesQueries.createExpense(payload);

  const installments = generateInstallments({
    expenseId: expense.id,
    totalAmount: Number(expense.totalAmount),
    installments: expense.installments,
    startDate: new Date(expense.date),
    operationType: payload.operationType,
    paymentType: payload.paymentType,
  });

  await Promise.all(
    installments.map((i) => installmentsQueries.createInstallment(i))
  );

  return expense;
}
