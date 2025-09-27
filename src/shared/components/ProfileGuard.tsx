import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';

interface ProfileGuardProps {
  children: React.ReactNode;
}

export default function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, profile, isAuthenticated, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('ProfileGuard check:', {
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      profileCompleted: profile?.profile_completed,
      currentPath: location.pathname,
      loading,
      fullProfile: profile
    });

    // Don't do anything while still loading
    if (loading) {
      console.log('Still loading, waiting...');
      return;
    }

    if (isAuthenticated && user) {
      // If we have a user but no profile, wait for profile to load
      if (!profile) {
        console.log('User authenticated but profile not loaded yet, waiting...');
        return;
      }

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
  }, [user, profile, isAuthenticated, loading, navigate, location.pathname]);


  // Show loading while authentication is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <div className="text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  // Show redirect message if profile is incomplete
  if (isAuthenticated && user && profile && !profile.profile_completed && location.pathname !== '/complete-profile') {
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