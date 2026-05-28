export {
  initSupabase,

  getApiKey,
  saveApiKey,
  getLevel,
  saveLevel,
  getLanguage,
  saveLanguage,

  getHistory,
  addHistoryRecord,
  clearHistory,

  getWritingHistory,
  addWritingHistoryRecord,
  getWritingHistoryForCurrentUser,
  clearWritingHistoryForCurrentUser,

  signUp,
  logIn,
  logOut,
  getCurrentUser,
  getUsersDB,

  getMistakesDB,
  saveMistake,
  getMistakesForCurrentUser,
  getMistakesForTopic,
  updateMistakeFrequency,
  clearMistakes,

  addVocabularyProgress,
  getVocabularyProgress,
  updateVocabularyProgress,
  getLearnedWords,

  savePracticeSession,
  getPracticeHistory,
  getPracticeStats,
  clearPracticeHistory,

  saveEvaluationResult,
  getEvaluationResults,
  getEvaluationStats,
  clearEvaluationResults,

  getUserSettings,
  initializeUserSettings,
  updateUserLevel,
  updateUserLanguage,
  saveApiKeyToSettings,
} from '../database/supabaseStorage';