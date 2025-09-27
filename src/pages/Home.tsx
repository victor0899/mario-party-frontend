import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, VideoBackground, Button } from '../shared/components';
import { useAuthStore } from '../app/store/useAuthStore';

export default function Home() {
  const { isAuthenticated, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-purple-700">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      <VideoBackground />
      
      {/* Content */}
      <Container className="relative z-10 w-full">
        <div className="w-full mx-auto p-8 flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-10xl font-mario text-white mb-2 leading-tight">
              Mario Party Tracker
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-200">Keep score, track your epic wins, and relive the chaos of every game night with friends!
            </p>
          </div>

          <div className="mt-8">
            <Link to="/auth">
              <Button variant="primary" size="lg" className="text-base sm:text-lg md:text-xl lg:text-2xl px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 lg:py-6">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200">
              Join the Mario Party League today!
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}