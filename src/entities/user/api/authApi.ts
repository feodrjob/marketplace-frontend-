import {
  type AuthResponse as GeneratedAuthResponse,
  type UserProfile as GeneratedUserProfile,
  getAuthService,
} from '@/shared/api/generated/auth';
import { ENV } from '@/shared/config';
import type { AuthResponse, LoginCredentials, RegisterBuyerData, User } from '../model/types';

const auth = getAuthService();

function toUser(user: GeneratedUserProfile): User {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName ?? undefined,
    phone: user.phone ?? undefined,
    companyName: user.companyName ?? null,
    inn: user.inn ?? undefined,
    description: user.description ?? undefined,
    department: user.department ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toAuthResponse(data: GeneratedAuthResponse): AuthResponse {
  return {
    accessToken: data.accessToken,
    user: toUser(data.user),
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (ENV.USE_MOCKS) {
      const { authMocks } = await import('./authMocks');
      return authMocks.login(credentials);
    }
    return toAuthResponse(await auth.login(credentials));
  },

  registerBuyer: async (data: RegisterBuyerData): Promise<AuthResponse> => {
    if (ENV.USE_MOCKS) {
      const { authMocks } = await import('./authMocks');
      return authMocks.registerBuyer(data);
    }
    return toAuthResponse(await auth.registerBuyer(data));
  },

  getProfile: async (): Promise<User> => {
    if (ENV.USE_MOCKS) {
      const { authMocks } = await import('./authMocks');
      return authMocks.getProfile();
    }
    return toUser(await auth.getCurrentUser());
  },

  logout: async (): Promise<void> => {
    if (ENV.USE_MOCKS) {
      const { authMocks } = await import('./authMocks');
      return authMocks.logout();
    }
    await auth.logout();
  },
};
