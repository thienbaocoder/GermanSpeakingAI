import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Volume2, Play, Award, Sparkles, MessageCircle, AlertTriangle, ArrowRight, Home } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import { addHistoryRecord } from '../utils/storage';
import { extractAndSaveMistakes } from '../api/gemini';

export default function EvaluationScreen({ route, navigation }) {
  const { evaluation, question, audioUri } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);

  useEffect(() => {
    // Proactively save evaluation to local storage history on load
    async function saveRecord() {
      await addHistoryRecord({
        question,
        overallScore: evaluation.overallScore,
        transcript: evaluation.transcript,
        correctionSuggested: evaluation.correctionSuggested,
      });
      
      // Extract and save mistakes to mistakes database
      const topic = route.params?.topic || 'General';
      await extractAndSaveMistakes(evaluation, topic, evaluation.translation);
    }
    saveRecord();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playCorrectedTTS = () => {
    Speech.speak(evaluation.correctionSuggested, {
      language: 'de-DE',
      pitch: 1.0,
      rate: 0.85,
    });
  };

  const playMyVoice = async () => {
    if (!audioUri) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      setIsPlayingBack(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlayingBack(false);
        }
      });
    } catch (err) {
      console.error(err);
      setIsPlayingBack(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return COLORS.accent;      // Green
    if (score >= 50) return COLORS.warning;     // Amber
    return COLORS.error;                       // Coral
  };

  // Render a beautiful radial circular metric representer
  const ScoreRing = ({ score, label }) => {
    const color = getScoreColor(score);
    return (
      <View style={styles.scoreRingWrapper}>
        <View style={[styles.scoreCircle, { borderColor: color + '30', borderLeftColor: color, borderTopColor: color }]}>
          <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
        </View>
        <Text style={styles.scoreRingLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Top Banner Accent */}
      <View style={styles.header}>
        <Award color={COLORS.primaryLight} size={36} />
        <Text style={styles.title}>Kết quả luyện tập</Text>
        <Text style={styles.subtitle}>Đánh giá chi tiết từ AI của bạn</Text>
      </View>

      {/* Main Scores dashboard */}
      <View style={[styles.dashboardCard, SHADOWS.glow(getScoreColor(evaluation.overallScore) + '1A')]}>
        <View style={styles.mainScoreSection}>
          <View style={[styles.overallScoreCircle, { borderColor: getScoreColor(evaluation.overallScore) }]}>
            <Text style={[styles.overallScoreText, { color: getScoreColor(evaluation.overallScore) }]}>
              {evaluation.overallScore}
            </Text>
            <Text style={styles.maxOverallText}>/100</Text>
          </View>
          <View style={styles.mainScoreInfo}>
            <Text style={styles.overallRating}>
              {evaluation.overallScore >= 80 ? 'Sehr Gut! (Rất Tốt)' : 
               evaluation.overallScore >= 60 ? 'Gut! (Khá Tốt)' : 'Versuch es noch einmal!'}
            </Text>
            <Text style={styles.overallRatingSub}>
              Cố gắng hoàn thiện phát âm và cấu trúc để cải thiện điểm số.
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Sub-scores grid */}
        <View style={styles.subScoresRow}>
          <ScoreRing score={evaluation.pronunciationScore} label="Phát âm" />
          <ScoreRing score={evaluation.grammarScore} label="Ngữ pháp" />
          <ScoreRing score={evaluation.vocabularyScore} label="Từ vựng" />
        </View>
      </View>

      {/* Audio Playback Compare Row */}
      <View style={styles.audioRow}>
        <TouchableOpacity style={styles.audioBtn} onPress={playMyVoice}>
          <Play size={16} color={COLORS.primaryLight} />
          <Text style={styles.audioBtnText}>Nghe lại giọng bạn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.audioBtn, styles.nativeAudioBtn]} onPress={playCorrectedTTS}>
          <Volume2 size={16} color={COLORS.accent} />
          <Text style={[styles.audioBtnText, { color: COLORS.accent }]}>Nghe phát âm chuẩn</Text>
        </TouchableOpacity>
      </View>

      {/* Transcript Comparison Box */}
      <View style={[styles.sectionCard, SHADOWS.glass]}>
        <View style={styles.sectionHeader}>
          <MessageCircle size={20} color={COLORS.primaryLight} />
          <Text style={styles.sectionTitle}>Đối chiếu câu nói</Text>
        </View>

        <View style={styles.transcriptBox}>
          <Text style={styles.boxLabel}>Bạn đã nói (AI nhận diện):</Text>
          <Text style={[styles.transcriptText, styles.germanFont]}>
            "{evaluation.transcript || '(Không nhận diện được giọng nói)'}"
          </Text>
        </View>

        <View style={[styles.transcriptBox, styles.correctedBox]}>
          <Text style={[styles.boxLabel, { color: COLORS.accent }]}>Cách diễn đạt tự nhiên hơn:</Text>
          <Text style={[styles.transcriptText, styles.germanFont, { color: COLORS.accent }]}>
            "{evaluation.correctionSuggested}"
          </Text>
          {evaluation.correctionExplanation && (
            <Text style={styles.explanationText}>
              💡 {evaluation.correctionExplanation}
            </Text>
          )}
        </View>
      </View>

      {/* Detailed AI Reviews */}
      <View style={[styles.sectionCard, SHADOWS.glass]}>
        <View style={styles.sectionHeader}>
          <Sparkles size={20} color={COLORS.warning} />
          <Text style={styles.sectionTitle}>Đánh giá sửa lỗi từ AI</Text>
        </View>

        {/* Grammar Reviews */}
        <View style={styles.feedbackBlock}>
          <Text style={styles.feedbackBlockTitle}>📝 Lỗi ngữ pháp & từ vựng:</Text>
          <Text style={styles.feedbackContent}>
            {evaluation.grammarFeedback || 'Không tìm thấy lỗi ngữ pháp quan trọng nào. Cấu trúc câu rất ổn!'}
          </Text>
        </View>

        {/* Pronunciation Reviews */}
        <View style={[styles.feedbackBlock, { borderTopWidth: 1, borderTopColor: COLORS.glassBorder, paddingTop: SPACING.md, marginTop: SPACING.md }]}>
          <Text style={styles.feedbackBlockTitle}>🗣️ Phân tích phát âm:</Text>
          <Text style={styles.feedbackContent}>
            {evaluation.pronunciationFeedback || 'Phát âm tương đối rõ ràng. Hãy lưu ý nhấn đúng trọng âm từ.'}
          </Text>
        </View>
      </View>

      {/* Continue & Navigation Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.popToTop()}>
          <Home size={20} color={COLORS.text} />
          <Text style={styles.homeBtnText}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.continueBtnText}>Tiếp tục luyện tập</Text>
          <ArrowRight size={20} color="#FFF" />
        </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    marginTop: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 13,
  },
  dashboardCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  mainScoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  overallScoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallScoreText: {
    fontSize: 32,
    fontWeight: '900',
  },
  maxOverallText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: -2,
  },
  mainScoreInfo: {
    flex: 1,
  },
  overallRating: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.text,
  },
  overallRatingSub: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.glassBorder,
    marginVertical: SPACING.md,
  },
  subScoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreRingWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 15,
    fontWeight: '700',
  },
  scoreRingLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  audioRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  audioBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
  },
  nativeAudioBtn: {
    borderColor: COLORS.accent + '30',
  },
  audioBtnText: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  transcriptBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  correctedBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
    borderColor: COLORS.accent + '20',
    borderWidth: 1,
  },
  boxLabel: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  transcriptText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },
  germanFont: {
    fontStyle: 'italic',
    fontWeight: '500',
  },
  explanationText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 8,
    borderRadius: 8,
  },
  feedbackBlock: {
    gap: SPACING.xs,
  },
  feedbackBlockTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackContent: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  homeBtnText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
