import type { User } from '../../auth/types/auth.types';

// Group and member related types
export interface Group {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  invite_code: string;
  is_public: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
  creator?: User;
  members: GroupMember[];
  games: unknown[]; // Will be defined in games module
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id?: string;
  is_cpu: boolean;
  cpu_name?: string;
  cpu_avatar?: string;
  joined_at: string;
  status: 'active' | 'pending' | 'left';
  user?: User;
  profile?: {
    nickname?: string;
    profile_picture?: string;
  };
}

// Group API request types
export interface CreateGroupRequest {
  name: string;
  description?: string;
  is_public?: boolean;
  max_members?: number;
}

export interface JoinGroupRequest {
  invite_code: string;
}

export interface AddCPUMemberRequest {
  group_id: string;
  cpu_name: string;
  cpu_avatar?: string;
}

// Legacy types for backward compatibility
export interface AddMemberRequest {
  userId: string;
}