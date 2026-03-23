/**
 * Real Me Scanner - Body Scan Screen
 * Full-screen camera with 4-phase body capture: FRONT, RIGHT, BACK, LEFT
 * SVG silhouette overlay, auto-capture simulation, haptic feedback
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, G, Defs, ClipPath, Ellipse, Line } from 'react-native-svg';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- Types ---

interface BodyScanProps {
  navigation: any;
}

type Phase = 'FRONT' | 'RIGHT' | 'BACK' | 'LEFT';

interface PhaseConfig {
  key: Phase;
  label: string;
  instruction: string;
  turnDirection: string;
  arrowRotation: string;
}

// --- Constants ---

const PHASES: PhaseConfig[] = [
  {
    key: 'FRONT',
    label: 'Front View',
    instruction: 'Stand facing the camera',
    turnDirection: '',
    arrowRotation: '0deg',
  },
  {
    key: 'RIGHT',
    label: 'Right Side',
    instruction: 'Turn to your right',
    turnDirection: '\u27A1',
    arrowRotation: '90deg',
  },
  {
    key: 'BACK',
    label: 'Back View',
    instruction: 'Turn to face away from camera',
    turnDirection: '\u21BB',
    arrowRotation: '180deg',
  },
  {
    key: 'LEFT',
    label: 'Left Side',
    instruction: 'Turn to your left',
    turnDirection: '\u2B05',
    arrowRotation: '270deg',
  },
];

const AUTO_CAPTURE_DELAY = 3000; // ms before auto-capture
const CAPTURE_FLASH_DURATION = 200;

// --- Body Silhouette SVG ---

function BodySilhouetteOverlay({ phase }: { phase: Phase }) {
  const outlineColor = colors.neon.blue;
  const opacity = 0.5;

  // Different silhouette depending on the angle
  const isSide = phase === 'RIGHT' || phase === 'LEFT';
  const flip = phase === 'LEFT' ? -1 : 1;

  const centerX = SCREEN_WIDTH / 2;
  const bodyTop = SCREEN_HEIGHT * 0.15;
  const bodyBottom = SCREEN_HEIGHT * 0.85;
  const bodyHeight = bodyBottom - bodyTop;

  if (isSide) {
    // Side profile silhouette - narrower
    return (
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <ClipPath id="bodyClipSide">
            <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} />
          </ClipPath>
        </Defs>
        {/* Head */}
        <Ellipse
          cx={centerX}
          cy={bodyTop + bodyHeight * 0.06}
          rx={30}
          ry={38}
          fill="none"
          stroke={outlineColor}
          strokeWidth={2}
          opacity={opacity}
          strokeDasharray="6 4"
        />
        {/* Torso - side view narrower */}
        <Path
          d={`
            M ${centerX - 25} ${bodyTop + bodyHeight * 0.13}
            C ${centerX - 20} ${bodyTop + bodyHeight * 0.2},
              ${centerX - 30} ${bodyTop + bodyHeight * 0.35},
              ${centerX - 22} ${bodyTop + bodyHeight * 0.5}
            L ${centerX - 20} ${bodyTop + bodyHeight * 0.55}
            L ${centerX - 35} ${bodyTop + bodyHeight * 0.82}
            L ${centerX - 28} ${bodyTop + bodyHeight * 0.85}
            L ${centerX} ${bodyTop + bodyHeight * 0.58}
            L ${centerX + 28} ${bodyTop + bodyHeight * 0.85}
            L ${centerX + 35} ${bodyTop + bodyHeight * 0.82}
            L ${centerX + 20} ${bodyTop + bodyHeight * 0.55}
            L ${centerX + 22} ${bodyTop + bodyHeight * 0.5}
            C ${centerX + 30} ${bodyTop + bodyHeight * 0.35},
              ${centerX + 20} ${bodyTop + bodyHeight * 0.2},
              ${centerX + 25} ${bodyTop + bodyHeight * 0.13}
            Z
          `}
          fill="none"
          stroke={outlineColor}
          strokeWidth={2}
          opacity={opacity}
          strokeDasharray="6 4"
        />
      </Svg>
    );
  }

  // Front/Back silhouette
  return (
    <Svg
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      style={StyleSheet.absoluteFill}
    >
      {/* Head */}
      <Ellipse
        cx={centerX}
        cy={bodyTop + bodyHeight * 0.06}
        rx={35}
        ry={42}
        fill="none"
        stroke={outlineColor}
        strokeWidth={2}
        opacity={opacity}
        strokeDasharray="6 4"
      />
      {/* Neck */}
      <Line
        x1={centerX - 12}
        y1={bodyTop + bodyHeight * 0.11}
        x2={centerX - 12}
        y2={bodyTop + bodyHeight * 0.14}
        stroke={outlineColor}
        strokeWidth={2}
        opacity={opacity}
        strokeDasharray="6 4"
      />
      <Line
        x1={centerX + 12}
        y1={bodyTop + bodyHeight * 0.11}
        x2={centerX + 12}
        y2={bodyTop + bodyHeight * 0.14}
        stroke={outlineColor}
        strokeWidth={2}
        opacity={opacity}
        strokeDasharray="6 4"
      />
      {/* Body outline */}
      <Path
        d={`
          M ${centerX - 12} ${bodyTop + bodyHeight * 0.14}
          L ${centerX - 70} ${bodyTop + bodyHeight * 0.17}
          L ${centerX - 85} ${bodyTop + bodyHeight * 0.35}
          L ${centerX - 30} ${bodyTop + bodyHeight * 0.36}
          L ${centerX - 35} ${bodyTop + bodyHeight * 0.42}
          C ${centerX - 40} ${bodyTop + bodyHeight * 0.5},
            ${centerX - 38} ${bodyTop + bodyHeight * 0.52},
            ${centerX - 40} ${bodyTop + bodyHeight * 0.55}
          L ${centerX - 55} ${bodyTop + bodyHeight * 0.82}
          L ${centerX - 40} ${bodyTop + bodyHeight * 0.82}
          L ${centerX - 38} ${bodyTop + bodyHeight * 0.85}
          L ${centerX - 25} ${bodyTop + bodyHeight * 0.85}
          L ${centerX - 20} ${bodyTop + bodyHeight * 0.58}
          L ${centerX} ${bodyTop + bodyHeight * 0.56}
          L ${centerX + 20} ${bodyTop + bodyHeight * 0.58}
          L ${centerX + 25} ${bodyTop + bodyHeight * 0.85}
          L ${centerX + 38} ${bodyTop + bodyHeight * 0.85}
          L ${centerX + 40} ${bodyTop + bodyHeight * 0.82}
          L ${centerX + 55} ${bodyTop + bodyHeight * 0.82}
          L ${centerX + 40} ${bodyTop + bodyHeight * 0.55}
          C ${centerX + 38} ${bodyTop + bodyHeight * 0.52},
            ${centerX + 40} ${bodyTop + bodyHeight * 0.5},
            ${centerX + 35} ${bodyTop + bodyHeight * 0.42}
          L ${centerX + 30} ${bodyTop + bodyHeight * 0.36}
          L ${centerX + 85} ${bodyTop + bodyHeight * 0.35}
          L ${centerX + 70} ${bodyTop + bodyHeight * 0.17}
          L ${centerX + 12} ${bodyTop + bodyHeight * 0.14}
          Z
        `}
        fill="none"
        stroke={outlineColor}
        strokeWidth={2}
        opacity={opacity}
        strokeDasharray="6 4"
      />
      {/* Alignment crosshair lines */}
      <Line
        x1={centerX}
        y1={bodyTop - 10}
        x2={centerX}
        y2={bodyTop + 10}
        stroke={outlineColor}
        strokeWidth={1}
        opacity={0.3}
      />
      <Line
        x1={centerX - 10}
        y1={bodyTop + bodyHeight * 0.5}
        x2={centerX + 10}
        y2={bodyTop + bodyHeight * 0.5}
        stroke={outlineColor}
        strokeWidth={1}
        opacity={0.3}
      />
    </Svg>
  );
}

