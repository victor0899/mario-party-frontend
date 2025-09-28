import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../app/store/useAuthStore';
import { useGroupsStore } from '../app/store/useGroupsStore';
import { WarioLoader, MemberAvatars } from '../shared/components/ui';

export default function Dashboard() {
  const { session, user } = useAuthStore();
  const { groups, isLoading, error, loadGroups } = useGroupsStore();
  const navigate = useNavigate();

  const isAuthenticated = !!session && !!user;

  const getLastGameDate = (games: any[]) => {
    if (!games || games.length === 0) return null;
    const sortedGames = games
      .filter(game => game.status === 'approved')
      .sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime());
    return sortedGames.length > 0 ? sortedGames[0].played_at : null;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const gameDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - gameDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      if (diffInHours < 1) return 'hace menos de 1h';
      return `hace ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'hace 1 día';
      if (diffInDays < 7) return `hace ${diffInDays} días`;
      if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} sem`;
      return `hace ${Math.floor(diffInDays / 30)} mes`;
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadGroups();
    }
  }, [isAuthenticated, user, loadGroups]);

  useEffect(() => {
    if (error && error.includes('auth') || error?.includes('JWT') || error?.includes('session')) {
      console.log('🔄 Auth error detected, redirecting to login');
      toast.error('Sesión expirada. Redirigiendo...');
      navigate('/auth');
      return;
    }

    if (error) {
      toast.error('Error al cargar los grupos: ' + error);
    }
  }, [error, navigate]);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-mario text-gray-900">
            Dashboard
          </h1>
        </div>
        <Link
          to="/groups/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 sm:w-auto"
        >
          <span className="text-lg">+</span>
          <span>Crear Nuevo Grupo</span>
        </Link>
      </div>

      <div>

        {isLoading ? (
          <WarioLoader text="Cargando grupos..." size="md" />
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4 flex justify-center">
              <img
                src="/images/others/boo.webp"
                alt="Boo"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tienes grupos todavía
            </h3>
            <p className="text-gray-600">
              Crea tu primera Mario Party League para empezar a competir
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Mis Grupos ({groups.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.slice(0, 6).map((group) => {
                const lastGameDate = getLastGameDate(group.games || []);
                const isGroupFull = (group.members?.length || 0) >= group.max_members;
                const approvedGamesCount = group.games?.filter(g => g.status === 'approved').length || 0;

                return (
                  <div key={group.id} className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="p-6 text-center">
                      {/* Header with title and badge */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-mario text-gray-900 flex-1">
                          {group.name}
                        </h3>
                        {isGroupFull && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                            {group.members?.length}/{group.max_members}
                          </span>
                        )}
                      </div>

                      {/* Logo centrado */}
                      <div className="flex justify-center mb-4">
                        <img
                          src="/images/others/mpj.webp"
                          alt="Mario Party"
                          className="w-36 h-36 object-contain"
                        />
                      </div>

                      {/* Descripción centrada */}
                      {group.description && (
                        <div className="mb-4">
                          <p className="text-gray-500 text-sm">
                            {group.description}
                          </p>
                        </div>
                      )}

                      {/* Activity indicator */}
                      {lastGameDate && (
                        <div className="mb-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            🎮 Última partida {formatTimeAgo(lastGameDate)}
                          </span>
                        </div>
                      )}

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Miembros:</span>
                          <div className="flex items-center space-x-2">
                            {group.members && group.members.length > 0 ? (
                              <MemberAvatars members={group.members} maxDisplay={4} size="sm" />
                            ) : (
                              <span className="font-medium text-gray-600">
                                0/{group.max_members}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Partidas:</span>
                          <span className="font-bold text-gray-900 text-base">
                            {approvedGamesCount}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/groups/${group.id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                      >
                        Ver Grupo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}