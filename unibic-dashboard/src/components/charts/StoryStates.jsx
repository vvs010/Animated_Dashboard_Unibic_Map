import React from 'react';
import Svg from '../ui/Svg';

export default function StoryStates({ mode, drawn, STATES, FY }) {
  const W = 720, H = 440, P = { l: 60, r: 150, t: 20, b: 40 }, ymax = 6000;
  const x = (i) => P.l + i * (W - P.l - P.r) / 2, y = (v) => H - P.b - (v / ymax) * (H - P.t - P.b);
  const dimOf = (k) => mode === "tn" ? k !== "tn" : mode === "rest" ? k === "tn" : false;

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      {[0, 1, 2, 3, 4, 5, 6].map(g => (
        <g key={g}>
          <line x1={P.l} x2={W - P.r} y1={y(g * 1000)} y2={y(g * 1000)} stroke="#dde4e6" />
          <text x={P.l - 10} y={y(g * 1000) + 4} textAnchor="end" className="tick">{g * 10}</text>
        </g>
      ))}
      {FY.map((f, i) => <text key={f} x={x(i)} y={H - P.b + 24} textAnchor="middle" className="tick">{f}</text>)}
      <text x={P.l - 44} y={P.t - 4} className="cn">₹ Cr</text>
      {STATES.map((st, si) => {
        const d = st.v.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
        const chg = ((st.v[2] / st.v[0] - 1) * 100).toFixed(0), dim = dimOf(st.k);
        return (
          <g key={st.k} style={{ opacity: dim ? 0.15 : 1, transition: "opacity .45s ease" }}>
            <path d={d} fill="none" stroke={st.col} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={st.dash ? "7 6" : "none"} pathLength="100" style={st.dash ? {} : { strokeDasharray: 100, strokeDashoffset: drawn ? 0 : 100, transition: "stroke-dashoffset 1.3s ease " + (si * 140) + "ms" }} />
            {st.v.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="5" fill={st.col} stroke="#fff" strokeWidth="1.5" style={{ opacity: drawn ? 1 : 0, transition: "opacity .4s ease " + (si * 140 + i * 220) + "ms" }} />)}
            <text x={x(2) + 12} y={y(st.v[2]) + 4 + st.lo} className="slab2" fill={st.col} fontWeight="600">{st.name}</text>
            <text x={x(2) + 12} y={y(st.v[2]) + 20 + st.lo} className="cn">{(chg > 0 ? "+" : "") + chg + "%"}</text>
          </g>
        );
      })}
    </Svg>
  );
}