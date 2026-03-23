import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BUTTON_SIZE = 70;
const OUTER_SIZE = BUTTON_SIZE + 16;
const RING_RADIUS = (OUTER_SIZE - 4) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface CaptureButtonProps {
  onPress?: () => void;
  isCapturing?: boolean;
  progress?: number; // 0 to 1
  disabled?: boolean;
}

export default function CaptureButton({
  onPress,
  isCapturing = false,
  progress = 0,
  disabled = false,
}: CaptureButtonProps) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Glow pulse when not disabled and not capturing
  useEffect(() => {
    if (disabled) {
      glowAnim.setValue(0);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [disabled, glowAnim]);

  // Animate progress ring
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [disabled, scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  }, [disabled, onPress]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 18],
  });

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [RING_CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.wrapper}>
      {/* Glow ring */}
      {!disabled && (
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowOpacity,
              shadowRadius: glowRadius,
              shadowColor: isCapturing
                ? colors.neon.green
                : colors.neon.blue,
            },
          ]}
        />
      )}

      {/* Progress ring SVG */}
      <Svg
        width={OUTER_SIZE + 8}
        height={OUTER_SIZE + 8}
        style={styles.progressSvg}
      >
        {/* Background ring */}
        <Circle
          cx={(OUTER_SIZE + 8) / 2}
          cy={(OUTER_SIZE + 8) / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={disabled ? colors.dark[500] : colors.dark[400]}
          strokeWidth={3}
        />

        {/* Progress arc */}
        {progress > 0 && (
          <AnimatedCircle
            cx={(OUTER_SIZE + 8) / 2}
            cy={(OUTER_SIZE + 8) / 2}
            r={RING_RADIUS}
            fill="none"
            stroke={colors.neon.blue}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`${RING_CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            rotation={-90}
            origin={`${(OUTER_SIZE + 8) / 2}, ${(OUTER_SIZE + 8) / 2}`}
          />
        )}
      </Svg>

      {/* Button */}
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={styles.pressable}
      >
        <Animated.View
          style={[
            styles.button,
            disabled && styles.buttonDisabled,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View
            style={[
              styles.innerCircle,
              disabled && styles.innerCircleDisabled,
              isCapturing && styles.innerCircleCapturing,
            ]}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: OUTER_SIZE + 8,
    height: OUTER_SIZE + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: (OUTER_SIZE + 8) / 2,
    borderWidth: 2,
    borderColor: colors.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 6,
  },
  progressSvg: {
    position: 'absolute',
  },
  pressable: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    borderColor: colors.dark[400],
  },
  innerCircle: {
    width: BUTTON_SIZE - 14,
    height: BUTTON_SIZE - 14,
    borderRadius: (BUTTON_SIZE - 14) / 2,
    backgroundColor: colors.white,
  },
  innerCircleDisabled: {
    backgroundColor: colors.dark[400],
  },
  innerCircleCapturing: {
    backgroundColor: colors.neon.green,
  },
});
