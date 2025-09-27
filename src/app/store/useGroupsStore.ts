import { create } from 'zustand';
import { supabaseAPI } from '../../shared/services/supabase';
import type { Group } from '../../shared/types/api';

interface GroupsState {
  groups: Group[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  loadGroups: (force?: boolean) => Promise<void>;
  clearGroups: () => void;
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  removeGroup: (groupId: string) => void;
  invalidateCache: () => void;
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  loadGroups: async (force = false) => {
    const { hasLoaded, isLoading } = get();

    // Avoid duplicate requests and use cache unless forced
    if (isLoading) return;
    if (!force && hasLoaded) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const userGroups = await supabaseAPI.getUserGroups();
      set({
        groups: userGroups,
        hasLoaded: true,
        error: null
      });
    } catch (error: unknown) {
      console.error('Error loading groups:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar grupos';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearGroups: () => set({
    groups: [],
    hasLoaded: false,
    error: null
  }),

  addGroup: (group) => set(state => ({
    groups: [...state.groups, group]
  })),

  updateGroup: (groupId, updates) => set(state => ({
    groups: state.groups.map(group =>
      group.id === groupId ? { ...group, ...updates } : group
    )
  })),

  removeGroup: (groupId) => set(state => ({
    groups: state.groups.filter(group => group.id !== groupId)
  })),

  invalidateCache: () => set({ hasLoaded: false }),
}));