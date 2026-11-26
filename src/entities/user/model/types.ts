import type {
  AuthResponse as GeneratedAuthResponse,
  UserProfile as GeneratedUserProfile,
  LoginRequest,
  RegisterBuyerRequest,
  RegisterSellerRequest,
  UserProfileRole,
} from '@/shared/api/generated/auth';

export type UserRole = UserProfileRole;

/** Профиль из Auth Service, тип приходит из сгенерированного OpenAPI-клиента. */
export type UserProfile = GeneratedUserProfile;

/** UI-код использует короткое имя User. */
export type User = GeneratedUserProfile;

export type LoginCredentials = LoginRequest;

export type RegisterBuyerData = RegisterBuyerRequest;

export type RegisterSellerData = RegisterSellerRequest;

export type AuthResponse = GeneratedAuthResponse;

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
}
