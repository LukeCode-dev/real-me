/**
 * Real Me Scanner - Scan Results Screen
 * Displays extracted measurements in card grid, accuracy score,
 * body type, editable values, confetti celebration, and save/retake actions
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, {
  Ellipse,
  Line,
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';
import { colors, typography, spacing, borderRadius, shadows, glassMorphism } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Types ---

interface ScanResultsProps {
  navigation: any;
}

interface Measurement {
  key: string;
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
}

// --- Constants ---

const INITIAL_MEASUREMENTS: Measurement[] = [
  { key: 'height', label: 'Height', value: '178', unit: 'cm', icon: '\u{1F4CF}', color: colors.neon.blue },
  { key: 'weight', label: 'Weight (est.)', value: '75', unit: 'kg', icon: '\u2696\uFE0F', color: colors.neon.blue },
  { key: 'chest', label: 'Chest', value: '98', unit: 'cm', icon: '\u{1F455}', color: colors.neon.purple },
  { key: 'waist', label: 'Waist', value: '82', unit: 'cm', icon: '\u{1F4D0}', color: colors.neon.purple },
  { key: 'hips', label: 'Hips', value: '96', unit: 'cm', icon: '\u{1F4D0}', color: colors.neon.pink },
  { key: 'shoulders', label: 'Shoulders', value: '46', unit: 'cm', icon: '\u{1F4CF}', color: colors.neon.blue },
  { key: 'inseam', label: 'Inseam', value: '82', unit: 'cm', icon: '\u{1F9CD}', color: colors.neon.green },
  { key: 'armLength', label: 'Arm Length', value: '64', unit: 'cm', icon: '\u{1F4AA}', color: colors.neon.green },
  { key: 'neck', label: 'Neck', value: '38', unit: 'cm', icon: '\u{1F454}', color: colors.neon.pink },
  { key: 'shoeSize', label: 'Shoe Size', value: '42', unit: 'EU', icon: '\u{1F45F}', color: colors.neon.purple },
];

const CONFETTI_COUNT = 40;
const ACCURACY_SCORE = 97.8;
const BODY_TYPE = 'Athletic';

// --- Confetti Particle ---

function useConfetti(count: number) {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: new Animated.Value(SCREEN_WIDTH / 2),
      y: new Animated.Value(-20),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
      color: [colors.neon.blue, colors.neon.purple, colors.neon.pink, colors.neon.green, colors.warning][
        Math.floor(Math.random() * 5)
      ],
      size: 6 + Math.random() * 8,
    })),
  ).current;

  useEffect(() => {
    const animations = particles.map((p) => {
      const targetX = Math.random() * SCREEN_WIDTH;
      const targetY = SCREEN_WIDTH + Math.random() * 200;
      const duration = 2000 + Math.random() * 2000;
      const delay = Math.random() * 800;

      return Animated.parallel([
        Animated.timing(p.x, {
          toValue: targetX,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: targetY,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration,
          delay: delay + duration * 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: Math.random() * 10,
          duration,
          delay,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(30, animations).start();
  }, []);

  return particles;
}

// --- Avatar Silhouette with Measurement Lines ---

function AvatarMeasurementPreview() {
  const cx = 100;
  const bodyTop = 20;

  return (
    <Svg width={200} height={280} viewBox="0 0 200 280">
      {/* Head */}
      <Ellipse cx={cx} cy={bodyTop + 20} rx={18} ry={22} fill="none" stroke={colors.neon.blue} strokeWidth={1.5} opacity={0.6} />
      {/* Body silhouette */}
      <Line x1={cx} y1={bodyTop + 42} x2={cx} y2={bodyTop + 52} stroke={colors.neon.blue} strokeWidth={1} opacity={0.4} />
      <Line x1={cx - 35} y1={bodyTop + 58} x2={cx + 35} y2={bodyTop + 58} stroke={colors.neon.blue} strokeWidth={1} opacity={0.4} />
      {/* Torso outline */}
      <Line x1={cx - 22} y1={bodyTop + 60} x2={cx - 20} y2={bodyTop + 130} stroke={colors.neon.blue} strokeWidth={1.2} opacity={0.5} />
      <Line x1={cx + 22} y1={bodyTop + 60} x2={cx + 20} y2={bodyTop + 130} stroke={colors.neon.blue} strokeWidth={1.2} opacity={0.5} />
      {/* Legs */}
      <Line x1={cx - 18} y1={bodyTop + 135} x2={cx - 20} y2={bodyTop + 230} stroke={colors.neon.purple} strokeWidth={1.2} opacity={0.5} />
      <Line x1={cx + 18} y1={bodyTop + 135} x2={cx + 20} y2={bodyTop + 230} stroke={colors.neon.purple} strokeWidth={1.2} opacity={0.5} />

      {/* Measurement annotation lines */}
      {/* Height */}
      <Line x1={cx + 55} y1={bodyTop} x2={cx + 55} y2={bodyTop + 240} stroke={colors.neon.green} strokeWidth={0.8} opacity={0.4} strokeDasharray="3 3" />
      <SvgText x={cx + 60} y={bodyTop + 120} fill={colors.neon.green} fontSize={8} opacity={0.7}>178cm</SvgText>

      {/* Chest */}
      <Line x1={cx - 22} y1={bodyTop + 78} x2={cx + 22} y2={bodyTop + 78} stroke={colors.neon.blue} strokeWidth={0.8} opacity={0.5} strokeDasharray="2 2" />
      <SvgText x={cx - 55} y={bodyTop + 82} fill={colors.neon.blue} fontSize={7} opacity={0.7}>98cm</SvgText>

      {/* Waist */}
      <Line x1={cx - 18} y1={bodyTop + 110} x2={cx + 18} y2={bodyTop + 110} stroke={colors.neon.purple} strokeWidth={0.8} opacity={0.5} strokeDasharray="2 2" />
      <SvgText x={cx - 55} y={bodyTop + 114} fill={colors.neon.purple} fontSize={7} opacity={0.7}>82cm</SvgText>

      {/* Hips */}
      <Line x1={cx - 20} y1={bodyTop + 132} x2={cx + 20} y2={bodyTop + 132} stroke={colors.neon.pink} strokeWidth={0.8} opacity={0.5} strokeDasharray="2 2" />
      <SvgText x={cx + 30} y={bodyTop + 136} fill={colors.neon.pink} fontSize={7} opacity={0.7}>96cm</SvgText>

      {/* Inseam */}
      <Line x1={cx - 8} y1={bodyTop + 135} x2={cx - 8} y2={bodyTop + 230} stroke={colors.neon.green} strokeWidth={0.6} opacity={0.4} strokeDasharray="2 2" />
    </Svg>
  );
}

