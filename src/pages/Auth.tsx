import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Container, VideoBackground } from '../components';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn, signInWithGoogle } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;
    if (!isLogin && !name.trim()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        await signUp(email, password, name);
        alert('Registro exitoso! Revisa tu email para confirmar tu cuenta y luego podrás completar tu perfil.');
        // Cambiar a modo login después del registro exitoso
        setIsLogin(true);
        setName('');
        setPassword('');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || `Error al ${isLogin ? 'iniciar sesión' : 'crear la cuenta'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para validar contraseña (solo para registro)
  const validatePassword = (pwd: string) => {
    const requirements = {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
    };

    const isValid = requirements.minLength &&
                   requirements.hasUpperCase &&
                   requirements.hasLowerCase &&
                   requirements.hasNumber;

    return { requirements, isValid };
  };

  const passwordValidation = validatePassword(password);
  const isFormValid = isLogin
    ? email.trim() && password.trim()
    : email.trim() && name.trim() && passwordValidation.isValid;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Error with Google sign in:', error);
      alert(error.message || 'Error al iniciar sesión con Google');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setName('');
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre (solo para registro) */}
              {!isLogin && (
                <Input
                  type="text"
                  label="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  size="lg"
                />
              )}

              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                size="lg"
              />

              <div>
                <Input
                  type="password"
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Tu contraseña" : "Crea una contraseña segura"}
                  required
                  size="lg"
                />

                {/* Password Requirements (solo para registro) */}
                {!isLogin && password && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-300 font-medium">Requisitos de contraseña:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.minLength ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className={`text-xs ${passwordValidation.requirements.minLength ? 'text-green-300' : 'text-gray-300'}`}>
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.hasUpperCase ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className={`text-xs ${passwordValidation.requirements.hasUpperCase ? 'text-green-300' : 'text-gray-300'}`}>
                          Una mayúscula (A-Z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.hasLowerCase ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className={`text-xs ${passwordValidation.requirements.hasLowerCase ? 'text-green-300' : 'text-gray-300'}`}>
                          Una minúscula (a-z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${passwordValidation.requirements.hasNumber ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className={`text-xs ${passwordValidation.requirements.hasNumber ? 'text-green-300' : 'text-gray-300'}`}>
                          Un número (0-9)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={!isFormValid || isLoading}
                className="w-full"
              >
                {isLoading
                  ? (isLogin ? 'Iniciando sesión...' : 'Creando cuenta...')
                  : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')
                }
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/50 text-gray-300">o continúa con</span>
                </div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all duration-200 hover:border-white/30"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </button>

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