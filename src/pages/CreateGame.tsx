import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input } from '../components';
import { supabaseAPI } from '../api/supabase';
import { useAuthStore } from '../store/useAuthStore';
import type { Group, Map, CreateGameResultRequest } from '../types/api';

interface PlayerResult extends CreateGameResultRequest {
  playerId: string;
  playerName: string;
  calculatedPosition: number;
}

export default function CreateGame() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [group, setGroup] = useState<Group | null>(null);
  const [maps, setMaps] = useState<Map[]>([]);
  const [selectedMapId, setSelectedMapId] = useState('');
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize player results with all members
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([]);

  useEffect(() => {
    loadInitialData();
  }, [groupId]);

  useEffect(() => {
    if (group?.members) {
      initializePlayerResults();
    }
  }, [group]);

  const loadInitialData = async () => {
    if (!groupId) {
      alert('ID de grupo requerido');
      navigate('/groups');
      return;
    }

    setIsLoading(true);
    try {
      const [groupData, mapsData] = await Promise.all([
        supabaseAPI.getGroup(groupId),
        supabaseAPI.getMaps()
      ]);

      setGroup(groupData);
      setMaps(mapsData);
      if (mapsData.length > 0) {
        setSelectedMapId(mapsData[0].id);
      }
    } catch (error: any) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
      navigate('/groups');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePositions = (results: PlayerResult[]): PlayerResult[] => {
    // Sort players by Mario Party rules (stars first, then tiebreakers)
    const sorted = [...results].sort((a, b) => {
      // 1. Stars (higher is better)
      if (a.stars !== b.stars) return b.stars - a.stars;

      // 2. Coins (higher is better)
      if (a.coins !== b.coins) return b.coins - a.coins;

      // 3. Minigames won (higher is better)
      if (a.minigames_won !== b.minigames_won) return b.minigames_won - a.minigames_won;

      // 4. Showdown wins (higher is better)
      if (a.showdown_wins !== b.showdown_wins) return b.showdown_wins - a.showdown_wins;

      // If everything is tied, maintain original order
      return 0;
    });

    // Assign positions based on sort order
    return results.map(player => {
      const sortedIndex = sorted.findIndex(p => p.playerId === player.playerId);
      return {
        ...player,
        position: sortedIndex + 1,
        calculatedPosition: sortedIndex + 1,
      };
    });
  };

  const initializePlayerResults = () => {
    if (!group?.members) return;

    const activeMembers = group.members.filter(m => m.status === 'active');
    const results: PlayerResult[] = activeMembers.map((member) => ({
      player_id: member.id,
      playerId: member.id,
      playerName: member.is_cpu ? member.cpu_name! : `Usuario ${member.user_id}`,
      position: 1, // Will be calculated automatically
      calculatedPosition: 1,

      // Initialize basic metrics to 0
      stars: 0,
      coins: 0,
      minigames_won: 0,
      showdown_wins: 0,

      // Initialize all other metrics to 0 (for future use)
      items_bought: 0,
      items_used: 0,
      spaces_traveled: 0,
      reactions_used: 0,
      blue_spaces: 0,
      red_spaces: 0,
      lucky_spaces: 0,
      unlucky_spaces: 0,
      item_spaces: 0,
      bowser_spaces: 0,
      event_spaces: 0,
      vs_spaces: 0,
    }));

    setPlayerResults(calculatePositions(results));
  };

  const updatePlayerResult = (playerId: string, field: keyof PlayerResult, value: number) => {
    setPlayerResults(prev => {
      const updated = prev.map(player => {
        if (player.playerId === playerId) {
          return { ...player, [field]: value };
        }
        return player;
      });

      // Recalculate positions after any update
      return calculatePositions(updated);
    });
  };

  const validateForm = (): boolean => {
    if (!selectedMapId) {
      alert('Selecciona un mapa');
      return false;
    }

    if (!playedAt) {
      alert('Selecciona la fecha de la partida');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !group || !user) return;

    setIsSubmitting(true);
    try {
      // Prepare game results data
      const gameResults = playerResults.map(player => ({
        player_id: player.player_id,
        position: player.position,
        stars: player.stars,
        coins: player.coins,
        minigames_won: player.minigames_won,
        showdown_wins: player.showdown_wins,
        items_bought: player.items_bought,
        items_used: player.items_used,
        spaces_traveled: player.spaces_traveled,
        reactions_used: player.reactions_used,
        blue_spaces: player.blue_spaces,
        red_spaces: player.red_spaces,
        lucky_spaces: player.lucky_spaces,
        unlucky_spaces: player.unlucky_spaces,
        item_spaces: player.item_spaces,
        bowser_spaces: player.bowser_spaces,
        event_spaces: player.event_spaces,
        vs_spaces: player.vs_spaces,
      }));

      await supabaseAPI.createGame({
        group_id: group.id,
        map_id: selectedMapId,
        played_at: new Date(playedAt).toISOString(),
        results: gameResults,
      });

      alert('¡Partida registrada exitosamente! Ahora está pendiente de aprobación por otros miembros.');
      navigate(`/groups/${group.id}`);
    } catch (error: any) {
      console.error('Error al registrar partida:', error);
      alert('Error al registrar la partida: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Cargando...</div>
    </div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Grupo no encontrado</h2>
            <Button variant="primary" onClick={() => navigate('/groups')}>
              Volver a Mis Grupos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sortedResults = [...playerResults].sort((a, b) => a.calculatedPosition - b.calculatedPosition);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Registrar Nueva Partida</h1>
            <p className="text-gray-600">{group.name}</p>
          </div>
          <button
            onClick={() => navigate(`/groups/${group.id}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Volver al Grupo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Game Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Información de la Partida</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mapa Jugado
                </label>
                <select
                  value={selectedMapId}
                  onChange={(e) => setSelectedMapId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un mapa</option>
                  {maps.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Input
                  type="date"
                  label="Fecha de la Partida"
                  value={playedAt}
                  onChange={(e) => setPlayedAt(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Player Results */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Resultados por Jugador</h2>

            <div className="space-y-8">
              {sortedResults.map((player) => (
                <div key={player.playerId} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        player.calculatedPosition === 1 ? 'bg-yellow-500' :
                        player.calculatedPosition === 2 ? 'bg-gray-400' :
                        player.calculatedPosition === 3 ? 'bg-orange-600' :
                        'bg-red-500'
                      }`}>
                        {player.calculatedPosition}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{player.playerName}</h3>
                        <p className="text-sm text-gray-500">
                          {player.calculatedPosition === 1 ? '🥇 1er Lugar (4 puntos)' :
                           player.calculatedPosition === 2 ? '🥈 2do Lugar (3 puntos)' :
                           player.calculatedPosition === 3 ? '🥉 3er Lugar (2 puntos)' :
                           '4to Lugar (1 punto)'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500">Posición calculada automáticamente</div>
                      <div className="text-lg font-bold text-gray-800">
                        {player.calculatedPosition === 1 ? '🥇' :
                         player.calculatedPosition === 2 ? '🥈' :
                         player.calculatedPosition === 3 ? '🥉' : '4️⃣'}
                      </div>
                    </div>
                  </div>

                  {/* Basic Metrics Grid - Only first 4 fields */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">⭐ Estrellas</label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={player.stars}
                        onChange={(e) => updatePlayerResult(player.playerId, 'stars', Number(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">🪙 Monedas</label>
                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={player.coins}
                        onChange={(e) => updatePlayerResult(player.playerId, 'coins', Number(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">🎮 Minijuegos</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={player.minigames_won}
                        onChange={(e) => updatePlayerResult(player.playerId, 'minigames_won', Number(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">⚔️ Showdown</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={player.showdown_wins}
                        onChange={(e) => updatePlayerResult(player.playerId, 'showdown_wins', Number(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/groups/${group.id}`)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Partida'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}