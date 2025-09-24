import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../services/auth.api';
import { useAuthStore } from '../store';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest
} from '../types/auth.types';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      const userData = response.data.user;

      setUser(userData);
      toast.success('¡Bienvenido de vuelta!');

      // Navigate based on profile completion
      if (userData.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/complete-profile');
      }

      return { success: true, user: userData };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate]);

  // Register function
  const register = useCallback(async (userData: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      const newUser = response.data.user;

      setUser(newUser);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/complete-profile');

      return { success: true, user: newUser };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate]);

  // Update profile function
  const updateProfile = useCallback(async (profileData: UpdateProfileRequest) => {
    setProfileLoading(true);
    try {
      const response = await authApi.updateProfile(profileData);
      const updatedUser = response.data;

      setUser(updatedUser);
      toast.success('Perfil actualizado exitosamente');

      return { success: true, user: updatedUser };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setProfileLoading(false);
    }
  }, [setUser]);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
      clearUser();
      toast.success('Sesión cerrada exitosamente');
      navigate('/auth');

      return { success: true };
    } catch (error: any) {
      // Even if API call fails, clear local state
      clearUser();
      navigate('/auth');
      return { success: true }; // Always return success for logout
    } finally {
      setLoading(false);
    }
  }, [clearUser, navigate]);

  // Get current profile
  const fetchProfile = useCallback(async () => {
    if (!user) return { success: false, error: 'No user logged in' };

    setProfileLoading(true);
    try {
      const response = await authApi.getProfile();
      const profileData = response.data;

      setUser(profileData);
      return { success: true, user: profileData };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al obtener el perfil';
      return { success: false, error: errorMessage };
    } finally {
      setProfileLoading(false);
    }
  }, [user, setUser]);

  // Request password reset
  const requestPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      toast.success('Se ha enviado un enlace de recuperación a tu email');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al solicitar recuperación';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token: string, password: string) => {
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      toast.success('Contraseña actualizada exitosamente');
      navigate('/auth');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer la contraseña';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check if user profile is complete
  const isProfileComplete = useCallback((): boolean => {
    if (!user) return false;
    return !!(user.nickname && user.profileCompleted);
  }, [user]);

  // Auto-fetch profile on mount if user exists but profile might be stale
  useEffect(() => {
    if (user && !user.profileCompleted) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return {
    // State
    user,
    loading,
    profileLoading,
    isAuthenticated: !!user,
    isProfileComplete: isProfileComplete(),

    // Actions
    login,
    register,
    logout,
    updateProfile,
    fetchProfile,
    requestPasswordReset,
    resetPassword,

    // Computed values
    userDisplayName: user?.nickname || user?.name || 'Usuario',
    userAvatar: user?.profilePicture || null,
  };
}