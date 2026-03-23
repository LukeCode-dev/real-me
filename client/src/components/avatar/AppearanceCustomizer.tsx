import { useState } from 'react';
import { useAvatarStore } from '../../hooks/useStore';

const SKIN_TONES = [
  '#fce4c7', '#f5d0a9', '#e8b88a', '#d4a574', '#c4956a',
  '#b07d5b', '#8d5e3c', '#6b4226', '#4a2d12', '#2c1a0a',
];

const HAIR_COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Dark Brown', hex: '#3b2314' },
  { name: 'Brown', hex: '#6b3a2a' },
  { name: 'Light Brown', hex: '#a0724a' },
  { name: 'Blonde', hex: '#d4b56a' },
  { name: 'Platinum', hex: '#e8dcc8' },
  { name: 'Red', hex: '#8b2500' },
  { name: 'Auburn', hex: '#922724' },
  { name: 'Gray', hex: '#808080' },
  { name: 'White', hex: '#e0e0e0' },
];

const EYE_COLORS = [
  { name: 'Brown', hex: '#634e34' },
  { name: 'Hazel', hex: '#8e7618' },
  { name: 'Green', hex: '#2e8b57' },
  { name: 'Blue', hex: '#4682b4' },
  { name: 'Gray', hex: '#708090' },
  { name: 'Amber', hex: '#cf8e2e' },
];

const HAIR_STYLES = ['Short', 'Medium', 'Long', 'Buzz', 'Curly', 'Wavy', 'Braided', 'Ponytail', 'Bald'];
const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Muscular', 'Curvy', 'Plus Size'];

export default function AppearanceCustomizer() {
  const { measurements, updateMeasurements } = useAvatarStore();
  const [selectedSkin, setSelectedSkin] = useState(3);
  const [selectedHair, setSelectedHair] = useState(0);
  const [selectedEye, setSelectedEye] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('Medium');
  const [selectedBody, setSelectedBody] = useState('Average');

  return (
    <div className="card space-y-6">
      <h3 className="font-display text-xl font-semibold">Appearance</h3>

      {/* Skin Tone */}
      <div>
        <label className="block text-sm text-dark-200 mb-2">Skin Tone</label>
        <div className="flex gap-2 flex-wrap">
          {SKIN_TONES.map((tone, i) => (
            <button
              key={tone}
              onClick={() => {
                setSelectedSkin(i);
                updateMeasurements({ skinTone: tone } as any);
              }}
              className={`w-10 h-10 rounded-full transition-all ${
                selectedSkin === i ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-dark-700 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: tone }}
            />
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <label className="block text-sm text-dark-200 mb-2">Hair Color</label>
        <div className="flex gap-2 flex-wrap">
          {HAIR_COLORS.map((color, i) => (
            <button
              key={color.hex}
              onClick={() => setSelectedHair(i)}
              className={`w-10 h-10 rounded-full transition-all ${
                selectedHair === i ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-dark-700 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Eye Color */}
      <div>
        <label className="block text-sm text-dark-200 mb-2">Eye Color</label>
        <div className="flex gap-2 flex-wrap">
          {EYE_COLORS.map((color, i) => (
            <button
              key={color.hex}
              onClick={() => setSelectedEye(i)}
              className={`w-10 h-10 rounded-full transition-all ${
                selectedEye === i ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-dark-700 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div>
        <label className="block text-sm text-dark-200 mb-2">Hair Style</label>
        <div className="flex gap-2 flex-wrap">
          {HAIR_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                selectedStyle === style
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-600 text-dark-200 hover:bg-dark-500'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-sm text-dark-200 mb-2">Body Type</label>
        <div className="flex gap-2 flex-wrap">
          {BODY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedBody(type)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                selectedBody === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-600 text-dark-200 hover:bg-dark-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
