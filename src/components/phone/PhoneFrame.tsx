import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const DESKTOP_QUERY = "(min-width: 1024px)";

/** True at Tailwind's `lg` breakpoint and up (where the bezel is drawn). */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/**
 * The device. On `lg+` it is a phone on the desk: dark body, thin metal edge,
 * side buttons, a notch pill and a soft screen glow. Below `lg` the bezel
 * disappears and the screen is the whole viewport.
 */
export default function PhoneFrame({
  children,
  className,
  buzzing = false,
}: {
  children: ReactNode;
  className?: string;
  /** Shake gently every few seconds (desktop only, never under reduced motion). */
  buzzing?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const desktop = useIsDesktop();
  const shake = buzzing && desktop && !reduce;

  return (
    <motion.div
      className={cn(
        "relative w-screen h-[100dvh]",
        "lg:w-auto lg:h-[min(820px,calc(100dvh-4rem))] lg:aspect-[9/19]",
        className,
      )}
      animate={shake ? { x: [0, -3, 3, -2, 2, -1, 0], rotate: [0, -0.4, 0.4, -0.3, 0.3, 0, 0] } : { x: 0, rotate: 0 }}
      transition={
        shake
          ? { duration: 0.55, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.45, delay: 1.2 }
          : { duration: 0.2 }
      }
    >
      {/* screen glow spilling onto the desk */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 hidden rounded-[4rem] opacity-70 blur-3xl lg:block"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, hsl(var(--accent) / 0.16), transparent 70%), radial-gradient(50% 40% at 50% 70%, hsl(var(--primary) / 0.12), transparent 70%)",
        }}
      />

      {/* side buttons */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[17%] hidden h-8 w-[3px] rounded-l bg-[hsl(220_8%_24%)] lg:block" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[24%] hidden h-14 w-[3px] rounded-l bg-[hsl(220_8%_24%)] lg:block" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[32%] hidden h-14 w-[3px] rounded-l bg-[hsl(220_8%_24%)] lg:block" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[27%] hidden h-20 w-[3px] rounded-r bg-[hsl(220_8%_24%)] lg:block" />

      {/* body */}
      <div
        className={cn(
          "relative h-full w-full",
          "lg:rounded-[3rem] lg:bg-[hsl(220_12%_7%)] lg:p-[11px]",
          "lg:shadow-[0_0_0_1.5px_hsl(220_8%_26%),0_0_0_3px_hsl(220_14%_4%),0_40px_80px_-20px_hsl(220_40%_1%/0.95),0_18px_40px_-12px_hsl(220_40%_1%/0.8)]",
        )}
      >
        {/* screen */}
        <div
          className={cn(
            "relative isolate h-full w-full overflow-hidden bg-background",
            "lg:rounded-[2.35rem] lg:shadow-[inset_0_0_0_1px_hsl(220_10%_14%),0_0_24px_-6px_hsl(var(--accent)/0.25)]",
          )}
        >
          {children}

          {/* notch pill */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[10px] z-50 hidden h-[26px] w-[96px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-3 lg:flex"
          >
            <span className="h-[9px] w-[9px] rounded-full bg-[hsl(220_30%_12%)] shadow-[inset_0_0_0_2px_hsl(220_20%_6%)]" />
          </div>

          {/* glass reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 hidden lg:block"
            style={{ background: "linear-gradient(125deg, hsl(0 0% 100% / 0.045) 0%, transparent 32%)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
