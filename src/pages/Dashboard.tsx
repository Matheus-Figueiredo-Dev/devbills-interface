import { ArrowUp, Wallet } from "lucide-react";
import { useEffect, useState, } from "react";
import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionSummary } from "../services/transactionService";
import type { TransactionSummary } from "../types/transactions";
import { formatCurrency } from "../utils/formatters";

const initialSummary: TransactionSummary = {
	totalExpenses: 0,
	totalIncomes: 0,
	balance: 0,
	expensesByCategory: [],
}

const Dashboard = () => {
	const currentDate = new Date();

	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [summary, setSummary] = useState<TransactionSummary>(initialSummary);

	useEffect(() => {
		async function loadTransactionsSummary() {
			const response = await getTransactionSummary(month, year);

			setSummary(response);
		}
		loadTransactionsSummary();
	}, [month, year]);

	return (
		<div className="container-app py-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
				<MonthYearSelect month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				<Card
					icon={<Wallet size={20} className="text-primary-500" />}
					title="Saldo"
					hover
					glowEffect={summary.balance > 0}>
					<p className={`text-2xl font-semibold mt-2
					${summary.balance > 0 ? "text-primary-500" : "text-red-600"}`}>
						{formatCurrency(summary.balance)}
					</p>
				</Card>

				<Card
					icon={<ArrowUp size={20} className="text-primary-500" />}
					title="Receitas"
					hover>
					<p className="text-2xl font-semibold mt-2 text-primary-500">
						{formatCurrency(summary.totalIncomes)}
					</p>
				</Card>

				<Card
					icon={<Wallet size={20} className="text-red-600" />}
					title="Despesas"
					hover>
					<p className="text-2xl font-semibold mt-2 text-red-600"
					>
						{formatCurrency(summary.totalExpenses)}
					</p>
				</Card>
			</div>
		</div>
	)
}

export default Dashboard;