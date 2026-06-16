import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MAP } from '../../data/mapGeo';
import { STATE_DEFS, STATE_FILL } from '../../data/mapData';

// Interactive South-India map. Click a state -> the viewBox eases in to frame
// it and its cities fade/scale in; click a city -> it becomes the active point
// (its drill-down panel is rendered by the parent, below the map). Click the
// background (or "Back") to zoom back out. Kerala is drawn faded and inert.
const SCOL = { tn: "#d1495b", ka: "#e3870e", s3: "#00798c", kl: "#2e4057" };
const INK = "#10212b";

// city name -> state def (so a city click can infer its state)
const CITY_STATE = {};
STATE_DEFS.forEach((s) => s.cities.forEach((c) => (CITY_STATE[c] = s)));

function bboxOfPath(d) {
  // parse the M/L coordinate pairs to get a bounding box
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums) return null;
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = +nums[i], y = +nums[i + 1];
    if (x < minx) minx = x; if (x > maxx) maxx = x;
    if (y < miny) miny = y; if (y > maxy) maxy = y;
  }
  return { minx, miny, maxx, maxy };
}

export default function SouthMap({ activeState, activeCity, onState, onCity, cardOf }) {
  const [vw, vh] = MAP.viewBox;
  const fullVB = useMemo(() => ({ x: 0, y: 0, w: vw, h: vh }), [vw, vh]);
  const [vb, setVb] = useState(fullVB);
  const [hover, setHover] = useState(null);
  const rafRef = useRef(null);

  // smoothly animate the viewBox between framings
  const animateTo = (target) => {
    cancelAnimationFrame(rafRef.current);
    const start = { ...vb }, t0 = performance.now(), dur = 720;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVb({
        x: start.x + (target.x - start.x) * e,
        y: start.y + (target.y - start.y) * e,
        w: start.w + (target.w - start.w) * e,
        h: start.h + (target.h - start.h) * e,
      });
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // when activeState changes, reframe
  useEffect(() => {
    if (!activeState) { animateTo(fullVB); return; }
    const def = STATE_DEFS.find((s) => s.k === activeState);
    const bb = bboxOfPath(MAP.states[def.name]);
    if (!bb) return;
    const padX = (bb.maxx - bb.minx) * 0.18, padY = (bb.maxy - bb.miny) * 0.18;
    // keep aspect close to the panel by expanding the smaller dim
    let x = bb.minx - padX, y = bb.miny - padY;
    let w = (bb.maxx - bb.minx) + padX * 2, h = (bb.maxy - bb.miny) + padY * 2;
    const aspect = vw / vh;
    if (w / h > aspect) { const nh = w / aspect; y -= (nh - h) / 2; h = nh; }
    else { const nw = h * aspect; x -= (nw - w) / 2; w = nw; }
    animateTo({ x, y, w, h });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeState]);

  const zoom = fullVB.w / vb.w; // >1 when zoomed in
  const citiesToShow = activeState
    ? Object.entries(MAP.cities).filter(([n]) => CITY_STATE[n] && CITY_STATE[n].k === activeState)
    : [];

  const orderedStates = ["Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Tamil Nadu"];

  return (
    <div className="smap-wrap">
      <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="smap-svg"
           onClick={() => { if (activeState) { onCity(null); onState(null); } }}>
        {/* faint graticule backdrop */}
        <rect x={fullVB.x} y={fullVB.y} width={fullVB.w} height={fullVB.h} fill="transparent" />

        {orderedStates.map((name) => {
          const def = STATE_DEFS.find((s) => s.name === name);
          const isKerala = name === "Kerala";
          const sel = def && def.k === activeState;
          const dim = activeState && !sel && !isKerala;
          const hot = hover === name && !isKerala;
          const fill = STATE_FILL[name] || "#ccc";
          return (
            <g key={name}>
              <path
                d={MAP.states[name]}
                fill={fill}
                fillOpacity={isKerala ? 0.18 : sel ? 0.9 : dim ? 0.16 : hot ? 0.72 : 0.5}
                stroke="#ffffff"
                strokeWidth={sel ? 1.4 : 1.1}
                style={{
                  cursor: isKerala ? "default" : "pointer",
                  transition: "fill-opacity .4s ease",
                  filter: sel ? "drop-shadow(0 6px 14px rgba(16,33,43,.25))"
                    : hot ? "drop-shadow(0 4px 10px rgba(16,33,43,.18))" : "none",
                }}
                onClick={(e) => {
                  if (isKerala) return;
                  e.stopPropagation();
                  onCity(null);
                  onState(def.k === activeState ? null : def.k);
                }}
                onMouseEnter={() => setHover(name)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}

        {/* state labels when zoomed OUT */}
        {!activeState && orderedStates.filter((n) => n !== "Kerala").map((name) => {
          const bb = bboxOfPath(MAP.states[name]);
          if (!bb) return null;
          const cx = (bb.minx + bb.maxx) / 2, cy = (bb.miny + bb.maxy) / 2;
          const def = STATE_DEFS.find((s) => s.name === name);
          const card = cardOf && cardOf.state ? cardOf.state(def) : null;
          return (
            <g key={"lab" + name} style={{ pointerEvents: "none" }}>
              <text x={cx} y={cy} textAnchor="middle" className="smap-state-lab">{name}</text>
              {card && card.fyChg != null && (
                <text x={cx} y={cy + 26} textAnchor="middle" className="smap-state-sub">
                  {card.fyChg > 0 ? "+" : ""}{card.fyChg}% · 3-FY
                </text>
              )}
            </g>
          );
        })}
        {/* Kerala tag always */}
        {(() => {
          const bb = bboxOfPath(MAP.states["Kerala"]);
          if (!bb) return null;
          const cx = (bb.minx + bb.maxx) / 2, cy = (bb.miny + bb.maxy) / 2;
          return <text x={cx} y={cy} textAnchor="middle" className="smap-kl-lab" style={{ pointerEvents: "none" }}>Kerala<tspan x={cx} dy="22" className="smap-kl-sub">+8.2% · benchmark</tspan></text>;
        })()}

        {/* city points (only when a state is active) */}
        {citiesToShow.map(([n, [x, y, st]]) => {
          const card = cardOf && cardOf.city ? cardOf.city(n) : null;
          const isActive = activeCity === n;
          const isHover = hover === "city:" + n;
          const lift = isActive || isHover;
          const loss = card && card.loss != null ? Math.abs(card.loss) : 0;
          // size by loss but with a clearer floor so every point is easy to hit
          const rad = (5 + Math.min(loss, 460) / 460 * 6) / zoom;
          // generous invisible tap/click target around each point
          const hit = Math.max(rad * 2.6, 17 / zoom);
          const flagged = card && (card.loss != null || (card.dists && card.dists.length) || (card.gaps && card.gaps.length));
          const col = SCOL[st] || INK;
          // flagged points keep their label visible so users know what to drill into
          const showLab = isActive || isHover || flagged || zoom > 2.2;
          return (
            <g key={n} className="smap-pt"
               onClick={(e) => { e.stopPropagation(); onCity(isActive ? null : n); }}
               onMouseEnter={() => setHover("city:" + n)}
               onMouseLeave={() => setHover(null)}>
              {/* generous transparent hit area */}
              <circle cx={x} cy={y} r={hit} fill="transparent" style={{ cursor: "pointer" }} />

              {/* pulse + ring on the active point */}
              {isActive && <circle cx={x} cy={y} r={rad * 2.6} fill={col} opacity={0.16} className="smap-pulse" />}
              {isActive && <circle cx={x} cy={y} r={rad + 5.5 / zoom} fill="none" stroke={col} strokeWidth={2.2 / zoom} />}

              {/* halo so a flagged, clickable point reads as tappable */}
              {flagged && !isActive && (
                <circle cx={x} cy={y} r={rad + (isHover ? 5 : 3.5) / zoom} fill="none"
                        stroke={col} strokeOpacity={isHover ? 0.6 : 0.32} strokeWidth={1.6 / zoom}
                        style={{ transition: "r .2s ease" }} />
              )}

              <circle cx={x} cy={y} r={lift ? rad * 1.4 : rad}
                      fill={flagged ? col : "#aeb6ba"} fillOpacity={flagged ? 1 : 0.66}
                      stroke="#fff" strokeWidth={1.8 / zoom}
                      className="smap-city"
                      style={{
                        cursor: "pointer",
                        filter: lift ? `drop-shadow(0 ${3 / zoom}px ${6 / zoom}px rgba(16,33,43,.35))` : "none",
                      }} />

              {showLab && (
                <text x={x} y={y - (rad * 1.5 + 7 / zoom)} textAnchor="middle"
                      className={"smap-city-lab" + (isActive ? " on" : "")}
                      style={{ pointerEvents: "none", fontSize: (isActive ? 15 : 13) / zoom + "px" }}>{n}</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* floating controls */}
      <div className="smap-controls">
        {activeState ? (
          <button className="smap-btn" onClick={() => { onCity(null); onState(null); }}>← All states</button>
        ) : (
          <span className="smap-hint">Tap a state to zoom in</span>
        )}
        {activeState && <span className="smap-hint">Tap a coloured point to drill down ↓</span>}
      </div>
    </div>
  );
}
