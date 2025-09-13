-- Fix recursive policies for group_members table

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view group members of groups they belong to" ON group_members;
DROP POLICY IF EXISTS "Users can join groups" ON group_members;
DROP POLICY IF EXISTS "Group members can add CPU players" ON group_members;

-- Recreate with simpler, non-recursive policies

-- Allow users to view group members of groups they created or are members of
CREATE POLICY "Users can view group members" ON group_members
  FOR SELECT USING (
    -- User can see members of groups they created
    group_id IN (
      SELECT id FROM groups WHERE creator_id = auth.uid()
    ) OR
    -- User can see members of groups they belong to (direct check)
    user_id = auth.uid()
  );

-- Allow users to join groups directly
CREATE POLICY "Users can join groups directly" ON group_members
  FOR INSERT WITH CHECK (
    -- User can only add themselves or CPU players
    user_id = auth.uid() OR is_cpu = true
  );

-- Allow group creators to add CPU players
CREATE POLICY "Group creators can add CPU players" ON group_members
  FOR INSERT WITH CHECK (
    is_cpu = true AND
    group_id IN (
      SELECT id FROM groups WHERE creator_id = auth.uid()
    )
  );

-- Update games policy to avoid recursion too
DROP POLICY IF EXISTS "Users can view games of groups they belong to" ON games;
DROP POLICY IF EXISTS "Group members can create games" ON games;

-- Simpler games policies
CREATE POLICY "Users can view games" ON games
  FOR SELECT USING (
    -- User created the group
    group_id IN (
      SELECT id FROM groups WHERE creator_id = auth.uid()
    ) OR
    -- User is a member of the group (direct check)
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Group creators and members can create games" ON games
  FOR INSERT WITH CHECK (
    (group_id IN (
      SELECT id FROM groups WHERE creator_id = auth.uid()
    ) OR
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid() AND status = 'active'
    )) AND submitted_by = auth.uid()
  );