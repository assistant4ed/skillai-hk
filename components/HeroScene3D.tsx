"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 發光粒子場
function ParticleField({ count = 500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const palette = [
      new THREE.Color('#00D9FF'), // 電藍
      new THREE.Color('#C026D3'), // 紫紅
      new THREE.Color('#3B82F6'), // 藍
      new THREE.Color('#8B5CF6'), // 紫
    ];
    
    for (let i = 0; i < count; i++) {
      // 球形分佈
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 8;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 3 + 1;
    }
    
    return { positions, colors, sizes };
  }, [count]);
  
  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.03;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 中央發光球體 - 代表 AI 核心
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.z = t * 0.15;
    glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
  });
  
  return (
    <group>
      {/* 外層光暈 */}
      <Sphere ref={glowRef} args={[1.8, 32, 32]}>
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* 主球體 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#0A1929"
            emissive="#00D9FF"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
            distort={0.3}
            speed={3}
          />
        </Sphere>
      </Float>
      
      {/* 內核發光 */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.15}
        />
      </Sphere>
    </group>
  );
}

// 環繞的軌道環
function OrbitalRing({ radius, speed, color, thickness = 0.02 }: {
  radius: number;
  speed: number;
  color: string;
  thickness?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed;
  });
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// 飄浮的技能節點
function SkillNode({ position, color, label }: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.2;
  });
  
  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

// 鼠標跟隨相機
function CameraRig() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.1) * 0.5;
    camera.position.y = Math.cos(t * 0.1) * 0.3;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// 主 3D 場景
function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00D9FF" />
      <pointLight position={[-5, -3, 5]} intensity={0.5} color="#C026D3" />
      <pointLight position={[0, 5, -5]} intensity={0.3} color="#3B82F6" />
      
      {/* 粒子場 */}
      <ParticleField count={600} />
      
      {/* 中央 AI 核心球 */}
      <CoreSphere />
      
      {/* 軌道環 */}
      <OrbitalRing radius={2.5} speed={0.3} color="#00D9FF" thickness={0.015} />
      <OrbitalRing radius={3.2} speed={-0.2} color="#C026D3" thickness={0.01} />
      <OrbitalRing radius={4.0} speed={0.15} color="#3B82F6" thickness={0.008} />
      
      {/* 技能節點 */}
      <SkillNode position={[2.5, 0, 0]} color="#00D9FF" label="AI" />
      <SkillNode position={[-2, 1.5, 1]} color="#C026D3" label="ML" />
      <SkillNode position={[1, -2, 2]} color="#3B82F6" label="Data" />
      <SkillNode position={[-1.5, 0.5, -2]} color="#8B5CF6" label="NLP" />
      <SkillNode position={[0, 2.5, -1]} color="#10B981" label="CV" />
      <SkillNode position={[2, -1, -1.5]} color="#F59E0B" label="LLM" />
      
      <CameraRig />
      
      {/* 霧效果 */}
      <fog attach="fog" args={['#0A1929', 8, 20]} />
    </>
  );
}

// 靜態漸變 fallback（WebGL 不可用時）
function StaticFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0A1929] via-[#0D1F2D] to-[#0A1929]">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 40%, rgba(0,217,255,0.08), transparent 50%),
          radial-gradient(circle at 80% 60%, rgba(192,38,211,0.08), transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(59,130,246,0.06), transparent 40%)
        `
      }} />
    </div>
  );
}

// 檢查 WebGL 可用性
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// 導出的 3D Hero 組件
export default function HeroScene3D() {
  const [mounted, setMounted] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    setWebglOk(isWebGLAvailable());
  }, []);
  
  if (!mounted || !webglOk) {
    return <StaticFallback />;
  }
  
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor('#0A1929', 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
