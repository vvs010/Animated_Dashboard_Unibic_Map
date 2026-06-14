import React from 'react';
import Svg from './Svg';
import { rowObj, pctTxt } from '../../utils/formatters';

const GOOD = "#3a7d44";
const BAD = "#c1121f";
const RULE = "#dde4e6";

// seen  -> bars grow from the centre line (reveal-on-scroll)
// hot   -> name or array of names to spotlight; everything else dims
export default function DivergingBars({ rows, onPick, picked, seen = true, hot = null }) {
  const objs = rows.map(rowObj).filter(r => r.goCY != null);
  const maxAbs = Math.max(...objs.map(r => Math.abs(r.goCY)), 10);
  const cap = Math.min(maxAbs, 120);
  const W = 720, rowH = 34, P = { l: 150, r: 60 };
  const mid = (P.l + W - P.r) / 2, half = (mid - P.l);
  const H = 10 + objs.length * rowH;
  const isHot = (name) => hot && (Array.isArray(hot) ? hot.includes(name) : hot === name);

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      <line x1={mid} x2={mid} y1={10} y2={H - 10} stroke={RULE} />
      {objs.map((r, i) => {
        const y = 10 + i * rowH;
        const v = Math.max(-cap, Math.min(cap, r.goCY));
        const w = Math.abs(v) / cap * half;
        const pos = v >= 0;
        const spot = isHot(r.name);
        const dim = (picked && picked !== r.name) || (hot && !spot);
        const inside = w > 56;
        const lx = pos ? (inside ? mid + w - 6 : mid + w + 6) : (inside ? mid - w + 6 : mid - w - 6);
        const an = pos ? (inside ? "end" : "start") : (inside ? "start" : "end");
        const bw = seen ? w : 0;
        const d = i * 45;

        return (
          <g key={r.name} style={{ opacity: dim ? 0.22 : 1, cursor: onPick ? "pointer" : "default", transition: "opacity .35s ease" }} onClick={() => onPick && onPick(picked === r.name ? null : r.name)}>
            <text x={P.l - 10} y={y + rowH / 2 + 4} textAnchor="end" className="dlab" style={{ fontWeight: spot ? 700 : 400 }}>{r.name}</text>
            <rect x={pos ? mid : mid - bw} y={y + 6} width={bw} height={rowH - 12} fill={pos ? GOOD : BAD} rx={2}
              style={{ transition: `width .7s cubic-bezier(.2,.7,.2,1) ${d}ms, x .7s cubic-bezier(.2,.7,.2,1) ${d}ms` }} />
            <text x={lx} y={y + rowH / 2 + 4} textAnchor={an} className="dval" fill={inside ? "#fff" : (pos ? GOOD : BAD)}
              style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${d + 260}ms` }}>{pctTxt(r.goCY)}</text>
          </g>
        );
      })}
    </Svg>
  );
}
