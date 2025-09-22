import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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

// Component to handle email verification and OAuth redirects from Supabase
function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialize } = useAuthStore();
  const processedRef = useRef(false);

  useEffect(() => {
    // Only process if there's a hash in the URL and we haven't processed it yet
    if (!location.hash || processedRef.current) return;

    // Check if URL contains verification parameters from Supabase
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    // If no relevant parameters, don't do anything
    if (!type && !error && !accessToken) return;

    // Mark as processed to prevent duplicate execution
    processedRef.current = true;

    if (error) {
      // Handle verification errors
      toast.error(errorDescription || 'Error en la autenticación');
      navigate('/auth', { replace: true });
      return;
    }

    // Handle OAuth login (Google, etc.) - has access_token but no type
    if (accessToken && !type) {
      console.log('🟢 OAuth callback detected with access_token');

      // This is an OAuth callback, let Supabase handle it automatically
      toast.success('¡Iniciando sesión exitosamente!');

      // DON'T clear the hash immediately - let Supabase process it first
      // DON'T navigate away - stay on current page and let the auth state update

      // Wait for Supabase to process the session automatically
      setTimeout(async () => {
        console.log('🟢 Reinitializing auth state...');
        await initialize();

        // Clear the hash AFTER Supabase processed it
        window.history.replaceState(null, '', window.location.pathname);

        console.log('🟢 Auth initialized, staying on current page');
        // Don't navigate - let the auth state change trigger automatic routing
      }, 500);

      return;
    }

    // Handle email verification types
    if (type && accessToken) {
      switch (type) {
        case 'signup':
          toast.success('¡Email verificado exitosamente! Ya puedes iniciar sesión.');
          break;
        case 'recovery':
          toast.success('Email verificado. Ahora puedes cambiar tu contraseña.');
          break;
        case 'email_change':
          toast.success('¡Cambio de email verificado exitosamente!');
          break;
        default:
          break;
      }

      // Navigate to auth page for email verification types
      navigate('/auth', { replace: true });
    }
  }, [navigate, location.hash, initialize]);

  return null; // This component doesn't render anything
}

// ProtectedRoute now redirects to '/login' and checks profile completion
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  // If we're on a page with OAuth hash, give it time to process
  const hasOAuthHash = location.hash.includes('access_token');

  if (loading || (hasOAuthHash && !isAuthenticated)) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">
        {hasOAuthHash ? 'Procesando autenticación...' : 'Cargando...'}
      </div>
    </div>;
  }

  if (!isAuthenticated && !hasOAuthHash) {
    return <Navigate to="/auth" />;
  }

  return (
    <ProfileGuard>
      {children}
    </ProfileGuard>
  );
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
