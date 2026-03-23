/**
 * Real Me Scanner - Custom Camera Hook
 * Wraps expo-camera with permission handling, picture capture,
 * flash toggle, and front/back switching.
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { Camera, CameraType, FlashMode, CameraView } from 'expo-camera';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseCameraReturn {
  /** Whether camera permission has been granted. */
  hasPermission: boolean | null;
  /** Request camera permission from the user. */
  requestPermission: () => Promise<boolean>;
  /** Ref to attach to the <CameraView> component. */
  cameraRef: React.RefObject<CameraView>;
  /** Capture a photo and return its local URI. */
  takePicture: () => Promise<string | null>;
  /** Toggle flash mode between off/on/auto. */
  toggleFlash: () => void;
  /** Current flash mode. */
  flashMode: FlashMode;
  /** Switch between front and back camera. */
  switchCamera: () => void;
  /** Current camera facing direction. */
  facing: CameraType;
  /** Whether the camera is mounted and ready. */
  isReady: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCamera(): UseCameraReturn {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [isReady, setIsReady] = useState(false);

  // Check existing permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // -----------------------------------------------------------------------
  // requestPermission
  // -----------------------------------------------------------------------
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    return granted;
  }, []);

  // -----------------------------------------------------------------------
  // takePicture
  // -----------------------------------------------------------------------
  const takePicture = useCallback(async (): Promise<string | null> => {
    if (!cameraRef.current || !isReady) return null;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      return photo?.uri ?? null;
    } catch (error) {
      console.error('[useCamera] Failed to take picture:', error);
      return null;
    }
  }, [isReady]);

  // -----------------------------------------------------------------------
  // toggleFlash
  // -----------------------------------------------------------------------
  const toggleFlash = useCallback(() => {
    setFlashMode((prev) => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  }, []);

  // -----------------------------------------------------------------------
  // switchCamera
  // -----------------------------------------------------------------------
  const switchCamera = useCallback(() => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, []);

  // Expose a way for the camera to signal readiness via onCameraReady.
  // The consumer should pass `onCameraReady={() => {}}` from this hook —
  // but since CameraView fires onCameraReady, we track it here.
  useEffect(() => {
    // Reset ready state when camera facing changes
    setIsReady(false);

    // CameraView fires onCameraReady after mounting. We rely on a small
    // timeout fallback in case the event doesn't fire (e.g. simulator).
    const timeout = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timeout);
  }, [facing]);

  return {
    hasPermission,
    requestPermission,
    cameraRef,
    takePicture,
    toggleFlash,
    flashMode,
    switchCamera,
    facing,
    isReady,
  };
}

export default useCamera;
