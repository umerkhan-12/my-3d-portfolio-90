import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useOnScreen } from "@/hooks/use-on-screen";

const MODEL_URL = "/models/clinibot-phone.glb";

/**
 * The CliniBot phone: a 3D model generated with TRELLIS from a render of the
 * real booking conversation. Loaded only once the card scrolls into view, so
 * it costs nothing on first paint.
 */
function Phone({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const { pointer, invalidate } = useThree();

  useEffect(() => {
    let cancelled = false;
    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (cancelled) return;
      gltf.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        // The export carries no normals; without them the lit material is black.
        mesh.geometry.computeVertexNormals();
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.metalness = 0.1;
        mat.roughness = 0.55;
      });
      // Centre the model on the origin so it rotates in place.
      const box = new THREE.Box3().setFromObject(gltf.scene);
      gltf.scene.position.sub(box.getCenter(new THREE.Vector3()));
      setModel(gltf.scene);
      invalidate();
    });
    return () => {
      cancelled = true;
    };
  }, [invalidate]);

  useFrame((state) => {
    if (!group.current || !animate) return;
    const t = state.clock.elapsedTime;
    // Swing rather than spin: the screen is the point, so keep it facing out.
    const targetY = Math.sin(t * 0.6) * 0.45 + pointer.x * 0.35;
    const targetX = pointer.y * -0.15;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
    group.current.position.y = Math.sin(t * 0.9) * 0.015;
  });

  return (
    <group ref={group} rotation={[0, 0.3, 0]}>
      {model && <primitive object={model} />}
    </group>
  );
}

export default function PhoneModel({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const { ref, onScreen } = useOnScreen<HTMLDivElement>("200px");
  // Mount the canvas the first time the card comes near the viewport.
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (onScreen) setSeen(true);
  }, [onScreen]);

  return (
    <div ref={ref} className={className} role="img" aria-label="3D phone showing a CliniBot WhatsApp booking conversation">
      {seen && (
        <Canvas
          camera={{ position: [0, 0, 1.75], fov: 36 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          frameloop={reduced ? "demand" : onScreen ? "always" : "never"}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={2.2} />
          <directionalLight position={[2, 3, 4]} intensity={2.4} />
          <directionalLight position={[-3, 1, 2]} intensity={0.9} color="#4ade80" />
          <Phone animate={!reduced} />
        </Canvas>
      )}
    </div>
  );
}
