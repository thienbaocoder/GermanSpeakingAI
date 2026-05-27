import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ArrowLeft, Trash2, ChevronRight } from 'lucide-react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../components/Theme';
import { clearWritingHistoryForCurrentUser, getWritingHistoryForCurrentUser } from '../utils/storage';

export default function WritingHistoryScreen({ navigation }) {
  const [items, setItems] = useState([]);

  const load = async () => {
    const history = await getWritingHistoryForCurrentUser();
    setItems(history);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      load();
    });
    return unsubscribe;
  }, [navigation]);

  const handleClear = () => {
    Alert.alert('Xóa lịch sử', 'Xóa lịch sử Schreiben của bạn?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await clearWritingHistoryForCurrentUser();
          await load();
        },
      },
    ]);
  };

  const openDetail = (entry) => {
    navigation.navigate('WritingResult', { payload: entry });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.text} size={20} />
          </TouchableOpacity>
          <Text style={styles.title}>Lịch sử Schreiben</Text>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Trash2 color={COLORS.error} size={18} />
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View style={[styles.card, SHADOWS.glass]}>
            <Text style={styles.emptyTitle}>Chưa có bài viết nào</Text>
            <Text style={styles.emptyDesc}>Hãy làm 1 bài và nộp để AI sửa, lịch sử sẽ được lưu theo tài khoản.</Text>
          </View>
        ) : (
          items.map((h) => (
            <TouchableOpacity key={h.id} style={[styles.item, SHADOWS.glass]} onPress={() => openDetail(h)}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.itemTitle}>{h.meta?.title || h.meta?.taskType || 'Schreiben'}</Text>
                <Text style={styles.itemSub}>
                  {h.meta?.taskType || ''} • Level {h.meta?.level || ''} • {h.meta?.wordCount || 0} từ
                </Text>
                <Text style={styles.itemDate}>{new Date(h.meta?.date || h.date).toLocaleString()}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.score}>{h.result?.overallScore ?? '-'}/100</Text>
                <ChevronRight color={COLORS.textMuted} size={18} />
              </View>
            </TouchableOpacity>
          ))
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
  title: { ...TYPOGRAPHY.h2, flex: 1 },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 20,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  emptyTitle: { ...TYPOGRAPHY.h3 },
  emptyDesc: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 18,
    padding: SPACING.md,
  },
  itemTitle: { color: COLORS.text, fontWeight: '800', fontSize: 14 },
  itemSub: { color: COLORS.textMuted, fontSize: 12 },
  itemDate: { color: COLORS.textDark, fontSize: 11 },
  itemRight: { alignItems: 'flex-end', gap: 4 },
  score: { color: COLORS.accent, fontWeight: '900' },
});

