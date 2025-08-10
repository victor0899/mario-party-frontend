import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import SignIn from './pages/SignIn'; // Import the new SignIn component
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// ProtectedRoute now redirects to '/'
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* The root path is now public and points to the new Home page */}
        <Route path="/" element={<Home />} />

        {/* The /login path now points to the new SignIn page */}
        <Route path="/login" element={<SignIn />} />
        
        <Route path="/register" element={<Register />} />
        
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
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
