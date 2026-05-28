import { supabase } from './supabaseClient';

export const LEVEL_CONFIG = {
    A1: {
        label: 'A1 – Sơ cấp',
        vocabPerType: 4,
        targetWords: 50,
        minWords: 35,
        writingDurationSeconds: 10 * 60,
    },
    A2: {
        label: 'A2 – Giao tiếp cơ bản',
        vocabPerType: 6,
        targetWords: 100,
        minWords: 70,
        writingDurationSeconds: 15 * 60,
    },
    B1: {
        label: 'B1 – Trung cấp',
        vocabPerType: 8,
        targetWords: 150,
        minWords: 110,
        writingDurationSeconds: 20 * 60,
    },
    B2: {
        label: 'B2 – Trung cao',
        vocabPerType: 10,
        targetWords: 200,
        minWords: 150,
        writingDurationSeconds: 25 * 60,
    },
};

export const normalizeLevel = (level) => {
    const upper = (level || 'A2').toUpperCase();
    return LEVEL_CONFIG[upper] ? upper : 'A2';
};

export const getLevelDisplayConfig = (level) => {
    return LEVEL_CONFIG[normalizeLevel(level)];
};

export const getSpeakingTopicsFromDb = async () => {
    const { data: topics, error: topicError } = await supabase
        .from('speaking_topics')
        .select('*')
        .order('sort_order', { ascending: true });

    if (topicError) throw topicError;

    const { data: cards, error: cardError } = await supabase
        .from('speaking_cards')
        .select('*')
        .order('sort_order', { ascending: true });

    if (cardError) throw cardError;

    return (topics || []).map((topic) => {
        const topicCards = (cards || [])
            .filter((card) => card.topic_id === topic.id)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((card) => ({
                id: card.id,
                question: card.question,
                translation: card.translation,
                hint: card.hint,
                suggestedStructure: card.suggested_structure,
                difficulty: card.difficulty,
            }));

        return {
            id: topic.id,
            title: topic.title,
            titleDe: topic.title_de,
            description: topic.description,
            icon: topic.icon,
            gradient: [topic.color_1 || '#FFCC00', topic.color_2 || '#C9A000'],
            cards: topicCards,
        };
    });
};

export const getLearningTopicNamesFromDb = async () => {
    const { data, error } = await supabase
        .from('learning_topics')
        .select('title_vi, sort_order')
        .order('sort_order', { ascending: true });

    if (error) {
        console.warn('Cannot load learning_topics:', error.message);
    }

    const topicsFromTable = (data || [])
        .map((item) => item.title_vi)
        .filter(Boolean);

    if (topicsFromTable.length > 0) {
        return topicsFromTable;
    }

    // Fallback: nếu learning_topics rỗng thì lấy topic trực tiếp từ vocabulary_items
    const { data: vocabTopics, error: vocabError } = await supabase
        .from('vocabulary_items')
        .select('topic');

    if (vocabError) {
        console.error('Cannot load topics from vocabulary_items:', vocabError.message);
        throw vocabError;
    }

    return [...new Set((vocabTopics || []).map((item) => item.topic).filter(Boolean))];
};

export const getVocabularyItemsFromDb = async (level, topic, wordType) => {
    const cleanLevel = (level || 'A2').toUpperCase();

    console.log('Fetching vocab with:', {
        level: cleanLevel,
        topic,
        wordType,
    });

    const { data, error } = await supabase
        .from('vocabulary_items')
        .select('*')
        .eq('level', cleanLevel)
        .eq('topic', topic)
        .eq('word_type', wordType)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Vocabulary fetch error:', error);
        throw error;
    }

    console.log('Vocabulary fetched:', data?.length || 0);

    return (data || []).map((item) => ({
        id: item.id,
        term: item.term,
        article: item.article || '',
        meaning: item.meaning,
        example: item.example || '',
        usage: item.usage || '',
    }));
};

export const getWritingPromptFromDb = async (level, taskType) => {
    const cleanLevel = normalizeLevel(level);

    const { data, error } = await supabase
        .from('writing_prompts')
        .select('*')
        .eq('level', cleanLevel)
        .eq('task_type', taskType)
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        throw new Error(`Không tìm thấy đề viết cho ${cleanLevel} - ${taskType}`);
    }

    const config = getLevelDisplayConfig(cleanLevel);

    return {
        id: data.id,
        level: data.level,
        taskType: data.task_type,
        title: data.title,
        instruction: data.instruction,
        requirements: data.requirements || [],
        suggestedLength: data.suggested_length || '',
        targetWords: data.target_words || config.targetWords,
        minWords: data.min_words || config.minWords,
        durationSeconds: data.duration_seconds || config.writingDurationSeconds,
    };
};