import { supabase } from '../lib/supabase';
import type {
  Group,
  GroupMember,
  Game,
  GameApproval,
  Map,
  LeaderboardEntry,
  CreateGroupRequest,
  JoinGroupRequest,
  AddCPUMemberRequest,
  CreateGameRequest,
  VoteGameRequest,
} from '../types/api';

export class SupabaseAPI {
  // Groups
  async createGroup(data: CreateGroupRequest): Promise<Group> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Create the group
    const { data: group, error } = await supabase
      .from('groups')
      .insert({
        name: data.name,
        description: data.description,
        is_public: data.is_public ?? false,
        max_members: data.max_members ?? 4,
        creator_id: user.id,
      })
      .select('*')
      .single();

    if (error) throw error;

    // Add creator as first member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        is_cpu: false,
        status: 'active',
      });

    if (memberError) {
      console.warn('Warning: Could not add creator as member:', memberError);
    }

    return group;
  }

  async deleteGroup(groupId: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Only group creators can delete their groups
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId)
      .eq('creator_id', user.id);

    if (error) throw error;
  }

  async getGroup(id: string): Promise<Group> {
    const { data: group, error } = await supabase
      .from('groups')
      .select(`
        *,
        members:group_members(*),
        games(
          id,
          status,
          played_at,
          map_id
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get user profiles for human members
    if (group.members && group.members.length > 0) {
      const humanMemberUserIds = group.members
        .filter((member: any) => !member.is_cpu && member.user_id)
        .map((member: any) => member.user_id);

      if (humanMemberUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, nickname, profile_picture')
          .in('id', humanMemberUserIds);

        if (!profilesError && profiles) {
          // Add profile data to members
          group.members = group.members.map((member: any) => {
            if (!member.is_cpu && member.user_id) {
              const profile = profiles.find((p: any) => p.id === member.user_id);
              if (profile) {
                member.profile = {
                  nickname: profile.nickname,
                  profile_picture: profile.profile_picture
                };
              }
            }
            return member;
          });
        }
      }
    }

    return group;
  }

  async joinGroup(data: JoinGroupRequest): Promise<GroupMember> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // First, find the group by invite code
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id')
      .eq('invite_code', data.invite_code)
      .single();

    if (groupError) throw groupError;

    // Join the group
    const { data: member, error } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        is_cpu: false,
        status: 'active',
      })
      .select('*')
      .single();

    if (error) throw error;
    return member;
  }

  async addCPUMember(data: AddCPUMemberRequest): Promise<GroupMember> {
    const { data: member, error } = await supabase
      .from('group_members')
      .insert({
        group_id: data.group_id,
        is_cpu: true,
        cpu_name: data.cpu_name,
        cpu_avatar: data.cpu_avatar,
        status: 'active',
      })
      .select('*')
      .single();

    if (error) throw error;
    return member;
  }

  async getUserGroups(): Promise<Group[]> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Get groups where user is the creator - simplified query
    const { data: groups, error } = await supabase
      .from('groups')
      .select(`
        *,
        members:group_members(*),
        games(id, status, played_at)
      `)
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return groups || [];
  }

  // Maps
  async getMaps(): Promise<Map[]> {
    const { data: maps, error } = await supabase
      .from('maps')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return maps;
  }

  // Games
  async createGame(data: CreateGameRequest): Promise<Game> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Check if this group has only 1 human player BEFORE creating the game
    const { data: groupMembers, error: membersError } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', data.group_id)
      .eq('status', 'active');

    if (membersError) throw membersError;

    const humanMembers = groupMembers.filter(m => !m.is_cpu);
    const isOnlyHumanPlayer = humanMembers.length === 1;

    // Create the game with appropriate status
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        group_id: data.group_id,
        map_id: data.map_id,
        played_at: data.played_at,
        status: isOnlyHumanPlayer ? 'approved' : 'pending',
        submitted_by: user.id,
      })
      .select('*')
      .single();

    if (gameError) throw gameError;

    // Create the game results
    const gameResults = data.results.map(result => ({
      ...result,
      game_id: game.id,
    }));

    const { error: resultsError } = await supabase
      .from('game_results')
      .insert(gameResults);

    if (resultsError) throw resultsError;

    // Get the user's group member record to create automatic approval
    const { data: member, error: memberError } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', data.group_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (memberError) throw memberError;

    // Automatically approve the game for the user who created it
    const { error: approvalError } = await supabase
      .from('game_approvals')
      .insert({
        game_id: game.id,
        voter_id: member.id,
        vote: 'approve',
      });

    if (approvalError) throw approvalError;

    // Note: If this was the only human player, the game was already created with 'approved' status

    return game;
  }

  async voteOnGame(data: VoteGameRequest): Promise<GameApproval> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Get the user's group member record for this game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('group_id')
      .eq('id', data.game_id)
      .single();

    if (gameError) throw gameError;

    const { data: member, error: memberError } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', game.group_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (memberError) throw memberError;

    // Cast the vote
    const { data: approval, error } = await supabase
      .from('game_approvals')
      .upsert({
        game_id: data.game_id,
        voter_id: member.id,
        vote: data.vote,
      })
      .select('*')
      .single();

    if (error) throw error;

    // Check if we need to update game status based on votes
    await this.checkAndUpdateGameStatus(data.game_id);

    return approval;
  }

  private async checkAndUpdateGameStatus(gameId: string): Promise<void> {
    // Get game with group info to count human members
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select(`
        *,
        group_id,
        approvals:game_approvals(*),
        group:group_id(
          members:group_members!inner(*)
        )
      `)
      .eq('id', gameId)
      .single();

    if (gameError) throw gameError;

    // Count human members (non-CPU)
    const humanMembers = game.group.members.filter((m: any) => !m.is_cpu && m.status === 'active');
    const totalHumanMembers = humanMembers.length;

    let newStatus: string | null = null;

    // Special case: If there's only 1 human player, auto-approve
    if (totalHumanMembers === 1) {
      newStatus = 'approved';
    } else {
      // Count votes
      const approveVotes = game.approvals.filter((a: any) => a.vote === 'approve').length;
      const rejectVotes = game.approvals.filter((a: any) => a.vote === 'reject').length;
      const totalVotes = approveVotes + rejectVotes;

      // Calculate majority needed (more than half)
      const majorityNeeded = Math.floor(totalHumanMembers / 2) + 1;

      // Check if we have enough votes for approval
      if (approveVotes >= majorityNeeded) {
        newStatus = 'approved';
      }
      // Check if we have enough votes for rejection
      else if (rejectVotes >= majorityNeeded) {
        newStatus = 'rejected';
      }
      // Check if everyone has voted but no majority (shouldn't happen with odd numbers)
      else if (totalVotes === totalHumanMembers && approveVotes !== rejectVotes) {
        newStatus = approveVotes > rejectVotes ? 'approved' : 'rejected';
      }
    }

    // Update game status if needed
    if (newStatus && game.status !== newStatus) {
      const { error: updateError } = await supabase
        .from('games')
        .update({ status: newStatus })
        .eq('id', gameId);

      if (updateError) throw updateError;
    }
  }

  async getGameDetails(gameId: string): Promise<Game> {
    const { data: game, error } = await supabase
      .from('games')
      .select(`
        *,
        map:map_id(*),
        results:game_results(
          *,
          player:player_id(*)
        ),
        approvals:game_approvals(
          *,
          voter:voter_id(*)
        )
      `)
      .eq('id', gameId)
      .single();

    if (error) throw error;
    return game;
  }

  async getGroupGames(groupId: string, status?: 'pending' | 'approved' | 'rejected'): Promise<Game[]> {
    let query = supabase
      .from('games')
      .select(`
        *,
        map:map_id(*),
        results:game_results(
          *,
          player:player_id(*)
        ),
        approvals:game_approvals(
          *,
          voter:voter_id(*)
        )
      `)
      .eq('group_id', groupId)
      .order('played_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: games, error } = await query;

    if (error) throw error;
    return games;
  }

  // Leaderboard
  async getGroupLeaderboard(groupId: string): Promise<LeaderboardEntry[]> {
    // This is a complex query that aggregates data from multiple tables
    // We'll use a database function for this
    const { data: leaderboard, error } = await supabase
      .rpc('get_group_leaderboard', { group_id: groupId });

    if (error) throw error;
    return leaderboard;
  }

  // Search groups
  async searchGroups(query: string): Promise<Group[]> {
    const { data: groups, error } = await supabase
      .from('groups')
      .select('*')
      .eq('is_public', true)
      .ilike('name', `%${query}%`)
      .limit(10);

    if (error) throw error;
    return groups;
  }
}

export const supabaseAPI = new SupabaseAPI();