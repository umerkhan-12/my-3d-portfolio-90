import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Brand colors, kept in sync with the CSS tokens by hand (three needs numbers). */
const C_PRIMARY = new THREE.Color("#4ade80");
const C_ACCENT = new THREE.Color("#38bdf8");
const C_VIOLET = new THREE.Color("#a78bfa");

/**
 * Camera drifts toward the pointer. Lerped hard so it reads as parallax
 * depth rather than a cursor-follow gimmick.
 */
function CameraRig({ enabled }: { enabled: boolean }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 7));

  useFrame(() => {
    if (!enabled) return;
    target.current.set(pointer.x * 1.1, pointer.y * 0.7, 7);
    camera.position.lerp(target.current, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/** Slowly rotating wireframe solid — the anchor object that gives the scene a sense of volume. */
function CoreSolid() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.x = t * 0.06;
      outer.current.rotation.y = t * 0.09;
    }
    if (inner.current) {
      inner.current.rotation.x = -t * 0.11;
      inner.current.rotation.z = t * 0.07;
      const pulse = 1 + Math.sin(t * 0.6) * 0.04;
      inner.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[0, 0, -1]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial color={C_PRIMARY} wireframe transparent opacity={0.07} />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color={C_ACCENT} wireframe transparent opacity={0.09} />
      </mesh>
    </group>
  );
}

/**
 * Depth-sorted particle field. Size and opacity fall off with distance so the
 * cloud reads as a volume instead of a flat sheet of dots.
 */
function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const palette = [C_PRIMARY, C_ACCENT, C_VIOLET];

    for (let i = 0; i < count; i++) {
      const z = (Math.random() - 0.5) * 18;
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = z;

      const c = palette[Math.floor(Math.random() * palette.length)];
      // Fade toward the far plane for depth cueing.
      const depth = 1 - Math.min(Math.abs(z) / 12, 1) * 0.75;
      col[i * 3] = c.r * depth;
      col[i * 3 + 1] = c.g * depth;
      col[i * 3 + 2] = c.b * depth;

      siz[i] = (0.02 + Math.random() * 0.05) * depth;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Receding wireframe plane — the strongest single cue that the scene has a floor. */
function PerspectiveGrid() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      // Drift the grid toward the camera to imply forward motion.
      ref.current.position.z = ((state.clock.elapsedTime * 0.35) % 2) - 6;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.15, 0, 0]} position={[0, -4.2, -6]}>
      <planeGeometry args={[44, 30, 44, 30]} />
      <meshBasicMaterial color={C_PRIMARY} wireframe transparent opacity={0.07} />
    </mesh>
  );
}

export default function Scene3DSimple() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-transparent pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        // Ambient decoration: a lower pixel ratio is invisible here and far cheaper.
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        {/* Fog pulls the far particles into the background color, selling depth. */}
        <fog attach="fog" args={["#0a0d0f", 8, 24]} />
        <ambientLight intensity={0.3} />

        <CameraRig enabled={!isMobile} />
        <CoreSolid />
        <ParticleField count={isMobile ? 60 : 220} />
        <PerspectiveGrid />
      </Canvas>
    </div>
  );
}
