import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function HeroAvatar() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, -0.5, 0]} scale={2}>
        {/* Stylized avatar silhouette */}
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} wireframe />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <capsuleGeometry args={[0.16, 0.4, 8, 16]} />
          <meshStandardMaterial color="#b249f8" emissive="#b249f8" emissiveIntensity={0.3} wireframe />
        </mesh>
        <mesh position={[-0.1, 0.5, 0]}>
          <capsuleGeometry args={[0.06, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ff6bcb" emissive="#ff6bcb" emissiveIntensity={0.3} wireframe />
        </mesh>
        <mesh position={[0.1, 0.5, 0]}>
          <capsuleGeometry args={[0.06, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ff6bcb" emissive="#ff6bcb" emissiveIntensity={0.3} wireframe />
        </mesh>
        <mesh position={[-0.22, 1.15, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.04, 0.35, 8, 16]} />
          <meshStandardMaterial color="#05ffa1" emissive="#05ffa1" emissiveIntensity={0.3} wireframe />
        </mesh>
        <mesh position={[0.22, 1.15, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.04, 0.35, 8, 16]} />
          <meshStandardMaterial color="#05ffa1" emissive="#05ffa1" emissiveIntensity={0.3} wireframe />
        </mesh>

        {/* Scanning rings */}
        {[0.5, 1.0, 1.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25 - i * 0.02, 0.005, 16, 64]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={2}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}

        <Sparkles count={50} scale={2} size={2} speed={0.3} color="#00d4ff" />
      </group>
    </Float>
  );
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 3, 2]} intensity={1} color="#00d4ff" />
      <pointLight position={[-2, 2, -1]} intensity={0.5} color="#b249f8" />
      <Stars radius={50} depth={50} count={2000} factor={4} fade />
      <HeroAvatar />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}

const FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
    title: 'Body Scan Technology',
    description: 'Our AI creates an exact 3D replica of your body from just a few photos. Every measurement, every curve — precisely captured.',
    color: 'from-neon-blue to-primary-500',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
    title: 'Immersive Virtual World',
    description: 'Explore a stunning metaverse with virtual shopping districts, boutiques, and malls. Walk through stores as if you were really there.',
    color: 'from-neon-purple to-neon-pink',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Virtual Try-On',
    description: 'See exactly how clothes look on YOUR body. No more wrong sizes, no more returns. The fit is real because YOUR avatar is real.',
    color: 'from-neon-green to-neon-blue',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    title: 'Real-World Delivery',
    description: 'Buy in the metaverse, receive at your door. Physical products from real brands, shipped directly to your address.',
    color: 'from-neon-pink to-yellow-500',
  },
];

const STATS = [
  { value: '99.2%', label: 'Size Accuracy' },
  { value: '< 2min', label: 'Avatar Creation' },
  { value: '500+', label: 'Partner Brands' },
  { value: '0%', label: 'Returns Rate Goal' },
];

export default function LandingPage() {
  return (
    <div className="bg-dark-900 min-h-screen">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-display font-bold">RM</span>
            </div>
            <span className="font-display font-bold text-2xl gradient-text">Real Me</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-dark-100 hover:text-white transition-colors">Sign In</Link>
            <Link to="/create-avatar" className="btn-primary">
              Create Your Avatar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-sm text-dark-100">The Future of Shopping is Here</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              Shop as the
              <br />
              <span className="gradient-text">Real You</span>
            </h1>

            <p className="text-lg text-dark-200 max-w-xl mb-8 leading-relaxed">
              Create your photorealistic digital twin and explore a virtual world where you can
              try on clothes, find your perfect fit, and buy products that ship to your real-world address.
              Never pick the wrong size again.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/create-avatar" className="btn-primary text-lg px-8 py-4">
                Create Your Digital Twin
              </Link>
              <Link to="/world" className="btn-secondary text-lg px-8 py-4">
                Explore the World
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/5">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-display font-bold neon-text">{value}</p>
                  <p className="text-xs text-dark-300 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-6 h-10 rounded-full border-2 border-dark-400 flex items-start justify-center p-2">
            <div className="w-1 h-3 rounded-full bg-neon-blue animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              How <span className="gradient-text">Real Me</span> Works
            </h2>
            <p className="text-dark-200 max-w-2xl mx-auto">
              From body scan to delivery — a seamless experience that bridges the virtual and physical worlds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map(({ icon, title, description, color }, i) => (
              <div key={i} className="card group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
                <p className="text-dark-200 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="py-24 px-6 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center mb-16">
            Three Steps to <span className="gradient-text">Perfect Fit</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Scan Your Body',
                desc: 'Use your camera or upload photos. Our AI extracts precise measurements and generates your 3D digital twin in under 2 minutes.',
              },
              {
                step: '02',
                title: 'Explore & Try On',
                desc: 'Enter the virtual world as yourself. Browse stores, pick items, and see exactly how they fit on your real body shape.',
              },
              {
                step: '03',
                title: 'Buy & Receive',
                desc: 'Love what you see? Purchase with confidence. Real products from real brands, delivered to your doorstep.',
              },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl font-display font-bold gradient-text mb-4 opacity-50">{step}</div>
                <h3 className="font-display text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-dark-200 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-display font-bold mb-6">
            Ready to Meet the <span className="gradient-text">Real You</span>?
          </h2>
          <p className="text-lg text-dark-200 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have already created their digital twins and are shopping
            with 100% confidence in their size and fit.
          </p>
          <Link to="/create-avatar" className="btn-primary text-xl px-10 py-5 inline-block">
            Get Started — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">RM</span>
            </div>
            <span className="font-display font-semibold gradient-text">Real Me</span>
          </div>
          <div className="flex gap-8 text-sm text-dark-300">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Brands</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-dark-400">&copy; 2026 Real Me. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
