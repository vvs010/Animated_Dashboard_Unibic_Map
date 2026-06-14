import React from 'react';
import { cityHeadline } from '../../data/mapData';

const SCOL = { tn: "#d1495b", ka: "#e3870e", s3: "#00798c", kl: "#2e4057" };
const BAD = "#c1121f", GOOD = "#3a7d44", SEA = "#1b6f8c";

// The panel below the map. Three states:
//  - nothing selected -> a prompt + legend
//  - state selected, no city -> state rollup
//  - city selected -> the city's problems & gaps
export default function MapDrill({ stateDef, stateCard, cityName, cityCard }) {
  if (cityName) return <CityPanel name={cityName} card={cityCard} stateDef={stateDef} />;
  if (stateDef) return <StatePanel def={stateDef} card={stateCard} />;
  return (
    <div className="drill drill-empty">
      <div className="drill-empty-inner">
        <h4>Tap a state to begin.</h4>
        <p className="note">The four southern states excluding Kerala. Zoom into a state to reveal its cities;
          tap any point for the problems and gaps identified there. Point size grows with GSV lost.</p>
        <div className="drill-legend">
          <span><i className="dot" style={{ background: SCOL.tn }} /> Tamil Nadu</span>
          <span><i className="dot" style={{ background: SCOL.ka }} /> Karnataka</span>
          <span><i className="dot" style={{ background: SCOL.s3 }} /> Andhra Pradesh</span>
          <span><i className="dot" style={{ background: "#7a5195" }} /> Telangana</span>
          <span><i className="dot" style={{ background: "#cdd6d6" }} /> Kerala (benchmark, +8.2%)</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className="drill-stat">
      <div className="ds-v" style={{ color: tone === "bad" ? BAD : tone === "good" ? GOOD : "inherit" }}>{value}</div>
      <div className="ds-l">{label}</div>
    </div>
  );
}

function StatePanel({ def, card }) {
  const fy = card.fy;
  return (
    <div className="drill" key={def.k}>
      <div className="drill-head">
        <div className="drill-kicker">State · {def.region}</div>
        <h3 className="drill-title" style={{ color: SCOL[def.fyKey] }}>{def.name}</h3>
      </div>
      <div className="drill-stats">
        {fy && <Stat label="GSV FY23-24 → FY25-26 (₹ Cr)" value={`${(fy[0] / 100).toFixed(1)} → ${(fy[2] / 100).toFixed(1)}`} />}
        {card.fyChg != null && <Stat label="3-FY change" value={`${card.fyChg}%`} tone={card.fyChg < 0 ? "bad" : "good"} />}
        {card.regionYTD != null && <Stat label="GT region YTD (value)" value={`${card.regionYTD > 0 ? "+" : ""}${card.regionYTD}%`} tone={card.regionYTD < 0 ? "bad" : "good"} />}
        <Stat label="Cities in view" value={card.cityCount} />
      </div>

      {card.zones && card.zones.length > 0 && (
        <div className="drill-block">
          <div className="drill-bh">Sales zones in this state (₹ lakh, FY23-24 → 25-26)</div>
          <div className="zone-rows">
            {card.zones.slice().sort((a, b) => a.chg - b.chg).map((z) => (
              <div className="zone-row" key={z.n}>
                <span className="zr-n">{z.n}</span>
                <span className="zr-bar"><i style={{ width: Math.min(100, Math.abs(z.pct)) + "%", background: BAD }} /></span>
                <span className="zr-v">−₹{Math.abs(z.chg)} L · {z.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="note">Tap a city point on the map for its outlet, distributor and brand-gap detail.</p>
    </div>
  );
}

function Chip({ children, tone }) {
  return <span className={"drill-chip" + (tone ? " " + tone : "")}>{children}</span>;
}

function CityPanel({ name, card, stateDef }) {
  if (!card) {
    return (
      <div className="drill" key={name}>
        <div className="drill-head"><div className="drill-kicker">City</div><h3 className="drill-title">{name}</h3></div>
        <p className="note">No flagged issues for {name} in the current datasets — it sits below the top loss centres.</p>
      </div>
    );
  }
  const col = SCOL[card.r] || "#10212b";
  return (
    <div className="drill" key={name}>
      <div className="drill-head">
        <div className="drill-kicker">City · {stateDef ? stateDef.name : ""}</div>
        <h3 className="drill-title" style={{ color: col }}>{name}</h3>
        <div className="drill-headline">{cityHeadline(card)}</div>
      </div>

      <div className="drill-stats">
        {card.loss != null && <Stat label="GSV lost (₹ lakh)" value={`−₹${Math.abs(card.loss)}`} tone="bad" />}
        {card.cov && <Stat label="Outlets serviced" value={card.cov.outlets.toLocaleString()} />}
        {card.cov && <Stat label="₹ per outlet" value={`₹${(card.cov.perOutlet / 1000).toFixed(1)}k`} />}
        {card.cov && <Stat label="Cases per bill" value={card.cov.cpb.toFixed(2)} tone={card.cov.cpb < 1 ? "bad" : undefined} />}
      </div>

      {/* problems & gaps */}
      <div className="drill-cols">
        {card.dists && card.dists.length > 0 && (
          <div className="drill-block">
            <div className="drill-bh">Distributor churn</div>
            {card.dists.map((d) => (
              <div className="drill-line" key={d.id}>
                <span className="dl-id">{d.id}</span>
                <span className="dl-v" style={{ color: BAD }}>−₹{Math.abs(d.v)} L · {d.pct}</span>
              </div>
            ))}
          </div>
        )}

        {card.gaps && card.gaps.length > 0 && (
          <div className="drill-block">
            <div className="drill-bh">Brand fair-share gaps</div>
            {card.gaps.slice().sort((a, b) => b.gap - a.gap).map((g) => (
              <div className="drill-line" key={g.fam}>
                <span className="dl-id">{g.fam}{g.type === "near-absent" ? " (near-absent)" : ""}</span>
                <span className="dl-v" style={{ color: SEA }}>₹{g.gap.toFixed(1)} L · {g.share}% vs {g.bench}%</span>
              </div>
            ))}
          </div>
        )}

        {card.assort && card.assort.length > 0 && (
          <div className="drill-block">
            <div className="drill-bh">Assortment gaps</div>
            {card.assort.map((a) => (
              <div className="drill-line" key={a.dist}>
                <span className="dl-id">{a.dist} · {a.carried}/{a.avail}</span>
                <span className="dl-v" style={{ color: BAD }}>−₹{a.gap.toFixed(1)} L</span>
              </div>
            ))}
            <div className="drill-missing">missing: {card.assort.map((a) => a.missing).join(" · ")}</div>
          </div>
        )}
      </div>

      {!(card.dists?.length || card.gaps?.length || card.assort?.length) && (
        <p className="note">No distributor, brand-gap or assortment flags recorded for {name} beyond the GSV and
          coverage figures above.</p>
      )}
    </div>
  );
}
