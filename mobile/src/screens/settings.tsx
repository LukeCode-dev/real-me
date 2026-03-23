/**
 * Real Me Scanner - Settings Screen
 * Account, Preferences, Privacy, About sections in glass cards
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Header from '../components/ui/Header';
import GlassCard from '../components/ui/GlassCard';
import SettingsRow from '../components/ui/SettingsRow';
import Toggle from '../components/ui/Toggle';
import Badge from '../components/ui/Badge';
import { APP_CONFIG } from '../constants';
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '../constants/theme';

// ── Icon helper (text-based; swap for a vector lib if available) ────────────

function SettingsIcon({ emoji }: { emoji: string }) {
  return <Text style={styles.emoji}>{emoji}</Text>;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Preferences state
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [scanQuality, setScanQuality] = useState<'Standard' | 'High' | 'Ultra'>('High');
  const [autoCapture, setAutoCapture] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // Privacy
  const [cameraPermission] = useState<'granted' | 'denied'>('granted');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const cycleQuality = useCallback(() => {
    const order: Array<'Standard' | 'High' | 'Ultra'> = ['Standard', 'High', 'Ultra'];
    const idx = order.indexOf(scanQuality);
    const next = order[(idx + 1) % order.length];
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScanQuality(next);
  }, [scanQuality]);

  const toggleUnits = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUnitSystem((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  }, []);

  const handleDeleteData = useCallback(() => {
    Alert.alert(
      'Delete Scan Data',
      'This will permanently delete all your scan data and measurements. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            // TODO: dispatch delete action
          },
        },
      ],
    );
  }, []);

  const handleDownloadData = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: trigger data export
    Alert.alert('Download Started', 'Your data export will be ready shortly.');
  }, []);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/login');
          },
        },
      ],
    );
  }, [router]);

  const openLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.screen}>
      <Header title="Settings" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ── Account ───────────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Account</Text>
          <GlassCard padding="md" style={styles.card}>
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F464}'} />}
              label="Name"
              description="Luke Chen"
              onPress={() => {}}
              showChevron
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{2709}'} />}
              label="Email"
              description="luke@realme.app"
              onPress={() => {}}
              showChevron
              showSeparator={false}
            />
          </GlassCard>

          {/* ── Preferences ───────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Preferences</Text>
          <GlassCard padding="md" style={styles.card}>
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F4CF}'} />}
              label="Units"
              onPress={toggleUnits}
              rightElement={
                <UnitPill active={unitSystem} />
              }
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{2728}'} />}
              label="Scan Quality"
              description="Affects scan time and file size"
              onPress={cycleQuality}
              rightElement={
                <Badge
                  text={scanQuality}
                  variant={
                    scanQuality === 'Ultra'
                      ? 'purple'
                      : scanQuality === 'High'
                      ? 'info'
                      : 'warning'
                  }
                />
              }
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F4F8}'} />}
              label="Auto-Capture"
              description="Automatically take photo when aligned"
              rightElement={
                <Toggle value={autoCapture} onValueChange={setAutoCapture} />
              }
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F4F3}'} />}
              label="Haptic Feedback"
              rightElement={
                <Toggle value={hapticFeedback} onValueChange={setHapticFeedback} />
              }
              showSeparator={false}
            />
          </GlassCard>

          {/* ── Privacy ───────────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Privacy</Text>
          <GlassCard padding="md" style={styles.card}>
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F5D1}'} />}
              label="Delete My Scan Data"
              onPress={handleDeleteData}
              destructive
              showChevron
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F4E5}'} />}
              label="Download My Data"
              onPress={handleDownloadData}
              showChevron
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F3A5}'} />}
              label="Camera Permissions"
              rightElement={
                <Badge
                  text={cameraPermission === 'granted' ? 'Granted' : 'Denied'}
                  variant={cameraPermission === 'granted' ? 'success' : 'error'}
                />
              }
              showSeparator={false}
            />
          </GlassCard>

          {/* ── About ────────────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>About</Text>
          <GlassCard padding="md" style={styles.card}>
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{2139}'} />}
              label="App Version"
              rightElement={
                <Text style={styles.versionText}>
                  v{APP_CONFIG.version}
                </Text>
              }
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F4DC}'} />}
              label="Terms of Service"
              onPress={() => openLink('https://realme-scanner.com/terms')}
              showChevron
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F512}'} />}
              label="Privacy Policy"
              onPress={() => openLink('https://realme-scanner.com/privacy')}
              showChevron
            />
            <SettingsRow
              icon={<SettingsIcon emoji={'\u{1F4E7}'} />}
              label="Contact Support"
              onPress={() => openLink('mailto:support@realme-scanner.com')}
              showChevron
              showSeparator={false}
            />
          </GlassCard>

          {/* ── Sign Out ──────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.signOutButton}
            activeOpacity={0.7}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Unit toggle pill ────────────────────────────────────────────────────────

function UnitPill({ active }: { active: 'metric' | 'imperial' }) {
  return (
    <View style={styles.unitPill}>
      <View
        style={[
          styles.unitOption,
          active === 'metric' && styles.unitOptionActive,
        ]}
      >
        <Text
          style={[
            styles.unitText,
            active === 'metric' && styles.unitTextActive,
          ]}
        >
          Metric
        </Text>
      </View>
      <View
        style={[
          styles.unitOption,
          active === 'imperial' && styles.unitOptionActive,
        ]}
      >
        <Text
          style={[
            styles.unitText,
            active === 'imperial' && styles.unitTextActive,
          ]}
        >
          Imperial
        </Text>
      </View>
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
    paddingTop: spacing[4],
    paddingBottom: spacing[16],
  },
  emoji: {
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing[2],
    marginTop: spacing[4],
    marginLeft: spacing[1],
  },
  card: {
    marginBottom: spacing[2],
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    fontFamily: 'SpaceMono',
  },

  // Unit toggle pill
  unitPill: {
    flexDirection: 'row',
    backgroundColor: colors.dark[700],
    borderRadius: borderRadius.full,
    padding: 2,
  },
  unitOption: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  unitOptionActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
  },
  unitText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.tertiary,
  },
  unitTextActive: {
    color: colors.neon.blue,
  },

  // Sign out
  signOutButton: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    marginTop: spacing[6],
  },
  signOutText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
    letterSpacing: 0.5,
  },

  bottomSpacer: {
    height: spacing[8],
  },
});
