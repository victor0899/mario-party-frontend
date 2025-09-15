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
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapSelected, setMapSelected] = useState(false);

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

  // Keyboard navigation for map carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return; // Don't interfere with form inputs
      }

      if (mapSelected) {
        return; // Don't allow navigation when map is selected
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateMap('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateMap('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMapIndex, maps.length, mapSelected]);

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

      // Sort maps in the specified order
      const mapOrder = [
        'Mega Wiggler\'s Tree Party',
        'Roll \'em Raceway',
        'Rainbow Galleria',
        'Goomba Lagoon',
        'Western Land',
        'Mario\'s Rainbow Castle',
        'King Bowser\'s Keep'
      ];

      const sortedMaps = [...mapsData].sort((a, b) => {
        const indexA = mapOrder.indexOf(a.name);
        const indexB = mapOrder.indexOf(b.name);

        // If map is not in the order list, put it at the end
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      });

      setMaps(sortedMaps);
      if (sortedMaps.length > 0) {
        setSelectedMapId(sortedMaps[0].id);
        setSelectedMapIndex(0);
      }
    } catch (error: any) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
      navigate('/groups');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get map image URL
  const getMapImageUrl = (mapName: string) => {
    // List of available image files (you can update this as you add more maps)
    const availableImages: { [key: string]: string } = {
      'Goomba Lagoon': 'GoombaLagoon.webp',
      'King Bowser\'s Keep': 'SMPJ_King_Bowser\'s_Keep.webp',
      'Mario\'s Rainbow Castle': 'SMPJ_Mario\'s_Rainbow_Castle.webp',
      'Mega Wiggler\'s Tree Party': 'SMPJ_Mega_Wiggler\'s_Tree_Party.webp',
      'Rainbow Galleria': 'SMPJ_Rainbow_Galleria.webp',
      'Roll \'em Raceway': 'SMPJ_Roll_\'em_Raceway.webp',
      'Western Land': 'SMPJ_Western_Land.webp'
    };

    const filename = availableImages[mapName];
    return filename ? `/images/maps/${filename}` : null;
  };

  // Check if map image exists (with fallback)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageLoading, setImageLoading] = useState<Set<string>>(new Set());

  const handleImageError = (mapId: string) => {
    setImageErrors(prev => new Set(prev).add(mapId));
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(mapId);
      return newSet;
    });
  };

  const handleImageLoad = (mapId: string) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(mapId);
      return newSet;
    });
    setImageLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(mapId);
      return newSet;
    });
  };

  const handleImageLoadStart = (mapId: string) => {
    setImageLoading(prev => new Set(prev).add(mapId));
  };

  // Map carousel navigation functions
  const navigateMap = (direction: 'prev' | 'next') => {
    if (maps.length === 0) return;

    let newIndex = selectedMapIndex;
    if (direction === 'next') {
      newIndex = (selectedMapIndex + 1) % maps.length;
    } else {
      newIndex = selectedMapIndex === 0 ? maps.length - 1 : selectedMapIndex - 1;
    }

    setSelectedMapIndex(newIndex);
    setSelectedMapId(maps[newIndex].id);
    setMapSelected(false); // Reset selection state when navigating
  };

  const selectMapByIndex = (index: number) => {
    if (index >= 0 && index < maps.length) {
      setSelectedMapIndex(index);
      setSelectedMapId(maps[index].id);
      setMapSelected(false); // Reset selection state when changing map
    }
  };

  const handleMapSelection = () => {
    setMapSelected(!mapSelected);
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
    if (!selectedMapId || !mapSelected) {
      alert('Por favor selecciona un mapa usando el botón "Seleccionar este Mapa"');
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

            {/* Date Input - Full width at top */}
            <div className="mb-6">
              <Input
                type="date"
                label="Fecha de la Partida"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Map Selector - Full width below date */}
            <div>
              {/* Map Carousel Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Mapa Jugado
                </label>

                {maps.length > 0 ? (
                  <div className="relative">
                    {/* Main Map Display */}
                    <div className="relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gray-100">
                      {/* Map Image */}
                      {(() => {
                        const currentMap = maps[selectedMapIndex];
                        const imageUrl = getMapImageUrl(currentMap?.name);
                        const hasImageError = imageErrors.has(currentMap?.id);
                        const isLoading = imageLoading.has(currentMap?.id);

                        if (imageUrl && !hasImageError) {
                          return (
                            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                              {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                                  <div className="animate-spin text-2xl">⭐</div>
                                </div>
                              )}
                              <img
                                src={imageUrl}
                                alt={currentMap?.name}
                                className={`w-full h-48 object-cover object-center transition-all duration-500 ${
                                  mapSelected ? 'blur-[1px] brightness-110 contrast-75 saturate-50' : ''
                                }`}
                                loading="lazy"
                                onLoadStart={() => handleImageLoadStart(currentMap?.id)}
                                onError={() => handleImageError(currentMap?.id)}
                                onLoad={() => handleImageLoad(currentMap?.id)}
                                style={{ opacity: isLoading ? 0 : 1 }}
                              />
                              {/* Overlay for text readability */}
                              <div className={`absolute inset-0 transition-all duration-500 ${
                                mapSelected
                                  ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
                                  : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'
                              }`}></div>

                              {/* Selected overlay effect */}
                              {mapSelected && (
                                <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-[0.5px]"></div>
                              )}

                            </div>
                          );
                        } else {
                          // Fallback gradient when no image or image fails to load
                          return (
                            <div className={`h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative transition-all duration-500 ${
                              mapSelected ? 'blur-[1px] brightness-110 contrast-75 saturate-50' : ''
                            }`}>
                              <div className={`absolute inset-0 transition-all duration-500 ${
                                mapSelected ? 'bg-black bg-opacity-40' : 'bg-black bg-opacity-20'
                              }`}></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-6xl opacity-40">🗺️</div>
                              </div>
                              {/* Small indicator that no image is available */}
                              <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                                Sin imagen
                              </div>

                              {/* Selected overlay effect for fallback */}
                              {mapSelected && (
                                <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-[0.5px]"></div>
                              )}
                            </div>
                          );
                        }
                      })()}

                      {/* Map Info Overlay */}
                      <div className="absolute inset-0 flex items-end p-4">
                        <div className="text-white w-full">
                          <div className="text-xl font-bold mb-1 transition-all duration-300 drop-shadow-lg">
                            {maps[selectedMapIndex]?.name}
                          </div>
                          <div className="text-sm opacity-90 mb-2 drop-shadow">
                            {maps[selectedMapIndex]?.game_version}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs bg-white bg-opacity-25 backdrop-blur-sm px-2 py-1 rounded">
                              {selectedMapIndex + 1} de {maps.length}
                            </div>
                            <div className="flex items-center space-x-2">
                              {mapSelected && (
                                <div className="text-xs bg-gray-800 bg-opacity-90 text-white px-3 py-1 rounded font-bold shadow-lg border border-gray-600 backdrop-blur-sm">
                                  ✓ SELECCIONADO
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        type="button"
                        onClick={() => navigateMap('prev')}
                        className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 shadow-md ${
                          mapSelected || maps.length <= 1
                            ? 'bg-gray-200 border-2 border-gray-300 cursor-not-allowed'
                            : 'bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg'
                        }`}
                        disabled={mapSelected || maps.length <= 1}
                        title={mapSelected ? "Deselecciona el mapa para navegar" : "Mapa anterior (← tecla izquierda)"}
                      >
                        <span className={`text-lg font-bold ${mapSelected ? 'text-gray-400' : 'text-blue-600'}`}>‹</span>
                      </button>

                      {/* Map indicators */}
                      <div className="flex space-x-2">
                        {maps.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectMapByIndex(index)}
                            disabled={mapSelected}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                              mapSelected
                                ? 'bg-gray-300 cursor-not-allowed'
                                : index === selectedMapIndex
                                ? 'bg-blue-500 shadow-md transform scale-110'
                                : 'bg-gray-300 hover:bg-gray-400 hover:transform hover:scale-105'
                            }`}
                            title={mapSelected ? "Deselecciona el mapa para navegar" : `${maps[index]?.name}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateMap('next')}
                        className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 shadow-md ${
                          mapSelected || maps.length <= 1
                            ? 'bg-gray-200 border-2 border-gray-300 cursor-not-allowed'
                            : 'bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg'
                        }`}
                        disabled={mapSelected || maps.length <= 1}
                        title={mapSelected ? "Deselecciona el mapa para navegar" : "Siguiente mapa (→ tecla derecha)"}
                      >
                        <span className={`text-lg font-bold ${mapSelected ? 'text-gray-400' : 'text-blue-600'}`}>›</span>
                      </button>
                    </div>

                    {/* Selection Button */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleMapSelection}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                          mapSelected
                            ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                            : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        {mapSelected ? 'Deseleccionar Mapa' : 'Seleccionar este Mapa'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-2xl mb-2">🗺️</div>
                    <div>No hay mapas disponibles</div>
                  </div>
                )}
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