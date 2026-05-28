import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { BookOpen, Trash2, ArrowLeft, Filter, AlertCircle } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import Flashcard from '../components/Flashcard';
import * as storage from '../database/services';

const { height } = Dimensions.get('window');

export default function ReviewScreen({ navigation, route }) {
  const { topicFilter } = route.params || {};
  
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('flashcard'); // 'flashcard' or 'list'
  const [filterType, setFilterType] = useState('all'); // 'all', 'pronunciation', 'grammar', 'vocabulary'

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = async () => {
    setLoading(true);
    let userMistakes = await storage.getMistakesForCurrentUser();
    
    if (topicFilter) {
      userMistakes = userMistakes.filter(m => m.topic === topicFilter);
    }
    
    if (filterType !== 'all') {
      userMistakes = userMistakes.filter(m => m.type === filterType);
    }

    // Sort by frequency (most mistakes first)
    userMistakes.sort((a, b) => b.frequency - a.frequency);
    
    setMistakes(userMistakes);
    setLoading(false);
  };

  useEffect(() => {
    loadMistakes();
  }, [filterType, topicFilter]);

  const handleNext = () => {
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkReviewed = async (mistakeId) => {
    await storage.updateMistakeFrequency(mistakeId);
    Alert.alert('Thành công', 'Đã ghi nhận bạn xem lại từ này.');
    loadMistakes();
  };

  const handleDeleteMistake = (index) => {
    Alert.alert(
      'Xóa từ sai',
      'Bạn có chắc chắn muốn xóa từ sai này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const newMistakes = mistakes.filter((_, i) => i !== index);
            setMistakes(newMistakes);
            if (currentIndex >= newMistakes.length) {
              setCurrentIndex(Math.max(0, newMistakes.length - 1));
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (mistakes.length === 0) {
    return (
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Luyện từ sai</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <AlertCircle size={64} color={COLORS.textDark} style={{ marginBottom: SPACING.md }} />
          <Text style={styles.emptyTitle}>Không có từ sai nào</Text>
          <Text style={styles.emptyText}>
            Khi bạn luyện nói, các từ sai sẽ được lưu lại ở đây để bạn ôn tập.
          </Text>
        </View>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Luyện từ sai</Text>
        <TouchableOpacity onPress={() => setViewMode(viewMode === 'flashcard' ? 'list' : 'flashcard')}>
          <Text style={styles.viewToggle}>{viewMode === 'flashcard' ? '≡' : '◊'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {['all', 'pronunciation', 'grammar', 'vocabulary'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterBtn,
              filterType === type && styles.filterBtnActive,
            ]}
            onPress={() => setFilterType(type)}
          >
            <Text
              style={[
                styles.filterBtnText,
                filterType === type && styles.filterBtnTextActive,
              ]}
            >
              {type === 'all' ? 'Tất cả' : type === 'pronunciation' ? 'Phát âm' : type === 'grammar' ? 'Ngữ pháp' : 'Từ vựng'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content */}
      {viewMode === 'flashcard' ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Flashcard
            card={mistakes[currentIndex]}
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentIndex={currentIndex}
            totalCards={mistakes.length}
            onMarkReviewed={handleMarkReviewed}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={mistakes}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={[styles.mistakeItem, SHADOWS.card]}>
              <View style={styles.mistakeHeader}>
                <View style={styles.mistakeTypeAndTopic}>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          item.type === 'pronunciation'
                            ? COLORS.secondary + '30'
                            : item.type === 'grammar'
                            ? COLORS.warning + '30'
                            : COLORS.accent + '30',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        {
                          color:
                            item.type === 'pronunciation'
                              ? COLORS.secondary
                              : item.type === 'grammar'
                              ? COLORS.warning
                              : COLORS.accent,
                        },
                      ]}
                    >
                      {item.type === 'pronunciation'
                        ? 'Phát âm'
                        : item.type === 'grammar'
                        ? 'Ngữ pháp'
                        : 'Từ vựng'}
                    </Text>
                  </View>
                  <Text style={styles.topicBadge}>{item.topic}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteMistake(index)}>
                  <Trash2 size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.mistakeContent}>
                <View style={styles.mistakeRow}>
                  <Text style={styles.mistakeLabel}>Sai:</Text>
                  <Text style={styles.mistakeText}>{item.incorrectPhrase}</Text>
                </View>
                <View style={styles.mistakeRow}>
                  <Text style={styles.mistakeLabel}>Đúng:</Text>
                  <Text style={styles.correctionText}>{item.correctedPhrase}</Text>
                </View>
                <View style={styles.mistakeRow}>
                  <Text style={styles.mistakeLabel}>Ghi chú:</Text>
                  <Text style={styles.explanationText}>{item.explanation}</Text>
                </View>
              </View>

              <View style={styles.mistakeFooter}>
                <Text style={styles.frequencyText}>Lần sai: {item.frequency}</Text>
                <TouchableOpacity
                  style={styles.reviewItemBtn}
                  onPress={() => handleMarkReviewed(item.id)}
                >
                  <Text style={styles.reviewItemBtnText}>Đã xem</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  viewToggle: {
    fontSize: 24,
    color: COLORS.primary,
  },
  filterRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.surface,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterBtnText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textDark,
  },
  filterBtnTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  mistakeItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  mistakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  mistakeTypeAndTopic: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  typeBadgeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  topicBadge: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryLight,
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  mistakeContent: {
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  mistakeRow: {
    gap: SPACING.xs,
  },
  mistakeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  mistakeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
  },
  correctionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.accent,
  },
  explanationText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  mistakeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTopBorder: 1,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorder,
  },
  frequencyText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.warning,
  },
  reviewItemBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
  },
  reviewItemBtnText: {
    ...TYPOGRAPHY.caption,
    color: '#FFF',
    fontWeight: '600',
  },
});
