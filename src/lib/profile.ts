import { supabase } from './supabase'; // Adjust this path to match your actual supabase client location

export async function ensureUserProfile(user: any) {
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingProfile) return existingProfile;

  // Generate base username without random suffix first
  const baseUsername =
    user.user_metadata?.name
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '') ||
    user.email.split('@')[0];

  // Check if this username already exists in profiles table
  const { data: existingUsername } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', baseUsername)
    .single();

  // Only add random number if username is already taken
  const username = existingUsername
    ? `${baseUsername}${Math.floor(Math.random() * 9999)}`
    : baseUsername;

  // Create the new profile
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username,
      full_name: user.user_metadata?.name || '',
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