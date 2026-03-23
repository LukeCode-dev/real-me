/**
 * Real Me Scanner - Home Dashboard Screen
 * Main hub after login with avatar status, quick actions, and scan CTA
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Linking,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, typography, spacing, borderRadius, shadows, glassMorphism } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Types ---

interface HomeScreenProps {
  navigation: any;
  userName?: string;
  scanCompletion?: number; // 0-100
  lastScanDate?: string | null;
  hasAvatar?: boolean;
}

// --- Helpers ---

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// --- Quick Action Data ---

const quickActions = [
  { key: 'body', label: 'Body Scan', icon: '\u{1F9CD}', route: 'ScanGuide', params: { type: 'body' } },
  { key: 'face', label: 'Face Scan', icon: '\u{1F642}', route: 'ScanGuide', params: { type: 'face' } },
  { key: 'avatar', label: 'View Avatar', icon: '\u{1F464}', route: 'AvatarView', params: {} },
  { key: 'settings', label: 'Settings', icon: '\u2699\uFE0F', route: 'Settings', params: {} },
];

const recentActivity = [
  { id: '1', label: 'Body scan completed', time: '2 hours ago', icon: '\u2705' },
  { id: '2', label: 'Face scan completed', time: '2 hours ago', icon: '\u2705' },
  { id: '3', label: 'Avatar created', time: '1 hour ago', icon: '\u{1F389}' },
];

// --- Component ---

export default function HomeScreen({
  navigation,
  userName = 'Explorer',
  scanCompletion = 0,
  lastScanDate = null,
  hasAvatar = false,
}: HomeScreenProps) {
  // Animated values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // CTA pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Neon glow cycle
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    // Progress bar fill
    Animated.timing(progressWidth, {
      toValue: scanCompletion,
      duration: 1000,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>Hey, {userName}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <LinearGradient
                colors={[colors.neon.blue, colors.neon.purple]}
                style={styles.profileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.profileInitial}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Avatar Status Card */}
          <View style={styles.statusCard}>
            <LinearGradient
              colors={['rgba(26,27,30,0.85)', 'rgba(20,21,23,0.95)']}
              style={styles.statusCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>Avatar Status</Text>
                <Animated.View style={{ opacity: glowOpacity }}>
                  <View
                    style={[
                      styles.statusBadge,
                      hasAvatar ? styles.statusBadgeActive : styles.statusBadgePending,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {hasAvatar ? 'Active' : 'Pending'}
                    </Text>
                  </View>
                </Animated.View>
              </View>

              {/* Progress */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: progressWidth.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[colors.neon.blue, colors.neon.purple]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                </View>
                <Text style={styles.progressText}>{scanCompletion}% Complete</Text>
              </View>

              {/* Status info */}
              <Text style={styles.statusInfo}>
                {lastScanDate
                  ? `Last scanned ${formatDate(lastScanDate)}`
                  : 'No scan yet \u2014 Get Started'}
              </Text>

              {/* Mini avatar silhouette placeholder */}
              <View style={styles.avatarPreview}>
                <View style={styles.avatarSilhouette}>
                  <Text style={styles.avatarIcon}>{hasAvatar ? '\u{1F9CD}' : '\u{1F464}'}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Start New Scan CTA */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ScanGuide', { type: 'body' })}
            >
              <LinearGradient
                colors={[colors.neon.blue, colors.neon.purple, colors.neon.pink]}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.ctaIcon}>{'\u{1F4F7}'}</Text>
                <Text style={styles.ctaText}>Start New Scan</Text>
                <Text style={styles.ctaSubtext}>Create your digital twin</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsRow}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.key}
                  style={styles.quickActionCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate(action.route, action.params)}
                >
                  <View style={styles.quickActionInner}>
                    <Text style={styles.quickActionIcon}>{action.icon}</Text>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentActivity.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <Text style={styles.activityIcon}>{item.icon}</Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityLabel}>{item.label}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(0,212,255,0.1)', 'rgba(0,212,255,0.02)']}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>99.2%</Text>
                <Text style={styles.statLabel}>Scan Accuracy</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(178,73,248,0.1)', 'rgba(178,73,248,0.02)']}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>&lt;2min</Text>
                <Text style={styles.statLabel}>Processing</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Open Real Me World */}
          <TouchableOpacity
            style={styles.worldButton}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('https://realme.world')}
          >
            <LinearGradient
              colors={['rgba(5,255,161,0.15)', 'rgba(5,255,161,0.05)']}
              style={styles.worldButtonInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.worldButtonIcon}>{'\u{1F30D}'}</Text>
              <View>
                <Text style={styles.worldButtonText}>Open Real Me World</Text>
                <Text style={styles.worldButtonSub}>Explore the virtual shopping district</Text>
              </View>
              <Text style={styles.worldArrow}>{'\u2192'}</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  greeting: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.regular,
  },
  userName: {
    fontSize: typography.fontSize['3xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  profileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },

  // Status Card
  statusCard: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: spacing[6],
    borderWidth: glassMorphism.borderWidth,
    borderColor: glassMorphism.borderColor,
    ...shadows.glass,
  },
  statusCardGradient: {
    padding: spacing[5],
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  statusTitle: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(5,255,161,0.15)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(255,170,0,0.15)',
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    marginBottom: spacing[3],
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.dark[600],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  statusInfo: {
    fontSize: typography.fontSize.md,
    color: colors.neon.blue,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing[3],
  },
  avatarPreview: {
    alignItems: 'center',
    paddingTop: spacing[2],
  },
  avatarSilhouette: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,212,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.2)',
  },
  avatarIcon: {
    fontSize: 36,
  },

  // CTA Button
  ctaButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing[8],
    ...shadows.neonBlue,
  },
  ctaGradient: {
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[6],
    alignItems: 'center',
  },
  ctaIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  ctaText: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  ctaSubtext: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  // Sections
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing[4],
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - spacing[5] * 2 - spacing[3] * 3) / 4,
    borderRadius: borderRadius.lg,
    backgroundColor: glassMorphism.background,
    borderWidth: glassMorphism.borderWidth,
    borderColor: glassMorphism.borderColor,
    overflow: 'hidden',
  },
  quickActionInner: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: spacing[2],
  },
  quickActionLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },

  // Activity
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    fontSize: 18,
    marginRight: spacing[3],
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  activityTime: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statGradient: {
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },

  // World button
  worldButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(5,255,161,0.2)',
  },
  worldButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
  },
  worldButtonIcon: {
    fontSize: 28,
    marginRight: spacing[4],
  },
  worldButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.semibold,
  },
  worldButtonSub: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  worldArrow: {
    fontSize: 20,
    color: colors.neon.green,
    marginLeft: 'auto',
  },
});
