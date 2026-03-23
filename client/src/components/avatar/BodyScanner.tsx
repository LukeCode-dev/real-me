import { useRef, useState, useCallback } from 'react';
import { useAvatarStore } from '../../hooks/useStore';

const SCAN_STEPS = [
  { title: 'Front View', instruction: 'Stand facing the camera with arms slightly away from your body' },
  { title: 'Side View', instruction: 'Turn 90° to your right, arms at your sides' },
  { title: 'Back View', instruction: 'Turn to face away from the camera' },
  { title: 'Face Close-Up', instruction: 'Face the camera directly, ensure good lighting' },
];

export default function BodyScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const { scanStep, setScanStep, setIsScanning } = useAvatarStore();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  }, [setIsScanning]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsCapturing(true);
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCaptures((prev) => [...prev, imageData]);

    setTimeout(() => {
      setIsCapturing(false);
      if (scanStep < SCAN_STEPS.length - 1) {
        setScanStep(scanStep + 1);
      }
    }, 500);
  }, [scanStep, setScanStep]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  }, [stream, setIsScanning]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera View */}
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden bg-dark-800 aspect-video">
            {stream ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Scan overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Body outline guide */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1280 720">
                    <ellipse
                      cx="640" cy="200" rx="80" ry="100"
                      fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="2" strokeDasharray="8,4"
                    />
                    <line x1="640" y1="300" x2="640" y2="500"
                      stroke="rgba(0,212,255,0.3)" strokeWidth="2" strokeDasharray="8,4" />
                    <line x1="640" y1="340" x2="520" y2="420"
                      stroke="rgba(0,212,255,0.3)" strokeWidth="2" strokeDasharray="8,4" />
                    <line x1="640" y1="340" x2="760" y2="420"
                      stroke="rgba(0,212,255,0.3)" strokeWidth="2" strokeDasharray="8,4" />
                    <line x1="640" y1="500" x2="580" y2="680"
                      stroke="rgba(0,212,255,0.3)" strokeWidth="2" strokeDasharray="8,4" />
                    <line x1="640" y1="500" x2="700" y2="680"
                      stroke="rgba(0,212,255,0.3)" strokeWidth="2" strokeDasharray="8,4" />
                  </svg>

                  {/* Scanning line animation */}
                  <div className="scan-line" />

                  {/* Flash effect on capture */}
                  {isCapturing && (
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  )}
                </div>

                {/* Step indicator */}
                <div className="absolute top-4 left-4 glass rounded-xl px-4 py-2">
                  <p className="text-neon-blue text-sm font-semibold">
                    Step {scanStep + 1} of {SCAN_STEPS.length}
                  </p>
                  <p className="text-white font-display text-lg">
                    {SCAN_STEPS[scanStep].title}
                  </p>
                </div>

                {/* Instruction bar */}
                <div className="absolute bottom-0 left-0 right-0 glass py-4 px-6">
                  <p className="text-center text-white/80">
                    {SCAN_STEPS[scanStep].instruction}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-neon-blue/40 flex items-center justify-center">
                  <svg className="w-16 h-16 text-neon-blue/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-display font-semibold mb-2">Body Scan</h3>
                  <p className="text-dark-200 max-w-md">
                    We'll capture 4 angles of your body to create a photorealistic 3D avatar
                    with accurate measurements. Your data is encrypted and private.
                  </p>
                </div>
                <button onClick={startCamera} className="btn-primary text-lg">
                  Start Camera Scan
                </button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Capture controls */}
          {stream && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={stopCamera} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={captureFrame}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple border-4 border-white/20 hover:scale-110 transition-transform"
              />
              {captures.length === SCAN_STEPS.length && (
                <button className="btn-primary">
                  Generate Avatar →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Captured frames */}
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-lg">Captured Scans</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {SCAN_STEPS.map((step, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden border-2 transition-colors ${
                  i === scanStep
                    ? 'border-neon-blue shadow-lg shadow-neon-blue/20'
                    : captures[i]
                    ? 'border-neon-green/40'
                    : 'border-dark-400'
                }`}
              >
                {captures[i] ? (
                  <img src={captures[i]} alt={step.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-dark-700 flex items-center justify-center">
                    <span className="text-dark-300 text-sm">{step.title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
