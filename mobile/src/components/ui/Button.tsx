import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  colors,
  gradients,
  borderRadius,
  spacing,
  typography,
  shadows,
} from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const sizeConfig: Record<ButtonSize, { paddingV: number; paddingH: number; fontSize: number; height: number }> = {
  sm: { paddingV: spacing[2], paddingH: spacing[4], fontSize: typography.fontSize.sm, height: 36 },
  md: { paddingV: spacing[3], paddingH: spacing[6], fontSize: typography.fontSize.md, height: 48 },
  lg: { paddingV: spacing[4], paddingH: spacing[8], fontSize: typography.fontSize.lg, height: 56 },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const config = sizeConfig[size];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    if (loading || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isDisabled = disabled || loading;

  const renderContent = () => (
    <View style={[styles.contentRow, { height: config.height }]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.neon.blue}
        />
      ) : (
        <>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                fontSize: config.fontSize,
                color:
                  variant === 'primary'
                    ? colors.white
                    : variant === 'secondary'
                    ? colors.neon.blue
                    : colors.text.primary,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        {variant === 'primary' ? (
          <LinearGradient
            colors={[gradients.neonHorizontal[0], gradients.neonHorizontal[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.primary,
              {
                paddingVertical: config.paddingV,
                paddingHorizontal: config.paddingH,
                borderRadius: borderRadius.lg,
              },
              isDisabled && styles.disabled,
            ]}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          <View
            style={[
              variant === 'secondary' ? styles.secondary : styles.ghost,
              {
                paddingVertical: config.paddingV,
                paddingHorizontal: config.paddingH,
                borderRadius: borderRadius.lg,
              },
              isDisabled && styles.disabled,
            ]}
          >
            {renderContent()}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  primary: {
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.neonBlue,
  },
  secondary: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.neon.blue,
    ...shadows.neonBlue,
  },
  ghost: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: spacing[2],
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});
