import React, { useRef, useState, useEffect } from 'react';

export default function Scene({ steps, sticky }) {
  const ref = useRef(null); 
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = ref.current; 
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => es.forEach(e => { 
      if (e.isIntersecting) setActive(+e.target.dataset.i); 
    }), { rootMargin: "-45% 0px -45% 0px" });
    root.querySelectorAll(".step").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  
  return (
    <section className="scene" ref={ref}>
      <div className="steps">
        {steps.map((s, i) => (
          <div key={i} className={"step" + (i === active ? " is-active" : "")} data-i={i}>
            <div className="scard">{s}</div>
          </div>
        ))}
      </div>
      <div className="sticky">
        <div className="frame">{sticky(active)}</div>
      </div>
    </section>
  );
}