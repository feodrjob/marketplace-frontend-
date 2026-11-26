import type { AxiosRequestConfig } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterBuyerData,
  RegisterSellerData,
  UserProfile,
} from '../model/types';

const now = () => new Date().toISOString();

let mockCurrentUser: UserProfile | null = {
  id: '1',
  email: 'buyer@t-market.ru',
  role: 'BUYER',
  fullName: 'Иван Покупатель',
  phone: '+79990000000',
  createdAt: now(),
  updatedAt: now(),
};

export const authMocks = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Тестовый профиль продавца для локальной разработки:
    // любой email, начинающийся с seller, получает роль SELLER.
    const isSeller = credentials.email.trim().toLowerCase().startsWith('seller');
    const user: UserProfile = {
      id: isSeller ? 'seller-1' : '1',
      email: credentials.email,
      role: isSeller ? 'SELLER' : 'BUYER',
      fullName: credentials.email.split('@')[0] || 'Покупатель',
      ...(isSeller ? { companyName: 'Мой магазин' } : {}),
      createdAt: now(),
      updatedAt: now(),
    };
    mockCurrentUser = user;
    return {
      accessToken: `mock_jwt_token_${Date.now()}`,
      user,
    };
  },

  registerBuyer: async (data: RegisterBuyerData): Promise<AuthResponse> => {
    const user: UserProfile = {
      id: `buyer-${Date.now()}`,
      email: data.email,
      role: 'BUYER',
      fullName: data.fullName ?? data.email,
      phone: data.phone,
      createdAt: now(),
      updatedAt: now(),
    };
    mockCurrentUser = user;
    return {
      accessToken: `mock_jwt_token_${Date.now()}`,
      user,
    };
  },

  registerSeller: async (data: RegisterSellerData): Promise<AuthResponse> => {
    const user: UserProfile = {
      id: `seller-${Date.now()}`,
      email: data.email,
      role: 'SELLER',
      companyName: data.companyName,
      inn: data.inn,
      description: data.description,
      createdAt: now(),
      updatedAt: now(),
    };
    mockCurrentUser = user;
    return {
      accessToken: `mock_jwt_token_${Date.now()}`,
      user,
    };
  },

  getProfile: async (): Promise<UserProfile> => {
    if (!mockCurrentUser) {
      throw new Error('Mock user session not initialized');
    }
    return mockCurrentUser;
  },

  logout: async (): Promise<void> => {
    mockCurrentUser = null;
  },
};

function parseBody<T>(data: unknown): T {
  return (typeof data === 'string' ? JSON.parse(data) : data) as T;
}

/**
 * Отвечает на запросы сгенерированных Orval-хуков, пока включены моки.
 * Живёт только в dev: модуль подгружается динамически из main.tsx.
 */
export async function respondToAuthMock(config: AxiosRequestConfig): Promise<unknown> {
  const url = config.url ?? '';
  const method = (config.method ?? 'get').toUpperCase();

  if (method === 'POST' && url === '/api/v1/auth/login') {
    return authMocks.login(parseBody<LoginCredentials>(config.data));
  }
  if (method === 'POST' && url === '/api/v1/auth/register/buyer') {
    return authMocks.registerBuyer(parseBody<RegisterBuyerData>(config.data));
  }
  if (method === 'POST' && url === '/api/v1/auth/register/seller') {
    return authMocks.registerSeller(parseBody<RegisterSellerData>(config.data));
  }
  if (method === 'POST' && url === '/api/v1/auth/refresh') {
    return { accessToken: `mock_jwt_token_${Date.now()}` };
  }
  if (method === 'GET' && url === '/api/v1/users/me') {
    return authMocks.getProfile();
  }
  if (method === 'POST' && url === '/api/v1/auth/logout') {
    return authMocks.logout();
  }

  throw new Error(`Нет мока для ${method} ${url}`);
}
