import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Mic } from 'lucide-react-native';
import { COLORS } from './Theme';

export default function RecordingWave({ isRecording }) {
  // Wave animation values
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animationLoop;

    if (isRecording) {
      // Loop to animate rings consecutively
      const animateRing = (val, delay) => {
        val.setValue(0);
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(val, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            })
          ])
        );
      };

      animationLoop = Animated.parallel([
        animateRing(pulse1, 0),
        animateRing(pulse2, 600),
        animateRing(pulse3, 1200)
      ]);

      animationLoop.start();
    } else {
      pulse1.setValue(0);
      pulse2.setValue(0);
      pulse3.setValue(0);
    }

    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
    };
  }, [isRecording]);

  // Interpolate scales and opacities for ripples
  const getRippleStyle = (pulse) => {
    return {
      transform: [{
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.5],
        })
      }],
      opacity: pulse.interpolate({
        inputRange: [0, 0.1, 0.8, 1],
        outputRange: [0, 0.4, 0.2, 0],
      })
    };
  };

  return (
    <View style={styles.container}>
      {isRecording && (
        <>
          <Animated.View style={[styles.ripple, getRippleStyle(pulse1)]} />
          <Animated.View style={[styles.ripple, getRippleStyle(pulse2)]} />
          <Animated.View style={[styles.ripple, getRippleStyle(pulse3)]} />
        </>
      )}
      
      {/* Central Ring */}
      <View style={[styles.centerRing, isRecording && styles.centerRingActive]}>
        <Mic size={32} color={isRecording ? '#FFF' : COLORS.primaryLight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  centerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryAlpha15,
    borderWidth: 2,
    borderColor: COLORS.primaryLight + '50',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerRingActive: {
    backgroundColor: COLORS.error,
    borderColor: '#FFF',
    // Slight shadow for depth
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
    borderWidth: 1.5,
    zIndex: 1,
  },
});
