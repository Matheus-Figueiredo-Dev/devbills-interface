import type { Category } from "../types/category";
import { api } from "./api";

export const getCategories = async (): Promise<Category[]> => {
	try {
		const response = await api.get("/api/categories");

		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		throw new Error();
	}
};
