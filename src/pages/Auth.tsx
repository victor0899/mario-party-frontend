import { AuthProvider } from '../features/auth/context';
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { AuthContainer } from '../features/auth/components/AuthContainer';

export default function Auth() {
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