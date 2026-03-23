/**
 * Real Me Scanner - Styled Toggle Switch
 * Dark track, neon-blue active track, animated thumb, haptic feedback
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - 6; // 6 = padding on both sides

export default function Toggle({
  value,
  onValueChange,
  label,
  disabled = false,
}: ToggleProps) {
  const translateX = useRef(new Animated.Value(value ? THUMB_TRAVEL : 0)).current;
  const trackColorAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? THUMB_TRAVEL : 0,
        useNativeDriver: true,
        speed: 28,
        bounciness: 6,
      }),
      Animated.timing(trackColorAnim, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const handleToggle = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  const trackBgColor = trackColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.dark[600], 'rgba(0, 212, 255, 0.3)'],
  });

  const trackBorderColor = trackColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.dark[400], colors.neon.blue],
  });

  const thumbBgColor = trackColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.dark[200], colors.neon.blue],
  });

  return (
    <TouchableWithoutFeedback onPress={handleToggle}>
      <View style={[styles.container, disabled && styles.disabled]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Animated.View
          style={[
            styles.track,
            {
              backgroundColor: trackBgColor,
              borderColor: trackBorderColor,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor: thumbBgColor,
                transform: [{ translateX }],
              },
            ]}
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginRight: spacing[3],
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: colors.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});
