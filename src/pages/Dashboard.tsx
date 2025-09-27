import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../app/store/useAuthStore';
import { useGroupsStore } from '../app/store/useGroupsStore';
import { LoadingSpinner } from '../shared/components/ui';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { groups, isLoading, error, loadGroups, clearGroups } = useGroupsStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('❌ Not authenticated, redirecting to auth');
      clearGroups();
      navigate('/auth');
      return;
    }

    loadGroups();
  }, []);

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
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="Cargando grupos..." size="md" />
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tienes grupos todavía
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera Mario Party League para empezar a competir
            </p>
            <Link
              to="/groups/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Crear Mi Primera Liga
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Mis Grupos ({groups.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.slice(0, 6).map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {group.name}
                      </h3>
                      {group.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {group.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {group.is_public ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🌐
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          🔒
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Miembros:</span>
                      <span className="font-medium">
                        {group.members?.length || 0}/{group.max_members}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Partidas:</span>
                      <span className="font-medium">
                        {group.games?.length || 0}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Ver Grupo
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}