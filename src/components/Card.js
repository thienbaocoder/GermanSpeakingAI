import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Volume2, HelpCircle, Eye, EyeOff } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from './Theme';

export default function Card({ card, onPlayVoice }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Level Badge Colors
  const getLevelColor = (level) => {
    switch (level) {
      case 'A1': return '#10B981'; // Emerald
      case 'A2': return '#3B82F6'; // Blue
      case 'B1': return '#F59E0B'; // Amber
      case 'B2': return '#EF4444'; // Red
      default: return COLORS.primary;
    }
  };

  const playTTS = () => {
    // Pulse animation on click
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();

    // Native text to speech in German
    Speech.speak(card.question, {
      language: 'de-DE',
      pitch: 1.0,
      rate: 0.85, // slightly slower for language learners!
    });
  };

  return (
    <View style={[styles.cardContainer, SHADOWS.glass]}>
      {/* Header with Level & Sound */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: getLevelColor(card.difficulty) + '1A', borderColor: getLevelColor(card.difficulty) }]}>
          <Text style={[styles.badgeText, { color: getLevelColor(card.difficulty) }]}>{card.difficulty}</Text>
        </View>
        
        <TouchableOpacity style={styles.speakButton} onPress={playTTS}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Volume2 color={COLORS.primaryLight} size={24} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* German Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{card.question}</Text>
      </View>

      {/* Collapsible translation & tips */}
      <View style={styles.detailsContainer}>
        
        {/* Toggle buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.toggleBtn, showTranslation && styles.activeToggleBtn]} 
            onPress={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? <EyeOff size={16} color={COLORS.text} /> : <Eye size={16} color={COLORS.textMuted} />}
            <Text style={[styles.toggleBtnText, showTranslation && styles.activeToggleBtnText]}>
              Dịch nghĩa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toggleBtn, showHint && styles.activeToggleBtn]} 
            onPress={() => setShowHint(!showHint)}
          >
            <HelpCircle size={16} color={showHint ? COLORS.text : COLORS.textMuted} />
            <Text style={[styles.toggleBtnText, showHint && styles.activeToggleBtnText]}>
              Gợi ý & Mẫu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Translation content */}
        {showTranslation && (
          <View style={styles.detailBox}>
            <Text style={styles.boxTitle}>Bản dịch:</Text>
            <Text style={styles.boxContent}>{card.translation}</Text>
          </View>
        )}

        {/* Hint & Suggested Structure content */}
        {showHint && (
          <View style={[styles.detailBox, styles.hintBox]}>
            <Text style={styles.boxTitle}>Gợi ý từ vựng:</Text>
            <Text style={styles.boxContent}>{card.hint}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.boxTitle}>Cấu trúc gợi ý:</Text>
            <Text style={[styles.boxContent, styles.germanText]}>{card.suggestedStructure}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: SPACING.lg,
    width: '100%',
    minHeight: 280,
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  speakButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryAlpha10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    marginVertical: SPACING.md,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  detailsContainer: {
    marginTop: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeToggleBtn: {
    backgroundColor: COLORS.primaryAlpha15,
    borderColor: COLORS.primary + '40',
  },
  toggleBtnText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  activeToggleBtnText: {
    color: COLORS.text,
  },
  detailBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  hintBox: {
    backgroundColor: COLORS.primaryAlpha10,
  },
  boxTitle: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  boxContent: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.glassBorder,
    marginVertical: SPACING.sm,
  },
  germanText: {
    fontStyle: 'italic',
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
});
