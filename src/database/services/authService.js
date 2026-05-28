import { supabase } from '../supabaseClient';

let currentUser = null;

export const initSupabase = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (session) {
      currentUser = await fetchUserProfile(session.user.id, session.user.email);
    }
    return currentUser;
  } catch (error) {
    console.error('Supabase init error:', error);
    return null;
  }
};

const fetchUserProfile = async (id, email, metadata = {}) => {
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.warn('Cannot fetch user profile:', error.message);
  }

  return profile || {
    id: id,
    email: email,
    name: metadata.name || email,
    role: 'user',
  };
};

export const signUp = async (email, password, name) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw error;

    // Profile is usually created via trigger in Supabase, 
    // but we can manually handle if needed.
    currentUser = await fetchUserProfile(data.user.id, data.user.email, { name });
    
    return { success: true, user: currentUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    currentUser = await fetchUserProfile(data.user.id, data.user.email, data.user.user_metadata);

    return { success: true, user: currentUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
    currentUser = null;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  if (currentUser) return currentUser;
  
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = await fetchUserProfile(session.user.id, session.user.email, session.user.user_metadata);
    return currentUser;
  }
  return null;
};

export const isAdmin = () => {
  return currentUser?.role === 'admin';
};
