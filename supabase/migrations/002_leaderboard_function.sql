-- Function to calculate group leaderboard with tiebreakers
CREATE OR REPLACE FUNCTION get_group_leaderboard(group_id UUID)
RETURNS TABLE (
  player_id UUID,
  player_name TEXT,
  is_cpu BOOLEAN,
  total_league_points BIGINT,
  games_won BIGINT,
  games_played BIGINT,
  total_stars BIGINT,
  total_coins BIGINT,
  total_minigames_won BIGINT,
  total_showdown_wins BIGINT,
  total_items_bought BIGINT,
  total_items_used BIGINT,
  total_spaces_traveled BIGINT,
  total_reactions_used BIGINT,
  total_blue_spaces BIGINT,
  total_red_spaces BIGINT,
  total_lucky_spaces BIGINT,
  total_unlucky_spaces BIGINT,
  total_item_spaces BIGINT,
  total_bowser_spaces BIGINT,
  total_event_spaces BIGINT,
  total_vs_spaces BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gm.id as player_id,
    COALESCE(gm.cpu_name, u.user_metadata->>'name', u.email) as player_name,
    gm.is_cpu,
    COALESCE(SUM(gr.league_points), 0) as total_league_points,
    COALESCE(SUM(CASE WHEN gr.position = 1 THEN 1 ELSE 0 END), 0) as games_won,
    COALESCE(COUNT(gr.id), 0) as games_played,
    COALESCE(SUM(gr.stars), 0) as total_stars,
    COALESCE(SUM(gr.coins), 0) as total_coins,
    COALESCE(SUM(gr.minigames_won), 0) as total_minigames_won,
    COALESCE(SUM(gr.showdown_wins), 0) as total_showdown_wins,
    COALESCE(SUM(gr.items_bought), 0) as total_items_bought,
    COALESCE(SUM(gr.items_used), 0) as total_items_used,
    COALESCE(SUM(gr.spaces_traveled), 0) as total_spaces_traveled,
    COALESCE(SUM(gr.reactions_used), 0) as total_reactions_used,
    COALESCE(SUM(gr.blue_spaces), 0) as total_blue_spaces,
    COALESCE(SUM(gr.red_spaces), 0) as total_red_spaces,
    COALESCE(SUM(gr.lucky_spaces), 0) as total_lucky_spaces,
    COALESCE(SUM(gr.unlucky_spaces), 0) as total_unlucky_spaces,
    COALESCE(SUM(gr.item_spaces), 0) as total_item_spaces,
    COALESCE(SUM(gr.bowser_spaces), 0) as total_bowser_spaces,
    COALESCE(SUM(gr.event_spaces), 0) as total_event_spaces,
    COALESCE(SUM(gr.vs_spaces), 0) as total_vs_spaces
  FROM group_members gm
  LEFT JOIN auth.users u ON gm.user_id = u.id
  LEFT JOIN game_results gr ON gr.player_id = gm.id
  LEFT JOIN games g ON g.id = gr.game_id AND g.status = 'approved'
  WHERE gm.group_id = get_group_leaderboard.group_id
    AND gm.status = 'active'
  GROUP BY gm.id, gm.cpu_name, gm.is_cpu, u.user_metadata, u.email
  ORDER BY
    total_league_points DESC,
    total_stars DESC,
    total_coins DESC,
    total_minigames_won DESC,
    total_showdown_wins DESC,
    total_items_bought DESC,
    total_items_used DESC,
    total_spaces_traveled DESC,
    total_reactions_used DESC,
    total_blue_spaces DESC,
    total_red_spaces DESC,
    total_lucky_spaces DESC,
    total_unlucky_spaces DESC,
    total_item_spaces DESC,
    total_bowser_spaces DESC,
    total_event_spaces DESC,
    total_vs_spaces DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;