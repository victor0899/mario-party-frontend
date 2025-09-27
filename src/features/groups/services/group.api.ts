import { apiClient } from '@/shared/services/client';
import type {
  Group,
  GroupMember,
  CreateGroupRequest,
  JoinGroupRequest,
  AddCPUMemberRequest
} from '../types/group.types';


export interface IApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}


export const groupApi = {

  getGroups: async (): Promise<IApiResponse<Group[]>> => {
    return apiClient.get<IApiResponse<Group[]>>('/groups');
  },


  getGroup: async (groupId: string): Promise<IApiResponse<Group>> => {
    return apiClient.get<IApiResponse<Group>>(`/groups/${groupId}`);
  },


  createGroup: async (groupData: CreateGroupRequest): Promise<IApiResponse<Group>> => {
    return apiClient.post<IApiResponse<Group>>('/groups', groupData);
  },


  joinGroup: async (joinData: JoinGroupRequest): Promise<IApiResponse<GroupMember>> => {
    return apiClient.post<IApiResponse<GroupMember>>('/groups/join', joinData);
  },


  leaveGroup: async (groupId: string): Promise<IApiResponse<void>> => {
    return apiClient.delete<IApiResponse<void>>(`/groups/${groupId}/leave`);
  },


  addCPUMember: async (cpuData: AddCPUMemberRequest): Promise<IApiResponse<GroupMember>> => {
    return apiClient.post<IApiResponse<GroupMember>>('/groups/members/cpu', cpuData);
  },


  removeMember: async (groupId: string, memberId: string): Promise<IApiResponse<void>> => {
    return apiClient.delete<IApiResponse<void>>(`/groups/${groupId}/members/${memberId}`);
  },


  updateGroup: async (groupId: string, groupData: Partial<CreateGroupRequest>): Promise<IApiResponse<Group>> => {
    return apiClient.put<IApiResponse<Group>>(`/groups/${groupId}`, groupData);
  },


  getMembers: async (groupId: string): Promise<IApiResponse<GroupMember[]>> => {
    return apiClient.get<IApiResponse<GroupMember[]>>(`/groups/${groupId}/members`);
  },


  regenerateInviteCode: async (groupId: string): Promise<IApiResponse<{ invite_code: string }>> => {
    return apiClient.post<IApiResponse<{ invite_code: string }>>(`/groups/${groupId}/regenerate-code`);
  },


  transferOwnership: async (groupId: string, newOwnerId: string): Promise<IApiResponse<Group>> => {
    return apiClient.put<IApiResponse<Group>>(`/groups/${groupId}/transfer`, { newOwnerId });
  }
};


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