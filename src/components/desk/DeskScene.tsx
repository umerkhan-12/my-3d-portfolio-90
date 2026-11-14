import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";

/**
 * Top-down dark developer's desk. Decorative props live in two side columns
 * that stop 200px + a gutter short of the centre line, so a 400px-wide phone
 * is never overlapped. Props are cropped by the viewport edges on purpose.
 * Below `lg` a smaller set peeks in from the edges and corners around the
 * bezelled phone; it sits under the phone and never takes pointer events.
 */

const INK = "hsl(220 14% 5%)";
const EDGE = "hsl(var(--border-strong))";
const SW = 1.5; // one stroke weight for every prop
const PAPER = "hsl(38 38% 72%)";
const PAPER_DEEP = "hsl(36 32% 60%)";
const AMBER = "hsl(40 80% 62%)";
const EMERALD = "hsl(var(--primary))";
const CYAN = "hsl(var(--accent))";
const VIOLET = "hsl(var(--violet))";

type DriftProps = {
  opened: boolean;
  reduce: boolean;
  dx: number;
  dy?: number;
  /** Mobile props are the desktop artwork shrunk; `origin` is the corner they are anchored by. */
  scale?: number;
  origin?: string;
  /** Opacity once the phone is open (mobile props vanish behind the full-screen chat). */
  fade?: number;
  className?: string;
  children: ReactNode;
};

