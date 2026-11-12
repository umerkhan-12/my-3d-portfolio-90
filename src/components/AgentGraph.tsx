import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useOnScreen } from "@/hooks/use-on-screen";
import { agentActivity } from "@/lib/agent-activity";

/**
 * A live agentic-system graph: an orchestrator core that calls out to tool
 * nodes, with request pulses travelling the links. This is the architecture
 * Umer actually builds (n8n tool-calling, Claude API, CliniBot), rendered as
 * the hero rather than described in prose.
 */

const PRIMARY = "#4ade80";
const ACCENT = "#38bdf8";
const VIOLET = "#a78bfa";

type Tool = { label: string; angle: number; radius: number; y: number; color: string };

/** Tools drawn from the real stack — each one appears in a shipped project. */
const TOOLS: Tool[] = [
  { label: "WhatsApp", angle: 0.0, radius: 3.1, y: 0.9, color: PRIMARY },
  { label: "Claude API", angle: 0.9, radius: 3.5, y: -0.4, color: VIOLET },
  { label: "PostgreSQL", angle: 1.8, radius: 3.0, y: 1.3, color: ACCENT },
  { label: "Calendar", angle: 2.7, radius: 3.4, y: -1.1, color: PRIMARY },
  { label: "n8n", angle: 3.6, radius: 3.2, y: 0.5, color: VIOLET },
  { label: "Gmail", angle: 4.5, radius: 3.5, y: -0.8, color: ACCENT },
  { label: "NestJS", angle: 5.4, radius: 3.05, y: 1.0, color: PRIMARY },
];

/** Widest orbit in the graph — what the camera has to frame. */
const GRAPH_RADIUS = Math.max(...TOOLS.map((t) => Math.hypot(t.radius, t.y))) + 0.6;

function toVec(t: Tool) {
  return new THREE.Vector3(Math.cos(t.angle) * t.radius, t.y, Math.sin(t.angle) * t.radius);
}

/** The orchestrator. Breathes so the graph never looks like a static diagram. */
function Core() {
  const shell = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y = t * 0.25;
      shell.current.rotation.x = t * 0.12;
      // Beats harder while the agent is answering a question.
      const busy = agentActivity.isBusy();
      shell.current.scale.setScalar(1 + Math.sin(t * (busy ? 9 : 1.4)) * (busy ? 0.14 : 0.05));
    }
    if (cage.current) {
      cage.current.rotation.y = -t * 0.16;
      cage.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshBasicMaterial color={PRIMARY} transparent opacity={0.55} />
      </mesh>
      <mesh ref={cage}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.32} />
      </mesh>
      <pointLight color={PRIMARY} intensity={3} distance={9} />
    </group>
  );
}

/** A tool the agent can call. Lights up when a pulse reaches it. */
function ToolNode({ tool, index }: { tool: Tool; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => toVec(tool), [tool]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.4 + index;
    mesh.current.rotation.y = t * 0.3 + index;
    // Flare as the pulse lands, then settle.
    const cycle = (t * 0.5 + index * 0.37) % 1;
    const flare = cycle > 0.88 ? 1 + (cycle - 0.88) * 6 : 1;
    // A node the agent just retrieved from swells and holds, then eases back.
    const lit = agentActivity.level(tool.label);
    mesh.current.scale.setScalar(flare + lit * 1.3);
  });

  return (
    <mesh ref={mesh} position={pos}>
      <octahedronGeometry args={[0.24, 0]} />
      <meshBasicMaterial color={tool.color} transparent opacity={0.9} />
    </mesh>
  );
}

/** Names the tool, so the graph reads as a real system rather than decoration. */
function ToolLabel({ tool, size }: { tool: Tool; size: number }) {
  const pos = useMemo(() => toVec(tool).add(new THREE.Vector3(0, -0.52, 0)), [tool]);
  const { texture, aspect } = useMemo(() => {
    const H = 44;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const font = "500 28px 'Fira Code', ui-monospace, monospace";
    ctx.font = font;
    canvas.width = Math.ceil(ctx.measureText(tool.label).width) + 24;
    canvas.height = H;
    // Resizing the canvas resets the context, so restate the font.
    ctx.font = font;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#d4d8e0";
    ctx.fillText(tool.label, 12, H / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return { texture: tex, aspect: canvas.width / H };
  }, [tool.label]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    // No size attenuation: labels keep one readable size at any depth.
    <sprite position={pos} scale={[size * aspect, size, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation={false}
      />
    </sprite>
  );
}

/** Static link from core to tool — the call path. */
function Link({ tool }: { tool: Tool }) {
  const material = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    if (material.current) material.current.opacity = 0.22 + agentActivity.level(tool.label) * 0.7;
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const end = toVec(tool);
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0, 0, end.x, end.y, end.z], 3)
    );
    return g;
  }, [tool]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial ref={material} color={tool.color} transparent opacity={0.22} />
    </line>
  );
}

/** A request travelling out to a tool and the response coming back. */
function Pulse({ tool, index }: { tool: Tool; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const end = useMemo(() => toVec(tool), [tool]);

  useFrame((state) => {
    if (!mesh.current) return;
    const cycle = (state.clock.elapsedTime * 0.5 + index * 0.37) % 1;
    // Out on the first half, back on the second — a call and its response.
    const p = cycle < 0.5 ? cycle * 2 : 1 - (cycle - 0.5) * 2;
    mesh.current.position.copy(end).multiplyScalar(p);
    const m = mesh.current.material as THREE.MeshBasicMaterial;
    m.opacity = Math.sin(p * Math.PI) * 0.95;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.075, 8, 8]} />
      <meshBasicMaterial color={tool.color} transparent opacity={0} />
    </mesh>
  );
}

/** Pulls the camera back so the full orbit fits, whatever the aspect ratio. */
function FitCamera({ radius }: { radius: number }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const vFov = (cam.fov * Math.PI) / 180;
    const distForHeight = radius / Math.tan(vFov / 2);
    const distForWidth = radius / (Math.tan(vFov / 2) * aspect);
    cam.position.set(0, 0.6, Math.max(distForHeight, distForWidth) * 1.12);
    cam.updateProjectionMatrix();
  }, [camera, size, radius]);

  return null;
}

/** Slow orbit plus damped pointer parallax. */
function Rig({ interactive, labelSize }: { interactive: boolean; labelSize: number }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    if (interactive) {
      const targetX = pointer.y * 0.28;
      const targetZ = pointer.x * 0.18;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
      group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Core />
      {TOOLS.map((tool, i) => (
        <group key={tool.label}>
          <Link tool={tool} />
          <ToolNode tool={tool} index={i} />
          <ToolLabel tool={tool} size={labelSize} />
          <Pulse tool={tool} index={i} />
        </group>
      ))}
    </group>
  );
}

export default function AgentGraph() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const { ref, onScreen } = useOnScreen<HTMLDivElement>();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Under reduced motion, show a still diagram rather than an animated one.
  if (reduced) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-primary/40 bg-primary/10" />
          <p className="font-mono text-xs text-muted-foreground">
            agent core → {TOOLS.length} tools
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 1.4, 8.2], fov: 52 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: true, antialias: !isMobile }}
        // Stop drawing once the hero scrolls away or the tab is hidden.
        frameloop={onScreen ? "always" : "never"}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <FitCamera radius={GRAPH_RADIUS} />
        <Rig interactive={!isMobile} labelSize={isMobile ? 0.058 : 0.027} />
      </Canvas>
    </div>
  );
}
