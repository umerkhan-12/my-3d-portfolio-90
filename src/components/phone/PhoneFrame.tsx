import { useEffect, useMemo, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
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

/** Layout viewport in px; the mobile phone is sized from it so framer can tween the size. */
function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const update = () => setVp(read());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return vp;
}

/** Closed phone below `lg`: ~80% of the width, 9:19, always leaving desk above and below. */
function closedSize(vw: number, vh: number) {
  const w = Math.min(vw * 0.8, ((vh - 112) * 9) / 19);
  return { w, h: (w * 19) / 9 };
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The device. On `lg+` it is a phone on the desk: dark body, thin metal edge,
 * side buttons, a notch pill and a soft screen glow. Below `lg` it is the same
 * phone, smaller and bezelled, while closed; once `opened` it grows to fill the
 * viewport and the bezel fades away so the chat has every pixel.
 */
export default function PhoneFrame({
  children,
  className,
  buzzing = false,
  opened = false,
}: {
  children: ReactNode;
  className?: string;
  /** Shake gently every few seconds (never under reduced motion). */
  buzzing?: boolean;
  /** Below `lg`: fill the viewport with no bezel. Ignored on desktop. */
  opened?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const desktop = useIsDesktop();
  const shake = buzzing && !reduce;

  // Mobile size/bezel as motion values, so the grow-to-fullscreen is one tween.
  const vp = useViewport();
  const target = useMemo(() => {
    if (opened) return { w: vp.w, h: vp.h, bz: 0 };
    return { ...closedSize(vp.w, vp.h), bz: 1 };
  }, [opened, vp.w, vp.h]);
  const w = useMotionValue(target.w);
  const h = useMotionValue(target.h);
  const bz = useMotionValue(target.bz); // 1 = bezel drawn, 0 = none
  const pad = useTransform(bz, (v) => v * 7);
  const bodyRadius = useTransform(bz, (v) => v * 30);
  const screenRadius = useTransform(bz, (v) => v * 23);
  useEffect(() => {
    const t = reduce ? { duration: 0 } : { duration: 0.5, ease: EASE };
    const runs = [animate(w, target.w, t), animate(h, target.h, t), animate(bz, target.bz, t)];
    return () => runs.forEach((r) => r.stop());
  }, [target, reduce, w, h, bz]);
  const mobile = !desktop;

  return (
    <motion.div
      className={cn(
        "relative",
        "lg:w-auto lg:h-[min(820px,calc(100dvh-4rem))] lg:aspect-[9/19]",
        className,
      )}
      // "" (not undefined) so framer clears the inline value when crossing into desktop
      style={{ width: mobile ? w : "", height: mobile ? h : "" }}
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
      <motion.div
        style={{ padding: mobile ? pad : "", borderRadius: mobile ? bodyRadius : "" }}
        className={cn(
          "relative h-full w-full",
          "lg:rounded-[3rem] lg:bg-[hsl(220_12%_7%)] lg:p-[11px]",
          "lg:shadow-[0_0_0_1.5px_hsl(220_8%_26%),0_0_0_3px_hsl(220_14%_4%),0_40px_80px_-20px_hsl(220_40%_1%/0.95),0_18px_40px_-12px_hsl(220_40%_1%/0.8)]",
        )}
      >
        {/* mobile bezel: drawn on its own layer so it can fade out when the chat opens */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[hsl(220_12%_7%)] lg:hidden"
          style={{
            opacity: bz,
            borderRadius: bodyRadius,
            boxShadow:
              "0 0 0 1.5px hsl(220 8% 26%), 0 0 0 3px hsl(220 14% 4%), 0 28px 50px -18px hsl(220 40% 1% / 0.95)",
          }}
        />

        {/* screen */}
        <motion.div
          style={{ borderRadius: mobile ? screenRadius : "" }}
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
