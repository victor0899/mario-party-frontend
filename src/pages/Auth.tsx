import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../app/store/useAuthStore';
import { AuthProvider } from '../features/auth/context';
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { AuthContainer } from '../features/auth/components/AuthContainer';

export default function Auth() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
  };

  return (
    <AuthProvider onSuccess={handleSuccess}>
      <AuthLayout>
        <AuthContainer />
      </AuthLayout>
    </AuthProvider>
  );
}