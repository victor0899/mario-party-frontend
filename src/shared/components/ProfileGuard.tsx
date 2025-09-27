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
    console.log('ProfileGuard check:', {
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      profileCompleted: profile?.profile_completed,
      currentPath: location.pathname
    });

    if (isAuthenticated && user) {
      const profileCompleted = profile?.profile_completed;

      if (!profileCompleted) {
        if (location.pathname !== '/complete-profile') {
          console.log('Profile not completed, navigating to complete-profile');
          navigate('/complete-profile');
        }
      } else {
        if (location.pathname === '/complete-profile') {
          console.log('Profile is completed, navigating to dashboard');
          navigate('/dashboard');
        }
      }
    }
  }, [user, profile, isAuthenticated, navigate, location.pathname]);


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