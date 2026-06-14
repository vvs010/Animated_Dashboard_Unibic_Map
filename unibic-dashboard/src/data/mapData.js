// src/data/mapData.js
// Builds the map's drill-down content from the SAME datasets the rest of the
// app uses (cities, cov, dists, brandGeo, assortGaps, areaZones, states) so the
// map never introduces a second source of truth. Kerala is excluded as a
// clickable subject (it is the growth benchmark, not a problem state).

export const STATE_DEFS = [
  { name: "Tamil Nadu",     k: "tn", scol: "tn", fyKey: "tn", region: "SOUTH TN",
    cities: ["Chennai","Coimbatore","Madurai","Tiruppur","Salem","Trichy","Vellore","Cuddalore","Pondicherry","Thoothukudi","Viluppuram","Tirunelveli","Kanyakumari","Pattukkottai"] },
  { name: "Karnataka",      k: "ka", scol: "ka", fyKey: "ka", region: "SOUTH KA",
    cities: ["Bangalore","Mysore","Mangalore","Udupi","Gulbarga"] },
  { name: "Andhra Pradesh", k: "ap", scol: "s3", fyKey: "s3", region: "SOUTH 3",
    cities: ["Vijayawada","Vizag","Anantapur","Srikakulam","Ravulapalem"] },
  { name: "Telangana",      k: "tg", scol: "s3", fyKey: "s3", region: "SOUTH 3",
    cities: ["Hyderabad","Warangal","Nizamabad"] },
];

const SCOL = { tn: "#d1495b", ka: "#e3870e", s3: "#00798c", ap: "#00798c", tg: "#7a5195", kl: "#2e4057" };
export const STATE_FILL = { "Tamil Nadu": SCOL.tn, "Karnataka": SCOL.ka, "Andhra Pradesh": SCOL.ap, "Telangana": SCOL.tg, "Kerala": "#cdd6d6" };

// helper: round
const r1 = (v) => Math.round(v * 10) / 10;

// Build a lookup of per-city facts from the various app arrays.
export function buildCityCards(D) {
  const out = {};
  const ensure = (n) => (out[n] ||= { name: n, facts: [], loss: null, cov: null, dists: [], gaps: [], assort: [] });

  // city loss centres (₹ lakh GSV change)
  (D.cities || []).forEach((c) => { ensure(c.n).loss = c.v; ensure(c.n).r = c.r; });

  // coverage (outlets, ₹/outlet, cases per bill)
  (D.cov || []).forEach((c) => { const o = ensure(c.n); o.cov = { outlets: c.o, perOutlet: c.d, cpb: c.c, r: c.r }; o.r ||= c.r; });

  // distributor churn (names carry "C##### · City")
  (D.dists || []).forEach((d) => {
    const city = (d.n.split("·")[1] || "").trim();
    if (city) ensure(city).dists.push({ id: d.n.split("·")[0].trim(), v: d.v, pct: d.pct });
  });

  // brand × geography fair-share gaps
  (D.brandGeo || []).forEach((g) => { ensure(g.city).gaps.push(g); });

  // distributor assortment gaps
  (D.assortGaps || []).forEach((a) => { ensure(a.city).assort.push(a); });

  return out;
}

// One-line "headline problem" per city, derived.
export function cityHeadline(card) {
  if (!card) return "No flagged issues in this view.";
  const bits = [];
  if (card.loss != null) bits.push(`GSV −₹${Math.abs(card.loss)} L`);
  if (card.cov) bits.push(`${card.cov.cpb.toFixed(2)} cases/bill`);
  if (card.dists.length) bits.push(`${card.dists.length} distributor${card.dists.length > 1 ? "s" : ""} churned`);
  if (card.gaps.length) bits.push(`${card.gaps.length} brand gap${card.gaps.length > 1 ? "s" : ""}`);
  return bits.join(" · ") || "Reference / benchmark city.";
}

// Per-state rollup card.
export function buildStateCard(D, def) {
  const st = (D.states || []).find((s) => s.k === def.fyKey);
  const reg = (D.region?.value || []).find((rr) => rr[0] === def.region);
  const zones = (D.areaZones || []).filter((z) => z.r === (def.fyKey));
  const cityList = def.cities;
  const losses = (D.cities || []).filter((c) => cityList.includes(c.n));
  const totalCityLoss = losses.reduce((s, c) => s + c.v, 0);
  const fyChg = st ? r1((st.v[2] / st.v[0] - 1) * 100) : null;
  return {
    name: def.name,
    fy: st ? st.v : null,
    fyChg,
    regionYTD: reg ? reg[13] : null,   // goCY
    zones,
    cityCount: cityList.length,
    flaggedCityLoss: totalCityLoss,
  };
}
