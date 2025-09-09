import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import TransactionSelector from "../components/TransactionSelector";
import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionService";
import type { Category } from "../types/category";
import { type CreateTransactionDTO, TransactionType } from "../types/transactions";

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
	const [error, setError] = useState<{ [key: string]: boolean }>({});
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const formId = useId();

	useEffect(() => {
		const fetchCategories = async (): Promise<void> => {
			const response = await getCategories();

			setCategories(response);
		};

		fetchCategories();
	}, []);

	const filteredCategories = categories.filter((category) => category.type === formData.type);
	const validadeForm = (): boolean => {
		const newErrors: { [key: string]: boolean } = {};

		if (!formData.description) newErrors.description = true;
		if (!formData.amount) newErrors.amount = true;
		if (!formData.date) newErrors.date = true;
		if (!formData.categoryId) newErrors.categoryId = true;

		setError(newErrors);

		if (Object.keys(newErrors).length > 0) {
			setErrorMessage("Preencha todos os campos!");

			return false;
		}
		return true;
	};

	const handleSubmit = async (e: FormEvent): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		try {
			if (!validadeForm()) {
				return;
			}

			const transactionData: CreateTransactionDTO = {
				description: formData.description,
				amount: formData.amount,
				categoryId: formData.categoryId,
				type: formData.type,
				date: `${formData.date}T12:00:00.000Z`,
			};

			await createTransaction(transactionData);
			toast.success("Transação criada com sucesso!");
			navigate("/transacoes");

		} catch (_error) {
			toast.error("Erro ao criar transação. Tente novamente mais tarde!");
		} finally {
			setLoading(false);
		}
	};

	const handleTransactionType = (itemType: TransactionType): void => {
		setFormData((prev) => ({ ...prev, type: itemType }))
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		const { name, value } = e.target;

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCancel = () => {
		navigate("/transacoes");
	};

	return (
		<div className="container-app py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold mb-6">Nova transação</h1>
				<Card>
					{errorMessage !== null && errorMessage !== "" && (
						<div className="flex items-center bg-red-300 border-red-700 rounded-xl p-4 mb-6 gap-2">
							<AlertCircle className="w-5 h-5 text-red-700" />
							<p className="text-red-700">{errorMessage}</p>
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className="mb-4 flex gap-2 flex-col">
							<label htmlFor={formId} className="mb-2">Tipo de transação</label>
							<TransactionSelector
								id={formId}
								value={formData.type}
								onChange={handleTransactionType}
							/>
						</div>
						<Input
							label="Descrição"
							name="description"
							value={formData.description}
							onChange={handleChange}
							hasError={error.description}
							placeholder="Ex: Supermecado, Salário, etc..." />
						<Input
							label="Valor"
							name="amount"
							type="number"
							step="0.01"
							value={formData.amount}
							onChange={handleChange}
							hasError={error.amount}
							placeholder="R$0,00"
							icon={<DollarSign className="w-4 h-4" />} />
						<Input
							label="Data"
							name="date"
							type="date"
							value={formData.date}
							onChange={handleChange}
							hasError={error.date}
							icon={<Calendar className="w-4 h-4" />} />
						<Select
							label="Categoria"
							name="categoryId"
							value={formData.categoryId}
							onChange={handleChange}
							icon={<Tag className="w-4 h-4" />}
							hasError={error.categoryId}
							options={[
								{ value: "", label: "Selecione uma categoria" },
								...filteredCategories.map((category) => ({
									value: category.id,
									label: category.name
								}))
							]} />
						<div className="flex justify-end space-x-3 mt-2">
							<Button className=""
								variant="outline"
								onClick={handleCancel}
								type="button"
								disabled={loading}>
								Cancelar
							</Button>
							<Button
								type="submit"
								variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"}
								disabled={loading}>
								{loading ? (
									<div className="flex items-center justify-center">
										<div className="animate-spin h-4 w-4 border-4 border-gray-700 border-t-transparent rounded-full"></div>
									</div>
								) : <Save className="w-4 h-4 mr-2" />}
								Salvar
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default TransactionsForm;