import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Volume2, RotateCw, Check } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from './Theme';

export default function Flashcard({ 
  card, 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalCards,
  onMarkReviewed 
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flip] = useState(new Animated.Value(0));

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    Animated.timing(flip, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const speakText = (text, language = 'de-DE') => {
    Speech.speak(text, {
      language,
      pitch: 1.0,
      rate: 0.85,
    });
  };

  return (
    <View style={styles.container}>
      
      {/* Flashcard */}
      <TouchableOpacity 
        style={[styles.card, SHADOWS.glass]}
        onPress={handleFlip}
        activeOpacity={0.8}
      >
        {!isFlipped ? (
          <Animated.View style={[styles.cardContent, { transform: [{ rotateY: frontInterpolate }] }]}>
            <Text style={styles.label}>Lỗi sai</Text>
            <Text style={styles.cardType}>{card.type}</Text>
            
            {card.type === 'pronunciation' && (
              <View style={styles.pronunciationContent}>
                <TouchableOpacity 
                  style={styles.audioBtn}
                  onPress={() => speakText(card.incorrectPhrase, 'de-DE')}
                >
                  <Volume2 size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.mainText}>{card.incorrectPhrase}</Text>
              </View>
            )}

            {card.type === 'grammar' && (
              <View>
                <Text style={styles.mainText}>{card.incorrectPhrase}</Text>
                <Text style={styles.vietnameseSub}>{card.translation || ''}</Text>
              </View>
            )}

            {card.type === 'vocabulary' && (
              <View>
                <Text style={styles.mainText}>{card.incorrectPhrase}</Text>
              </View>
            )}

            <Text style={styles.frequency}>Lần sai: {card.frequency}</Text>
            <Text style={styles.flipHint}>Nhấn để lật</Text>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.cardContent, { transform: [{ rotateY: backInterpolate }] }]}>
            <Text style={styles.label}>Sửa lại</Text>
            <Text style={styles.cardType}>{card.type}</Text>
            
            {card.type === 'pronunciation' && (
              <View style={styles.pronunciationContent}>
                <TouchableOpacity 
                  style={styles.audioBtn}
                  onPress={() => speakText(card.correctedPhrase, 'de-DE')}
                >
                  <Volume2 size={24} color={COLORS.accent} />
                </TouchableOpacity>
                <Text style={styles.mainText}>{card.correctedPhrase}</Text>
              </View>
            )}

            {card.type === 'grammar' && (
              <View>
                <Text style={styles.mainText}>{card.correctedPhrase}</Text>
              </View>
            )}

            {card.type === 'vocabulary' && (
              <View>
                <Text style={styles.mainText}>{card.correctedPhrase}</Text>
              </View>
            )}

            <Text style={styles.explanation}>{card.explanation}</Text>
            <Text style={styles.flipHint}>Nhấn để quay lại</Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Explanation (always visible) */}
      {isFlipped && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>💡 Giải thích:</Text>
          <Text style={styles.explanationText}>{card.explanation}</Text>
        </View>
      )}

      {/* Progress & Controls */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalCards}
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={onPrevious}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navBtnText}>← Trước</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.reviewBtn]}
            onPress={() => onMarkReviewed(card.id)}
          >
            <Check size={18} color="#FFF" />
            <Text style={styles.reviewBtnText}>Đã xem</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navBtn, currentIndex === totalCards - 1 && styles.navBtnDisabled]}
            onPress={onNext}
            disabled={currentIndex === totalCards - 1}
          >
            <Text style={styles.navBtnText}>Sau →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Type Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.secondary }]} />
          <Text style={styles.legendText}>Phát âm</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.warning }]} />
          <Text style={styles.legendText}>Ngữ pháp</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.accent }]} />
          <Text style={styles.legendText}>Từ vựng</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  card: {
    width: '100%',
    minHeight: 320,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardType: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 4,
  },
  pronunciationContent: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  audioBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  mainText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  vietnameseSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.textDark,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  frequency: {
    ...TYPOGRAPHY.caption,
    color: COLORS.warning,
    marginTop: SPACING.md,
  },
  flipHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textDark,
    marginTop: SPACING.lg,
    fontStyle: 'italic',
  },
  explanationBox: {
    width: '100%',
    backgroundColor: COLORS.primary + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  explanationTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  explanationText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 24,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: SPACING.md,
  },
  navBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text,
  },
  reviewBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reviewBtnText: {
    ...TYPOGRAPHY.button,
    color: '#FFF',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textDark,
  },
});
