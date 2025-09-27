export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;

  nickname?: string;
  profilePicture?: string;
  birthDate?: string;
  nationality?: string;
  favoriteMinigame?: string;
  bio?: string;
  profileCompleted?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  refreshToken?: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  profilePicture?: string;
  birthDate?: string;
  nationality?: string;
  favoriteMinigame?: string;
  bio?: string;
}