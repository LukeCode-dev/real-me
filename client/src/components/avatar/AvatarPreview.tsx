import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAvatarStore } from '../../hooks/useStore';

function HumanoidAvatar({ measurements }: { measurements: any }) {
  const groupRef = useRef<THREE.Group>(null);

  // Scale factors based on measurements
  const heightScale = (measurements.height || 170) / 170;
  const chestScale = (measurements.chest || 95) / 95;
  const waistScale = (measurements.waist || 80) / 80;
  const hipScale = (measurements.hips || 95) / 95;
  const shoulderScale = (measurements.shoulders || 45) / 45;

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle idle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
  });

  const skinColor = measurements.skinTone || '#d4a574';

  return (
    <group ref={groupRef} scale={[1, heightScale, 1]} position={[0, -1.2, 0]}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.12, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Torso - upper (chest) */}
      <mesh position={[0, 1.25, 0]} scale={[shoulderScale, 1, chestScale * 0.7]}>
        <boxGeometry args={[0.38, 0.28, 0.2]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Torso - mid (waist) */}
      <mesh position={[0, 1.0, 0]} scale={[waistScale * 0.85, 1, waistScale * 0.65]}>
        <boxGeometry args={[0.32, 0.22, 0.18]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 0.8, 0]} scale={[hipScale * 0.9, 1, hipScale * 0.7]}>
        <boxGeometry args={[0.36, 0.18, 0.2]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Left arm */}
      <group position={[-0.24 * shoulderScale, 1.3, 0]}>
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[-0.02, -0.42, 0]}>
          <capsuleGeometry args={[0.035, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.24 * shoulderScale, 1.3, 0]}>
        <mesh position={[0, -0.15, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.02, -0.42, 0]}>
          <capsuleGeometry args={[0.035, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Left leg */}
      <group position={[-0.1, 0.7, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.1, 0.7, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Eyes */}
      <mesh position={[-0.04, 1.68, 0.1]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.04, 1.68, 0.1]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
}

function TurntablePlatform() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.6, 0.6, 0.02, 64]} />
      <meshStandardMaterial
        color="#1a1b1e"
        metalness={0.8}
        roughness={0.2}
        emissive="#00d4ff"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

export default function AvatarPreview() {
  const { measurements } = useAvatarStore();

  return (
    <div className="card avatar-glow">
      <h3 className="font-display text-xl font-semibold mb-4">Your Digital Twin</h3>
      <div className="rounded-xl overflow-hidden bg-dark-800" style={{ height: '500px' }}>
        <Canvas camera={{ position: [0, 0.5, 2.5], fov: 45 }} shadows>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#b249f8" />
          <pointLight position={[0, 2, 1]} intensity={0.5} color="#00d4ff" />

          <HumanoidAvatar measurements={measurements} />
          <TurntablePlatform />
          <ContactShadows position={[0, -1.22, 0]} opacity={0.5} blur={2} />

          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            minDistance={1.5}
            maxDistance={4}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      <div className="mt-4 flex gap-2 justify-center">
        <button className="px-4 py-2 rounded-lg bg-dark-600 text-sm hover:bg-dark-500 transition-colors">
          360° View
        </button>
        <button className="px-4 py-2 rounded-lg bg-dark-600 text-sm hover:bg-dark-500 transition-colors">
          Pose Mode
        </button>
        <button className="px-4 py-2 rounded-lg bg-dark-600 text-sm hover:bg-dark-500 transition-colors">
          Download 3D
        </button>
      </div>
    </div>
  );
}
