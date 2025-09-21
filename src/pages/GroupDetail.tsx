import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, GameApprovalModal } from '../shared/components';
import { supabaseAPI } from '../shared/services/supabase';
import { useAuthStore } from '../app/store/useAuthStore';
import type { Group, Game, LeaderboardEntry, GroupMember } from '../shared/types/api';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCPU, setShowAddCPU] = useState(false);
  const [cpuName, setCpuName] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Function to get character image from character ID
  const getCharacterImage = (characterId: string) => {
    const characterMap: { [key: string]: string } = {
      'mario': '/images/characters/SMP_Icon_Mario.webp',
      'luigi': '/images/characters/SMP_Icon_Luigi.webp',
      'peach': '/images/characters/SMP_Icon_Peach.webp',
      'bowser': '/images/characters/SMP_Icon_Bowser.webp',
      'yoshi': '/images/characters/SMPJ_Icon_Yoshi.webp',
      'toad': '/images/characters/SMPJ_Icon_Toad.webp',
      'wario': '/images/characters/SMP_Icon_Wario.webp',
      'waluigi': '/images/characters/SMP_Icon_Waluigi.webp',
      'rosalina': '/images/characters/SMP_Icon_Rosalina.webp',
      'bowser-jr': '/images/characters/SMP_Icon_Jr.webp',
      'toadette': '/images/characters/SMPJ_Icon_Toadette.webp',
      'daisy': '/images/characters/MPS_Daisy_icon.webp',
      'shy-guy': '/images/characters/SMP_Icon_Shy_Guy.webp',
      'koopa': '/images/characters/SMP_Icon_Koopa.webp',
      'goomba': '/images/characters/SMP_Icon_Goomba.webp',
      'boo': '/images/characters/SMP_Icon_Boo.webp',
      'dk': '/images/characters/SMP_Icon_DK.webp',
      'birdo': '/images/characters/MPS_Birdo_icon.webp',
      'pauline': '/images/characters/SMPJ_Icon_Pauline.webp',
      'ninji': '/images/characters/SMPJ_Icon_Ninji.webp',
      'spike': '/images/characters/SMPJ_Icon_Spike.webp',
      'monty-mole': '/images/characters/SMP_Icon_Monty_Mole.webp'
    };

    return characterMap[characterId] || '/images/characters/SMP_Icon_Mario.webp';
  };

  // Calculate leaderboard from approved games
  const calculateLeaderboard = (members: GroupMember[], games: Game[]): LeaderboardEntry[] => {
    const playerStats: { [playerId: string]: LeaderboardEntry } = {};

    // Initialize stats for all members
    members.forEach(member => {
      playerStats[member.id] = {
        player_id: member.id,
        player_name: member.is_cpu ? member.cpu_name! : (member.profile?.nickname || 'Usuario sin nombre'),
        is_cpu: member.is_cpu,
        profile_picture: member.is_cpu ? undefined : member.profile?.profile_picture || undefined,
        total_league_points: 0,
        games_won: 0,
        games_played: 0,
        total_stars: 0,
        total_coins: 0,
        total_minigames_won: 0,
        total_showdown_wins: 0,
        total_items_bought: 0,
        total_items_used: 0,
        total_spaces_traveled: 0,
        total_reactions_used: 0,
        total_blue_spaces: 0,
        total_red_spaces: 0,
        total_lucky_spaces: 0,
        total_unlucky_spaces: 0,
        total_item_spaces: 0,
        total_bowser_spaces: 0,
        total_event_spaces: 0,
        total_vs_spaces: 0,
      };
    });

    // Process each approved game
    games.forEach(game => {
      if (game.results) {
        game.results.forEach(result => {
          const stats = playerStats[result.player_id];
          if (stats) {
            // Add league points based on position (4-3-2-1)
            const points = 5 - result.position; // 1st=4pts, 2nd=3pts, 3rd=2pts, 4th=1pt
            stats.total_league_points += points;

            // Count wins (1st place)
            if (result.position === 1) {
              stats.games_won += 1;
            }

            // Count games played
            stats.games_played += 1;

            // Add individual stats
            stats.total_stars += result.stars;
            stats.total_coins += result.coins;
            stats.total_minigames_won += result.minigames_won;
            stats.total_showdown_wins += result.showdown_wins;
            stats.total_items_bought += result.items_bought || 0;
            stats.total_items_used += result.items_used || 0;
            stats.total_spaces_traveled += result.spaces_traveled || 0;
            stats.total_reactions_used += result.reactions_used || 0;
            stats.total_blue_spaces += result.blue_spaces || 0;
            stats.total_red_spaces += result.red_spaces || 0;
            stats.total_lucky_spaces += result.lucky_spaces || 0;
            stats.total_unlucky_spaces += result.unlucky_spaces || 0;
            stats.total_item_spaces += result.item_spaces || 0;
            stats.total_bowser_spaces += result.bowser_spaces || 0;
            stats.total_event_spaces += result.event_spaces || 0;
            stats.total_vs_spaces += result.vs_spaces || 0;
          }
        });
      }
    });

    // Convert to array and sort by league points (with tiebreakers)
    const leaderboard = Object.values(playerStats)
      .filter(stats => stats.games_played > 0) // Only include players who have played
      .sort((a, b) => {
        // Primary: League points
        if (a.total_league_points !== b.total_league_points) {
          return b.total_league_points - a.total_league_points;
        }
        // Tiebreaker 1: Total stars
        if (a.total_stars !== b.total_stars) {
          return b.total_stars - a.total_stars;
        }
        // Tiebreaker 2: Total coins
        if (a.total_coins !== b.total_coins) {
          return b.total_coins - a.total_coins;
        }
        // Tiebreaker 3: Minigames won
        if (a.total_minigames_won !== b.total_minigames_won) {
          return b.total_minigames_won - a.total_minigames_won;
        }
        // Tiebreaker 4: Showdown wins
        return b.total_showdown_wins - a.total_showdown_wins;
      });

    return leaderboard;
  };

  // Helper function to check if game was auto-approved (only 1 human player)
  const isAutoApproved = (game: Game): boolean => {
    if (!group || game.status !== 'approved') return false;
    const humanMembers = group.members.filter(m => !m.is_cpu && m.status === 'active');
    return humanMembers.length === 1;
  };

  useEffect(() => {
    if (id) {
      loadGroup();
    }
  }, [id]);

  const loadGroup = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const groupData = await supabaseAPI.getGroup(id);
      setGroup(groupData);

      // Calculate leaderboard from approved games
      const allGames = await supabaseAPI.getGroupGames(id);
      console.log('All games found:', allGames.length, allGames);

      const approvedGames = await supabaseAPI.getGroupGames(id, 'approved');
      console.log('Approved games found:', approvedGames.length, approvedGames);
      const leaderboardData = calculateLeaderboard(groupData.members, approvedGames);
      console.log('Leaderboard data:', leaderboardData);
      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error('Error al cargar grupo:', error);
      alert('Error al cargar el grupo');
      navigate('/groups');
    } finally {
      setIsLoading(false);
    }
  };

  const addCPUMember = async () => {
    if (!id || !cpuName.trim()) return;

    try {
      await supabaseAPI.addCPUMember({
        group_id: id,
        cpu_name: cpuName.trim(),
        cpu_avatar: '🤖',
      });

      alert(`CPU "${cpuName}" agregado exitosamente`);
      setCpuName('');
      setShowAddCPU(false);
      loadGroup(); // Reload group data
    } catch (error: any) {
      console.error('Error al agregar CPU:', error);
      alert('Error al agregar CPU: ' + (error.message || 'Error desconocido'));
    }
  };

  const copyInviteCode = () => {
    if (group) {
      navigator.clipboard.writeText(group.invite_code);
      alert(`Código de invitación copiado: ${group.invite_code}`);
    }
  };

  const copyInviteLink = () => {
    if (group) {
      const inviteLink = `${window.location.origin}/groups/join/${group.invite_code}`;
      navigator.clipboard.writeText(inviteLink);
      alert('Enlace de invitación copiado al portapapeles');
    }
  };

  const handleGameClick = async (game: Game) => {
    if (game.status !== 'pending') return;

    // Load full game data with results and approvals
    try {
      const fullGame = await supabaseAPI.getGameDetails(game.id);
      setSelectedGame(fullGame);
      setShowApprovalModal(true);
    } catch (error) {
      console.error('Error al cargar detalles del juego:', error);
      alert('Error al cargar los detalles de la partida');
    }
  };

  const handleModalClose = () => {
    setShowApprovalModal(false);
    setSelectedGame(null);
  };

  const handleVoteSubmitted = () => {
    // Reload group data to get updated game statuses
    // Add small delay to ensure database has been updated
    setTimeout(() => {
      loadGroup();
    }, 500);
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
            <div className="text-gray-500">Cargando grupo...</div>
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
            <Link to="/groups">
              <Button variant="primary">Volver a Mis Grupos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isGroupFull = (group.members?.length || 0) >= group.max_members;
  const humanMembers = group.members?.filter(m => !m.is_cpu) || [];
  const cpuMembers = group.members?.filter(m => m.is_cpu) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600 text-sm">{group.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {group.members?.length || 0}/{group.max_members} miembros
            </span>
            <Link to="/groups" className="text-gray-600 hover:text-gray-800">
              ← Mis Grupos
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Members & Invitations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Members */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Miembros ({group.members?.length || 0}/{group.max_members})
              </h2>

              <div className="space-y-3">
                {/* Human Members */}
                {humanMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                      {member.profile?.profile_picture ? (
                        <img
                          src={getCharacterImage(member.profile.profile_picture)}
                          alt={member.profile.nickname || 'Usuario'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {member.user_id === user.id ? 'Tú' : (member.profile?.nickname || 'Usuario sin nombre')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.user_id === group.creator_id && '👑 Creador'}
                      </div>
                    </div>
                  </div>
                ))}

                {/* CPU Members */}
                {cpuMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                      🤖
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{member.cpu_name}</div>
                      <div className="text-sm text-purple-600">CPU Player</div>
                    </div>
                  </div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: group.max_members - (group.members?.length || 0) }).map((_, index) => (
                  <div key={`empty-${index}`} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                      ?
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-500">Slot disponible</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add CPU Button */}
              {!isGroupFull && (
                <div className="mt-4">
                  {!showAddCPU ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowAddCPU(true)}
                    >
                      🤖 Agregar CPU
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={cpuName}
                        onChange={(e) => setCpuName(e.target.value)}
                        placeholder="Nombre del CPU (ej: Mario CPU)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={20}
                      />
                      <div className="flex space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={addCPUMember}
                          disabled={!cpuName.trim()}
                          className="flex-1"
                        >
                          Agregar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setShowAddCPU(false);
                            setCpuName('');
                          }}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Invitation */}
            {!isGroupFull && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Invitar Jugadores
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Invitación
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-lg font-mono bg-gray-100 px-3 py-2 rounded border">
                        {group.invite_code}
                      </code>
                      <button
                        onClick={copyInviteCode}
                        className="text-blue-600 hover:text-blue-700 p-2"
                        title="Copiar código"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={copyInviteLink}
                    >
                      📤 Copiar Enlace de Invitación
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      Comparte este enlace con tus amigos para que se unan
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Games & Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                className="h-16 w-full md:w-auto md:px-12"
                onClick={() => navigate(`/games/new?group=${group.id}`)}
                disabled={!isGroupFull}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🎮</div>
                  <div>Nueva Partida</div>
                </div>
              </Button>
            </div>

            {/* Recent Games */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Partidas Recientes
              </h2>

              {!group.games || group.games.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎮</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No hay partidas registradas
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {!isGroupFull
                      ? `Necesitas ${group.max_members - (group.members?.length || 0)} jugador(es) más para empezar a jugar`
                      : 'Registra tu primera partida para empezar la competencia'
                    }
                  </p>
                  {isGroupFull && (
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/games/new?group=${group.id}`)}
                    >
                      Registrar Primera Partida
                    </Button>
                  )}
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {group.games.map((game) => (
                    <div
                      key={game.id}
                      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
                        game.status === 'pending' ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                      }`}
                      onClick={() => game.status === 'pending' && handleGameClick(game)}
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          Partida {game.id?.slice(0, 8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(game.played_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            game.status === 'approved' ? 'bg-green-100 text-green-800' :
                            game.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                          title={isAutoApproved(game) ? 'Auto-aprobada por ser el único jugador humano en el grupo' : ''}
                        >
                          {game.status === 'approved' ?
                            (isAutoApproved(game) ? '🤖 Auto-aprobada' : '✅ Aprobada') :
                           game.status === 'rejected' ? '❌ Rechazada' :
                           '🏆 Pendiente'}
                        </span>
                        {game.status === 'pending' && (
                          <span className="text-xs text-gray-400">
                            Haz clic para votar
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        {leaderboard.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  🏆 Tabla de Posiciones
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jugador
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Puntos
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Victorias
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partidas
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ⭐ Estrellas
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        🪙 Monedas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.player_id} className={`
                        ${index === 0 ? 'bg-yellow-50' : ''}
                        ${index === 1 ? 'bg-gray-50' : ''}
                        ${index === 2 ? 'bg-orange-50' : ''}
                        hover:bg-blue-50 transition-colors
                      `}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' :
                              index === 2 ? 'bg-orange-600' :
                              'bg-blue-500'
                            }`}>
                              {index + 1}
                            </div>
                            {index < 3 && (
                              <span className="ml-2">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-xs overflow-hidden ${
                                entry.is_cpu ? 'bg-purple-500' : 'bg-blue-500'
                              }`}>
                                {entry.is_cpu ? '🤖' : (
                                  entry.profile_picture ? (
                                    <img
                                      src={getCharacterImage(entry.profile_picture)}
                                      alt={entry.player_name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    index + 1
                                  )
                                )}
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {entry.player_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {entry.is_cpu ? 'CPU Player' : 'Jugador'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {entry.total_league_points}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {entry.games_won}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {entry.games_played}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {entry.total_stars}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {entry.total_coins}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Stats */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {leaderboard.length}
                    </div>
                    <div className="text-xs text-gray-600">Jugadores Activos</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {group?.games?.filter(g => g.status === 'approved').length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Partidas Aprobadas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">
                      {leaderboard.reduce((sum, entry) => sum + entry.total_stars, 0)}
                    </div>
                    <div className="text-xs text-gray-600">Estrellas Totales</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Approval Modal */}
      <GameApprovalModal
        game={selectedGame}
        isOpen={showApprovalModal}
        onClose={handleModalClose}
        onVoteSubmitted={handleVoteSubmitted}
      />
    </div>
  );
}