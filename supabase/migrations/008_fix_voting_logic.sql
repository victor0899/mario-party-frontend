-- Fix voting logic to use exact 2 votes for approval

CREATE OR REPLACE FUNCTION update_game_status()
RETURNS TRIGGER AS $$
DECLARE
  total_members INTEGER;
  total_votes INTEGER;
  approve_votes INTEGER;
  reject_votes INTEGER;
  human_members INTEGER;
BEGIN
  -- Count human members only (CPU can't vote)
  SELECT COUNT(*) INTO human_members
  FROM group_members gm
  JOIN games g ON g.group_id = gm.group_id
  WHERE g.id = NEW.game_id AND gm.is_cpu = false AND gm.status = 'active';

  -- Count current votes
  SELECT
    COUNT(*) as total,
    COUNT(CASE WHEN vote = 'approve' THEN 1 END) as approves,
    COUNT(CASE WHEN vote = 'reject' THEN 1 END) as rejects
  INTO total_votes, approve_votes, reject_votes
  FROM game_approvals
  WHERE game_id = NEW.game_id;

  -- Update game status based on voting rules
  -- Approved: exactly 2 approve votes
  -- Rejected: 3+ reject votes
  IF approve_votes = 2 THEN
    UPDATE games SET status = 'approved', updated_at = NOW() WHERE id = NEW.game_id;
  ELSIF reject_votes >= 3 THEN
    UPDATE games SET status = 'rejected', updated_at = NOW() WHERE id = NEW.game_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;