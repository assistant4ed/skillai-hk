"use client";
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Floating pixel blocks ── */
function PixelBlocks() {
  const group = useRef<THREE.Group>(null!);
  const blocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8 - 2,
        ] as [number, number, number],
        scale: 0.15 + Math.random() * 0.35,
        speed: 0.2 + Math.random() * 0.6,
        rotSpeed: 0.3 + Math.random() * 0.8,
        color: ['#4169E1', '#5B83F5', '#7BA3FF', '#3358C8', '#FF6B35', '#10B981'][Math.floor(Math.random() * 6)],
        phase: Math.random() * Math.PI * 2,
        opacity: 0.7 + Math.random() * 0.3,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const b = blocks[i];
      child.position.y = b.pos[1] + Math.sin(t * b.speed + b.phase) * 0.6;
      child.rotation.x = t * b.rotSpeed * 0.3;
      child.rotation.z = t * b.rotSpeed * 0.2;
    });
  });

  return (
    <group ref={group}>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.pos} scale={b.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={b.color} transparent opacity={b.opacity} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Glowing center sphere ── */
function GlowSphere() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    mesh.current.scale.setScalar(1.8 + Math.sin(t * 0.8) * 0.15);
  });
  return (
    <mesh ref={mesh} position={[3.5, 0, -3]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4169E1" transparent opacity={0.12} roughness={1} />
    </mesh>
  );
}

/* ── Particle field ── */
function Particles() {
  const points = useRef<THREE.Points>(null!);
  const count = 600;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.getElapsedTime() * 0.02;
    points.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#4169E1" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ── Scene ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <Particles />
      <PixelBlocks />
      <GlowSphere />
    </>
  );
}

/* ── WebGL check ── */
function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch { return false; }
}

/* ── Fallback ── */
function StaticFallback() {
  return (
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse at 70% 30%, rgba(65,105,225,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(124,58,237,0.05) 0%, transparent 50%)',
    }}>
      {/* Floating CSS blocks as fallback */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute rounded-lg opacity-20 animate-pulse" style={{
          width: 8 + Math.random() * 20,
          height: 8 + Math.random() * 20,
          background: ['#4169E1', '#5B83F5', '#FF6B35', '#10B981'][i % 4],
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }} />
      ))}
    </div>
  );
}

export default function HeroBg3D() {
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(isWebGLAvailable()), []);

  if (!webgl) return <StaticFallback />;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}>
        <Scene />
      </Canvas>
    </div>
  );
}
