import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../../utils/auth';

interface AuthContextType {
    user: any | null;
    session: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    signOut: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth on mount
        const initAuth = async () => {
            try {
                const currentSession = await authService.getSession();
                if (currentSession) {
                    setSession(currentSession);
                    setUser(currentSession.user ?? (await authService.getUser()));
                }
            } catch (err) {
                console.error('Auth init error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = authService.onAuthStateChange((newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setIsLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await authService.signOut();
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isAuthenticated: !!session,
                isLoading,
                signOut: handleSignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
