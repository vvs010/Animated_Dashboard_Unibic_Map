import React from 'react';
import Svg from '../ui/Svg';

const SEA = "#1b6f8c";
const BAD = "#c1121f";

export default function StoryIndex({ on, IDX, FY }) {
  const W = 720, H = 400, P = { l: 55, r: 120, t: 30, b: 42 };
  const x = (i) => P.l + i * (W - P.l - P.r) / 2, y = (v) => H - P.b - ((v - 55) / 50) * (H - P.t - P.b);
  const ser = [{ n: "Value (GSV)", v: IDX.gsv, c: SEA }, { n: "Volume (tons)", v: IDX.ton, c: BAD }];

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      {[60, 70, 80, 90, 100].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="#dde4e6" />
          <text x={P.l - 10} y={y(v) + 4} textAnchor="end" className="tick">{v}</text>
        </g>
      ))}
      {FY.map((f, i) => <text key={f} x={x(i)} y={H - P.b + 24} textAnchor="middle" className="tick">{f}</text>)}
      <text x={P.l} y={P.t - 14} className="cn">Index, FY 23-24 = 100 · realisation ₹1.45 L → ₹1.72 L / ton</text>
      {ser.map((s, si) => {
        const d = s.v.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
        return (
          <g key={s.n}>
            <path d={d} fill="none" stroke={s.c} strokeWidth="3.5" strokeLinecap="round" pathLength="100" style={{ strokeDasharray: 100, strokeDashoffset: on ? 0 : 100, transition: "stroke-dashoffset 1.2s ease " + (si * 160) + "ms" }} />
            {s.v.map((v, i) => (
              <g key={i} style={{ opacity: on ? 1 : 0, transition: "opacity .4s ease " + (si * 160 + i * 220) + "ms" }}>
                <circle cx={x(i)} cy={y(v)} r="5" fill={s.c} stroke="#fff" strokeWidth="1.5" />
                <text x={x(i)} y={y(v) - 12} textAnchor="middle" className="cn" fontWeight="600">{v.toFixed(0)}</text>
              </g>
            ))}
            <text x={x(2) + 12} y={y(s.v[2]) + 4} className="slab2" fill={s.c} fontWeight="600">{s.n}</text>
          </g>
        );
      })}
    </Svg>
  );
}