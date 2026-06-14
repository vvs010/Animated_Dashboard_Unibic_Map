import { useState, useEffect, useRef } from 'react';

// Re-triggering in-view hook: seen flips true while the element is on screen
// and false once it scrolls fully out — so scroll-told sections re-animate
// every time they come back into view. Honors prefers-reduced-motion by
// reporting `true` immediately (final state, no motion).
export function useInView(opts) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduce = typeof window !== "undefined" && window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce || typeof IntersectionObserver === "undefined") { setSeen(true); return; }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setSeen(e.isIntersecting)),
      opts || { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts && opts.threshold, opts && opts.rootMargin]);

  return [ref, seen];
}
