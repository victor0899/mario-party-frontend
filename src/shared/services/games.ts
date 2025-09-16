import { apiClient } from './client';
import type { Game, CreateGameRequest, CreateScoreRequest, Score, LeaderboardEntry } from '../types/api';

export const gameApi = {
  create: (data: CreateGameRequest) => apiClient.post<Game>('/games', data),
  getById: (id: string) => apiClient.get<Game>(`/games/${id}`),
  addScore: (data: CreateScoreRequest) => apiClient.post<Score>('/scores', data),
  getLeaderboard: (groupId: string) => 
    apiClient.get<LeaderboardEntry[]>(`/groups/${groupId}/leaderboard`),
};