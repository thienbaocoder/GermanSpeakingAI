import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  GEMINI_API_KEY: '@gemini_api_key',
  USER_LEVEL: '@user_level',
  APP_LANG: '@app_lang',
  PRACTICE_HISTORY: '@practice_history',
  CURRENT_USER: '@current_user',
  USERS_DB: '@users_db',
  MISTAKES_DB: '@mistakes_db',
};

export const getApiKey = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.GEMINI_API_KEY) || '';
  } catch (error) {
    console.error('Error fetching API key', error);
    return '';
  }
};

export const saveApiKey = async (key) => {
  try {
    await AsyncStorage.setItem(KEYS.GEMINI_API_KEY, key);
    return true;
  } catch (error) {
    console.error('Error saving API key', error);
    return false;
  }
};

export const getLevel = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.USER_LEVEL) || 'A2';
  } catch (error) {
    console.error('Error fetching level', error);
    return 'A2';
  }
};

export const saveLevel = async (level) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_LEVEL, level);
    return true;
  } catch (error) {
    console.error('Error saving level', error);
    return false;
  }
};

export const getLanguage = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.APP_LANG) || 'vn';
  } catch (error) {
    console.error('Error fetching language', error);
    return 'vn';
  }
};

export const saveLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(KEYS.APP_LANG, lang);
    return true;
  } catch (error) {
    console.error('Error saving language', error);
    return false;
  }
};

export const getHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(KEYS.PRACTICE_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error fetching history', error);
    return [];
  }
};

export const addHistoryRecord = async (record) => {
  try {
    const history = await getHistory();
    const newHistory = [
      { id: Date.now().toString(), date: new Date().toISOString(), ...record },
      ...history,
    ].slice(0, 50); // Keep last 50 entries
    await AsyncStorage.setItem(KEYS.PRACTICE_HISTORY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Error adding history record', error);
    return null;
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.PRACTICE_HISTORY);
    return true;
  } catch (error) {
    console.error('Error clearing history', error);
    return false;
  }
};

// ============ AUTHENTICATION FUNCTIONS ============

export const signUp = async (email, password, name) => {
  try {
    const usersDB = await getUsersDB();
    
    // Check if user already exists
    if (usersDB.some(u => u.email === email)) {
      throw new Error('Email đã được đăng ký');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, hash passwords!
      name,
      createdAt: new Date().toISOString(),
    };

    usersDB.push(newUser);
    await AsyncStorage.setItem(KEYS.USERS_DB, JSON.stringify(usersDB));
    
    // Auto login after signup
    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error: error.message };
  }
};

export const logIn = async (email, password) => {
  try {
    const usersDB = await getUsersDB();
    const user = usersDB.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true, user };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.CURRENT_USER);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUsersDB = async () => {
  try {
    const db = await AsyncStorage.getItem(KEYS.USERS_DB);
    return db ? JSON.parse(db) : [];
  } catch (error) {
    console.error('Error getting users DB:', error);
    return [];
  }
};

// ============ MISTAKES DATABASE FUNCTIONS ============

export const getMistakesDB = async () => {
  try {
    const db = await AsyncStorage.getItem(KEYS.MISTAKES_DB);
    return db ? JSON.parse(db) : [];
  } catch (error) {
    console.error('Error getting mistakes DB:', error);
    return [];
  }
};

export const saveMistake = async (mistake) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('No user logged in');

    const mistakesDB = await getMistakesDB();
    
    const newMistake = {
      id: Date.now().toString(),
      userId: currentUser.id,
      topic: mistake.topic || 'General',
      type: mistake.type, // 'pronunciation', 'grammar', 'vocabulary'
      incorrectPhrase: mistake.incorrectPhrase,
      correctedPhrase: mistake.correctedPhrase,
      explanation: mistake.explanation,
      frequency: 1,
      lastReviewedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    mistakesDB.push(newMistake);
    await AsyncStorage.setItem(KEYS.MISTAKES_DB, JSON.stringify(mistakesDB));
    
    return newMistake;
  } catch (error) {
    console.error('Error saving mistake:', error);
    return null;
  }
};

export const getMistakesForCurrentUser = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];

    const mistakesDB = await getMistakesDB();
    return mistakesDB.filter(m => m.userId === currentUser.id);
  } catch (error) {
    console.error('Error getting user mistakes:', error);
    return [];
  }
};

export const getMistakesForTopic = async (topic) => {
  try {
    const mistakes = await getMistakesForCurrentUser();
    return mistakes.filter(m => m.topic === topic);
  } catch (error) {
    console.error('Error getting mistakes for topic:', error);
    return [];
  }
};

export const updateMistakeFrequency = async (mistakeId) => {
  try {
    const mistakesDB = await getMistakesDB();
    const mistake = mistakesDB.find(m => m.id === mistakeId);
    
    if (mistake) {
      mistake.frequency += 1;
      mistake.lastReviewedAt = new Date().toISOString();
      await AsyncStorage.setItem(KEYS.MISTAKES_DB, JSON.stringify(mistakesDB));
    }
    
    return mistake;
  } catch (error) {
    console.error('Error updating mistake frequency:', error);
    return null;
  }
};

export const clearMistakes = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.MISTAKES_DB);
    return true;
  } catch (error) {
    console.error('Error clearing mistakes:', error);
    return false;
  }
};
