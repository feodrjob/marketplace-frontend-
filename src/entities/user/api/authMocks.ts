import type {
  AuthResponse,
  LoginCredentials,
  RegisterBuyerData,
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
    const user: UserProfile = {
      id: '1',
      email: credentials.email,
      role: 'BUYER',
      fullName: credentials.email.split('@')[0] || 'Покупатель',
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
