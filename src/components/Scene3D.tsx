import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Desk
function Desk() {
  return (
    <group position={[0, -1.5, 0]}>
      {/* Desktop surface */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#2a2a3e" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Legs */}
      <mesh position={[-1.7, -0.4, 0.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[1.7, -0.4, 0.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-1.7, -0.4, -0.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[1.7, -0.4, -0.7]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}

// Monitor with glowing screen
function Monitor({ position, rotation = [0, 0, 0], screenColor = "#4ade80" }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  screenColor?: string;
}) {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Monitor base */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Monitor frame */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#0f0f1e" />
      </mesh>
      {/* Glowing screen */}
      <mesh ref={screenRef} position={[0, 0.3, 0.03]}>
        <boxGeometry args={[1.1, 0.7, 0.01]} />
        <meshStandardMaterial
          color={screenColor}
          emissive={screenColor}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      {/* Screen data effect */}
      <mesh position={[0, 0.3, 0.04]}>
        <planeGeometry args={[1, 0.6]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Keyboard
function Keyboard({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[-0.1, 0, 0]} castShadow>
      <boxGeometry args={[0.8, 0.05, 0.3]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.4} />
    </mesh>
  );
}

// Mouse
function Mouse({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.08, 0.04, 0.12]} />
      <meshStandardMaterial color="#2a2a3e" roughness={0.3} />
    </mesh>
  );
}

// Coffee Cup
function CoffeeCup({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.15, 16]} />
        <meshStandardMaterial color="#8b4513" roughness={0.6} />
      </mesh>
      {/* Coffee surface */}
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.01, 16]} />
        <meshStandardMaterial color="#3e2723" emissive="#3e2723" emissiveIntensity={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8b4513" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Plant
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.2, 8]} />
        <meshStandardMaterial color="#d4704a" roughness={0.7} />
      </mesh>
      {/* Leaves */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#4ade80" roughness={0.8} />
        </mesh>
        <mesh position={[-0.08, 0.2, 0]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
        <mesh position={[0.08, 0.2, 0]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

// Realistic human character at computer
function Character() {
  const headRef = useRef<THREE.Group>(null);
  const armLeftRef = useRef<THREE.Group>(null);
  const armRightRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (headRef.current) {
      // Very subtle natural head movement
      headRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
      headRef.current.rotation.x = -0.1 + Math.sin(t * 0.15) * 0.02;
    }
    
    if (bodyRef.current) {
      // Subtle breathing motion
      bodyRef.current.position.y = -0.7 + Math.sin(t * 0.8) * 0.005;
    }
    
    if (armLeftRef.current && armRightRef.current) {
      // Natural typing motion
      const typingSpeed = 2.5;
      armLeftRef.current.rotation.x = 1.3 + Math.sin(t * typingSpeed) * 0.08;
      armRightRef.current.rotation.x = 1.3 + Math.sin(t * typingSpeed + 0.4) * 0.08;
    }
  });

  const skinColor = "#c4957a";
  const shirtColor = "#1a1f2e";
  const pantsColor = "#2c3340";
  const hairColor = "#1a1410";

  return (
    <group ref={bodyRef} position={[0, -0.7, 0.4]}>
      {/* Upper Torso - realistic chest and back */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.65, 0.28]} />
        <meshStandardMaterial 
          color={shirtColor} 
          roughness={0.75} 
          metalness={0.05}
        />
      </mesh>
      
      {/* Lower Torso/Abdomen */}
      <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.35, 0.26]} />
        <meshStandardMaterial color={shirtColor} roughness={0.75} />
      </mesh>
      
      {/* Neck - realistic proportion */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.14, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.85} />
      </mesh>
      
      {/* Head - realistic human proportions */}
      <group ref={headRef} position={[0, 0.72, 0]}>
        {/* Cranium */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.24, 0.22]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Face front */}
        <mesh position={[0, -0.01, 0.12]} castShadow>
          <boxGeometry args={[0.18, 0.2, 0.02]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
        
        {/* Jaw/Chin */}
        <mesh position={[0, -0.14, 0.1]} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.1]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, 0, 0.135]} castShadow>
          <boxGeometry args={[0.03, 0.06, 0.04]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        
        {/* Eyes - realistic */}
        <mesh position={[0.055, 0.03, 0.125]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[0.055, 0.03, 0.135]}>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshStandardMaterial color="#2d2821" />
        </mesh>
        <mesh position={[-0.055, 0.03, 0.125]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[-0.055, 0.03, 0.135]}>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshStandardMaterial color="#2d2821" />
        </mesh>
        
        {/* Eyebrows */}
        <mesh position={[0.055, 0.065, 0.125]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.05, 0.012, 0.008]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>
        <mesh position={[-0.055, 0.065, 0.125]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.05, 0.012, 0.008]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[0.11, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.06, 0.025, 0.04]} />
          <meshStandardMaterial color={skinColor} roughness={0.75} />
        </mesh>
        <mesh position={[-0.11, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.06, 0.025, 0.04]} />
          <meshStandardMaterial color={skinColor} roughness={0.75} />
        </mesh>
        
        {/* Hair - realistic style */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.21, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>
        
        {/* Hair front/bangs */}
        <mesh position={[0, 0.08, 0.12]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.06]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>
        
        {/* Hair sides */}
        <mesh position={[0.1, 0.04, 0]} castShadow>
          <boxGeometry args={[0.04, 0.15, 0.18]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>
        <mesh position={[-0.1, 0.04, 0]} castShadow>
          <boxGeometry args={[0.04, 0.15, 0.18]} />
          <meshStandardMaterial color={hairColor} roughness={0.95} />
        </mesh>
      </group>

      {/* Shoulders - realistic */}
      <mesh position={[-0.32, 0.38, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color={shirtColor} roughness={0.75} />
      </mesh>
      <mesh position={[0.32, 0.38, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color={shirtColor} roughness={0.75} />
      </mesh>

      {/* Left arm - detailed realistic */}
      <group ref={armLeftRef} position={[-0.35, 0.32, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.18, 0.12]} rotation={[1.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.38, 32]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>
        
        {/* Elbow */}
        <mesh position={[0, -0.35, 0.28]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>
        
        {/* Forearm */}
        <mesh position={[0, -0.5, 0.38]} rotation={[1.25, 0, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.048, 0.32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        
        {/* Wrist */}
        <mesh position={[0, -0.65, 0.465]} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        
        {/* Hand - detailed */}
        <group position={[0, -0.7, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.075, 0.1, 0.035]} />
            <meshStandardMaterial color={skinColor} roughness={0.85} />
          </mesh>
          {/* Fingers hint */}
          <mesh position={[0, -0.055, 0]} castShadow>
            <boxGeometry args={[0.075, 0.015, 0.03]} />
            <meshStandardMaterial color={skinColor} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* Right arm - detailed realistic */}
      <group ref={armRightRef} position={[0.35, 0.32, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.18, 0.12]} rotation={[1.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.38, 32]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>
        
        {/* Elbow */}
        <mesh position={[0, -0.35, 0.28]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>
        
        {/* Forearm */}
        <mesh position={[0, -0.5, 0.38]} rotation={[1.25, 0, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.048, 0.32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        
        {/* Wrist */}
        <mesh position={[0, -0.65, 0.465]} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        
        {/* Hand - detailed */}
        <group position={[0, -0.7, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.075, 0.1, 0.035]} />
            <meshStandardMaterial color={skinColor} roughness={0.85} />
          </mesh>
          {/* Fingers hint */}
          <mesh position={[0, -0.055, 0]} castShadow>
            <boxGeometry args={[0.075, 0.015, 0.03]} />
            <meshStandardMaterial color={skinColor} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* Hips/Pelvis */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.22, 0.26]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      
      {/* Upper legs (thighs) */}
      <mesh position={[0.12, -0.72, 0]} rotation={[0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.088, 0.28, 32]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.12, -0.72, 0]} rotation={[0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.088, 0.28, 32]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
    </group>
  );
}

// Chair
function Chair() {
  return (
    <group position={[0, -1.3, 0.8]}>
      {/* Seat */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.3, -0.3]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#0f0f1e" />
      </mesh>
    </group>
  );
}

// Network Visualization - Connected particles like data analysis
function NetworkVisualization() {
  const count = 80;
  const particlesRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, particlePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const pPos: number[][] = [];
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8 + 1;
      const z = (Math.random() - 0.5) * 8;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      pPos.push([x, y, z]);
    }
    return { positions: pos, particlePositions: pPos };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update connection lines
    if (linesRef.current) {
      const linePositions: number[] = [];
      const maxDistance = 2.5;
      
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particlePositions[i][0] - particlePositions[j][0];
          const dy = particlePositions[i][1] - particlePositions[j][1];
          const dz = particlePositions[i][2] - particlePositions[j][2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < maxDistance) {
            linePositions.push(
              particlePositions[i][0], particlePositions[i][1], particlePositions[i][2],
              particlePositions[j][0], particlePositions[j][1], particlePositions[j][2]
            );
          }
        }
      }
      
      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
    }
  });

  return (
    <group>
      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#ff3333"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.04} 
          color="#ff4444"
          transparent 
          opacity={0.8} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Room walls (dark dramatic)
function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 1, -5]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.98} />
      </mesh>
    </group>
  );
}

// Floating data panels
function FloatingUIElements() {
  return (
    <>
      {/* Left side - Data panel */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh position={[-3, 1, -2]} rotation={[0, 0.3, 0]}>
          <planeGeometry args={[0.6, 0.8]} />
          <meshStandardMaterial
            color="#ff2222"
            emissive="#ff0000"
            emissiveIntensity={0.4}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>

      {/* Right side - Analysis window */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <mesh position={[3, 0.5, -2]} rotation={[0, -0.3, 0]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff0000"
            emissiveIntensity={0.3}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>

      {/* Top - Status panel */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.6}>
        <mesh position={[0, 2.5, -3]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1, 0.3]} />
          <meshStandardMaterial
            color="#cc0000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-0 bg-transparent">
      <Canvas 
        camera={{ position: [3, 1.5, 6], fov: 45 }} 
        dpr={[1, 2]}
        shadows
        gl={{ 
          alpha: true, 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8
        }}
        style={{ background: 'transparent' }}
      >
        {/* Dramatic dark lighting */}
        <ambientLight intensity={0.1} color="#111111" />
        
        {/* Key light (subtle) */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.3}
          color="#ff4444"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Fill light */}
        <directionalLight position={[-3, 2, -2]} intensity={0.15} color="#ff2222" />
        
        {/* Rim light */}
        <pointLight position={[0, 3, -3]} intensity={0.4} color="#cc0000" />
        
        {/* Screen glow lights - red theme */}
        <pointLight position={[0, 0.5, 0.5]} intensity={2} color="#ff0000" distance={3} />
        <pointLight position={[-1.2, 0.5, 0]} intensity={1.5} color="#ff2222" distance={2} />
        <pointLight position={[1.2, 0.5, 0]} intensity={1.5} color="#cc0000" distance={2} />

        {/* Environment */}
        <Room />

        {/* Main workspace setup - positioned for side view */}
        <group position={[0, 0, 0]} rotation={[0, Math.PI * 0.15, 0]}>
          <Desk />
          <Chair />
          <Character />

          {/* Monitors - triple setup with red glow */}
          <Monitor position={[0, -0.4, -0.3]} screenColor="#ff0000" />
          <Monitor position={[-1.3, -0.4, -0.2]} rotation={[0, 0.3, 0]} screenColor="#ff2222" />
          <Monitor position={[1.3, -0.4, -0.2]} rotation={[0, -0.3, 0]} screenColor="#cc0000" />

          {/* Desk items */}
          <Keyboard position={[0, -0.9, 0.4]} />
          <Mouse position={[0.5, -0.9, 0.5]} />
          <CoffeeCup position={[-1.5, -0.9, 0.6]} />
          <Plant position={[1.6, -0.9, 0.7]} />
        </group>

        {/* Floating data panels */}
        <FloatingUIElements />

        {/* Network visualization */}
        <NetworkVisualization />

        {/* Interactive controls (very subtle) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3}
          maxAzimuthAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
