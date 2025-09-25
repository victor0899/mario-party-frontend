import { apiClient } from '@/shared/services/client';
import type {
  Game,
  GameResult,
  Map,
  CreateGameRequest,
  VoteGameRequest
} from '../types/game.types';

// API Response wrapper
export interface IApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

// Game API services
export const gameApi = {
  // Get all maps
  getMaps: async (): Promise<IApiResponse<Map[]>> => {
    return apiClient.get<IApiResponse<Map[]>>('/games/maps');
  },

  // Get active maps only
  getActiveMaps: async (): Promise<IApiResponse<Map[]>> => {
    return apiClient.get<IApiResponse<Map[]>>('/games/maps?active=true');
  },

  // Get games for a group
  getGroupGames: async (groupId: string): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>(`/games/group/${groupId}`);
  },

  // Get game by ID
  getGame: async (gameId: string): Promise<IApiResponse<Game>> => {
    return apiClient.get<IApiResponse<Game>>(`/games/${gameId}`);
  },

  // Create new game
  createGame: async (gameData: CreateGameRequest): Promise<IApiResponse<Game>> => {
    return apiClient.post<IApiResponse<Game>>('/games', gameData);
  },

  // Vote on a game
  voteGame: async (voteData: VoteGameRequest): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/games/vote', voteData);
  },

  // Update game results
  updateGameResults: async (gameId: string, results: GameResult[]): Promise<IApiResponse<Game>> => {
    return apiClient.put<IApiResponse<Game>>(`/games/${gameId}/results`, { results });
  },

  // Delete game
  deleteGame: async (gameId: string): Promise<IApiResponse<void>> => {
    return apiClient.delete<IApiResponse<void>>(`/games/${gameId}`);
  },

  // Get pending games for user
  getPendingGames: async (): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>('/games/pending');
  },

  // Get user's game history
  getUserGameHistory: async (userId: string): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>(`/games/user/${userId}/history`);
  },

  // Get game statistics
  getGameStats: async (gameId: string): Promise<IApiResponse<any>> => {
    return apiClient.get<IApiResponse<any>>(`/games/${gameId}/stats`);
  },

  // Approve all games in a batch
  batchApprove: async (gameIds: string[]): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/games/batch-approve', { gameIds });
  },

  // Get recent games
  getRecentGames: async (limit: number = 10): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>(`/games/recent?limit=${limit}`);
  }
};

// Named exports for individual functions
export const {
  getMaps,
  getActiveMaps,
  getGroupGames,
  getGame,
  createGame,
  voteGame,
  updateGameResults,
  deleteGame,
  getPendingGames,
  getUserGameHistory,
  getGameStats,
  batchApprove,
  getRecentGames
} = gameApi;