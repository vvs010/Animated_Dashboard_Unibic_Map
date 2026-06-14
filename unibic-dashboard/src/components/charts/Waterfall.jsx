import React from 'react';
import Svg from '../ui/Svg';

const INK = "#10212b";
const SOFT = "#3c4f5c";
const RULE = "#dde4e6";
const BAD = "#c1121f";

export default function Waterfall({ stage, WF }) {
  const W = 720, H = 440, P = { l: 64, r: 16, t: 34, b: 64 }, ymax = 290;
  const y = (v) => H - P.b - (v / ymax) * (H - P.t - P.b);
  const colW = (W - P.l - P.r) / WF.length, barW = colW * 0.62, cx = (i) => P.l + i * colW + colW / 2;
  const show = (id) => id === "start" ? stage >= 0 : (id === "kl" || id === "roi") ? stage >= 1 : stage >= 2;

  return (
    <Svg vb={`0 0 ${W} ${H}`}>
      {[0, 100, 200].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={RULE} />
          <text x={P.l - 10} y={y(v) + 4} textAnchor="end" className="tick">{v}</text>
        </g>
      ))}
      <text x={P.l - 44} y={P.t - 12} className="cn">₹ Cr</text>
      {WF.map((b, i) => {
        const on = show(b.id), isT = b.total !== undefined;
        const top = isT ? b.total : Math.max(b.frm, b.to), bot = isT ? 0 : Math.min(b.frm, b.to);
        const grow = (isT || b.to > b.frm) ? "center bottom" : "center top";
        const delta = isT ? null : b.to - b.frm;
        
        return (
          <g key={b.id}>
            {i > 0 && (() => {
              const pv = WF[i - 1], lv = pv.total !== undefined ? pv.total : pv.to;
              return <line x1={cx(i - 1) + barW / 2} x2={cx(i) - barW / 2} y1={y(lv)} y2={y(lv)} stroke={SOFT} strokeDasharray="3 4" style={{ opacity: on ? 0.7 : 0, transition: "opacity .5s ease .2s" }} />;
            })()}
            <rect x={cx(i) - barW / 2} y={y(top)} width={barW} height={Math.max(2, y(bot) - y(top))} fill={isT ? INK : b.col} rx={2} style={{ transformBox: "fill-box", transformOrigin: grow, transform: on ? "scaleY(1)" : "scaleY(0)", transition: "transform .8s cubic-bezier(.2,.7,.2,1) " + (i * 90) + "ms" }} />
            <text x={cx(i)} y={y(top) - 8} textAnchor="middle" className="slab" style={{ opacity: on ? 1 : 0, transition: "opacity .5s ease .45s" }}>
              {isT ? b.total.toFixed(1) : (delta > 0 ? "+" : "−") + Math.abs(delta).toFixed(1)}
            </text>
            {b.label.split("\n").map((ln, k) => <text key={k} x={cx(i)} y={H - P.b + 20 + k * 14} textAnchor="middle" className="tick">{ln}</text>)}
            {b.hot && stage >= 2 && (
              <g style={{ opacity: 1, transition: "opacity .6s ease .6s" }}>
                <rect x={cx(i) - 64} y={y(b.frm) - 56} width="128" height="36" rx="4" fill="#fff" stroke={BAD} strokeWidth="1.4" />
                <text x={cx(i)} y={y(b.frm) - 41} textAnchor="middle" fontSize="12" fontWeight="700" fill={BAD}>53% of the</text>
                <text x={cx(i)} y={y(b.frm) - 27} textAnchor="middle" fontSize="12" fontWeight="700" fill={BAD}>national decline</text>
              </g>
            )}
          </g>
        );
      })}
    </Svg>
  );
}