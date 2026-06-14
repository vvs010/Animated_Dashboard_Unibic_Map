import React from 'react';

const ROWH = 42;

export default function RankRows({ items, max, on, colorFn, fmtFn, dimFn }) {
  return items.map((it, i) => {
    const dim = dimFn ? dimFn(it) : false;
    return (
      <div key={it.n} className="rrow" style={{ height: ROWH, transform: `translateY(${i * ROWH}px)`, opacity: on ? (dim ? 0.15 : 1) : 0, transitionDelay: on ? i * 40 + "ms" : "0ms" }}>
        <div className="rlab">{it.n}</div>
        <div className="rtrack">
          <div className="rbar" style={{ width: on ? (Math.abs(it.v) / max * 100) + "%" : "0%", background: colorFn(it), transitionDelay: on ? i * 40 + 140 + "ms" : "0ms" }} />
        </div>
        <div className="rval">{fmtFn(it)}</div>
      </div>
    );
  });
}