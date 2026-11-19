import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { AuthContextType } from './types';
import { useCurrentUserQuery } from './useAuthQueries';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user = null, isLoading, isFetching } = useCurrentUserQuery();

  const value = useMemo<AuthContextType>(() => {
    const role = user?.role;

    return {
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isFetching,
      isBuyer: role === 'BUYER',
      isSeller: role === 'SELLER',
      isAdmin: role === 'ADMIN',
    };
  }, [user, isLoading, isFetching]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
