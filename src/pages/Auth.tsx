import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, VideoBackground } from '../shared/components';
import { AuthForm, SocialAuth } from '../features/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccess = () => {
    // Success is handled within the components
    // They will navigate appropriately
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      <VideoBackground />

      {/* Content */}
      <Container maxWidth="sm" className="relative z-10 w-full">
        <div className="w-full max-w-md mx-auto p-8">
          {/* Card with enhanced semi-transparent background */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20 ring-1 ring-white/10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-mario text-white mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h1>
              <p className="text-gray-200">
                {isLogin ? 'Bienvenido de vuelta' : 'Únete a Mario Party League'}
              </p>
            </div>

            <AuthForm
              isLogin={isLogin}
              onToggleMode={toggleMode}
              onSuccess={handleSuccess}
            />

            <div className="mt-6">
              <SocialAuth onSuccess={handleSuccess} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-200">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  onClick={toggleMode}
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors underline"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}