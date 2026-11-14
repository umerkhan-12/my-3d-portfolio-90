import { Suspense, lazy, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Atmosphere from "@/components/Atmosphere";

// three.js is the heaviest dependency in the app and it only paints ambient
// decoration, so it is split out and pulled in after the first paint.
const Scene3DSimple = lazy(() => import("@/components/Scene3DSimple"));

/**
 * Site-wide background. Mounted once in App so the WebGL context survives
 * route changes instead of being torn down and rebuilt per page.
 * The landing route ("/") draws its own desk and must never load three.js,
 * so nothing renders there.
 */
export default function BackgroundLayers() {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  const landing = pathname === "/";
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (reduced || landing) return;
    // Defer to idle so the 3D chunk never competes with the hero paint.
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => setShowCanvas(true), { timeout: 2000 })
        : window.setTimeout(() => setShowCanvas(true), 1200);

    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle as number);
      } else {
        clearTimeout(idle as number);
      }
    };
  }, [reduced, landing]);

  if (landing) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Atmosphere />
      {showCanvas && (
        <Suspense fallback={null}>
          <Scene3DSimple />
        </Suspense>
      )}
    </div>
  );
}
