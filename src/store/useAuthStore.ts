import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        loading: false
      }),

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
        }
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        get().setUser(null);
      },

      initialize: async () => {
        set({ loading: true });

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          get().setUser(session.user);
        } else {
          set({ loading: false, isAuthenticated: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            get().setUser(session.user);
          } else {
            get().setUser(null);
          }
        });
      },
    }),
    {
      name: 'mario-party-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);