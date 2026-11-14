import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BatteryFull, FileDown, Lock, MessageSquareText, Signal, Wifi } from "lucide-react";
import { profile } from "@/data/profile";

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const dateFmt = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" });

/** "9:41 AM" → "9:41" for the big clock; the period is shown smaller. */
function splitTime(d: Date) {
  const parts = timeFmt.formatToParts(d);
  const period = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  const clock = parts
    .filter((p) => p.type !== "dayPeriod")
    .map((p) => p.value)
    .join("")
    .trim();
  return { clock, period };
}

export default function LockScreen({ onOpen, autoFocus = false }: { onOpen: () => void; autoFocus?: boolean }) {
  const now = useNow();
  const reduce = useReducedMotion() ?? false;
  const cardRef = useRef<HTMLButtonElement>(null);
  const { clock, period } = splitTime(now);
  // The whole phone buzzes (PhoneFrame), so the card itself stays still.

  useEffect(() => {
    if (autoFocus) cardRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden text-foreground">
      {/* wallpaper: calm aurora on near-black */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: [
            "radial-gradient(80% 45% at 15% 8%, hsl(var(--violet) / 0.22), transparent 70%)",
            "radial-gradient(70% 40% at 95% 30%, hsl(var(--accent) / 0.18), transparent 70%)",
            "radial-gradient(90% 55% at 40% 100%, hsl(var(--primary) / 0.16), transparent 70%)",
            "linear-gradient(180deg, hsl(220 18% 6%), hsl(var(--background)))",
          ].join(", "),
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000, transparent 75%)",
        }}
      />

      {/* status bar */}
      <div aria-hidden="true" className="flex items-center justify-between px-5 pt-3 font-mono text-[11px] font-medium text-foreground/85 lg:px-7 lg:pt-[15px] lg:text-[12px]">
        <span className="tabular-nums">{timeFmt.format(now)}</span>
        <span className="flex items-center gap-1.5">
          <Signal size={13} strokeWidth={2.4} />
          <Wifi size={13} strokeWidth={2.4} />
          <BatteryFull size={17} strokeWidth={2} />
        </span>
      </div>

      {/* clock */}
      <div className="flex flex-col items-center px-4 pt-[7%] text-center lg:px-6 lg:pt-[13%]">
        <Lock aria-hidden="true" size={15} className="mb-2 text-foreground/60" />
        <p className="font-display text-[13px] font-medium text-foreground/75 lg:text-[15px]">{dateFmt.format(now)}</p>
        <p className="mt-1 font-display font-semibold leading-none tracking-tight text-foreground" aria-label={`Time ${timeFmt.format(now)}`}>
          <span className="text-[3.4rem] tabular-nums lg:text-[5rem]">{clock}</span>
          {period && <span className="ml-1.5 text-base font-medium lg:text-xl text-foreground/60">{period}</span>}
        </p>

        <div className="mt-4 flex flex-col items-center lg:mt-7">
          <h1 className="font-display text-xl font-bold tracking-tight lg:text-2xl">{profile.name}</h1>
          <p className="mt-1 max-w-[16rem] text-balance text-[12px] lg:text-[13px] leading-snug text-muted-foreground">{profile.tagline}</p>
        </div>
      </div>

      {/* notification */}
      <div className="mt-auto px-3 pb-3 lg:px-3.5">
        <p className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">1 new message</p>
        <div className="relative">
          {/* a second card peeking out underneath, for depth */}
          <div aria-hidden="true" className="absolute inset-x-3 -bottom-1.5 h-6 rounded-b-[20px] border border-white/[0.06] bg-surface-2/50" />
          <motion.button
            ref={cardRef}
            type="button"
            onClick={onOpen}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.35 }}
            className="group relative block w-full rounded-[22px] border border-white/10 bg-surface-2/70 p-3 text-left lg:p-3.5 shadow-[0_18px_40px_-18px_hsl(220_40%_1%/0.9)] backdrop-blur-xl transition-colors hover:border-primary/40 hover:bg-surface-2/85 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Open message from Umer's agent: Hi, I build AI agents that book appointments. Want to see how?"
          >
            <span className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-gradient-brand text-primary-foreground shadow-glow"
              >
                <MessageSquareText size={20} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] font-semibold text-foreground">Umer's agent</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">now</span>
                </span>
                <span className="mt-0.5 block text-[14px] leading-snug text-foreground/85">
                  Hi 👋 I build AI agents that book appointments. Want to see how?
                </span>
                <span className="mt-2 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  tap to open
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </span>
            </span>
          </motion.button>
        </div>

        {/* escape hatch: always visible */}
        <nav aria-label="Skip the experience" className="mt-4 flex items-center justify-center gap-4 text-[12.5px] lg:mt-5 lg:gap-5">
          <Link
            to="/classic"
            className="rounded-sm text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
          >
            Skip to classic site
          </Link>
          <span aria-hidden="true" className="h-3 w-px bg-border-strong" />
          <a
            href="/Umer_Khan_Resume.pdf"
            download
            className="flex items-center gap-1 rounded-sm text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
          >
            <FileDown size={13} aria-hidden="true" />
            Résumé
          </a>
        </nav>

        {/* home indicator */}
        <div aria-hidden="true" className="mx-auto mt-3 h-[5px] w-28 lg:mt-4 lg:w-32 rounded-full bg-foreground/35" />
      </div>
    </div>
  );
}
