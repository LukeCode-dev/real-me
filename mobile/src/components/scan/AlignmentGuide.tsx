import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface AlignmentValues {
  horizontal: number; // -1 (left) to 1 (right)
  vertical: number;   // -1 (up) to 1 (down)
  distance: number;   // -1 (too close) to 1 (too far)
}

interface AlignmentGuideProps {
  alignment: AlignmentValues;
  isAligned?: boolean;
}

const THRESHOLD = 0.2; // values within this range are "aligned"

type Severity = 'bad' | 'close' | 'perfect';

function getSeverity(value: number): Severity {
  const abs = Math.abs(value);
  if (abs <= THRESHOLD) return 'perfect';
  if (abs <= 0.5) return 'close';
  return 'bad';
}

const SEVERITY_COLORS: Record<Severity, string> = {
  bad: colors.error,
  close: colors.warning,
  perfect: colors.neon.green,
};

function ArrowIcon({
  direction,
  color,
}: {
  direction: 'left' | 'right' | 'up' | 'down';
  color: string;
}) {
  const paths: Record<string, string> = {
    left: 'M 20 12 L 4 12 M 4 12 L 10 6 M 4 12 L 10 18',
    right: 'M 4 12 L 20 12 M 20 12 L 14 6 M 20 12 L 14 18',
    up: 'M 12 20 L 12 4 M 12 4 L 6 10 M 12 4 L 18 10',
    down: 'M 12 4 L 12 20 M 12 20 L 6 14 M 12 20 L 18 14',
  };

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d={paths[direction]}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DirectionArrow({
  direction,
  intensity,
  label,
}: {
  direction: 'left' | 'right' | 'up' | 'down';
  intensity: number; // 0-1
  label: string;
}) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const severity = intensity <= THRESHOLD ? 'perfect' : intensity <= 0.5 ? 'close' : 'bad';
  const color = SEVERITY_COLORS[severity];

  useEffect(() => {
    if (intensity <= THRESHOLD) {
      pulseAnim.setValue(0);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600 / Math.max(intensity, 0.3),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 600 / Math.max(intensity, 0.3),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [intensity, pulseAnim]);

  if (intensity <= THRESHOLD) return null;

  // How far to translate in the arrow direction
  const translateAmount = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const translateStyle =
    direction === 'left'
      ? { transform: [{ translateX: Animated.multiply(translateAmount, -1) }] }
      : direction === 'right'
        ? { transform: [{ translateX: translateAmount }] }
        : direction === 'up'
          ? { transform: [{ translateY: Animated.multiply(translateAmount, -1) }] }
          : { transform: [{ translateY: translateAmount }] };

  const positionStyle =
    direction === 'left'
      ? styles.arrowLeft
      : direction === 'right'
        ? styles.arrowRight
        : direction === 'up'
          ? styles.arrowUp
          : styles.arrowDown;

  return (
    <Animated.View style={[styles.arrowContainer, positionStyle, translateStyle]}>
      <ArrowIcon direction={direction} color={color} />
      <Text style={[styles.arrowLabel, { color }]}>{label}</Text>
    </Animated.View>
  );
}

export default function AlignmentGuide({
  alignment,
  isAligned = false,
}: AlignmentGuideProps) {
  const perfectAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(perfectAnim, {
      toValue: isAligned ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isAligned, perfectAnim]);

  const horizontalSeverity = getSeverity(alignment.horizontal);
  const verticalSeverity = getSeverity(alignment.vertical);
  const distanceSeverity = getSeverity(alignment.distance);
  const allPerfect = isAligned;

  // Horizontal direction arrow
  const hDir = alignment.horizontal < -THRESHOLD ? 'left' : 'right';
  const hLabel = alignment.horizontal < -THRESHOLD ? 'Move left' : 'Move right';

  // Vertical direction arrow
  const vDir = alignment.vertical < -THRESHOLD ? 'up' : 'down';
  const vLabel = alignment.vertical < -THRESHOLD ? 'Move up' : 'Move down';

  // Distance message
  const distanceLabel =
    alignment.distance < -THRESHOLD
      ? 'Step back'
      : alignment.distance > THRESHOLD
        ? 'Step closer'
        : '';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Directional arrows */}
      <DirectionArrow
        direction={hDir}
        intensity={Math.abs(alignment.horizontal)}
        label={hLabel}
      />
      <DirectionArrow
        direction={vDir}
        intensity={Math.abs(alignment.vertical)}
        label={vLabel}
      />

      {/* Distance indicator (shows at bottom) */}
      {distanceSeverity !== 'perfect' && (
        <View style={styles.distanceContainer}>
          <Text
            style={[
              styles.distanceText,
              { color: SEVERITY_COLORS[distanceSeverity] },
            ]}
          >
            {distanceLabel}
          </Text>
        </View>
      )}

      {/* Perfect alignment badge */}
      <Animated.View
        style={[
          styles.perfectBadge,
          {
            opacity: perfectAnim,
            transform: [{ scale: perfectAnim }],
          },
        ]}
      >
        <Text style={styles.perfectText}>Perfect!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  arrowLeft: {
    left: 24,
    top: '45%',
  },
  arrowRight: {
    right: 24,
    top: '45%',
  },
  arrowUp: {
    top: 120,
    alignSelf: 'center',
  },
  arrowDown: {
    bottom: 180,
    alignSelf: 'center',
  },
  arrowLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    backgroundColor: 'rgba(16, 17, 19, 0.8)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  distanceText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  perfectBadge: {
    backgroundColor: 'rgba(5, 255, 161, 0.15)',
    borderWidth: 1,
    borderColor: colors.neon.green,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  perfectText: {
    color: colors.neon.green,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
});
