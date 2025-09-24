// Leaderboard and statistics types
export interface LeaderboardEntry {
  player_id: string;
  player_name: string;
  is_cpu: boolean;
  profile_picture?: string;

  // League stats
  total_league_points: number;
  games_won: number;
  games_played: number;

  // Tiebreaker metrics (in order of priority)
  total_stars: number;
  total_coins: number;
  total_minigames_won: number;
  total_showdown_wins: number;
  total_items_bought: number;
  total_items_used: number;
  total_spaces_traveled: number;
  total_reactions_used: number;
  total_blue_spaces: number;
  total_red_spaces: number;
  total_lucky_spaces: number;
  total_unlucky_spaces: number;
  total_item_spaces: number;
  total_bowser_spaces: number;
  total_event_spaces: number;
  total_vs_spaces: number;
}

// Leaderboard request/response types
export interface LeaderboardRequest {
  group_id?: string;
  limit?: number;
  offset?: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
}