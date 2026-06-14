import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import Band from '../layout/Band';
import Scene from '../layout/Scene';
import Reveal from '../layout/Reveal';
import MetricGrid from '../ui/MetricGrid';
import DivergingBars from '../ui/DivergingBars';

function BrandFamLegend({ legend, rows }) {
  const codes = rows.map(r => r[0]);
  const shown = codes.filter(c => legend && legend[c]);
  return (
    <div className="bfl">
      <div className="bfl-h">Brand-family codes{shown.length < codes.length ? " · expand the rest in data.json → brandfamLegend" : ""}</div>
      <div className="bfl-grid">
        {codes.map(c => (
          <div key={c} className="bfl-item">
            <span className="bfl-code">{c}</span>
            <span className="bfl-name">{legend && legend[c] ? legend[c] : <i>set in data.json</i>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrandPackTab({ D, unit }) {
  const [view, setView] = useState("pack");
  const map = { pack: D.pack, brand: D.brand, brandfam: D.brandfam };
  const rows = unit === "value" ? map[view].value : map[view].volume;
  const packRows = unit === "value" ? D.pack.value : D.pack.volume;
  const titles = { pack: "Pack Family", brand: "Brand", brandfam: "Brand Family" };
  const unitLabel = unit === "value" ? "₹ Million" : "Ton";
  const [scRef, scSeen] = useInView({ threshold: 0.12 });
  const hot = [null, ["RS 5", "PRIMIUM RS 10"], ["DISPLAY"]];

  const finding = {
    pack: <>By pack family, entry price points fell hardest: <b>PRIMIUM RS 10 (−68.3%)</b> and <b>RS 5 (−54.2%)</b> YTD value; DISPLAY (+34.8%) and SUPER SAVER grew.</>,
    brand: <>By brand, the largest line <b>INDULGENCE is −11.0%</b> YTD value; SNACK BARS (−47.7%) and ASRT (−34.9%) fell hardest in %.</>,
    brandfam: <>By brand family (codes as in the source), <b>CR is −46.0%</b> and CHN −59.6% YTD value, while CC and CB — the two largest — hold near −8%. Hover a code for its expansion.</>,
  };

  return (
    <div className="tab">
      <p className="finding">{finding[view]}</p>

      <Band no="Brand & Pack · 04" title="Half has a price tag.">
        The same GT decline cut by what was sold. Entry price points carry it — watch the pack bars run left.
      </Band>

      <div ref={scRef}>
        <Scene
          sticky={(i) => (
            <div>
              <div className="ctitle">Pack-family YTD growth · {unitLabel}</div>
              <DivergingBars rows={packRows} seen={scSeen} hot={hot[i]} />
            </div>
          )}
          steps={[
            <><div className="kick">all pack families</div><h3>Sold-by-pack tells the sharpest story.</h3><p>Pack families ranked by YTD growth. The entry price points sit far left.</p></>,
            <><div className="kick">entry price points</div><h3><span className="neg">−54%</span> and <span className="neg">−68%</span>.</h3><p>RS 5 and PRIMIUM RS 10 — the cheapest, highest-penetration packs — fell hardest. This is the ₹5-pack collapse from the story.</p></>,
            <><div className="kick">what grew</div><h3><span className="pos">+35%</span> — DISPLAY.</h3><p>DISPLAY and SUPER SAVER grew. The mix is shifting away from low-price entry packs.</p></>,
          ]}
        />
      </div>

      <Reveal>{seen => (
        <>
          <h4 className="chh">Explore by pack, brand or brand family</h4>
          <div className="chips">
            <button className={"chip" + (view === "pack" ? " on" : "")} onClick={() => setView("pack")}>Pack family</button>
            <button className={"chip" + (view === "brand" ? " on" : "")} onClick={() => setView("brand")}>Brand</button>
            <button className={"chip" + (view === "brandfam" ? " on" : "")} onClick={() => setView("brandfam")}>Brand family</button>
          </div>
          <MetricGrid title={titles[view]} label={titles[view]} unit={unitLabel} rows={rows} seen={seen} legend={view === "brandfam" ? D.brandfamLegend : null} />
          {view === "brandfam" && <BrandFamLegend legend={D.brandfamLegend} rows={rows} />}
        </>
      )}</Reveal>

      <Reveal>{seen => (
        <>
          <h4 className="chh">YTD growth — {titles[view]}</h4>
          <DivergingBars rows={rows} seen={seen} />
        </>
      )}</Reveal>
    </div>
  );
}
