import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Container, VideoBackground } from '../components';
import { useAuthStore } from '../store/useAuthStore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !name.trim()) return;

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      alert('Registro exitoso! Revisa tu email para confirmar tu cuenta.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      alert(error.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para validar contraseña
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
  const isFormValid = email.trim() && name.trim() && passwordValidation.isValid;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      <VideoBackground />

      {/* Content */}
      <Container maxWidth="sm" className="relative z-10 w-full">
        <div className="w-full max-w-md mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-mario text-white mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-200">Únete a Mario Party League</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
              size="lg"
            />

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
                placeholder="Tu contraseña"
                required
                size="lg"
              />

              {/* Password Requirements */}
              {password && (
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
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-200">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-300 hover:text-blue-200 font-medium transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}