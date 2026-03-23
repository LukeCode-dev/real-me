/**
 * Real Me Scanner - Haptic Feedback Hook
 * Thin wrapper around expo-haptics for consistent tactile feedback.
 */

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseHapticsReturn {
  /** Subtle tap — selection change, minor interaction. */
  lightTap: () => void;
  /** Standard tap — button press, toggle. */
  mediumTap: () => void;
  /** Strong tap — important action confirmed. */
  heavyTap: () => void;
  /** Success pattern — scan complete, save confirmed. */
  success: () => void;
  /** Error pattern — validation failure, scan rejected. */
  error: () => void;
  /** Warning pattern — quality issue, attention needed. */
  warning: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHaptics(): UseHapticsReturn {
  const lightTap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const mediumTap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const heavyTap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const success = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const error = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const warning = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  return { lightTap, mediumTap, heavyTap, success, error, warning };
}

export default useHaptics;
