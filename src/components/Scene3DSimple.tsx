import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return reduced;
}

function ParticleField({ count }: { count: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const target = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const z = (Math.random() - 0.5) * 14;
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = z;

      // Depth-of-field feel: nearer particles are larger and brighter
      const depth = 1 - Math.min(Math.abs(z) / 7, 1);
      sz[i] = 0.02 + depth * 0.05;
      const fade = 0.35 + depth * 0.65;

      const choice = Math.random();
      if (choice < 0.33) {
        cols[i * 3] = 0.29 * fade; cols[i * 3 + 1] = 0.87 * fade; cols[i * 3 + 2] = 0.5 * fade;
      } else if (choice < 0.66) {
        cols[i * 3] = 0.22 * fade; cols[i * 3 + 1] = 0.74 * fade; cols[i * 3 + 2] = 0.97 * fade;
      } else {
        cols[i * 3] = 0.66 * fade; cols[i * 3 + 1] = 0.55 * fade; cols[i * 3 + 2] = 0.98 * fade;
      }
    }
    return { positions: pos, colors: cols, sizes: sz };
  }, [count]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [size]);

  useFrame((state, delta) => {
    const p = particlesRef.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * 0.01;
    const damp = Math.min(delta * 2, 1);
    p.position.x += (target.current.x * 0.6 - p.position.x) * damp;
    p.position.y += (-target.current.y * 0.4 - p.position.y) * damp;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SimpleGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

export default function Scene3DSimple() {
  const reduced = useReducedMotionPref();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (reduced) return null;

  return (
    <div className="absolute inset-0 z-0 bg-transparent pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#4ade80" />
        <directionalLight position={[-5, -3, 5]} intensity={0.3} color="#38bdf8" />

        <ParticleField count={isMobile ? 35 : 180} />
        <SimpleGrid />
      </Canvas>
    </div>
  );
}
