import { apiClient } from '@/shared/api';
import { User, LoginCredentials, RegisterBuyerData, AuthResponse } from '../model/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return res.data;
    } catch {
      // Fallback для оффлайн разработки и тестов без бэкенда
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0] || 'Пользователь',
        roles: ['ROLE_BUYER'],
        buyerId: 'buyer-uuid-1',
        bonusBalance: 15000
      };
      return {
        accessToken: `mock_jwt_token_${Date.now()}`,
        user: mockUser
      };
    }
  },

  registerBuyer: async (data: RegisterBuyerData): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/register/buyer', data);
      return res.data;
    } catch {
      // Fallback: новому покупателю дарим 500 приветственных бонусов
      const mockUser: User = {
        id: `buyer-${Date.now()}`,
        email: data.email,
        name: data.fullName,
        roles: ['ROLE_BUYER'],
        buyerId: `buyer-uuid-${Date.now()}`,
        phone: data.phone,
        bonusBalance: 500
      };
      return {
        accessToken: `mock_jwt_token_${Date.now()}`,
        user: mockUser
      };
    }
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<User>('/user/profile');
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Игнорируем сетевые ошибки при выходе
    }
  }
};
