# Unibic GT — South India Investigation (scrollytelling dashboard)

A React + Vite story-and-dashboard. The **Story** tab was already a scroll-told
narrative; this version brings the **same scrollytelling treatment to all five
formerly-static tabs** (Channel, GT Region, South Deep-Dive, Brand & Pack,
Coverage) while keeping every interaction intact.

## Run

```bash
npm install
npm run dev      # start Vite dev server
npm run build    # production build to dist/
```

Optionally serve a `public/data.json` next to the app to override the embedded
defaults (its values are used live).

## What changed for the animation pass

Each static tab now opens with an editorial **band**, then a sticky-chart
**scene** whose narration advances as you scroll, then reveal-on-scroll data
sections. Specifically:

- **Channel / GT Region / Brand & Pack** — a diverging-bar scene spotlights
  bars step-by-step (`<DivergingBars hot=[…] />`), then the full metric grid
  reveals with **rows cascading top-to-bottom and the GO% badges popping last**
  (`<MetricGrid seen />`). Sorting, the Value/Volume toggle, the view chips, and
  click-to-isolate all still work.
- **South Deep-Dive** — state trajectories **draw themselves** across a scene
  (`<StoryStates drawn />`), then the interactive state explorer (chips → lines
  + city bars) and the value-vs-volume index animate in.
- **Coverage** — a scatter scene progressively shades the shallow-drop zone and
  rings Mangalore/Udupi (`<StoryScatter emph />`), then a distributor-graveyard →
  assortment-gap scene.

### Implementation notes

- `src/hooks/useInView.js` now **re-triggers**: `seen` flips back to `false` when
  a section leaves the viewport, so scenes re-animate every time they return —
  and it reports `true` immediately under `prefers-reduced-motion` (final state,
  no motion). A matching CSS rule freezes the scene step-cards in that mode.
- `src/components/layout/Reveal.jsx` is a small render-prop wrapper
  (`<Reveal>{seen => …}</Reveal>`) that drives the reveal animations.
- The chart components gained backward-compatible animation props
  (`seen`, `hot`, `drawn`, `emph`) — defaults preserve the original Story-tab
  behavior, so nothing else had to change.
- Scene step tracking uses the existing `IntersectionObserver`-based
  `src/components/layout/Scene.jsx` (unchanged).

## Structure

```
src/
  App.jsx                 tabs + header + scroll progress
  components/
    layout/  Band, Scene, Reveal
    tabs/    StoryTab + the five animated tabs
    charts/  Map, Waterfall, StateLines, StoryStates, StoryIndex,
             StoryScatter, CityBars, DistBars, AssortGrid
    ui/      MetricGrid, DivergingBars, RankRows, Svg
  hooks/     useInView (re-triggering), useCountUp
  data/      defaultData.js
  index.css  all styles
```

Investigation only — no recommendations are drawn.

## Expansion — Retailer, Area Zones & Brand × Geography (MC-file analysis)

Three new dimensions were added from the MC-file analysis in the
`South_Analysis` notebooks, plus matching story scenes:

- **Retailer tab** (`RetailerTab` + `RetailerProd`) — outlet productivity for
  FY 25-26 *within-year only*. MC outlet counts are **not** compared across
  years (market-coverage capture widened between FY24-25 and FY25-26), so this
  describes the *shape* of the current network ("wide network, thin bills"),
  not a YoY change.
- **Area Zones tab** (`AreaTab` + `AreaBars`) — 11 sales zones, ₹ lakh, 3-FY.
  These are invoice-derived, so the YoY comparison is clean. Bars "drain" from
  the FY 23-24 base to FY 25-26.
- **Brand × Geo tab** (`BrandGeoTab` + `BrandGeoGap`, `AssortBars`) — brand-
  family fair-share gaps by city (dumbbell: city share vs regional benchmark)
  and distributor assortment gaps (carried vs available, with missing families
  on hover). Surfaces the CR cross-reference: CR is both the most under-indexed
  family geographically and the fastest-declining (−46% YTD).

The **Story** tab gained Parts 06–08 (retailer / area zones / brand × geo) and
a single mascot appearance in the hero. New data lives in
`src/data/defaultData.js` and `public/data.json` under keys `areaZones`,
`retailerState`, `brandGeo`, `assortGaps`, `assortTotalGap`.

Investigation only — no recommendations are drawn anywhere.

## Interactive South-India map (`Map` tab + Part 09 of the Story)

A real-geography, clickable map of the four southern states under investigation
(**Tamil Nadu, Karnataka, Andhra Pradesh, Telangana**); Kerala is drawn faded
and inert as the +8.2% growth benchmark.

- **`src/data/mapGeo.js`** — state borders pre-projected to SVG paths and city
  coordinates pre-projected to the same viewBox (derived from a simplified
  India states GeoJSON; equirectangular fit). ~22 KB, no runtime projection.
- **`src/data/mapData.js`** — joins the existing datasets (`cities`, `cov`,
  `dists`, `brandGeo`, `assortGaps`, `areaZones`, `states`) into per-state and
  per-city drill-down cards. No new source of truth.
- **`src/components/charts/SouthMap.jsx`** — the SVG map. Click a state → the
  viewBox eases in to frame it and its city points fade in; click a city → it
  becomes active (pulse ring). "← All states" zooms back out. Point size grows
  with GSV lost; flagged cities are filled, quieter ones grey.
- **`src/components/charts/MapDrill.jsx`** — the panel **below** the map: a
  state rollup (3-FY GSV, region YTD, sales zones) or a city's problems & gaps
  (GSV lost, outlets, cases/bill, distributor churn, brand fair-share gaps,
  assortment gaps).
- **`src/components/tabs/MapTab.jsx`** — wires the two together.

The Story tab gained **Part 09**, which auto-sweeps the map across the four
states on scroll and hands off to the full Map tab.

To swap in different geometry or coordinates later, regenerate `mapGeo.js`
(state paths + city `[x,y,stateKey]`) against the same viewBox; everything
else is data-driven.
