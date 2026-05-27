import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ArrowLeft, BookOpen } from 'lucide-react-native';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../components/Theme';
import { getLevel } from '../utils/storage';
import {
  LEARNING_TOPICS,
  getLevelConfig,
  getVocabularyList,
} from '../utils/learningData';

const WORD_TYPES = [
  { id: 'verb', label: 'Động từ' },
  { id: 'adjective', label: 'Tính từ' },
  { id: 'noun', label: 'Danh từ' },
];

export default function VocabularyScreen({ navigation }) {
  const [level, setLevel] = useState('A2');
  const [selectedTopic, setSelectedTopic] = useState(LEARNING_TOPICS[0]);
  const [selectedType, setSelectedType] = useState('verb');
  const [vocabulary, setVocabulary] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [term, setTerm] = useState('');
  const [article, setArticle] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [usage, setUsage] = useState('');

  const levelConfig = getLevelConfig(level);

  const loadList = (lvl, topic, type) => {
    setVocabulary(getVocabularyList(lvl, topic, type));
  };

  const resetForm = () => {
    setEditingId(null);
    setTerm('');
    setArticle('');
    setMeaning('');
    setExample('');
    setUsage('');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentLevel = await getLevel();
      setLevel(currentLevel);
      loadList(currentLevel, selectedTopic, selectedType);
    });
    return unsubscribe;
  }, [navigation, selectedTopic, selectedType]);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    loadList(level, topic, selectedType);
    resetForm();
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    loadList(level, selectedTopic, type);
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTerm(item.term);
    setArticle(item.article || '');
    setMeaning(item.meaning);
    setExample(item.example);
    setUsage(item.usage);
  };

  const handleDelete = (id) => {
    Alert.alert('Xóa từ vựng', 'Bạn có chắc muốn xóa mục này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => setVocabulary((prev) => prev.filter((v) => v.id !== id)),
      },
    ]);
  };

  const handleSubmit = () => {
    if (!term.trim() || !meaning.trim()) {
      Alert.alert('Thiếu dữ liệu', 'Cần ít nhất từ/cụm từ và nghĩa tiếng Việt.');
      return;
    }

    if (editingId) {
      setVocabulary((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? {
                ...v,
                term: term.trim(),
                article: article.trim(),
                meaning: meaning.trim(),
                example: example.trim(),
                usage: usage.trim(),
              }
            : v
        )
      );
    } else {
      setVocabulary((prev) => [
        {
          id: `${Date.now()}`,
          term: term.trim(),
          article: article.trim(),
          meaning: meaning.trim(),
          example: example.trim(),
          usage: usage.trim(),
        },
        ...prev,
      ]);
    }

    resetForm();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.text} size={20} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Luyện từ vựng</Text>
            <Text style={styles.subtitle}>
              {levelConfig.label} · ~{levelConfig.vocabPerType} mục / nhóm (mẫu)
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Chủ đề</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {LEARNING_TOPICS.map((topic) => (
            <TouchableOpacity
              key={topic}
              style={[styles.chip, selectedTopic === topic && styles.chipActive]}
              onPress={() => handleSelectTopic(topic)}
            >
              <Text style={[styles.chipText, selectedTopic === topic && styles.chipTextActive]}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Nhóm từ</Text>
        <View style={styles.row}>
          {WORD_TYPES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.typeBtn, selectedType === item.id && styles.typeBtnActive]}
              onPress={() => handleSelectType(item.id)}
            >
              <Text style={[styles.typeBtnText, selectedType === item.id && styles.typeBtnTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.vocabContainer, SHADOWS.glass]}>
          <View style={styles.vocabHeader}>
            <BookOpen size={18} color={COLORS.primaryLight} />
            <Text style={styles.vocabTitle}>
              {vocabulary.length} từ · {selectedTopic}
            </Text>
          </View>

          {vocabulary.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có mục nào. Thêm mới bên dưới.</Text>
          ) : (
            vocabulary.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.vocabCard}
                onPress={() => handleEdit(item)}
                onLongPress={() => handleDelete(item.id)}
              >
                <Text style={styles.term}>
                  {selectedType === 'noun' && item.article ? `${item.article} ` : ''}
                  {item.term}
                </Text>
                <Text style={styles.meaning}>{item.meaning}</Text>
                {!!item.example && <Text style={styles.example}>Ví dụ: {item.example}</Text>}
                {!!item.usage && <Text style={styles.usage}>Cách dùng: {item.usage}</Text>}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={[styles.formCard, SHADOWS.glass]}>
          <Text style={styles.formTitle}>{editingId ? 'Sửa mục từ vựng' : 'Thêm mục từ vựng mới'}</Text>
          {selectedType === 'noun' && (
            <TextInput
              style={styles.input}
              placeholder="Giống (der/die/das)"
              placeholderTextColor={COLORS.textDark}
              value={article}
              onChangeText={setArticle}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Từ/cụm từ tiếng Đức"
            placeholderTextColor={COLORS.textDark}
            value={term}
            onChangeText={setTerm}
          />
          <TextInput
            style={styles.input}
            placeholder="Nghĩa tiếng Việt"
            placeholderTextColor={COLORS.textDark}
            value={meaning}
            onChangeText={setMeaning}
          />
          <TextInput
            style={styles.input}
            placeholder="Câu ví dụ tiếng Đức (tuỳ chọn)"
            placeholderTextColor={COLORS.textDark}
            value={example}
            onChangeText={setExample}
          />
          <TextInput
            style={[styles.input, { height: 70 }]}
            placeholder="Ghi chú/cách dùng tiếng Việt (tuỳ chọn)"
            placeholderTextColor={COLORS.textDark}
            value={usage}
            onChangeText={setUsage}
            multiline
          />

          <View style={styles.formActions}>
            {editingId && (
              <TouchableOpacity style={styles.secondaryBtn} onPress={resetForm}>
                <Text style={styles.secondaryText}>Hủy sửa</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
              <Text style={styles.primaryText}>{editingId ? 'Lưu cập nhật' : 'Thêm mới'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
    gap: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: { flex: 1 },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.surface,
  },
  chipActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.primaryAlpha15,
  },
  chipText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  chipTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  typeBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  typeBtnActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  typeBtnText: {
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: COLORS.accent,
  },
  vocabContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  vocabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vocabTitle: {
    ...TYPOGRAPHY.body,
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 13,
  },
  emptyText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  vocabCard: {
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 14,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceLight,
    gap: SPACING.xs,
  },
  term: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  meaning: {
    color: COLORS.primaryLight,
    fontSize: 14,
    fontWeight: '600',
  },
  example: {
    color: COLORS.text,
    fontSize: 13,
  },
  usage: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  formTitle: {
    ...TYPOGRAPHY.h3,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    color: COLORS.text,
    fontSize: 14,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  secondaryBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  secondaryText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  primaryBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
