import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { User, ShoppingBag, Utensils, MapPin, Sparkles, BookOpen, ChevronRight, Settings } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import { DEFAULT_TOPICS } from '../utils/mockData';
import { getLevel, getApiKey } from '../utils/storage';
import { generateCustomFlashcards } from '../api/gemini';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - SPACING.md * 3) / 2;

export default function HomeScreen({ navigation }) {
  const [userLevel, setUserLevel] = useState('A2');
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      async function loadLevel() {
        const storedLevel = await getLevel();
        setUserLevel(storedLevel);
      }
      loadLevel();
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

  const handleGenerateCustomTopic = async () => {
    if (!customTopic.trim()) {
      Alert.alert('Nhập chủ đề', 'Vui lòng nhập chủ đề bạn muốn luyện tập.');
      return;
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
      Alert.alert(
        'Yêu cầu API Key',
        'Để tự động tạo chủ đề tùy chỉnh bằng AI, bạn cần nhập Gemini API Key trong phần Cài đặt trước.',
        [
          { text: 'Đi đến Cài đặt', onPress: () => navigation.navigate('Settings') },
          { text: 'Để sau', style: 'cancel' }
        ]
      );
      return;
    }

    try {
      setIsGenerating(true);
      
      // ✅ SAVE TOPIC NAME BEFORE CLEARING
      const topicName = customTopic.trim();
      
      console.log('📚 Generating flashcards for topic:', topicName);
      const generatedCards = await generateCustomFlashcards(topicName, userLevel, apiKey);
      
      // ✅ VALIDATE RESPONSE (function now throws errors, so null check isn't needed)
      // But keep defensive checks in case
      if (!generatedCards || !Array.isArray(generatedCards) || generatedCards.length === 0) {
        throw new Error(
          'AI không thể tạo flashcard cho chủ đề này. Hãy thử:\n' +
          '- Nhập chủ đề chi tiết hơn\n' +
          '- Dùng từ khóa khác\n' +
          '- Kiểm tra API Key lại'
        );
      }

      console.log(`✅ Successfully generated ${generatedCards.length} cards, navigating to Practice`);
      
      // ✅ CLEAR INPUT AFTER SUCCESS
      setCustomTopic('');
      
      // ✅ NAVIGATE WITH CORRECT TOPIC NAME
      navigation.navigate('Practice', {
        topicTitle: topicName,
        cards: generatedCards
      });
      
    } catch (error) {
      // ✅ CATEGORIZE ERROR TYPE FOR USER FEEDBACK
      let userFriendlyMessage = error.message;
      
      if (error.message?.includes('MODEL_NOT_FOUND_404')) {
        userFriendlyMessage = 
          '❌ Lỗi mô hình API: Model Gemini không hợp lệ.\n\n' +
          'Hãy kiểm tra file src/api/gemini.js:\n' +
          '- GEMINI_MODEL phải là một trong: gemini-2.0-flash, gemini-1.5-flash-latest\n' +
          '- GEMINI_API_VERSION phải là: v1 (không phải v1beta)';
      } else if (error.message?.includes('API_ERROR_401') || error.message?.includes('API_ERROR_403')) {
        userFriendlyMessage = '❌ API Key không hợp lệ. Vui lòng kiểm tra lại Gemini API Key trong Settings.';
      } else if (error.message?.includes('API_ERROR_429')) {
        userFriendlyMessage = '⚠️ API quota hết. Bạn đã dùng quá nhiều lần. Hãy đợi hoặc nâng cấp account.';
      } else if (error.message?.includes('INVALID_RESPONSE_STRUCTURE')) {
        userFriendlyMessage = '❌ API trả về dữ liệu không hợp lệ. Vui lòng thử lại.';
      } else if (error.message?.includes('JSON_PARSE_ERROR')) {
        userFriendlyMessage = '❌ AI trả về dữ liệu không hợp lệ. Thử lại với chủ đề khác.';
      } else if (error.message?.includes('NO_CARDS') || error.message?.includes('Empty')) {
        userFriendlyMessage = '❌ AI không tạo được flashcard. Hãy thử:\n- Nhập chủ đề chi tiết hơn\n- Dùng từ khóa khác';
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        userFriendlyMessage = '❌ Lỗi kết nối mạng. Vui lòng kiểm tra:\n- Internet kết nối chưa\n- Firewall/VPN settings';
      }

      console.error('❌ Error in handleGenerateCustomTopic:');
      console.error('   Error message:', error.message);
      console.error('   User message:', userFriendlyMessage);
      
      Alert.alert(
        'Tạo chủ đề thất bại',
        userFriendlyMessage
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Top Header Row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hallo! Học tiếng Đức</Text>
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

      {/* Custom AI Card Generator */}
      <View style={[styles.customTopicBox, SHADOWS.glow(COLORS.primary + '30')]}>
        <View style={styles.customTopicHeader}>
          <Sparkles color="#F59E0B" size={20} />
          <Text style={styles.customTopicTitle}>Tự sáng tạo chủ đề bằng AI</Text>
        </View>
        <Text style={styles.customTopicDesc}>
          Nhập bất kỳ tình huống nào bạn muốn luyện tập (vd: đi phỏng vấn, đi khám răng, mua hoa tặng mẹ...), AI sẽ soạn sẵn câu hỏi cho bạn.
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Phỏng vấn xin việc tiếng Đức..."
            placeholderTextColor={COLORS.textDark}
            value={customTopic}
            onChangeText={setCustomTopic}
            disabled={isGenerating}
          />
          <TouchableOpacity 
            style={[styles.generateBtn, isGenerating && styles.disabledBtn]} 
            onPress={handleGenerateCustomTopic}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <ChevronRight color="#FFF" size={22} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Predefined Topics list */}
      <Text style={styles.sectionTitle}>Chủ đề có sẵn</Text>
      
      <View style={styles.grid}>
        {DEFAULT_TOPICS.map((topic) => {
          const mainColor = topic.gradient[0];
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
        })}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
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
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
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
    marginBottom: SPACING.md,
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
