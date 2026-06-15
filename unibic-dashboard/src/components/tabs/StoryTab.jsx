import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { SCOL } from '../../data/defaultData';
import Scene from '../layout/Scene';
import Band from '../layout/Band';
import RankRows from '../ui/RankRows';
import MapSticky from '../charts/MapSticky';
import Waterfall from '../charts/Waterfall';
import StoryStates from '../charts/StoryStates';
import StoryIndex from '../charts/StoryIndex';
import StoryScatter from '../charts/StoryScatter';
import DistBars from '../charts/DistBars';
import AssortGrid from '../charts/AssortGrid';
import RetailerProd from '../charts/RetailerProd';
import AreaBars from '../charts/AreaBars';
import BrandGeoGap from '../charts/BrandGeoGap';
import SouthMap from '../charts/SouthMap';
import { buildCityCards, buildStateCard, STATE_DEFS } from '../../data/mapData';

function CovStickyStory({ step, D }) {
  const [filter, setFilter] = useState("all");
  if (step === 1) return (<div><div className="ctitle">Distributors lost YoY (Bangalore-led) · ₹ lakh</div><DistBars D={D} /></div>);
  if (step === 2) return (<div><div className="ctitle">Assortment held — one Bangalore distributor</div><AssortGrid /></div>);
  return (<div><div className="ctitle">Breadth vs depth · FY 25-26</div><StoryScatter filter={filter} setFilter={setFilter} COV={D.cov} /></div>);
}

// Story map: as the reader scrolls, the map auto-walks across the four states;
// the final step hands off to the full interactive Map tab.
const MAP_STEP_STATE = [null, "tn", "ka", "ap"];
function MapStory({ step, D }) {
  const cardOf = {
    city: (n) => null,
    state: (def) => buildStateCard(D, def),
  };
  const active = MAP_STEP_STATE[Math.min(step, MAP_STEP_STATE.length - 1)];
  return (
    <div>
      <div className="ctitle">Interactive map · four southern states (ex-Kerala)</div>
      <SouthMap activeState={active} activeCity={null} onState={() => {}} onCity={() => {}} cardOf={cardOf} />
    </div>
  );
}

