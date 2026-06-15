import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import StoryScatter from '../charts/StoryScatter';
import DistBars from '../charts/DistBars';
import AssortGrid from '../charts/AssortGrid';
import PeerMedianDist from '../charts/PeerMedianDist';

export default function CoverageTab({ D }) {
  const [filter, setFilter] = useState("all");
  const [s1Ref, s1Seen] = useInView({ threshold: 0.1 });
  const [s2Ref, s2Seen] = useInView({ threshold: 0.1 });

  return (
    <div className="tab">
      <p className="finding">Outlet breadth is not the binding constraint. High-coverage cities sit in the shallow-drop zone — <b>Mangalore (966 outlets, 0.53 cs/bill)</b>, Udupi (0.52) — and the Bangalore gap traces to churned distributors.</p>

      <Band no="Coverage · 05" title={<>More shops.<br />Thinner bills.</>}>
        The FY 25-26 market-coverage data. Each bubble is a city: breadth across, depth up, size = cases per bill. Tap a state chip to filter.
      </Band>

      <div ref={s1Ref}>
        <Scene
          sticky={(i) => (
            <div>
              <div className="ctitle">Breadth vs depth · FY 25-26 market-coverage</div>
              <StoryScatter filter={filter} setFilter={setFilter} COV={D.cov} seen={s1Seen} emph={i} />
            </div>
          )}
          steps={[
            <><div className="kick">breadth vs depth</div><h3>The network is wide. The drops are shallow.</h3><p>Bangalore: 5,164 outlets at ₹33,066/outlet. Reach is not the problem.</p></>,
            <><div className="kick">the shallow-drop zone</div><h3>Plenty of shops, barely a case each.</h3><p>The shaded band holds cities billing well under a case per bill — coverage without depth.</p></>,
            <><div className="kick">mangalore &amp; udupi</div><h3><span className="neg">0.53</span> and <span className="neg">0.52</span> cases per bill.</h3><p>Two high-coverage Karnataka cities sit deep in the shallow zone. The fix is depth per drop, not more outlets.</p></>,
          ]}
        />
      </div>

      <div ref={s2Ref}>
        <Scene
          sticky={(i) => (
            i === 2
              ? <div><div className="ctitle">Assortment held — one Bangalore distributor</div><AssortGrid seen={s2Seen} /></div>
              : <div><div className="ctitle">Distributors lost YoY (Bangalore-led) · ₹ lakh</div><DistBars D={D} seen={s2Seen} /></div>
          )}
          steps={[
            <><div className="kick">distributor layer</div><h3>Bangalore&rsquo;s hole is a distributor graveyard.</h3><p>Below the city totals, the loss traces to specific distributors that stopped billing.</p></>,
            <><div className="kick">₹5.8 crore to zero</div><h3><span className="fig">zero</span>.</h3><p>Four Bangalore distributors went from ₹5.8 Cr combined to nothing year-on-year.</p></>,
            <><div className="kick">assortment</div><h3><span className="neg">₹4.2 Cr</span> region-wide gap.</h3><p>Summed across all distributors. One Bangalore distributor alone carries <span className="fig">1 of 35</span> families (its own ₹27.3 L of that total).</p></>,
          ]}
        />
      </div>

      <Band no="Coverage · how the gap is sized" title="From one shelf to ₹4.2 crore.">
        The ₹27.3 L for that single distributor and the ₹4.2 Cr region-wide are the same calculation at two
        scopes. Here is the method, step by step.
      </Band>
      <PeerMedianDist
        perDistGap={(D.assortGaps && D.assortGaps[0] && D.assortGaps[0].gap) || 27.3}
        missing={D.assortGaps && D.assortGaps[0] ? (D.assortGaps[0].avail - D.assortGaps[0].carried) : 34}
        total={D.assortTotalGap || 424.4}
        distName={D.assortGaps && D.assortGaps[0] ? `${D.assortGaps[0].dist} · ${D.assortGaps[0].city}` : "C12949 · Bangalore"}
      />
    </div>
  );
}
