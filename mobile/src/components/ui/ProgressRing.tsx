/**
 * Real Me Scanner - Circular Progress Indicator
 * SVG circle with animated stroke-dashoffset, color gradient based on progress
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../../constants/theme';

type RingSize = 'sm' | 'md' | 'lg';

interface ProgressRingProps {
  progress: number; // 0–100
  size?: RingSize;
  animated?: boolean;
}

const sizeConfig: Record<RingSize, { diameter: number; strokeWidth: number; fontSize: number }> = {
  sm: { diameter: 48, strokeWidth: 4, fontSize: typography.fontSize.xs },
  md: { diameter: 72, strokeWidth: 5, fontSize: typography.fontSize.md },
  lg: { diameter: 104, strokeWidth: 6, fontSize: typography.fontSize.xl },
};

function getProgressColor(progress: number): string {
  if (progress < 30) return colors.error;
  if (progress < 60) return colors.warning;
  if (progress < 85) return colors.neon.blue;
  return colors.neon.green;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressRing({
  progress,
  size = 'md',
  animated = true,
}: ProgressRingProps) {
  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedProgress,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clampedProgress);
    }
  }, [clampedProgress, animated]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const progressColor = getProgressColor(clampedProgress);

  return (
    <View style={[styles.container, { width: config.diameter, height: config.diameter }]}>
      <Svg
        width={config.diameter}
        height={config.diameter}
        style={styles.svg}
      >
        {/* Background track */}
        <Circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke={colors.dark[600]}
          strokeWidth={config.strokeWidth}
          fill="transparent"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={config.strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${config.diameter / 2}, ${config.diameter / 2})`}
        />
      </Svg>
      {/* Center percentage text */}
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            { fontSize: config.fontSize, color: progressColor },
          ]}
        >
          {Math.round(clampedProgress)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'SpaceGrotesk-Bold',
    letterSpacing: 0.5,
  },
});
