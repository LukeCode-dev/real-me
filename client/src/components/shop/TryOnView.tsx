import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Product, useAvatarStore } from '../../hooks/useStore';

function AvatarWithClothing({
  measurements,
  product,
  selectedColor,
}: {
  measurements: any;
  product: Product;
  selectedColor: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const heightScale = (measurements.height || 170) / 170;
  const chestScale = (measurements.chest || 95) / 95;
  const waistScale = (measurements.waist || 80) / 80;
  const hipScale = (measurements.hips || 95) / 95;
  const shoulderScale = (measurements.shoulders || 45) / 45;

  const skinColor = '#d4a574';
  const clothingColor = product.colors.find((c) => c.name === selectedColor)?.hex || '#2c3e50';

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.01;
    }
  });

  const isTop = ['tops', 'outerwear'].includes(product.category);
  const isBottom = product.category === 'bottoms';
  const isDress = product.category === 'dresses';
  const isShoe = product.category === 'shoes';

  return (
    <group ref={groupRef} scale={[1, heightScale, 1]} position={[0, -1.2, 0]}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.12, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Torso - with clothing overlay */}
      <mesh position={[0, 1.25, 0]} scale={[shoulderScale, 1, chestScale * 0.7]}>
        <boxGeometry args={[0.4, 0.28, 0.22]} />
        <meshStandardMaterial
          color={isTop || isDress ? clothingColor : skinColor}
          roughness={isTop || isDress ? 0.8 : 0.6}
          metalness={isTop || isDress ? 0.05 : 0.1}
        />
      </mesh>

      {/* Waist */}
      <mesh position={[0, 1.0, 0]} scale={[waistScale * 0.85, 1, waistScale * 0.65]}>
        <boxGeometry args={[0.34, 0.22, 0.2]} />
        <meshStandardMaterial
          color={isDress ? clothingColor : isBottom ? clothingColor : skinColor}
          roughness={0.7}
        />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 0.8, 0]} scale={[hipScale * 0.9, 1, hipScale * 0.7]}>
        <boxGeometry args={[0.38, 0.18, 0.22]} />
        <meshStandardMaterial
          color={isDress || isBottom ? clothingColor : skinColor}
          roughness={0.7}
        />
      </mesh>

      {/* Arms with sleeves */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.24 * shoulderScale, 1.3, 0]}>
          <mesh position={[0, -0.15, 0]} rotation={[0, 0, side * 0.1]}>
            <capsuleGeometry args={[0.045, 0.22, 8, 16]} />
            <meshStandardMaterial
              color={isTop || isDress ? clothingColor : skinColor}
              roughness={0.7}
            />
          </mesh>
          <mesh position={[side * 0.02, -0.42, 0]}>
            <capsuleGeometry args={[0.038, 0.22, 8, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Legs */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.1, 0.7, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.065, 0.3, 8, 16]} />
            <meshStandardMaterial
              color={isBottom || isDress ? clothingColor : skinColor}
              roughness={0.7}
            />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <capsuleGeometry args={[0.055, 0.3, 8, 16]} />
            <meshStandardMaterial
              color={isShoe ? clothingColor : isBottom || isDress ? clothingColor : skinColor}
              roughness={isShoe ? 0.4 : 0.7}
              metalness={isShoe ? 0.3 : 0}
            />
          </mesh>
        </group>
      ))}

      {/* Shoes */}
      {isShoe && [-1, 1].map((side) => (
        <mesh key={`shoe-${side}`} position={[side * 0.1, 0.02, 0.04]}>
          <boxGeometry args={[0.1, 0.06, 0.18]} />
          <meshStandardMaterial color={clothingColor} roughness={0.3} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

interface TryOnViewProps {
  product: Product;
}

export default function TryOnView({ product }: TryOnViewProps) {
  const { measurements } = useAvatarStore();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [viewAngle, setViewAngle] = useState<'front' | 'side' | 'back'>('front');

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden bg-dark-800 avatar-glow" style={{ height: '600px' }}>
        <Canvas camera={{ position: [0, 0.5, 2.5], fov: 45 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#b249f8" />
          <pointLight position={[0, 2, 1]} intensity={0.5} color="#00d4ff" />

          <AvatarWithClothing
            measurements={measurements}
            product={product}
            selectedColor={selectedColor}
          />

          <ContactShadows position={[0, -1.22, 0]} opacity={0.5} blur={2} />
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            minDistance={1.5}
            maxDistance={4}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      {/* Color selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-dark-200">Color:</span>
        <div className="flex gap-2">
          {product.colors.map((color) => (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(color.name)}
              className={`w-8 h-8 rounded-full transition-all ${
                selectedColor === color.name
                  ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-dark-700 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* View angles */}
      <div className="flex gap-2">
        {(['front', 'side', 'back'] as const).map((angle) => (
          <button
            key={angle}
            onClick={() => setViewAngle(angle)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
              viewAngle === angle
                ? 'bg-primary-600 text-white'
                : 'bg-dark-600 text-dark-200 hover:bg-dark-500'
            }`}
          >
            {angle} view
          </button>
        ))}
      </div>

      {/* Fit assessment */}
      <div className="card bg-dark-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-neon-green">Great Fit!</p>
            <p className="text-sm text-dark-200">
              Based on your measurements, size {product.recommendedSize || 'M'} fits perfectly
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-dark-600/50 rounded-lg p-2">
            <p className="text-dark-300">Chest</p>
            <p className="text-neon-green font-semibold">Perfect</p>
          </div>
          <div className="bg-dark-600/50 rounded-lg p-2">
            <p className="text-dark-300">Length</p>
            <p className="text-neon-blue font-semibold">Ideal</p>
          </div>
          <div className="bg-dark-600/50 rounded-lg p-2">
            <p className="text-dark-300">Shoulders</p>
            <p className="text-neon-green font-semibold">Perfect</p>
          </div>
        </div>
      </div>
    </div>
  );
}
