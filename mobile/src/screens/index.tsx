/**
 * Real Me Scanner - Splash / Welcome Screen
 * Animated neon logo with cyberpunk aesthetic
 */

import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, typography, spacing, borderRadius, shadows } from '../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid configuration for background pattern
const GRID_LINES_HORIZONTAL = 20;
const GRID_LINES_VERTICAL = 12;
const GRID_SPACING_H = SCREEN_HEIGHT / GRID_LINES_HORIZONTAL;
const GRID_SPACING_V = SCREEN_WIDTH / GRID_LINES_VERTICAL;

// Particle configuration
const NUM_PARTICLES = 30;

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: NUM_PARTICLES }, () => ({
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.1,
    speed: Math.random() * 3000 + 2000,
    delay: Math.random() * 2000,
  }));
}

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(15)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(30)).current;
  const gridOpacity = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: NUM_PARTICLES }, () => new Animated.Value(0))
  ).current;

  const particles = useRef(generateParticles()).current;

  useEffect(() => {
    // Staggered entrance animation sequence
    Animated.sequence([
      // 1. Fade in background grid
      Animated.timing(gridOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // 2. Logo entrance
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 3. Title
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 4. Subtitle
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 5. Buttons
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous logo glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoGlow, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating particle animations
    particleAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(particles[i].delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: particles[i].speed,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: particles[i].speed,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  // Interpolated glow opacity for logo
  const glowOpacity = logoGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#101113', '#0d0e10', '#101113']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Animated grid background */}
      <Animated.View style={[styles.gridContainer, { opacity: gridOpacity }]}>
        {/* Horizontal grid lines */}
        {Array.from({ length: GRID_LINES_HORIZONTAL }, (_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.gridLineH,
              { top: i * GRID_SPACING_H },
            ]}
          />
        ))}
        {/* Vertical grid lines */}
        {Array.from({ length: GRID_LINES_VERTICAL }, (_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.gridLineV,
              { left: i * GRID_SPACING_V },
            ]}
          />
        ))}
      </Animated.View>

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <Animated.View
          key={`particle-${i}`}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              opacity: particleAnims[i].interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
              }),
              transform: [
                {
                  translateY: particleAnims[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -40],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Radial glow behind logo */}
      <Animated.View style={[styles.radialGlow, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={['rgba(0,212,255,0.12)', 'rgba(178,73,248,0.06)', 'transparent']}
          style={styles.radialGlowInner}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            {/* Outer glow ring */}
            <Animated.View style={[styles.logoGlowRing, { opacity: glowOpacity }]} />

            {/* Logo background */}
            <LinearGradient
              colors={[...gradients.neonHorizontal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBg}
            >
              <Text style={styles.logoText}>RM</Text>
            </LinearGradient>
          </Animated.View>

          {/* App Title */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.titleReal}>Real </Text>
              <Text style={styles.titleMe}>Me</Text>
            </View>
            <Text style={styles.titleScanner}>SCANNER</Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View
            style={{
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            }}
          >
            <Text style={styles.subtitle}>Your Digital Twin Starts Here</Text>
            <View style={styles.subtitleAccent} />
          </Animated.View>
        </View>

        {/* Buttons Section */}
        <Animated.View
          style={[
            styles.buttonSection,
            {
              opacity: buttonsOpacity,
              transform: [{ translateY: buttonsTranslateY }],
              paddingBottom: Math.max(insets.bottom, spacing[6]),
            },
          ]}
        >
          {/* Get Started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            activeOpacity={0.85}
            style={styles.primaryButtonWrapper}
          >
            <LinearGradient
              colors={[...gradients.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7} style={styles.signInButton}>
            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom decorative line */}
      <LinearGradient
        colors={['transparent', colors.neon.blue, colors.neon.purple, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bottomLine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Grid background ──────────────────────────────────────────────────────
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 212, 255, 0.04)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 212, 255, 0.04)',
  },

  // ── Particles ────────────────────────────────────────────────────────────
  particle: {
    position: 'absolute',
    backgroundColor: colors.neon.blue,
  },

  // ── Radial glow ──────────────────────────────────────────────────────────
  radialGlow: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.15,
    left: SCREEN_WIDTH * 0.5 - 160,
    width: 320,
    height: 320,
  },
  radialGlowInner: {
    width: '100%',
    height: '100%',
    borderRadius: 160,
  },

  // ── Content ──────────────────────────────────────────────────────────────
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },

  // ── Logo Section ─────────────────────────────────────────────────────────
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing[10],
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
  },
  logoGlowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    ...shadows.neonBlue,
  },
  logoBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.neonBlue,
  },
  logoText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: typography.fontSize['4xl'],
    color: colors.white,
    letterSpacing: 4,
  },

  // ── Title ────────────────────────────────────────────────────────────────
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  titleReal: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: typography.fontSize['4xl'],
    color: colors.text.primary,
    letterSpacing: 1,
  },
  titleMe: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: typography.fontSize['4xl'],
    color: colors.neon.blue,
    letterSpacing: 1,
  },
  titleScanner: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    letterSpacing: 12,
    textAlign: 'center',
    marginTop: spacing[1],
  },

  // ── Subtitle ─────────────────────────────────────────────────────────────
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing[6],
    letterSpacing: 0.5,
  },
  subtitleAccent: {
    width: 60,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.neon.purple,
    alignSelf: 'center',
    marginTop: spacing[4],
    opacity: 0.6,
  },

  // ── Buttons ──────────────────────────────────────────────────────────────
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing[6],
  },
  primaryButtonWrapper: {
    width: '100%',
    borderRadius: borderRadius.xl,
    ...shadows.neonBlue,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: typography.fontSize.lg,
    color: colors.white,
    letterSpacing: 1,
  },
  signInButton: {
    paddingVertical: spacing[4],
    marginTop: spacing[2],
  },
  signInText: {
    fontFamily: 'Inter-Regular',
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
  },
  signInLink: {
    fontFamily: 'Inter-SemiBold',
    color: colors.neon.blue,
  },

  // ── Bottom decorative line ───────────────────────────────────────────────
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: spacing[10],
    right: spacing[10],
    height: 1,
    opacity: 0.4,
  },
});
