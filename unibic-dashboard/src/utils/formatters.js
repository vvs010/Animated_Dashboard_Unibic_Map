export const GCOLS = ["mtdLY", "mtdLM", "mtdCM", "goLY", "goLM", "qtdLY", "qtdLQ", "qtdCQ", "goLYQ", "goLQ", "lytd", "cytd", "goCY"];

export function rowObj(a) { 
  const o = { name: a[0] }; 
  GCOLS.forEach((k, i) => o[k] = a[i + 1]); 
  return o; 
}

export const fmt = (v) => v == null ? "" : (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1));

export const pctTxt = (v) => v == null ? "" : (v > 0 ? "+" : "") + v.toFixed(1) + "%";

export function arrow(v) {
  if (v == null) return { ch: "", col: "#3c4f5c", bg: "transparent" };
  if (v > 2) return { ch: "▲", col: "#3a7d44", bg: "rgba(58,125,68,.08)" };
  if (v < -2) return { ch: "▼", col: "#c1121f", bg: "rgba(193,18,31,.08)" };
  return { ch: "▶", col: "#b8860b", bg: "rgba(184,134,11,.08)" };
}