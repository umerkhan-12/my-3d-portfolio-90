import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Subtle floating particles
function ParticleField() {
  const count = 80;
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        cols[i * 3] = 0.29; cols[i * 3 + 1] = 0.87; cols[i * 3 + 2] = 0.5;
      } else if (colorChoice < 0.66) {
        cols[i * 3] = 0.22; cols[i * 3 + 1] = 0.74; cols[i * 3 + 2] = 0.97;
      } else {
        cols[i * 3] = 0.66; cols[i * 3 + 1] = 0.55; cols[i * 3 + 2] = 0.98;
      }
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        vertexColors
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Minimal grid
function SimpleGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial 
        color="#4ade80" 
        wireframe 
        transparent 
        opacity={0.05}
      />
    </mesh>
  );
}

export default function Scene3DSimple() {
  return (
    <div className="absolute inset-0 z-0 bg-transparent pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 60 }} 
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#4ade80" />
        <directionalLight position={[-5, -3, 5]} intensity={0.3} color="#38bdf8" />
        
        <ParticleField />
        <SimpleGrid />
      </Canvas>
    </div>
  );
}
