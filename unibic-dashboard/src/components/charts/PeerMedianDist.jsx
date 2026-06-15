import React from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';

// Animated explainer of HOW the assortment gap is sized (notebook §8.4):
//   1) For one missing family, peer distributors sell a SPREAD of GSV.
//      We read the MEDIAN — the typical peer (shown on a bell curve).
//   2) Sum the medians of all the families a distributor is missing
//      -> that distributor's gap (C12949: 34 missing -> ₹27.3 L).
//   3) Repeat for every distributor and add up -> ₹424.4 L ≈ ₹4.2 Cr.
//
// The curve is an *illustrative* normal for clarity; the notebook makes no
// distribution assumption — it takes the actual median per (city, family).
const SEA = "#1b6f8c", BAD = "#c1121f", GOOD = "#3a7d44", INK = "#10212b", SOFT = "#3c4f5c", RULE = "#dde4e6";

function normalPath(W, H, P, mu, sigma, xmin, xmax) {
  const x = (v) => P.l + (v - xmin) / (xmax - xmin) * (W - P.l - P.r);
  const pdf = (v) => Math.exp(-((v - mu) ** 2) / (2 * sigma * sigma));
  const peak = H - P.t - P.b;
  const y = (v) => H - P.b - pdf(v) * peak;
  let d = "";
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const v = xmin + (xmax - xmin) * (i / N);
    d += (i ? "L" : "M") + x(v).toFixed(1) + "," + y(v).toFixed(1) + " ";
  }
  return { d, x, y };
}

export default function PeerMedianDist({
  perDistGap = 27.3,      // ₹ L — C12949
  missing = 34,           // families missing
  total = 424.4,          // ₹ L — region-wide
  distName = "C12949 · Bangalore",
}) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const perFamily = perDistGap / missing;           // ≈ ₹0.8 L typical median
  const gapCount = useCountUp(perDistGap, seen, 1400);
  const totalCount = useCountUp(total / 100, seen, 1600);  // ₹ Cr
  const medCount = useCountUp(perFamily, seen, 1200);

  // bell curve geometry
  const W = 560, H = 230, P = { l: 30, r: 30, t: 24, b: 34 };
  const mu = perFamily, sigma = perFamily * 0.42;
  const xmin = Math.max(0, mu - sigma * 3), xmax = mu + sigma * 3;
  const { d, x, y } = normalPath(W, H, P, mu, sigma, xmin, xmax);
  // representative peer distributors sampled along the axis (illustrative)
  const peers = [-1.9, -1.2, -0.7, -0.3, 0, 0.35, 0.8, 1.3, 2.0].map((z) => mu + z * sigma);
  const medX = x(mu);

  return (
    <div className="pmd" ref={ref}>
      <div className="ctitle">How the gap is sized — peer-median method</div>

      {/* STEP 1 — the bell curve */}
      <div className="pmd-step">
        <div className="pmd-num">1</div>
        <div className="pmd-body">
          <h4 className="pmd-h">One missing family → the typical peer</h4>
          <p className="pmd-p">Among distributors in the city that <i>do</i> stock a family, GSV varies. We credit
            the <b>median</b> — the typical peer — as what a missing distributor forgoes.</p>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="pmd-svg">
            {/* baseline */}
            <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke={RULE} />
            {/* area under curve (clipped reveal) */}
            <path d={`${d} L${x(xmax)},${H - P.b} L${x(xmin)},${H - P.b} Z`} fill={SEA} opacity={seen ? 0.10 : 0}
                  style={{ transition: "opacity .8s ease .3s" }} />
            {/* the curve, drawn in */}
            <path d={d} fill="none" stroke={SEA} strokeWidth={2.4} pathLength={100}
                  style={{ strokeDasharray: 100, strokeDashoffset: seen ? 0 : 100, transition: "stroke-dashoffset 1.1s ease" }} />
            {/* peer dots dropping onto the axis */}
            {peers.map((v, i) => (
              <circle key={i} cx={x(v)} cy={H - P.b} r={4} fill={SOFT}
                      style={{ opacity: seen ? 0.8 : 0, transform: seen ? "translateY(0)" : "translateY(-14px)",
                               transition: `opacity .4s ease ${300 + i * 70}ms, transform .5s cubic-bezier(.3,.7,.3,1) ${300 + i * 70}ms` }} />
            ))}
            {/* median line sweeping to the peak */}
            <line x1={medX} x2={medX} y1={P.t - 6} y2={H - P.b} stroke={BAD} strokeWidth={2} strokeDasharray="4 4"
                  style={{ opacity: seen ? 1 : 0, transition: "opacity .5s ease 1.1s" }} />
            <circle cx={medX} cy={y(mu)} r={5.5} fill={BAD}
                    style={{ opacity: seen ? 1 : 0, transition: "opacity .4s ease 1.2s" }} />
            <text x={medX} y={P.t - 10} textAnchor="middle" className="pmd-med"
                  style={{ opacity: seen ? 1 : 0, transition: "opacity .4s ease 1.3s" }}>
              median ≈ ₹{medCount.toFixed(2)} L
            </text>
            <text x={W - P.r} y={H - 8} textAnchor="end" className="pmd-axis">peer distributor GSV for this family →</text>
          </svg>
        </div>
      </div>

      {/* STEP 2 — sum the missing families for one distributor */}
      <div className="pmd-step">
        <div className="pmd-num">2</div>
        <div className="pmd-body">
          <h4 className="pmd-h">Sum the medians this distributor is missing</h4>
          <p className="pmd-p">{distName} stocks 1 of 35 → <b>{missing} families missing</b>. Add each one&rsquo;s
            peer-median:</p>
          <div className="pmd-sum">
            <span className="pmd-eq">{missing} families × median(each)</span>
            <span className="pmd-arrow">=</span>
            <span className="pmd-res">−₹{gapCount.toFixed(1)} L</span>
            <span className="pmd-scope">this distributor</span>
          </div>
          {/* tiny stacked bars: one slim bar per missing family, summing to the gap */}
          <div className="pmd-bars">
            {Array.from({ length: missing }).map((_, i) => (
              <i key={i} style={{ opacity: seen ? 1 : 0, height: "100%",
                   transition: `opacity .25s ease ${600 + i * 18}ms` }} />
            ))}
          </div>
        </div>
      </div>

      {/* STEP 3 — sum across all distributors */}
      <div className="pmd-step">
        <div className="pmd-num">3</div>
        <div className="pmd-body">
          <h4 className="pmd-h">Repeat for every distributor, then add up</h4>
          <div className="pmd-sum">
            <span className="pmd-eq">Σ gap over all distributors</span>
            <span className="pmd-arrow">=</span>
            <span className="pmd-res pmd-region">≈ ₹{totalCount.toFixed(1)} Cr</span>
            <span className="pmd-scope">region-wide ({total.toFixed(1)} L)</span>
          </div>
        </div>
      </div>

      <p className="note pmd-caveat"><b>Read me:</b> the bell curve is an illustrative normal for clarity. The
        notebook (§8.4) assumes no distribution — it takes the <i>actual median</i> of peer-distributor GSV per
        (city, family), sums it over a distributor&rsquo;s missing families for its gap, then sums those across
        distributors for the ₹{(total / 100).toFixed(1)} Cr total. Both figures are <b>sized opportunity</b>
        (a peer-parity ceiling), not a guaranteed recovery.</p>
    </div>
  );
}
