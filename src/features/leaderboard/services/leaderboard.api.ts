import { apiClient } from '@/shared/services/client';
import type {
  LeaderboardEntry,
  LeaderboardRequest,
  LeaderboardResponse
} from '../types/leaderboard.types';

// API Response wrapper
export interface IApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

// Leaderboard API services
export const leaderboardApi = {
  // Get group leaderboard
  getGroupLeaderboard: async (groupId: string, params?: LeaderboardRequest): Promise<IApiResponse<LeaderboardResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/group/${groupId}${query}`);
  },

  // Get global leaderboard
  getGlobalLeaderboard: async (params?: LeaderboardRequest): Promise<IApiResponse<LeaderboardResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/global${query}`);
  },

  // Get user's leaderboard position in group
  getUserGroupPosition: async (groupId: string, userId: string): Promise<IApiResponse<{ position: number; entry: LeaderboardEntry }>> => {
    return apiClient.get<IApiResponse<{ position: number; entry: LeaderboardEntry }>>(`/leaderboard/group/${groupId}/user/${userId}/position`);
  },

  // Get user's global leaderboard position
  getUserGlobalPosition: async (userId: string): Promise<IApiResponse<{ position: number; entry: LeaderboardEntry }>> => {
    return apiClient.get<IApiResponse<{ position: number; entry: LeaderboardEntry }>>(`/leaderboard/global/user/${userId}/position`);
  },

  // Get top performers in specific categories
  getTopPerformers: async (groupId: string, category: string, limit: number = 5): Promise<IApiResponse<LeaderboardEntry[]>> => {
    return apiClient.get<IApiResponse<LeaderboardEntry[]>>(`/leaderboard/group/${groupId}/top/${category}?limit=${limit}`);
  },

  // Get leaderboard stats summary
  getLeaderboardStats: async (groupId: string): Promise<IApiResponse<any>> => {
    return apiClient.get<IApiResponse<any>>(`/leaderboard/group/${groupId}/stats`);
  },

  // Get user's detailed statistics
  getUserStats: async (groupId: string, userId: string): Promise<IApiResponse<LeaderboardEntry>> => {
    return apiClient.get<IApiResponse<LeaderboardEntry>>(`/leaderboard/group/${groupId}/user/${userId}/stats`);
  },

  // Get monthly leaderboard
  getMonthlyLeaderboard: async (groupId: string, year: number, month: number): Promise<IApiResponse<LeaderboardResponse>> => {
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/group/${groupId}/monthly/${year}/${month}`);
  },

  // Get seasonal rankings
  getSeasonalRankings: async (groupId: string, season: string): Promise<IApiResponse<LeaderboardResponse>> => {
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/group/${groupId}/season/${season}`);
  }
};

// Named exports for individual functions
export const {
  getGroupLeaderboard,
  getGlobalLeaderboard,
  getUserGroupPosition,
  getUserGlobalPosition,
  getTopPerformers,
  getLeaderboardStats,
  getUserStats,
  getMonthlyLeaderboard,
  getSeasonalRankings
} = leaderboardApi;