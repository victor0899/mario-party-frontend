-- Initial schema for Mario Party League
-- Create tables for the MPL system

-- Maps available in the game
CREATE TABLE maps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  game_version TEXT DEFAULT 'Super Mario Party Jamboree',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default maps for Super Mario Party Jamboree
INSERT INTO maps (name) VALUES
  ('Mega Wiggler''s Tree Party'),
  ('Roll ''em Raceway'),
  ('Rainbow Galleria'),
  ('Goomba Lagoon'),
  ('Western Land'),
  ('Mario''s Rainbow Castle'),
  ('King Bowser''s Keep');

-- Groups/Leagues for organizing players
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_code TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  max_members INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to generate random invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invite codes
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code = generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER groups_invite_code_trigger
  BEFORE INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();

-- Group members (includes humans and CPU players)
CREATE TABLE group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_cpu BOOLEAN DEFAULT false,
  cpu_name TEXT,
  cpu_avatar TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'left')),

  -- Constraints
  CONSTRAINT unique_user_per_group UNIQUE(group_id, user_id),
  CONSTRAINT cpu_requires_name CHECK (
    (is_cpu = false) OR
    (is_cpu = true AND cpu_name IS NOT NULL)
  )
);

-- Games played in groups
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  map_id UUID REFERENCES maps(id),
  played_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game results for each player in a game
CREATE TABLE game_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES group_members(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 4),
  league_points INTEGER NOT NULL CHECK (league_points >= 1 AND league_points <= 4),

  -- Core game metrics
  stars INTEGER DEFAULT 0 CHECK (stars >= 0),
  coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  minigames_won INTEGER DEFAULT 0 CHECK (minigames_won >= 0),
  showdown_wins INTEGER DEFAULT 0 CHECK (showdown_wins >= 0),
  items_bought INTEGER DEFAULT 0 CHECK (items_bought >= 0),
  items_used INTEGER DEFAULT 0 CHECK (items_used >= 0),
  spaces_traveled INTEGER DEFAULT 0 CHECK (spaces_traveled >= 0),
  reactions_used INTEGER DEFAULT 0 CHECK (reactions_used >= 0),

  -- Space landing counts
  blue_spaces INTEGER DEFAULT 0 CHECK (blue_spaces >= 0),
  red_spaces INTEGER DEFAULT 0 CHECK (red_spaces >= 0),
  lucky_spaces INTEGER DEFAULT 0 CHECK (lucky_spaces >= 0),
  unlucky_spaces INTEGER DEFAULT 0 CHECK (unlucky_spaces >= 0),
  item_spaces INTEGER DEFAULT 0 CHECK (item_spaces >= 0),
  bowser_spaces INTEGER DEFAULT 0 CHECK (bowser_spaces >= 0),
  event_spaces INTEGER DEFAULT 0 CHECK (event_spaces >= 0),
  vs_spaces INTEGER DEFAULT 0 CHECK (vs_spaces >= 0),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_player_per_game UNIQUE(game_id, player_id),
  CONSTRAINT unique_position_per_game UNIQUE(game_id, position),
  CONSTRAINT unique_points_per_game UNIQUE(game_id, league_points)
);

-- Function to automatically assign league points based on position
CREATE OR REPLACE FUNCTION set_league_points()
RETURNS TRIGGER AS $$
BEGIN
  NEW.league_points = CASE NEW.position
    WHEN 1 THEN 4
    WHEN 2 THEN 3
    WHEN 3 THEN 2
    WHEN 4 THEN 1
    ELSE NEW.league_points
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER game_results_points_trigger
  BEFORE INSERT OR UPDATE ON game_results
  FOR EACH ROW
  EXECUTE FUNCTION set_league_points();

-- Game approvals for voting system
CREATE TABLE game_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES group_members(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject')),
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Each member can only vote once per game
  CONSTRAINT unique_vote_per_game UNIQUE(game_id, voter_id)
);

-- Function to update game status based on votes
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
  -- Approved: 2+ approve votes
  -- Rejected: 3+ reject votes
  IF approve_votes >= 2 THEN
    UPDATE games SET status = 'approved', updated_at = NOW() WHERE id = NEW.game_id;
  ELSIF reject_votes >= 3 THEN
    UPDATE games SET status = 'rejected', updated_at = NOW() WHERE id = NEW.game_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER game_approvals_status_trigger
  AFTER INSERT OR UPDATE ON game_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_game_status();

-- Create indexes for better performance
CREATE INDEX idx_groups_invite_code ON groups(invite_code);
CREATE INDEX idx_group_members_group_user ON group_members(group_id, user_id);
CREATE INDEX idx_games_group_status ON games(group_id, status);
CREATE INDEX idx_games_played_at ON games(played_at);
CREATE INDEX idx_game_results_game_position ON game_results(game_id, position);
CREATE INDEX idx_game_approvals_game_voter ON game_approvals(game_id, voter_id);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies will be added in the next migration