export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

/**
 * Профиль из Auth Service (GET /api/v1/users/me).
 * Повторяет UserProfile из auth.yaml: один аккаунт — одна роль.
 */
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  companyName?: string | null;
  inn?: string;
  description?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

// UI-код использует короткое имя User
export type User = UserProfile;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterBuyerData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
}
