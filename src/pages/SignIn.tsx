import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api/users';
import { useAuthStore } from '../store/useAuthStore';
import { Button, Input, Container, VideoBackground } from '../components';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const users = await userApi.getAll();
      const user = users.find(u => u.email === email);
      
      if (user) {
        setUser(user);
        navigate('/dashboard');
      } else {
        alert('Usuario no encontrado. ¿Quieres registrarte?');
        navigate('/register', { state: { email } });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      <VideoBackground />
      
      {/* Content */}
      <Container maxWidth="sm" className="relative z-10 w-full">
        <div className="w-full max-w-md mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-mario text-white mb-2">
              Mario Party Tracker
            </h1>
            <p className="text-gray-200">Ingresa tu email para continuar</p>
          </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                size="lg"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-200">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-blue-300 hover:text-blue-200 font-medium transition-colors">
                  Regístrate aquí
                </Link>
              </p>
            </div>
        </div>
      </Container>
    </div>
  );
}