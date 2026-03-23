import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../constants/theme';

interface ScanProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

function StepDot({
  index,
  currentStep,
  label,
}: {
  index: number;
  currentStep: number;
  label: string;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isCurrent = index === currentStep;
  const isCompleted = index < currentStep;

  useEffect(() => {
    if (isCurrent) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCurrent, pulseAnim]);

  return (
    <View style={styles.stepContainer}>
      <Animated.View
        style={[
          styles.stepDot,
          isCompleted && styles.stepDotCompleted,
          isCurrent && styles.stepDotCurrent,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {isCompleted ? (
          <Text style={styles.checkmark}>&#10003;</Text>
        ) : (
          <Text
            style={[
              styles.stepNumber,
              isCurrent && styles.stepNumberCurrent,
            ]}
          >
            {index + 1}
          </Text>
        )}
      </Animated.View>
      <Text
        style={[
          styles.stepLabel,
          isCurrent && styles.stepLabelCurrent,
          isCompleted && styles.stepLabelCompleted,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function ScanProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
}: ScanProgressBarProps) {
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: currentStep / (totalSteps - 1),
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps, fillAnim]);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Progress bar track */}
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: fillWidth }]}>
            <LinearGradient
              colors={[colors.neon.blue, colors.neon.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </View>

      {/* Step dots */}
      <View style={styles.stepsRow}>
        {stepLabels.slice(0, totalSteps).map((label, i) => (
          <StepDot
            key={i}
            index={i}
            currentStep={currentStep}
            label={label}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  trackContainer: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[3],
  },
  track: {
    height: 3,
    backgroundColor: colors.dark[600],
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.dark[600],
    borderWidth: 2,
    borderColor: colors.dark[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  stepDotCurrent: {
    borderColor: colors.neon.blue,
    backgroundColor: colors.dark[700],
    shadowColor: colors.neon.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  stepDotCompleted: {
    borderColor: colors.neon.green,
    backgroundColor: colors.neon.green,
  },
  stepNumber: {
    color: colors.dark[200],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  stepNumberCurrent: {
    color: colors.neon.blue,
  },
  checkmark: {
    color: colors.dark[900],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  stepLabel: {
    color: colors.dark[300],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  stepLabelCurrent: {
    color: colors.neon.blue,
  },
  stepLabelCompleted: {
    color: colors.neon.green,
  },
});
