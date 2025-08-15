import { signOut as firebaseSignOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { firebaseAuth, googleAuthProvider } from '../config/firebase';
import type { AuthState } from '../types/auth';

interface AuthContextProps {
	authState: AuthState;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		error: null,
		loading: false,
	})

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
			console.log(user);
			if (user) {
				setAuthState({
					user: {
						uid: user.uid,
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL
					},
					error: null,
					loading: false
				})
			} else {
				setAuthState({ user: null, error: null, loading: false });
			}
		}, (error) => {
			console.error('Auth state change error:', error);
			setAuthState({ user: null, error: error.message, loading: false });
		}
		);
		return () => unsubscribe()
	}, [])


	const signInWithGoogle = async (): Promise<void> => {
		setAuthState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			await signInWithPopup(firebaseAuth, googleAuthProvider)
		} catch (error) {
			console.error('Google sign-in error:', error);
			setAuthState((prev) => ({ ...prev, loading: false, error: (error as Error).message }))
		}
	};

	const signOut = async (): Promise<void> => {
		setAuthState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			await firebaseSignOut(firebaseAuth);
		} catch (error) {
			console.error('Google sign-in error:', error);
			setAuthState((prev) => ({ ...prev, loading: false, error: (error as Error).message }))
		}
	}

	return (
		<AuthContext.Provider value={{ authState, signInWithGoogle, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
