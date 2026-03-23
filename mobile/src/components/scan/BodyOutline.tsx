import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Defs, G, Path, Filter, FeGaussianBlur } from 'react-native-svg';
import { colors } from '../../constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PADDING = 40;
const SVG_WIDTH = SCREEN_WIDTH - PADDING * 2;
const SVG_HEIGHT = SCREEN_HEIGHT * 0.7;

type Pose = 'front' | 'side' | 'back';

interface BodyOutlineProps {
  pose?: Pose;
  isAligned?: boolean;
  opacity?: number;
}

/**
 * SVG path data for each body pose.
 * Paths are designed for a 200x500 viewBox.
 */
const BODY_PATHS: Record<Pose, string> = {
  front: [
    // Head
    'M 88 30 C 88 12 112 12 112 30 C 112 48 88 48 88 30 Z',
    // Neck
    'M 94 48 L 94 60 L 106 60 L 106 48',
    // Shoulders + torso
    'M 94 60 L 60 72 L 50 78 L 48 90 L 46 130',
    'L 50 175 L 58 185 L 72 190 L 85 192',
    'L 100 194 L 115 192 L 128 190 L 142 185',
    'L 150 175 L 154 130 L 152 90 L 150 78 L 140 72 L 106 60',
    // Left arm
    'M 46 130 L 38 170 L 32 210 L 28 250 L 30 260 L 36 262 L 38 258 L 42 220 L 48 180',
    // Right arm
    'M 154 130 L 162 170 L 168 210 L 172 250 L 170 260 L 164 262 L 162 258 L 158 220 L 152 180',
    // Left leg
    'M 85 192 L 82 240 L 78 300 L 76 360 L 74 420 L 72 450 L 70 470 L 68 480 L 90 480 L 88 470 L 88 420 L 90 360 L 94 300 L 98 240 L 100 194',
    // Right leg
    'M 100 194 L 102 240 L 106 300 L 110 360 L 112 420 L 112 470 L 110 480 L 132 480 L 130 470 L 126 450 L 124 420 L 122 360 L 118 300 L 114 240 L 115 192',
  ].join(' '),

  side: [
    // Head
    'M 95 30 C 95 12 115 10 118 28 C 120 46 96 50 95 30 Z',
    // Neck
    'M 100 48 L 100 60 L 110 60 L 112 48',
    // Torso (side profile)
    'M 100 60 L 85 72 L 80 90 L 78 130 L 82 175 L 88 190 L 95 194',
    'L 110 60 L 125 72 L 128 85 L 126 100 L 122 130 L 118 175 L 112 190 L 105 194',
    // Arm (side)
    'M 125 72 L 130 100 L 134 140 L 138 180 L 142 220 L 144 250 L 142 260 L 136 262 L 134 255 L 132 220 L 128 180 L 124 140',
    // Left leg
    'M 88 190 L 82 240 L 78 300 L 76 360 L 80 420 L 84 450 L 86 470 L 84 480 L 96 480 L 94 470 L 92 420 L 90 360 L 90 300 L 92 240 L 95 194',
    // Right leg
    'M 105 194 L 108 240 L 112 300 L 114 360 L 112 420 L 110 450 L 108 470 L 106 480 L 118 480 L 116 470 L 118 420 L 118 360 L 116 300 L 112 240 L 112 190',
  ].join(' '),

  back: [
    // Head
    'M 88 30 C 88 12 112 12 112 30 C 112 48 88 48 88 30 Z',
    // Neck
    'M 94 48 L 94 60 L 106 60 L 106 48',
    // Shoulders + back torso
    'M 94 60 L 60 72 L 50 78 L 48 90 L 46 130',
    'L 50 175 L 58 185 L 72 190 L 85 192',
    'L 100 194 L 115 192 L 128 190 L 142 185',
    'L 150 175 L 154 130 L 152 90 L 150 78 L 140 72 L 106 60',
    // Spine line
    'M 100 60 L 100 194',
    // Left arm
    'M 46 130 L 38 170 L 32 210 L 28 250 L 30 260 L 36 262 L 38 258 L 42 220 L 48 180',
    // Right arm
    'M 154 130 L 162 170 L 168 210 L 172 250 L 170 260 L 164 262 L 162 258 L 158 220 L 152 180',
    // Left leg
    'M 85 192 L 82 240 L 78 300 L 76 360 L 74 420 L 72 450 L 70 470 L 68 480 L 90 480 L 88 470 L 88 420 L 90 360 L 94 300 L 98 240 L 100 194',
    // Right leg
    'M 100 194 L 102 240 L 106 300 L 110 360 L 112 420 L 112 470 L 110 480 L 132 480 L 130 470 L 126 450 L 124 420 L 122 360 L 118 300 L 114 240 L 115 192',
  ].join(' '),
};

export default function BodyOutline({
  pose = 'front',
  isAligned = false,
  opacity: opacityProp,
}: BodyOutlineProps) {
  const dashOffset = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(opacityProp ?? 1)).current;
  const colorAnim = useRef(new Animated.Value(isAligned ? 1 : 0)).current;

  // Marching ants animation
  useEffect(() => {
    const march = Animated.loop(
      Animated.timing(dashOffset, {
        toValue: 20,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    march.start();
    return () => march.stop();
  }, [dashOffset]);

  // Animate opacity
  useEffect(() => {
    if (opacityProp !== undefined) {
      Animated.timing(opacityAnim, {
        toValue: opacityProp,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [opacityProp, opacityAnim]);

  // Animate alignment color
  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isAligned ? 1 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [isAligned, colorAnim]);

  const strokeColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neon.blue, colors.neon.green],
  });

  const glowColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neon.blue, colors.neon.green],
  });

  return (
    <Animated.View
      style={[styles.container, { opacity: opacityAnim }]}
      pointerEvents="none"
    >
      <Svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        viewBox="0 0 200 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <Filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </Filter>
        </Defs>

        {/* Glow layer */}
        <G filter="url(#glow)">
          <AnimatedPath
            d={BODY_PATHS[pose]}
            fill="none"
            stroke={glowColor}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.4}
          />
        </G>

        {/* Main outline with dashed border */}
        <AnimatedPath
          d={BODY_PATHS[pose]}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10,6"
          strokeDashoffset={dashOffset}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
