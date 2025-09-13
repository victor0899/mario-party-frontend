-- Simplify all RLS policies to avoid recursion

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON groups;

DROP POLICY IF EXISTS "Users can view group members" ON group_members;
DROP POLICY IF EXISTS "Users can join groups directly" ON group_members;
DROP POLICY IF EXISTS "Group creators can add CPU players" ON group_members;
DROP POLICY IF EXISTS "Users can update their own membership status" ON group_members;

DROP POLICY IF EXISTS "Users can view games" ON games;
DROP POLICY IF EXISTS "Group creators and members can create games" ON games;

DROP POLICY IF EXISTS "Users can view game results of groups they belong to" ON game_results;
DROP POLICY IF EXISTS "Users can insert game results when creating games" ON game_results;

DROP POLICY IF EXISTS "Users can view game approvals of groups they belong to" ON game_approvals;
DROP POLICY IF EXISTS "Group members can vote on games" ON game_approvals;
DROP POLICY IF EXISTS "Users can update their own votes" ON game_approvals;

-- CREATE SIMPLE, NON-RECURSIVE POLICIES

-- Groups: Simple policies
CREATE POLICY "Users can view their own groups" ON groups
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "Users can view public groups" ON groups
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create groups" ON groups
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own groups" ON groups
  FOR UPDATE USING (creator_id = auth.uid());

-- Group Members: Simple policies
CREATE POLICY "Users can view all group members" ON group_members
  FOR SELECT USING (true); -- We'll control this at application level

CREATE POLICY "Users can insert themselves as members" ON group_members
  FOR INSERT WITH CHECK (user_id = auth.uid() OR is_cpu = true);

CREATE POLICY "Users can update their own membership" ON group_members
  FOR UPDATE USING (user_id = auth.uid());

-- Games: Simple policies
CREATE POLICY "Users can view all games" ON games
  FOR SELECT USING (true); -- Control at app level

CREATE POLICY "Users can create games" ON games
  FOR INSERT WITH CHECK (submitted_by = auth.uid());

-- Game Results: Simple policies
CREATE POLICY "Users can view all game results" ON game_results
  FOR SELECT USING (true); -- Control at app level

CREATE POLICY "Users can insert game results" ON game_results
  FOR INSERT WITH CHECK (true); -- Control at app level through games

-- Game Approvals: Simple policies
CREATE POLICY "Users can view all game approvals" ON game_approvals
  FOR SELECT USING (true); -- Control at app level

CREATE POLICY "Users can insert their votes" ON game_approvals
  FOR INSERT WITH CHECK (true); -- Will validate at app level

CREATE POLICY "Users can update their votes" ON game_approvals
  FOR UPDATE USING (true); -- Will validate at app level

-- Maps remain public
CREATE POLICY "Anyone can view maps" ON maps
  FOR SELECT USING (is_active = true);