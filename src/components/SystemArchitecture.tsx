import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * A full-stack system architecture rendered in 3D: clients on top, then the
 * API tier, the AI orchestration tier, the data tier, and infrastructure at
 * the base — with requests flowing down the stack and responses back up.
 *
 * Every node names a technology Umer actually ships with, so the diagram
 * doubles as the skills section: one visual instead of a wall of badges.
 */

const PRIMARY = "#4ade80";
const ACCENT = "#38bdf8";
const VIOLET = "#a78bfa";
const AMBER = "#fbbf24";

type Node = { label: string; x: number };
type Tier = { name: string; y: number; color: string; nodes: Node[] };

const TIERS: Tier[] = [
  {
    name: "CLIENTS",
    y: 3.3,
    color: PRIMARY,
    nodes: [
      { label: "WhatsApp", x: -2.2 },
      { label: "Dashboard", x: 0 },
      { label: "Telegram", x: 2.2 },
    ],
  },
  {
    name: "API",
    y: 1.65,
    color: ACCENT,
    nodes: [
      { label: "NestJS", x: -1.5 },
      { label: "REST · JWT", x: 1.5 },
    ],
  },
  {
    name: "AI ORCHESTRATION",
    y: 0,
    color: VIOLET,
    nodes: [
      { label: "n8n", x: -2.4 },
      { label: "Claude API", x: 0 },
      { label: "RAG · LangGraph", x: 2.6 },
    ],
  },
  {
    name: "DATA",
    y: -1.65,
    color: ACCENT,
    nodes: [
      { label: "PostgreSQL", x: -2.1 },
      { label: "Prisma", x: 0.2 },
      { label: "MongoDB", x: 2.3 },
    ],
  },
  {
    name: "INFRA",
    y: -3.3,
    color: AMBER,
    nodes: [
      { label: "DigitalOcean", x: -1.8 },
      { label: "Docker", x: 0.6 },
      { label: "PM2", x: 2.4 },
    ],
  },
];

/** Draws a label into a canvas texture so it stays crisp without extra deps. */
function useLabelSprite(text: string, color: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const font = "500 30px 'Fira Code', ui-monospace, monospace";

    ctx.font = font;
    const width = Math.ceil(ctx.measureText(text).width) + 28;
    const height = 44;
    canvas.width = width;
    canvas.height = height;

    // Resizing the canvas resets the context, so restate the font.
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, 14, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return { texture, aspect: width / height };
  }, [text, color]);
}

function Label({
  text,
  position,
  color,
  scale = 0.34,
}: {
  text: string;
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const { texture, aspect } = useLabelSprite(text, color);
  return (
    <sprite position={position} scale={[scale * aspect * 2.2, scale, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

/** One service box. */
function ServiceNode({
  position,
  color,
  index,
}: {
  position: [number, number, number];
  color: string;
  index: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    // Gentle breathing, offset per node so the tier never pulses in unison.
    const s = 1 + Math.sin(t * 1.1 + index * 0.9) * 0.05;
    mesh.current.scale.set(s, s, s);
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <boxGeometry args={[0.44, 0.44, 0.44]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.46, 0.46, 0.46]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

/** Faint plate marking a tier's plane. */
function TierPlate({ tier }: { tier: Tier }) {
  return (
    <mesh position={[0, tier.y - 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8.4, 2.2]} />
      <meshBasicMaterial color={tier.color} transparent opacity={0.045} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Vertical call path between two tiers. */
function TierLinks({ from, to }: { from: Tier; to: Tier }) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    from.nodes.forEach((a) => {
      to.nodes.forEach((b) => {
        pts.push(a.x, from.y, 0, b.x, to.y, 0);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [from, to]);

  return (
    <lineSegments>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={from.color} transparent opacity={0.13} />
    </lineSegments>
  );
}

/** A request travelling down the stack and its response coming back up. */
function DataPulse({ index, total }: { index: number; total: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  // Pick a consistent column through the tiers for this pulse.
  const path = useMemo(() => {
    return TIERS.map((tier) => {
      const node = tier.nodes[index % tier.nodes.length];
      return new THREE.Vector3(node.x, tier.y, 0);
    });
  }, [index]);

  useFrame((state) => {
    if (!mesh.current) return;
    const cycle = (state.clock.elapsedTime * 0.28 + index / total) % 1;
    // Down the stack, then back up.
    const p = cycle < 0.5 ? cycle * 2 : 1 - (cycle - 0.5) * 2;
    const segment = p * (path.length - 1);
    const i = Math.min(Math.floor(segment), path.length - 2);
    mesh.current.position.lerpVectors(path[i], path[i + 1], segment - i);

    const m = mesh.current.material as THREE.MeshBasicMaterial;
    m.opacity = 0.5 + Math.sin(p * Math.PI) * 0.5;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.075, 8, 8]} />
      <meshBasicMaterial color={PRIMARY} transparent opacity={0.8} />
    </mesh>
  );
}

function Stack({ interactive }: { interactive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    if (interactive) {
      // Pointer steers the yaw; otherwise it drifts on its own.
      const targetY = pointer.x * 0.5;
      const targetX = -pointer.y * 0.22;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    } else {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.14) * 0.35;
    }
    void delta;
  });

  return (
    <group ref={group}>
      {TIERS.map((tier, ti) => (
        <group key={tier.name}>
          <TierPlate tier={tier} />
          {/* Tier caption, parked to the left of the stack */}
          <Label
            text={tier.name}
            position={[-4.6, tier.y, 0]}
            color={tier.color}
            scale={0.24}
          />
          {tier.nodes.map((node, ni) => (
            <group key={node.label}>
              <ServiceNode
                position={[node.x, tier.y, 0]}
                color={tier.color}
                index={ti * 3 + ni}
              />
              <Label
                text={node.label}
                position={[node.x, tier.y - 0.52, 0]}
                color="#94a3b8"
                scale={0.2}
              />
            </group>
          ))}
          {ti < TIERS.length - 1 && <TierLinks from={tier} to={TIERS[ti + 1]} />}
        </group>
      ))}

      {Array.from({ length: 4 }, (_, i) => (
        <DataPulse key={i} index={i} total={4} />
      ))}
    </group>
  );
}

export default function SystemArchitecture() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reduced motion gets the same information as a static list.
  if (reduced) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <ul className="w-full max-w-xs space-y-2">
          {TIERS.map((tier) => (
            <li key={tier.name} className="rounded-lg border border-border-subtle bg-surface-2/50 p-3">
              <p className="font-mono text-[10px] tracking-widest" style={{ color: tier.color }}>
                {tier.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {tier.nodes.map((n) => n.label).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, isMobile ? 13 : 10.5], fov: 50 }}
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ alpha: true, antialias: !isMobile }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <Stack interactive={!isMobile} />
    </Canvas>
  );
}
