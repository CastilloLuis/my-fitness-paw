import { supabase } from './client';

export async function signUp(email: string, password: string, displayName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;

  if (data.user && data.user.identities?.length === 0) {
    throw new Error('An account with this email already exists');
  }

  // Create the profile row from app code (no trigger needed)
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: data.user.id, display_name: displayName || '' });
    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
  }

  if (!data.session) {
    return { ...data, confirmationRequired: true };
  }

  return { ...data, confirmationRequired: false };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  // Ensure profile exists on login too (in case trigger never ran)
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      await supabase
        .from('profiles')
        .upsert({ id: data.user.id, display_name: '' });
    }
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function deleteAccount() {
  const { error } = await supabase.rpc('delete_user_account');
  if (error) throw error;
}
