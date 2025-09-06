import { TransactionType } from "../types/transactions";

interface TransactionSelectorProps {
	value: TransactionType;
	id?: string;
	onChange: (type: TransactionType) => void;
}

const TransactionSelector = ({ value, id, onChange }: TransactionSelectorProps) => {
	const transactionsTypeButtons = [
		{
			type: TransactionType.EXPENSE,
			label: "Despesa",
			activeClass: "bg-red-500 border-red-500 text-red-600 font-medium",
			inativeClass: "bg-transparent border-red-300 text-red-500 hover:bg-red-50",
		},
		{
			type: TransactionType.INCOME,
			label: "Receita",
			activeClass: "bg-green-100 border-green-500 text-green-700 font-medium",
			inativeClass: "bg-transparent border-green-300 text-green-500 hover:bg-green-50",
		}
	]

	return (
		<fieldset id={id} className="grid grid-cols-2 gap-4">
			{transactionsTypeButtons.map(item => (
				<button
					key={item.type}
					type="button"
					onClick={() => onChange(item.type)}
					className={`flex items-center justify-center border rounded-md py-2 px-4 transition-all cursor-pointer
						${value === item.type ? item.activeClass : item.inativeClass}`}
				>
					{item.label}
				</button>
			))}
		</fieldset>
	)
}

export default TransactionSelector;