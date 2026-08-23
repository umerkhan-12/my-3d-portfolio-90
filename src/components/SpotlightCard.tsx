import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Shared card surface for the whole site: a cursor-following spotlight, a
 * border that brightens toward the pointer, and a restrained tilt.
 * Pointer effects are driven through CSS custom properties so no React state
 * updates on pointermove.
 */
export default function SpotlightCard({
  children,
  className,
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Touch pointers get the static surface — tilt on tap reads as a glitch.
    if (reduced || !ref.current || e.pointerType === "touch") return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    ref.current.style.setProperty("--spot-x", `${px * 100}%`);
    ref.current.style.setProperty("--spot-y", `${py * 100}%`);
    ref.current.style.setProperty("--spot-opacity", "1");

    if (tilt) {
      ref.current.style.setProperty("--tilt-y", `${(px - 0.5) * 8}deg`);
      ref.current.style.setProperty("--tilt-x", `${(0.5 - py) * 8}deg`);
    }
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--spot-opacity", "0");
    ref.current.style.setProperty("--tilt-y", "0deg");
    ref.current.style.setProperty("--tilt-x", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("spotlight-card", className)}
    >
      {children}
    </div>
  );
}
