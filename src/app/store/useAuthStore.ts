import { create } from 'zustand';
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
  loading: boolean;
  isAuthenticated: boolean;
  _authListener?: { data: { subscription: { unsubscribe: () => void } } };
  _initialized: boolean;
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
  clearAllStores: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  _authListener: undefined,
  _initialized: false,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    loading: false
  }),

  setProfile: (profile) => set({ profile }),

  signUp: async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) throw error;
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  },

  signInWithGoogle: async () => {
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
    try {
      console.log('Starting logout...');
      set({ loading: true });

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase logout error:', error);
        set({ loading: false });
        return;
      }

      console.log('Logout successful');
      // Auth listener will handle clearing state
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear on any error
      get().clearAllStores();
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

    console.log('Fetching profile for user:', user.id);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('Profile fetch error:', error);
      if (error.code === 'PGRST116') {
        console.log('No profile found - user needs to complete profile');
        // Set a minimal profile object to indicate profile is not completed
        get().setProfile({
          id: user.id,
          nickname: '',
          profile_picture: '',
          birth_date: '',
          nationality: '',
          favorite_minigame: '',
          bio: '',
          profile_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      return;
    }

    console.log('Profile fetched:', data);
    get().setProfile(data);
  },

  initialize: async () => {
    const currentState = get();

    if (currentState._initialized) {
      console.log('Auth store already initialized');
      return;
    }

    console.log('Initializing auth store...');
    set({ loading: true, _initialized: true });

    try {
      // Setup auth listener
      const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state change:', event, !!session?.user);

        if (event === 'SIGNED_OUT' || !session?.user) {
          console.log('User signed out, clearing state');
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            loading: false
          });
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in');
          get().setUser(session.user);
          try {
            await get().fetchProfile();
          } catch (profileError) {
            console.warn('Profile fetch error during auth change:', profileError);
          }
        }
      });

      set({ _authListener: authListener });

      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', !!session?.user);

      if (session?.user) {
        get().setUser(session.user);
        await get().fetchProfile();
      } else {
        set({
          loading: false,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Initialize error:', error);
      set({
        loading: false,
        isAuthenticated: false
      });
    }
  },

  cleanup: () => {
    const { _authListener } = get();
    if (_authListener) {
      _authListener.data.subscription?.unsubscribe();
      set({ _authListener: undefined, _initialized: false });
    }
  },

  clearAllStores: () => {
    console.log('Clearing all stores...');
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      loading: false
    });
  },
}));