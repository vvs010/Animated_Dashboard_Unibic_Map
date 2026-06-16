import React, { useState, useMemo, useEffect, useRef } from 'react';
import { rowObj, fmt, pctTxt, arrow } from '../../utils/formatters';

const REDUCE = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

// A single split-flap character (Solari / departure-board style). When `active`
// turns true, digits roll through a few random glyphs and "flip" down onto the
// final value; punctuation lands in one flip. Each settle bumps `tick`, which
// re-keys the face so the CSS flip animation replays.
function FlipChar({ target, active, delay = 0 }) {
  const ch = target == null ? '' : String(target);
  const [shown, setShown] = useState('\u00A0');
  const [tick, setTick] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const final = ch === ' ' ? '\u00A0' : ch || '\u00A0';

    if (!active) { setShown('\u00A0'); return; }
    if (REDUCE) { setShown(final); setTick((t) => t + 1); return; }

    const isDigit = ch >= '0' && ch <= '9';
    const rolls = isDigit ? 3 + Math.floor(Math.random() * 4) : 0;
    let step = 0;
    const advance = () => {
      if (step < rolls) {
        setShown(String(Math.floor(Math.random() * 10)));
        setTick((t) => t + 1);
        step += 1;
        timers.current.push(setTimeout(advance, 55));
      } else {
        setShown(final);
        setTick((t) => t + 1);
      }
    };
    timers.current.push(setTimeout(advance, delay));
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [active, ch, delay]);

  return (
    <span className="flap">
      <span className="flap-face" key={tick}>{shown}</span>
    </span>
  );
}

// Splits a formatted value into per-character flaps with a left-to-right stagger.
// Empty / null values render a muted em-dash so missing data reads as "no data"
// instead of an empty (broken-looking) cell.
function FlipValue({ text, active, base = 0, step = 26 }) {
  const s = text == null ? '' : String(text).trim();
  if (s === '') return <span className="flap-na" title="No data">—</span>;
  return (
    <span className="flap-row">
      {s.split('').map((c, i) => (
        <FlipChar key={i} target={c} active={active} delay={base + i * step} />
      ))}
    </span>
  );
}

// seen -> the board flips on first reveal; re-sorting re-flips the rows in order
export default function MetricGrid({ title, label, unit, rows, legend, seen = true }) {
  const [sortKey, setSortKey] = useState("goCY");
  const [asc, setAsc] = useState(true);

  const objs = useMemo(() => rows.map(rowObj), [rows]);
  const sorted = useMemo(() => {
    if (!sortKey) return objs;
    return [...objs].sort((x, y) => {
      const a = x[sortKey], b = y[sortKey];
      if (a == null) return 1;
      if (b == null) return -1;
      return asc ? a - b : b - a;
    });
  }, [objs, sortKey, asc]);

  const grp = [
    { label: "MONTH (MTD)", cols: [["mtdLY", "LY"], ["mtdCM", "CM"], ["goLY", "GO%"]] },
    { label: "QUARTER (QTD)", cols: [["qtdLY", "LY"], ["qtdCQ", "CQ"], ["goLYQ", "GO%"]] },
    { label: "YEAR (YTD)", cols: [["lytd", "LY"], ["cytd", "CY"], ["goCY", "GO%"]] }
  ];

  const isGO = (k) => k.startsWith("go");
  const clk = (k) => { if (sortKey === k) setAsc(!asc); else { setSortKey(k); setAsc(true); } };
  const expand = (n) => legend && legend[n] ? `${n} — ${legend[n]}` : n;

  const flatCols = grp.flatMap(g => g.cols);

  return (
    <div className="gwrap">
      <div className="gcap">
        <span className="gt">{title}</span>
        <span className="gu">Figures in {unit}</span>
      </div>
      <div className="gscroll">
        <table className="mgrid flipboard">
          <thead>
            <tr className="gh1">
              <th rowSpan={2} className="namecol">{label}</th>
              {grp.map(g => <th key={g.label} colSpan={3} className="gband">{g.label}</th>)}
            </tr>
            <tr className="gh2">
              {flatCols.map(([k, l]) => (
                <th key={k} onClick={() => clk(k)} className={"gcell sortable" + (sortKey === k ? " sorted" : "")}>
                  {l}{sortKey === k ? (asc ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const d = i * 70;
              return (
                <tr key={r.name}>
                  <td className="namecol" title={expand(r.name)}>
                    <span className="flip-name" style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : "translateX(-6px)", transition: `opacity .5s ease ${d}ms, transform .5s cubic-bezier(.2,.7,.2,1) ${d}ms` }}>{r.name}</span>
                  </td>
                  {flatCols.map(([k], ci) => {
                    const base = d + ci * 22;
                    if (isGO(k)) {
                      const ar = arrow(r[k]);
                      return (
                        <td key={k} className="num go" style={{ background: ar.bg, color: ar.col }}>
                          <span className="arr" style={{ display: "inline-block", opacity: seen ? 1 : 0, transform: seen ? "scale(1)" : "scale(.4)", transition: `opacity .3s ease ${base + 200}ms, transform .45s cubic-bezier(.2,.9,.3,1.5) ${base + 200}ms` }}>{ar.ch}</span>
                          <FlipValue text={pctTxt(r[k])} active={seen} base={base} />
                        </td>
                      );
                    }
                    return <td key={k} className="num"><FlipValue text={fmt(r[k])} active={seen} base={base} /></td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="glegend">
        LY = same period last year · CM/CQ/CY = current month/quarter/year · GO% = growth over last year ·
        <span style={{ color: "#3a7d44" }}> ▲</span> &gt;+2% <span style={{ color: "#b8860b" }}>▶</span> flat <span style={{ color: "#c1121f" }}>▼</span> &lt;−2% · click a GO% header to sort &amp; re-flip
      </div>
    </div>
  );
}
