import { Activity, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

interface NavLink {
	name: string;
	path: string;
}

const Header = () => {
	const { authState, signOut } = useAuth();
	const { pathname } = useLocation();
	const [_isOpen, _setIsOpen] = useState<boolean>(false);

	const isAuthenticated: boolean = !!authState.user;

	const navLink: NavLink[] = [
		{ name: "Dashboard", path: "/dashboard" },
		{ name: "Transações", path: "/transacoes" },
	];

	const handleSignOut = (): void => {
		signOut();
	};

	const renderAvatar = () => {
		if (!authState.user) return null

		if (authState.user.photoURL) {
			return <img
				src={authState.user.photoURL}
				alt={`Foto de perfil de ${authState.user.displayName}`}
				className="w-8 h-8 rounded-full border border-gray-7000" />
		}
		return (
			<div
				className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
				{authState.user.displayName?.charAt(0).toUpperCase()}
			</div>
		)
	};

	return (
		<header className="bg-gray-900 border-b border-gray-700">
			<div className="container-app">
				<div className="flex justify-between items-center py-4">
					<Link to="/" className="flex items-center gap-2 text-xl text-primary-500 font-bold">
						<Activity className="h-6 w-6" />
						DevBills
					</Link>
					{isAuthenticated && (
						<nav className="hidden md:flex space-x-3">
							{navLink.map(link => (
								<Link key={link.path} to={link.path} className={`
									${pathname === link.path ? "text-primary-500 bg-primary-500/10 rounded-md h-10 px-3 py-2"
										: "text-gray-400 rounded-md h-10 px-3 py-2 hover:text-primary-500 hover:bg-primary-500/10"}
									}`} >
									{link.name}
								</Link>
							))}
						</nav>
					)}
					<div className="hidden md:flex items-center space-x-4">
						{isAuthenticated ? (
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">{renderAvatar()}
									<span className="text-sm font-medium">{authState.user?.displayName}</span>
								</div>
								<button
									type="button"
									onClick={handleSignOut}
									className=" hover:text-red-300 hover:bg-red-500 p-2 rounded-full transition-colors cursor-pointer">
									<LogOut className="text-gray-200" />
								</button>
							</div>
						) : (
							<Link to={"/login"}>
								<LogIn
									className="bg-primary-500 text-shadow-gray-900 font-semibold px-5 py-2.5 rounded-xl 
								flex items-center justify-center hover:bg-primary-500 transition-all" />
							</Link>
						)}
					</div>
				</div>
			</div>
		</header >
	);
}

export default Header;