import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">🎮 Mario Party Tracker</h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Lleva el control de tus partidas de Mario Party, crea grupos con tus amigos 
            y mantén una tabla de posiciones como en la liga de fútbol.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated && user ? (
              <>
                <h2 className="text-2xl">¡Hola, {user.name}! 👋</h2>
                <Link 
                  to="/dashboard" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Ir al Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Tabla de Posiciones</h3>
            <p className="text-blue-100">
              Mantén el ranking de jugadores con puntos, victorias y partidas jugadas.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Grupos de Amigos</h3>
            <p className="text-blue-100">
              Crea grupos para diferentes círculos de amigos y lleva estadísticas separadas.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Registro de Partidas</h3>
            <p className="text-blue-100">
              Registra fácilmente los resultados de cada partida y mantén un historial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}