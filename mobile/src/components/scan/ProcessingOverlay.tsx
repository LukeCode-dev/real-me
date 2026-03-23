import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { G, Path, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const STATUS_MESSAGES = [
  'Analyzing body proportions...',
  'Mapping skeletal structure...',
  'Calculating measurements...',
  'Building 3D wireframe...',
  'Refining mesh topology...',
  'Generating digital twin...',
  'Finalizing scan data...',
];

interface ProcessingOverlayProps {
  progress?: number; // 0 to 100
  isVisible?: boolean;
}

// Simplified wireframe body path for the rotating figure
const WIREFRAME_PATH =
  'M 0 -60 L 0 -45 ' + // head to neck
  'M -20 -35 L 0 -45 L 20 -35 ' + // shoulders
  'M -20 -35 L -28 0 L -32 25 ' + // left arm
  'M 20 -35 L 28 0 L 32 25 ' + // right arm
  'M 0 -45 L 0 15 ' + // spine
  'M -15 15 L 0 15 L 15 15 ' + // hips
  'M -15 15 L -18 50 L -20 80 ' + // left leg
  'M 15 15 L 18 50 L 20 80'; // right leg

const PARTICLE_COUNT = 20;

function Particle({ delay, startX }: { delay: number; startX: number }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(startX)).current;

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 60;
    const duration = 3000 + Math.random() * 2000;

    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -40,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.7,
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.7,
              duration: duration * 0.5,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.3,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(translateX, {
            toValue: startX + drift,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        // Reset
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: startX,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [delay, startX, translateY, opacity, translateX]);

  const size = 2 + Math.random() * 3;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    />
  );
}

export default function ProcessingOverlay({
  progress = 0,
  isVisible = true,
}: ProcessingOverlayProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scanLineY = useRef(new Animated.Value(0)).current;
  const [statusIndex, setStatusIndex] = useState(0);
  const statusFade = useRef(new Animated.Value(1)).current;

  // Particles
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        delay: Math.random() * 3000,
        startX: Math.random() * SCREEN_WIDTH,
      })),
    [],
  );

  // Fade in/out
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);

  // Wireframe rotation
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spin.start();
    return () => spin.stop();
  }, [rotateAnim]);

  // Scan line bounce
  useEffect(() => {
    const scan = Animated.loop(
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
    );
    scan.start();
    return () => scan.stop();
  }, [scanLineY]);

  // Cycle status messages
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(statusFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        Animated.timing(statusFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [statusFade]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Simulate 3D rotation with scaleX
  const scaleX = rotateAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.3, -1, -0.3, 1],
  });

  const scanLineTranslate = scanLineY.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  });

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      {/* Floating particles */}
      {particles.map((p) => (
        <Particle key={p.id} delay={p.delay} startX={p.startX} />
      ))}

      {/* Wireframe body container */}
      <View style={styles.wireframeContainer}>
        <Animated.View
          style={[
            styles.wireframeInner,
            { transform: [{ scaleX }] },
          ]}
        >
          <Svg width={120} height={200} viewBox="-40 -70 80 160">
            <G>
              <Path
                d={WIREFRAME_PATH}
                fill="none"
                stroke={colors.neon.blue}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
              {/* Joint dots */}
              {[
                [0, -60], [0, -45], // head, neck
                [-20, -35], [20, -35], // shoulders
                [-28, 0], [28, 0], // elbows
                [-32, 25], [32, 25], // hands
                [0, 15], // center hip
                [-15, 15], [15, 15], // hips
                [-18, 50], [18, 50], // knees
                [-20, 80], [20, 80], // feet
              ].map(([x, y], i) => (
                <Line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={y}
                  stroke={colors.neon.blue}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              ))}
            </G>
          </Svg>
        </Animated.View>

        {/* Scan line */}
        <Animated.View
          style={[
            styles.scanLine,
            { transform: [{ translateY: scanLineTranslate }] },
          ]}
        >
          <LinearGradient
            colors={['transparent', colors.neon.blue, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.scanLineGradient}
          />
        </Animated.View>
      </View>

      {/* Progress percentage */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressNumber}>{Math.round(progress)}</Text>
        <Text style={styles.progressPercent}>%</Text>
      </View>

      {/* Status text */}
      <Animated.View style={[styles.statusContainer, { opacity: statusFade }]}>
        <Text style={styles.statusText}>{STATUS_MESSAGES[statusIndex]}</Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]}>
          <LinearGradient
            colors={[colors.neon.blue, colors.neon.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 17, 19, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  particle: {
    position: 'absolute',
    backgroundColor: colors.neon.blue,
  },
  wireframeContainer: {
    width: 160,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  wireframeInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    width: 140,
    height: 2,
    overflow: 'hidden',
  },
  scanLineGradient: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing[3],
  },
  progressNumber: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neon.blue,
    includeFontPadding: false,
  },
  progressPercent: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.neon.purple,
    marginBottom: 6,
    marginLeft: 2,
  },
  statusContainer: {
    marginBottom: spacing[6],
    paddingHorizontal: spacing[6],
  },
  statusText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  progressBarTrack: {
    width: SCREEN_WIDTH * 0.6,
    height: 4,
    backgroundColor: colors.dark[600],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
});
