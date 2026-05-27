import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, ClipboardList, FileText } from 'lucide-react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../components/Theme';

const buildHighlights = (text, mistakes = []) => {
  const safeText = text || '';
  const spans = [];

  for (const m of mistakes || []) {
    const original = (m?.original || '').trim();
    if (!original) continue;
    const idx = safeText.toLowerCase().indexOf(original.toLowerCase());
    if (idx === -1) continue;
    spans.push({
      start: idx,
      end: idx + original.length,
      mistake: m,
    });
  }

  // sort and remove overlaps
  spans.sort((a, b) => a.start - b.start);
  const merged = [];
  for (const s of spans) {
    const last = merged[merged.length - 1];
    if (!last || s.start >= last.end) merged.push(s);
  }

  const nodes = [];
  let cursor = 0;
  merged.forEach((s, index) => {
    if (cursor < s.start) {
      nodes.push({ key: `t_${index}_pre`, text: safeText.slice(cursor, s.start), highlight: false });
    }
    nodes.push({
      key: `t_${index}_hl`,
      text: safeText.slice(s.start, s.end),
      highlight: true,
      explanation: s.mistake?.explanation || '',
      fixed: s.mistake?.fixed || '',
    });
    cursor = s.end;
  });
  if (cursor < safeText.length) {
    nodes.push({ key: `t_post`, text: safeText.slice(cursor), highlight: false });
  }
  return nodes;
};

