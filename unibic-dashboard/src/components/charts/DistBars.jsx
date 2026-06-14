import React from 'react';
import Svg from '../ui/Svg';

// seen -> bars grow + labels cascade in
export default function DistBars({ D, seen = true }) {
  const W = 720, rowH = 44, P = { l: 185, r: 120, t: 6 }, max = 245;
  const H = 6 + D.dists.length * rowH + 6;
  const x = (v) => (Math.abs(v) / max) * (W - P.l - P.r);

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      {D.dists.map((d, i) => {
        const y = P.t + i * rowH, dl = i * 60;
        return (
          <g key={d.n}>
            <text x={P.l - 10} y={y + rowH / 2 + 4} textAnchor="end" className="mono12" style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${dl}ms` }}>{d.n}</text>
            <rect x={P.l} y={y + 9} width={seen ? x(d.v) : 0} height={rowH - 18} fill={d.pct === "-100%" ? "#c1121f" : "#b56576"} rx={2} style={{ transition: `width .7s cubic-bezier(.2,.7,.2,1) ${dl + 80}ms` }} />
            <text x={P.l + x(d.v) + 8} y={y + rowH / 2 + 4} className="cn" fontWeight="600" style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${dl + 300}ms` }}>−₹{Math.abs(d.v)} L · {d.pct}</text>
          </g>
        );
      })}
    </Svg>
  );
}
