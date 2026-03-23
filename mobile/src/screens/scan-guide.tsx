/**
 * Real Me Scanner - Scan Guide Screen
 * Pre-scan preparation with step-by-step tips and environment checks
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'expo-camera';
import { colors, typography, spacing, borderRadius, shadows, glassMorphism } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Types ---

type ScanType = 'body' | 'face';

interface ScanGuideProps {
  navigation: any;
  route: {
    params: {
      type: ScanType;
    };
  };
}

interface ChecklistItem {
  id: string;
  label: string;
  icon: string;
  description: string;
}

// --- Data ---

const bodyTips: ChecklistItem[] = [
  {
    id: 'clothing',
    label: 'Wear fitted clothing',
    icon: '\u{1F455}',
    description: 'Tight-fitting clothes help capture accurate body proportions',
  },
  {
    id: 'lighting',
    label: 'Well-lit room',
    icon: '\u{1F4A1}',
    description: 'Even lighting without harsh shadows for best results',
  },
  {
    id: 'space',
    label: 'Clear 6ft of space',
    icon: '\u{1F4CF}',
    description: 'Enough room to stand and rotate comfortably',
  },
  {
    id: 'surface',
    label: 'Stable phone placement',
    icon: '\u{1F4F1}',
    description: 'Place on a surface at chest height, or have someone help',
  },
];

const faceTips: ChecklistItem[] = [
  {
    id: 'accessories',
    label: 'Remove glasses & hats',
    icon: '\u{1F453}',
    description: 'Clear view of your face ensures accurate mapping',
  },
  {
    id: 'lighting',
    label: 'Face a light source',
    icon: '\u2728',
    description: 'Natural or bright artificial light facing you',
  },
  {
    id: 'expression',
    label: 'Start with neutral expression',
    icon: '\u{1F610}',
    description: 'Relaxed face first, then we\'ll capture expressions',
  },
];

// --- Animated Checklist Item ---

function AnimatedCheckItem({
  item,
  index,
  checked,
}: {
  item: ChecklistItem;
  index: number;
  checked: boolean;
}) {
  const checkAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entry
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (checked) {
      Animated.spring(checkAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [checked]);

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.3, 1],
  });

  return (
    <Animated.View
      style={[
        styles.tipCard,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(26,27,30,0.85)', 'rgba(20,21,23,0.95)']}
        style={styles.tipCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.tipRow}>
          <Text style={styles.tipIcon}>{item.icon}</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>{item.label}</Text>
            <Text style={styles.tipDescription}>{item.description}</Text>
          </View>
          <Animated.View
            style={[
              styles.checkCircle,
              checked ? styles.checkCircleActive : {},
              { transform: [{ scale: checked ? checkScale : 1 }] },
            ]}
          >
            {checked && <Text style={styles.checkMark}>{'\u2713'}</Text>}
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// --- Component ---

export default function ScanGuideScreen({ navigation, route }: ScanGuideProps) {
  const { type } = route.params;
  const isBody = type === 'body';
  const tips = isBody ? bodyTips : faceTips;

  // State
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [lightingOk, setLightingOk] = useState<boolean | null>(null);

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const allChecked = checkedItems.size === tips.length;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    checkCameraPermission();
    simulateLightingCheck();

    // Auto-check items with staggered timing
    tips.forEach((tip, i) => {
      setTimeout(() => {
        setCheckedItems((prev) => new Set(prev).add(tip.id));
      }, 800 + i * 600);
    });
  }, []);

  // Pulse the button once all checks pass
  useEffect(() => {
    if (allChecked && cameraPermission) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.03,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [allChecked, cameraPermission]);

  async function checkCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  }

  function simulateLightingCheck() {
    // Simulated lighting sensor check
    setTimeout(() => {
      setLightingOk(true);
    }, 1500);
  }

  function handleReady() {
    if (!cameraPermission) {
      Alert.alert('Camera Required', 'Please grant camera access to start scanning.', [
        { text: 'OK' },
      ]);
      return;
    }
    const target = isBody ? 'BodyScan' : 'FaceScan';
    navigation.navigate(target);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeIn }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backArrow}>{'\u2190'}</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>
                {isBody ? 'Body Scan' : 'Face Scan'} Preparation
              </Text>
              <Text style={styles.headerSubtitle}>
                Follow these steps for the best results
              </Text>
            </View>
          </View>

          {/* Scan type badge */}
          <View style={styles.typeBadge}>
            <LinearGradient
              colors={isBody ? [colors.neon.blue, colors.neon.purple] : [colors.neon.pink, colors.neon.purple]}
              style={styles.typeBadgeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.typeBadgeIcon}>{isBody ? '\u{1F9CD}' : '\u{1F642}'}</Text>
              <Text style={styles.typeBadgeText}>
                {isBody ? '4 angles \u00B7 ~3 min' : '3 expressions \u00B7 ~1 min'}
              </Text>
            </LinearGradient>
          </View>

          {/* Checklist */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preparation Checklist</Text>
            {tips.map((tip, i) => (
              <AnimatedCheckItem
                key={tip.id}
                item={tip}
                index={i}
                checked={checkedItems.has(tip.id)}
              />
            ))}
          </View>

          {/* Environment Check */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Environment Check</Text>

            <View style={styles.envCard}>
              <LinearGradient
                colors={['rgba(26,27,30,0.85)', 'rgba(20,21,23,0.95)']}
                style={styles.envCardGradient}
              >
                {/* Camera permission */}
                <View style={styles.envRow}>
                  <Text style={styles.envIcon}>{'\u{1F3A5}'}</Text>
                  <Text style={styles.envLabel}>Camera Permission</Text>
                  <View
                    style={[
                      styles.envStatus,
                      cameraPermission === null
                        ? styles.envStatusChecking
                        : cameraPermission
                        ? styles.envStatusOk
                        : styles.envStatusFail,
                    ]}
                  >
                    <Text style={styles.envStatusText}>
                      {cameraPermission === null
                        ? 'Checking...'
                        : cameraPermission
                        ? 'Granted'
                        : 'Denied'}
                    </Text>
                  </View>
                </View>

                <View style={styles.envDivider} />

                {/* Lighting */}
                <View style={styles.envRow}>
                  <Text style={styles.envIcon}>{'\u2600\uFE0F'}</Text>
                  <Text style={styles.envLabel}>Lighting Quality</Text>
                  <View
                    style={[
                      styles.envStatus,
                      lightingOk === null
                        ? styles.envStatusChecking
                        : lightingOk
                        ? styles.envStatusOk
                        : styles.envStatusFail,
                    ]}
                  >
                    <Text style={styles.envStatusText}>
                      {lightingOk === null ? 'Analyzing...' : lightingOk ? 'Good' : 'Too dark'}
                    </Text>
                  </View>
                </View>

                <View style={styles.envDivider} />

                {/* Space guidance */}
                <View style={styles.envRow}>
                  <Text style={styles.envIcon}>{'\u{1F4D0}'}</Text>
                  <Text style={styles.envLabel}>
                    {isBody ? 'Space (6ft needed)' : 'Distance (arm length)'}
                  </Text>
                  <View style={[styles.envStatus, styles.envStatusInfo]}>
                    <Text style={styles.envStatusText}>Ready</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Ready Button */}
          <Animated.View
            style={[styles.readyButtonWrapper, { transform: [{ scale: buttonScale }] }]}
          >
            <TouchableOpacity
              style={[
                styles.readyButton,
                (!cameraPermission || !allChecked) && styles.readyButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleReady}
            >
              <LinearGradient
                colors={
                  cameraPermission && allChecked
                    ? [colors.neon.green, '#00c98a']
                    : [colors.dark[400], colors.dark[500]]
                }
                style={styles.readyButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.readyButtonIcon}>{'\u{1F3AF}'}</Text>
                <Text
                  style={[
                    styles.readyButtonText,
                    (!cameraPermission || !allChecked) && styles.readyButtonTextDisabled,
                  ]}
                >
                  Ready to Scan
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom note */}
          <Text style={styles.bottomNote}>
            Your photos are processed on-device first, then securely uploaded.{'\n'}
            We never share your body data.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[14],
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[6],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: glassMorphism.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
    borderWidth: 1,
    borderColor: glassMorphism.borderColor,
  },
  backArrow: {
    fontSize: 20,
    color: colors.white,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: 4,
  },

  // Type badge
  typeBadge: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: spacing[6],
  },
  typeBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  typeBadgeIcon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  typeBadgeText: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },

  // Section
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[4],
  },

  // Tip cards
  tipCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing[3],
    borderWidth: glassMorphism.borderWidth,
    borderColor: glassMorphism.borderColor,
  },
  tipCardGradient: {
    padding: spacing[4],
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: spacing[4],
  },
  tipContent: {
    flex: 1,
  },
  tipLabel: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  tipDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.dark[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[3],
  },
  checkCircleActive: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(5,255,161,0.15)',
  },
  checkMark: {
    fontSize: 14,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.bold,
  },

  // Environment card
  envCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: glassMorphism.borderWidth,
    borderColor: glassMorphism.borderColor,
  },
  envCardGradient: {
    padding: spacing[4],
  },
  envRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  envIcon: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  envLabel: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  envStatus: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  envStatusChecking: {
    backgroundColor: 'rgba(255,170,0,0.12)',
  },
  envStatusOk: {
    backgroundColor: 'rgba(5,255,161,0.12)',
  },
  envStatusFail: {
    backgroundColor: 'rgba(255,68,68,0.12)',
  },
  envStatusInfo: {
    backgroundColor: 'rgba(0,212,255,0.12)',
  },
  envStatusText: {
    fontSize: typography.fontSize.xs,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.semibold,
  },
  envDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[2],
  },

  // Ready button
  readyButtonWrapper: {
    marginBottom: spacing[4],
  },
  readyButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.neonGreen,
  },
  readyButtonDisabled: {
    opacity: 0.5,
  },
  readyButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[5],
  },
  readyButtonIcon: {
    fontSize: 22,
    marginRight: spacing[3],
  },
  readyButtonText: {
    fontSize: typography.fontSize.xl,
    color: colors.dark[900],
    fontWeight: typography.fontWeight.bold,
  },
  readyButtonTextDisabled: {
    color: colors.text.tertiary,
  },

  // Bottom note
  bottomNote: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing[4],
  },
});
