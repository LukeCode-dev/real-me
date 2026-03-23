/**
 * Real Me Scanner - Scan Processing Screen
 * Animated processing visualization with rotating wireframe, scanning line,
 * particle effects, and cycling status messages. Auto-navigates when done.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Line,
  G,
  Rect,
} from 'react-native-svg';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Types ---

interface ScanProcessingProps {
  navigation: any;
}

// --- Constants ---

const STATUS_MESSAGES = [
  'Analyzing body proportions...',
  'Mapping facial features...',
  'Generating 3D mesh...',
  'Calculating measurements...',
  'Refining body contours...',
  'Processing skin texture...',
  'Creating your digital twin...',
];

const PROCESSING_DURATION = 8000; // 8 seconds total
const PARTICLE_COUNT = 30;

// --- Particle System ---

function useParticles(count: number) {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random() * 0.6 + 0.1),
      scale: new Animated.Value(Math.random() * 0.8 + 0.3),
    })),
  ).current;

  useEffect(() => {
    particles.forEach((p) => {
      const animateParticle = () => {
        const duration = 3000 + Math.random() * 4000;
        Animated.parallel([
          Animated.timing(p.x, {
            toValue: Math.random() * SCREEN_WIDTH,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(p.y, {
            toValue: Math.random() * SCREEN_HEIGHT,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.opacity, {
              toValue: Math.random() * 0.7 + 0.2,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: Math.random() * 0.3 + 0.05,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(animateParticle);
      };
      animateParticle();
    });
  }, []);

  return particles;
}

// --- Wireframe Body SVG (static, rotation handled by Animated) ---

function WireframeBody() {
  const cx = 120;
  const cy = 160;

  return (
    <Svg width={240} height={320} viewBox="0 0 240 320">
      {/* Head */}
      <Ellipse
        cx={cx}
        cy={40}
        rx={22}
        ry={28}
        fill="none"
        stroke={colors.neon.blue}
        strokeWidth={1.2}
        opacity={0.7}
      />
      {/* Neck */}
      <Line x1={cx - 6} y1={65} x2={cx - 6} y2={78} stroke={colors.neon.blue} strokeWidth={1} opacity={0.5} />
      <Line x1={cx + 6} y1={65} x2={cx + 6} y2={78} stroke={colors.neon.blue} strokeWidth={1} opacity={0.5} />
      {/* Shoulders */}
      <Line x1={cx - 6} y1={78} x2={cx - 50} y2={88} stroke={colors.neon.blue} strokeWidth={1} opacity={0.6} />
      <Line x1={cx + 6} y1={78} x2={cx + 50} y2={88} stroke={colors.neon.blue} strokeWidth={1} opacity={0.6} />
      {/* Arms */}
      <Line x1={cx - 50} y1={88} x2={cx - 58} y2={160} stroke={colors.neon.blue} strokeWidth={1} opacity={0.5} />
      <Line x1={cx + 50} y1={88} x2={cx + 58} y2={160} stroke={colors.neon.blue} strokeWidth={1} opacity={0.5} />
      {/* Forearms */}
      <Line x1={cx - 58} y1={160} x2={cx - 52} y2={210} stroke={colors.neon.blue} strokeWidth={1} opacity={0.4} />
      <Line x1={cx + 58} y1={160} x2={cx + 52} y2={210} stroke={colors.neon.blue} strokeWidth={1} opacity={0.4} />
      {/* Torso */}
      <Line x1={cx - 30} y1={90} x2={cx - 25} y2={170} stroke={colors.neon.blue} strokeWidth={1} opacity={0.6} />
      <Line x1={cx + 30} y1={90} x2={cx + 25} y2={170} stroke={colors.neon.blue} strokeWidth={1} opacity={0.6} />
      {/* Waist */}
      <Line x1={cx - 25} y1={170} x2={cx - 22} y2={185} stroke={colors.neon.purple} strokeWidth={1} opacity={0.6} />
      <Line x1={cx + 25} y1={170} x2={cx + 22} y2={185} stroke={colors.neon.purple} strokeWidth={1} opacity={0.6} />
      {/* Hips */}
      <Line x1={cx - 22} y1={185} x2={cx - 28} y2={195} stroke={colors.neon.purple} strokeWidth={1} opacity={0.5} />
      <Line x1={cx + 22} y1={185} x2={cx + 28} y2={195} stroke={colors.neon.purple} strokeWidth={1} opacity={0.5} />
      {/* Legs */}
      <Line x1={cx - 28} y1={195} x2={cx - 30} y2={270} stroke={colors.neon.purple} strokeWidth={1} opacity={0.5} />
      <Line x1={cx + 28} y1={195} x2={cx + 30} y2={270} stroke={colors.neon.purple} strokeWidth={1} opacity={0.5} />
      {/* Lower legs */}
      <Line x1={cx - 30} y1={270} x2={cx - 28} y2={310} stroke={colors.neon.pink} strokeWidth={1} opacity={0.4} />
      <Line x1={cx + 30} y1={270} x2={cx + 28} y2={310} stroke={colors.neon.pink} strokeWidth={1} opacity={0.4} />
      {/* Horizontal wireframe lines */}
      <Line x1={cx - 30} y1={105} x2={cx + 30} y2={105} stroke={colors.neon.blue} strokeWidth={0.5} opacity={0.3} />
      <Line x1={cx - 28} y1={130} x2={cx + 28} y2={130} stroke={colors.neon.blue} strokeWidth={0.5} opacity={0.3} />
      <Line x1={cx - 26} y1={155} x2={cx + 26} y2={155} stroke={colors.neon.purple} strokeWidth={0.5} opacity={0.3} />
      <Line x1={cx - 22} y1={185} x2={cx + 22} y2={185} stroke={colors.neon.purple} strokeWidth={0.5} opacity={0.3} />
      <Line x1={cx - 30} y1={230} x2={cx + 30} y2={230} stroke={colors.neon.purple} strokeWidth={0.5} opacity={0.3} />
      <Line x1={cx - 30} y1={270} x2={cx + 30} y2={270} stroke={colors.neon.pink} strokeWidth={0.5} opacity={0.3} />
      {/* Joint circles */}
      <Circle cx={cx - 50} cy={88} r={3} fill="none" stroke={colors.neon.blue} strokeWidth={1} opacity={0.6} />
      <Circle cx={cx + 50} cy={88} r={3} fill="none" stroke={colors.neon.blue} strokeWidth={1} opacity={0.6} />
      <Circle cx={cx - 58} cy={160} r={3} fill="none" stroke={colors.neon.blue} strokeWidth={1} opacity={0.5} />
      <Circle cx={cx + 58} cy={160} r={3} fill="none" stroke={colors.neon.blue} strokeWidth={1} opacity={0.5} />
      <Circle cx={cx - 28} cy={195} r={3} fill="none" stroke={colors.neon.purple} strokeWidth={1} opacity={0.5} />
      <Circle cx={cx + 28} cy={195} r={3} fill="none" stroke={colors.neon.purple} strokeWidth={1} opacity={0.5} />
      <Circle cx={cx - 30} cy={270} r={3} fill="none" stroke={colors.neon.pink} strokeWidth={1} opacity={0.4} />
      <Circle cx={cx + 30} cy={270} r={3} fill="none" stroke={colors.neon.pink} strokeWidth={1} opacity={0.4} />
    </Svg>
  );
}

