import { useAuthContext } from '../context';
import { AuthForm } from './AuthForm';
import { SocialAuth } from './SocialAuth';

export const AuthContainer = () => {
  const { isLogin, toggleMode, onSuccess } = useAuthContext();

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-mario text-gray-900 mb-2">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p className="text-gray-600">
          {isLogin ? 'Bienvenido de vuelta' : 'Únete a Mario Party League'}
        </p>
      </div>

      <AuthForm
        isLogin={isLogin}
        onToggleMode={toggleMode}
        onSuccess={onSuccess}
      />

      <div className="mt-4">
        <SocialAuth onSuccess={onSuccess} />
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-700">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline"
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
          </button>
        </p>
      </div>
    </>
  );
};