import { supabase } from '../supabaseClient';

// ============ SPEAKING TOPICS ============

export const getAllSpeakingTopics = async () => {
    const { data, error } = await supabase
        .from('speaking_topics')
        .select('*')
        .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const upsertSpeakingTopic = async (topicData, id = null) => {
    if (id) {
        const { data, error } = await supabase
            .from('speaking_topics')
            .update(topicData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from('speaking_topics')
            .insert([topicData])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

export const deleteSpeakingTopic = async (id) => {
    const { error } = await supabase
        .from('speaking_topics')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
};

// ============ VOCABULARY ITEMS ============

export const getVocabularyItems = async (level, topic) => {
    const { data, error } = await supabase
        .from('vocabulary_items')
        .select('*')
        .eq('level', level)
        .eq('topic', topic)
        .order('term', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const getUniqueVocabularyTopics = async () => {
    const { data, error } = await supabase
        .from('vocabulary_items')
        .select('topic');
    if (error) throw error;
    return [...new Set(data.map(item => item.topic))].sort();
};

export const upsertVocabularyItem = async (itemData, id = null) => {
    if (id) {
        const { data, error } = await supabase
            .from('vocabulary_items')
            .update(itemData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from('vocabulary_items')
            .insert([itemData])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

export const deleteVocabularyItem = async (id) => {
    const { error } = await supabase
        .from('vocabulary_items')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
};

// ============ WRITING PROMPTS ============

export const getWritingPrompts = async (level) => {
    const { data, error } = await supabase
        .from('writing_prompts')
        .select('*')
        .eq('level', level)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const upsertWritingPrompt = async (promptData, id = null) => {
    if (id) {
        const { data, error } = await supabase
            .from('writing_prompts')
            .update(promptData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from('writing_prompts')
            .insert([promptData])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

export const deleteWritingPrompt = async (id) => {
    const { error } = await supabase
        .from('writing_prompts')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
};

// ============ USERS & ROLES ============

export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
};

export const updateUserRole = async (userId, role) => {
    const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

// ============ GRAMMAR LESSONS ============

export const getGrammarLessonsAdmin = async (level = null) => {
    let query = supabase
        .from('grammar_lessons')
        .select('*')
        .order('level', { ascending: true })
        .order('sort_order', { ascending: true });
    
    if (level) {
        query = query.eq('level', level);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

export const upsertGrammarLesson = async (lessonData, id = null) => {
    if (id) {
        const { data, error } = await supabase
            .from('grammar_lessons')
            .update(lessonData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from('grammar_lessons')
            .insert([lessonData])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

export const deleteGrammarLesson = async (id) => {
    const { error } = await supabase
        .from('grammar_lessons')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
};
