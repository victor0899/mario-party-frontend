import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../../shared/lib/supabase';

interface Profile {
  id: string;
  nickname: string;
  profile_picture: string;
  birth_date: string;
  nationality: string;
  favorite_minigame: string;
  bio: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  _authListener?: { data: { subscription: { unsubscribe: () => void } } }; // Internal listener reference
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        loading: false
      }),

      setProfile: (profile) => set({ profile }),

      signUp: async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          get().setUser(data.user);
        }
      },

      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          get().setUser(data.user);
          await get().fetchProfile();
        }
      },

      signInWithGoogle: async () => {
        // Get the correct base URL for the current environment
        const baseUrl = import.meta.env.PROD
          ? window.location.origin
          : 'http://localhost:5173';

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${baseUrl}/dashboard`
          }
        });

        if (error) throw error;
      },

      signOut: async () => {
        // Clear state first to avoid race conditions
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false
        });

        // Force clear the persisted storage immediately
        localStorage.removeItem('mario-party-auth');

        // Broadcast logout to other tabs
        localStorage.setItem('mario-party-logout', Date.now().toString());
        localStorage.removeItem('mario-party-logout');

        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.warn('Supabase logout error (continuing anyway):', error);
          }
        } catch (error) {
          console.warn('Logout error (continuing anyway):', error);
        }
      },

      updateProfile: async (profileData: Partial<Profile>) => {
        const { user } = get();
        if (!user) throw new Error('No authenticated user');

        const dataToUpsert = {
          id: user.id,
          ...profileData,
          profile_completed: true,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('profiles')
          .upsert(dataToUpsert)
          .select()
          .single();

        if (error) throw error;

        get().setProfile(data);
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          return;
        }

        get().setProfile(data);
      },

      initialize: async () => {
        const currentState = get();

        // Avoid multiple initializations
        if (currentState._authListener) {
          return;
        }

        set({ loading: true });

        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            get().setUser(session.user);
            await get().fetchProfile();
          } else {
            set({ loading: false, isAuthenticated: false });
          }
        } catch (error) {
          console.warn('Initialize error:', error);
          set({ loading: false, isAuthenticated: false });
        }

        // Listen for auth changes
        const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          // Handle logout/session ended
          if (event === 'SIGNED_OUT' || !session?.user) {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              loading: false
            });
            localStorage.removeItem('mario-party-auth');
            return;
          }

          // Handle active session
          if (session?.user) {
            get().setUser(session.user);
            await get().fetchProfile();

            // Handle OAuth success navigation
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              // Small delay to allow profile to load
              setTimeout(() => {
                const currentPath = window.location.pathname;
                // Only navigate if we're on auth or dashboard page
                if (currentPath === '/auth' || currentPath === '/dashboard') {
                  const profile = get().profile;
                  if (profile?.profile_completed) {
                    window.location.href = '/dashboard';
                  } else {
                    window.location.href = '/complete-profile';
                  }
                }
              }, 500);
            }
          }
        });

        // Store listener reference for cleanup
        set({ _authListener: authListener });

        // SIMPLIFIED: Only listen for logout events to avoid loops
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === 'mario-party-logout') {
            // Another tab logged out, clear this tab's state
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              loading: false
            });
          }
          // Remove all other storage listeners that cause loops
        };

        window.addEventListener('storage', handleStorageChange);
      },

      cleanup: () => {
        const { _authListener } = get();
        if (_authListener) {
          _authListener.data.subscription?.unsubscribe();
        }
        window.removeEventListener('storage', () => {});
      },
    }),
    {
      name: 'mario-party-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated
      }),
      // No rehydration logic to avoid any cross-tab issues
      // Each tab initializes independently
    }
  )
);