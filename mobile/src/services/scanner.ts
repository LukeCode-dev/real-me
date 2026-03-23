/**
 * Real Me Scanner - Scanner Utility Service
 * Simulates image processing, measurement calculation, quality validation,
 * and 3D mesh generation for body/face scanning.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BodyPhoto {
  uri: string;
  position: 'front' | 'right' | 'back' | 'left';
  timestamp: number;
}

export interface FacePhoto {
  uri: string;
  position: 'neutral' | 'smile' | 'profile';
  timestamp: number;
}

export interface MeasurementData {
  height: number;       // cm
  weight: number;       // kg
  chest: number;        // cm
  waist: number;        // cm
  hips: number;         // cm
  shoulders: number;    // cm
  inseam: number;       // cm
  armLength: number;    // cm
  neckCircumference: number; // cm
  shoeSize: number;     // EU
}

export interface ScanResult {
  measurements: MeasurementData;
  confidence: number;   // 0-100
  processingTimeMs: number;
  warnings: string[];
}

export interface QualityResult {
  overall: number;      // 0-100
  brightness: number;   // 0-100
  sharpness: number;    // 0-100
  faceDetected: boolean;
  bodyDetected: boolean;
  issues: QualityIssue[];
  passed: boolean;
}

export interface QualityIssue {
  type: 'brightness' | 'blur' | 'face' | 'body' | 'distance' | 'angle';
  severity: 'warning' | 'error';
  message: string;
}

export interface MeshVertex {
  x: number;
  y: number;
  z: number;
}

export interface MeshData {
  vertices: MeshVertex[];
  faces: number[][];
  normals: MeshVertex[];
  vertexCount: number;
  faceCount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Seeded-ish random in range, for reproducible-looking mock data. */
function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Realistic measurement ranges
// ---------------------------------------------------------------------------

const MEASUREMENT_RANGES: Record<keyof MeasurementData, [number, number]> = {
  height:            [150, 200],
  weight:            [45, 130],
  chest:             [76, 130],
  waist:             [58, 115],
  hips:              [80, 130],
  shoulders:         [36, 56],
  inseam:            [68, 92],
  armLength:         [55, 70],
  neckCircumference: [32, 48],
  shoeSize:          [36, 48],
};

// ---------------------------------------------------------------------------
// processScanImages
// ---------------------------------------------------------------------------

/**
 * Simulates server-side image processing.
 * Accepts an array of image URIs (body + face combined), and returns
 * realistic mock measurement data after a simulated processing delay.
 */
