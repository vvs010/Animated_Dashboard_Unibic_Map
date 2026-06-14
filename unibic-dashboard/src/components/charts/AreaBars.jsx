import React from 'react';
import Svg from '../ui/Svg';
import { SCOL } from '../../data/defaultData';

// Area zones, ₹ lakh, YoY (sales-derived — clean to compare across years).
// Each row: a faded bar = FY23-24 base, a solid bar = FY25-26 current; the
// faded remainder to the right of the solid bar IS the decline. seen -> the
// solid bar "drains" back from the full base to the current level.
export default function AreaBars({ zones, seen = true, picked, onPick }) {
  const rows = [...zones].sort((a, b) => a.chg - b.chg); // worst first
  const W = 760, rowH = 40, P = { l: 124, r: 96, t: 10 }, max = 1680;
  const H = P.t + rows.length * rowH + 10;
  const x = (v) => (v / max) * (W - P.l - P.r);

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      {rows.map((z, i) => {
        const y = P.t + i * rowH, d = i * 55;
        const base = x(z.v[0]);          // FY23-24
        const cur = x(z.v[2]);           // FY25-26
        const dim = picked && picked !== z.n;
        return (
          <g key={z.n}
             style={{ opacity: dim ? 0.22 : 1, cursor: onPick ? "pointer" : "default", transition: "opacity .35s ease" }}
             onClick={() => onPick && onPick(picked === z.n ? null : z.n)}>
            <text x={P.l - 10} y={y + rowH / 2 + 4} textAnchor="end" className="dlab"
                  style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d}ms` }}>{z.n}</text>
            {/* FY23-24 base — faded full bar */}
            <rect x={P.l} y={y + 8} width={seen ? base : 0} height={rowH - 16} rx={2}
                  fill={SCOL[z.r]} opacity={0.22}
                  style={{ transition: `width .6s ease ${d}ms` }} />
            {/* the lost slice — hatched red between current and base */}
            <rect x={P.l + cur} y={y + 8} width={seen ? (base - cur) : 0} height={rowH - 16} rx={2}
                  fill="#c1121f" opacity={0.16}
                  style={{ transition: `width .8s cubic-bezier(.2,.7,.2,1) ${d + 200}ms, x .8s ease ${d + 200}ms` }} />
            {/* FY25-26 current — solid bar that drains in from the base width */}
            <rect x={P.l} y={y + 8} height={rowH - 16} rx={2} fill={SCOL[z.r]}
                  width={seen ? cur : base}
                  style={{ transition: `width .9s cubic-bezier(.45,.05,.3,1) ${d + 200}ms` }} />
            <text x={P.l + base + 8} y={y + rowH / 2 + 4} className="cn" fontWeight="600"
                  style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 500}ms` }}>
              −₹{Math.abs(z.chg)} L · {z.pct}%
            </text>
          </g>
        );
      })}
    </Svg>
  );
}
