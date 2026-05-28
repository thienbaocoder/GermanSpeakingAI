import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_KEY_STORAGE = '@admin_gemini_api_key';

export const ADMIN_GEMINI_API_KEY = process.env.ADMIN_GEMINI_API_KEY;

export const saveAdminGeminiApiKey = async (key) => {
  await AsyncStorage.setItem(ADMIN_KEY_STORAGE, key.trim());
};

export const getAdminGeminiApiKey = async () => {
  const fromStorage = await AsyncStorage.getItem(ADMIN_KEY_STORAGE);
  const key = (ADMIN_GEMINI_API_KEY || fromStorage || '').trim();
  if (!key) {
    throw new Error('ADMIN_API_KEY_MISSING');
  }
  return key;
};
