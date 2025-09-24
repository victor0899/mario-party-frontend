import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { groupApi } from '../services/group.api';
import {
  Group,
  CreateGroupRequest,
  JoinGroupRequest,
  AddCPUMemberRequest
} from '../types/group.types';

export default function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  // Fetch all user groups
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await groupApi.getGroups();
      setGroups(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los grupos';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get specific group by ID
  const fetchGroup = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      const response = await groupApi.getGroup(groupId);
      setSelectedGroup(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar el grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new group
  const createGroup = useCallback(async (groupData: CreateGroupRequest) => {
    setCreating(true);
    try {
      const response = await groupApi.createGroup(groupData);
      const newGroup = response.data;

      setGroups(prev => [...prev, newGroup]);
      setSelectedGroup(newGroup);

      toast.success('Grupo creado exitosamente');
      return { success: true, data: newGroup };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear el grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCreating(false);
    }
  }, []);

  // Join group by invite code
  const joinGroup = useCallback(async (joinData: JoinGroupRequest) => {
    setJoining(true);
    try {
      const response = await groupApi.joinGroup(joinData);

      // Refresh groups to include the newly joined group
      await fetchGroups();

      toast.success('Te has unido al grupo exitosamente');
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al unirse al grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setJoining(false);
    }
  }, [fetchGroups]);

  // Leave group
  const leaveGroup = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      await groupApi.leaveGroup(groupId);

      // Remove group from local state
      setGroups(prev => prev.filter(group => group.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }

      toast.success('Has salido del grupo exitosamente');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al salir del grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  // Add CPU member to group
  const addCPUMember = useCallback(async (cpuData: AddCPUMemberRequest) => {
    setLoading(true);
    try {
      const response = await groupApi.addCPUMember(cpuData);

      // Update selected group if it matches
      if (selectedGroup?.id === cpuData.group_id) {
        setSelectedGroup(prev => prev ? {
          ...prev,
          members: [...prev.members, response.data]
        } : null);
      }

      toast.success('CPU agregado al grupo exitosamente');
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al agregar CPU al grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  // Remove member from group
  const removeMember = useCallback(async (groupId: string, memberId: string) => {
    setLoading(true);
    try {
      await groupApi.removeMember(groupId, memberId);

      // Update selected group if it matches
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(prev => prev ? {
          ...prev,
          members: prev.members.filter(member => member.id !== memberId)
        } : null);
      }

      toast.success('Miembro removido del grupo');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al remover miembro del grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  // Update group settings
  const updateGroup = useCallback(async (groupId: string, groupData: Partial<CreateGroupRequest>) => {
    setLoading(true);
    try {
      const response = await groupApi.updateGroup(groupId, groupData);
      const updatedGroup = response.data;

      // Update groups list
      setGroups(prev => prev.map(group =>
        group.id === groupId ? updatedGroup : group
      ));

      // Update selected group if it matches
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(updatedGroup);
      }

      toast.success('Grupo actualizado exitosamente');
      return { success: true, data: updatedGroup };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el grupo';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  // Regenerate invite code
  const regenerateInviteCode = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      const response = await groupApi.regenerateInviteCode(groupId);
      const newInviteCode = response.data.invite_code;

      // Update selected group if it matches
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(prev => prev ? {
          ...prev,
          invite_code: newInviteCode
        } : null);
      }

      toast.success('Código de invitación regenerado');
      return { success: true, inviteCode: newInviteCode };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al regenerar código de invitación';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  // Auto-fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    // State
    groups,
    selectedGroup,
    loading,
    creating,
    joining,

    // Actions
    fetchGroups,
    fetchGroup,
    createGroup,
    joinGroup,
    leaveGroup,
    addCPUMember,
    removeMember,
    updateGroup,
    regenerateInviteCode,
    setSelectedGroup,

    // Computed values
    groupsCount: groups.length,
    hasGroups: groups.length > 0,
    selectedGroupMembersCount: selectedGroup?.members.length || 0,
    isSelectedGroupOwner: (userId: string) => selectedGroup?.creator_id === userId,
  };
}