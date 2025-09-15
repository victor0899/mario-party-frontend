import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import AppLayout from './components/layout/AppLayout';
import { ProfileGuard } from './components';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import JoinGroup from './pages/JoinGroup';
import CreateGame from './pages/CreateGame';
import Leaderboard from './pages/Leaderboard';
import CompleteProfile from './pages/CompleteProfile';

// ProtectedRoute now redirects to '/login' and checks profile completion
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Cargando...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
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
