import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/ui/Button';
import {
  colors,
  gradients,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  icon: string;
  iconBg: readonly string[];
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    id: '1',
    icon: '\u{1F4F7}',
    iconBg: gradients.ocean,
    title: 'Scan Your Body',
    description:
      'Use your phone camera for a precise 3D body capture. Our AI maps your exact proportions in seconds \u2014 no tape measure needed.',
  },
  {
    id: '2',
    icon: '\u{1F9D1}',
    iconBg: gradients.neonHorizontal,
    title: 'Your Digital Twin',
    description:
      'Get a photorealistic avatar that matches your exact proportions. Every curve, every measurement \u2014 a true digital version of you.',
  },
  {
    id: '3',
    icon: '\u{1F6CD}\uFE0F',
    iconBg: gradients.sunset,
    title: 'Shop With Confidence',
    description:
      'Try on clothes virtually before you buy. See exactly how every piece fits your body. Never pick the wrong size again.',
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderStep = ({ item, index }: { item: OnboardingStep; index: number }) => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [30, 0, 30],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.stepContainer}>
        <Animated.View
          style={[
            styles.stepContent,
            { opacity, transform: [{ scale }, { translateY }] },
          ]}
        >
          {/* Icon placeholder area */}
          <View style={styles.illustrationArea}>
            <LinearGradient
              colors={[...item.iconBg]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Text style={styles.iconEmoji}>{item.icon}</Text>
            </LinearGradient>

            {/* Decorative rings */}
            <View style={[styles.ring, styles.ringOuter]} />
            <View style={[styles.ring, styles.ringMiddle]} />
          </View>

          {/* Title with gradient effect (simulated via neon color) */}
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.titleUnderline}>
            <LinearGradient
              colors={[...gradients.neon]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.underlineGradient}
            />
          </View>

          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsRow}>
      {steps.map((_, i) => {
        const inputRange = [
          (i - 1) * SCREEN_WIDTH,
          i * SCREEN_WIDTH,
          (i + 1) * SCREEN_WIDTH,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 28, 8],
          extrapolate: 'clamp',
        });

        const dotOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { width: dotWidth, opacity: dotOpacity },
              i === currentIndex && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );

  const isLast = currentIndex === steps.length - 1;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        {!isLast && (
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="ghost"
            size="sm"
            textStyle={styles.skipText}
          />
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={renderStep}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {renderDots()}

      <View style={styles.footer}>
        <Button
          title={isLast ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[2],
    minHeight: 44,
  },
  skipText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.md,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
  },
  stepContent: {
    alignItems: 'center',
    width: '100%',
  },
  illustrationArea: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.neonBlue,
  },
  iconEmoji: {
    fontSize: 48,
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
  },
  ringOuter: {
    width: 190,
    height: 190,
    borderColor: 'rgba(0, 212, 255, 0.1)',
  },
  ringMiddle: {
    width: 155,
    height: 155,
    borderColor: 'rgba(178, 73, 248, 0.15)',
  },
  title: {
    color: colors.neon.blue,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: spacing[2],
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[6],
  },
  underlineGradient: {
    flex: 1,
  },
  description: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
    textAlign: 'center',
    maxWidth: 320,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neon.blue,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.neon.blue,
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
  },
});
