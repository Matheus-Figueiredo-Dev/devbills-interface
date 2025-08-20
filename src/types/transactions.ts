import type { Category, CategorySummary } from "./category";

export const TransactionType = {
	EXPENSE: "expense",
	INCOME: "income",
} as const;

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
	id: string;
	userId: string;
	amount: number;
	categoryId: string;
	category: Category;
	description?: string;
	date: string | Date;
	type: TransactionType;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export interface TransactionFilter {
	month: number;
	year: number;
	categoryId?: string;
	type?: TransactionType;
}

export interface TransactionSummary {
	totalExpenses: number;
	totalIncomes: number;
	balance: number;
	expensesByCategory: CategorySummary[];
}
