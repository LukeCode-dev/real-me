import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  Filter,
  FeGaussianBlur,
  G,
  Line,
} from 'react-native-svg';
import { colors } from '../../constants/theme';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OVAL_RX = SCREEN_WIDTH * 0.28;
const OVAL_RY = SCREEN_WIDTH * 0.38;
const CX = SCREEN_WIDTH / 2;
const CY = SCREEN_WIDTH * 0.55;
const CORNER_LEN = 20;

type Distance = 'close' | 'perfect' | 'far';

interface FaceOvalProps {
  isDetected?: boolean;
  distance?: Distance;
  opacity?: number;
}

const DISTANCE_COLORS: Record<Distance, string> = {
  close: colors.error,
  perfect: colors.neon.green,
  far: colors.error,
};

function getStrokeColor(isDetected: boolean, distance: Distance): string {
  if (!isDetected) return colors.neon.blue;
  return DISTANCE_COLORS[distance];
}

export default function FaceOval({
  isDetected = false,
  distance = 'far',
  opacity: opacityProp,
}: FaceOvalProps) {
  const dashOffset = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(
    new Animated.Value(opacityProp ?? 1),
  ).current;

  // Marching ants
  useEffect(() => {
    const march = Animated.loop(
      Animated.timing(dashOffset, {
        toValue: 24,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    march.start();
    return () => march.stop();
  }, [dashOffset]);

  // Opacity animation
  useEffect(() => {
    if (opacityProp !== undefined) {
      Animated.timing(opacityAnim, {
        toValue: opacityProp,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [opacityProp, opacityAnim]);

  const strokeColor = getStrokeColor(isDetected, distance);

  // Corner marker positions (top, right, bottom, left of the oval)
  const cornerMarkers = [
    // Top
    { x1: CX - CORNER_LEN / 2, y1: CY - OVAL_RY, x2: CX + CORNER_LEN / 2, y2: CY - OVAL_RY },
    // Right
    { x1: CX + OVAL_RX, y1: CY - CORNER_LEN / 2, x2: CX + OVAL_RX, y2: CY + CORNER_LEN / 2 },
    // Bottom
    { x1: CX - CORNER_LEN / 2, y1: CY + OVAL_RY, x2: CX + CORNER_LEN / 2, y2: CY + OVAL_RY },
    // Left
    { x1: CX - OVAL_RX, y1: CY - CORNER_LEN / 2, x2: CX - OVAL_RX, y2: CY + CORNER_LEN / 2 },
  ];

  // Corner ticks perpendicular to oval edge
  const cornerTicks = [
    // Top - vertical tick
    { x1: CX, y1: CY - OVAL_RY - 8, x2: CX, y2: CY - OVAL_RY + 8 },
    // Right - horizontal tick
    { x1: CX + OVAL_RX - 8, y1: CY, x2: CX + OVAL_RX + 8, y2: CY },
    // Bottom - vertical tick
    { x1: CX, y1: CY + OVAL_RY - 8, x2: CX, y2: CY + OVAL_RY + 8 },
    // Left - horizontal tick
    { x1: CX - OVAL_RX - 8, y1: CY, x2: CX - OVAL_RX + 8, y2: CY },
  ];

  return (
    <Animated.View
      style={[styles.container, { opacity: opacityAnim }]}
      pointerEvents="none"
    >
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_WIDTH * 1.1}
        style={styles.svg}
      >
        <Defs>
          <Filter id="faceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </Filter>
        </Defs>

        {/* Glow layer */}
        <G filter="url(#faceGlow)">
          <Ellipse
            cx={CX}
            cy={CY}
            rx={OVAL_RX}
            ry={OVAL_RY}
            fill="none"
            stroke={strokeColor}
            strokeWidth={4}
            opacity={0.35}
          />
        </G>

        {/* Main dashed oval */}
        <AnimatedEllipse
          cx={CX}
          cy={CY}
          rx={OVAL_RX}
          ry={OVAL_RY}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeDasharray="12,8"
          strokeDashoffset={dashOffset}
        />

        {/* Corner markers - short lines at 4 cardinal points */}
        {cornerMarkers.map((marker, i) => (
          <Line
            key={`marker-${i}`}
            x1={marker.x1}
            y1={marker.y1}
            x2={marker.x2}
            y2={marker.y2}
            stroke={strokeColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}

        {/* Corner ticks - perpendicular accent marks */}
        {cornerTicks.map((tick, i) => (
          <Line
            key={`tick-${i}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={strokeColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    paddingTop: 60,
  },
  svg: {
    // svg fills naturally
  },
});
