import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, Clock3, RefreshCw, Send } from 'lucide-react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../components/Theme';
import { addWritingHistoryRecord, getLevel } from '../utils/storage';
import {
  evaluateWritingLocally,
  getLevelConfig,
  getWritingPrompt,
} from '../utils/learningData';

const TASK_TYPES = ['Email', 'Beschwerde', 'Meinung'];

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};

export default function WritingScreen({ navigation }) {
  const [level, setLevel] = useState('A2');
  const [taskType, setTaskType] = useState(TASK_TYPES[0]);
  const [promptData, setPromptData] = useState(null);
  const [essay, setEssay] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [durationSeconds, setDurationSeconds] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentLevel = await getLevel();
      setLevel(currentLevel);
      await loadPrompt(currentLevel, taskType);
    });
    return unsubscribe;
  }, [navigation, taskType]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return undefined;
    const timerId = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      Alert.alert('Hết giờ', 'Hết thời gian làm bài. Bạn có thể nộp bài để xem kết quả mẫu.');
    }
  }, [secondsLeft, isRunning]);

  const wordCount = useMemo(() => {
    return essay.trim() ? essay.trim().split(/\s+/).length : 0;
  }, [essay]);

  const resetTimer = (duration = durationSeconds) => {
    setSecondsLeft(duration);
    setIsRunning(false);
    setStartedAt(null);
  };

  const loadPrompt = async (currentLevel = level, currentType = taskType) => {
    setLoadingPrompt(true);
    const prompt = getWritingPrompt(currentLevel, currentType);
    setPromptData(prompt);
    setDurationSeconds(prompt.durationSeconds);
    setEssay('');
    resetTimer(prompt.durationSeconds);
    setLoadingPrompt(false);
  };

  const handleSubmit = async () => {
    if (!essay.trim()) {
      Alert.alert('Thiếu nội dung', 'Bạn chưa nhập bài viết.');
      return;
    }
    if (!promptData) {
      Alert.alert('Thiếu đề bài', 'Vui lòng tạo đề trước khi nộp.');
      return;
    }

    try {
      setSubmitting(true);
      setIsRunning(false);

      const result = evaluateWritingLocally(level, essay, wordCount);

      const timeSpentSeconds = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : null;
      const payload = {
        meta: {
          level,
          taskType,
          title: promptData.title || taskType,
          date: new Date().toISOString(),
          timeSpentSeconds,
          wordCount,
        },
        prompt: {
          instruction: promptData.instruction || '',
          requirements: promptData.requirements || [],
          suggestedLength: promptData.suggestedLength || '',
        },
        essay,
        result,
      };

      await addWritingHistoryRecord(payload);
      navigation.navigate('WritingResult', { payload });
    } catch (error) {
      console.error('Writing local evaluation error:', error.message);
      Alert.alert('Nộp bài thất bại', 'Có lỗi xảy ra khi lưu bài viết.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.text} size={20} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Luyện Schreiben</Text>
            <Text style={styles.subtitle}>
              {getLevelConfig(level).label} · mục tiêu {promptData?.targetWords || getLevelConfig(level).targetWords} từ
            </Text>
          </View>
        </View>

        <View style={styles.typeRow}>
          {TASK_TYPES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.typeBtn, taskType === item && styles.typeBtnActive]}
              onPress={() => setTaskType(item)}
            >
              <Text style={[styles.typeText, taskType === item && styles.typeTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.historyBtn, SHADOWS.glass]} onPress={() => navigation.navigate('WritingHistory')}>
          <Text style={styles.historyBtnText}>Xem lịch sử bài viết</Text>
        </TouchableOpacity>

        <View style={[styles.card, SHADOWS.glass]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Đề viết</Text>
            <TouchableOpacity onPress={() => loadPrompt()}>
              <RefreshCw color={COLORS.textMuted} size={18} />
            </TouchableOpacity>
          </View>
          {loadingPrompt ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={COLORS.primaryLight} />
              <Text style={styles.loadingText}>Đang tải đề...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.promptTitle}>{promptData?.title || 'Chưa có đề bài'}</Text>
              <Text style={styles.promptInstruction}>{promptData?.instruction || ''}</Text>
              {(promptData?.requirements || []).map((item, index) => (
                <Text key={`${item}_${index}`} style={styles.requirement}>
                  - {item}
                </Text>
              ))}
              {!!promptData?.suggestedLength && (
                <Text style={styles.lengthHint}>Độ dài gợi ý: {promptData.suggestedLength}</Text>
              )}
            </>
          )}
        </View>

        <View style={[styles.card, SHADOWS.glass]}>
          <View style={styles.timerRow}>
            <Clock3 size={18} color={COLORS.warning} />
            <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
            <TouchableOpacity
              style={styles.timerBtn}
              onPress={() => {
                setIsRunning((prev) => {
                  const next = !prev;
                  if (next && !startedAt) setStartedAt(Date.now());
                  return next;
                });
              }}
            >
              <Text style={styles.timerBtnText}>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            multiline
            textAlignVertical="top"
            placeholder="Viết bài tiếng Đức của bạn tại đây..."
            placeholderTextColor={COLORS.textDark}
            value={essay}
            onChangeText={setEssay}
          />
          <Text style={styles.wordCount}>
            Số từ: {wordCount} / ~{promptData?.targetWords || getLevelConfig(level).targetWords} (tối thiểu {promptData?.minWords || getLevelConfig(level).minWords})
          </Text>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Send size={16} color="#FFF" />
                <Text style={styles.submitText}>Nộp bài</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextWrap: { flex: 1 },
  title: { ...TYPOGRAPHY.h2 },
  subtitle: { ...TYPOGRAPHY.caption, marginTop: 2 },
  typeRow: { flexDirection: 'row', gap: SPACING.sm },
  typeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  typeBtnActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.primaryAlpha15,
  },
  typeText: { color: COLORS.textMuted, fontWeight: '600' },
  typeTextActive: { color: COLORS.primaryLight },
  historyBtn: {
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    alignItems: 'center',
  },
  historyBtnText: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: 13,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...TYPOGRAPHY.h3 },
  loadingWrap: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg },
  loadingText: { ...TYPOGRAPHY.caption },
  promptTitle: { color: COLORS.text, fontWeight: '700', fontSize: 15 },
  promptInstruction: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
  requirement: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
  lengthHint: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '600', marginTop: 4 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  timerText: { color: COLORS.warning, fontWeight: '800', fontSize: 16, flex: 1 },
  timerBtn: {
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timerBtnText: { color: COLORS.warning, fontWeight: '700', fontSize: 12 },
  input: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceLight,
    fontSize: 14,
    lineHeight: 20,
  },
  wordCount: { ...TYPOGRAPHY.caption, textAlign: 'right' },
  submitBtn: {
    marginTop: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  submitText: { color: '#FFF', fontWeight: '700' },
});
