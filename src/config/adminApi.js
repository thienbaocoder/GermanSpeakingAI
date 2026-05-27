import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_KEY_STORAGE = '@admin_gemini_api_key';

/**
 * API key Gemini của admin — dùng cho tạo chủ đề / flashcard AI.
 * Điền key tại đây hoặc lưu qua Cài đặt (tài khoản admin).
 */
export const ADMIN_GEMINI_API_KEY = 'AIzaSyAask6Fhdb8D87qMOjCgBwFrxoEa9P-ITs';

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
