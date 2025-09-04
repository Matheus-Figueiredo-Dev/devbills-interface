import { useEffect, useId, useState } from "react";
import Card from "../components/Card";
import TransactionSelector from "../components/TransactionSelector";
import { getCategories } from "../services/categoryService";
import type { Category } from "../types/category";
import { TransactionType } from "../types/transactions";

interface FormData {
	description: string;
	amount: number;
	date: string;
	categoryId: string;
	type: TransactionType;
}

const initialFormData = {
	description: "",
	amount: 0,
	date: "",
	categoryId: "",
	type: TransactionType.EXPENSE,
}

const TransactionsForm = () => {
	const [_categories, setCategories] = useState<Category[]>([])
	const [formData, setFormData] = useState<FormData>(initialFormData);

	const formId = useId();

	useEffect(() => {
		const fetchCategories = async (): Promise<void> => {
			const response = await getCategories();

			setCategories(response);
		}

		fetchCategories();
	}, [])

	const handleSubmit = () => { }

	const handleTransactionType = (itemType: TransactionType): void => {
		setFormData((prev) => ({ ...prev, type: itemType }))
	}

	return (
		<div>
			<div>
				<h1>nova transação</h1>
				<Card>
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor={formId}>Tipo de transação</label>
							<TransactionSelector
								id={formId}
								value={formData.type}
								onChange={handleTransactionType}
							/>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default TransactionsForm;