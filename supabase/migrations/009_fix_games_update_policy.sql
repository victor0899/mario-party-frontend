-- Fix RLS policy to allow group members to update game status

-- Drop existing restrictive policies for games
DROP POLICY IF EXISTS "Users can update their own games" ON games;

-- Create policy that allows group members to update game status
CREATE POLICY "Group members can update game status" ON games
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = games.group_id
      AND gm.user_id = auth.uid()
      AND gm.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM group_members gm
      WHERE gm.group_id = games.group_id
      AND gm.user_id = auth.uid()
      AND gm.status = 'active'
    )
  );