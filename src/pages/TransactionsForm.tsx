import { Calendar, DollarSign, Tag } from "lucide-react";
import { type ChangeEvent, useEffect, useId, useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
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
};

const initialFormData = {
	description: "",
	amount: 0,
	date: "",
	categoryId: "",
	type: TransactionType.EXPENSE,
};

const TransactionsForm = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [formData, setFormData] = useState<FormData>(initialFormData);

	const formId = useId();

	useEffect(() => {
		const fetchCategories = async (): Promise<void> => {
			const response = await getCategories();

			setCategories(response);
		};

		fetchCategories();
	}, []);

	const filteredCategories = categories.filter((category) => category.type === formData.type);

	const handleSubmit = () => { };

	const handleTransactionType = (itemType: TransactionType): void => {
		setFormData((prev) => ({ ...prev, type: itemType }))
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const { name, value } = e.target;

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div>
			<div>
				<h1>nova transação</h1>
				<Card>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor={formId}>Tipo de transação</label>
							<TransactionSelector
								id={formId}
								value={formData.type}
								onChange={handleTransactionType}
							/>
						</div>
						<Input
							label="Descrição"
							name="Description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Ex: Supermecado, Salário, etc..."
							required />
						<Input
							label="Valor"
							name="amount"
							type="number"
							step="0.01"
							min="0.01"
							value={formData.amount}
							onChange={handleChange}
							placeholder="R$0,00"
							icon={<DollarSign className="w-4 h-4" />}
							required />
						<Input
							label="Data"
							name="date"
							type="date"
							value={formData.date}
							onChange={handleChange}
							icon={<Calendar className="w-4 h-4" />}
							required />
						<Select
							label="Categoria"
							name="categoryId"
							value={formData.categoryId}
							onChange={handleChange}
							icon={<Tag className="w-4 h-4" />}
							required
							options={[
								{ value: "", label: "Selecione uma categoria" },
								...filteredCategories.map((category) => ({
									value: category.id,
									label: category.name
								}))
							]} />
					</form>
				</Card>
			</div>
		</div>
	);
};

export default TransactionsForm;