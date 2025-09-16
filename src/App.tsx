import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// ProtectedRoute now redirects to '/login' and checks profile completion
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Cargando...</div>
    </div>;
  }

  if (!isAuthenticated) {
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
    </Router>
  );
}

export default App;
