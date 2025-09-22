import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useAuthStore } from './app/store/useAuthStore';
import AppLayout from './shared/components/layout/AppLayout';
import { ProfileGuard } from './shared/components';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import JoinGroup from './pages/JoinGroup';
import CreateGame from './pages/CreateGame';
import Leaderboard from './pages/Leaderboard';
import CompleteProfile from './pages/CompleteProfile';
import EditProfile from './pages/EditProfile';

// Component to handle OAuth redirects - simplified approach
function AuthRedirectHandler() {
  const location = useLocation();

  useEffect(() => {
    console.log('🔴 AuthRedirectHandler - location changed:', location.pathname, location.hash);

    // Only handle OAuth callbacks with access_token
    if (location.hash && location.hash.includes('access_token')) {
      console.log('🔴 OAuth callback detected, letting Supabase handle it automatically');

      // Just show a toast and let Supabase's automatic session handling work
      toast.success('¡Autenticación exitosa! Redirigiendo...');

      // Don't interfere - let Supabase process the hash automatically
      // The onAuthStateChange listener will handle navigation
    }
  }, [location]);

  return null;
}

// ProtectedRoute now redirects to '/login' and checks profile completion
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  console.log('🟦 ProtectedRoute:', { isAuthenticated, loading, pathname: location.pathname, hash: !!location.hash });

  // If we're on a page with OAuth hash, give it extra time to process
  const hasOAuthHash = location.hash.includes('access_token');

  if (loading) {
    console.log('🟦 ProtectedRoute: Loading state');
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Cargando...</div>
    </div>;
  }

  if (hasOAuthHash && !isAuthenticated) {
    console.log('🟦 ProtectedRoute: OAuth hash detected, waiting for auth');
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Procesando autenticación...</div>
    </div>;
  }

  if (!isAuthenticated) {
    console.log('🟦 ProtectedRoute: Not authenticated, redirecting to auth');
    return <Navigate to="/auth" />;
  }

  console.log('🟦 ProtectedRoute: Authenticated, rendering children');
  return (
    <ProfileGuard>
      {children}
    </ProfileGuard>
  );
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    console.log('🟢 App component mounted, initializing auth...');
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Log every URL change
    const logUrlChange = () => {
      console.log('🟢 URL changed:', window.location.href);
      console.log('🟢 Hash:', window.location.hash);
    };

    // Log initial load
    logUrlChange();

    // Listen for hash changes
    window.addEventListener('hashchange', logUrlChange);

    return () => {
      window.removeEventListener('hashchange', logUrlChange);
    };
  }, []);

  return (
    <Router>
      <AuthRedirectHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* Redirect old routes to new auth page */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditProfile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/new"
          element={
            <ProtectedRoute>
              <CreateGroup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <GroupDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/join"
          element={
            <ProtectedRoute>
              <JoinGroup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/join/:inviteCode"
          element={
            <ProtectedRoute>
              <JoinGroup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games/new"
          element={
            <ProtectedRoute>
              <CreateGame />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:id/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
