-- Clean and recreate RLS policies for Mario Party League

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON groups;

DROP POLICY IF EXISTS "Users can view group members of groups they belong to" ON group_members;
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
DROP POLICY IF EXISTS "Group members can add CPU players" ON group_members;
DROP POLICY IF EXISTS "Users can update their own membership status" ON group_members;

DROP POLICY IF EXISTS "Users can view games of groups they belong to" ON games;
DROP POLICY IF EXISTS "Group members can create games" ON games;

DROP POLICY IF EXISTS "Users can view game results of groups they belong to" ON game_results;
DROP POLICY IF EXISTS "Users can insert game results when creating games" ON game_results;

DROP POLICY IF EXISTS "Users can view game approvals of groups they belong to" ON game_approvals;
DROP POLICY IF EXISTS "Group members can vote on games" ON game_approvals;
DROP POLICY IF EXISTS "Users can update their own votes" ON game_approvals;

DROP POLICY IF EXISTS "Anyone can view active maps" ON maps;

-- Recreate all policies
-- Groups policies
CREATE POLICY "Users can view groups they are members of" ON groups
  FOR SELECT USING (
    id IN (
      SELECT group_id FROM group_members
      WHERE user_id = auth.uid() AND status = 'active'
    ) OR is_public = true
  );

CREATE POLICY "Users can create groups" ON groups
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Group creators can update their groups" ON groups
  FOR UPDATE USING (creator_id = auth.uid());

-- Group members policies
CREATE POLICY "Users can view group members of groups they belong to" ON group_members
  FOR SELECT USING (
    group_id IN (
      SELECT group_id FROM group_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can join groups" ON group_members
  FOR INSERT WITH CHECK (user_id = auth.uid() OR is_cpu = true);

CREATE POLICY "Group members can add CPU players" ON group_members
  FOR INSERT WITH CHECK (
    is_cpu = true AND
    group_id IN (
      SELECT group_id FROM group_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can update their own membership status" ON group_members
  FOR UPDATE USING (user_id = auth.uid());

-- Games policies
CREATE POLICY "Users can view games of groups they belong to" ON games
  FOR SELECT USING (
    group_id IN (
      SELECT group_id FROM group_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Group members can create games" ON games
  FOR INSERT WITH CHECK (
    group_id IN (
      SELECT group_id FROM group_members
      WHERE user_id = auth.uid() AND status = 'active'
    ) AND submitted_by = auth.uid()
  );

-- Game results policies
CREATE POLICY "Users can view game results of groups they belong to" ON game_results
  FOR SELECT USING (
    game_id IN (
      SELECT g.id FROM games g
      JOIN group_members gm ON gm.group_id = g.group_id
      WHERE gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

CREATE POLICY "Users can insert game results when creating games" ON game_results
  FOR INSERT WITH CHECK (
    game_id IN (
      SELECT g.id FROM games g
      JOIN group_members gm ON gm.group_id = g.group_id
      WHERE gm.user_id = auth.uid() AND gm.status = 'active'
        AND g.submitted_by = auth.uid()
    )
  );

-- Game approvals policies
CREATE POLICY "Users can view game approvals of groups they belong to" ON game_approvals
  FOR SELECT USING (
    game_id IN (
      SELECT g.id FROM games g
      JOIN group_members gm ON gm.group_id = g.group_id
      WHERE gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

CREATE POLICY "Group members can vote on games" ON game_approvals
  FOR INSERT WITH CHECK (
    voter_id IN (
      SELECT gm.id FROM group_members gm
      JOIN games g ON g.group_id = gm.group_id
      WHERE g.id = game_id
        AND gm.user_id = auth.uid()
        AND gm.status = 'active'
        AND gm.is_cpu = false
    )
  );

CREATE POLICY "Users can update their own votes" ON game_approvals
  FOR UPDATE USING (
    voter_id IN (
      SELECT gm.id FROM group_members gm
      WHERE gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

-- Maps policies (public read-only)
CREATE POLICY "Anyone can view active maps" ON maps
  FOR SELECT USING (is_active = true);