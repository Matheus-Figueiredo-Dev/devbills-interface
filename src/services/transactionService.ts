import type {
	CreateTransactionDTO,
	MonthlyItem,
	Transaction,
	TransactionFilter,
	TransactionSummary,
} from "../types/transactions";
import { api } from "./api";

export const getTransactions = async (
	filter?: Partial<TransactionFilter>,
): Promise<Transaction[]> => {
	const response = await api.get<Transaction[]>("/api/transactions", {
		params: filter,
	});

	return response.data;
};

export const getTransactionSummary = async (
	month: number,
	year: number,
): Promise<TransactionSummary> => {
	const response = await api.get<TransactionSummary>(
		"/api/transactions/summary",
		{
			params: { month: month.toString().padStart(2, "0"), year },
		},
	);

	return response.data;
};

export const getTransactionsMonthly = async (
	month: number,
	year: number,
	months?: number,
): Promise<{ history: MonthlyItem[] }> => {
	const response = await api.get("/api/transactions/historical", {
		params: { month: month.toString().padStart(2, "0"), year, months },
	});

	return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
	await api.delete(`/api/transactions/${id}`);
};

export const createTransaction = async (
	transactionData: CreateTransactionDTO,
): Promise<Transaction> => {
	const response = await api.post<Transaction>(
		"/api/transactions",
		transactionData,
	);

	return response.data;
};
