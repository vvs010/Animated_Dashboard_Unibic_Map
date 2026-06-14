import React, { useState, useMemo } from 'react';
import { rowObj, fmt, pctTxt, arrow } from '../../utils/formatters';

// seen -> rows cascade in top-to-bottom; the GO% growth badges pop last
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

  return (
    <div className="gwrap">
      <div className="gcap">
        <span className="gt">{title}</span>
        <span className="gu">Figures in {unit}</span>
      </div>
      <div className="gscroll">
        <table className="mgrid">
          <thead>
            <tr className="gh1">
              <th rowSpan={2} className="namecol">{label}</th>
              {grp.map(g => <th key={g.label} colSpan={3} className="gband">{g.label}</th>)}
            </tr>
            <tr className="gh2">
              {grp.flatMap(g => g.cols).map(([k, l]) => (
                <th key={k} onClick={() => clk(k)} className={"gcell sortable" + (sortKey === k ? " sorted" : "")}>
                  {l}{sortKey === k ? (asc ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const d = i * 45;
              return (
                <tr key={r.name} style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(10px)", transition: `opacity .5s ease ${d}ms, transform .5s cubic-bezier(.2,.7,.2,1) ${d}ms` }}>
                  <td className="namecol" title={expand(r.name)}>{r.name}</td>
                  {grp.flatMap(g => g.cols).map(([k]) => {
                    if (isGO(k)) {
                      const ar = arrow(r[k]);
                      return (
                        <td key={k} className="num go" style={{ background: ar.bg, color: ar.col }}>
                          <span style={{ display: "inline-block", opacity: seen ? 1 : 0, transform: seen ? "scale(1)" : "scale(.4)", transition: `opacity .3s ease ${d + 260}ms, transform .45s cubic-bezier(.2,.9,.3,1.5) ${d + 260}ms` }}>
                            <span className="arr">{ar.ch}</span>{pctTxt(r[k])}
                          </span>
                        </td>
                      );
                    }
                    return <td key={k} className="num">{fmt(r[k])}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="glegend">
        LY = same period last year · CM/CQ/CY = current month/quarter/year · GO% = growth over last year ·
        <span style={{ color: "#3a7d44" }}> ▲</span> &gt;+2% <span style={{ color: "#b8860b" }}>▶</span> flat <span style={{ color: "#c1121f" }}>▼</span> &lt;−2% · click a GO% header to sort
      </div>
    </div>
  );
}
