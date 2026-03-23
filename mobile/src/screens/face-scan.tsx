/**
 * Real Me Scanner - Face Scan Screen
 * Front camera selfie capture with 3 phases: NEUTRAL, SMILE, PROFILE
 * Face oval overlay, distance/lighting indicators, simulated face detection
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Ellipse, Circle, Line, Rect, Defs, Mask } from 'react-native-svg';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Types ---

interface FaceScanProps {
  navigation: any;
}

type FacePhase = 'NEUTRAL' | 'SMILE' | 'PROFILE';

interface PhaseConfig {
  key: FacePhase;
  label: string;
  instruction: string;
  subInstruction: string;
  icon: string;
}

// --- Constants ---

const PHASES: PhaseConfig[] = [
  {
    key: 'NEUTRAL',
    label: 'Neutral Expression',
    instruction: 'Look straight at the camera',
    subInstruction: 'Keep a relaxed, neutral expression',
    icon: '\u{1F610}',
  },
  {
    key: 'SMILE',
    label: 'Smile',
    instruction: 'Give a natural smile',
    subInstruction: 'Show your teeth if comfortable',
    icon: '\u{1F604}',
  },
  {
    key: 'PROFILE',
    label: 'Profile View',
    instruction: 'Turn your head slightly right',
    subInstruction: 'About 30 degrees, keep eyes forward',
    icon: '\u{1F642}',
  },
];

const AUTO_CAPTURE_DELAY = 2500;

type DistanceStatus = 'close' | 'perfect' | 'far';

// --- Face Oval Overlay ---

function FaceOvalOverlay({ faceDetected }: { faceDetected: boolean }) {
  const borderColor = faceDetected ? colors.neon.green : colors.neon.blue;
  const ovalCx = SCREEN_WIDTH / 2;
  const ovalCy = SCREEN_HEIGHT * 0.38;
  const ovalRx = 95;
  const ovalRy = 130;

  return (
    <Svg
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      style={StyleSheet.absoluteFill}
    >
      {/* Darkened mask outside the oval */}
      <Defs>
        <Mask id="ovalMask">
          <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="white" />
          <Ellipse cx={ovalCx} cy={ovalCy} rx={ovalRx + 2} ry={ovalRy + 2} fill="black" />
        </Mask>
      </Defs>
      <Rect
        x={0}
        y={0}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        fill="rgba(0,0,0,0.5)"
        mask="url(#ovalMask)"
      />

      {/* Face oval outline */}
      <Ellipse
        cx={ovalCx}
        cy={ovalCy}
        rx={ovalRx}
        ry={ovalRy}
        fill="none"
        stroke={borderColor}
        strokeWidth={2.5}
        strokeDasharray={faceDetected ? '0' : '8 5'}
        opacity={0.8}
      />

      {/* Corner brackets for alignment */}
      {/* Top-left */}
      <Line x1={ovalCx - ovalRx - 15} y1={ovalCy - ovalRy - 15} x2={ovalCx - ovalRx + 15} y2={ovalCy - ovalRy - 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />
      <Line x1={ovalCx - ovalRx - 15} y1={ovalCy - ovalRy - 15} x2={ovalCx - ovalRx - 15} y2={ovalCy - ovalRy + 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />
      {/* Top-right */}
      <Line x1={ovalCx + ovalRx + 15} y1={ovalCy - ovalRy - 15} x2={ovalCx + ovalRx - 15} y2={ovalCy - ovalRy - 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />
      <Line x1={ovalCx + ovalRx + 15} y1={ovalCy - ovalRy - 15} x2={ovalCx + ovalRx + 15} y2={ovalCy - ovalRy + 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />
      {/* Bottom-left */}
      <Line x1={ovalCx - ovalRx - 15} y1={ovalCy + ovalRy + 15} x2={ovalCx - ovalRx + 15} y2={ovalCy + ovalRy + 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />
      <Line x1={ovalCx - ovalRx - 15} y1={ovalCy + ovalRy + 15} x2={ovalCx - ovalRx - 15} y2={ovalCy + ovalRy - 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />
      {/* Bottom-right */}
      <Line x1={ovalCx + ovalRx + 15} y1={ovalCy + ovalRy + 15} x2={ovalCx + ovalRx - 15} y2={ovalCy + ovalRy + 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />
      <Line x1={ovalCx + ovalRx + 15} y1={ovalCy + ovalRy + 15} x2={ovalCx + ovalRx + 15} y2={ovalCy + ovalRy - 15} stroke={borderColor} strokeWidth={2} opacity={0.6} />

      {/* Center crosshair (subtle) */}
      <Line x1={ovalCx - 8} y1={ovalCy} x2={ovalCx + 8} y2={ovalCy} stroke={borderColor} strokeWidth={1} opacity={0.3} />
      <Line x1={ovalCx} y1={ovalCy - 8} x2={ovalCx} y2={ovalCy + 8} stroke={borderColor} strokeWidth={1} opacity={0.3} />
    </Svg>
  );
}

// --- Distance Indicator ---

function DistanceIndicator({ status }: { status: DistanceStatus }) {
  const labels: Record<DistanceStatus, { text: string; color: string }> = {
    close: { text: 'Move back', color: colors.warning },
    perfect: { text: 'Perfect distance', color: colors.neon.green },
    far: { text: 'Move closer', color: colors.neon.blue },
  };

  const { text, color } = labels[status];

  return (
    <View style={styles.distanceIndicator}>
      <View style={[styles.distanceDot, { backgroundColor: color }]} />
      <Text style={[styles.distanceText, { color }]}>{text}</Text>
    </View>
  );
}

// --- Lighting Quality Bar ---

function LightingBar({ quality }: { quality: number }) {
  // quality 0-1
  const barColor =
    quality > 0.7 ? colors.neon.green : quality > 0.4 ? colors.warning : colors.error;
  const label =
    quality > 0.7 ? 'Great lighting' : quality > 0.4 ? 'Acceptable' : 'Too dark';

  return (
    <View style={styles.lightingBar}>
      <View style={styles.lightingRow}>
        <Text style={styles.lightingIcon}>{'\u2600\uFE0F'}</Text>
        <View style={styles.lightingTrack}>
          <View
            style={[
              styles.lightingFill,
              { width: `${quality * 100}%`, backgroundColor: barColor },
            ]}
          />
        </View>
        <Text style={[styles.lightingLabel, { color: barColor }]}>{label}</Text>
      </View>
    </View>
  );
}

// --- Main Component ---

export default function FaceScanScreen({ navigation }: FaceScanProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [captures, setCaptures] = useState<(string | null)[]>([null, null, null]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [distanceStatus, setDistanceStatus] = useState<DistanceStatus>('far');
  const [lightingQuality, setLightingQuality] = useState(0.3);
  const [autoProgress, setAutoProgress] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const cameraRef = useRef<any>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animations
  const flashAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const instructionOpacity = useRef(new Animated.Value(1)).current;
  const faceGlowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentPhase = PHASES[currentPhaseIndex];

  // Face glow pulse when detected
  useEffect(() => {
    if (faceDetected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(faceGlowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(faceGlowAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      faceGlowAnim.setValue(0);
    }
  }, [faceDetected]);

  // Button pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Simulate face detection & environment sensors
  useEffect(() => {
    if (isCapturing || captures[currentPhaseIndex]) return;

    // Simulate face appearing
    const faceTimer = setTimeout(() => {
      setFaceDetected(true);
      setDistanceStatus('perfect');
      setLightingQuality(0.85);
    }, 1200);

    return () => {
      clearTimeout(faceTimer);
      setFaceDetected(false);
      setDistanceStatus('far');
      setLightingQuality(0.3);
    };
  }, [currentPhaseIndex, isCapturing]);

  // Auto-capture when face detected and conditions good
  useEffect(() => {
    if (!faceDetected || distanceStatus !== 'perfect' || isCapturing || captures[currentPhaseIndex]) return;

    setAutoProgress(0);
    const interval = 50;
    const totalSteps = AUTO_CAPTURE_DELAY / interval;
    let step = 0;

    autoTimerRef.current = setInterval(() => {
      step++;
      setAutoProgress(step / totalSteps);

      if (step >= totalSteps) {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
        handleCapture();
      }
    }, interval);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [faceDetected, distanceStatus, currentPhaseIndex, isCapturing]);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    // Haptic
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Flash
    setShowFlash(true);
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setShowFlash(false));

    const fakeUri = `capture_face_${currentPhase.key}_${Date.now()}`;
    const newCaptures = [...captures];
    newCaptures[currentPhaseIndex] = fakeUri;
    setCaptures(newCaptures);

    // Checkmark
    Animated.spring(checkAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Advance
    setTimeout(() => {
      checkAnim.setValue(0);
      setAutoProgress(0);
      setFaceDetected(false);
      setIsCapturing(false);

      if (currentPhaseIndex < PHASES.length - 1) {
        Animated.sequence([
          Animated.timing(instructionOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(instructionOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        setCurrentPhaseIndex((prev) => prev + 1);
      } else {
        // All done -> processing
        navigation.navigate('ScanProcessing');
      }
    }, 1000);
  }, [isCapturing, currentPhaseIndex, captures, currentPhase]);

  function handleRetake() {
    const newCaptures = [...captures];
    newCaptures[currentPhaseIndex] = null;
    setCaptures(newCaptures);
    setAutoProgress(0);
    setFaceDetected(false);
    setIsCapturing(false);
  }

  const progressPct = ((currentPhaseIndex + (captures[currentPhaseIndex] ? 1 : 0)) / PHASES.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Front camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="front"
      />

      {/* Face oval overlay */}
      <FaceOvalOverlay faceDetected={faceDetected} />

      {/* Flash */}
      {showFlash && (
        <Animated.View
          style={[styles.flashOverlay, { opacity: flashAnim }]}
          pointerEvents="none"
        />
      )}

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            {currentPhaseIndex + 1}/{PHASES.length}
          </Text>
          <Text style={styles.stepLabel}>{currentPhase.label}</Text>
        </View>

        {captures[currentPhaseIndex] && (
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[colors.neon.pink, colors.neon.purple]}
            style={[styles.progressFill, { width: `${progressPct}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>

      {/* Instructions */}
      <Animated.View style={[styles.instructionContainer, { opacity: instructionOpacity }]}>
        <View style={styles.instructionBg}>
          <Text style={styles.phaseIcon}>{currentPhase.icon}</Text>
          <Text style={styles.instructionText}>{currentPhase.instruction}</Text>
          <Text style={styles.subInstruction}>{currentPhase.subInstruction}</Text>
        </View>
      </Animated.View>

      {/* Face detection indicator */}
      <Animated.View
        style={[
          styles.faceDetectionBadge,
          faceDetected ? styles.faceDetectedBadge : {},
          { opacity: faceDetected ? faceGlowAnim : 1 },
        ]}
      >
        <View
          style={[
            styles.faceDetectionDot,
            { backgroundColor: faceDetected ? colors.neon.green : colors.dark[300] },
          ]}
        />
        <Text
          style={[
            styles.faceDetectionText,
            { color: faceDetected ? colors.neon.green : colors.dark[300] },
          ]}
        >
          {faceDetected ? 'Face detected' : 'Searching for face...'}
        </Text>
      </Animated.View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Distance indicator */}
        <DistanceIndicator status={distanceStatus} />

        {/* Lighting bar */}
        <LightingBar quality={lightingQuality} />

        {/* Phase thumbnails */}
        <View style={styles.thumbnailRow}>
          {PHASES.map((phase, i) => (
            <View
              key={phase.key}
              style={[
                styles.thumbnail,
                i === currentPhaseIndex ? styles.thumbnailActive : {},
                captures[i] ? styles.thumbnailCaptured : {},
              ]}
            >
              <Text style={styles.thumbnailIcon}>{phase.icon}</Text>
              {captures[i] && (
                <View style={styles.thumbnailCheck}>
                  <Text style={styles.thumbnailCheckText}>{'\u2713'}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Capture button */}
        <View style={styles.captureButtonContainer}>
          {/* Progress ring */}
          <Svg width={88} height={88} style={styles.captureRingSvg}>
            <Circle
              cx={44}
              cy={44}
              r={39}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={3}
            />
            <Circle
              cx={44}
              cy={44}
              r={39}
              fill="none"
              stroke={colors.neon.pink}
              strokeWidth={3}
              strokeDasharray={`${2 * Math.PI * 39}`}
              strokeDashoffset={`${2 * Math.PI * 39 * (1 - autoProgress)}`}
              strokeLinecap="round"
              transform="rotate(-90, 44, 44)"
            />
          </Svg>

          {/* Pulse ring */}
          <Animated.View
            style={[
              styles.captureOuterPulse,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />

          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing && styles.captureButtonCapturing,
            ]}
            activeOpacity={0.7}
            onPress={handleCapture}
            disabled={isCapturing || !!captures[currentPhaseIndex]}
          >
            {captures[currentPhaseIndex] ? (
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: checkAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 1.3, 1],
                      }),
                    },
                  ],
                }}
              >
                <Text style={styles.captureCheckmark}>{'\u2713'}</Text>
              </Animated.View>
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    zIndex: 10,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  stepText: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  stepLabel: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  retakeButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,68,68,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.5)',
  },
  retakeText: {
    fontSize: typography.fontSize.sm,
    color: '#ff6b6b',
    fontWeight: typography.fontWeight.semibold,
  },

  // Progress
  progressBar: {
    position: 'absolute',
    top: 100,
    left: spacing[5],
    right: spacing[5],
    zIndex: 10,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },

  // Instructions
  instructionContainer: {
    position: 'absolute',
    top: 120,
    left: spacing[5],
    right: spacing[5],
    alignItems: 'center',
    zIndex: 10,
  },
  instructionBg: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  phaseIcon: {
    fontSize: 28,
    marginBottom: spacing[1],
  },
  instructionText: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  subInstruction: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    textAlign: 'center',
  },

  // Face detection badge
  faceDetectionBadge: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.38 + 140,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    zIndex: 10,
  },
  faceDetectedBadge: {},
  faceDetectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[2],
  },
  faceDetectionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  // Bottom section
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingTop: spacing[3],
    alignItems: 'center',
    zIndex: 10,
  },

  // Distance indicator
  distanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginBottom: spacing[3],
  },
  distanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[2],
  },
  distanceText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  // Lighting bar
  lightingBar: {
    width: SCREEN_WIDTH * 0.6,
    marginBottom: spacing[4],
  },
  lightingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightingIcon: {
    fontSize: 14,
    marginRight: spacing[2],
  },
  lightingTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  lightingFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  lightingLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing[2],
  },

  // Thumbnails
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[5],
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbnailActive: {
    borderColor: colors.neon.pink,
    ...shadows.neonPink,
  },
  thumbnailCaptured: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(5,255,161,0.1)',
  },
  thumbnailIcon: {
    fontSize: 22,
  },
  thumbnailCheck: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neon.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailCheckText: {
    fontSize: 10,
    color: colors.dark[900],
    fontWeight: typography.fontWeight.bold,
  },

  // Capture button
  captureButtonContainer: {
    width: 88,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureRingSvg: {
    position: 'absolute',
  },
  captureOuterPulse: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: 'rgba(255,107,203,0.3)',
  },
  captureButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  captureButtonCapturing: {
    borderColor: colors.neon.green,
  },
  captureInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
  },
  captureCheckmark: {
    fontSize: 30,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.bold,
  },
});
