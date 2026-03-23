import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import {
  colors,
  gradients,
  spacing,
  typography,
  borderRadius,
} from '../constants/theme';

// Simple icon components
const UserIcon = () => (
  <Text style={{ color: colors.dark[300], fontSize: 18 }}>{'\u{1F464}'}</Text>
);
const EmailIcon = () => (
  <Text style={{ color: colors.dark[300], fontSize: 18 }}>{'\u2709'}</Text>
);
const LockIcon = () => (
  <Text style={{ color: colors.dark[300], fontSize: 18 }}>{'\u{1F512}'}</Text>
);
const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text style={{ color: colors.dark[200], fontSize: 16 }}>
    {visible ? '\u{1F441}' : '\u{1F441}\u200D\u{1F5E8}'}
  </Text>
);

type PasswordStrength = 'weak' | 'medium' | 'strong';

function getPasswordStrength(pw: string): { level: PasswordStrength; width: number; color: string } {
  if (!pw) return { level: 'weak', width: 0, color: colors.error };

  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { level: 'weak', width: 33, color: colors.error };
  if (score <= 3) return { level: 'medium', width: 66, color: colors.warning };
  return { level: 'strong', width: 100, color: colors.neon.green };
}

interface SignupProps {
  onSignup: () => void;
  onNavigateLogin: () => void;
}

export default function Signup({ onSignup, onNavigateLogin }: SignupProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { authAPI, setAuthToken } = await import('../services/api');
      const result = await authAPI.register({ name: fullName, email, password });
      if (result.token) await setAuthToken(result.token);
      onSignup();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={[...gradients.neon]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoBadge}
              >
                <Text style={styles.logoText}>RM</Text>
              </LinearGradient>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the future of shopping</Text>
            </View>

            {/* Form Card */}
            <GlassCard padding="lg" style={styles.card}>
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                leftIcon={<UserIcon />}
                error={errors.fullName}
              />

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<EmailIcon />}
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                leftIcon={<LockIcon />}
                rightAction={<EyeIcon visible={showPassword} />}
                onRightActionPress={() => setShowPassword(!showPassword)}
                error={errors.password}
              />

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarBg}>
                    <Animated.View
                      style={[
                        styles.strengthBarFill,
                        {
                          width: `${strength.width}%` as any,
                          backgroundColor: strength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}
                  </Text>
                </View>
              )}

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                leftIcon={<LockIcon />}
                rightAction={<EyeIcon visible={showConfirm} />}
                onRightActionPress={() => setShowConfirm(!showConfirm)}
                error={errors.confirmPassword}
              />

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreedToTerms && styles.checkboxChecked,
                    errors.terms ? styles.checkboxError : null,
                  ]}
                >
                  {agreedToTerms && (
                    <Text style={styles.checkmark}>{'\u2713'}</Text>
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms && (
                <Text style={styles.termsError}>{errors.terms}</Text>
              )}

              <View style={styles.buttonSpacer} />

              <Button
                title="Create Account"
                onPress={handleCreateAccount}
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
              />
            </GlassCard>

            {/* Bottom link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateLogin}>
                <Text style={styles.bottomLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
  },
  content: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  logoText: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  title: {
    color: colors.white,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.5,
    marginBottom: spacing[2],
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.lg,
  },
  card: {
    marginBottom: spacing[6],
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -spacing[2],
    marginBottom: spacing[3],
    paddingHorizontal: spacing[1],
  },
  strengthBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: colors.dark[600],
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: spacing[3],
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'capitalize',
    minWidth: 50,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.dark[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  checkboxChecked: {
    backgroundColor: colors.neon.blue,
    borderColor: colors.neon.blue,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
    marginTop: -1,
  },
  termsText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    flex: 1,
  },
  termsLink: {
    color: colors.neon.blue,
    fontWeight: typography.fontWeight.medium,
  },
  termsError: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing[1],
    marginLeft: spacing[8],
  },
  buttonSpacer: {
    height: spacing[4],
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.md,
  },
  bottomLink: {
    color: colors.neon.blue,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
