import { useState } from 'react';
import { useAvatarStore, BodyMeasurements } from '../../hooks/useStore';

const MEASUREMENT_FIELDS: { key: keyof BodyMeasurements; label: string; unit: string; min: number; max: number }[] = [
  { key: 'height', label: 'Height', unit: 'cm', min: 100, max: 250 },
  { key: 'weight', label: 'Weight', unit: 'kg', min: 30, max: 300 },
  { key: 'chest', label: 'Chest', unit: 'cm', min: 50, max: 200 },
  { key: 'waist', label: 'Waist', unit: 'cm', min: 40, max: 180 },
  { key: 'hips', label: 'Hips', unit: 'cm', min: 50, max: 200 },
  { key: 'shoulders', label: 'Shoulders', unit: 'cm', min: 30, max: 70 },
  { key: 'inseam', label: 'Inseam', unit: 'cm', min: 50, max: 120 },
  { key: 'armLength', label: 'Arm Length', unit: 'cm', min: 40, max: 100 },
  { key: 'neckCircumference', label: 'Neck', unit: 'cm', min: 25, max: 60 },
  { key: 'shoeSize', label: 'Shoe Size', unit: 'EU', min: 20, max: 55 },
];

export default function MeasurementForm() {
  const { measurements, updateMeasurements } = useAvatarStore();
  const [useMetric, setUseMetric] = useState(true);

  const handleChange = (key: keyof BodyMeasurements, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      updateMeasurements({ [key]: num });
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-semibold">Body Measurements</h3>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setUseMetric(true)}
            className={`px-3 py-1 rounded-lg transition-colors ${useMetric ? 'bg-primary-600 text-white' : 'text-dark-200 hover:text-white'}`}
          >
            Metric
          </button>
          <button
            onClick={() => setUseMetric(false)}
            className={`px-3 py-1 rounded-lg transition-colors ${!useMetric ? 'bg-primary-600 text-white' : 'text-dark-200 hover:text-white'}`}
          >
            Imperial
          </button>
        </div>
      </div>

      <p className="text-dark-200 text-sm mb-6">
        Enter your measurements manually for precise avatar generation. These can also be
        auto-detected from your body scan photos.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {MEASUREMENT_FIELDS.map(({ key, label, unit, min, max }) => (
          <div key={key} className="relative">
            <label className="block text-sm text-dark-200 mb-1">{label}</label>
            <div className="relative">
              <input
                type="number"
                min={min}
                max={max}
                value={measurements[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder="—"
                className="w-full bg-dark-700 border border-dark-400 rounded-xl px-4 py-3 text-white
                  focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/30
                  placeholder-dark-300 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual body map */}
      <div className="mt-8 flex justify-center">
        <div className="relative w-48 h-80">
          <svg viewBox="0 0 200 320" className="w-full h-full">
            {/* Simplified body outline */}
            <ellipse cx="100" cy="35" rx="25" ry="30" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" />
            <line x1="100" y1="65" x2="100" y2="180" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
            <line x1="100" y1="90" x2="50" y2="150" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
            <line x1="100" y1="90" x2="150" y2="150" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
            <line x1="100" y1="180" x2="70" y2="310" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
            <line x1="100" y1="180" x2="130" y2="310" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />

            {/* Measurement indicators */}
            {measurements.chest && (
              <g>
                <ellipse cx="100" cy="110" rx="35" ry="8" fill="none" stroke="#05ffa1" strokeWidth="1" strokeDasharray="4,2" />
                <text x="145" y="114" fill="#05ffa1" fontSize="10">{measurements.chest}cm</text>
              </g>
            )}
            {measurements.waist && (
              <g>
                <ellipse cx="100" cy="145" rx="28" ry="6" fill="none" stroke="#ff6bcb" strokeWidth="1" strokeDasharray="4,2" />
                <text x="138" y="149" fill="#ff6bcb" fontSize="10">{measurements.waist}cm</text>
              </g>
            )}
            {measurements.hips && (
              <g>
                <ellipse cx="100" cy="180" rx="33" ry="7" fill="none" stroke="#b249f8" strokeWidth="1" strokeDasharray="4,2" />
                <text x="143" y="184" fill="#b249f8" fontSize="10">{measurements.hips}cm</text>
              </g>
            )}
            {measurements.height && (
              <g>
                <line x1="25" y1="5" x2="25" y2="310" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4,2" />
                <text x="10" y="160" fill="#00d4ff" fontSize="10" transform="rotate(-90, 15, 160)">{measurements.height}cm</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