export async function processScanImages(
  images: string[],
): Promise<ScanResult> {
  const start = Date.now();

  // Simulate processing time proportional to image count
  const processingMs = 1500 + images.length * 500 + Math.random() * 1000;
  await delay(processingMs);

  const measurements = generateMockMeasurements();
  const warnings: string[] = [];

  if (images.length < 4) {
    warnings.push(
      'Fewer than 4 images provided. Measurements may be less accurate.',
    );
  }

  // Confidence scales with image count
  const baseConfidence = 70;
  const imageBonus = Math.min(images.length * 5, 25);
  const noise = Math.random() * 6 - 3;
  const confidence = Math.min(
    100,
    Math.max(60, baseConfidence + imageBonus + noise),
  );

  return {
    measurements,
    confidence: Math.round(confidence),
    processingTimeMs: Date.now() - start,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// calculateMeasurements
// ---------------------------------------------------------------------------

/**
 * Calculates/estimates body measurements from body and face photos.
 * This is a mock implementation that returns realistic random values
 * within normal adult human ranges, correlated to each other so the
 * proportions make sense (e.g. wider shoulders → larger chest).
 */
export function calculateMeasurements(
  bodyPhotos: BodyPhoto[],
  facePhotos: FacePhoto[],
): MeasurementData {
  // Generate a base body "frame" for proportional consistency
  const heightFactor = Math.random(); // 0 = short, 1 = tall
  const buildFactor = Math.random();  // 0 = slim, 1 = large

  const height = lerp(155, 195, heightFactor);
  const weight = lerp(50, 120, buildFactor * 0.6 + heightFactor * 0.4);

  // Derive correlated measurements
  const chest = lerp(78, 125, buildFactor * 0.7 + heightFactor * 0.3) + jitter(3);
  const waist = chest - randomInRange(8, 22);
  const hips = lerp(82, 125, buildFactor * 0.65 + heightFactor * 0.35) + jitter(2);
  const shoulders = lerp(38, 54, buildFactor * 0.4 + heightFactor * 0.6) + jitter(1);
  const inseam = lerp(70, 90, heightFactor) + jitter(2);
  const armLength = lerp(56, 68, heightFactor) + jitter(1);
  const neckCircumference = lerp(33, 46, buildFactor * 0.7 + heightFactor * 0.3) + jitter(1);
  const shoeSize = lerp(37, 47, heightFactor * 0.7 + buildFactor * 0.3) + jitter(0.5);

  // Adjust confidence if missing photos
  const _coverage = bodyPhotos.length / 4; // not returned, just noted internally

  return {
    height: round1(clamp(height, 150, 200)),
    weight: round1(clamp(weight, 45, 130)),
    chest: round1(clamp(chest, 76, 130)),
    waist: round1(clamp(waist, 58, 115)),
    hips: round1(clamp(hips, 80, 130)),
    shoulders: round1(clamp(shoulders, 36, 56)),
    inseam: round1(clamp(inseam, 68, 92)),
    armLength: round1(clamp(armLength, 55, 70)),
    neckCircumference: round1(clamp(neckCircumference, 32, 48)),
    shoeSize: Math.round(clamp(shoeSize, 36, 48)),
  };
}

// ---------------------------------------------------------------------------
// validateScanQuality
// ---------------------------------------------------------------------------

/**
 * Checks image quality for brightness, blur, and subject detection.
 * Returns a simulated quality report.
 */
export async function validateScanQuality(
  imageUri: string,
): Promise<QualityResult> {
  // Simulate a brief processing delay
  await delay(300 + Math.random() * 400);

  const brightness = randomInRange(40, 100);
  const sharpness = randomInRange(50, 100);
  const faceDetected = Math.random() > 0.15;
  const bodyDetected = Math.random() > 0.1;

  const issues: QualityIssue[] = [];

  if (brightness < 50) {
    issues.push({
      type: 'brightness',
      severity: brightness < 30 ? 'error' : 'warning',
      message:
        brightness < 30
          ? 'Image is too dark. Please move to a well-lit area.'
          : 'Image is slightly dark. Better lighting will improve accuracy.',
    });
  }

  if (sharpness < 60) {
    issues.push({
      type: 'blur',
      severity: sharpness < 40 ? 'error' : 'warning',
      message:
        sharpness < 40
          ? 'Image is too blurry. Hold the camera steady.'
          : 'Image is slightly blurry. Try holding your device more steadily.',
    });
  }

  if (!faceDetected) {
    issues.push({
      type: 'face',
      severity: 'warning',
      message: 'Face not clearly detected. Please face the camera directly.',
    });
  }

  if (!bodyDetected) {
    issues.push({
      type: 'body',
      severity: 'error',
      message:
        'Full body not detected. Please step back so your entire body is visible.',
    });
  }

  // Random chance of distance/angle warnings
  if (Math.random() < 0.2) {
    issues.push({
      type: 'distance',
      severity: 'warning',
      message: 'You appear too far from the camera. Move a bit closer.',
    });
  }

  if (Math.random() < 0.15) {
    issues.push({
      type: 'angle',
      severity: 'warning',
      message: 'Camera angle detected. Hold the camera at chest height.',
    });
  }

  const hasErrors = issues.some((i) => i.severity === 'error');
  const overall = Math.round(
    brightness * 0.3 + sharpness * 0.4 + (faceDetected ? 15 : 0) + (bodyDetected ? 15 : 0),
  );

  return {
    overall: Math.min(100, overall),
    brightness: Math.round(brightness),
    sharpness: Math.round(sharpness),
    faceDetected,
    bodyDetected,
    issues,
    passed: !hasErrors && overall >= 60,
  };
}

// ---------------------------------------------------------------------------
// generateMeshData
// ---------------------------------------------------------------------------

/**
 * Returns mock 3D mesh vertex data shaped loosely like a human figure.
 * The mesh is parameterised by the given measurements so taller/wider
 * bodies produce correspondingly scaled geometry.
 */
export function generateMeshData(measurements: MeasurementData): MeshData {
  const { height, chest, waist, hips, shoulders } = measurements;

  // Normalise to a 0-2 unit-space figure (2 units tall)
  const scale = height / 100; // ~1.5-2.0
  const chestRadius = (chest / 100) * 0.16;
  const waistRadius = (waist / 100) * 0.15;
  const hipRadius = (hips / 100) * 0.16;
  const shoulderWidth = (shoulders / 50) * 0.5;

  const vertices: MeshVertex[] = [];
  const faces: number[][] = [];
  const normals: MeshVertex[] = [];

  const rings = 20;
  const segments = 16;

  for (let ring = 0; ring <= rings; ring++) {
    const t = ring / rings; // 0 (feet) → 1 (head)
    const y = t * scale;

    // Radius varies along the body
    let radius: number;
    if (t < 0.1) {
      // Feet / ankles
      radius = 0.06;
    } else if (t < 0.3) {
      // Legs → hips
      radius = lerp(0.08, hipRadius, (t - 0.1) / 0.2);
    } else if (t < 0.45) {
      // Hips → waist
      radius = lerp(hipRadius, waistRadius, (t - 0.3) / 0.15);
    } else if (t < 0.6) {
      // Waist → chest
      radius = lerp(waistRadius, chestRadius, (t - 0.45) / 0.15);
    } else if (t < 0.7) {
      // Chest → shoulders
      radius = lerp(chestRadius, shoulderWidth * 0.5, (t - 0.6) / 0.1);
    } else if (t < 0.85) {
      // Shoulders → neck
      radius = lerp(shoulderWidth * 0.5, 0.06, (t - 0.7) / 0.15);
    } else {
      // Head
      const headT = (t - 0.85) / 0.15;
      radius = 0.09 * Math.sin(headT * Math.PI);
      radius = Math.max(radius, 0.03);
    }

    for (let seg = 0; seg < segments; seg++) {
      const angle = (seg / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      vertices.push({ x, y, z });
      normals.push({
        x: Math.cos(angle),
        y: 0,
        z: Math.sin(angle),
      });
    }
  }

  // Build quad faces between rings
  for (let ring = 0; ring < rings; ring++) {
    for (let seg = 0; seg < segments; seg++) {
      const curr = ring * segments + seg;
      const next = ring * segments + ((seg + 1) % segments);
      const currUp = (ring + 1) * segments + seg;
      const nextUp = (ring + 1) * segments + ((seg + 1) % segments);

      // Two triangles per quad
      faces.push([curr, next, currUp]);
      faces.push([next, nextUp, currUp]);
    }
  }

  return {
    vertices,
    faces,
    normals,
    vertexCount: vertices.length,
    faceCount: faces.length,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function generateMockMeasurements(): MeasurementData {
  const m: Record<string, number> = {};
  for (const [key, [min, max]] of Object.entries(MEASUREMENT_RANGES)) {
    m[key] = randomInRange(min, max);
  }
  return m as unknown as MeasurementData;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function jitter(maxDelta: number): number {
  return (Math.random() - 0.5) * 2 * maxDelta;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
