"use client";
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Voxel helper ── */
function Voxel({ position, color, size = 1 }: { position: [number, number, number]; color: string; size?: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[size * 0.95, size * 0.95, size * 0.95]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/* ── Voxel Mascot Character ── */
function VoxelMascot({ animate = 'idle' }: { animate?: 'idle' | 'wave' | 'teach' | 'think' | 'celebrate' }) {
  const group = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);

  const skin = '#E8C39E';
  const hair = '#2C1810';
  const white = '#FFFFFF';
  const black = '#1A1A1A';
  const blue = '#4169E1';
  const shirt = '#F5F5F5';
  const pants = '#4A5568';
  const shoe = '#2D3748';
  const glassFrame = '#333333';

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();

    // Idle breathing
    group.current.position.y = Math.sin(t * 1.2) * 0.08;

    // Animation variants
    if (animate === 'wave' && rightArm.current) {
      rightArm.current.rotation.z = -0.3 + Math.sin(t * 3) * 0.4;
      rightArm.current.rotation.x = -1.2;
    } else if (animate === 'teach' && rightArm.current) {
      rightArm.current.rotation.z = -0.8 + Math.sin(t * 1.5) * 0.15;
      rightArm.current.rotation.x = -0.6;
    } else if (animate === 'think') {
      if (rightArm.current) {
        rightArm.current.rotation.z = -0.5;
        rightArm.current.rotation.x = -1.0;
      }
      group.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    } else if (animate === 'celebrate') {
      if (rightArm.current) {
        rightArm.current.rotation.z = -0.5 + Math.sin(t * 4) * 0.6;
        rightArm.current.rotation.x = -1.5;
      }
      if (leftArm.current) {
        leftArm.current.rotation.z = 0.5 + Math.sin(t * 4 + Math.PI) * 0.6;
        leftArm.current.rotation.x = -1.5;
      }
      group.current.position.y = Math.abs(Math.sin(t * 3)) * 0.3;
    } else {
      // idle
      if (rightArm.current) {
        rightArm.current.rotation.z = Math.sin(t * 0.8) * 0.05;
        rightArm.current.rotation.x = 0;
      }
      if (leftArm.current) {
        leftArm.current.rotation.z = Math.sin(t * 0.8 + Math.PI) * 0.05;
        leftArm.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={group} scale={0.28}>
      <group ref={body}>
        {/* ── Hair (top) ── */}
        {[[-1,8,0],[0,8,0],[1,8,0],[-1,8,-1],[0,8,-1],[1,8,-1],
          [-2,7.5,0],[2,7.5,0],[-1,8.5,0],[0,8.5,0],[1,8.5,0],[0,9,0]
        ].map((p, i) => <Voxel key={`h${i}`} position={p as [number,number,number]} color={hair} />)}

        {/* ── Head / Face ── */}
        {/* Face front */}
        {[[-1,7,1],[0,7,1],[1,7,1],[-1,6,1],[0,6,1],[1,6,1],[-1,5,1],[0,5,1],[1,5,1]].map((p, i) =>
          <Voxel key={`f${i}`} position={p as [number,number,number]} color={skin} />)}
        {/* Face sides */}
        {[[-2,7,0],[-2,6,0],[-2,5,0],[2,7,0],[2,6,0],[2,5,0]].map((p, i) =>
          <Voxel key={`fs${i}`} position={p as [number,number,number]} color={skin} />)}
        {/* Head back */}
        {[[-1,7,-1],[0,7,-1],[1,7,-1],[-1,6,-1],[0,6,-1],[1,6,-1]].map((p, i) =>
          <Voxel key={`hb${i}`} position={p as [number,number,number]} color={hair} />)}

        {/* ── Eyes (dark) ── */}
        <Voxel position={[-1, 7, 1.5]} color={black} size={0.6} />
        <Voxel position={[1, 7, 1.5]} color={black} size={0.6} />

        {/* ── Glasses frames ── */}
        {[[-2,7,1.3],[-0.3,7,1.3],[0.3,7,1.3],[2,7,1.3],[-2,7.5,1.3],[2,7.5,1.3],[-2,6.5,1.3],[2,6.5,1.3]].map((p, i) =>
          <Voxel key={`g${i}`} position={p as [number,number,number]} color={glassFrame} size={0.35} />)}

        {/* ── Mouth (smile) ── */}
        <Voxel position={[-0.5, 5.5, 1.3]} color={'#C0392B'} size={0.4} />
        <Voxel position={[0, 5.3, 1.3]} color={'#E74C3C'} size={0.4} />
        <Voxel position={[0.5, 5.5, 1.3]} color={'#C0392B'} size={0.4} />

        {/* ── Nose ── */}
        <Voxel position={[0, 6, 1.5]} color={skin} size={0.5} />

        {/* ── Body / T-shirt ── */}
        {[[-2,4,0],[-1,4,0],[0,4,0],[1,4,0],[2,4,0],
          [-2,3,0],[-1,3,0],[0,3,0],[1,3,0],[2,3,0],
          [-2,2,0],[-1,2,0],[0,2,0],[1,2,0],[2,2,0],
          [-2,1,0],[-1,1,0],[0,1,0],[1,1,0],[2,1,0],
          // front
          [-2,4,1],[-1,4,1],[0,4,1],[1,4,1],[2,4,1],
          [-2,3,1],[-1,3,1],[0,3,1],[1,3,1],[2,3,1],
          [-2,2,1],[-1,2,1],[0,2,1],[1,2,1],[2,2,1],
          [-2,1,1],[-1,1,1],[0,1,1],[1,1,1],[2,1,1],
        ].map((p, i) => <Voxel key={`b${i}`} position={p as [number,number,number]} color={shirt} />)}

        {/* ── "SkillAI" text on shirt (simplified as blue blocks) ── */}
        {[[-1.5,3,1.5],[-0.5,3,1.5],[0.5,3,1.5],[1.5,3,1.5]].map((p, i) =>
          <Voxel key={`txt${i}`} position={p as [number,number,number]} color={blue} size={0.4} />)}
        {[[-1,2.5,1.5],[0,2.5,1.5],[1,2.5,1.5]].map((p, i) =>
          <Voxel key={`tx2${i}`} position={p as [number,number,number]} color={blue} size={0.35} />)}

        {/* ── Arms ── */}
        <group ref={rightArm} position={[3, 4, 0.5]}>
          {[[0,0,0],[0,-1,0],[0,-2,0]].map((p, i) =>
            <Voxel key={`ra${i}`} position={p as [number,number,number]} color={skin} />)}
        </group>
        <group ref={leftArm} position={[-3, 4, 0.5]}>
          {[[0,0,0],[0,-1,0],[0,-2,0]].map((p, i) =>
            <Voxel key={`la${i}`} position={p as [number,number,number]} color={skin} />)}
        </group>

        {/* ── Pants ── */}
        {[[-1,0,0],[0,0,0],[1,0,0],[-1,0,1],[0,0,1],[1,0,1],
          [-1,-1,0],[0,-1,0],[1,-1,0],[-1,-1,1],[0,-1,1],[1,-1,1],
        ].map((p, i) => <Voxel key={`p${i}`} position={p as [number,number,number]} color={pants} />)}

        {/* ── Shoes ── */}
        {[[-1,-2,0],[0,-2,0],[-1,-2,1],[0,-2,1],
          [1,-2,0],[1,-2,1],[2,-2,1],[-2,-2,1],
        ].map((p, i) => <Voxel key={`s${i}`} position={p as [number,number,number]} color={shoe} />)}
      </group>
    </group>
  );
}

/* ── Floating AI Icons (3D) ── */
function AIFloatingElements() {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 1.2) * 0.4 + (i % 2 === 0 ? 2 : -1);
      child.rotation.y = t * 0.3 + i;
      child.rotation.x = Math.sin(t * 0.2 + i) * 0.3;
    });
  });

  return (
    <group ref={group}>
      {/* Laptop */}
      <group position={[-3.5, 1, -1]}>
        <mesh><boxGeometry args={[1.2, 0.08, 0.8]} /><meshStandardMaterial color="#718096" metalness={0.5} /></mesh>
        <mesh position={[0, 0.4, -0.35]} rotation={[-0.4, 0, 0]}><boxGeometry args={[1.2, 0.8, 0.05]} /><meshStandardMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={0.3} /></mesh>
      </group>
      {/* Gear / Settings */}
      <mesh position={[3.5, 2, -0.5]}>
        <torusGeometry args={[0.35, 0.1, 8, 6]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.3} />
      </mesh>
      {/* Brain / AI chip */}
      <mesh position={[3, -1, 0.5]}>
        <boxGeometry args={[0.8, 0.8, 0.15]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.2} />
      </mesh>
      {/* Code brackets */}
      <mesh position={[-3, -1.5, 0]}>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial color="#7C3AED" />
      </mesh>
      <mesh position={[-2.7, -1.5, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#7C3AED" />
      </mesh>
      {/* Lightning bolt */}
      <mesh position={[2, 2.5, 0.5]}>
        <boxGeometry args={[0.2, 0.6, 0.15]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[2.15, 2.1, 0.5]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.6, 0.15]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/* ── Particle field (background) ── */
function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const a = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) { a[i*3]=(Math.random()-0.5)*18; a[i*3+1]=(Math.random()-0.5)*12; a[i*3+2]=(Math.random()-0.5)*8-4; }
    return a;
  }, []);
  useFrame(({ clock }) => { if (ref.current) { ref.current.rotation.y = clock.getElapsedTime() * 0.015; }});
  return (<points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={0.03} color="#4169E1" transparent opacity={0.4} sizeAttenuation /></points>);
}

