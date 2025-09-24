import { GroupMember } from '../../groups/types/group.types';

// Mario Party League specific types
export interface Map {
  id: string;
  name: string;
  game_version: string;
  is_active: boolean;
  created_at: string;
}

export interface Game {
  id: string;
  group_id: string;
  map_id: string;
  played_at: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by?: string;
  created_at: string;
  updated_at: string;
  map?: Map;
  results: GameResult[];
  approvals: GameApproval[];
}

export interface GameResult {
  id: string;
  game_id: string;
  player_id: string;
  position: number;
  league_points: number;

  // Core game metrics
  stars: number;
  coins: number;
  minigames_won: number;
  showdown_wins: number;
  items_bought: number;
  items_used: number;
  spaces_traveled: number;
  reactions_used: number;

  // Space landing counts
  blue_spaces: number;
  red_spaces: number;
  lucky_spaces: number;
  unlucky_spaces: number;
  item_spaces: number;
  bowser_spaces: number;
  event_spaces: number;
  vs_spaces: number;

  created_at: string;
  player?: GroupMember;
}

export interface GameApproval {
  id: string;
  game_id: string;
  voter_id: string;
  vote: 'approve' | 'reject';
  voted_at: string;
  voter?: GroupMember;
}

// Game API request types
export interface CreateGameRequest {
  group_id: string;
  map_id: string;
  played_at: string;
  results: CreateGameResultRequest[];
}

export interface CreateGameResultRequest {
  player_id: string;
  position: number;
  stars: number;
  coins: number;
  minigames_won: number;
  showdown_wins: number;
  items_bought: number;
  items_used: number;
  spaces_traveled: number;
  reactions_used: number;
  blue_spaces: number;
  red_spaces: number;
  lucky_spaces: number;
  unlucky_spaces: number;
  item_spaces: number;
  bowser_spaces: number;
  event_spaces: number;
  vs_spaces: number;
}

export interface VoteGameRequest {
  game_id: string;
  vote: 'approve' | 'reject';
}

// Legacy Score interface for backward compatibility
export interface Score {
  id: string;
  gameId: string;
  userId: string;
  points: number;
  winner: boolean;
  user: unknown; // Will reference User from auth types
  game: Game;
}

export interface CreateScoreRequest {
  gameId: string;
  userId: string;
  points: number;
  winner?: boolean;
}