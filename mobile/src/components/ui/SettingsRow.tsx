/**
 * Real Me Scanner - Settings List Item
 * Icon (left), Label, Description (optional), Action (right - chevron, toggle, or badge)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../../constants/theme';

interface SettingsRowProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  showSeparator?: boolean;
  destructive?: boolean;
}

export default function SettingsRow({
  icon,
  label,
  description,
  rightElement,
  onPress,
  showChevron = false,
  showSeparator = true,
  destructive = false,
}: SettingsRowProps) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const content = (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* Left icon */}
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        {/* Label + Description */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.label,
              destructive && styles.labelDestructive,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>

        {/* Right element or chevron */}
        {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
        {showChevron && !rightElement && (
          <Text style={styles.chevron}>{'\u203A'}</Text>
        )}
      </View>

      {showSeparator && <View style={styles.separator} />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handlePress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  wrapper: {
    // Wraps row + separator
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3] + 2,
    paddingHorizontal: spacing[1],
    minHeight: 52,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  textContainer: {
    flex: 1,
    marginRight: spacing[2],
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  labelDestructive: {
    color: colors.error,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  rightContainer: {
    marginLeft: spacing[2],
    alignItems: 'flex-end',
  },
  chevron: {
    fontSize: 22,
    color: colors.dark[300],
    marginLeft: spacing[2],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.dark[600],
    marginLeft: spacing[1] + 36 + spacing[3], // icon width + margin
  },
});
