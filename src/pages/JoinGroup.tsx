import { Link } from 'react-router-dom';
import { Button, Container } from '../shared/components';
import { useAuthStore } from '../app/store/useAuthStore';

export default function JoinGroup() {
  const { user } = useAuthStore();




  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container maxWidth="sm" className="py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Unirse a Grupo
            </h1>
            <p className="text-gray-600 mb-6">
              Necesitas iniciar sesión para unirte a un grupo
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="primary" size="lg" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div>Content here</div>
    </div>
  );
};