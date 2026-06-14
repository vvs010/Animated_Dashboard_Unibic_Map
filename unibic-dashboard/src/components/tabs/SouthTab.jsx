import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import Reveal from '../layout/Reveal';
import StoryStates from '../charts/StoryStates';
import StateLines from '../charts/StateLines';
import CityBars from '../charts/CityBars';
import StoryIndex from '../charts/StoryIndex';

export default function SouthTab({ D }) {
  const [st, setSt] = useState("all");
  const sel = D.states.find(s => s.k === st);
  const [scRef, scSeen] = useInView({ threshold: 0.12 });
  const opts = [["all", "All four + Kerala"], ["tn", "Tamil Nadu"], ["ka", "Karnataka"], ["s3", "AP + Telangana"], ["kl", "Kerala"]];

  return (
    <div className="tab">
      <p className="finding">A three-fiscal-year transaction view. The four states ex-Kerala fell <b>−27%</b> (−₹26.8 Cr); Kerala <b>grew +8.2%</b> on the same products. Scroll the trajectories, then isolate a state below.</p>

      <Band no="South Deep-Dive · 03" title={<>Three years.<br />Four states. One control.</>}>
        Gross Sales Value by state across three fiscal years — drawn live as you scroll. The dashed line is Kerala, the benchmark.
      </Band>

      <div ref={scRef}>
        <Scene
          sticky={(i) => (
            <div>
              <div className="ctitle">GSV by state · ₹ crore</div>
              <StoryStates mode={["all", "tn", "rest"][i]} drawn={scSeen} STATES={D.states} FY={D.fy} />
            </div>
          )}
          steps={[
            <><div className="kick">all four trajectories</div><h3>A synchronized descent.</h3><p>All three focus states peel away together, while Kerala&rsquo;s dashed line crosses above where Tamil Nadu used to be.</p></>,
            <><div className="kick">tamil nadu</div><h3><span className="neg">−₹14.3 Cr</span> from one state.</h3><p>₹47.3 → ₹33.0 Cr, −30%. More than half the southern decline sits here.</p></>,
            <><div className="kick">the rest</div><h3>Karnataka, AP + Telangana — and Kerala.</h3><p>Karnataka −25%, AP + Telangana −23%. Kerala finished bigger than TN and KA <em>combined</em>.</p></>,
          ]}
        />
      </div>

      <Reveal>{seen => (
        <>
          <h4 className="chh">Isolate a state</h4>
          <div className="chips">
            {opts.map(([k, l]) => <button key={k} className={"chip" + (st === k ? " on" : "")} onClick={() => setSt(k)}>{l}</button>)}
          </div>
          <div className="split">
            <div>
              <h4 className="chh">State GSV trajectory · ₹ crore</h4>
              <StateLines focus={st} STATES={D.states} FY={D.fy} drawn={seen} />
            </div>
            <div>
              <h4 className="chh">{st === "kl" ? "Kerala — the benchmark" : st === "all" ? "Top city loss centres · ₹ lakh" : `${sel.name} — city losses · ₹ lakh`}</h4>
              {st === "kl"
                ? <p className="note">Kerala recorded no city loss centres — it grew ₹52.4 → ₹56.7 Cr while its four neighbours lost ₹26.8 Cr combined. Used here as the control group.</p>
                : <CityBars region={st} CITIES={D.cities} seen={seen} />}
            </div>
          </div>
          {(st === "all" || st === "tn" || st === "s3") && <p className="note">Below the top ranks, ~40 towns each billing &gt;₹5 L in FY 23-24 recorded ~nothing in FY 25-26 (≈ ₹5.3 Cr former base): {D.townNames}.</p>}
        </>
      )}</Reveal>

      <Reveal>{seen => (
        <>
          <h4 className="chh">Value vs volume — the mix signal</h4>
          <p className="note">Volume fell faster than value (index 61 vs 73): realisation per ton rose as low-price packs left the mix.</p>
          <StoryIndex on={seen} IDX={D.idx} FY={D.fy} />
        </>
      )}</Reveal>
    </div>
  );
}
