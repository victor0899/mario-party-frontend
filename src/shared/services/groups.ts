import { apiClient } from './client';
import type { Group, CreateGroupRequest, AddMemberRequest, GroupMember } from '../types/api';

export const groupApi = {
  create: (data: CreateGroupRequest) => apiClient.post<Group>('/groups', data),
  getById: (id: string) => apiClient.get<Group>(`/groups/${id}`),
  addMember: (groupId: string, data: AddMemberRequest) => 
    apiClient.post<GroupMember>(`/groups/${groupId}/members`, data),
  getUserGroups: (userId: string) => apiClient.get<Group[]>(`/users/${userId}/groups`),
};