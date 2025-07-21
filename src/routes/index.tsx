import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/home" element={<Home />} />
					<Route path="*" element={<h2>Página não encontrada</h2>} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default AppRoutes;