export default function StoryTab({ D }) {
  const [hRef, hSeen] = useInView({ threshold: 0.3 });
  const a = useCountUp(30, hSeen);
  const b = useCountUp(53, hSeen);
  const c = useCountUp(8.2, hSeen, 1700);
  const [stRef, stSeen] = useInView({ threshold: 0.25 });
  const [reRef, reSeen] = useInView({ threshold: 0.1 });
  const [arRef, arSeen] = useInView({ threshold: 0.08 });
  const [bgRef, bgSeen] = useInView({ threshold: 0.08 });
  
  const VIEWS = ["cities", "blr", "towns", "packs", "rs5", "index"];
  const lossTitle = {
    cities: "City GSV change · ₹ lakh", blr: "City GSV change · ₹ lakh",
    towns: "40 towns de-serviced to zero · ₹5.3 Cr former base", packs: "Pack-family GSV change · same rupees · ₹ lakh",
    rs5: "Pack-family GSV change · same rupees · ₹ lakh", index: "Value vs volume · indexed to 100"
  };
  const cities = D.cities, packsFY = D.packsFY;
  const ROWH = 42;

  function LossSticky({ view }) {
    const isCity = view === "cities" || view === "blr", isPack = view === "packs" || view === "rs5";
    const layer = (on) => ({ position: "absolute", inset: 0, opacity: on ? 1 : 0, transition: "opacity .45s ease", pointerEvents: "none" });
    
    return (
      <div>
        <div className="ctitle">{lossTitle[view]}</div>
        <div style={{ position: "relative", height: cities.length * ROWH + 10 }}>
          <div style={layer(isCity || isPack)}>
            <div className="rankwrap" style={{ position: "relative", height: cities.length * ROWH }}>
              <RankRows items={cities} max={460} on={isCity} colorFn={(c) => SCOL[c.r]} fmtFn={(c) => `−₹${Math.abs(c.v)} L`} dimFn={(c) => view === "blr" && c.n !== "Bangalore"} />
              <RankRows items={packsFY} max={1350} on={isPack} colorFn={(p) => p.hot ? "#c1121f" : "#b56576"} fmtFn={(p) => `−₹${Math.abs(p.v)} L · ${p.pct}`} dimFn={(p) => view === "rs5" && !p.hot} />
            </div>
          </div>
          <div style={layer(view === "towns")}>
            <div className="towns">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className={"town" + (view === "towns" ? " gone" : "")} style={{ transitionDelay: i * 28 + "ms" }} />
              ))}
            </div>
            <div className="townlist">{D.townNames}</div>
          </div>
          <div style={layer(view === "index")}>
            <StoryIndex on={view === "index"} IDX={D.idx} FY={D.fy} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story">
      <header className="hero" ref={hRef}>
        <div className="eyebrow">Unibic Foods · General Trade · South India · FY 2023-24 → FY 2025-26</div>
        <h1>Two years.<br />Four states.<br /><em>₹26.8 crore gone.</em></h1>
        <p className="standfirst">General Trade is the steepest-declining channel in the book, and within it the decline is not spread evenly — it pools in four southern states, in a handful of cities, and in one entry-level pack. This is the diagnosis, end to end.</p>
        <div className="hkpis">
          <div className="hk"><div className="n neg">−{a.toFixed(0)}%</div><div className="l">GT channel, YTD value</div></div>
          <div className="hk"><div className="n">{b.toFixed(0)}%</div><div className="l">of national decline is South ex-KL</div></div>
          <div className="hk"><div className="n pos">+{c.toFixed(1)}%</div><div className="l">Kerala, same window</div></div>
        </div>
        <div className="scrollcue">Scroll to begin ↓</div>
        <div className="mascot-hero" aria-hidden="true">
          <div className="mascot-bubble">Two years of crumbs to trace.<br />Roll with me. 🛹</div>
          <img src="/mascot.png" alt="" className="mascot-img" />
        </div>
      </header>

      <Band no="Part 01 — The shape of the problem" title="Watch the South fade.">
        Gross Sales Value by state, three fiscal years on one colour scale. The darker the blue, the bigger the book. Keep your eye on the southern tip.
      </Band>
      <Scene sticky={(i) => <MapSticky fy={[0, 1, 2, 2][i]} kerala={i === 3} />}
        steps={[
          <><div className="kick">FY 2023-24 · baseline</div><h3>The South <em>was</em> the book.</h3><p>National GT GSV was <span className="fig">₹264.2 Cr</span>; the four focus states contributed <span className="fig"> ₹99.4 Cr — 37.6%</span> of all GT. The deep blues pool at the bottom.</p></>,
          <><div className="kick">FY 2024-25 · the slide</div><h3>Everyone fell. The South fell harder.</h3><p>National GSV dropped to <span className="fig">₹221.0 Cr</span> (−16%); the four states to <span className="fig"> ₹76.8 Cr</span> — a <span className="neg fig">−23%</span> single-year hit.</p></>,
          <><div className="kick">FY 2025-26 · where we landed</div><h3>−27% in two years.</h3><p>The four states closed at <span className="fig">₹72.6 Cr</span> — down <span className="neg fig">₹26.8 Cr</span>, carrying <span className="fig">53%</span> of the national decline from 12% of the footprint.</p></>,
          <><div className="kick">the control group</div><h3>Kerala didn't get the memo.</h3><p>Same products, prices, company — Kerala <em>grew</em> <span className="fig">₹52.4 → ₹56.7 Cr (+8.2%)</span>. This is an execution gap in four states, not a category problem.</p></>,
        ]} />

      <Band no="Part 02 — Accounting for the fall" title="Where did ₹50 crore go?">
        Bridge the national book from FY 23-24 to FY 25-26, brick by brick. One region built; the rest broke — and one broke most.
      </Band>
      <Scene sticky={(i) => <div><div className="ctitle">National GSV bridge · ₹ crore</div><Waterfall stage={i} WF={D.waterfall} /></div>}
        steps={[
          <><div className="kick">starting position</div><h3>₹264.2 crore on the table.</h3><p>Two years later the national GT book closed at <span className="fig">₹214.0 Cr</span> — a fall of <span className="neg fig"> −₹50.2 Cr</span>. Who contributed what?</p></>,
          <><div className="kick">first two bricks</div><h3>Kerala added; the rest leaked.</h3><p>Kerala <em>built</em> <span className="pos fig">+₹4.3 Cr</span>; everything outside the South gave up <span className="neg fig"> −₹27.7 Cr</span> — broad, diffuse softness.</p></>,
          <><div className="kick">the brick that matters</div><h3>One region. Half the hole.</h3><p>South ex-Kerala alone removed <span className="neg fig">−₹26.8 Cr</span> — <span className="fig">53%</span> of the national decline. No other block comes close.</p></>,
        ]} />

      <Band no="Part 03 — Locating the loss" title={<>No state spared.<br />One punished.</>}>
        The same three years as trajectories — watch them draw. Solid lines are the focus states; the dashed line is Kerala, the benchmark that kept climbing.
      </Band>
      <div ref={stRef}>
        <Scene sticky={(i) => <div><div className="ctitle">GSV by state · ₹ crore</div><StoryStates mode={["all", "tn", "rest"][i]} drawn={stSeen} STATES={D.states} FY={D.fy} /></div>}
          steps={[
            <><div className="kick">all four trajectories</div><h3>A synchronized descent.</h3><p>All three focus states peeled away together, while Kerala's dashed line crossed above where Tamil Nadu used to be.</p></>,
            <><div className="kick">Tamil Nadu</div><h3><span className="neg">−₹14.3 Cr</span> from one state.</h3><p>₹47.3 Cr → ₹33.0 Cr, <span className="neg fig">−30%</span>. More than half the southern decline.</p></>,
            <><div className="kick">Karnataka · AP + Telangana</div><h3>The others weren't far behind.</h3><p>Karnataka −25%, AP + Telangana −23%. Kerala finished at ₹56.7 Cr — bigger than TN and KA <em> combined</em>.</p></>,
          ]} />
      </div>

      <Band no="Part 04 — Two cuts of the same rupees" title="Half has a postcode. Half has a price tag.">
        Rank the decline by city, then re-rank the very same rupees by pack — watch the bars re-sort.
      </Band>
      <Scene sticky={(i) => <LossSticky view={VIEWS[i]} />}
        steps={[
          <><div className="kick">top 10 loss centres</div><h3>Ten cities. <span className="neg">51%</span> of the decline.</h3><p>A short, addressable list — not diffuse weakness.</p></>,
          <><div className="kick">Bangalore</div><h3><span className="neg">−₹4.4 Cr</span> in one city.</h3><p>₹16.4 → ₹12.0 Cr (−27%). Chennai −₹2.2 Cr; Pondicherry −63%.</p></>,
          <><div className="kick">below the top 10</div><h3>40 towns went to zero.</h3><p>Towns that each billing &gt;₹5 L now bill ~nothing — ₹5.3 Cr of de-serviced base.</p></>,
          <><div className="kick">now re-rank by pack</div><h3>Same rupees, sharper story.</h3><p>The geography story needed ten bars to reach half the loss. The product story needs <em>one</em>.</p></>,
          <><div className="kick">the ₹5 pack</div><h3><span className="neg">−₹13.1 Cr</span>. 49% of everything.</h3><p>RS 5 fell ₹30.0 → ₹16.9 Cr (−44%) — nearly half the decline in one entry price point.</p></>,
          <><div className="kick">the volume tell</div><h3>Volume falls <em>faster</em> than value.</h3><p>Index 73 vs 61: realisation per ton rose as low-price penetration packs exited the mix.</p></>,
        ]} />

      <Band no="Part 05 — The coverage paradox" title={<>More shops.<br />Thinner bills.</>}>
        The FY 25-26 market-coverage data holds the counterintuitive finding: reach is not the binding constraint.
      </Band>
      <Scene sticky={(i) => <CovStickyStory step={i} D={D} />}
        steps={[
          <><div className="kick">breadth vs depth</div><h3>The network is wide. The drops are shallow.</h3><p>Bangalore: 5,164 outlets at ₹33,066/outlet. But Mangalore (966 outlets, 0.53 cs/bill) and Udupi (0.52) sit in the shallow-drop zone. Tap a state chip.</p></>,
          <><div className="kick">distributor layer</div><h3>Bangalore's hole is a distributor graveyard.</h3><p>Four Bangalore distributors went from ₹5.8 Cr combined to <span className="fig">zero</span> YoY.</p></>,
          <><div className="kick">assortment</div><h3>A <span className="neg">₹4.2 Cr</span> assortment gap.</h3><p>One Bangalore distributor carries <span className="fig">1 of 35</span> brand families available in its market.</p></>,
        ]} />

      <Band no="Part 06 — The retailer layer" title={<>A wide net.<br />A thin catch.</>}>
        Drop from cities to the outlets themselves. Reach has run ahead of depth — the more shops a state serves, the less each one seems to buy. (FY 25-26 structure; outlet counts aren't compared across years.)
      </Band>
      <div ref={reRef}>
        <Scene sticky={() => <div><div className="ctitle">Outlet productivity · FY 25-26 within-year</div><RetailerProd states={D.retailerState} seen={reSeen} /></div>}
          steps={[
            <><div className="kick">breadth vs depth</div><h3>The widest network is the thinnest.</h3><p>Tamil Nadu reaches ≈20,200 outlets — the most of any state — yet earns the least per outlet. Breadth has outrun depth.</p></>,
            <><div className="kick">Karnataka holds the depth</div><h3>Fewer shops, fuller baskets.</h3><p>Karnataka serves ≈14,100 outlets but at the highest value and cases per outlet of the four. Density, not count, separates the states.</p></>,
            <><div className="kick">the read</div><h3>More outlets won't fix a thin bill.</h3><p>The binding constraint is rupees per drop, not the number of drops — the same signal the coverage scatter shows at city grain.</p></>,
          ]} />
      </div>

      <Band no="Part 07 — The sales zones" title={<>Eleven zones.<br />Ten are bleeding.</>}>
        Re-cut the decline by sales zone — invoice-derived, so the three-year comparison is clean. Each faded bar is FY 23-24; the solid bar drains to where FY 25-26 landed.
      </Band>
      <div ref={arRef}>
        <Scene sticky={() => <div><div className="ctitle">Sales zones · ₹ lakh · FY 23-24 → FY 25-26</div><AreaBars zones={D.areaZones} seen={arSeen} /></div>}
          steps={[
            <><div className="kick">the zone league table</div><h3>Loss is spread — but tilted.</h3><p>Across eleven zones the drain totals <span className="neg fig">₹2,484 L</span>. The top three zones carry nearly half of it.</p></>,
            <><div className="kick">the metro cores</div><h3>Bangalore and the TN belt lead.</h3><p>Bangalore (−₹461 L), Central TN (−₹419 L) and South TN (−₹404 L) head the table — the urban Karnataka and Tamil Nadu zones.</p></>,
            <><div className="kick">the resilient corners</div><h3>Two zones barely moved.</h3><p>Hyderabad (−5%) and Rest-of-Telangana (−1%) held flat while ROC fell −42%. The decline has a geography, even inside the South.</p></>,
          ]} />
      </div>

      <Band no="Part 08 — Brand × geography" title="The same family. The same gap. Everywhere.">
        One last cross-reference: which brand families are under-indexed where. The hollow dot is a city's actual share of mix; the solid dot is the regional benchmark. The longer the dumbbell, the bigger the rupee gap.
      </Band>
      <div ref={bgRef}>
        <Scene sticky={() => <div><div className="ctitle">Brand-family fair-share gap · current FY · ₹ lakh</div><BrandGeoGap rows={D.brandGeo} seen={bgSeen} cityFilter="all" /></div>}
          steps={[
            <><div className="kick">the CR signal</div><h3>One family, under-indexed across the map.</h3><p>The CR family trails its benchmark in Bangalore, Chennai, Coimbatore, Mangalore, Mysore and Ravulapalem at once — structural, not a one-city miss.</p></>,
            <><div className="kick">Bangalore</div><h3><span className="neg">₹134 L</span> on CR alone.</h3><p>Bangalore runs CR at 4.8% of mix against a 15.9% benchmark — the single largest fair-share gap in the South.</p></>,
            <><div className="kick">the through-line</div><h3>Trend and gap point the same way.</h3><p>CR is also the fastest-declining family in the period (−46% YTD). The brand that fell hardest is the one most missing on shelf — the diagnosis closes on itself.</p></>,
          ]} />
      </div>

      <Band no="Part 09 — The whole South, on one map" title="Now make it interactive.">
        Everything so far — states, cities, zones, distributors, brand gaps — lives on one map. Watch it sweep the four states; then open the Map tab to click any point yourself.
      </Band>
      <Scene sticky={(i) => <MapStory step={i} D={D} />}
        steps={[
          <><div className="kick">the four states</div><h3>Four states. One investigation.</h3><p>Tamil Nadu, Karnataka, Andhra Pradesh and Telangana — Kerala stays faded as the +8.2% benchmark it earned.</p></>,
          <><div className="kick">Tamil Nadu</div><h3>Zoom in, and the cities appear.</h3><p>Each state opens to its loss centres — Chennai, Coimbatore, Madurai — sized by the rupees they gave up.</p></>,
          <><div className="kick">Karnataka</div><h3>Bangalore anchors the Karnataka hole.</h3><p>One metro, the deepest single-city loss and the distributor graveyard underneath it.</p></>,
          <><div className="kick">Andhra &amp; beyond</div><h3>Every point tells on itself.</h3><p>Tap any city in the Map tab for its outlets, churned distributors and brand fair-share gaps — the full diagnosis, one click deep.</p></>,
        ]} />

      <section className="handoff">
        <div className="bno">That's the narrative</div>
        <h2 className="bh">Now explore it yourself.</h2>
      </section>
    </div>
  );
}