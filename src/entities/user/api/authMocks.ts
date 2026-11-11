import { AuthResponse, LoginCredentials, RegisterBuyerData, User } from '../model/types';

let mockCurrentUser: User | null = {
  id: '1',
  email: 'buyer@t-market.ru',
  name: 'Иван Покупатель',
  roles: ['ROLE_BUYER'],
  buyerId: 'buyer-uuid-1',
  bonusBalance: 15000,
};

export const authMocks = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const user: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0] || 'Пользователь',
      roles: ['ROLE_BUYER'],
      buyerId: 'buyer-uuid-1',
      bonusBalance: 15000,
    };
    mockCurrentUser = user;
    return {
      accessToken: `mock_jwt_token_${Date.now()}`,
      user,
    };
  },

  registerBuyer: async (data: RegisterBuyerData): Promise<AuthResponse> => {
    const user: User = {
      id: `buyer-${Date.now()}`,
      email: data.email,
      name: data.fullName,
      roles: ['ROLE_BUYER'],
      buyerId: `buyer-uuid-${Date.now()}`,
      phone: data.phone,
      bonusBalance: 500,
    };
    mockCurrentUser = user;
    return {
      accessToken: `mock_jwt_token_${Date.now()}`,
      user,
    };
  },

  getProfile: async (): Promise<User> => {
    if (!mockCurrentUser) {
      throw new Error('Mock user session not initialized');
    }
    return mockCurrentUser;
  },

  logout: async (): Promise<void> => {
    mockCurrentUser = null;
  },
};
