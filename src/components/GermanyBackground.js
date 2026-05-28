import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './Theme';

export default function GermanyBackground({ children }) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#050506', '#120607', '#0A0A0C', '#151206']}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.flagGlowTop} />
      <View style={styles.flagGlowBottom} />

      <View style={styles.flagShape}>
        <View style={[styles.stripe, { backgroundColor: COLORS.germanyBlack }]} />
        <View style={[styles.stripe, { backgroundColor: COLORS.germanyRed }]} />
        <View style={[styles.stripe, { backgroundColor: COLORS.germanyGold }]} />
      </View>

      <View style={styles.overlay} />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
    overflow: 'hidden',
  },

  flagGlowTop: {
    position: 'absolute',
    top: -80,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 204, 0, 0.16)',
  },

  flagGlowBottom: {
    position: 'absolute',
    bottom: -120,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(221, 0, 0, 0.14)',
  },

  flagShape: {
    position: 'absolute',
    top: 90,
    left: 24,
    width: 260,
    height: 150,
    borderRadius: 18,
    overflow: 'hidden',
    opacity: 0.32,
    transform: [{ rotate: '-8deg' }],
  },

  stripe: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },

  content: {
    flex: 1,
  },
});