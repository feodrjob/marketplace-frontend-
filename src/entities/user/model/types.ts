export type UserRole = 'ROLE_BUYER' | 'ROLE_SELLER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  buyerId: string;
  sellerId?: string;
  bonusBalance: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}
