import React from 'react';
import Svg from '../ui/Svg';
import { SCOL } from '../../data/defaultData';

// seen -> bars grow + labels cascade in
export default function CityBars({ region, CITIES, seen = true }) {
  const data = region === "all" ? CITIES : CITIES.filter(c => c.r === region);
  if (region === "kl") return null;
  const rows = [...data].sort((a, b) => a.v - b.v), W = 720, rowH = 34, P = { l: 120, r: 90, t: 8 }, max = 460;
  const H = 8 + rows.length * rowH + 8, x = (v) => P.l + (Math.abs(v) / max) * (W - P.l - P.r);

  return (
    <Svg vb={`0 0 ${W} ${Math.max(H, 60)}`}>
      {rows.map((c, i) => {
        const y = P.t + i * rowH, d = i * 50;
        return (
          <g key={c.n}>
            <text x={P.l - 10} y={y + rowH / 2 + 4} textAnchor="end" className="dlab" style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d}ms` }}>{c.n}</text>
            <rect x={P.l} y={y + 7} width={seen ? x(c.v) - P.l : 0} height={rowH - 14} fill={SCOL[c.r]} rx={2} style={{ transition: `width .7s cubic-bezier(.2,.7,.2,1) ${d + 80}ms` }} />
            <text x={x(c.v) + 8} y={y + rowH / 2 + 4} className="cn" fontWeight="600" style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 300}ms` }}>−₹{Math.abs(c.v)} L</text>
          </g>
        );
      })}
    </Svg>
  );
}
