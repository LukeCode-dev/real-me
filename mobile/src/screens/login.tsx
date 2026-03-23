import React, { useState, useRef } from 'react';
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

// Inline SVG-like icon components using Text for simplicity
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

interface LoginProps {
  onLogin: () => void;
  onNavigateSignup: () => void;
  onForgotPassword: () => void;
}

export default function Login({
  onLogin,
  onNavigateSignup,
  onForgotPassword,
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { authAPI, setAuthToken } = await import('../services/api');
      const result = await authAPI.login({ email, password });
      if (result.token) await setAuthToken(result.token);
      onLogin();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Sign in failed. Please try again.';
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

              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your digital self</Text>
            </View>

            {/* Form Card */}
            <GlassCard padding="lg" style={styles.card}>
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
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                leftIcon={<LockIcon />}
                rightAction={<EyeIcon visible={showPassword} />}
                onRightActionPress={() => setShowPassword(!showPassword)}
                error={errors.password}
              />

              <TouchableOpacity
                onPress={onForgotPassword}
                style={styles.forgotRow}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleSignIn}
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
              />
            </GlassCard>

            {/* Bottom link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onNavigateSignup}>
                <Text style={styles.bottomLink}>Sign Up</Text>
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
    paddingVertical: spacing[8],
  },
  content: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[8],
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
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: spacing[6],
    marginTop: -spacing[2],
  },
  forgotText: {
    color: colors.neon.blue,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
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
