import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface ScanInstructionProps {
  text: string;
  icon?: string; // emoji or unicode icon
  isVisible?: boolean;
}

export default function ScanInstruction({
  text,
  icon,
  isVisible = true,
}: ScanInstructionProps) {
  const slideAnim = useRef(new Animated.Value(-40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const crossfadeAnim = useRef(new Animated.Value(1)).current;
  const [displayText, setDisplayText] = useState(text);
  const [displayIcon, setDisplayIcon] = useState(icon);

  // Entrance / exit animation
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -40,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, fadeAnim]);

  // Crossfade on text change
  useEffect(() => {
    if (text === displayText && icon === displayIcon) return;

    Animated.timing(crossfadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setDisplayText(text);
      setDisplayIcon(icon);
      Animated.timing(crossfadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [text, icon, displayText, displayIcon, crossfadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.pill}>
        <Animated.View
          style={[styles.content, { opacity: crossfadeAnim }]}
        >
          {displayIcon ? (
            <Text style={styles.icon}>{displayIcon}</Text>
          ) : null}
          <Text style={styles.text}>{displayText}</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  pill: {
    backgroundColor: 'rgba(16, 17, 19, 0.85)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderColor: colors.dark[600],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  icon: {
    fontSize: typography.fontSize.lg,
  },
  text: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});
