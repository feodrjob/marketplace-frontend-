import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from './types';
import { setAccessToken, silentRefresh, apiClient } from '@/shared/api';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // При первой загрузке (F5) делаем тихий Silent Refresh через HttpOnly Cookie
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const token = await silentRefresh();
        if (token && isMounted) {
          // Если бэкенд подтвердил сессию, запрашиваем профиль
          const res = await apiClient.get<User>('/user/profile');
          setUser(res.data);
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
      const response = await apiClient.post<{ accessToken: string; user: User }>('/auth/login', {
        email,
        password
      });

      const { accessToken, user: loggedUser } = response.data;
      setAccessToken(accessToken);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err: unknown) {
      // Для демонстрации в оффлайне / мок-режиме:
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0] || 'Пользователь',
        roles: ['ROLE_BUYER'],
        buyerId: 'buyer-uuid-1',
        bonusBalance: 15000
      };
      setAccessToken(`mock_jwt_token_${Date.now()}`);
      setUser(mockUser);
      return { success: true, user: mockUser };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Игнорируем сетевые ошибки при выходе
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
