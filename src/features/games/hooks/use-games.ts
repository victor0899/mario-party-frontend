import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { gameApi } from '../services/game.api';
import type {
  Game,
  Map,
  CreateGameRequest,
  VoteGameRequest
} from '../types/game.types';

export default function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [pendingGames, setPendingGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapsLoading, setMapsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [voting, setVoting] = useState(false);


  const fetchMaps = useCallback(async (activeOnly = true) => {
    setMapsLoading(true);
    try {
      const response = activeOnly
        ? await gameApi.getActiveMaps()
        : await gameApi.getMaps();

      setMaps(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los mapas';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setMapsLoading(false);
    }
  }, []);


  const fetchGroupGames = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      const response = await gameApi.getGroupGames(groupId);
      setGames(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los juegos del grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchGame = useCallback(async (gameId: string) => {
    setLoading(true);
    try {
      const response = await gameApi.getGame(gameId);
      setSelectedGame(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar el juego';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);


  const createGame = useCallback(async (gameData: CreateGameRequest) => {
    setCreating(true);
    try {
      const response = await gameApi.createGame(gameData);
      const newGame = response.data;


      setGames(prev => [newGame, ...prev]);

      toast.success('Juego creado exitosamente. Esperando aprobación de otros jugadores.');
      return { success: true, data: newGame };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear el juego';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCreating(false);
    }
  }, []);


  const voteGame = useCallback(async (voteData: VoteGameRequest) => {
    setVoting(true);
    try {
      await gameApi.voteGame(voteData);


      const updateGameStatus = (game: Game) => {
        if (game.id === voteData.game_id) {


          return { ...game, status: 'pending' as const };
        }
        return game;
      };

      setGames(prev => prev.map(updateGameStatus));
      setPendingGames(prev => prev.map(updateGameStatus));

      const voteText = voteData.vote === 'approve' ? 'aprobado' : 'rechazado';
      toast.success(`Has ${voteText} el juego`);

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al votar el juego';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setVoting(false);
    }
  }, []);


  const fetchPendingGames = useCallback(async () => {
    setLoading(true);
    try {
      const response = await gameApi.getPendingGames();
      setPendingGames(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los juegos pendientes';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);


  const deleteGame = useCallback(async (gameId: string) => {
    setLoading(true);
    try {
      await gameApi.deleteGame(gameId);


      setGames(prev => prev.filter(game => game.id !== gameId));
      setPendingGames(prev => prev.filter(game => game.id !== gameId));

      if (selectedGame?.id === gameId) {
        setSelectedGame(null);
      }

      toast.success('Juego eliminado exitosamente');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el juego';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedGame]);


  const fetchRecentGames = useCallback(async (limit = 10) => {
    setLoading(true);
    try {
      const response = await gameApi.getRecentGames(limit);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar juegos recientes';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);


  const batchApproveGames = useCallback(async (gameIds: string[]) => {
    setLoading(true);
    try {
      await gameApi.batchApprove(gameIds);


      const updateApprovedGames = (game: Game) => {
        if (gameIds.includes(game.id)) {
          return { ...game, status: 'approved' as const };
        }
        return game;
      };

      setGames(prev => prev.map(updateApprovedGames));
      setPendingGames(prev => prev.filter(game => !gameIds.includes(game.id)));

      toast.success(`${gameIds.length} juego(s) aprobado(s) exitosamente`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al aprobar los juegos';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);


  const getMapById = useCallback((mapId: string): Map | undefined => {
    return maps.find(map => map.id === mapId);
  }, [maps]);


  useEffect(() => {
    fetchMaps();
  }, [fetchMaps]);

  return {

    games,
    maps,
    selectedGame,
    pendingGames,
    loading,
    mapsLoading,
    creating,
    voting,


    fetchMaps,
    fetchGroupGames,
    fetchGame,
    createGame,
    voteGame,
    fetchPendingGames,
    deleteGame,
    fetchRecentGames,
    batchApproveGames,
    setSelectedGame,


    getMapById,


    gamesCount: games.length,
    pendingGamesCount: pendingGames.length,
    approvedGames: games.filter(game => game.status === 'approved'),
    rejectedGames: games.filter(game => game.status === 'rejected'),
    hasGames: games.length > 0,
    hasPendingGames: pendingGames.length > 0,
  };
}