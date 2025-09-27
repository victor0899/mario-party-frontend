import { createContext, useContext, useState, type ReactNode } from 'react';

export type AuthMode = 'login' | 'register';

interface AuthContextValue {
  mode: AuthMode;
  isLogin: boolean;
  toggleMode: () => void;
  setMode: (mode: AuthMode) => void;
  onSuccess: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  onSuccess?: () => void;
}

export const AuthProvider = ({ children, onSuccess }: AuthProviderProps) => {
  const [mode, setMode] = useState<AuthMode>('login');

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleSuccess = () => {
    onSuccess?.();
  };

  const value: AuthContextValue = {
    mode,
    isLogin: mode === 'login',
    toggleMode,
    setMode,
    onSuccess: handleSuccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};