import { apiClient } from '@/shared/services/client';
import type {
  Game,
  GameResult,
  Map,
  CreateGameRequest,
  VoteGameRequest
} from '../types/game.types';


export interface IApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}


export const gameApi = {

  getMaps: async (): Promise<IApiResponse<Map[]>> => {
    return apiClient.get<IApiResponse<Map[]>>('/games/maps');
  },


  getActiveMaps: async (): Promise<IApiResponse<Map[]>> => {
    return apiClient.get<IApiResponse<Map[]>>('/games/maps?active=true');
  },


  getGroupGames: async (groupId: string): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>(`/games/group/${groupId}`);
  },


  getGame: async (gameId: string): Promise<IApiResponse<Game>> => {
    return apiClient.get<IApiResponse<Game>>(`/games/${gameId}`);
  },


  createGame: async (gameData: CreateGameRequest): Promise<IApiResponse<Game>> => {
    return apiClient.post<IApiResponse<Game>>('/games', gameData);
  },


  voteGame: async (voteData: VoteGameRequest): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/games/vote', voteData);
  },


  updateGameResults: async (gameId: string, results: GameResult[]): Promise<IApiResponse<Game>> => {
    return apiClient.put<IApiResponse<Game>>(`/games/${gameId}/results`, { results });
  },


  deleteGame: async (gameId: string): Promise<IApiResponse<void>> => {
    return apiClient.delete<IApiResponse<void>>(`/games/${gameId}`);
  },


  getPendingGames: async (): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>('/games/pending');
  },


  getUserGameHistory: async (userId: string): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>(`/games/user/${userId}/history`);
  },


  getGameStats: async (gameId: string): Promise<IApiResponse<any>> => {
    return apiClient.get<IApiResponse<any>>(`/games/${gameId}/stats`);
  },


  batchApprove: async (gameIds: string[]): Promise<IApiResponse<void>> => {
    return apiClient.post<IApiResponse<void>>('/games/batch-approve', { gameIds });
  },


  getRecentGames: async (limit: number = 10): Promise<IApiResponse<Game[]>> => {
    return apiClient.get<IApiResponse<Game[]>>(`/games/recent?limit=${limit}`);
  }
};


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