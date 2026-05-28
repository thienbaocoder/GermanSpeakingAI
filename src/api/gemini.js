import { saveMistake } from '../database/services/learningService';
import { getAdminGeminiApiKey } from '../config/adminApi';

// ============ API CONFIGURATION ============
const GEMINI_API_VERSION = 'v1';
const GEMINI_MODEL = 'gemini-3.5-flash';
const CLEAN_JSON_REGEX = /^\s*```(?:json)?([\s\S]*?)```\s*$/;

// ============ UTILITIES ============

const cleanAndParseJSON = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('INVALID_AI_RESPONSE');
  }

  let cleaned = text.trim();

  const match = cleaned.match(CLEAN_JSON_REGEX);
  if (match) {
    cleaned = match[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    try {
      const firstObjectIndex = cleaned.indexOf('{');
      const firstArrayIndex = cleaned.indexOf('[');

      let startIndex = -1;

      if (firstObjectIndex === -1) {
        startIndex = firstArrayIndex;
      } else if (firstArrayIndex === -1) {
        startIndex = firstObjectIndex;
      } else {
        startIndex = Math.min(firstObjectIndex, firstArrayIndex);
      }

      if (startIndex === -1) {
        throw new Error('NO_JSON_FOUND');
      }

      const startChar = cleaned[startIndex];
      const endIndex =
        startChar === '{'
          ? cleaned.lastIndexOf('}')
          : cleaned.lastIndexOf(']');

      if (endIndex === -1 || endIndex <= startIndex) {
        throw new Error('JSON_NOT_CLOSED');
      }

      const jsonText = cleaned.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonText);
    } catch (secondError) {
      console.warn('Failed to parse JSON from AI response:', cleaned.substring(0, 300));
      throw new Error('INVALID_AI_RESPONSE');
    }
  }
};

const extractCardsFromAIResult = (parsed) => {
  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (Array.isArray(parsed?.cards)) {
    return parsed.cards;
  }

  if (Array.isArray(parsed?.flashcards)) {
    return parsed.flashcards;
  }

  return [];
};
/**
 * Build Gemini API URL
 */
const buildGeminiUrl = (apiKey) => {
  return `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
};

const requestTextFromGemini = async (url, promptText, maxOutputTokens = 4096) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        maxOutputTokens,
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API_ERROR_${response.status}: ${errorText.substring(0, 120)}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generatedText?.trim()) {
    throw new Error('EMPTY_RESPONSE: AI returned no content');
  }
  return generatedText;
};

/**
 * Normalize flashcard data
 */
const normalizeFlashcard = (card, index) => {
  return {
    id: card.id || `card_${Date.now()}_${index}`,
    question: card.question || '',
    translation: card.translation || '',
    hint: card.hint || '',
    suggestedStructure: card.suggestedStructure || 'Antwort:',
    difficulty: card.difficulty || 'A2',
    front: card.question || '',
    back: card.translation || '',
  };
};

/**
 * 1. Evaluate user spoken German response using Gemini multimodal capability
 */
export const evaluateSpokenGerman = async (base64Audio, question, suggestedStructure, level, apiKey) => {
  const resolvedApiKey = apiKey || await getAdminGeminiApiKey();
  const url = buildGeminiUrl(resolvedApiKey);

  const promptText = `
Bạn là một chuyên gia chấm điểm phát âm và giảng dạy tiếng Đức thân thiện dành cho người Việt Nam.
Hãy nghe file ghi âm phản hồi của người dùng cho câu hỏi tiếng Đức sau:
Câu hỏi: "${question}"
Cấu trúc gợi ý người dùng nên theo: "${suggestedStructure}"
Trình độ của người học: ${level} (AI chấm điểm nhẹ tay phù hợp với trình độ này).

Nhiệm vụ của bạn:
1. Phiên âm chính xác những gì người dùng đã phát âm trong file ghi âm (transcript).
2. Dịch câu nói của người dùng sang tiếng Việt (translation).
3. Đánh giá phát âm (pronunciationScore), ngữ pháp (grammarScore), và từ vựng (vocabularyScore) trên thang điểm 0-100.
4. Tính điểm tổng quan (overallScore).
5. Nhận xét chi tiết bằng tiếng Việt về phát âm và ngữ pháp.
6. Đưa ra 1 câu sửa lại chuẩn xác bằng tiếng Đức (correctionSuggested).
7. Giải thích cấu trúc đề xuất bằng tiếng Việt (correctionExplanation).

Trả về JSON:
{
  "transcript": "...",
  "translation": "...",
  "pronunciationScore": 85,
  "grammarScore": 80,
  "vocabularyScore": 80,
  "overallScore": 82,
  "grammarFeedback": "...",
  "pronunciationFeedback": "...",
  "correctionSuggested": "...",
  "correctionExplanation": "..."
}
`;

  try {
    console.log('Evaluating spoken German...');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/mp4',
                  data: base64Audio,
                },
              },
              { text: promptText },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('   evaluateSpokenGerman API Error:');
      console.error('   Status:', response.status);
      console.error('   Body:', errorText.substring(0, 300));
      throw new Error(`API ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('INVALID_RESPONSE: Missing text content');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    const result = cleanAndParseJSON(generatedText);

    console.log('Evaluation completed, score:', result.overallScore);
    return result;
  } catch (error) {
    console.error('Error in evaluateSpokenGerman:', error.message);
    throw error; // THROW instead of return null
  }
};


