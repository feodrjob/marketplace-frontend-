import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { AuthContextType } from './types';
import { useCurrentUserQuery } from './useAuthQueries';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user = null, isLoading, isFetching } = useCurrentUserQuery();

  const value = useMemo<AuthContextType>(() => {
    const roles = user?.roles ?? [];

    return {
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isFetching,
      isBuyer: roles.includes('ROLE_BUYER'),
      isSeller: roles.includes('ROLE_SELLER'),
      isAdmin: roles.includes('ROLE_ADMIN'),
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
