export type UserRole = 'ROLE_BUYER' | 'ROLE_SELLER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  buyerId: string;
  bonusBalance: number;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterBuyerData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  registerBuyer: (data: RegisterBuyerData) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}
