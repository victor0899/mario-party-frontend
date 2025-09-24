import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { leaderboardApi } from '../services/leaderboard.api';
import {
  LeaderboardEntry,
  LeaderboardRequest,
  LeaderboardResponse
} from '../types/leaderboard.types';

export default function useLeaderboard() {
  const [groupLeaderboard, setGroupLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [userPosition, setUserPosition] = useState<{ position: number; entry: LeaderboardEntry } | null>(null);
  const [userStats, setUserStats] = useState<LeaderboardEntry | null>(null);
  const [topPerformers, setTopPerformers] = useState<Record<string, LeaderboardEntry[]>>({});
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch group leaderboard
  const fetchGroupLeaderboard = useCallback(async (groupId: string, params?: LeaderboardRequest) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getGroupLeaderboard(groupId, params);
      setGroupLeaderboard(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar la tabla de posiciones del grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch global leaderboard
  const fetchGlobalLeaderboard = useCallback(async (params?: LeaderboardRequest) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getGlobalLeaderboard(params);
      setGlobalLeaderboard(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar la tabla de posiciones global';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's position in group
  const fetchUserGroupPosition = useCallback(async (groupId: string, userId: string) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getUserGroupPosition(groupId, userId);
      setUserPosition(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener la posición del usuario';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's global position
  const fetchUserGlobalPosition = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getUserGlobalPosition(userId);
      setUserPosition(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener la posición global del usuario';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get top performers in specific categories
  const fetchTopPerformers = useCallback(async (groupId: string, category: string, limit = 5) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getTopPerformers(groupId, category, limit);
      setTopPerformers(prev => ({
        ...prev,
        [category]: response.data
      }));
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Error al cargar los mejores en ${category}`;
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's detailed statistics
  const fetchUserStats = useCallback(async (groupId: string, userId: string) => {
    setStatsLoading(true);
    try {
      const response = await leaderboardApi.getUserStats(groupId, userId);
      setUserStats(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar las estadísticas del usuario';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Get monthly leaderboard
  const fetchMonthlyLeaderboard = useCallback(async (groupId: string, year: number, month: number) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getMonthlyLeaderboard(groupId, year, month);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar la tabla mensual';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get seasonal rankings
  const fetchSeasonalRankings = useCallback(async (groupId: string, season: string) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getSeasonalRankings(groupId, season);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar las clasificaciones de temporada';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get leaderboard stats summary
  const fetchLeaderboardStats = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      const response = await leaderboardApi.getLeaderboardStats(groupId);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar las estadísticas del grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility functions
  const getPlayerRank = useCallback((playerId: string): number | null => {
    if (!groupLeaderboard) return null;

    const playerIndex = groupLeaderboard.entries.findIndex(
      entry => entry.player_id === playerId
    );

    return playerIndex >= 0 ? playerIndex + 1 : null;
  }, [groupLeaderboard]);

  const getTopPlayer = useCallback((): LeaderboardEntry | null => {
    return groupLeaderboard?.entries[0] || null;
  }, [groupLeaderboard]);

  const calculateWinRate = useCallback((entry: LeaderboardEntry): number => {
    if (entry.games_played === 0) return 0;
    return (entry.games_won / entry.games_played) * 100;
  }, []);

  const getPlayersByCategory = useCallback((category: keyof LeaderboardEntry) => {
    if (!groupLeaderboard) return [];

    return [...groupLeaderboard.entries].sort((a, b) => {
      const aValue = a[category] as number;
      const bValue = b[category] as number;
      return bValue - aValue;
    });
  }, [groupLeaderboard]);

  return {
    // State
    groupLeaderboard,
    globalLeaderboard,
    userPosition,
    userStats,
    topPerformers,
    loading,
    statsLoading,

    // Actions
    fetchGroupLeaderboard,
    fetchGlobalLeaderboard,
    fetchUserGroupPosition,
    fetchUserGlobalPosition,
    fetchTopPerformers,
    fetchUserStats,
    fetchMonthlyLeaderboard,
    fetchSeasonalRankings,
    fetchLeaderboardStats,

    // Utilities
    getPlayerRank,
    getTopPlayer,
    calculateWinRate,
    getPlayersByCategory,

    // Computed values
    hasGroupLeaderboard: !!groupLeaderboard,
    hasGlobalLeaderboard: !!globalLeaderboard,
    groupPlayersCount: groupLeaderboard?.entries.length || 0,
    globalPlayersCount: globalLeaderboard?.entries.length || 0,
    userRank: userPosition?.position || null,
    topPlayer: getTopPlayer(),
  };
}