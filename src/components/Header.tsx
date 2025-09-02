import { Link } from "react-router";

const Header = () => {
	return (
		<header>
			<h1>Hello header</h1>
			<Link to="/transacoes">Transações</Link>
		</header>
	);
}

export default Header;