import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useOnScreen } from "@/hooks/use-on-screen";

/**
 * A full-stack system architecture rendered in 3D: clients on top, then the
 * API tier, the AI orchestration tier, the data tier, and infrastructure at
 * the base — with requests flowing down the stack and responses back up.
 *
 * Every node names a technology Umer actually ships with, so the diagram
 * doubles as the skills section: one visual instead of a wall of badges.
 *
 * Layout is responsive in two ways: a compact node spread on narrow screens,
 * and a camera that fits itself to the content bounds for any aspect ratio.
 */

const PRIMARY = "#4ade80";
const ACCENT = "#38bdf8";
const VIOLET = "#a78bfa";
const AMBER = "#fbbf24";

const LABEL_PX = 30; // font size used for the sprite textures
const LABEL_H = 44;

type Node = { label: string; short?: string; x: number };
type Tier = { name: string; short: string; y: number; color: string; nodes: Node[] };

const TIERS: Tier[] = [
  {
    name: "CLIENTS",
    short: "CLIENTS",
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
    short: "API",
    y: 1.65,
    color: ACCENT,
    nodes: [
      { label: "NestJS", x: -1.5 },
      { label: "REST · JWT", short: "REST", x: 1.5 },
    ],
  },
  {
    name: "AI ORCHESTRATION",
    short: "AI LAYER",
    y: 0,
    color: VIOLET,
    nodes: [
      { label: "n8n", x: -2.4 },
      { label: "Claude API", short: "Claude", x: 0 },
      { label: "RAG · LangGraph", short: "RAG", x: 2.6 },
    ],
  },
  {
    name: "DATA",
    short: "DATA",
    y: -1.65,
    color: ACCENT,
    nodes: [
      { label: "PostgreSQL", short: "Postgres", x: -2.1 },
      { label: "Prisma", x: 0.2 },
      { label: "MongoDB", short: "Mongo", x: 2.3 },
    ],
  },
  {
    name: "INFRA",
    short: "INFRA",
    y: -3.3,
    color: AMBER,
    nodes: [
      { label: "DigitalOcean", short: "DO", x: -1.8 },
      { label: "Docker", x: 0.6 },
      { label: "PM2", x: 2.4 },
    ],
  },
];

/** Approximate sprite width in world units, matching useLabelSprite's math. */
function labelWidthUnits(text: string, scale: number) {
  // ~0.6em per char for the mono face, plus the 28px horizontal padding.
  const px = text.length * LABEL_PX * 0.6 + 28;
  return scale * (px / LABEL_H) * 2.2;
}

/** Draws a label into a canvas texture so it stays crisp without extra deps. */
function useLabelSprite(text: string, color: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const font = `500 ${LABEL_PX}px 'Fira Code', ui-monospace, monospace`;

    ctx.font = font;
    const width = Math.ceil(ctx.measureText(text).width) + 28;
    canvas.width = width;
    canvas.height = LABEL_H;

    // Resizing the canvas resets the context, so restate the font.
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, 14, LABEL_H / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return { texture, aspect: width / LABEL_H };
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

/**
 * Pulls the camera back until the content bounds fit the current viewport,
 * accounting for aspect ratio. Without this the diagram is cropped on
 * portrait screens, where the horizontal field of view is far narrower.
 */
function FitCamera({ width, height }: { width: number; height: number }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const vFov = (cam.fov * Math.PI) / 180;

    const distForHeight = height / 2 / Math.tan(vFov / 2);
    const distForWidth = width / 2 / (Math.tan(vFov / 2) * aspect);

    // 8% breathing room so nothing kisses the edge as the stack rotates.
    cam.position.set(0, 0, Math.max(distForHeight, distForWidth) * 1.08);
    cam.updateProjectionMatrix();
  }, [camera, size, width, height]);

  return null;
}

