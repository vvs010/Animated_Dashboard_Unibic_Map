import React from 'react';
import Svg from '../ui/Svg';

// Brand-family × geography fair-share gap, current FY.
// For each (city, family): a dumbbell from the city's actual mix share to the
// region benchmark share; the rupee size of the under-index is the bar label.
// seen -> the benchmark marker slides out from the city marker (gap "opens").
const SEA = "#1b6f8c", BAD = "#c1121f", AMBER = "#b8860b", SOFT = "#3c4f5c";

export default function BrandGeoGap({ rows, seen = true, cityFilter = "all" }) {
  const data = (cityFilter === "all" ? rows : rows.filter(r => r.city === cityFilter))
    .slice().sort((a, b) => b.gap - a.gap).slice(0, cityFilter === "all" ? 14 : 20);
  const W = 760, rowH = 38, P = { l: 188, r: 86, t: 18, b: 26 };
  const smax = 17; // share %
  const H = P.t + data.length * rowH + P.b;
  const x = (v) => P.l + (v / smax) * (W - P.l - P.r);

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      {/* axis ticks */}
      {[0, 4, 8, 12, 16].map(v => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={P.t - 4} y2={H - P.b + 2} stroke="#eef2f3" />
          <text x={x(v)} y={P.t - 8} textAnchor="middle" className="tick">{v}%</text>
        </g>
      ))}
      {data.map((r, i) => {
        const y = P.t + i * rowH + rowH / 2, d = i * 55;
        const cx = x(r.share), bx = x(r.bench);
        const label = `${r.city} · ${r.fam}`;
        const near = r.type === "near-absent";
        return (
          <g key={label}>
            <text x={P.l - 12} y={y + 4} textAnchor="end" className="dlab"
                  style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d}ms` }}>{label}</text>
            {/* connector: city share -> benchmark */}
            <line x1={cx} x2={seen ? bx : cx} y1={y} y2={y} stroke={near ? BAD : SEA} strokeWidth={3} strokeLinecap="round"
                  opacity={0.35}
                  style={{ transition: `x2 .8s cubic-bezier(.2,.7,.2,1) ${d + 120}ms` }} />
            {/* city actual share marker */}
            <circle cx={cx} cy={y} r={5} fill="#fff" stroke={SOFT} strokeWidth={2}
                    style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d}ms` }} />
            {/* benchmark marker (target) slides out */}
            <circle cx={seen ? bx : cx} cy={y} r={6} fill={near ? BAD : SEA}
                    style={{ transition: `cx .8s cubic-bezier(.2,.7,.2,1) ${d + 120}ms` }} />
            {/* rupee gap label */}
            <text x={W - P.r + 8} y={y + 4} textAnchor="start" className="dval" fill={near ? BAD : SEA}
                  style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 400}ms` }}>
              ₹{r.gap.toFixed(1)}L
            </text>
            {/* small share annotation */}
            <text x={cx - 8} y={y - 9} textAnchor="end" className="cn"
                  style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 300}ms` }}>{r.share}%</text>
            <text x={(seen ? bx : cx) + 9} y={y - 9} textAnchor="start" className="cn"
                  style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 500}ms` }}>{r.bench}%</text>
          </g>
        );
      })}
    </Svg>
  );
}
