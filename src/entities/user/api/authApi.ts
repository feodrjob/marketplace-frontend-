import { apiClient } from '@/shared/api';
import { ENV } from '@/shared/config';
import { AuthResponse, LoginCredentials, RegisterBuyerData, User } from '../model/types';
import { authMocks } from './authMocks';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (ENV.USE_MOCKS) {
      return authMocks.login(credentials);
    }
    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },

  registerBuyer: async (data: RegisterBuyerData): Promise<AuthResponse> => {
    if (ENV.USE_MOCKS) {
      return authMocks.registerBuyer(data);
    }
    const res = await apiClient.post<AuthResponse>('/auth/register/buyer', data);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    if (ENV.USE_MOCKS) {
      return authMocks.getProfile();
    }
    const res = await apiClient.get<User>('/user/profile');
    return res.data;
  },

  logout: async (): Promise<void> => {
    if (ENV.USE_MOCKS) {
      return authMocks.logout();
    }
    await apiClient.post('/auth/logout');
  },
};
