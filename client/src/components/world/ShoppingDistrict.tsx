import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface StoreBuilding {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  accentColor: string;
  storeId: string;
}

const STORES: StoreBuilding[] = [
  // Fashion District (North)
  { name: 'AETHON', position: [-15, 4, -25], size: [10, 8, 8], color: '#1a1a2e', accentColor: '#ff6bcb', storeId: 'aethon' },
  { name: 'NOVA STYLE', position: [0, 5, -28], size: [12, 10, 8], color: '#16213e', accentColor: '#00d4ff', storeId: 'nova-style' },
  { name: 'CIPHER', position: [15, 4, -25], size: [10, 8, 8], color: '#1a1a2e', accentColor: '#b249f8', storeId: 'cipher' },

  // Luxury Avenue (East)
  { name: 'OBSIDIAN', position: [28, 6, -10], size: [8, 12, 10], color: '#0f0f1a', accentColor: '#d4af37', storeId: 'obsidian' },
  { name: 'PRISM', position: [30, 5, 5], size: [8, 10, 10], color: '#141428', accentColor: '#e0e0e0', storeId: 'prism' },
  { name: 'AURELIUS', position: [28, 6, 20], size: [8, 12, 10], color: '#0f0f1a', accentColor: '#c9a96e', storeId: 'aurelius' },

  // Streetwear Hub (South)
  { name: 'FLUX', position: [-12, 3.5, 25], size: [8, 7, 8], color: '#1e1e2e', accentColor: '#05ffa1', storeId: 'flux' },
  { name: 'RIOT', position: [0, 4, 28], size: [10, 8, 8], color: '#2a1a2e', accentColor: '#ff4444', storeId: 'riot' },
  { name: 'VORTEX', position: [12, 3.5, 25], size: [8, 7, 8], color: '#1e1e2e', accentColor: '#ffaa00', storeId: 'vortex' },

  // Shoe Gallery (West)
  { name: 'SOLE', position: [-28, 4, -8], size: [8, 8, 12], color: '#1a1528', accentColor: '#00d4ff', storeId: 'sole' },
  { name: 'STRIDE', position: [-30, 5, 8], size: [8, 10, 12], color: '#0f1520', accentColor: '#b249f8', storeId: 'stride' },
];

function StoreFront({ store }: { store: StoreBuilding }) {
  const signRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (signRef.current) {
      const material = signRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 2 + store.position[0]) * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 1.5 + store.position[2]) * 0.5;
    }
  });

  return (
    <group position={store.position}>
      {/* Main building */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={store.size} />
        <meshStandardMaterial
          color={store.color}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Glass front */}
      <mesh position={[0, -store.size[1] * 0.15, store.size[2] / 2 + 0.01]}>
        <planeGeometry args={[store.size[0] * 0.8, store.size[1] * 0.5]} />
        <meshStandardMaterial
          color="#111133"
          metalness={1}
          roughness={0}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Neon sign */}
      <mesh
        ref={signRef}
        position={[0, store.size[1] * 0.3, store.size[2] / 2 + 0.1]}
      >
        <planeGeometry args={[store.size[0] * 0.7, 1.2]} />
        <meshStandardMaterial
          color={store.accentColor}
          emissive={store.accentColor}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Accent light strips */}
      <mesh position={[store.size[0] / 2 - 0.05, 0, store.size[2] / 2]}>
        <boxGeometry args={[0.1, store.size[1], 0.1]} />
        <meshStandardMaterial
          color={store.accentColor}
          emissive={store.accentColor}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-store.size[0] / 2 + 0.05, 0, store.size[2] / 2]}>
        <boxGeometry args={[0.1, store.size[1], 0.1]} />
        <meshStandardMaterial
          color={store.accentColor}
          emissive={store.accentColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, -store.size[1] / 2 + 1.5, store.size[2] / 2 + 0.05]}>
        <planeGeometry args={[2.5, 3]} />
        <meshStandardMaterial
          color="#000000"
          metalness={1}
          roughness={0}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Entrance glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0, store.size[2] / 2 + 2]}
        color={store.accentColor}
        intensity={2}
        distance={15}
        decay={2}
      />

      {/* Floating particles near entrance */}
      <Sparkles
        count={20}
        scale={[store.size[0], 3, 3]}
        position={[0, -1, store.size[2] / 2 + 1]}
        size={1.5}
        speed={0.2}
        color={store.accentColor}
        opacity={0.4}
      />
    </group>
  );
}

function Pathway({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const length = Math.sqrt((to[0] - from[0]) ** 2 + (to[2] - from[2]) ** 2);
  const angle = Math.atan2(to[0] - from[0], to[2] - from[2]);

  return (
    <mesh position={[midX, 0.02, midZ]} rotation={[- Math.PI / 2, 0, angle]}>
      <planeGeometry args={[3, length]} />
      <meshStandardMaterial
        color="#0d0d1a"
        emissive="#00d4ff"
        emissiveIntensity={0.05}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 6, 8]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight position={[0, 6, 0]} color="#00d4ff" intensity={1.5} distance={15} decay={2} />
    </group>
  );
}

export default function ShoppingDistrict() {
  return (
    <group>
      {STORES.map((store) => (
        <StoreFront key={store.storeId} store={store} />
      ))}

      {/* Pathways connecting plaza to districts */}
      <Pathway from={[0, 0, 0]} to={[0, 0, -25]} />
      <Pathway from={[0, 0, 0]} to={[28, 0, 0]} />
      <Pathway from={[0, 0, 0]} to={[0, 0, 25]} />
      <Pathway from={[0, 0, 0]} to={[-28, 0, 0]} />

      {/* Street lamps */}
      {[
        [-6, 0, -12], [6, 0, -12],
        [-6, 0, -20], [6, 0, -20],
        [14, 0, -6], [14, 0, 6],
        [22, 0, -6], [22, 0, 6],
        [-6, 0, 12], [6, 0, 12],
        [-6, 0, 20], [6, 0, 20],
        [-14, 0, -6], [-14, 0, 6],
        [-22, 0, -6], [-22, 0, 6],
      ].map((pos, i) => (
        <StreetLamp key={i} position={pos as [number, number, number]} />
      ))}
    </group>
  );
}