/* ── Exported Scenes ── */
interface SceneProps { variant?: 'hero' | 'teach' | 'think' | 'celebrate' | 'wave'; }

function SceneContent({ variant = 'hero' }: SceneProps) {
  const animMap: Record<string, 'idle' | 'wave' | 'teach' | 'think' | 'celebrate'> = {
    hero: 'idle', teach: 'teach', think: 'think', celebrate: 'celebrate', wave: 'wave',
  };
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-3, 3, 3]} intensity={0.3} color="#4169E1" />
      <Particles />
      {variant === 'hero' && <AIFloatingElements />}
      <VoxelMascot animate={animMap[variant] || 'idle'} />
    </>
  );
}

function isWebGLAvailable() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch { return false; }
}

export default function Mascot3D({ variant = 'hero', height = '400px', className = '' }: SceneProps & { height?: string; className?: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(isWebGLAvailable()), []);
  if (!ok) return (
    <div className={`flex items-center justify-center relative ${className}`} style={{ height }}>
      {/* CSS fallback with mascot image + floating blocks */}
      <div className="relative">
        <div className="absolute -inset-6 bg-gradient-to-br from-[#4169E1]/15 to-[#7C3AED]/10 rounded-[2rem] blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
        <img src="/mascot.jpg" alt="SkillAI Mascot" className="relative rounded-2xl shadow-xl w-full max-w-[240px]" style={{ animation: 'float 4s ease-in-out infinite' }} />
        {/* Floating decorative blocks */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FF6B35] rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xs" style={{ animation: 'float 3s ease-in-out infinite' }}>AI</div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#10B981] rounded-md shadow-lg" style={{ animation: 'float 3.5s ease-in-out infinite 0.5s' }} />
        <div className="absolute top-1/3 -right-6 w-5 h-5 bg-[#7C3AED] rounded-sm shadow-lg opacity-70" style={{ animation: 'float 4s ease-in-out infinite 1s' }} />
        <div className="absolute -top-2 right-1/4 w-4 h-4 bg-[#4169E1] rounded-sm shadow-lg opacity-50" style={{ animation: 'float 3s ease-in-out infinite 1.5s' }} />
      </div>
    </div>
  );
  return (
    <div className={className} style={{ height }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 35 }} dpr={[1, 1.5]} frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
        <SceneContent variant={variant} />
      </Canvas>
    </div>
  );
}
