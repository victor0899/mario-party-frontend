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
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
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
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Clear state
        get().setUser(null);
        get().setProfile(null);

        // Force clear the persisted storage
        localStorage.removeItem('mario-party-auth');

        // Reset loading state
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false
        });
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
          console.error('Error fetching profile:', error);
          return;
        }

        get().setProfile(data);
      },

      initialize: async () => {
        console.log('🟡 AuthStore: initialize called');
        set({ loading: true });

        const { data: { session } } = await supabase.auth.getSession();
        console.log('🟡 AuthStore: current session:', !!session, !!session?.user);

        if (session?.user) {
          console.log('🟡 AuthStore: setting user from session');
          get().setUser(session.user);
          await get().fetchProfile();
        } else {
          console.log('🟡 AuthStore: no session, setting loading false');
          set({ loading: false, isAuthenticated: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🟡 AuthStore: auth state changed:', event, !!session?.user);
          if (session?.user) {
            console.log('🟡 AuthStore: auth change - setting user');
            get().setUser(session.user);
            await get().fetchProfile();
          } else {
            console.log('🟡 AuthStore: auth change - clearing user');
            get().setUser(null);
            get().setProfile(null);
          }
        });
      },
    }),
    {
      name: 'mario-party-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);