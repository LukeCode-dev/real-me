import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { colors, glassMorphism, borderRadius, spacing, shadows } from '../../constants/theme';

type PaddingVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface GlassCardProps {
  children: React.ReactNode;
  padding?: PaddingVariant;
  style?: ViewStyle;
  borderGlow?: 'blue' | 'purple' | 'pink' | 'green' | 'none';
}

const paddingMap: Record<PaddingVariant, number> = {
  none: 0,
  sm: spacing[2],
  md: spacing[4],
  lg: spacing[6],
  xl: spacing[8],
};

export default function GlassCard({
  children,
  padding = 'md',
  style,
  borderGlow = 'none',
}: GlassCardProps) {
  const glowColors: Record<string, string> = {
    blue: 'rgba(0, 212, 255, 0.15)',
    purple: 'rgba(178, 73, 248, 0.15)',
    pink: 'rgba(255, 107, 203, 0.15)',
    green: 'rgba(5, 255, 161, 0.15)',
    none: glassMorphism.borderColor,
  };

  const glowShadow = borderGlow !== 'none'
    ? shadows[`neon${borderGlow.charAt(0).toUpperCase() + borderGlow.slice(1)}` as keyof typeof shadows]
    : undefined;

  return (
    <View
      style={[
        styles.card,
        {
          padding: paddingMap[padding],
          borderColor: glowColors[borderGlow],
        },
        glowShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: glassMorphism.background,
    borderRadius: borderRadius.xl,
    borderWidth: glassMorphism.borderWidth,
    borderColor: glassMorphism.borderColor,
    // Blur works on iOS; Android gets the solid fallback via backgroundColor
    ...(Platform.OS === 'ios'
      ? { backdropFilter: `blur(${glassMorphism.backdropBlur}px)` } as any
      : {}),
    ...shadows.glass,
    overflow: 'hidden',
  },
});
