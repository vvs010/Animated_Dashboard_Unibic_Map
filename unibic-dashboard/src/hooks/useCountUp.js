import { useState, useEffect } from 'react';

export function useCountUp(target, run, dur = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return; 
    let raf, t0;
    const tick = (t) => { 
      if (!t0) t0 = t; 
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(target * e); 
      if (p < 1) raf = requestAnimationFrame(tick); 
    };
    raf = requestAnimationFrame(tick); 
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return v;
}