/**
 * Tạo chủ đề + flashcard ngẫu nhiên (dùng API key admin).
 */
export const generateRandomTopicWithFlashcards = async (level) => {
  const apiKey = await getAdminGeminiApiKey();
  const url = buildGeminiUrl(apiKey);

  const promptText = `
Bạn là giáo viên dạy tiếng Đức chuyên nghiệp.

Hãy chọn NGẪU NHIÊN một tình huống giao tiếp thực tế phù hợp trình độ ${level}, sau đó soạn đúng 5 thẻ flashcard luyện nói tiếng Đức.

BẮT BUỘC chỉ trả về JSON object hợp lệ, không markdown, không giải thích bên ngoài.

Format bắt buộc:
{
  "topicTitle": "Tên chủ đề tiếng Việt ngắn gọn",
  "topicTitleDe": "Tên chủ đề tiếng Đức",
  "cards": [
    {
      "id": "c1",
      "question": "Câu hỏi tiếng Đức",
      "translation": "Dịch tiếng Việt",
      "hint": "Gợi ý từ vựng tiếng Việt",
      "suggestedStructure": "Cấu trúc câu mẫu tiếng Đức",
      "difficulty": "${level}"
    }
  ]
}

Yêu cầu:
- cards phải có đúng 5 phần tử.
- Mỗi card phải có đủ question, translation, hint, suggestedStructure, difficulty.
- Không dùng markdown.
- Không thêm chữ giải thích ngoài JSON.
`;

  try {
    console.log('Generating random topic, level:', level);

    const generatedText = await requestTextFromGemini(url, promptText, 4096);
    const parsed = cleanAndParseJSON(generatedText);
    const cards = extractCardsFromAIResult(parsed);

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('NO_CARDS_GENERATED');
    }

    const normalizedCards = cards.map((card, index) =>
      normalizeFlashcard(card, index)
    );

    return {
      topicTitle: parsed?.topicTitle || parsed?.topic || 'Chủ đề ngẫu nhiên',
      topicTitleDe: parsed?.topicTitleDe || '',
      cards: normalizedCards,
    };
  } catch (error) {
    console.warn('Error in generateRandomTopicWithFlashcards:', error.message);
    throw error;
  }
};

export const generateCustomFlashcards = async (topicPrompt, level) => {
  const apiKey = await getAdminGeminiApiKey();
  const url = buildGeminiUrl(apiKey);

  const promptText = `
Bạn là giáo viên dạy tiếng Đức chuyên nghiệp.

Hãy soạn đúng 5 thẻ flashcard luyện nói tiếng Đức về chủ đề/tình huống sau:
Chủ đề: "${topicPrompt}"
Trình độ: ${level}

BẮT BUỘC chỉ trả về JSON object hợp lệ, không markdown, không giải thích bên ngoài.

Format bắt buộc:
{
  "topicTitle": "${topicPrompt}",
  "topicTitleDe": "Tên chủ đề bằng tiếng Đức",
  "cards": [
    {
      "id": "c1",
      "question": "Câu hỏi tiếng Đức",
      "translation": "Dịch tiếng Việt",
      "hint": "Gợi ý từ vựng tiếng Việt",
      "suggestedStructure": "Cấu trúc câu mẫu tiếng Đức",
      "difficulty": "${level}"
    }
  ]
}

Yêu cầu:
- cards phải có đúng 5 phần tử.
- Câu hỏi phải phù hợp trình độ ${level}.
- Mỗi card phải có đủ question, translation, hint, suggestedStructure, difficulty.
- Không dùng markdown.
- Không thêm chữ giải thích ngoài JSON.
`;

  try {
    console.log('Generating flashcards for topic:', topicPrompt, 'Level:', level);
    console.log('Using API endpoint:', url.split('?')[0]);
    console.log('Using model:', GEMINI_MODEL);

    const generatedText = await requestTextFromGemini(url, promptText, 4096);
    const parsed = cleanAndParseJSON(generatedText);
    const cards = extractCardsFromAIResult(parsed);

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('NO_CARDS_GENERATED');
    }

    const normalizedCards = cards.map((card, index) =>
      normalizeFlashcard(card, index)
    );

    console.log('Flashcards ready, count:', normalizedCards.length);
    return normalizedCards;
  } catch (error) {
    console.warn('Error in generateCustomFlashcards:', error.message);
    throw error;
  }
};


