import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import Reveal from '../layout/Reveal';
import MetricGrid from '../ui/MetricGrid';
import DivergingBars from '../ui/DivergingBars';

export default function RegionTab({ D, unit }) {
  const rows = unit === "value" ? D.region.value : D.region.volume;
  const unitLabel = unit === "value" ? "₹ Million" : "Ton";
  const [pick, setPick] = useState(null);
  const [scRef, scSeen] = useInView({ threshold: 0.12 });
  const hot = [null, ["SOUTH TN"], ["SOUTH-KL", "SOUTH KA"], ["SOUTH 3"]];

  return (
    <div className="tab">
      <p className="finding">Within GT, decline concentrates in the South: <b>SOUTH TN (−54.0%)</b>, SOUTH-KL (−31.8%), SOUTH KA (−23.4%) YTD value; <b>SOUTH 3 is the lone southern region growing (+10.1%)</b>. Click a bar in the explorer below to isolate.</p>

      <Band no="GT Region · 02" title="Within GT, the South.">
        The same nine-channel decline, split by GT region. Four of the seven are southern — and they carry the fall.
      </Band>

      <div ref={scRef}>
        <Scene
          sticky={(i) => (
            <div>
              <div className="ctitle">YTD growth over last year, by GT region · {unitLabel}</div>
              <DivergingBars rows={rows} seen={scSeen} hot={hot[i]} />
            </div>
          )}
          steps={[
            <><div className="kick">seven regions</div><h3>The South dominates the downside.</h3><p>Four of the seven GT regions are southern, and they cluster on the decline side of the axis.</p></>,
            <><div className="kick">south tn</div><h3><span className="neg">−54%</span> — the deepest cut.</h3><p>South TN alone nearly halves year-on-year — the single worst GT region in the book.</p></>,
            <><div className="kick">kl &amp; ka regions</div><h3>The decline is broad across the South.</h3><p>SOUTH-KL −31.8% and SOUTH KA −23.4% — the softness is regional, not a single outlier.</p></>,
            <><div className="kick">south 3</div><h3><span className="pos">+10.1%</span> — the lone grower.</h3><p>SOUTH 3 (AP + Telangana GT) is the only southern region adding value. Proof the channel can grow here.</p></>,
          ]}
        />
      </div>

      <Reveal>{seen => (
        <>
          <h4 className="chh">Full GT-region grid</h4>
          <MetricGrid title="GT Region" label="GT Region" unit={unitLabel} rows={rows} seen={seen} />
        </>
      )}</Reveal>

      <Reveal>{seen => (
        <>
          <h4 className="chh">Isolate a region — click any bar</h4>
          <DivergingBars rows={rows} seen={seen} onPick={setPick} picked={pick} />
        </>
      )}</Reveal>
    </div>
  );
}
