import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import BrandGeoGap from '../charts/BrandGeoGap';
import AssortBars from '../charts/AssortBars';

// Brand × geography cross-reference: which brand families are under-indexed
// in which cities (fair-share), plus the distributor assortment gaps that sit
// underneath. Ties to the Brand-family grid: CR is both the fastest-declining
// family (−46% YTD) and the most under-indexed geographically.
export default function BrandGeoTab({ D }) {
  const [view, setView] = useState("geo");
  const [city, setCity] = useState("all");
  const [s1Ref, s1Seen] = useInView({ threshold: 0.08 });

  const cities = ["all", ...Array.from(new Set(D.brandGeo.map(r => r.city)))
    .filter(c => ["Bangalore", "Chennai", "Hyderabad", "Mysore", "Coimbatore", "Madurai", "Mangalore"].includes(c))];

  return (
    <div className="tab">
      <p className="finding">Cross-referencing brand families against geography exposes a fair-share gap.
        The flagship <b>CR family is the single biggest under-index — ₹134 L in Bangalore alone</b> (4.8% of the
        city mix versus a 15.9% regional benchmark). Notably, CR is also the fastest-declining family in the
        period (−46% YTD), so the geographic gap and the trend point the same way.</p>

      <div className="chips">
        <button className={"chip" + (view === "geo" ? " on" : "")} onClick={() => setView("geo")}>Fair-share gaps</button>
        <button className={"chip" + (view === "assort" ? " on" : "")} onClick={() => setView("assort")}>Distributor assortment</button>
      </div>

      {view === "geo" && (
        <>
          <Band no="Brand × Geo · A" title="Under-indexed, by city.">
            Each row is a brand family in a city. The hollow dot is the city&rsquo;s actual share of mix; the solid
            dot is the regional benchmark. The longer the dumbbell, the bigger the rupee gap. Filter by city.
          </Band>
          <div className="chips">
            {cities.map(c => (
              <button key={c} className={"chip" + (city === c ? " on" : "")} onClick={() => setCity(c)}>
                {c === "all" ? "All cities" : c}
              </button>
            ))}
          </div>
          <div ref={s1Ref}>
            <Scene
              sticky={() => (
                <div>
                  <div className="ctitle">Brand-family fair-share gap · current FY · ₹ lakh</div>
                  <BrandGeoGap rows={D.brandGeo} seen={s1Seen} cityFilter={city} />
                </div>
              )}
              steps={[
                <><div className="kick">the CR signal</div><h3>One family. Four cities. Same gap.</h3><p>CR is under-indexed in Bangalore, Chennai, Coimbatore, Mangalore, Mysore and Ravulapalem at once — a structural under-index, not a one-city miss.</p></>,
                <><div className="kick">Bangalore</div><h3><span className="neg">₹134 L</span> on CR alone.</h3><p>Bangalore runs CR at 4.8% of mix against a 15.9% benchmark — the largest single fair-share gap in the South.</p></>,
                <><div className="kick">near-absent lines</div><h3>Some families barely exist.</h3><p>Chennai&rsquo;s OMD shows as a distribution gap — 0.9% versus a 2.0% benchmark — a line that is close to absent rather than merely under-weighted.</p></>,
              ]}
            />
          </div>
        </>
      )}

      {view === "assort" && (
        <>
          <Band no="Brand × Geo · B" title="The gap, one distributor at a time.">
            Underneath the city gaps: how many brand families each distributor actually carries versus what&rsquo;s
            available in its city. Hover a row for the missing families.
          </Band>
          <AssortBars gaps={D.assortGaps} total={D.assortTotalGap} seen={true} />
          <p className="note">Two Bangalore and Pattukkottai distributors carry just 1 of 23–35 available families.
            The summed assortment opportunity across listed distributors is ≈ ₹{D.assortTotalGap} L.</p>
        </>
      )}
    </div>
  );
}
