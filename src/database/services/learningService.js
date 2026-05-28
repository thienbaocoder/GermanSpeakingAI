import { supabase } from '../supabaseClient';

// ============ WRITING HISTORY ============

export const addWritingHistoryRecord = async (record) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('writing_history')
      .insert([
        {
          user_id: user.id,
          topic: record.meta?.title || record.meta?.taskType || 'Schreiben',
          content: record.essay || '',
          score: record.result?.overallScore || 0,
          meta: record.meta || {},
          prompt: record.prompt || {},
          essay: record.essay || '',
          result: record.result || {},
          created_at: record.meta?.date || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      meta: data.meta,
      prompt: data.prompt,
      essay: data.essay || data.content,
      result: data.result,
      date: data.created_at,
    };
  } catch (error) {
    console.error('Error adding writing history record', error);
    return null;
  }
};

export const getWritingHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('writing_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return (data || []).map((item) => ({
      id: item.id,
      meta: item.meta || {
        title: item.topic || 'Schreiben',
        taskType: item.topic || 'Schreiben',
        date: item.created_at,
        wordCount: item.content ? item.content.trim().split(/\s+/).length : 0,
      },
      prompt: item.prompt || {},
      essay: item.essay || item.content || '',
      result: item.result || {
        overallScore: item.score || 0,
      },
      date: item.created_at,
    }));
  } catch (error) {
    console.error('Error fetching writing history', error);
    return [];
  }
};

export const clearWritingHistoryForCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return true;

    const { error } = await supabase
      .from('writing_history')
      .delete()
      .eq('user_id', user.id);

    return !error;
  } catch (error) {
    return false;
  }
};

// ============ MISTAKES ============

export const getMistakesDB = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('mistakes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((m) => ({
      id: m.id,
      userId: m.user_id,
      topic: m.topic,
      type: m.type,
      incorrectPhrase: m.incorrect_phrase,
      correctedPhrase: m.corrected_phrase,
      explanation: m.explanation,
      frequency: m.frequency || 1,
      lastReviewedAt: m.last_reviewed_at,
      createdAt: m.created_at,
    }));
  } catch (error) {
    console.error('Error getting mistakes DB:', error);
    return [];
  }
};

export const getMistakesForCurrentUser = async () => {
  return getMistakesDB();
};

export const saveMistake = async (mistake) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('mistakes')
      .insert([
        {
          user_id: user.id,
          topic: mistake.topic || 'General',
          type: mistake.type,
          incorrect_phrase: mistake.incorrectPhrase,
          corrected_phrase: mistake.correctedPhrase,
          explanation: mistake.explanation,
          frequency: 1,
          last_reviewed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    return null;
  }
};

export const updateMistakeFrequency = async (mistakeId) => {
  try {
    const { data: mistake, error: fetchError } = await supabase
      .from('mistakes')
      .select('frequency')
      .eq('id', mistakeId)
      .single();

    if (fetchError) throw fetchError;

    const { data: updated, error: updateError } = await supabase
      .from('mistakes')
      .update({
        frequency: (mistake.frequency || 0) + 1,
        last_reviewed_at: new Date().toISOString(),
      })
      .eq('id', mistakeId)
      .select();

    if (updateError) throw updateError;
    return updated?.[0] || null;
  } catch (error) {
    return null;
  }
};

export const clearMistakes = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return true;

    const { error } = await supabase
      .from('mistakes')
      .delete()
      .eq('user_id', user.id);

    return !error;
  } catch (error) {
    return false;
  }
};

// ============ VOCABULARY PROGRESS ============

export const addVocabularyProgress = async (wordData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_vocabulary_progress')
      .insert([
        {
          user_id: user.id,
          topic: wordData.topic,
          word_id: wordData.wordId,
          level: wordData.level || 'A1',
          learned_at: new Date().toISOString(),
          review_count: 0,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    return null;
  }
};

export const getVocabularyProgress = async (topic = null) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('user_vocabulary_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (topic) {
      query = query.eq('topic', topic);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    return [];
  }
};

// ============ PRACTICE SESSIONS ============

export const savePracticeSession = async (sessionData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('practice_history')
      .insert([
        {
          user_id: user.id,
          topic: sessionData.topic,
          word_type: sessionData.wordType,
          correct_count: sessionData.correctCount || 0,
          total_count: sessionData.totalCount || 0,
          score: sessionData.score || 0,
          duration_seconds: sessionData.durationSeconds || 0,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    return null;
  }
};

export const getPracticeHistory = async (limit = 100) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('practice_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    return [];
  }
};

export const clearPracticeHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return true;

    const { error } = await supabase
      .from('practice_history')
      .delete()
      .eq('user_id', user.id);

    return !error;
  } catch (error) {
    return false;
  }
};

// ============ EVALUATIONS ============

export const saveEvaluationResult = async (evaluationData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('evaluation_results')
      .insert([
        {
          user_id: user.id,
          essay_id: evaluationData.essayId || Date.now().toString(),
          overall_score: evaluationData.overallScore || 0,
          grammar_score: evaluationData.grammarScore || 0,
          vocabulary_score: evaluationData.vocabularyScore || 0,
          task_achievement_score: evaluationData.taskAchievementScore || 0,
          feedback: evaluationData.feedback || '',
          key_mistakes: evaluationData.keyMistakes || [],
          improvement_tips: evaluationData.improvementTips || [],
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    return null;
  }
};

export const getEvaluationResults = async (limit = 50) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('evaluation_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    return [];
  }
};

// ============ GRAMMAR ============

export const getGrammarLessons = async (level) => {
  try {
    const { data, error } = await supabase
      .from('grammar_lessons')
      .select('*')
      .eq('level', level)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching grammar lessons:', error);
    return [];
  }
};
