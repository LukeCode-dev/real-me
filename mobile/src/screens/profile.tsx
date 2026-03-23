/**
 * Real Me Scanner - User Profile Screen
 * Avatar header, Digital Twin card, Scan History, My Sizes, World connection
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Header from '../components/ui/Header';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import ProgressRing from '../components/ui/ProgressRing';
import Button from '../components/ui/Button';
import {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Mock data (replace with store/API) ──────────────────────────────────────

const USER = {
  name: 'Luke Chen',
  email: 'luke@realme.app',
  initials: 'LC',
};

const DIGITAL_TWIN = {
  scanComplete: true,
  lastScanDate: '2026-03-18',
  bodyType: 'Athletic',
  measurements: {
    height: '178 cm',
    chest: '96 cm',
    waist: '82 cm',
    hips: '94 cm',
  },
};

const SCAN_HISTORY = [
  { id: '1', date: '2026-03-18', accuracy: 97 },
  { id: '2', date: '2026-02-25', accuracy: 94 },
  { id: '3', date: '2026-01-10', accuracy: 91 },
];

const MY_SIZES: Record<string, string> = {
  Tops: 'M',
  Bottoms: 'M',
  Shoes: '42 EU',
  Outerwear: 'L',
};

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [worldConnected] = useState(true);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleUpdateScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/scan-guide');
  };

  const handleOpenWorld = () => {
    Linking.openURL('https://realme-world.app');
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Profile"
        onBack={() => router.back()}
        rightAction={() => router.push('/settings')}
        rightIcon={<Text style={styles.gearIcon}>{'\u2699'}</Text>}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ── User header ────────────────────────────────────────────── */}
          <View style={styles.userHeader}>
            <LinearGradient
              colors={[gradients.neonHorizontal[0], gradients.neonHorizontal[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarCircle}
            >
              <Text style={styles.avatarInitials}>{USER.initials}</Text>
            </LinearGradient>
            <Text style={styles.userName}>{USER.name}</Text>
            <Text style={styles.userEmail}>{USER.email}</Text>
          </View>

          {/* ── My Digital Twin ────────────────────────────────────────── */}
          <GlassCard borderGlow="blue" padding="lg" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Digital Twin</Text>
              <Badge
                text={DIGITAL_TWIN.scanComplete ? 'Complete' : 'Incomplete'}
                variant={DIGITAL_TWIN.scanComplete ? 'success' : 'warning'}
                pulse={!DIGITAL_TWIN.scanComplete}
              />
            </View>

            <View style={styles.twinMeta}>
              <MetaRow label="Last Scan" value={formatDate(DIGITAL_TWIN.lastScanDate)} />
              <MetaRow label="Body Type" value={DIGITAL_TWIN.bodyType} />
            </View>

            <View style={styles.separator} />

            {/* Mini measurement summary */}
            <View style={styles.measurementGrid}>
              {Object.entries(DIGITAL_TWIN.measurements).map(([key, val]) => (
                <View key={key} style={styles.measurementItem}>
                  <Text style={styles.measurementLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <Text style={styles.measurementValue}>{val}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Update Scan"
              onPress={handleUpdateScan}
              variant="secondary"
              size="md"
              fullWidth
              style={styles.updateButton}
            />
          </GlassCard>

          {/* ── Scan History ───────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Scan History</Text>
          <GlassCard padding="md" style={styles.card}>
            {SCAN_HISTORY.map((scan, idx) => (
              <View
                key={scan.id}
                style={[
                  styles.historyRow,
                  idx < SCAN_HISTORY.length - 1 && styles.historyRowBorder,
                ]}
              >
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDate}>
                    {formatDate(scan.date)}
                  </Text>
                  <Text style={styles.historyLabel}>Body Scan</Text>
                </View>
                <ProgressRing progress={scan.accuracy} size="sm" />
              </View>
            ))}
          </GlassCard>

          {/* ── My Sizes ──────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>My Sizes</Text>
          <GlassCard borderGlow="purple" padding="lg" style={styles.card}>
            <View style={styles.sizesGrid}>
              {Object.entries(MY_SIZES).map(([category, size]) => (
                <View key={category} style={styles.sizeChip}>
                  <Text style={styles.sizeCategory}>{category}</Text>
                  <View style={styles.sizeBadge}>
                    <Text style={styles.sizeValue}>{size}</Text>
                  </View>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* ── Connected to Real Me World ─────────────────────────────── */}
          <GlassCard padding="md" style={styles.card}>
            <TouchableOpacity
              style={styles.worldRow}
              activeOpacity={0.7}
              onPress={handleOpenWorld}
            >
              <View style={styles.worldDot}>
                <View
                  style={[
                    styles.worldDotInner,
                    { backgroundColor: worldConnected ? colors.neon.green : colors.dark[400] },
                  ]}
                />
              </View>
              <View style={styles.worldTextContainer}>
                <Text style={styles.worldTitle}>
                  {worldConnected ? 'Connected to Real Me World' : 'Not Connected'}
                </Text>
                <Text style={styles.worldSub}>
                  Open web app to explore the virtual world
                </Text>
              </View>
              <Text style={styles.worldChevron}>{'\u203A'}</Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Helper sub-component ────────────────────────────────────────────────────

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[16],
  },
  gearIcon: {
    fontSize: 18,
    color: colors.text.secondary,
  },

  // User header
  userHeader: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
    ...shadows.neonBlue,
  },
  avatarInitials: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: spacing[1],
  },
  userEmail: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },

  // Cards
  card: {
    marginBottom: spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  cardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    fontFamily: 'SpaceGrotesk-SemiBold',
  },

  // Twin meta
  twinMeta: {
    marginBottom: spacing[3],
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[1] + 2,
  },
  metaLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  metaValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.dark[500],
    marginVertical: spacing[3],
  },

  // Measurement grid
  measurementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing[4],
  },
  measurementItem: {
    width: '50%',
    paddingVertical: spacing[2],
  },
  measurementLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  measurementValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neon.blue,
    fontFamily: 'SpaceGrotesk-Bold',
  },

  updateButton: {
    marginTop: spacing[1],
  },

  // Section title
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    fontFamily: 'SpaceGrotesk-SemiBold',
    marginBottom: spacing[3],
    marginTop: spacing[4],
  },

  // Scan history
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
  },
  historyRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.dark[600],
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  historyLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },

  // Sizes
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  sizeChip: {
    width: (SCREEN_WIDTH - spacing[4] * 2 - spacing[6] * 2 - spacing[3]) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    alignItems: 'center',
  },
  sizeCategory: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing[1],
  },
  sizeBadge: {
    backgroundColor: 'rgba(178, 73, 248, 0.15)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  sizeValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neon.purple,
    fontFamily: 'SpaceGrotesk-Bold',
  },

  // World connection
  worldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  worldDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(5, 255, 161, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  worldDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  worldTextContainer: {
    flex: 1,
  },
  worldTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  worldSub: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  worldChevron: {
    fontSize: 22,
    color: colors.dark[300],
    marginLeft: spacing[2],
  },

  bottomSpacer: {
    height: spacing[8],
  },
});
