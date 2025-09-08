import { type InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	fullWidth?: boolean;
	label?: string;
	error?: string;
	id?: string;
	hasError?: boolean;
}

const Input = ({ icon, fullWidth, label, error, id, hasError, className, ...rest }: InputProps) => {
	const generatedId = useId();
	const inputId = id || generatedId;

	return (
		<div className={`${fullWidth ? "w-full" : ""} mb-4`}>
			{label && (
				<label htmlFor={inputId} className="block text-sm font-medium text-gray-50 mb-2">
					{label}
				</label>
			)}
			<div className="relative">
				{icon && (
					<div className="absolute bottom-0 top-6 left-0 pl-3 flex items-center cursor-pointer text-gray-400">
						{icon}
					</div>
				)}
			</div>
			<input
				id={inputId}
				className={
					`block w-full rounded-xl border ${error ? "border-red-600" : "border-gray-700"}
					bg-gray-800 px-4 py-3 text-sm text-gray-50
					transition-all focus:outline-none focus:ring-2
					${error ? "focus:border-red-600 focus:ring-red-600/2"
						: "focus:border-primary-500 focus:ring-primary-500/2"}
					${icon ? "pl-10" : ""}
					${className}
					${hasError ? "border-red-500" : ""}
					`}
				{...rest}
			/>
			{error && (
				<p className="mt-1 text-sm text-red-600">{error}</p>
			)}
		</div>
	);
};

export default Input;