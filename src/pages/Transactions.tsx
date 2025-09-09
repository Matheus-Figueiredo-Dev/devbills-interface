import { AlertCircle, ArrowDown, ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import MonthYearSelect from "../components/MonthYearSelect";
import { deleteTransaction, getTransactions } from "../services/transactionService";
import { type Transaction, TransactionType } from "../types/transactions";
import { formatCurrency, formatDate } from "../utils/formatters";

const Transactions = () => {
	const currentDate = new Date();

	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [filteredTransactions, setfilteredTransactions] = useState<Transaction[]>([]);
	const [deleteId, setDeleteId] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState<string>("");

	const fetchTransactions = async (): Promise<void> => {
		try {
			setLoading(true);
			setError("");
			const data = await getTransactions({ month, year });
			setTransactions(data);
			setfilteredTransactions(data);
		} catch (_err) {
			setError("Erro ao carregar transações. Tente novamente mais tarde!");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string): Promise<void> => {
		try {
			setDeleteId(id);

			await deleteTransaction(id);

			toast.success("Transação excluída com sucesso!");

			setfilteredTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
		} catch (error) {
			console.error(error);
			toast.error("Falha ao excluir transação. Tente novamente mais tarde!");
		} finally {
			setDeleteId("");
		}
	}

	const confirmDelete = (id: string): void => {
		if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
			handleDelete(id);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
	useEffect(() => {
		fetchTransactions();
	}, [month, year]);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setSearchTerm(e.target.value);
		setfilteredTransactions(transactions.filter(transaction =>
			transaction.description?.toUpperCase().includes(e.target.value.toUpperCase()),
		),
		);
	}
	return (
		<div className="container-app py-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb:6">
				<h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
				<Link to="/transacoes/nova"
					className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl 
					flex items-center justify-center hover:bg-primary-600 transition-all"
				>
					<Plus className="w-4 h-4 mr-2" />
					Nova Transação
				</Link>
			</div>
			<Card className="mb-6 mt-6">
				<MonthYearSelect month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
			</Card>
			<Card className="mb-6">
				<Input
					placeholder="Buscar transações..."
					icon={<Search className="w-4 h-4" />}
					fullWidth
					onChange={handleSearchChange}
					value={searchTerm}
				/>
			</Card>
			<Card className="overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center">
						<div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
					</div>
				) : error ? (
					<div className="p-8 text-center">
						<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<p>{error}</p>
						<Button onClick={fetchTransactions} className="mx-auto mt-6">Tentar novamente</Button>
					</div>
				) : transactions?.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500 mb-4">Nenhuma transação encontrada.</p>
						<Link to="/transacoes/nova"
							className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] 
							font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center
							hover:bg-primary-600 transition-all"
						>
							<Plus className="w-4 h-4 mr-2" />
							Nova Transação
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="divide-y divide-gray-700 min-h-full w-full">
							<thead>
								<tr>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
										Descrição
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
										Data
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
										Categoria
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
										Valor
									</th>
									<th
										scope="col"
										className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
										{""}
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{filteredTransactions.map((transaction) => (
									<tr key={transaction.id} className="hover:bg-gray-800">
										<td className="px-3 py-4 text-gray-400 whitespace-nowrap">
											<div className="flex items-center">
												<div className="mr-2">
													{transaction.type === TransactionType.INCOME ? (
														<ArrowUp className="w-4 h-4 text-primary-500" />
													) : (
														<ArrowDown className="w-4 h-4 text-red-500" />
													)}
												</div>
												<span className="text-sm font-medium text-gray-50">
													{transaction.description}
												</span>
											</div>
										</td>
										<td className="px-3 py-4 text-gray-400 whitespace-nowrap">
											{formatDate(transaction.date)}
										</td>
										<td className="px-3 py-4 text-gray-400 whitespace-nowrap">
											<div className="flex items-center">
												<div
													className="w-2 h-2 rounded-full mr-2"
													style={{ backgroundColor: transaction.category.color }}>
												</div>
												<span className="text-sm text-gray-400">{transaction.category.name}</span>
											</div>
										</td>
										<td className="px-3 py-4 text-gray-400 whitespace-nowrap">
											<span
												className={`${transaction.type === TransactionType.INCOME ? "text-primary-500" : "text-red-500"}`}>
												{formatCurrency(transaction.amount)}
											</span>
										</td>
										<td className="px-3 py-4 text-gray-400 whitespace-nowrap">
											<button
												className="hover:text-gray-300 rounded-full cursor-pointer"
												type="button"
												onClick={() => confirmDelete(transaction.id)}
												disabled={deleteId === transaction.id}
											>
												{deleteId === transaction.id ? (
													<span
														className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent
													rounded-full animate-spin">
													</span>
												) : (
													<Trash2 className="w-4 h-4" />
												)}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</div>
	);
};

export default Transactions;