// --- Measurement Card ---

function MeasurementCard({
  measurement,
  index,
  onEdit,
}: {
  measurement: Measurement;
  index: number;
  onEdit: (key: string, value: string) => void;
}) {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(measurement.value);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: 300 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function handleSave() {
    onEdit(measurement.key, editValue);
    setEditing(false);
    Haptics.selectionAsync();
  }

  return (
    <Animated.View
      style={[
        styles.measureCard,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.measureCardInner}
        activeOpacity={0.7}
        onPress={() => setEditing(true)}
      >
        <View style={[styles.measureIconBg, { backgroundColor: `${measurement.color}15` }]}>
          <Text style={styles.measureIcon}>{measurement.icon}</Text>
        </View>
        <Text style={styles.measureLabel}>{measurement.label}</Text>
        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.editInput}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType="numeric"
              autoFocus
              onBlur={handleSave}
              onSubmitEditing={handleSave}
              selectionColor={colors.neon.blue}
            />
            <Text style={[styles.measureUnit, { color: measurement.color }]}>
              {measurement.unit}
            </Text>
          </View>
        ) : (
          <View style={styles.measureValueRow}>
            <Text style={[styles.measureValue, { color: measurement.color }]}>
              {measurement.value}
            </Text>
            <Text style={styles.measureUnit}>{measurement.unit}</Text>
          </View>
        )}
        {!editing && (
          <Text style={styles.editHint}>tap to edit</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// --- Main Component ---

export default function ScanResultsScreen({ navigation }: ScanResultsProps) {
  const [measurements, setMeasurements] = useState(INITIAL_MEASUREMENTS);

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const celebrateScale = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const confetti = useConfetti(CONFETTI_COUNT);

  useEffect(() => {
    // Entry
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Celebration animation
    Animated.spring(celebrateScale, {
      toValue: 1,
      friction: 4,
      tension: 60,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Accuracy badge pop
    Animated.spring(badgeScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Haptic celebration
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  function handleEditMeasurement(key: string, value: string) {
    setMeasurements((prev) =>
      prev.map((m) => (m.key === key ? { ...m, value } : m)),
    );
  }

  function handleSave() {
    Alert.alert(
      'Save & Create Avatar',
      'Your measurements will be saved and your digital twin will be generated.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // In real app: upload to API, then navigate
            navigation.navigate('Home');
          },
        },
      ],
    );
  }

  function handleRetake() {
    Alert.alert(
      'Retake Scan?',
      'This will discard the current results.',
      [
        { text: 'Keep Results', style: 'cancel' },
        {
          text: 'Retake',
          style: 'destructive',
          onPress: () => navigation.navigate('ScanGuide', { type: 'body' }),
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Confetti */}
      {confetti.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
              borderRadius: 2,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                {
                  rotate: p.rotate.interpolate({
                    inputRange: [0, 10],
                    outputRange: ['0deg', '3600deg'],
                  }),
                },
              ],
              opacity: p.opacity,
            },
          ]}
        />
      ))}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeIn }]}>
          {/* Celebration header */}
          <Animated.View
            style={[
              styles.celebrationHeader,
              { transform: [{ scale: celebrateScale }] },
            ]}
          >
            <Text style={styles.celebrationEmoji}>{'\u{1F389}'}</Text>
            <Text style={styles.celebrationTitle}>Scan Complete!</Text>
            <Text style={styles.celebrationSubtitle}>
              Your digital twin measurements are ready
            </Text>
          </Animated.View>

          {/* Accuracy & body type badges */}
          <View style={styles.badgeRow}>
            <Animated.View
              style={[styles.accuracyBadge, { transform: [{ scale: badgeScale }] }]}
            >
              <LinearGradient
                colors={[colors.neon.green, '#00c98a']}
                style={styles.accuracyBadgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.accuracyValue}>{ACCURACY_SCORE}%</Text>
                <Text style={styles.accuracyLabel}>Accuracy</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.View
              style={[styles.bodyTypeBadge, { transform: [{ scale: badgeScale }] }]}
            >
              <LinearGradient
                colors={[colors.neon.blue, colors.neon.purple]}
                style={styles.bodyTypeBadgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.bodyTypeValue}>{BODY_TYPE}</Text>
                <Text style={styles.bodyTypeLabel}>Body Type</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Avatar preview with measurements */}
          <Animated.View style={[styles.avatarPreviewCard, { opacity: glowAnim }]}>
            <LinearGradient
              colors={['rgba(0,212,255,0.05)', 'rgba(178,73,248,0.03)', 'rgba(16,17,19,0.9)']}
              style={styles.avatarPreviewGradient}
            >
              <AvatarMeasurementPreview />
            </LinearGradient>
          </Animated.View>

          {/* Measurements grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extracted Measurements</Text>
            <Text style={styles.sectionSubtitle}>Tap any measurement to adjust</Text>
            <View style={styles.measureGrid}>
              {measurements.map((m, i) => (
                <MeasurementCard
                  key={m.key}
                  measurement={m}
                  index={i}
                  onEdit={handleEditMeasurement}
                />
              ))}
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            {/* Save & Create Avatar */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleSave}
            >
              <LinearGradient
                colors={[colors.neon.blue, colors.neon.purple, colors.neon.pink]}
                style={styles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonIcon}>{'\u2728'}</Text>
                <Text style={styles.primaryButtonText}>Save & Create Avatar</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Retake */}
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={handleRetake}
            >
              <Text style={styles.secondaryButtonText}>Retake Scan</Text>
            </TouchableOpacity>

            {/* View in Real Me World */}
            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.7}
              onPress={() => {
                // Deep link to web platform
              }}
            >
              <Text style={styles.linkButtonText}>View in Real Me World {'\u2192'}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// --- Styles ---

