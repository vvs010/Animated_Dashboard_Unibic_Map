import React, { useState } from 'react';
import Svg from '../ui/Svg';

// Distributor assortment gaps, current FY. Each row: a track = families
// available in that distributor's city; a fill = families actually carried.
// seen -> fills grow. Hover/tap a row to reveal the missing families.
const GOOD = "#3a7d44", BAD = "#c1121f", RULE = "#dde4e6";

export default function AssortBars({ gaps, total, seen = true }) {
  const [hover, setHover] = useState(null);
  const rows = [...gaps].sort((a, b) => b.gap - a.gap);
  const W = 760, rowH = 46, P = { l: 150, r: 150, t: 10 };
  const H = P.t + rows.length * rowH + 10;
  const trackW = W - P.l - P.r;

  return (
    <div>
      <Svg vb={`0 0 ${W} ${H}`}>
        {rows.map((g, i) => {
          const y = P.t + i * rowH, d = i * 55;
          const frac = g.carried / g.avail;
          const fillW = frac * trackW;
          const on = hover === i;
          return (
            <g key={g.dist} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
               onClick={() => setHover(on ? null : i)} style={{ cursor: "pointer" }}>
              <text x={P.l - 10} y={y + rowH / 2} textAnchor="end" className="mono12"
                    style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d}ms` }}>{g.dist}</text>
              <text x={P.l - 10} y={y + rowH / 2 + 13} textAnchor="end" className="cn"
                    style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d}ms` }}>{g.city}</text>
              {/* available track */}
              <rect x={P.l} y={y + 12} width={trackW} height={rowH - 24} rx={3} fill={RULE} opacity={0.5} />
              {/* carried fill */}
              <rect x={P.l} y={y + 12} width={seen ? fillW : 0} height={rowH - 24} rx={3}
                    fill={frac < 0.3 ? BAD : GOOD}
                    style={{ transition: `width .8s cubic-bezier(.2,.7,.2,1) ${d + 120}ms` }} />
              <text x={P.l + 8} y={y + rowH / 2 + 4} className="dval" fill="#fff"
                    style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 400}ms` }}>
                {g.carried}/{g.avail}
              </text>
              <text x={W - P.r + 8} y={y + rowH / 2 + 4} textAnchor="start" className="dval" fill={BAD}
                    style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 400}ms` }}>
                −₹{g.gap.toFixed(1)}L
              </text>
            </g>
          );
        })}
      </Svg>
      <p className="note" style={{ minHeight: 38 }}>
        {hover != null
          ? <><b>{rows[hover].dist} · {rows[hover].city}</b> — missing families: {rows[hover].missing}</>
          : <>Hover a distributor to see its missing brand families. Total sized assortment gap across the region ≈ ₹{total} L.</>}
      </p>
    </div>
  );
}
