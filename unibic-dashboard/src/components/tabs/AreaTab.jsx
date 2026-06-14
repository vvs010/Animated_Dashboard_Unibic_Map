import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import AreaBars from '../charts/AreaBars';

// Area-level (sales zones) — YoY is clean here (invoice-derived, not MC).
export default function AreaTab({ D }) {
  const [s1Ref, s1Seen] = useInView({ threshold: 0.08 });
  const [picked, setPicked] = useState(null);
  const z = D.areaZones;
  const totalLost = z.reduce((s, a) => s + a.chg, 0);

  return (
    <div className="tab">
      <p className="finding">Broken into sales zones, the decline is led by <b>Bangalore (−₹461 L, −28%)</b>,
        <b> Central TN (−₹419 L, −36%)</b> and <b>South TN (−₹404 L, −25%)</b>. Only <b>Rest-of-Telangana (ROTS)
        and Hyderabad are near-flat</b>; every other zone is down double digits. These are invoice-derived, so the
        three-year comparison is clean.</p>

      <Band no="Area · A" title={<>Eleven zones.<br />Ten are bleeding.</>}>
        Each zone&rsquo;s faded bar is FY 23-24; the solid bar drains to FY 25-26. The red remainder is what
        drained away. Tap a zone to isolate it.
      </Band>

      <div ref={s1Ref}>
        <Scene
          sticky={() => (
            <div>
              <div className="ctitle">Sales zones · ₹ lakh · FY 23-24 → FY 25-26</div>
              <AreaBars zones={z} seen={s1Seen} picked={picked} onPick={setPicked} />
            </div>
          )}
          steps={[
            <><div className="kick">the zone league table</div><h3>Loss is spread, but tilted.</h3><p>Across {z.length} sales zones, the combined drain is <span className="neg fig">₹{Math.abs(totalLost)} L</span>. The top three zones alone account for nearly half of it.</p></>,
            <><div className="kick">the metro zones</div><h3>Bangalore &amp; the TN belt lead.</h3><p>Bangalore (−₹461 L), Central TN (−₹419 L) and South TN (−₹404 L) head the table — the urban Karnataka and Tamil Nadu cores.</p></>,
            <><div className="kick">the steepest falls</div><h3><span className="neg">ROC −42%.</span> Central TN −36%.</h3><p>By percentage, Rest-of-Coastal and Central TN fell hardest. Hyderabad (−5%) and Rest-of-Telangana (−1%) barely moved — the resilient corners.</p></>,
          ]}
        />
      </div>

      <p className="note">Zone codes shown as in the source (ROC, ROKA, ROTS, AP 2/3, Bangalore UPC). Region colours
        group zones by their parent state for reading only.</p>
    </div>
  );
}
