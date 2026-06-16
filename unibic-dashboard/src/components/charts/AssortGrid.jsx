import React from 'react';

// The 35-cell grid for ONE distributor (C12949 · Bangalore), with the two
// figures held visually apart so they can't be conflated:
//   • this distributor's own sized gap  (₹27.3 L)  — tied to the grid
//   • the region-wide total across ALL distributors (₹4.2 Cr) — separate block
// Pass `dist` (one assortGaps row) and `total` (assortTotalGap) to drive it
// from data; defaults match the notebook so existing <AssortGrid/> calls work.
export default function AssortGrid({
  seen = true,
  dist = { dist: "C12949", city: "Bangalore", carried: 1, avail: 35, gap: 27.3 },
  total = 424.4,
  distCount = 24,
}) {
  const missing = dist.avail - dist.carried;
  return (
    <div className="assort">
      <div className="agrid">
        {Array.from({ length: dist.avail }).map((_, i) => {
          const carried = i < dist.carried;
          return (
            <div
              key={i}
              className={"acell" + (carried ? " carried" : " missing")}
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "scale(1)" : "scale(.5)",
                transition: `opacity .35s ease ${i * 16}ms, transform .4s cubic-bezier(.2,.8,.3,1.4) ${i * 16}ms`,
              }}
            >
              {carried ? dist.carried : ""}
            </div>
          );
        })}
      </div>

      {/* legend for the two cell types */}
      <div className="assort-key">
        <span><i className="ak carried" /> carried ({dist.carried})</span>
        <span><i className="ak missing" /> missing ({missing})</span>
      </div>

      {/* the two figures, explicitly scoped so they can't be conflated */}
      <div className="assort-figs">
        <div className="afig">
          <div className="afig-v">−₹{dist.gap.toFixed(1)} L</div>
          <div className="afig-l">this distributor · {dist.dist} ({dist.city})<br />carries {dist.carried} of {dist.avail} families</div>
        </div>
        <div className="afig-div" />
        <div className="afig">
          <div className="afig-v afig-region">≈ ₹{(total / 100).toFixed(1)} Cr</div>
          <div className="afig-l">region-wide · summed across <b>all {distCount}+ distributors</b><br />(₹{total.toFixed(1)} L total — not this one distributor)</div>
        </div>
      </div>
      <p className="note">The grid is one illustrative distributor. Its own missing-range opportunity is
        <b> ₹{dist.gap.toFixed(1)} L</b>; the <b>₹{(total / 100).toFixed(1)} Cr</b> is the sum of every distributor&rsquo;s
        sized gap across the South, shown here only because the grid can draw one at a time.</p>
      <button
        type="button"
        className="assort-link"
        onClick={() => window.dispatchEvent(new CustomEvent("goto-gap-method"))}
      >
        See the full method &mdash; the peer-median bell curve
        <span aria-hidden="true">&nbsp;&rarr;</span>
      </button>
    </div>
  );
}