// --- Rotation Arrow ---

function RotationIndicator({ direction }: { direction: string }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  if (!direction) return null;

  const translateX = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  return (
    <Animated.View style={[styles.rotationIndicator, { transform: [{ translateX }] }]}>
      <Text style={styles.rotationArrow}>{direction}</Text>
      <Text style={styles.rotationLabel}>Turn</Text>
    </Animated.View>
  );
}

// --- Main Component ---

export default function BodyScanScreen({ navigation }: BodyScanProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [captures, setCaptures] = useState<(string | null)[]>([null, null, null, null]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [alignmentDetected, setAlignmentDetected] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);

  const cameraRef = useRef<any>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animations
  const progressAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const instructionOpacity = useRef(new Animated.Value(1)).current;
  const captureRingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentPhase = PHASES[currentPhaseIndex];
  const isComplete = captures.every((c) => c !== null);

  // Pulsing capture button ring
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
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

  // Simulate alignment detection and auto-capture
  useEffect(() => {
    if (isCapturing || captures[currentPhaseIndex]) return;

    // Simulate alignment detection after 1s
    const alignTimer = setTimeout(() => {
      setAlignmentDetected(true);
    }, 1000);

    return () => {
      clearTimeout(alignTimer);
      setAlignmentDetected(false);
    };
  }, [currentPhaseIndex, isCapturing]);

  // Auto-capture progress when aligned
  useEffect(() => {
    if (!alignmentDetected || isCapturing || captures[currentPhaseIndex]) return;

    setAutoProgress(0);
    const interval = 50; // ms
    const totalSteps = AUTO_CAPTURE_DELAY / interval;
    let step = 0;

    autoTimerRef.current = setInterval(() => {
      step++;
      const prog = step / totalSteps;
      setAutoProgress(prog);

      Animated.timing(captureRingAnim, {
        toValue: prog,
        duration: interval,
        useNativeDriver: false,
      }).start();

      if (step >= totalSteps) {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
        handleCapture();
      }
    }, interval);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [alignmentDetected, currentPhaseIndex, isCapturing]);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Flash effect
    setShowFlash(true);
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: CAPTURE_FLASH_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => setShowFlash(false));

    // Simulate photo capture (in real app, use cameraRef.current.takePictureAsync())
    const fakeUri = `capture_body_${currentPhase.key}_${Date.now()}`;

    // Store capture
    const newCaptures = [...captures];
    newCaptures[currentPhaseIndex] = fakeUri;
    setCaptures(newCaptures);

    // Success checkmark animation
    Animated.spring(checkAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();

    // Light haptic for success
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Auto advance after brief delay
    setTimeout(() => {
      checkAnim.setValue(0);
      captureRingAnim.setValue(0);
      setAutoProgress(0);
      setAlignmentDetected(false);
      setIsCapturing(false);

      if (currentPhaseIndex < PHASES.length - 1) {
        // Instruction fade transition
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
        // All captures done - navigate to face scan
        navigation.navigate('FaceScan');
      }
    }, 1200);
  }, [isCapturing, currentPhaseIndex, captures, currentPhase]);

  function handleRetake() {
    const newCaptures = [...captures];
    newCaptures[currentPhaseIndex] = null;
    setCaptures(newCaptures);
    captureRingAnim.setValue(0);
    setAutoProgress(0);
    setAlignmentDetected(false);
    setIsCapturing(false);
  }

  function handleCancel() {
    Alert.alert(
      'Cancel Scan?',
      'Your progress will be lost. Are you sure?',
      [
        { text: 'Continue Scanning', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }

  // Progress bar width
  const progressBarWidth = ((currentPhaseIndex + (captures[currentPhaseIndex] ? 1 : 0)) / PHASES.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
      />

      {/* Dark overlay vignette */}
      <View style={styles.vignette} pointerEvents="none" />

      {/* Body silhouette overlay */}
      <BodySilhouetteOverlay phase={currentPhase.key} />

      {/* Capture flash */}
      {showFlash && (
        <Animated.View
          style={[styles.flashOverlay, { opacity: flashAnim }]}
          pointerEvents="none"
        />
      )}

      {/* Top bar */}
      <View style={styles.topBar}>
        {/* Cancel button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>{'\u2715'}</Text>
        </TouchableOpacity>

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            {currentPhaseIndex + 1}/{PHASES.length}
          </Text>
          <Text style={styles.stepLabel}>{currentPhase.label}</Text>
        </View>

        {/* Retake button */}
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
            colors={[colors.neon.blue, colors.neon.purple]}
            style={[styles.progressFill, { width: `${progressBarWidth}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        {/* Phase dots */}
        <View style={styles.phaseDots}>
          {PHASES.map((phase, i) => (
            <View
              key={phase.key}
              style={[
                styles.phaseDot,
                i <= currentPhaseIndex ? styles.phaseDotActive : {},
                captures[i] ? styles.phaseDotCaptured : {},
              ]}
            >
              {captures[i] && <Text style={styles.phaseDotCheck}>{'\u2713'}</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* Instruction text */}
      <Animated.View style={[styles.instructionContainer, { opacity: instructionOpacity }]}>
        <View style={styles.instructionBg}>
          <Text style={styles.instructionText}>{currentPhase.instruction}</Text>
          {alignmentDetected && !captures[currentPhaseIndex] && (
            <Text style={styles.alignedText}>Aligned - Hold still...</Text>
          )}
        </View>
      </Animated.View>

      {/* Rotation indicator */}
      {currentPhase.turnDirection && !captures[currentPhaseIndex] && (
        <RotationIndicator direction={currentPhase.turnDirection} />
      )}

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Captured thumbnails */}
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
              <Text style={styles.thumbnailLabel}>{phase.key[0]}</Text>
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
          {/* Pulsing outer ring */}
          <Animated.View
            style={[
              styles.captureOuterRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <LinearGradient
              colors={[colors.neon.blue, colors.neon.purple]}
              style={styles.captureOuterRingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Progress ring (SVG arc) */}
          <Svg
            width={90}
            height={90}
            style={styles.captureRingSvg}
          >
            <Circle
              cx={45}
              cy={45}
              r={40}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={3}
            />
            <Circle
              cx={45}
              cy={45}
              r={40}
              fill="none"
              stroke={colors.neon.blue}
              strokeWidth={3}
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - autoProgress)}`}
              strokeLinecap="round"
              transform={`rotate(-90, 45, 45)`}
            />
          </Svg>

          {/* Capture button */}
          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing ? styles.captureButtonCapturing : {},
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

  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: 60,
    borderColor: 'rgba(0,0,0,0.3)',
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

  // Progress bar
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
    marginBottom: spacing[3],
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  phaseDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
  },
  phaseDot: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseDotActive: {
    borderColor: colors.neon.blue,
  },
  phaseDotCaptured: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(5,255,161,0.2)',
  },
  phaseDotCheck: {
    fontSize: 12,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.bold,
  },

  // Instructions
  instructionContainer: {
    position: 'absolute',
    top: 155,
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
  instructionText: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  alignedText: {
    fontSize: typography.fontSize.sm,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4,
  },

  // Rotation indicator
  rotationIndicator: {
    position: 'absolute',
    right: spacing[6],
    top: SCREEN_HEIGHT * 0.45,
    alignItems: 'center',
    zIndex: 10,
  },
  rotationArrow: {
    fontSize: 40,
    color: colors.neon.blue,
  },
  rotationLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neon.blue,
    fontWeight: typography.fontWeight.semibold,
    marginTop: 4,
  },

  // Bottom controls
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingTop: spacing[4],
    alignItems: 'center',
    zIndex: 10,
  },

  // Thumbnails
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbnailActive: {
    borderColor: colors.neon.blue,
    ...shadows.neonBlue,
  },
  thumbnailCaptured: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(5,255,161,0.1)',
  },
  thumbnailLabel: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: typography.fontWeight.bold,
  },
  thumbnailCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
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
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureOuterRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    opacity: 0.3,
  },
  captureOuterRingGradient: {
    flex: 1,
  },
  captureRingSvg: {
    position: 'absolute',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
  },
  captureCheckmark: {
    fontSize: 32,
    color: colors.neon.green,
    fontWeight: typography.fontWeight.bold,
  },
});
