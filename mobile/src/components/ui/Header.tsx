/**
 * Real Me Scanner - Reusable Screen Header
 * Semi-transparent background with back button, centered title, optional right action
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  colors,
  glassMorphism,
  typography,
  spacing,
  shadows,
} from '../../constants/theme';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: () => void;
  rightIcon?: React.ReactNode;
}

export default function Header({
  title,
  onBack,
  rightAction,
  rightIcon,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const topPadding = Math.max(insets.top, statusBarHeight);

  const handleBack = () => {
    if (onBack) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onBack();
    }
  };

  const handleRightAction = () => {
    if (rightAction) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      rightAction();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding + spacing[2] }]}>
      <View style={styles.row}>
        {/* Back button */}
        <View style={styles.sideSlot}>
          {onBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backArrow}>{'\u2190'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Centered title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right action */}
        <View style={[styles.sideSlot, styles.rightSlot]}>
          {rightAction && rightIcon && (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={handleRightAction}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: glassMorphism.background,
    borderBottomWidth: glassMorphism.borderWidth,
    borderBottomColor: glassMorphism.borderColor,
    paddingBottom: spacing[3],
    ...(Platform.OS === 'ios'
      ? ({ backdropFilter: `blur(${glassMorphism.backdropBlur}px)` } as any)
      : {}),
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    height: 44,
  },
  sideSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backArrow: {
    fontSize: 20,
    color: colors.neon.blue,
    marginTop: -1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  rightButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
});
