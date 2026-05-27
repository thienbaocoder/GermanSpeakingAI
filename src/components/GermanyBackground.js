import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './Theme';

/**
 * Nền gradient + khối “3D” mờ (đen–đỏ–vàng) cho toàn app.
 */
export default function GermanyBackground({ children }) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={COLORS.backgroundGradient}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Cờ Đức tinh gọn — accent trên cùng */}
      <View style={styles.flagBar}>
        <View style={[styles.flagStripe, { backgroundColor: COLORS.germanyBlack }]} />
        <View style={[styles.flagStripe, { backgroundColor: COLORS.germanyRed }]} />
        <View style={[styles.flagStripe, { backgroundColor: COLORS.germanyGold }]} />
      </View>

      {/* Khối 3D mờ — depth layers */}
      <View style={[styles.orb, styles.orbGold]} />
      <View style={[styles.orb, styles.orbRed]} />
      <View style={[styles.orb, styles.orbBlack]} />
      <View style={styles.gridPlane} />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
  },
  content: {
    flex: 1,
  },
  flagBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    flexDirection: 'column',
    zIndex: 1,
    opacity: 0.95,
  },
  flagStripe: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbGold: {
    width: 280,
    height: 280,
    top: '8%',
    right: '-18%',
    backgroundColor: 'rgba(255, 204, 0, 0.14)',
    shadowColor: COLORS.germanyGold,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 0,
    transform: [{ scaleX: 1.2 }],
  },
  orbRed: {
    width: 220,
    height: 220,
    bottom: '12%',
    left: '-15%',
    backgroundColor: 'rgba(221, 0, 0, 0.12)',
    shadowColor: COLORS.germanyRed,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
  },
  orbBlack: {
    width: 160,
    height: 160,
    top: '42%',
    left: '55%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
  },
  gridPlane: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    right: -40,
    height: 200,
    backgroundColor: 'rgba(255, 204, 0, 0.03)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 204, 0, 0.08)',
    transform: [{ perspective: 600 }, { rotateX: '62deg' }],
    borderRadius: 24,
  },
});
