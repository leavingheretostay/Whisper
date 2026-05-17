import { supabase } from './supabase';

export async function ensureUserProfile(user: any) {
  // Check if profile already exists — use maybeSingle() to avoid errors
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (existingProfile) return existingProfile;

  // Generate base username from Google name or email
  const baseUsername =
    user.user_metadata?.name
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '') ||
    (user.email ? user.email.split('@')[0] : 'user');

  // Check if username is taken — use maybeSingle()
  const { data: existingUsername } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', baseUsername)
    .maybeSingle();

  // Only add random number if username is already taken
  const username = existingUsername
    ? `${baseUsername}${Math.floor(Math.random() * 9999)}`
    : baseUsername;

  // Create new profile — use display_name to match your DashboardPage
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username,
      display_name: user.user_metadata?.name || username,
      avatar_url: user.user_metadata?.avatar_url || ''
    })
    .select()
    .single();

  if (error) {
    console.error('Profile creation error:', error);
    return null;
  }

  return data;
}