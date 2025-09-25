import { apiClient } from '@/shared/services/client';
import type {
  Group,
  GroupMember,
  CreateGroupRequest,
  JoinGroupRequest,
  AddCPUMemberRequest
} from '../types/group.types';

// API Response wrapper
export interface IApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

// Group API services
export const groupApi = {
  // Get all groups for current user
  getGroups: async (): Promise<IApiResponse<Group[]>> => {
    return apiClient.get<IApiResponse<Group[]>>('/groups');
  },

  // Get group by ID
  getGroup: async (groupId: string): Promise<IApiResponse<Group>> => {
    return apiClient.get<IApiResponse<Group>>(`/groups/${groupId}`);
  },

  // Create new group
  createGroup: async (groupData: CreateGroupRequest): Promise<IApiResponse<Group>> => {
    return apiClient.post<IApiResponse<Group>>('/groups', groupData);
  },

  // Join group by invite code
  joinGroup: async (joinData: JoinGroupRequest): Promise<IApiResponse<GroupMember>> => {
    return apiClient.post<IApiResponse<GroupMember>>('/groups/join', joinData);
  },

  // Leave group
  leaveGroup: async (groupId: string): Promise<IApiResponse<void>> => {
    return apiClient.delete<IApiResponse<void>>(`/groups/${groupId}/leave`);
  },

  // Add CPU member to group
  addCPUMember: async (cpuData: AddCPUMemberRequest): Promise<IApiResponse<GroupMember>> => {
    return apiClient.post<IApiResponse<GroupMember>>('/groups/members/cpu', cpuData);
  },

  // Remove member from group
  removeMember: async (groupId: string, memberId: string): Promise<IApiResponse<void>> => {
    return apiClient.delete<IApiResponse<void>>(`/groups/${groupId}/members/${memberId}`);
  },

  // Update group settings
  updateGroup: async (groupId: string, groupData: Partial<CreateGroupRequest>): Promise<IApiResponse<Group>> => {
    return apiClient.put<IApiResponse<Group>>(`/groups/${groupId}`, groupData);
  },

  // Get group members
  getMembers: async (groupId: string): Promise<IApiResponse<GroupMember[]>> => {
    return apiClient.get<IApiResponse<GroupMember[]>>(`/groups/${groupId}/members`);
  },

  // Generate new invite code
  regenerateInviteCode: async (groupId: string): Promise<IApiResponse<{ invite_code: string }>> => {
    return apiClient.post<IApiResponse<{ invite_code: string }>>(`/groups/${groupId}/regenerate-code`);
  },

  // Transfer group ownership
  transferOwnership: async (groupId: string, newOwnerId: string): Promise<IApiResponse<Group>> => {
    return apiClient.put<IApiResponse<Group>>(`/groups/${groupId}/transfer`, { newOwnerId });
  }
};

// Named exports for individual functions
export const {
  getGroups,
  getGroup,
  createGroup,
  joinGroup,
  leaveGroup,
  addCPUMember,
  removeMember,
  updateGroup,
  getMembers,
  regenerateInviteCode,
  transferOwnership
} = groupApi;