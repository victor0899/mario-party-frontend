import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Dashboard() {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Force logout even if there's an error
      navigate('/login');
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mario Party Tracker</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hola, {profile?.nickname || user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            to="/groups" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-4">👥</div>
            <h2 className="text-xl font-semibold mb-2">Mis Grupos</h2>
            <p className="text-gray-600">Ver y gestionar tus grupos de juego</p>
          </Link>

          <Link 
            to="/groups/new" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-4">➕</div>
            <h2 className="text-xl font-semibold mb-2">Crear Grupo</h2>
            <p className="text-gray-600">Crea un nuevo grupo de juego</p>
          </Link>

          <Link 
            to="/games/new" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold mb-2">Nueva Partida</h2>
            <p className="text-gray-600">Registra una nueva partida</p>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Actividad Reciente</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center py-8">
              No hay actividad reciente. ¡Comienza creando un grupo o registrando una partida!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}