/** Wrapper that drifts a prop away from centre and dims it when the phone opens. */
function Drift({ opened, reduce, dx, dy = 0, scale, origin, fade = 0.6, className = "", children }: DriftProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute ${className}`}
      initial={false}
      animate={{
        x: opened && !reduce ? dx : 0,
        y: opened && !reduce ? dy : 0,
        opacity: opened ? fade : 1,
      }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {scale ? <div style={{ transform: `scale(${scale})`, transformOrigin: origin }}>{children}</div> : children}
    </motion.div>
  );
}

const softShadow = (blur = 14, alpha = 0.55): CSSProperties => ({
  filter: `drop-shadow(0 ${blur * 0.6}px ${blur}px hsl(220 30% 1% / ${alpha}))`,
});

/* ---------------------------------------------------------------- props */

function Keyboard() {
  const rows = [
    { y: 34, n: 13, x0: 20, off: 0 },
    { y: 62, n: 12, x0: 31, off: 0 },
    { y: 90, n: 12, x0: 38, off: 0 },
  ];
  const accents: Record<string, string> = { "0-0": EMERALD, "1-11": CYAN, "2-3": VIOLET, "0-12": EMERALD };
  return (
    <svg width="430" height="190" viewBox="0 0 430 190" style={{ ...softShadow(18, 0.6), transform: "rotate(-7deg)" }}>
      <rect x="4" y="10" width="422" height="170" rx="16" fill="hsl(220 13% 8%)" stroke={EDGE} strokeWidth={SW} />
      <rect x="12" y="18" width="406" height="154" rx="11" fill="hsl(220 14% 5.5%)" stroke="hsl(var(--border-subtle))" strokeWidth={SW} />
      {rows.map((r, ri) =>
        Array.from({ length: r.n }).map((_, i) => {
          const accent = accents[`${ri}-${i}`];
          return (
            <g key={`${ri}-${i}`}>
              <rect x={r.x0 + i * 29 + 1} y={r.y + 2} width="25" height="23" rx="5" fill="hsl(220 30% 1%)" opacity="0.7" />
              <rect
                x={r.x0 + i * 29}
                y={r.y}
                width="25"
                height="23"
                rx="5"
                fill={accent ? `${accent}` : "hsl(var(--surface-3))"}
                fillOpacity={accent ? 0.85 : 1}
                stroke={accent ? "none" : EDGE}
                strokeWidth={SW}
              />
              <rect x={r.x0 + i * 29 + 4} y={r.y + 3} width="17" height="3" rx="1.5" fill="white" opacity={accent ? 0.25 : 0.07} />
            </g>
          );
        }),
      )}
      {/* space bar row */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30 + i * 34} y="120" width="30" height="23" rx="5" fill="hsl(var(--surface-3))" stroke={EDGE} strokeWidth={SW} />
      ))}
      <rect x="134" y="120" width="170" height="23" rx="5" fill="hsl(var(--surface-3))" stroke={EDGE} strokeWidth={SW} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={312 + i * 34} y="120" width="30" height="23" rx="5" fill="hsl(var(--surface-3))" stroke={EDGE} strokeWidth={SW} />
      ))}
      <circle cx="402" cy="29" r="2.5" fill={EMERALD} />
    </svg>
  );
}

function Mug() {
  return (
    <svg width="190" height="190" viewBox="0 0 190 190" style={{ ...softShadow(16, 0.6), transform: "rotate(14deg)" }}>
      {/* old coffee ring stain on the desk */}
      <circle cx="68" cy="124" r="44" fill="none" stroke={AMBER} strokeOpacity="0.16" strokeWidth="4" strokeDasharray="210 70" />
      <circle cx="68" cy="124" r="41" fill="none" stroke={AMBER} strokeOpacity="0.07" strokeWidth="2" />
      {/* handle */}
      <path d="M130 56 C 178 50 180 108 132 106" fill="none" stroke="hsl(220 12% 20%)" strokeWidth="15" strokeLinecap="round" />
      {/* body */}
      <circle cx="90" cy="80" r="56" fill="hsl(220 12% 20%)" stroke={EDGE} strokeWidth={SW} />
      <circle cx="90" cy="80" r="47" fill="hsl(220 12% 12%)" stroke={EDGE} strokeWidth={SW} />
      {/* coffee */}
      <circle cx="90" cy="80" r="41" fill="hsl(24 45% 14%)" />
      <circle cx="90" cy="80" r="41" fill="none" stroke="hsl(24 40% 24%)" strokeWidth={SW} />
      <path d="M62 70 C 72 52 100 50 112 62" fill="none" stroke="hsl(30 50% 38%)" strokeWidth={SW} strokeLinecap="round" opacity="0.7" />
      <circle cx="104" cy="94" r="6" fill="hsl(30 45% 30%)" opacity="0.5" />
      {/* rim highlight */}
      <path d="M48 52 A 56 56 0 0 1 84 25" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Notebook() {
  return (
    <svg width="270" height="340" viewBox="0 0 270 340" style={{ ...softShadow(20, 0.65), transform: "rotate(6deg)" }}>
      {/* cover peeking out below */}
      <rect x="10" y="12" width="250" height="322" rx="10" fill="hsl(220 14% 11%)" stroke={EDGE} strokeWidth={SW} />
      {/* page */}
      <rect x="6" y="6" width="250" height="322" rx="9" fill={PAPER} stroke={PAPER_DEEP} strokeWidth={SW} />
      {/* ruled lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="34" x2="244" y1={40 + i * 26} y2={40 + i * 26} stroke={PAPER_DEEP} strokeOpacity="0.45" strokeWidth="1" />
      ))}
      {/* spiral */}
      {Array.from({ length: 11 }).map((_, i) => (
        <g key={i}>
          <circle cx="22" cy={30 + i * 28} r="4.5" fill={INK} opacity="0.75" />
          <path d={`M6 ${30 + i * 28} h 24`} stroke="hsl(220 10% 38%)" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      {/* system sketch: client -> agent -> db, with a retrieval loop */}
      <g fill="none" stroke="hsl(220 22% 16%)" strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
        <rect x="46" y="62" width="62" height="34" rx="4" />
        <rect x="150" y="62" width="76" height="34" rx="4" stroke={EMERALD} strokeWidth="1.8" style={{ stroke: "hsl(150 55% 24%)" }} />
        <rect x="150" y="150" width="76" height="34" rx="4" />
        <rect x="46" y="150" width="62" height="34" rx="4" strokeDasharray="4 3" />
        <path d="M108 79 H146 M140 74 l6 5 -6 5" />
        <path d="M188 96 V146 M183 140 l5 6 5 -6" />
        <path d="M150 167 H112 M118 162 l-6 5 6 5" />
        <path d="M77 150 V100 M72 106 l5 -6 5 6" />
      </g>
      <g fontFamily="'Fira Code', monospace" fontSize="10" fill="hsl(220 22% 16%)" textAnchor="middle">
        <text x="77" y="83">wa/in</text>
        <text x="188" y="83">agent</text>
        <text x="188" y="171">tools</text>
        <text x="77" y="171">db</text>
      </g>
      <path d="M44 224 q 20 -8 40 0 t 40 0 t 40 0" fill="none" stroke="hsl(220 22% 16%)" strokeWidth={SW} strokeLinecap="round" opacity="0.7" />
      <path d="M44 246 q 14 -6 28 0 t 28 0" fill="none" stroke="hsl(220 22% 16%)" strokeWidth={SW} strokeLinecap="round" opacity="0.5" />
      <g stroke="hsl(150 55% 24%)" strokeWidth={SW} fill="none" strokeLinecap="round">
        <circle cx="52" cy="276" r="6" />
        <path d="M49 276 l2.5 2.5 4.5 -5" />
      </g>
      <text x="66" y="280" fontFamily="'Fira Code', monospace" fontSize="10" fill="hsl(220 22% 16%)">idempotent</text>
    </svg>
  );
}

function Pen() {
  return (
    <svg width="230" height="30" viewBox="0 0 230 30" style={{ ...softShadow(8, 0.6), transform: "rotate(-24deg)" }}>
      <rect x="6" y="8" width="170" height="14" rx="7" fill="hsl(220 14% 14%)" stroke={EDGE} strokeWidth={SW} />
      <rect x="26" y="8" width="8" height="14" fill={EMERALD} opacity="0.9" />
      <rect x="40" y="11" width="90" height="3" rx="1.5" fill="white" opacity="0.1" />
      <path d="M176 8 L214 15 L176 22 Z" fill="hsl(220 12% 24%)" stroke={EDGE} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M206 13 L214 15 L206 17 Z" fill={CYAN} />
      <path d="M6 15 h -3" stroke={EDGE} strokeWidth={SW} />
      <rect x="8" y="12" width="20" height="2" rx="1" fill="white" opacity="0.18" />
    </svg>
  );
}

function StickyNote() {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" style={{ ...softShadow(12, 0.55), transform: "rotate(-5deg)" }}>
      <path d="M8 8 H142 V122 Q 142 142 122 142 H 8 Z" fill={AMBER} stroke="hsl(38 70% 44%)" strokeWidth={SW} strokeLinejoin="round" />
      <path d="M142 122 Q 142 142 122 142 Q 124 126 142 122 Z" fill="hsl(38 70% 50%)" opacity="0.8" />
      <rect x="8" y="8" width="134" height="16" fill="white" opacity="0.14" />
      <text
        x="75"
        y="70"
        textAnchor="middle"
        fontFamily="'Space Grotesk', 'Inter', sans-serif"
        fontWeight="700"
        fontSize="25"
        fill="hsl(30 45% 14%)"
        transform="rotate(-3 75 70)"
      >
        ship
      </text>
      <text
        x="75"
        y="100"
        textAnchor="middle"
        fontFamily="'Space Grotesk', 'Inter', sans-serif"
        fontWeight="700"
        fontSize="25"
        fill="hsl(30 45% 14%)"
        transform="rotate(-3 75 100)"
      >
        {"> perfect"}
      </text>
      <path d="M40 112 q 35 6 72 -2" fill="none" stroke="hsl(30 45% 14%)" strokeWidth={SW} strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function LanyardCard() {
  return (
    <svg width="190" height="360" viewBox="0 0 190 360" style={{ ...softShadow(16, 0.6), transform: "rotate(-9deg)" }}>
      {/* strap running off the desk edge */}
      <path d="M96 52 C 100 20 60 6 30 -30" fill="none" stroke="hsl(var(--primary) / 0.55)" strokeWidth="13" strokeLinecap="round" />
      <path d="M96 52 C 100 20 60 6 30 -30" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth={SW} strokeDasharray="2 7" strokeLinecap="round" />
      {/* clip */}
      <rect x="82" y="44" width="28" height="22" rx="5" fill="hsl(220 10% 30%)" stroke={EDGE} strokeWidth={SW} />
      <rect x="90" y="52" width="12" height="6" rx="3" fill={INK} />
      {/* card */}
      <rect x="20" y="62" width="150" height="240" rx="14" fill="hsl(220 14% 9%)" stroke={EDGE} strokeWidth={SW} />
      <rect x="20" y="62" width="150" height="62" rx="14" fill="hsl(var(--primary) / 0.9)" />
      <rect x="20" y="106" width="150" height="18" fill="hsl(var(--primary) / 0.9)" />
      <rect x="20" y="124" width="150" height="3" fill={INK} opacity="0.35" />
      <text x="36" y="96" fontFamily="'Fira Code', monospace" fontSize="11" fontWeight="600" fill={INK} letterSpacing="1.5">
        STUDENT
      </text>
      <circle cx="95" cy="178" r="34" fill="hsl(var(--surface-3))" stroke={EDGE} strokeWidth={SW} />
      <circle cx="95" cy="168" r="12" fill="hsl(220 10% 30%)" />
      <path d="M68 205 q 27 -30 54 0" fill="hsl(220 10% 30%)" />
      <text x="95" y="244" textAnchor="middle" fontFamily="'Space Grotesk', 'Inter', sans-serif" fontWeight="700" fontSize="17" fill="hsl(0 0% 93%)">
        FAST NUCES
      </text>
      <text x="95" y="266" textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize="12" fill={CYAN}>
        {"CS '27"}
      </text>
      {Array.from({ length: 18 }).map((_, i) => (
        <rect key={i} x={40 + i * 6.5} y="280" width={i % 3 === 0 ? 3.5 : 2} height="10" fill="hsl(0 0% 70%)" opacity="0.45" />
      ))}
    </svg>
  );
}

function Cable() {
  // A USB-C lead coming in from the right edge and ending in a plug.
  return (
    <svg width="300" height="170" viewBox="0 0 300 170" style={softShadow(8, 0.6)}>
      <path d="M310 20 C 230 10 250 90 180 84 C 120 78 130 140 62 128" fill="none" stroke="hsl(220 10% 8%)" strokeWidth="9" strokeLinecap="round" opacity="0.6" transform="translate(2 5)" />
      <path d="M310 20 C 230 10 250 90 180 84 C 120 78 130 140 62 128" fill="none" stroke="hsl(220 8% 74%)" strokeWidth="6" strokeLinecap="round" />
      <path d="M310 20 C 230 10 250 90 180 84 C 120 78 130 140 62 128" fill="none" stroke="hsl(220 12% 10%)" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 9" opacity="0.6" />
      {/* plug */}
      <g transform="rotate(12 48 130)">
        <rect x="20" y="119" width="44" height="22" rx="6" fill="hsl(220 10% 24%)" stroke={EDGE} strokeWidth={SW} />
        <rect x="6" y="123" width="22" height="14" rx="7" fill="hsl(220 8% 62%)" stroke={EDGE} strokeWidth={SW} />
        <rect x="11" y="128" width="12" height="4" rx="2" fill={INK} />
        <circle cx="52" cy="130" r="2" fill={EMERALD} />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- links */

const noteBase =
  "group relative block w-[168px] px-4 pb-3 pt-5 font-display text-[15px] font-bold leading-tight text-[hsl(30_45%_12%)] " +
  "shadow-[0_10px_18px_-8px_hsl(220_30%_1%/0.85)] transition-transform duration-200 " +
  "hover:-translate-y-1 hover:rotate-0 focus-visible:-translate-y-1 focus-visible:rotate-0 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "motion-reduce:transition-none";

function Tape({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 -rotate-2 rounded-[2px] opacity-80"
      style={{ background: color }}
    />
  );
}

const Arrow = () => (
  <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
    ↗
  </span>
);

/* ---------------------------------------------------------------- scene */

export default function DeskScene({ opened, children }: { opened: boolean; children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const p = { opened, reduce };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background">
      {/* desk surface: faint grain, pool of light, vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 60% at 50% 48%, hsl(200 60% 50% / 0.07), transparent 70%)",
            "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 45%, hsl(220 30% 1% / 0.75) 100%)",
            "repeating-linear-gradient(92deg, hsl(220 14% 100% / 0.012) 0 1px, transparent 1px 7px)",
            "repeating-linear-gradient(90.6deg, hsl(220 14% 0% / 0.18) 0 2px, transparent 2px 23px)",
          ].join(", "),
        }}
      />

      {/* decorative props, mobile: the same artwork, shrunk and cropped by the screen edges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
        <Drift {...p} fade={0} dx={0} dy={-30} scale={0.55} origin="top left" className="-left-[70px] -top-[58px]">
          <Keyboard />
        </Drift>
        <Drift {...p} fade={0} dx={30} dy={-20} scale={0.5} origin="top right" className="-right-[34px] -top-[10px]">
          <Mug />
        </Drift>
        <Drift {...p} fade={0} dx={-30} scale={0.55} origin="top left" className="-left-[52px] top-[42%]">
          <StickyNote />
        </Drift>
        <Drift {...p} fade={0} dx={-30} dy={30} scale={0.5} origin="bottom left" className="-bottom-[96px] -left-[52px]">
          <Notebook />
        </Drift>
        <Drift {...p} fade={0} dx={30} dy={30} scale={0.5} origin="bottom right" className="-bottom-[96px] -right-[34px]">
          <LanyardCard />
        </Drift>
      </div>

      {/* decorative props, desktop only */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* left column */}
        <div className="absolute inset-y-0 left-0 w-[calc(50%-216px)] overflow-hidden">
          <Drift {...p} dx={-36} dy={-18} className="-left-[135px] -top-[34px]">
            <Keyboard />
          </Drift>
          <Drift {...p} dx={-30} className="left-[26px] top-[calc(50%-92px)]">
            <StickyNote />
          </Drift>
          <Drift {...p} dx={-34} dy={24} className="-bottom-[78px] -left-[44px]">
            <Notebook />
          </Drift>
          <Drift {...p} dx={-28} dy={20} className="-bottom-[10px] left-[128px]">
            <Pen />
          </Drift>
        </div>

        {/* right column */}
        <div className="absolute inset-y-0 right-0 w-[calc(50%-216px)] overflow-hidden">
          <Drift {...p} dx={36} dy={-20} className="-right-[44px] top-[14px]">
            <Mug />
          </Drift>
          <Drift {...p} dx={34} dy={20} className="-bottom-[34px] -right-[22px]">
            <LanyardCard />
          </Drift>
          <Drift {...p} dx={30} dy={14} className="-right-[16px] top-[calc(50%+40px)]">
            <Cable />
          </Drift>
        </div>
      </div>

      {/* real links: sticky notes pinned in the right column */}
      <nav
        aria-label="Quick links"
        className="absolute top-[calc(50%-132px)] z-20 hidden -translate-y-1/2 flex-col items-center gap-[14px] lg:flex"
        style={{ right: "max(20px, calc((100% - 400px) / 4 - 84px))" }}
      >
        <a
          href="/Umer_Khan_Resume.pdf"
          download
          className={`${noteBase} -rotate-3`}
          style={{ background: AMBER }}
        >
          <Tape color="hsl(var(--primary) / 0.7)" />
          Résumé
          <span className="mt-0.5 block font-mono text-[10px] font-medium opacity-60">PDF · download</span>
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`${noteBase} rotate-[2.5deg]`}
          style={{ background: "hsl(190 55% 72%)" }}
        >
          <Tape color="hsl(40 80% 62% / 0.75)" />
          GitHub
          <Arrow />
          <span className="mt-0.5 block font-mono text-[10px] font-medium opacity-60">umerkhan-12</span>
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${noteBase} -rotate-[1.5deg]`}
          style={{ background: "hsl(265 60% 82%)" }}
        >
          <Tape color="hsl(var(--accent) / 0.65)" />
          LinkedIn
          <Arrow />
          <span className="mt-0.5 block font-mono text-[10px] font-medium opacity-60">umer-khan10</span>
        </a>
        <Link
          to="/classic"
          className={`${noteBase} rotate-[3deg]`}
          style={{ background: "hsl(142 45% 70%)" }}
        >
          <Tape color="hsl(265 70% 65% / 0.6)" />
          Classic site →
          <span className="mt-0.5 block font-mono text-[10px] font-medium opacity-60">the full portfolio</span>
        </Link>
      </nav>

      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </div>
  );
}