export const extractAndSaveMistakes = async (evaluation, topic = 'General', transcriptVN = '') => {
  try {
    const mistakes = [];

    // Extract pronunciation mistakes if score is low
    if (evaluation.pronunciationScore < 75) {
      mistakes.push({
        topic,
        type: 'pronunciation',
        incorrectPhrase: evaluation.transcript,
        correctedPhrase: evaluation.correctionSuggested,
        explanation: evaluation.pronunciationFeedback || evaluation.correctionExplanation,
      });
    }

    // Extract grammar mistakes if score is low
    if (evaluation.grammarScore < 75) {
      mistakes.push({
        topic,
        type: 'grammar',
        incorrectPhrase: evaluation.transcript,
        correctedPhrase: evaluation.correctionSuggested,
        explanation: evaluation.grammarFeedback || evaluation.correctionExplanation,
        translation: transcriptVN || evaluation.translation,
      });
    }

    // Extract vocabulary mistakes if score is low
    if (evaluation.vocabularyScore < 75) {
      mistakes.push({
        topic,
        type: 'vocabulary',
        incorrectPhrase: evaluation.transcript,
        correctedPhrase: evaluation.correctionSuggested,
        explanation: evaluation.correctionExplanation,
      });
    }

    // Save all mistakes to database
    for (const mistake of mistakes) {
      await saveMistake(mistake);
    }

    return mistakes;
  } catch (error) {
    console.error('Error extracting and saving mistakes:', error);
    return [];
  }
};

export const generateVocabularyByTopic = async (level, topic, wordType) => {
  const apiKey = await getAdminGeminiApiKey();
  const url = buildGeminiUrl(apiKey);

  const promptText = `
Bạn là giáo viên luyện thi Goethe tiếng Đức.
Hãy tạo danh sách từ vựng theo thông tin:
- Trình độ: ${level}
- Chủ đề: ${topic}
- Nhóm từ: ${wordType} (verb | adjective | noun)

Yêu cầu:
1. Tạo đúng 12 mục, thiên về cụm từ dùng hằng ngày + thường gặp trong đề Goethe.
2. Mỗi mục cần có:
   - term: từ/cụm từ tiếng Đức
   - article: chỉ dùng cho danh từ (der/die/das), các loại khác để ""
   - meaning: nghĩa tiếng Việt
   - example: 1 câu mẫu tiếng Đức ngắn, tự nhiên
   - usage: giải thích cách dùng bằng tiếng Việt, ngắn gọn
3. Không markdown, chỉ trả JSON object đúng format:
{
  "topicTitle": "...",
  "wordType": "${wordType}",
  "items": [
    { "term": "...", "article": "", "meaning": "...", "example": "...", "usage": "..." }
  ]
}
`;

  const generatedText = await requestTextFromGemini(url, promptText);
  const parsed = cleanAndParseJSON(generatedText);

  if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
    throw new Error('NO_VOCAB_ITEMS');
  }

  return {
    topicTitle: parsed.topicTitle || topic,
    wordType: parsed.wordType || wordType,
    items: parsed.items.map((item, index) => ({
      id: `${Date.now()}_${index}`,
      term: item.term || '',
      article: item.article || '',
      meaning: item.meaning || '',
      example: item.example || '',
      usage: item.usage || '',
    })),
  };
};

export const generateWritingPromptByLevel = async (level, taskType) => {
  const apiKey = await getAdminGeminiApiKey();
  const url = buildGeminiUrl(apiKey);
  const promptText = `
Bạn là giám khảo Goethe tiếng Đức.
Hãy tạo 1 đề bài luyện Schreiben phù hợp trình độ ${level}, dạng ${taskType}.

Trả về JSON:
{
  "title": "Tên đề ngắn",
  "taskType": "${taskType}",
  "instruction": "Mô tả đề bằng tiếng Việt, rõ yêu cầu",
  "requirements": ["ý 1", "ý 2", "ý 3"],
  "suggestedLength": "80-120 từ"
}
Không markdown, không text ngoài JSON.
`;

  const generatedText = await requestTextFromGemini(url, promptText, 1200);
  return cleanAndParseJSON(generatedText);
};

export const evaluateWritingSubmission = async (level, taskTitle, instruction, userText) => {
  const apiKey = await getAdminGeminiApiKey();
  const url = buildGeminiUrl(apiKey);
  const promptText = `
Bạn là giám khảo Goethe, chấm bài viết tiếng Đức cho học viên trình độ ${level}.
Đề bài: ${taskTitle}
Yêu cầu đề: ${instruction}
Bài làm học viên:
"""
${userText}
"""

Hãy phản hồi JSON:
{
  "overallScore": 0-100,
  "grammarScore": 0-100,
  "vocabularyScore": 0-100,
  "taskAchievementScore": 0-100,
  "feedback": "Nhận xét tổng quát bằng tiếng Việt",
  "correctedVersion": "Bài đã chỉnh sửa chuẩn hơn (tiếng Đức)",
  "keyMistakes": [
    { "original": "...", "fixed": "...", "explanation": "..." }
  ],
  "improvementTips": ["...", "...", "..."]
}
Chỉ JSON, không markdown.
`;

  const generatedText = await requestTextFromGemini(url, promptText, 3000);
  return cleanAndParseJSON(generatedText);
};
