import React, { useState, useEffect, useRef } from "react";
import './index.css';

import { DEFAULT_DATA } from './data/defaultData';
import StoryTab from './components/tabs/StoryTab';
import ChannelTab from './components/tabs/ChannelTab';
import RegionTab from './components/tabs/RegionTab';
import SouthTab from './components/tabs/SouthTab';
import BrandPackTab from './components/tabs/BrandPackTab';
import CoverageTab from './components/tabs/CoverageTab';
import RetailerTab from './components/tabs/RetailerTab';
import AreaTab from './components/tabs/AreaTab';
import BrandGeoTab from './components/tabs/BrandGeoTab';
import MapTab from './components/tabs/MapTab';

const TABS = [
  ["story", "Story"], ["map", "Map"], ["channel", "Channel"], ["region", "GT Region"],
  ["south", "South Deep-Dive"], ["retailer", "Retailer"], ["area", "Area Zones"],
  ["brandpack", "Brand & Pack"], ["brandgeo", "Brand × Geo"], ["coverage", "Coverage"]
];

export default function App() {
  const [tab, setTab] = useState("story");
  const [unit, setUnit] = useState("value");
  const [D, setD] = useState(DEFAULT_DATA);
  const progRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("./data.json", { cache: "no-store" });
        if (!r.ok) return;
        const j = await r.json();
        if (alive && j && j.channel && j.states) setD({ ...DEFAULT_DATA, ...j });
      } catch (e) { /* embedded fallback */ }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      if (progRef.current) progRef.current.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true }); 
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showUnit = tab !== "story" && tab !== "south" && tab !== "coverage"
    && tab !== "retailer" && tab !== "area" && tab !== "brandgeo" && tab !== "map";

  return (
    <div className="app">
      <div id="progress" ref={progRef} />
      <header className="hd">
        <div className="hd-l">
          <div className="logo">UNIBIC</div>
          <div>
            <div className="hd-title">GT Performance — South India Investigation</div>
            <div className="hd-sub">Story &amp; interactive dashboard · refreshed 30 Apr 2026</div>
          </div>
        </div>
        {showUnit && (
          <div className="seg">
            <button className={unit === "value" ? "on" : ""} onClick={() => setUnit("value")}>Value</button>
            <button className={unit === "volume" ? "on" : ""} onClick={() => setUnit("volume")}>Volume</button>
          </div>
        )}
      </header>
      
      <nav className="tabs">
        {TABS.map(([k, l]) => (
          <button key={k} className={"tabbtn" + (tab === k ? " active" : "")} onClick={() => { setTab(k); window.scrollTo(0, 0); }}>
            {l}
          </button>
        ))}
      </nav>
      
      <main className={tab === "story" ? "main-story" : "main-dash"}>
        {tab === "story" && <StoryTab D={D} />}
        {tab === "map" && <MapTab D={D} />}
        {tab === "channel" && <ChannelTab D={D} unit={unit} />}
        {tab === "region" && <RegionTab D={D} unit={unit} />}
        {tab === "south" && <SouthTab D={D} />}
        {tab === "retailer" && <RetailerTab D={D} />}
        {tab === "area" && <AreaTab D={D} />}
        {tab === "brandpack" && <BrandPackTab D={D} unit={unit} />}
        {tab === "brandgeo" && <BrandGeoTab D={D} />}
        {tab === "coverage" && <CoverageTab D={D} />}
      </main>
      
      <footer className="ft">
        <b>Data sources.</b> Story + Channel / GT Region / Brand / Pack grids replicate the CEO Power BI snapshot (period to 30 Apr 2026; ₹ Million and Ton). South Deep-Dive, Coverage, and the story's FY trajectory derive from the three-FY transaction analysis (<code>L3Y_Sales_Final.parquet</code>, 910,807 GT-core lines; ₹ lakh) and SFA market-coverage extracts. The two regimes differ in period and scale and are not summed; each view states its unit. If a <code>data.json</code> is served next to this app, its values are used live.
      </footer>
    </div>
  );
}