/** One service box. */
function ServiceNode({
  position,
  color,
  index,
  size,
}: {
  position: [number, number, number];
  color: string;
  index: number;
  size: number;
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
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      <mesh>
        <boxGeometry args={[size * 1.05, size * 1.05, size * 1.05]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

function TierPlate({ tier, width }: { tier: Tier; width: number }) {
  return (
    <mesh position={[0, tier.y - 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, 2.2]} />
      <meshBasicMaterial color={tier.color} transparent opacity={0.045} side={THREE.DoubleSide} />
    </mesh>
  );
}

function TierLinks({ from, to, spread }: { from: Tier; to: Tier; spread: number }) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    from.nodes.forEach((a) => {
      to.nodes.forEach((b) => {
        pts.push(a.x * spread, from.y, 0, b.x * spread, to.y, 0);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [from, to, spread]);

  return (
    <lineSegments>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={from.color} transparent opacity={0.13} />
    </lineSegments>
  );
}

function DataPulse({ index, total, spread }: { index: number; total: number; spread: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  const path = useMemo(
    () =>
      TIERS.map((tier) => {
        const node = tier.nodes[index % tier.nodes.length];
        return new THREE.Vector3(node.x * spread, tier.y, 0);
      }),
    [index, spread]
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const cycle = (state.clock.elapsedTime * 0.28 + index / total) % 1;
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

function Stack({
  interactive,
  compact,
  spread,
  plateWidth,
}: {
  interactive: boolean;
  compact: boolean;
  spread: number;
  plateWidth: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const nodeSize = compact ? 0.34 : 0.44;
  const nodeLabelScale = compact ? 0.17 : 0.2;
  const tierLabelScale = compact ? 0.16 : 0.24;

  useFrame((state, delta) => {
    if (!group.current) return;
    if (interactive) {
      const targetY = pointer.x * 0.5;
      const targetX = -pointer.y * 0.22;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    } else {
      // Narrow screens have no hover, so drift gently on their own.
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.14) * 0.3;
    }
    void delta;
  });

  return (
    <group ref={group}>
      {TIERS.map((tier, ti) => (
        <group key={tier.name}>
          <TierPlate tier={tier} width={plateWidth} />

          {/* On wide screens the tier caption sits on a left rail; on narrow
              screens it moves above its row, which is far cheaper in width. */}
          <Label
            text={compact ? tier.short : tier.name}
            position={
              compact
                ? [0, tier.y + 0.66, 0]
                : [-(plateWidth / 2) - 0.4, tier.y, 0]
            }
            color={tier.color}
            scale={tierLabelScale}
          />

          {tier.nodes.map((node, ni) => (
            <group key={node.label}>
              <ServiceNode
                position={[node.x * spread, tier.y, 0]}
                color={tier.color}
                index={ti * 3 + ni}
                size={nodeSize}
              />
              <Label
                text={compact ? node.short ?? node.label : node.label}
                position={[node.x * spread, tier.y - 0.46, 0]}
                color="#94a3b8"
                scale={nodeLabelScale}
              />
            </group>
          ))}

          {ti < TIERS.length - 1 && (
            <TierLinks from={tier} to={TIERS[ti + 1]} spread={spread} />
          )}
        </group>
      ))}

      {Array.from({ length: 4 }, (_, i) => (
        <DataPulse key={i} index={i} total={4} spread={spread} />
      ))}
    </group>
  );
}

export default function SystemArchitecture() {
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Derive the real content bounds so the camera can fit them exactly.
  const { spread, plateWidth, contentW, contentH } = useMemo(() => {
    const sp = compact ? 0.62 : 1;
    const nodeLabelScale = compact ? 0.17 : 0.2;
    const tierLabelScale = compact ? 0.16 : 0.24;

    let maxRight = 0;
    let maxLeft = 0;
    TIERS.forEach((tier) => {
      tier.nodes.forEach((node) => {
        const text = compact ? node.short ?? node.label : node.label;
        const half = labelWidthUnits(text, nodeLabelScale) / 2;
        maxRight = Math.max(maxRight, node.x * sp + half);
        maxLeft = Math.min(maxLeft, node.x * sp - half);
      });
    });

    const plate = Math.max(maxRight - maxLeft, 3) + 0.8;

    let w: number;
    if (compact) {
      // Captions sit above the rows, so they only widen things if they are
      // wider than the node row itself.
      const widestCaption = Math.max(
        ...TIERS.map((t) => labelWidthUnits(t.short, tierLabelScale))
      );
      w = Math.max(maxRight - maxLeft, widestCaption) + 0.6;
    } else {
      const widestCaption = Math.max(
        ...TIERS.map((t) => labelWidthUnits(t.name, tierLabelScale))
      );
      // Left rail pushes the bounds outward on that side only.
      w = plate + widestCaption * 2 + 0.8;
    }

    // Top caption / bottom label overhang beyond the tier centres.
    const h = 3.3 * 2 + (compact ? 1.5 : 1.2);
    return { spread: sp, plateWidth: plate, contentW: w, contentH: h };
  }, [compact]);

  const { ref, onScreen } = useOnScreen<HTMLDivElement>();

  if (reduced) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
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
    <div ref={ref} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 50 }}
        dpr={[1, compact ? 1.5 : 2]}
        gl={{ alpha: true, antialias: !compact }}
        // Only render while the diagram is actually on screen.
        frameloop={onScreen ? "always" : "never"}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <FitCamera width={contentW} height={contentH} />
        <Stack
          interactive={!compact}
          compact={compact}
          spread={spread}
          plateWidth={plateWidth}
        />
      </Canvas>
    </div>
  );
}
