import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';

interface ProfileGuardProps {
  children: React.ReactNode;
}

export default function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, profile, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only check profile completion if user is authenticated
    if (isAuthenticated && user) {
      // Don't redirect if already on complete-profile page
      if (location.pathname === '/complete-profile') {
        return;
      }

      // Check if profile is completed
      const profileCompleted = profile?.profile_completed;

      if (!profileCompleted) {
        navigate('/complete-profile');
      }
    }
  }, [user, profile, isAuthenticated, navigate, location.pathname]);

  // If user is authenticated but profile not completed, and not on complete-profile page
  if (isAuthenticated && user && !profile?.profile_completed && location.pathname !== '/complete-profile') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <div className="text-gray-600">Redirigiendo para completar tu perfil...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}