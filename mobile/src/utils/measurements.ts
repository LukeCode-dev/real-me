/**
 * Real Me Scanner - Measurement Utilities
 * Conversion, formatting, validation, body-type estimation, and size mapping.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Measurements {
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

export interface ImperialMeasurements {
  height: number;       // inches
  weight: number;       // lbs
  chest: number;        // inches
  waist: number;        // inches
  hips: number;         // inches
  shoulders: number;    // inches
  inseam: number;       // inches
  armLength: number;    // inches
  neckCircumference: number; // inches
  shoeSize: number;     // US
}

export type MeasurementField = keyof Measurements;
export type BodyType = 'slim' | 'athletic' | 'average' | 'curvy' | 'plus';
export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type Unit = 'metric' | 'imperial';

export interface MeasurementRange {
  min: number;
  max: number;
  unit: string;
  label: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Realistic measurement ranges (metric)
// ---------------------------------------------------------------------------

export const MEASUREMENT_RANGES: Record<MeasurementField, MeasurementRange> = {
  height:            { min: 140, max: 210, unit: 'cm',  label: 'Height' },
  weight:            { min: 35,  max: 180, unit: 'kg',  label: 'Weight' },
  chest:             { min: 70,  max: 140, unit: 'cm',  label: 'Chest' },
  waist:             { min: 50,  max: 130, unit: 'cm',  label: 'Waist' },
  hips:              { min: 70,  max: 145, unit: 'cm',  label: 'Hips' },
  shoulders:         { min: 34,  max: 60,  unit: 'cm',  label: 'Shoulders' },
  inseam:            { min: 60,  max: 100, unit: 'cm',  label: 'Inseam' },
  armLength:         { min: 50,  max: 75,  unit: 'cm',  label: 'Arm Length' },
  neckCircumference: { min: 28,  max: 55,  unit: 'cm',  label: 'Neck' },
  shoeSize:          { min: 34,  max: 50,  unit: 'EU',  label: 'Shoe Size' },
};

// ---------------------------------------------------------------------------
// Conversion constants
// ---------------------------------------------------------------------------

const CM_TO_INCH = 0.393701;
const KG_TO_LB = 2.20462;

/** EU shoe size to approximate US size offset (EU - offset = US). */
const EU_TO_US_OFFSET = 33;

// ---------------------------------------------------------------------------
// convertToImperial
// ---------------------------------------------------------------------------

export function convertToImperial(m: Measurements): ImperialMeasurements {
  return {
    height: round2(m.height * CM_TO_INCH),
    weight: round2(m.weight * KG_TO_LB),
    chest: round2(m.chest * CM_TO_INCH),
    waist: round2(m.waist * CM_TO_INCH),
    hips: round2(m.hips * CM_TO_INCH),
    shoulders: round2(m.shoulders * CM_TO_INCH),
    inseam: round2(m.inseam * CM_TO_INCH),
    armLength: round2(m.armLength * CM_TO_INCH),
    neckCircumference: round2(m.neckCircumference * CM_TO_INCH),
    shoeSize: Math.round(m.shoeSize - EU_TO_US_OFFSET),
  };
}

// ---------------------------------------------------------------------------
// convertToMetric
// ---------------------------------------------------------------------------

export function convertToMetric(m: ImperialMeasurements): Measurements {
  return {
    height: round2(m.height / CM_TO_INCH),
    weight: round2(m.weight / KG_TO_LB),
    chest: round2(m.chest / CM_TO_INCH),
    waist: round2(m.waist / CM_TO_INCH),
    hips: round2(m.hips / CM_TO_INCH),
    shoulders: round2(m.shoulders / CM_TO_INCH),
    inseam: round2(m.inseam / CM_TO_INCH),
    armLength: round2(m.armLength / CM_TO_INCH),
    neckCircumference: round2(m.neckCircumference / CM_TO_INCH),
    shoeSize: Math.round(m.shoeSize + EU_TO_US_OFFSET),
  };
}

// ---------------------------------------------------------------------------
// formatMeasurement
// ---------------------------------------------------------------------------

/**
 * Formats a numeric measurement with its unit label.
 *
 * @example formatMeasurement(92.5, 'cm')  // "92.5 cm"
 * @example formatMeasurement(36.4, 'in')  // "36.4 in"
 */
export function formatMeasurement(value: number, unit: string): string {
  if (unit === 'EU' || unit === 'US') {
    return `${Math.round(value)} ${unit}`;
  }
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return `${formatted} ${unit}`;
}

// ---------------------------------------------------------------------------
// validateMeasurement
// ---------------------------------------------------------------------------

/**
 * Validates a single measurement value against its allowed range.
 * Returns { valid, error? }.
 */
export function validateMeasurement(
  field: MeasurementField,
  value: number,
): ValidationResult {
  const range = MEASUREMENT_RANGES[field];
  if (!range) {
    return { valid: false, error: `Unknown measurement field: ${field}` };
  }

  if (value == null || isNaN(value)) {
    return { valid: false, error: `${range.label} is required.` };
  }

  if (value < range.min) {
    return {
      valid: false,
      error: `${range.label} seems too low. Minimum is ${range.min} ${range.unit}.`,
    };
  }

  if (value > range.max) {
    return {
      valid: false,
      error: `${range.label} seems too high. Maximum is ${range.max} ${range.unit}.`,
    };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// estimateBodyType
// ---------------------------------------------------------------------------

/**
 * Estimates a body-type category from key measurements.
 * Uses a simplified heuristic based on waist-to-hip and chest-to-waist ratios.
 */
export function estimateBodyType(m: Partial<Measurements>): BodyType {
  const { chest, waist, hips, weight, height } = m;

  // Need at least chest, waist, hips to estimate
  if (!chest || !waist || !hips) return 'average';

  const waistToHip = waist / hips;
  const chestToWaist = chest / waist;

  // BMI-ish proxy (if available)
  let bmi = 22; // default average
  if (weight && height) {
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
  }

  if (bmi < 18.5 || (waistToHip < 0.72 && chestToWaist > 1.15)) {
    return 'slim';
  }

  if (bmi >= 18.5 && bmi < 23 && chestToWaist > 1.12 && waistToHip < 0.78) {
    return 'athletic';
  }

  if (bmi >= 30 || waist > 105) {
    return 'plus';
  }

  if (waistToHip > 0.85 || hips - waist > 25) {
    return 'curvy';
  }

  return 'average';
}

// ---------------------------------------------------------------------------
// estimateSize
// ---------------------------------------------------------------------------

/**
 * Maps measurements to a standard clothing size.
 * Averages chest, waist, and hip circumference then maps to size buckets
 * (same algorithm as the server's Avatar.getRecommendedSize).
 */
export function estimateSize(m: Partial<Measurements>): ClothingSize {
  const { chest, waist, hips } = m;

  if (!chest && !waist && !hips) return 'M'; // fallback

  const values = [chest, waist, hips].filter(Boolean) as number[];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  if (avg < 78) return 'XS';
  if (avg < 85) return 'S';
  if (avg < 93) return 'M';
  if (avg < 101) return 'L';
  if (avg < 110) return 'XL';
  return 'XXL';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
