import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api/users';
import { useAuthStore } from '../store/useAuthStore';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Container } from '../components';

export default function Login() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <Container maxWidth="sm" className="w-full">
        <Card size="lg" elevation="high" className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              🎮 Mario Party Tracker
            </CardTitle>
            <p className="text-gray-600">Ingresa tu email para continuar</p>
          </CardHeader>

          <CardContent>
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

            <div className="mt-6 space-y-4 text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Regístrate aquí
                </Link>
              </p>

              <Link 
                to="/" 
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                ← Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}