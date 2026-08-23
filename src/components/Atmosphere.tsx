import { motion, useReducedMotion } from "framer-motion";

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

type BlobProps = {
  className: string;
  color: string;
  drift: { x: number[]; y: number[] };
  duration: number;
};

function Blob({ className, color, drift, duration }: BlobProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`absolute rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 50%, hsl(var(${color}) / 0.9), transparent 70%)`,
        filter: "blur(90px)",
        willChange: "transform",
      }}
      animate={reduced ? undefined : { x: drift.x, y: drift.y }}
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
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
studio-atmosphere=""
    >
      {/* Aurora blobs */}
      <div className="absolute inset-0 opacity-[0.16]">
        <Blob
          className="-top-40 -left-32 h-[42rem] w-[42rem]"
          color="--primary"
          drift={{ x: [0, 80, 0], y: [0, 50, 0] }}
          duration: {...({} as never)}
          duration={26}
        />
      </div>
    </div>
  );
}
