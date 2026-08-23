import { useReducedMotion } from "framer-motion";

/**
 * Edge-masked infinite ticker. The track is duplicated so the translate loop
 * is seamless; the copy is hidden from assistive tech.
 */
export default function Marquee({ items }: { items: string[] }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 px-6">
        {items.map((item) => (
          <span key={item} className="font-mono text-sm text-muted-foreground">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="marquee mask-fade-x group relative overflow-hidden">
      <div className="marquee-track flex w-max gap-10 group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-10" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="h-1 w-1 rounded-full bg-primary/50" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