const CARD_WIDTH = (SCREEN_WIDTH - spacing[5] * 2 - spacing[3]) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[14],
  },

  // Confetti
  confettiPiece: {
    position: 'absolute',
    zIndex: 100,
  },

  // Celebration
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  celebrationEmoji: {
    fontSize: 56,
    marginBottom: spacing[3],
  },
  celebrationTitle: {
    fontSize: typography.fontSize['4xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  celebrationSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing[2],
    textAlign: 'center',
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  accuracyBadge: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.neonGreen,
  },
  accuracyBadgeGradient: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  accuracyValue: {
    fontSize: typography.fontSize['2xl'],
    color: colors.dark[900],
    fontWeight: typography.fontWeight.bold,
  },
  accuracyLabel: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(16,17,19,0.7)',
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bodyTypeBadge: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.neonPurple,
  },
  bodyTypeBadgeGradient: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  bodyTypeValue: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  bodyTypeLabel: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Avatar preview
  avatarPreviewCard: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.15)',
    alignItems: 'center',
  },
  avatarPreviewGradient: {
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },

  // Section
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[1],
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[4],
  },

  // Measurement grid
  measureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },

  // Measurement card
  measureCard: {
    width: CARD_WIDTH,
    borderRadius: borderRadius.xl,
    backgroundColor: glassMorphism.background,
    borderWidth: glassMorphism.borderWidth,
    borderColor: glassMorphism.borderColor,
    overflow: 'hidden',
  },
  measureCardInner: {
    padding: spacing[4],
    alignItems: 'center',
  },
  measureIconBg: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  measureIcon: {
    fontSize: 18,
  },
  measureLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[1],
  },
  measureValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  measureValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  measureUnit: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: 4,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    borderBottomWidth: 2,
    borderBottomColor: colors.neon.blue,
    paddingVertical: 0,
    paddingHorizontal: 4,
    minWidth: 50,
    textAlign: 'center',
  },
  editHint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Actions
  actions: {
    marginTop: spacing[2],
    gap: spacing[3],
  },
  primaryButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.neonBlue,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[5],
  },
  primaryButtonIcon: {
    fontSize: 20,
    marginRight: spacing[2],
  },
  primaryButtonText: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryButton: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.dark[400],
    backgroundColor: 'rgba(26,27,30,0.8)',
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  linkButton: {
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.neon.blue,
    fontWeight: typography.fontWeight.medium,
  },
});
