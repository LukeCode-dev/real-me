/**
 * Real Me Scanner - Status Badge Component
 * Small pill shape with icon + text, optional pulse animation
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'purple';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  pulse?: boolean;
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: {
    bg: 'rgba(5, 255, 161, 0.12)',
    text: colors.neon.green,
    dot: colors.neon.green,
  },
  warning: {
    bg: 'rgba(255, 170, 0, 0.12)',
    text: colors.warning,
    dot: colors.warning,
  },
  error: {
    bg: 'rgba(255, 68, 68, 0.12)',
    text: colors.error,
    dot: colors.error,
  },
  info: {
    bg: 'rgba(0, 212, 255, 0.12)',
    text: colors.neon.blue,
    dot: colors.neon.blue,
  },
  purple: {
    bg: 'rgba(178, 73, 248, 0.12)',
    text: colors.neon.purple,
    dot: colors.neon.purple,
  },
};

export default function Badge({
  text,
  variant = 'info',
  icon,
  pulse = false,
}: BadgeProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const config = variantConfig[variant];

  useEffect(() => {
    if (pulse) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }
  }, [pulse]);

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      {icon ? (
        <View style={styles.iconWrapper}>{icon}</View>
      ) : (
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: config.dot, opacity: pulse ? pulseAnim : 1 },
          ]}
        />
      )}
      <Text style={[styles.text, { color: config.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1] + 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing[1] + 2,
  },
  iconWrapper: {
    marginRight: spacing[1] + 2,
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
