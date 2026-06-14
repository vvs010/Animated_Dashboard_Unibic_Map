import React from 'react';
import { useInView } from '../../hooks/useInView';

/**
 * Wraps a block and reports whether it is on-screen via a render-prop.
 * Used to drive reveal-on-scroll animations (bars grow, lines draw, rows
 * cascade) on the formerly-static dashboard tabs.
 *
 *   <Reveal>{seen => <MetricGrid seen={seen} ... />}</Reveal>
 */
export default function Reveal({ children, threshold = 0.18, rootMargin = "0px 0px -10% 0px", className, style }) {
  const [ref, seen] = useInView({ threshold, rootMargin });
  return (
    <div ref={ref} className={className} style={style}>
      {typeof children === "function" ? children(seen) : children}
    </div>
  );
}
