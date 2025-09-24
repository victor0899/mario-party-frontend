// User and authentication related types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;

  // Profile fields
  nickname?: string;
  profilePicture?: string;
  birthDate?: string;
  nationality?: string;
  favoriteMinigame?: string;
  bio?: string;
  profileCompleted?: boolean;
}

// Authentication API request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Legacy types for backward compatibility
export interface CreateUserRequest {
  email: string;
  name: string;
}

// Auth response types
export interface AuthResponse {
  user: User;
  token?: string;
  refreshToken?: string;
}

// Profile update types
export interface UpdateProfileRequest {
  nickname?: string;
  profilePicture?: string;
  birthDate?: string;
  nationality?: string;
  favoriteMinigame?: string;
  bio?: string;
}