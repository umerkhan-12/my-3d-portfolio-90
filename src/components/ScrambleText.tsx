import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CHARS = "!<>-_[]{}=+*^?#$%&/";
const DURATION = 600;

/**
 * Resolves `text` left-to-right out of noise over DURATION ms, so the word
 * visibly locks into place instead of sitting in unreadable glyphs.
 */
export default function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [output, setOutput] = useState(text);
  const reduced = useReducedMotion();
  const raf = useRef<number>();

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }

    const chars = text.split("");
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      // Ease-out so the tail of the word settles quickly.
      const settled = Math.floor(chars.length * (1 - Math.pow(1 - progress, 2)));

      setOutput(
        chars
          .map((char, i) => {
            if (i < settled || char === " ") return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (progress < 1) raf.current = requestAnimationFrame(tick);
      else setOutput(text);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, reduced]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{output}</span>
    </span>
  );
}
