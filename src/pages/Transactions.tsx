import { AlertCircle, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Card from "../components/Card";
import Input from "../components/Input";
import MonthYearSelect from "../components/MonthYearSelect";
import type { Transaction } from "../types/transactions";
import { getTransactions } from "../services/transactionService";
import Button from "../components/Button";

const Transactions = () => {
	const currentDate = new Date();

	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	const fetchTransactions = async (): Promise<void> => {
		try {
			setLoading(true);
			setError("");

			const data = await getTransactions({ month, year });
			setTransactions(data);
		} catch (err) {
			setError("Erro ao carregar transações. Tente novamente mais tarde!");
		} finally {
			setLoading(true);
		}
	};

	useEffect(() => {

		fetchTransactions();
	}, [month, year]);


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
				/>
			</Card>
			<Card className="overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center">
						<div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
					</div>
				) : error ? (
					<div className="p-8 text-center">
						<AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
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
					<div>
						Salve
					</div>
				)}
			</Card>
		</div>
	);
};

export default Transactions;