import { apiClient } from '@/shared/services/client';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UpdateProfileRequest
} from '../types/auth.types';

// API Response wrapper
export interface IApiResponse<T = unknown> {
  status: string;
  message: string;
  data: T;
}

// Authentication API services
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<IApiResponse<AuthResponse>> => {
    return apiClient.post<IApiResponse<AuthResponse>>('/auth/login', credentials);
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<IApiResponse<AuthResponse>> => {
    return apiClient.post<IApiResponse<AuthResponse>>('/auth/register', userData);
  },

  // Get current user profile
  getProfile: async (): Promise<IApiResponse<User>> => {
    return apiClient.get<IApiResponse<User>>('/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileRequest): Promise<IApiResponse<User>> => {
    return apiClient.put<IApiResponse<User>>('/auth/profile', profileData);
  },

  // Refresh auth token
  refreshToken: async (refreshToken: string): Promise<IApiResponse<AuthResponse>> => {
    return apiClient.post<IApiResponse<AuthResponse>>('/auth/refresh', { refreshToken });
  },

  // Logout user
  logout: async (): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/auth/logout');
  },

  // Verify email
  verifyEmail: async (token: string): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/auth/verify-email', { token });
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/auth/reset-password', { token, password });
  }
};

// Named exports for individual functions
export const {
  login,
  register,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} = authApi;