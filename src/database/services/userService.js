import { supabase } from '../supabaseClient';

export const getUserSettings = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return await initializeUserSettings(user.id);
    }

    return data;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return null;
  }
};

export const initializeUserSettings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          level: 'A2',
          language: 'vn',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing user settings:', error);
    return null;
  }
};

export const saveApiKey = async (apiKey) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          api_key: apiKey,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Save API key error:', error);
    return false;
  }
};

export const getApiKey = async () => {
  try {
    const settings = await getUserSettings();
    return settings?.api_key || '';
  } catch (error) {
    return '';
  }
};

export const saveLevel = async (level) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          level,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
};

export const getLevel = async () => {
  try {
    const settings = await getUserSettings();
    return settings?.level || 'A2';
  } catch (error) {
    return 'A2';
  }
};

export const saveLanguage = async (language) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          language,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
};

export const getLanguage = async () => {
  try {
    const settings = await getUserSettings();
    return settings?.language || 'vn';
  } catch (error) {
    return 'vn';
  }
};
