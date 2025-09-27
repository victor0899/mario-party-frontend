import { apiClient } from '@/shared/services/client';
import type {
  LeaderboardEntry,
  LeaderboardRequest,
  LeaderboardResponse
} from '../types/leaderboard.types';


export interface IApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}


export const leaderboardApi = {

  getGroupLeaderboard: async (groupId: string, params?: LeaderboardRequest): Promise<IApiResponse<LeaderboardResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/group/${groupId}${query}`);
  },


  getGlobalLeaderboard: async (params?: LeaderboardRequest): Promise<IApiResponse<LeaderboardResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/global${query}`);
  },


  getUserGroupPosition: async (groupId: string, userId: string): Promise<IApiResponse<{ position: number; entry: LeaderboardEntry }>> => {
    return apiClient.get<IApiResponse<{ position: number; entry: LeaderboardEntry }>>(`/leaderboard/group/${groupId}/user/${userId}/position`);
  },


  getUserGlobalPosition: async (userId: string): Promise<IApiResponse<{ position: number; entry: LeaderboardEntry }>> => {
    return apiClient.get<IApiResponse<{ position: number; entry: LeaderboardEntry }>>(`/leaderboard/global/user/${userId}/position`);
  },


  getTopPerformers: async (groupId: string, category: string, limit: number = 5): Promise<IApiResponse<LeaderboardEntry[]>> => {
    return apiClient.get<IApiResponse<LeaderboardEntry[]>>(`/leaderboard/group/${groupId}/top/${category}?limit=${limit}`);
  },


  getLeaderboardStats: async (groupId: string): Promise<IApiResponse<any>> => {
    return apiClient.get<IApiResponse<any>>(`/leaderboard/group/${groupId}/stats`);
  },


  getUserStats: async (groupId: string, userId: string): Promise<IApiResponse<LeaderboardEntry>> => {
    return apiClient.get<IApiResponse<LeaderboardEntry>>(`/leaderboard/group/${groupId}/user/${userId}/stats`);
  },


  getMonthlyLeaderboard: async (groupId: string, year: number, month: number): Promise<IApiResponse<LeaderboardResponse>> => {
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/group/${groupId}/monthly/${year}/${month}`);
  },


  getSeasonalRankings: async (groupId: string, season: string): Promise<IApiResponse<LeaderboardResponse>> => {
    return apiClient.get<IApiResponse<LeaderboardResponse>>(`/leaderboard/group/${groupId}/season/${season}`);
  }
};


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