import { useEffect, useRef, useState } from "react";

/**
 * True while the element is in (or near) the viewport and the tab is visible.
 * Used to stop WebGL canvases from rendering frames nobody can see.
 */
export function useOnScreen<T extends Element>(rootMargin = "120px") {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let intersecting = true;
    const update = () => setOnScreen(intersecting && !document.hidden);

    const io = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { rootMargin }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [rootMargin]);

  return { ref, onScreen };
}
