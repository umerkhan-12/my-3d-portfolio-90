import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [output, setOutput] = useState(text);
  const reduced = useReducedMotion();
  const frame = useRef(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }
    frame.current = 0;
    const queue = text.split("").map((c, i) => ({
      char: c,
      start: i * 2,
      end: i * 2 + 12 + Math.floor(Math.random() * 12),
    }));

    const tick = () => {
      let done = 0;
      let out = "";
      for (const q of queue) {
        if (frame.current >= q.end) {
          done++;
          out += q.char;
        } else if (frame.current >= q.start) {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        } else {
          out += " ";
        }
      }
      setOutput(out);
      frame.current++;
      if (done < queue.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, reduced]);

  return (
    <span className={className} aria-label={text}>
      {output}
    </span>
  );
}
