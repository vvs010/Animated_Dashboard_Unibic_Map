import React from 'react';
import Svg from '../ui/Svg';
import { SCOL } from '../../data/defaultData';

// Retailer (outlet) productivity, FY 25-26 WITHIN-YEAR.
// x = outlets serviced (breadth) · y = value per outlet ₹ lakh (depth)
// bubble size = cases-bills per outlet. No YoY (capture expanded), so this
// is the shape of the current network: wide where it's shallow.
export default function RetailerProd({ states, seen = true }) {
  const W = 720, H = 420, P = { l: 64, r: 30, t: 26, b: 52 };
  const xmax = 22000, ymax = 0.18;
  const x = (v) => P.l + (v / xmax) * (W - P.l - P.r);
  const y = (v) => H - P.b - (v / ymax) * (H - P.t - P.b);

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      {[0, 0.05, 0.10, 0.15].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="#dde4e6" />
          <text x={P.l - 10} y={y(v) + 4} textAnchor="end" className="tick">₹{v.toFixed(2)}L</text>
        </g>
      ))}
      {[0, 5000, 10000, 15000, 20000].map(v => (
        <text key={v} x={x(v)} y={H - P.b + 22} textAnchor="middle" className="tick">{(v / 1000)}k</text>
      ))}
      <text x={(P.l + W - P.r) / 2} y={H - 8} textAnchor="middle" className="cn">Outlets serviced (breadth) →</text>
      <text x={P.l - 44} y={P.t - 8} className="cn">value / outlet (depth) ↑ · bubble = cases per outlet</text>
      {states.map((s, i) => {
        const right = x(s.outlets) > W - 150;
        return (
          <g key={s.state} style={{ opacity: seen ? 1 : 0, transform: seen ? "scale(1)" : "scale(.4)", transformOrigin: `${x(s.outlets)}px ${y(s.vpo)}px`, transition: `opacity .5s ease ${i * 120}ms, transform .6s cubic-bezier(.2,.8,.3,1.4) ${i * 120}ms` }}>
            <circle cx={x(s.outlets)} cy={y(s.vpo)} r={5 + s.cbo * 1.7} fill={SCOL[s.k]} opacity={0.78} stroke="#fff" strokeWidth={1.3} />
            <text x={x(s.outlets) + (right ? -(8 + s.cbo * 1.7) : (10 + s.cbo * 1.7))} y={y(s.vpo) - 6}
                  textAnchor={right ? "end" : "start"} className="slab2" fill={SCOL[s.k]} fontWeight="600">{s.state}</text>
            <text x={x(s.outlets) + (right ? -(8 + s.cbo * 1.7) : (10 + s.cbo * 1.7))} y={y(s.vpo) + 10}
                  textAnchor={right ? "end" : "start"} className="cn">{s.outlets.toLocaleString()} outlets · {s.cbo.toFixed(1)} cs</text>
          </g>
        );
      })}
    </Svg>
  );
}
