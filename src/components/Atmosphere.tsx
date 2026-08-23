import { motion, useReducedMotion } from "framer-motion";

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

type BlobProps = {
  className: string;
  colorVar: string;
  x: number[];
  y: number[];
  duration: number;
};

function Blob({ className, colorVar, x, y, duration }: BlobProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 50%, hsl(var(${colorVar}) / 0.85), transparent 70%)`,
        filter: "blur(100px)",
        willChange: "transform",
      }}
      animate={reduced ? undefined : { x, y }}
      transition={
        reduced
          ? undefined
          : { duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
      }
    />
  );
}

export default function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora blobs */}
      <div className="absolute inset-0 opacity-[0.16]">
        <Blob
          className="-top-48 -left-40 h-[40rem] w-[40rem]"
          colorVar="--primary"
          x={[0, 90, 0]}
          y={[0, 60, 0]}
          duration={26}
        />
        <Blob
          className="top-1/3 -right-52 h-[38rem] w-[38rem]"
          colorVar="--accent"
          x={[0, -70, 0]}
          y={[0, -50, 0]}
          duration={30}
        />
        <Blob
          className="bottom-[-16rem] left-1/4 h-[34rem] w-[34rem]"
          colorVar="--violet"
          x={[0, 60, 0]}
          y={[0, -40, 0]}
          duration={24}
        />
      </div>

      {/* Dot matrix fading toward the top */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--border-strong) / 0.9) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage:
            "linear-gradient(to top, hsl(0 0% 0% / 0.9), transparent 65%)",
          WebkitMaskImage:
            "linear-gradient(to top, hsl(0 0% 0% / 0.9), transparent 65%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 35%, hsl(var(--background) / 0.75) 100%)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: "160px 160px" }}
      />
    </div>
  );
}
