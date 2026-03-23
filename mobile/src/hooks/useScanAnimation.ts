/**
 * Real Me Scanner - Scan Animation Hook
 * Provides animated values for scan-line movement, capture button pulse,
 * progress ring, and a capture-flash effect.
 * Uses react-native-reanimated for 60 fps animations.
 */

import { useCallback, useRef } from 'react';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  cancelAnimation,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseScanAnimationReturn {
  /** Animated value [0 → 1] for a vertical scan line. */
  scanLinePosition: SharedValue<number>;
  /** Animated value [0.85 → 1.15] for capture-button glow pulsing. */
  pulseAnimation: SharedValue<number>;
  /** Animated value [0 → 1] for a progress ring (driven externally). */
  progressAnimation: SharedValue<number>;
  /** Animated opacity value [0 → 1] for capture flash overlay. */
  flashOpacity: SharedValue<number>;

  /** Start the looping scan-line + pulse animations. */
  startScanAnimation: () => void;
  /** Stop all looping animations. */
  stopScanAnimation: () => void;
  /** Trigger a brief white-flash effect (resolves when done). */
  captureFlash: () => void;
  /** Drive the progress ring to a specific 0-1 value. */
  setProgress: (value: number) => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useScanAnimation(): UseScanAnimationReturn {
  const scanLinePosition = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const progressAnimation = useSharedValue(0);
  const flashOpacity = useSharedValue(0);

  const isRunning = useRef(false);

  // -----------------------------------------------------------------------
  // startScanAnimation
  // -----------------------------------------------------------------------
  const startScanAnimation = useCallback(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    // Scan line sweeps top → bottom repeatedly
    scanLinePosition.value = 0;
    scanLinePosition.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // infinite
      true, // reverse
    );

    // Pulse: scale 0.85 → 1.15 → 0.85 repeating
    pulseAnimation.value = 0.85;
    pulseAnimation.value = withRepeat(
      withTiming(1.15, {
        duration: 1200,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [scanLinePosition, pulseAnimation]);

  // -----------------------------------------------------------------------
  // stopScanAnimation
  // -----------------------------------------------------------------------
  const stopScanAnimation = useCallback(() => {
    isRunning.current = false;
    cancelAnimation(scanLinePosition);
    cancelAnimation(pulseAnimation);
    scanLinePosition.value = 0;
    pulseAnimation.value = 1;
  }, [scanLinePosition, pulseAnimation]);

  // -----------------------------------------------------------------------
  // captureFlash
  // -----------------------------------------------------------------------
  const captureFlash = useCallback(() => {
    flashOpacity.value = 0;
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 60, easing: Easing.out(Easing.ease) }),
      withDelay(
        80,
        withTiming(0, { duration: 250, easing: Easing.in(Easing.ease) }),
      ),
    );
  }, [flashOpacity]);

  // -----------------------------------------------------------------------
  // setProgress
  // -----------------------------------------------------------------------
  const setProgress = useCallback(
    (value: number) => {
      progressAnimation.value = withTiming(Math.min(1, Math.max(0, value)), {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    },
    [progressAnimation],
  );

  return {
    scanLinePosition,
    pulseAnimation,
    progressAnimation,
    flashOpacity,
    startScanAnimation,
    stopScanAnimation,
    captureFlash,
    setProgress,
  };
}

export default useScanAnimation;
