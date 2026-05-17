export async function ensureUserProfile(user: any) {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingProfile) return existingProfile;

  const baseUsername =
    user.user_metadata?.name
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '') ||
    user.email.split('@')[0];

  const random = Math.floor(Math.random() * 9999);

  const username = `${baseUsername}${random}`;

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

  if (error) console.error(error);

  return data;
}