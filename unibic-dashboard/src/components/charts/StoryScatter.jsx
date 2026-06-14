import React from 'react';
import Svg from '../ui/Svg';
import { SCOL } from '../../data/defaultData';

// seen -> bubbles scale/fade in as a cascade
// emph -> scene step (0..2): 1 deepens the shallow-drop zone, 2 rings the shallow cities
export default function StoryScatter({ filter, setFilter, COV, seen = true, emph = 0 }) {
  const W = 720, H = 450, P = { l: 70, r: 30, t: 26, b: 52 }, xmax = 5400, ymax = 36000;
  const x = (v) => P.l + (v / xmax) * (W - P.l - P.r), y = (v) => H - P.b - (v / ymax) * (H - P.t - P.b);
  const chips = [["all", "All states"], ["tn", "Tamil Nadu"], ["ka", "Karnataka"], ["s3", "AP + Telangana"]];

  return (
    <div>
      <div className="chips">
        {chips.map(([k, l]) => <button key={k} className={"chip" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{l}</button>)}
      </div>
      <Svg vb={`0 0 ${W} ${H}`}>
        {[0, 12000, 24000, 36000].map(v => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="#dde4e6" />
            <text x={P.l - 10} y={y(v) + 4} textAnchor="end" className="tick">₹{v / 1000}k</text>
          </g>
        ))}
        {[0, 1000, 2000, 3000, 4000, 5000].map(v => <text key={v} x={x(v)} y={H - P.b + 22} textAnchor="middle" className="tick">{v.toLocaleString()}</text>)}
        <text x={(P.l + W - P.r) / 2} y={H - 8} textAnchor="middle" className="cn">Serviced outlets (breadth) →</text>
        <rect x={P.l} y={y(8000)} width={W - P.l - P.r} height={H - P.b - y(8000)} fill={emph >= 1 ? "rgba(193,18,31,.12)" : "rgba(193,18,31,.06)"} style={{ transition: "fill .5s ease" }} />
        <text x={W - P.r - 8} y={y(8000) + 18} textAnchor="end" className="cn" fill="#c1121f">shallow-drop zone</text>
        {COV.map((c, i) => {
          const on = filter === "all" || c.r === filter, right = x(c.o) > W - 220;
          const ring = emph >= 2 && c.c < 0.6;
          return (
            <g key={c.n} style={{ opacity: on ? (seen ? 0.999 : 0) : 0.08, transform: seen ? "none" : "scale(.4)", transformBox: "fill-box", transformOrigin: "center", transition: `opacity .45s ease ${i * 30}ms, transform .5s cubic-bezier(.2,.8,.3,1.3) ${i * 30}ms` }}>
              {ring && <circle cx={x(c.o)} cy={y(c.d)} r={6 + c.c * 3 + 7} fill="none" stroke="#c1121f" strokeWidth="1.6" />}
              <circle cx={x(c.o)} cy={y(c.d)} r={6 + c.c * 3} fill={SCOL[c.r]} opacity="0.75" stroke="#fff" strokeWidth="1.1" />
              {c.big && <text x={x(c.o) + (right ? -14 : 10)} y={y(c.d) - 8} textAnchor={right ? "end" : "start"} className="slab3">{c.n} · {c.c.toFixed(2)} cs/bill</text>}
            </g>
          );
        })}
        <text x={P.l} y={P.t - 8} className="cn">Bubble size = cases per bill</text>
      </Svg>
    </div>
  );
}
