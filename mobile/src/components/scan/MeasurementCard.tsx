import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  glassMorphism,
} from '../../constants/theme';

type Confidence = 'high' | 'medium' | 'low';
type MeasurementType = 'length' | 'circumference';

interface MeasurementCardProps {
  label: string;
  value: number;
  unit?: string;
  confidence?: Confidence;
  measurementType?: MeasurementType;
  onEdit?: (newValue: number) => void;
  index?: number; // for stagger delay
}

const CONFIDENCE_COLORS: Record<Confidence, string> = {
  high: colors.neon.green,
  medium: colors.warning,
  low: colors.error,
};

const STAGGER_DELAY = 80; // ms between each card

function RulerIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M 2 17 L 7 12 L 4.5 9.5 L 6 8 L 8.5 10.5 L 10 9 L 8 7 L 9.5 5.5 L 11.5 7.5 L 13 6 L 11 4 L 12.5 2.5 L 17 7 L 7 17 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TapeIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M 12 6 C 16.4 6 20 9.6 20 14 C 20 14 20 18 12 18 L 4 18 L 4 14 C 4 9.6 7.6 6 12 6 Z M 12 10 C 9.8 10 8 11.8 8 14"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function MeasurementCard({
  label,
  value,
  unit = 'cm',
  confidence = 'high',
  measurementType = 'length',
  onEdit,
  index = 0,
}: MeasurementCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Staggered entrance
  useEffect(() => {
    const delay = index * STAGGER_DELAY;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index, fadeAnim, slideAnim]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (!onEdit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditValue(String(value));
    setIsEditing(true);
  }, [onEdit, value]);

  const handleConfirm = useCallback(() => {
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed) && parsed > 0) {
      onEdit?.(parsed);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsEditing(false);
  }, [editValue, onEdit]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditValue(String(value));
  }, [value]);

  const iconColor = colors.neon.blue;
  const confidenceColor = CONFIDENCE_COLORS[confidence];

  return (
    <Animated.View
      style={[
        styles.cardOuter,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={!onEdit}
        style={styles.card}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          {measurementType === 'circumference' ? (
            <TapeIcon color={iconColor} />
          ) : (
            <RulerIcon color={iconColor} />
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{label}</Text>
            {/* Confidence dot */}
            <View
              style={[
                styles.confidenceDot,
                { backgroundColor: confidenceColor },
              ]}
            />
          </View>

          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="numeric"
                autoFocus
                selectTextOnFocus
                onSubmitEditing={handleConfirm}
                onBlur={handleCancel}
              />
              <Text style={styles.unitText}>{unit}</Text>
              <Pressable onPress={handleConfirm} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>&#10003;</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.valueRow}>
              <Text style={styles.value}>{value}</Text>
              <Text style={styles.unitText}>{unit}</Text>
            </View>
          )}
        </View>

        {/* Edit indicator */}
        {onEdit && !isEditing && (
          <View style={styles.editIndicator}>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path
                d="M 16 3 L 21 8 L 8 21 L 3 21 L 3 16 Z M 14 6 L 18 10"
                fill="none"
                stroke={colors.dark[300]}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: spacing[2],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: glassMorphism.background,
    borderRadius: borderRadius.lg,
    borderWidth: glassMorphism.borderWidth,
    borderColor: glassMorphism.borderColor,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: 2,
  },
  label: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[1],
  },
  value: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  unitText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  input: {
    backgroundColor: colors.dark[700],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.neon.blue,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    minWidth: 60,
    textAlign: 'center',
  },
  confirmBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neon.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: colors.dark[900],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  editIndicator: {
    marginLeft: spacing[2],
    opacity: 0.5,
  },
});
