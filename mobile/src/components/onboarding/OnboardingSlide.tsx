/**
 * Real Me Scanner - Individual Onboarding Page
 * Large illustration area, gradient title, description, animated entrance
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlidePros {
  title: string;
  description: string;
  iconName: string;
  color?: string;
  isActive?: boolean;
}

const ICON_MAP: Record<string, string> = {
  scan: '\u{1F4F7}',       // camera
  measure: '\u{1F4CF}',    // ruler
  avatar: '\u{1F9D1}',     // person
  shop: '\u{1F6CD}',       // shopping bag
  world: '\u{1F30D}',      // globe
  fit: '\u{2728}',         // sparkles
  default: '\u{1F680}',    // rocket
};

export default function OnboardingSlide({
  title,
  description,
  iconName,
  color = colors.neon.blue,
  isActive = true,
}: OnboardingSlidePros) {
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 4,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 6,
        }),
      ]).start();
    } else {
      slideAnim.setValue(60);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
    }
  }, [isActive]);

  const iconEmoji = ICON_MAP[iconName] || ICON_MAP.default;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {/* Illustration area */}
      <View style={styles.illustrationArea}>
        <View
          style={[
            styles.iconCircleOuter,
            {
              borderColor: `${color}20`,
              shadowColor: color,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircleInner,
              { backgroundColor: `${color}12` },
            ]}
          >
            <Text style={styles.iconEmoji}>{iconEmoji}</Text>
          </View>
        </View>

        {/* Decorative rings */}
        <View
          style={[
            styles.ring,
            styles.ringLarge,
            { borderColor: `${color}08` },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.ringMedium,
            { borderColor: `${color}12` },
          ]}
        />
      </View>

      {/* Title with gradient text effect */}
      <View style={styles.textArea}>
        <GradientText text={title} style={styles.title} />
        <Text style={styles.description}>{description}</Text>
      </View>
    </Animated.View>
  );
}

/** Gradient text helper using MaskedView */
function GradientText({
  text,
  style,
}: {
  text: string;
  style: any;
}) {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { color: '#fff' }]}>{text}</Text>
      }
    >
      <LinearGradient
        colors={[gradients.neon[0], gradients.neon[1], gradients.neon[2]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
  },
  illustrationArea: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[10],
  },
  iconCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  iconCircleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 56,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 9999,
  },
  ringLarge: {
    width: 220,
    height: 220,
  },
  ringMedium: {
    width: 190,
    height: 190,
  },
  textArea: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: 'SpaceGrotesk-Bold',
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  description: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
  },
});
