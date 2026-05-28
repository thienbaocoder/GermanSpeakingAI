import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import {
  User,
  ShoppingBag,
  Utensils,
  MapPin,
  Sparkles,
  BookOpen,
  ChevronRight,
  Settings,
  Shuffle,
  PenLine,
  RotateCw,
  GraduationCap,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import { getSpeakingTopicsFromDb } from '../database/learningDbService';
import * as storage from '../database/services';
import { generateCustomFlashcards, generateRandomTopicWithFlashcards } from '../api/gemini';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - SPACING.md * 3) / 2;

export default function HomeScreen({ navigation }) {
  const [userLevel, setUserLevel] = useState('A2');
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      async function loadHomeData() {
        try {
          setLoadingTopics(true);

          const storedLevel = await storage.getLevel();
          const dbTopics = await getSpeakingTopicsFromDb();

          setUserLevel(storedLevel || 'A2');
          setTopics(dbTopics);
        } catch (error) {
          console.error('Load home data error:', error);
          Alert.alert('Lỗi', 'Không thể tải chủ đề luyện nói từ Supabase.');
        } finally {
          setLoadingTopics(false);
        }
      }

      loadHomeData();
    });

    return unsubscribe;
  }, [navigation]);

  // Dynamic icon selector based on mock icon string
  const renderIcon = (iconName, color) => {
    switch (iconName) {
      case 'User': return <User color={color} size={24} />;
      case 'ShoppingBag': return <ShoppingBag color={color} size={24} />;
      case 'Utensils': return <Utensils color={color} size={24} />;
      case 'MapPin': return <MapPin color={color} size={24} />;
      default: return <BookOpen color={color} size={24} />;
    }
  };

  const handleSelectPredefinedTopic = (topic) => {
    navigation.navigate('Practice', {
      topicTitle: topic.title,
      cards: topic.cards
    });
  };

  const handleOpenVocabulary = () => navigation.navigate('Vocabulary');
  const handleOpenWriting = () => navigation.navigate('Writing');
  const handleOpenReview = () => navigation.navigate('Review');
  const handleOpenGrammar = () => navigation.navigate('Grammar');

  const getAiErrorMessage = (error) => {
    if (error.message?.includes('ADMIN_API_KEY_MISSING')) {
      return 'Chưa cấu hình API key admin. Liên hệ quản trị viên để bật tính năng tạo chủ đề bằng AI.';
    }
    if (error.message?.includes('MODEL_NOT_FOUND_404')) {
      return (
        'Lỗi mô hình API: Model Gemini không hợp lệ.\n\n' +
        'Kiểm tra GEMINI_MODEL trong src/api/gemini.js (vd: gemini-3.5-flash).'
      );
    }
    if (error.message?.includes('API_ERROR_401') || error.message?.includes('API_ERROR_403')) {
      return 'API key admin không hợp lệ. Liên hệ quản trị viên.';
    }
    if (error.message?.includes('API_ERROR_429')) {
      return 'API quota hết. Hãy đợi hoặc liên hệ quản trị viên.';
    }
    if (error.message?.includes('INVALID_RESPONSE_STRUCTURE')) {
      return 'API trả về dữ liệu không hợp lệ. Vui lòng thử lại.';
    }
    if (error.message?.includes('JSON_PARSE_ERROR')) {
      return 'AI trả về dữ liệu không hợp lệ. Thử lại với chủ đề khác.';
    }
    if (error.message?.includes('NO_CARDS') || error.message?.includes('Empty')) {
      return 'AI không tạo được flashcard. Hãy thử chủ đề khác hoặc thử lại sau.';
    }
    if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      return 'Lỗi kết nối mạng. Kiểm tra internet và thử lại.';
    }
    if (error.message?.includes('INVALID_AI_RESPONSE')) {
      return 'AI trả về dữ liệu không đúng định dạng JSON. Vui lòng thử lại.';
    }

    if (error.message?.includes('NO_CARDS_GENERATED')) {
      return 'AI không tạo được flashcard. Hãy thử chủ đề khác hoặc thử lại sau.';
    }
    return error.message;
  };

  const handleGenerateCustomTopic = async () => {
    if (!customTopic.trim()) {
      Alert.alert('Nhập chủ đề', 'Vui lòng nhập chủ đề bạn muốn luyện tập.');
      return;
    }

    try {
      setIsGenerating(true);

      const topicName = customTopic.trim();

      console.log('Generating flashcards for topic:', topicName);
      const generatedCards = await generateCustomFlashcards(topicName, userLevel);

      // VALIDATE RESPONSE (function now throws errors, so null check isn't needed)
      // But keep defensive checks in case
      if (!generatedCards || !Array.isArray(generatedCards) || generatedCards.length === 0) {
        throw new Error(
          'AI không thể tạo flashcard cho chủ đề này. Hãy thử:\n' +
          '- Nhập chủ đề chi tiết hơn\n' +
          '- Dùng từ khóa khác\n' +
          '- Kiểm tra API Key lại'
        );
      }

      console.log(`Successfully generated ${generatedCards.length} cards, navigating to Practice`);

      // CLEAR INPUT AFTER SUCCESS
      setCustomTopic('');

      // NAVIGATE WITH CORRECT TOPIC NAME
      navigation.navigate('Practice', {
        topicTitle: topicName,
        cards: generatedCards
      });

    } catch (error) {
      console.warn('Error in handleGenerateCustomTopic:', error.message);
      Alert.alert('Tạo chủ đề thất bại', getAiErrorMessage(error));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRandomTopic = async () => {
    try {
      setIsGeneratingRandom(true);
      console.log('Generating random topic, level:', userLevel);
      const { topicTitle, cards } = await generateRandomTopicWithFlashcards(userLevel);

      if (!cards?.length) {
        throw new Error('NO_CARDS');
      }

      navigation.navigate('Practice', {
        topicTitle,
        cards,
      });
    } catch (error) {
      console.warn('Error in handleGenerateRandomTopic:', error.message);
      Alert.alert('Tạo chủ đề ngẫu nhiên thất bại', getAiErrorMessage(error));
    } finally {
      setIsGeneratingRandom(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      {/* Top Header Row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>“Học thêm 1 cái mới, sống thêm 1 cuộc đời”</Text>
          <Text style={styles.title}>Luyện nói Deutsch</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Settings color={COLORS.text} size={22} />
        </TouchableOpacity>
      </View>

      {/* Target Level Badge */}
      <View style={styles.levelBanner}>
        <Text style={styles.levelBannerText}>Trình độ mục tiêu hiện tại: </Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{userLevel}</Text>
        </View>
      </View>

      <View style={styles.quickAccessRow}>
        <View style={styles.quickAccessCol}>
          <TouchableOpacity style={[styles.quickCard, SHADOWS.glass]} onPress={handleOpenVocabulary}>
            <BookOpen color={COLORS.accent} size={18} />
            <Text style={styles.quickTitle}>Vokabular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickCard, SHADOWS.glass]} onPress={handleOpenGrammar}>
            <GraduationCap color={COLORS.primaryLight} size={18} />
            <Text style={styles.quickTitle}>Grammatik</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickAccessCol}>
          <TouchableOpacity style={[styles.quickCard, SHADOWS.glass]} onPress={handleOpenReview}>
            <RotateCw color={COLORS.secondary} size={18} />
            <Text style={styles.quickTitle}>Lỗi sai</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickCard, SHADOWS.glass]} onPress={handleOpenWriting}>
            <PenLine color={COLORS.warning} size={18} />
            <Text style={styles.quickTitle}>Schreiben</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom AI Card Generator */}
      <View style={[styles.customTopicBox, SHADOWS.depthGold]}>
        <View style={styles.customTopicHeader}>
          <Sparkles color={COLORS.primary} size={20} />
          <Text style={styles.customTopicTitle}>Tự sáng tạo chủ đề bằng AI</Text>
        </View>
        <Text style={styles.customTopicDesc}>
          Nhập bất kỳ tình huống nào bạn muốn luyện tập (vd: đi phỏng vấn, đi khám răng, mua hoa tặng mẹ...), AI sẽ soạn sẵn câu hỏi.
        </Text>

        <TouchableOpacity
          style={[styles.randomTopicBtn, (isGeneratingRandom || isGenerating) && styles.disabledBtn]}
          onPress={handleGenerateRandomTopic}
          disabled={isGeneratingRandom || isGenerating}
        >
          {isGeneratingRandom ? (
            <ActivityIndicator size="small" color={COLORS.primaryLight} />
          ) : (
            <Shuffle color={COLORS.primaryLight} size={18} />
          )}
          <Text style={styles.randomTopicBtnText}>
            {isGeneratingRandom ? 'Đang tạo chủ đề...' : 'Chủ đề ngẫu nhiên'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Phỏng vấn xin việc tiếng Đức..."
            placeholderTextColor={COLORS.textDark}
            value={customTopic}
            onChangeText={setCustomTopic}
            editable={!(isGenerating || isGeneratingRandom)}
          />
          <TouchableOpacity
            style={[styles.generateBtn, (isGenerating || isGeneratingRandom) && styles.disabledBtn]}
            onPress={handleGenerateCustomTopic}
            disabled={isGenerating || isGeneratingRandom}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <ChevronRight color={COLORS.onPrimary} size={22} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Predefined Topics list */}
      <Text style={styles.sectionTitle}>Chủ đề có sẵn</Text>

      <View style={styles.grid}>
        {loadingTopics ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator color={COLORS.primaryLight} />
            <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: 8 }}>
              Đang tải chủ đề từ Supabase...
            </Text>
          </View>
        ) : topics.length === 0 ? (
          <View style={[styles.customTopicBox, SHADOWS.glass]}>
            <Text style={styles.customTopicTitle}>Chưa có chủ đề</Text>
            <Text style={styles.customTopicDesc}>
              Bảng speaking_topics hoặc speaking_cards chưa có dữ liệu.
            </Text>
          </View>
        ) : (
          topics.map((topic) => {
            const mainColor = topic.gradient?.[0] || COLORS.primary;

            return (
              <TouchableOpacity
                key={topic.id}
                style={[styles.topicCard, { borderColor: mainColor + '30' }]}
                onPress={() => handleSelectPredefinedTopic(topic)}
              >
                <View style={[styles.iconWrapper, { backgroundColor: mainColor + '15' }]}>
                  {renderIcon(topic.icon, mainColor)}
                </View>

                <View style={styles.topicInfo}>
                  <Text style={styles.topicDe}>{topic.titleDe}</Text>
                  <Text style={styles.topicVi}>{topic.title}</Text>
                  <Text style={styles.cardCount}>{topic.cards.length} câu giao tiếp</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
  },
  title: {
    ...TYPOGRAPHY.h1,
    lineHeight: 34,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  levelBannerText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  levelBadge: {
    backgroundColor: COLORS.primaryAlpha15,
    borderColor: COLORS.primaryLight,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelBadgeText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 12,
  },
  customTopicBox: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primaryAlpha20,
    borderWidth: 1.5,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickAccessCol: {
    flex: 1,
    gap: SPACING.md,
  },
  quickCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  quickTitle: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
  customTopicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  customTopicTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  customTopicDesc: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  randomTopicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.primary + '40',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: SPACING.md,
  },
  randomTopicBtnText: {
    color: COLORS.primaryLight,
    fontSize: 14,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    color: COLORS.text,
    fontSize: 14,
    height: 44,
  },
  generateBtn: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: COLORS.textDark,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  topicCard: {
    width: COLUMN_WIDTH,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: SPACING.md,
    justifyContent: 'space-between',
    minHeight: 160,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  topicInfo: {
    gap: 2,
  },
  topicDe: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  topicVi: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  cardCount: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginTop: 4,
  },
});
