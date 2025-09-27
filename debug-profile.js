// Debug script to check profile status
// Run this in browser console or create a small test page

import { supabase } from './src/shared/lib/supabase.js';

async function debugProfile() {
  console.log('=== DEBUG PROFILE STATUS ===');

  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session error:', sessionError);
    return;
  }

  if (!session?.user) {
    console.log('No user logged in');
    return;
  }

  console.log('User ID:', session.user.id);
  console.log('User email:', session.user.email);

  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error('Profile error:', profileError);
    if (profileError.code === 'PGRST116') {
      console.log('❌ No profile found in database - needs to be created');
    }
    return;
  }

  console.log('✅ Profile found:', profile);
  console.log('Profile completed:', profile.profile_completed);
  console.log('Nickname:', profile.nickname);

  if (profile.profile_completed) {
    console.log('✅ Profile is marked as completed');
  } else {
    console.log('❌ Profile is marked as incomplete');
  }
}

// Call the function
debugProfile();