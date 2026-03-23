/**
 * Real Me Scanner - Scan Store (Zustand)
 * Manages scanning workflow state: photo capture, processing, measurements.
 */

import { create } from 'zustand';
import {
  processScanImages,
  calculateMeasurements,
  type MeasurementData,
  type BodyPhoto,
  type FacePhoto,
} from '../services/scanner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScanType = 'body' | 'face' | null;

export type BodyPhotoPosition = 'front' | 'right' | 'back' | 'left';
export type FacePhotoPosition = 'neutral' | 'smile' | 'profile';

export interface BodyPhotos {
  front?: string;
  right?: string;
  back?: string;
  left?: string;
}

export interface FacePhotos {
  neutral?: string;
  smile?: string;
  profile?: string;
}

export interface Measurements extends MeasurementData {}

export interface ScanState {
  scanType: ScanType;
  bodyPhotos: BodyPhotos;
  facePhotos: FacePhotos;
  currentStep: number;
  isProcessing: boolean;
  processingProgress: number;
  measurements: Partial<Measurements>;
  scanQuality: number;

  // Actions
  startBodyScan: () => void;
  startFaceScan: () => void;
  capturePhoto: (position: BodyPhotoPosition | FacePhotoPosition, uri: string) => void;
  setProcessingProgress: (n: number) => void;
  setMeasurements: (data: Partial<Measurements>) => void;
  resetScan: () => void;
  saveScan: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const INITIAL_STATE = {
  scanType: null as ScanType,
  bodyPhotos: {} as BodyPhotos,
  facePhotos: {} as FacePhotos,
  currentStep: 0,
  isProcessing: false,
  processingProgress: 0,
  measurements: {} as Partial<Measurements>,
  scanQuality: 0,
};

// ---------------------------------------------------------------------------
// Body scan step order
// ---------------------------------------------------------------------------

const BODY_POSITIONS: BodyPhotoPosition[] = ['front', 'right', 'back', 'left'];
const FACE_POSITIONS: FacePhotoPosition[] = ['neutral', 'smile', 'profile'];

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useScanStore = create<ScanState>((set, get) => ({
  ...INITIAL_STATE,

  // -----------------------------------------------------------------------
  // startBodyScan
  // -----------------------------------------------------------------------
  startBodyScan: () => {
    set({
      ...INITIAL_STATE,
      scanType: 'body',
      currentStep: 0,
    });
  },

  // -----------------------------------------------------------------------
  // startFaceScan
  // -----------------------------------------------------------------------
  startFaceScan: () => {
    set({
      ...INITIAL_STATE,
      scanType: 'face',
      currentStep: 0,
    });
  },

  // -----------------------------------------------------------------------
  // capturePhoto
  // -----------------------------------------------------------------------
  capturePhoto: (position, uri) => {
    const { scanType, bodyPhotos, facePhotos, currentStep } = get();

    if (scanType === 'body') {
      const updated = { ...bodyPhotos, [position]: uri };
      const filledCount = Object.values(updated).filter(Boolean).length;
      set({
        bodyPhotos: updated,
        currentStep: Math.min(currentStep + 1, BODY_POSITIONS.length),
        scanQuality: Math.round((filledCount / BODY_POSITIONS.length) * 100),
      });
    } else if (scanType === 'face') {
      const updated = { ...facePhotos, [position]: uri };
      const filledCount = Object.values(updated).filter(Boolean).length;
      set({
        facePhotos: updated,
        currentStep: Math.min(currentStep + 1, FACE_POSITIONS.length),
        scanQuality: Math.round((filledCount / FACE_POSITIONS.length) * 100),
      });
    }
  },

  // -----------------------------------------------------------------------
  // setProcessingProgress
  // -----------------------------------------------------------------------
  setProcessingProgress: (n) => {
    set({ processingProgress: Math.min(100, Math.max(0, n)) });
  },

  // -----------------------------------------------------------------------
  // setMeasurements
  // -----------------------------------------------------------------------
  setMeasurements: (data) => {
    set((state) => ({
      measurements: { ...state.measurements, ...data },
    }));
  },

  // -----------------------------------------------------------------------
  // resetScan
  // -----------------------------------------------------------------------
  resetScan: () => {
    set({ ...INITIAL_STATE });
  },

  // -----------------------------------------------------------------------
  // saveScan
  // -----------------------------------------------------------------------
  saveScan: async () => {
    const { bodyPhotos, facePhotos, scanType } = get();
    set({ isProcessing: true, processingProgress: 0 });

    try {
      // Collect image URIs
      const bodyUris = Object.values(bodyPhotos).filter(Boolean) as string[];
      const faceUris = Object.values(facePhotos).filter(Boolean) as string[];
      const allImages = [...bodyUris, ...faceUris];

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const { processingProgress, isProcessing } = get();
        if (!isProcessing || processingProgress >= 90) {
          clearInterval(progressInterval);
          return;
        }
        set({ processingProgress: processingProgress + Math.random() * 12 });
      }, 400);

      // Process images
      const result = await processScanImages(allImages);

      clearInterval(progressInterval);
      set({ processingProgress: 95 });

      // Also calculate measurements from structured photo data if we have body photos
      let measurements = result.measurements;
      if (bodyUris.length > 0) {
        const bodyPhotoData: BodyPhoto[] = Object.entries(bodyPhotos)
          .filter(([_, uri]) => uri)
          .map(([pos, uri]) => ({
            uri: uri!,
            position: pos as BodyPhoto['position'],
            timestamp: Date.now(),
          }));

        const facePhotoData: FacePhoto[] = Object.entries(facePhotos)
          .filter(([_, uri]) => uri)
          .map(([pos, uri]) => ({
            uri: uri!,
            position: pos as FacePhoto['position'],
            timestamp: Date.now(),
          }));

        measurements = calculateMeasurements(bodyPhotoData, facePhotoData);
      }

      set({
        measurements,
        processingProgress: 100,
        isProcessing: false,
        scanQuality: result.confidence,
      });
    } catch (error) {
      set({ isProcessing: false, processingProgress: 0 });
      throw error;
    }
  },
}));

export default useScanStore;
