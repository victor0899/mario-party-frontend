import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../shared/components';
import { WarioLoader } from '../shared/components/ui';
import { supabaseAPI } from '../shared/services/supabase';
import { useAuthStore } from '../app/store/useAuthStore';
import type { Group, LeaderboardEntry, GroupMember, Game } from '../shared/types/api';


function calculateLeaderboard(members: GroupMember[], games: Game[]): LeaderboardEntry[] {
  const playerStats: { [playerId: string]: LeaderboardEntry } = {};


  members.forEach(member => {
    playerStats[member.id] = {
      player_id: member.id,
      player_name: member.is_cpu ? member.cpu_name! : `Usuario ${member.user_id}`,
      is_cpu: member.is_cpu,
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


  games.forEach(game => {
    if (game.results) {
      game.results.forEach(result => {
        const stats = playerStats[result.player_id];
        if (stats) {

          const points = 5 - result.position;
          stats.total_league_points += points;


          if (result.position === 1) {
            stats.games_won += 1;
          }


          stats.games_played += 1;


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


  const leaderboard = Object.values(playerStats)
    .filter(stats => stats.games_played > 0)
    .sort((a, b) => {

      if (a.total_league_points !== b.total_league_points) {
        return b.total_league_points - a.total_league_points;
      }

      if (a.total_stars !== b.total_stars) {
        return b.total_stars - a.total_stars;
      }

      if (a.total_coins !== b.total_coins) {
        return b.total_coins - a.total_coins;
      }

      if (a.total_minigames_won !== b.total_minigames_won) {
        return b.total_minigames_won - a.total_minigames_won;
      }

      return b.total_showdown_wins - a.total_showdown_wins;
    });

  return leaderboard;
}

export default function Leaderboard() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {

      const groupData = await supabaseAPI.getGroup(id);
      setGroup(groupData);


      const approvedGames = await supabaseAPI.getGroupGames(id, 'approved');


      const leaderboardData = calculateLeaderboard(groupData.members, approvedGames);
      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
      navigate('/groups');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <WarioLoader text="Cargando..." size="md" fullScreen />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <WarioLoader text="Cargando tabla de posiciones..." size="md" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
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

  const approvedGames = group.games?.filter(game => game.status === 'approved') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              📊 Tabla de Posiciones - {group.name}
            </h1>
            <Link to={`/groups/${id}`}>
              <Button variant="secondary">
                ← Volver al Grupo
              </Button>
            </Link>
          </div>
          {approvedGames.length > 0 ? (
            <p className="text-gray-600 mt-2">
              Basado en {approvedGames.length} partida{approvedGames.length !== 1 ? 's' : ''} aprobada{approvedGames.length !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-gray-600 mt-2">
              No hay partidas aprobadas aún
            </p>
          )}
        </div>

        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No hay datos de tabla de posiciones
            </h2>
            <p className="text-gray-600 mb-6">
              Necesitas tener al menos una partida aprobada para ver la tabla de posiciones.
            </p>
            <Link to={`/groups/${id}`}>
              <Button variant="primary">
                Ir al Grupo
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {leaderboard.length >= 3 && (
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  🏆 Podium
                </h2>
                <div className="flex justify-center items-end space-x-8">
                  {/* Second Place */}
                  {leaderboard[1] && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                        2
                      </div>
                      <div className="bg-gray-50 px-4 py-2 rounded-lg border-2 border-gray-300">
                        <div className="font-bold text-gray-800">
                          {leaderboard[1].is_cpu ? leaderboard[1].player_name : `Usuario ${leaderboard[1].player_id}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          🥈 {leaderboard[1].total_league_points} pts
                        </div>
                      </div>
                    </div>
                  )}

                  {/* First Place */}
                  <div className="text-center">
                    <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2">
                      1
                    </div>
                    <div className="bg-yellow-50 px-4 py-2 rounded-lg border-2 border-yellow-300">
                      <div className="font-bold text-gray-800">
                        {leaderboard[0].is_cpu ? leaderboard[0].player_name : `Usuario ${leaderboard[0].player_id}`}
                      </div>
                      <div className="text-sm text-yellow-600">
                        👑 {leaderboard[0].total_league_points} pts
                      </div>
                    </div>
                  </div>

                  {/* Third Place */}
                  {leaderboard[2] && (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                        3
                      </div>
                      <div className="bg-orange-50 px-4 py-2 rounded-lg border-2 border-orange-300">
                        <div className="font-bold text-gray-800">
                          {leaderboard[2].is_cpu ? leaderboard[2].player_name : `Usuario ${leaderboard[2].player_id}`}
                        </div>
                        <div className="text-sm text-orange-600">
                          🥉 {leaderboard[2].total_league_points} pts
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  Clasificación General
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posición
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jugador
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Puntos Liga
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Victorias
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partidas
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center space-x-1">
                          <img src="/images/others/MPS_Star.webp" alt="Estrella" className="w-4 h-4" />
                          <span>Estrellas</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center space-x-1">
                          <img src="/images/others/NSMBDS_Coin_Artwork.webp" alt="Moneda" className="w-4 h-4" />
                          <span>Monedas</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        🎮 Minijuegos
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ⚔️ Showdown
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
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                entry.is_cpu ? 'bg-purple-500' : 'bg-blue-500'
                              }`}>
                                {entry.is_cpu ? '🤖' : (index + 1)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {entry.is_cpu ? entry.player_name : `Usuario ${entry.player_id}`}
                              </div>
                              <div className="text-sm text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {entry.total_minigames_won}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {entry.total_showdown_wins}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}