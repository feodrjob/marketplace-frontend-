import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterBuyerData } from './types';
import { setAccessToken, getAccessToken, silentRefresh } from '@/shared/api';
import { authApi } from '../api/authApi';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // При старте приложения: проверяем токен в localStorage или пробуем тихий Silent Refresh
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        let token = getAccessToken();
        if (!token) {
          // Если в localStorage токена нет, пробуем получить его через HttpOnly Cookie
          token = await silentRefresh();
        }

        if (token && isMounted) {
          const profile = await authApi.getProfile();
          if (isMounted) setUser(profile);
        }
      } catch {
        // Сессия отсутствует или истекла
        setUser(null);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password = ''): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const { accessToken, user: loggedUser } = await authApi.login({ email, password });
      setAccessToken(accessToken);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err: unknown) {
      return { success: false, error: 'Ошибка авторизации' };
    }
  };

  const registerBuyer = async (data: RegisterBuyerData): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const { accessToken, user: registeredUser } = await authApi.registerBuyer(data);
      setAccessToken(accessToken);
      setUser(registeredUser);
      return { success: true, user: registeredUser };
    } catch (err: unknown) {
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const roles = user?.roles || [];

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        isBuyer: roles.includes('ROLE_BUYER'),
        isSeller: roles.includes('ROLE_SELLER'),
        isAdmin: roles.includes('ROLE_ADMIN'),
        login,
        registerBuyer,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
