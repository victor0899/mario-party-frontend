import { apiClient } from './client';
import type { User, CreateUserRequest } from '../types/api';

export const userApi = {
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
  create: (data: CreateUserRequest) => apiClient.post<User>('/users', data),
};