import { useEffect } from 'react';
import { useAuthStore } from '../../app/store/useAuthStore';

/**
 * Hook to initialize auth store properly
 * Should be called once at the app level
 */
export const useStoreInitialization = () => {
  const initializeAuth = useAuthStore(state => state.initialize);
  const cleanupAuth = useAuthStore(state => state.cleanup);

  useEffect(() => {
    console.log('Initializing stores...');
    initializeAuth();

    return () => {
      console.log('Cleaning up stores...');
      cleanupAuth();
    };
  }, [initializeAuth, cleanupAuth]);
};