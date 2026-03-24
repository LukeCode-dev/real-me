import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls, Sky, Stars, Text3D, Float, MeshReflectorMaterial,
  useTexture, Sparkles, Cloud, Environment
} from '@react-three/drei';
import * as THREE from 'three';
import { useWorldStore } from '../../hooks/useStore';
import ShoppingDistrict from './ShoppingDistrict';
import PlayerAvatar from './PlayerAvatar';

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={0.8}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0a0f"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  );
}

function NeonGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      (gridRef.current.material as THREE.Material).opacity =
        0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[200, 100, '#00d4ff', '#1a1b3e']}
      position={[0, 0.01, 0]}
    />
  );
}

function FloatingTitle() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[0, 15, -40]}>
        <mesh>
          <boxGeometry args={[20, 5, 0.5]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function CentralPlaza() {
  return (
    <group position={[0, 0, 0]}>
      {/* Central fountain platform */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[8, 10, 0.3, 64]} />
        <meshStandardMaterial color="#1a1b2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Fountain rings */}
      {[3, 5, 7].map((radius, i) => (
        <mesh key={i} position={[0, 0.3 + i * 0.1, 0]}>
          <torusGeometry args={[radius, 0.05, 16, 64]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.5 + i * 0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Central hologram pedestal */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 2, 1.5, 32]} />
        <meshStandardMaterial color="#141420" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Holographic beacon */}
      <mesh position={[0, 5, 0]}>
        <coneGeometry args={[0.3, 6, 4]} />
        <meshStandardMaterial
          color="#b249f8"
          emissive="#b249f8"
          emissiveIntensity={3}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Directional signs */}
      {[
        { label: 'Fashion District', angle: 0, color: '#ff6bcb' },
        { label: 'Luxury Avenue', angle: Math.PI / 2, color: '#b249f8' },
        { label: 'Streetwear Hub', angle: Math.PI, color: '#05ffa1' },
        { label: 'Shoe Gallery', angle: (3 * Math.PI) / 2, color: '#00d4ff' },
      ].map(({ label, angle, color }, i) => (
        <group key={i} position={[Math.sin(angle) * 12, 3, Math.cos(angle) * 12]} rotation={[0, -angle + Math.PI, 0]}>
          <mesh>
            <boxGeometry args={[6, 1.2, 0.1]} />
            <meshStandardMaterial color="#1a1b2e" metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[5.8, 1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Ambient particles */}
      <Sparkles
        count={200}
        scale={30}
        size={2}
        speed={0.3}
        color="#00d4ff"
        opacity={0.5}
      />
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[20, 30, 10]} intensity={0.5} castShadow color="#eeeeff" />
      <pointLight position={[0, 8, 0]} intensity={2} color="#b249f8" distance={30} />
      <pointLight position={[20, 5, 20]} intensity={1} color="#00d4ff" distance={40} />
      <pointLight position={[-20, 5, -20]} intensity={1} color="#ff6bcb" distance={40} />
      <pointLight position={[20, 5, -20]} intensity={0.8} color="#05ffa1" distance={40} />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={1}
        color="#4c6ef5"
        castShadow
      />
    </>
  );
}

function SkyDome() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sky
        distance={450000}
        sunPosition={[0, -1, 0]}
        inclination={0}
        azimuth={0.25}
        rayleigh={0.1}
      />
      <fog attach="fog" args={['#0a0a1a', 30, 150]} />
    </>
  );
}

export default function VirtualWorldScene() {
  const { setIsLoading } = useWorldStore();

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 8, 25], fov: 60 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        onCreated={() => setIsLoading(false)}
      >
        <Lighting />
        <SkyDome />
        <GroundPlane />
        <NeonGrid />
        <CentralPlaza />
        <ShoppingDistrict />
        <PlayerAvatar />

        <Environment preset="night" />
        <OrbitControls
          enablePan
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={80}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