export default function WritingResultScreen({ navigation, route }) {
  const { payload } = route.params || {};

  const sample = {
    meta: {
      level: 'A2',
      taskType: 'Email',
      title: 'E-Mail: Termin verschieben',
      date: new Date().toISOString(),
      timeSpentSeconds: 780,
      wordCount: 92,
    },
    prompt: {
      instruction: 'Viết email cho giáo viên xin dời lịch học vì bị ốm. Nêu lý do, đề xuất lịch mới, và xin xác nhận.',
    },
    essay:
      'Sehr geehrte Frau Müller,\n\nich bin krank und kann heute nicht zum Unterricht kommen. Ich möchte den Termin verschieben. Können wir am Freitag um 16 Uhr treffen?\n\nVielen Dank und freundliche Grüße\nNam',
    result: {
      overallScore: 78,
      grammarScore: 75,
      vocabularyScore: 80,
      taskAchievementScore: 79,
      feedback: 'Bài làm rõ ý, lịch sự. Cần cải thiện thì/giới từ ở vài chỗ.',
      correctedVersion:
        'Sehr geehrte Frau Müller,\n\nleider bin ich krank und kann heute nicht zum Unterricht kommen. Deshalb möchte ich den Termin verschieben. Könnten wir uns am Freitag um 16 Uhr treffen?\n\nVielen Dank im Voraus.\nMit freundlichen Grüßen\nNam',
      keyMistakes: [
        { original: 'Ich bin krank', fixed: 'Leider bin ich krank', explanation: 'Thêm trạng từ để email tự nhiên và lịch sự hơn.' },
        { original: 'treffen', fixed: 'uns treffen', explanation: 'Dùng tân ngữ phản thân cho “sich treffen”.' },
      ],
      improvementTips: ['Dùng “leider/deshalb” để liên kết ý', 'Chú ý cụm “sich treffen”'],
    },
  };

  const data = payload || sample;
  const [tab, setTab] = useState('highlight'); // highlight | corrected | mistakes

  const highlights = useMemo(() => buildHighlights(data.essay, data.result?.keyMistakes || []), [data.essay, data.result]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.text} size={20} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Kết quả Schreiben</Text>
            <Text style={styles.subtitle}>
              {data.meta?.taskType || ''} • Level {data.meta?.level || ''} • {data.meta?.wordCount || 0} từ
            </Text>
          </View>
        </View>

        <View style={[styles.scoreRow, SHADOWS.glass]}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Tổng</Text>
            <Text style={[styles.scoreValue, { color: COLORS.accent }]}>{data.result?.overallScore ?? '-'}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Ngữ pháp</Text>
            <Text style={styles.scoreValue}>{data.result?.grammarScore ?? '-'}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Từ vựng</Text>
            <Text style={styles.scoreValue}>{data.result?.vocabularyScore ?? '-'}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Đạt yêu cầu</Text>
            <Text style={styles.scoreValue}>{data.result?.taskAchievementScore ?? '-'}</Text>
          </View>
        </View>

        <View style={[styles.card, SHADOWS.glass]}>
          <Text style={styles.feedbackTitle}>Nhận xét</Text>
          <Text style={styles.feedback}>{data.result?.feedback || ''}</Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === 'highlight' && styles.tabActive]}
            onPress={() => setTab('highlight')}
          >
            <FileText size={16} color={tab === 'highlight' ? COLORS.primaryLight : COLORS.textMuted} />
            <Text style={[styles.tabText, tab === 'highlight' && styles.tabTextActive]}>Bài + highlight</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'corrected' && styles.tabActive]}
            onPress={() => setTab('corrected')}
          >
            <FileText size={16} color={tab === 'corrected' ? COLORS.accent : COLORS.textMuted} />
            <Text style={[styles.tabText, tab === 'corrected' && styles.tabTextActive]}>Bản sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'mistakes' && styles.tabActive]}
            onPress={() => setTab('mistakes')}
          >
            <ClipboardList size={16} color={tab === 'mistakes' ? COLORS.warning : COLORS.textMuted} />
            <Text style={[styles.tabText, tab === 'mistakes' && styles.tabTextActive]}>Lỗi chính</Text>
          </TouchableOpacity>
        </View>

        {tab === 'highlight' && (
          <View style={[styles.card, SHADOWS.glass]}>
            <Text style={styles.cardTitle}>Bài của bạn</Text>
            <Text style={styles.essay}>
              {highlights.map((n) =>
                n.highlight ? (
                  <Text key={n.key} style={styles.hl}>
                    {n.text}
                  </Text>
                ) : (
                  <Text key={n.key}>{n.text}</Text>
                )
              )}
            </Text>
            <Text style={styles.hint}>
              Vùng bôi đỏ là đoạn AI phát hiện có thể cải thiện. Xem tab “Lỗi chính” để biết cách sửa.
            </Text>
          </View>
        )}

        {tab === 'corrected' && (
          <View style={[styles.card, SHADOWS.glass]}>
            <Text style={styles.cardTitle}>Bản sửa gợi ý</Text>
            <Text style={styles.corrected}>{data.result?.correctedVersion || ''}</Text>
          </View>
        )}

        {tab === 'mistakes' && (
          <View style={[styles.card, SHADOWS.glass]}>
            <Text style={styles.cardTitle}>Lỗi chính</Text>
            {(data.result?.keyMistakes || []).map((m, idx) => (
              <View key={`${idx}`} style={styles.mistakeCard}>
                <Text style={styles.mistakeLine}>
                  <Text style={styles.mistakeBad}>"{m.original}"</Text> → <Text style={styles.mistakeGood}>"{m.fixed}"</Text>
                </Text>
                <Text style={styles.mistakeExplain}>{m.explanation}</Text>
              </View>
            ))}
          </View>
        )}
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
  title: { ...TYPOGRAPHY.h2 },
  subtitle: { ...TYPOGRAPHY.caption, marginTop: 2 },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 18,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  scoreBox: { flex: 1, alignItems: 'center', gap: 2 },
  scoreLabel: { ...TYPOGRAPHY.caption },
  scoreValue: { color: COLORS.text, fontSize: 16, fontWeight: '900' },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 20,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  feedbackTitle: { ...TYPOGRAPHY.h3 },
  feedback: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
  tabRow: { flexDirection: 'row', gap: SPACING.sm },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 10,
  },
  tabActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.primaryAlpha10,
  },
  tabText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: COLORS.primaryLight },
  cardTitle: { ...TYPOGRAPHY.h3 },
  essay: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
  hl: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    color: COLORS.text,
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.error,
  },
  hint: { ...TYPOGRAPHY.caption, marginTop: SPACING.sm },
  corrected: { color: COLORS.text, fontSize: 13, lineHeight: 20 },
  mistakeCard: {
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    padding: SPACING.md,
    gap: 6,
  },
  mistakeLine: { color: COLORS.text, fontSize: 13 },
  mistakeBad: { color: COLORS.error, fontWeight: '800' },
  mistakeGood: { color: COLORS.accent, fontWeight: '800' },
  mistakeExplain: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18 },
});

