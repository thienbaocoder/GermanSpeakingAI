import { saveMistake } from '../utils/storage';

// ============ API CONFIGURATION ============
const GEMINI_API_VERSION = 'v1'; // 
const GEMINI_MODEL = 'gemini-3.5-flash'; 
const CLEAN_JSON_REGEX = /^\s*```(?:json)?([\s\S]*?)```\s*$/;

// ============ UTILITIES ============

const cleanAndParseJSON = (text) => {
  try {
    let cleaned = text.trim();
    // Remove markdown code blocks if present
    const match = cleaned.match(CLEAN_JSON_REGEX);
    if (match) {
      cleaned = match[1].trim();
    }
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse JSON from text:', text.substring(0, 200));
    throw new Error(`JSON_PARSE_ERROR: ${error.message}`);
  }
};

/**
 * Build Gemini API URL
 */
const buildGeminiUrl = (apiKey) => {
  return `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
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
  const url = buildGeminiUrl(apiKey);

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
    console.log('🎤 Evaluating spoken German...');
    
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
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ evaluateSpokenGerman API Error:');
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
    
    console.log('✅ Evaluation completed, score:', result.overallScore);
    return result;
  } catch (error) {
    console.error('❌ Error in evaluateSpokenGerman:', error.message);
    throw error; // ✅ THROW instead of return null
  }
};


export const generateCustomFlashcards = async (topicPrompt, level, apiKey) => {
  const url = buildGeminiUrl(apiKey);

  const promptText = `
Bạn là giáo viên dạy tiếng Đức chuyên nghiệp. Hãy soạn đúng 5 thẻ flashcard luyện nói tiếng Đức về chủ đề/tình huống sau:
Chủ đề: "${topicPrompt}"
Trình độ: ${level}

Mỗi thẻ phải có:
1. question: Câu hỏi tiếng Đức
2. translation: Dịch sang tiếng Việt
3. hint: Gợi ý từ vựng (tiếng Việt)
4. suggestedStructure: Cấu trúc câu tiếng Đức mẫu
5. difficulty: Trình độ ("${level}")

BẮT BUỘC: Trả về JSON array (KHÔNG có markdown, KHÔNG có text bên ngoài):
[
  {
    "id": "c1",
    "question": "Wie heißen Sie?",
    "translation": "Tên của bạn là gì?",
    "hint": "Sử dụng 'heißen' - nghĩa là tên, cấu trúc Wie + động từ + chủ từ",
    "suggestedStructure": "Ich heiße...",
    "difficulty": "${level}"
  },
  ...tối thiểu 5 thẻ
]
`;

  try {
    console.log('Generating flashcards for topic:', topicPrompt, 'Level:', level);
    console.log('Using API endpoint:', url.split('?')[0]);
    console.log('Using model:', GEMINI_MODEL);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('   generateCustomFlashcards API Error:');
      console.error('   Status Code:', response.status);
      console.error('   Status Text:', response.statusText || '(empty)');
      console.error('   Response Body:', errorText.substring(0, 500));
      
      // Try to parse as JSON for error details
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          console.error('   Error Message:', errorJson.error.message);
        }
      } catch (e) {
        // Not JSON, already logged
      }

      //  Check for model not found error
      if (response.status === 404 || errorText.includes('not found')) {
        throw new Error(
          `MODEL_NOT_FOUND_404: Model "${GEMINI_MODEL}" is not available. ` +
          `Update GEMINI_MODEL in src/api/gemini.js. ` +
          `Available models: gemini-2.0-flash, gemini-1.5-flash-latest, etc.`
        );
      }

      throw new Error(`API_ERROR_${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    
    // SAFE NESTED PROPERTY ACCESS
    if (!data.candidates?.length || !data.candidates[0].content?.parts?.length) {
      console.error('Invalid response structure:', JSON.stringify(data).substring(0, 300));
      throw new Error(
        'INVALID_RESPONSE_STRUCTURE: ' +
        'Response missing candidates[0].content.parts[0]'
      );
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    if (!generatedText || generatedText.trim().length === 0) {
      console.error('API returned empty text');
      throw new Error('EMPTY_RESPONSE: AI returned no content');
    }

    console.log('   Parsing AI response...');
    console.log('   Raw text length:', generatedText.length);
    
    const cards = cleanAndParseJSON(generatedText);
    
    // VALIDATE PARSED DATA
    if (!Array.isArray(cards)) {
      console.error(' Parsed data is not array, type:', typeof cards);
      throw new Error(
        `INVALID_FORMAT: Expected array, got ${typeof cards}. ` +
        `Ensure API returns JSON array: [{ id, question, ... }, ...]`
      );
    }

    if (cards.length === 0) {
      console.warn('API returned empty array');
      throw new Error(
        'NO_CARDS: API generated 0 flashcards. ' +
        'Try with a different topic or check API quota.'
      );
    }

    console.log(`Successfully parsed ${cards.length} flashcards`);
    
    // NORMALIZE AND RETURN
    const normalizedCards = cards.map((card, index) => 
      normalizeFlashcard(card, index)
    );

    console.log('Flashcards ready, count:', normalizedCards.length);
    return normalizedCards;
    
  } catch (error) {
    console.error('   Error in generateCustomFlashcards:');
    console.error('   Message:', error.message);
    console.error('   Full:', error);
    
    // THROW error instead of return null
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
