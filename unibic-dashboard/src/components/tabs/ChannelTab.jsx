import React from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import Reveal from '../layout/Reveal';
import MetricGrid from '../ui/MetricGrid';
import DivergingBars from '../ui/DivergingBars';

export default function ChannelTab({ D, unit }) {
  const rows = unit === "value" ? D.channel.value : D.channel.volume;
  const unitLabel = unit === "value" ? "₹ Million" : "Ton";
  const [scRef, scSeen] = useInView({ threshold: 0.12 });
  const hot = [null, ["GT"], ["MT CORE", "DEFENCE", "B2C"]];

  return (
    <div className="tab">
      <p className="finding">Of nine sales channels, <b>General Trade shows the steepest year-to-date decline</b> ({unit === "value" ? "−30.0% value" : "−32.8% volume"}). MT CORE (the largest) holds broadly flat; DEFENCE and B2C grew.</p>

      <Band no="Channel · 01" title="Nine channels, one is bleeding.">
        Every GT sales channel ranked by year-to-date growth over last year. Watch which bar runs furthest left.
      </Band>

      <div ref={scRef}>
        <Scene
          sticky={(i) => (
            <div>
              <div className="ctitle">YTD growth over last year, by channel · {unitLabel}</div>
              <DivergingBars rows={rows} seen={scSeen} hot={hot[i]} />
            </div>
          )}
          steps={[
            <><div className="kick">all nine channels</div><h3>One book, nine very different stories.</h3><p>Bars run right for growth, left for decline — each sized to YTD growth over last year.</p></>,
            <><div className="kick">general trade</div><h3><span className="neg">−30%</span> — the steepest fall in the book.</h3><p>No other channel of GT&rsquo;s scale declines this hard. This is where the investigation lives.</p></>,
            <><div className="kick">the rest</div><h3>MT CORE held; two channels grew.</h3><p>MT CORE — the largest — sits near flat, while DEFENCE and B2C posted gains. The problem is concentrated, not systemic.</p></>,
          ]}
        />
      </div>

      <Reveal>{seen => (
        <>
          <h4 className="chh">Full channel grid — month, quarter &amp; year</h4>
          <MetricGrid title="Channel" label="Channel" unit={unitLabel} rows={rows} seen={seen} />
        </>
      )}</Reveal>
    </div>
  );
}