// --- Main Component ---

export default function ScanProcessingScreen({ navigation }: ScanProcessingProps) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  // Animations
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scanLineY = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const statusOpacity = useRef(new Animated.Value(1)).current;
  const glowPulse = useRef(new Animated.Value(0.5)).current;

  const particles = useParticles(PARTICLE_COUNT);

  // Entry fade
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Rotate wireframe
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // Scan line
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Glow pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Progress simulation
  useEffect(() => {
    const interval = 80;
    const totalSteps = PROCESSING_DURATION / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const p = Math.min(step / totalSteps, 1);
      // Ease the progress (slow start, accelerate, slow end)
      const eased = p < 0.5
        ? 2 * p * p
        : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setProgress(Math.round(eased * 100));

      Animated.timing(progressAnim, {
        toValue: eased,
        duration: interval,
        useNativeDriver: false,
      }).start();

      if (step >= totalSteps) {
        clearInterval(timer);
        // Navigate to results
        setTimeout(() => {
          navigation.navigate('ScanResults');
        }, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Cycle status messages
  useEffect(() => {
    const messageInterval = PROCESSING_DURATION / STATUS_MESSAGES.length;
    let idx = 0;

    const timer = setInterval(() => {
      // Fade out, change, fade in
      Animated.timing(statusOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        idx = (idx + 1) % STATUS_MESSAGES.length;
        setStatusIndex(idx);
        Animated.timing(statusOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, messageInterval);

    return () => clearInterval(timer);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scanLineTranslateY = scanLineY.interpolate({
    inputRange: [0, 1],
    outputRange: [-160, 160],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        {/* Floating particles */}
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { scale: p.scale },
                ],
                opacity: p.opacity,
              },
            ]}
          />
        ))}

        {/* Central visualization area */}
        <View style={styles.visualContainer}>
          {/* Glow background */}
          <Animated.View style={[styles.glowBg, { opacity: glowPulse }]}>
            <LinearGradient
              colors={['rgba(0,212,255,0.08)', 'rgba(178,73,248,0.04)', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </Animated.View>

          {/* Rotating wireframe body */}
          <Animated.View
            style={[
              styles.wireframeContainer,
              {
                transform: [
                  { perspective: 800 },
                  { rotateY: rotation },
                ],
              },
            ]}
          >
            <WireframeBody />
          </Animated.View>

          {/* Scanning line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{ translateY: scanLineTranslateY }],
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', colors.neon.blue, 'transparent']}
              style={styles.scanLineGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>

        {/* Status text */}
        <Animated.View style={[styles.statusContainer, { opacity: statusOpacity }]}>
          <Text style={styles.statusText}>{STATUS_MESSAGES[statusIndex]}</Text>
        </Animated.View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={[colors.neon.blue, colors.neon.purple, colors.neon.pink]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {/* Processing label */}
        <View style={styles.labelSection}>
          <Text style={styles.processingTitle}>Processing Your Scan</Text>
          <Text style={styles.processingSubtitle}>
            Please wait while we create your digital twin
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Body Angles</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Face Captures</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
  },

  // Particles
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neon.blue,
  },

  // Visualization
  visualContainer: {
    width: 260,
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[8],
    overflow: 'hidden',
  },
  glowBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius['2xl'],
  },
  wireframeContainer: {
    width: 240,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 3,
  },
  scanLineGradient: {
    flex: 1,
  },

  // Status
  statusContainer: {
    marginBottom: spacing[8],
    minHeight: 24,
  },
  statusText: {
    fontSize: typography.fontSize.lg,
    color: colors.neon.blue,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },

  // Progress
  progressSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[6],
    paddingHorizontal: spacing[4],
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.dark[600],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginRight: spacing[4],
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressText: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    width: 50,
    textAlign: 'right',
  },

  // Labels
  labelSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  processingTitle: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[2],
  },
  processingSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,27,30,0.8)',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
});
