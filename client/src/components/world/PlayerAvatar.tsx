import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAvatarStore } from '../../hooks/useStore';

export default function PlayerAvatar() {
  const groupRef = useRef<THREE.Group>(null);
  const { measurements } = useAvatarStore();

  const heightScale = ((measurements.height as number) || 170) / 170;
  const skinColor = '#d4a574';

  useFrame((state) => {
    if (groupRef.current) {
      // Idle breathing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 15]} scale={[1.8, 1.8 * heightScale, 1.8]}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.35, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.08, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.45, 8, 16]} />
        <meshStandardMaterial color="#0f0f1f" roughness={0.4} />
      </mesh>
      <mesh position={[0.08, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.45, 8, 16]} />
        <meshStandardMaterial color="#0f0f1f" roughness={0.4} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.22, 1.2, 0]} rotation={[0, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.04, 0.3, 8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 1.2, 0]} rotation={[0, 0, -0.15]} castShadow>
        <capsuleGeometry args={[0.04, 0.3, 8, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Nametag */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Player highlight ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.3, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
