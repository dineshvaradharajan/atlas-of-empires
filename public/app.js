/* Atlas of Empires — interactive historical world map, 3400 BCE – 2024 CE.
   State borders: Cliopatria, Seshat Global History Databank (CC BY 4.0).
   Peoples & cultures layer: historical-basemaps by A. Ourednik (GPL-3.0).
   Reference maps: Wikimedia Commons (per-file licences, credited in the panel). */
(() => {
"use strict";

// ---------------------------------------------------------------- constants
const REGIONS = [
  ["southern-africa", "Southern Africa", [[8, -36], [52, 2]]],
  ["northern-africa", "Northern Africa", [[-18, 0], [52, 37]]],
  ["europe", "Europe", [[-12, 35], [55, 71]]],
  ["middle-east-south-asia", "Middle East & South Asia", [[25, 5], [95, 43]]],
  ["north-central-asia", "Northern & Central Asia", [[45, 35], [180, 78]]],
  ["east-asia", "East Asia", [[73, 18], [146, 54]]],
  ["southeast-asia", "Southeast Asia", [[92, -11], [141, 28]]],
  ["northern-north-america", "Northern North America", [[-170, 50], [-15, 83]]],
  ["southern-north-america", "Southern North America", [[-125, 7], [-60, 50]]],
  ["northern-south-america", "Northern South America", [[-82, -20], [-34, 13]]],
  ["southern-cone", "Southern Cone", [[-76, -56], [-47, -18]]],
  ["australasia", "Australasia & Oceania", [[110, -48], [180, 0]]],
];
// Eras double as the power chart's windows.
const ERAS = [
  [-3400, -1200, "Bronze Age"],
  [-1200, -500, "Iron Age"],
  [-500, 300, "Classical Antiquity"],
  [300, 600, "Late Antiquity"],
  [600, 1000, "Early Middle Ages"],
  [1000, 1300, "High Middle Ages"],
  [1300, 1500, "Late Middle Ages"],
  [1500, 1800, "Early Modern"],
  [1800, 1914, "Industrial & Imperial Age"],
  [1914, 2024, "Modern World"],
];
// Piecewise-linear time axis for the era strip: recent centuries get more room.
const BREAKS = [[-3400, 0], [-1000, 0.17], [0, 0.31], [1000, 0.48], [1500, 0.64], [1800, 0.81], [2024, 1]];
// The featured great powers get these inks; everything else on the map is grey.
// 7 chart series + up to 6 more current top realms = 13 inks.
const VIVID_LIGHT = ["#1F3A5F", "#E9A93B", "#2F7D6D", "#7A5FB0", "#5E8FC4", "#C0662F", "#8FB3A3", "#B5487A", "#3B6E3B", "#4F5DA8", "#A67C00", "#2D8C9E", "#8C4A2F"];
const VIVID_DARK = ["#5B8DD6", "#E9A93B", "#3FAE96", "#9D84D6", "#86B6E3", "#E07F45", "#A9C4B6", "#D86A9C", "#6FBF6F", "#8C98E6", "#E0B23C", "#4FC1D6", "#C98A6B"];
const CULTURE_RX = /hunter|gatherer|nomad|farmer|pastoral|tribe|cultures?\b|peoples?\b|herders|fishers|foragers|^bantu|khoisan|aborigin|amerindian|neolithic|bronze age|settlers|\bclans?\b|chiefdoms/i;
const PEOPLES = new Set(["Semites", "Austronesians", "Dravidians", "Afanasevo", "Andronovo", "Yamnaya culture", "Karasuk culture",
  "Siberians", "Tibetans", "Tungus", "Tungusic Tribes", "Papuans", "Papuan", "Polynesians", "Celts", "Slavs", "Proto-Slavs", "Balts",
  "Finns", "Berbers", "Bedouins", "Vedic Aryans", "Cimerians", "Sarmates", "Illyrians", "Thai", "Malays", "Mon-Khmer", "Maoris",
  "Tupis", "Arawaks", "Thule", "Dorset", "Athabaskan", "Athabascan", "Cree", "Inuit", "Iroquois", "Tibeto-Burmanese", "Sinic",
  "Samis", "Enets", "Nenets", "Koryaks", "Chukchi", "Ainus", "Paleo-Koreans", "Samoyèdes", "Permians", "Chuds", "Veps", "Karelians",
  "Ests", "Curonians", "Mandes", "Azandes", "Cushites", "Pueblos", "Anasazi", "Mogollon", "Hohokam", "Guanches", "Arabs", "Mongols",
  "Turcik tribes", "Slavonic tribes", "Slavic tribes", "Germanic tribes", "Baltic tribes", "Anatolian tribes", "Donghu tribes",
  "Touareg", "Tuaregs", "Ainu", "Jōmon", "Valdivia", "Yayoi", "Lapita", "Chinchoros", "Scythians", "Xiongnu", "Saka", "Huns"]);
const NOT_A_REALM = /^\((Alliance|Allegiance|Personal union)/;

// ---------------------------------------------------------------- state
const S = {
  year: 1500, range: [-3400, 2024], clio: null, baseYears: [], commons: {}, corr: { realms: {}, base: {} }, supps: [],
  content: { eras: [], empires: {}, byClio: {}, moments: [], journeys: [], wars: [] }, moment: null, journey: null, rings: [], war: null,
  chunks: new Map(), bases: new Map(), windows: new Map(),
  items: [], states: [], featured: new Map(), win: null,
  t: d3.zoomIdentity, sel: null, view: "world", hover: -1, ghost: null, showGhost: true,
  labels: true, peoples: true, playing: null, width: 0, height: 0, dpr: 1, token: 0,
};
const $ = (s) => document.querySelector(s);
window.__atlas = S; // read-only handle for debugging in the console
const canvas = $("#map"), ctx = canvas.getContext("2d");
const pick = document.createElement("canvas"), pctx = pick.getContext("2d", { willReadFrequently: true });
const projection = d3.geoNaturalEarth1();
const geoPath = d3.geoPath(projection);
let sphere2d = null, grat2d = null, theme = {}, pathCache = new WeakMap();

// ---------------------------------------------------------------- helpers
const plainYear = (y) => (y < 0 ? `${-y} BCE` : `${y} CE`);
const shortYear = (y) => (y < 0 ? `${-y} BCE` : `${y}`);
const bigYear = (y) => (y < 0 ? `${-y}<small>BCE</small>` : `${y}`);
const fmtArea = (a) => a >= 1e6 ? `${(a / 1e6).toFixed(a >= 1e7 ? 1 : 2)}M km²` : a >= 1e3 ? `${Math.round(a / 1e3)}k km²` : `${Math.round(a)} km²`;
const mkm = (a) => (a / 1e6).toFixed(2);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clean = (n) => String(n || "").replace(/^\((.*)\)$/, "$1");
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const eraOf = (y) => ERAS.find((e) => y >= e[0] && y < e[1]) || ERAS[ERAS.length - 1];
const isCulture = (p) => !!p.n && !p.s && (PEOPLES.has(p.n) || CULTURE_RX.test(p.n));
const realm = (key) => S.clio.realms[key];
const empireOf = (key) => S.content.byClio[key] || null;
// Each realm keeps its own (dated) Cliopatria name; profile names can span several realms
// ("Tsardom of Russia and Russian Empire"), so they appear only inside the realm view.
const displayName = (key) => clean(key);
const areaAt = (key, y) => { const r = realm(key); const row = r && r.tl.find(([f, t]) => f <= y && y <= t); return row ? row[2] : 0; };
const matches = (it, key) => it.p.k === key || it.p.n === key;
// Period newspaper clippings and photos (events after 1850), each with its credit and licence.
function mediaHTML(key) {
  const items = (S.media || {})[key];
  if (!items?.length) return "";
  const ok = (u) => /^https:\/\//i.test(u || "");
  return `<div class="media">${items.filter((m) => ok(m.image)).map((m) => `<figure class="mfig ${m.type === "newspaper" ? "news" : "photo"}">
      <a href="${esc(m.page)}" target="_blank" rel="noopener"><img src="${esc(m.image)}" alt="${esc(m.caption || m.publication || "")}" loading="lazy"></a>
      <figcaption>${m.type === "newspaper" ? `<b>${esc(m.publication || "Newspaper")}${m.date ? `, ${esc(m.date)}` : ""}</b> · ` : ""}${esc(m.caption || "")}
      <span class="muted"> ${esc(m.credit || "")}${m.license ? ` · ${esc(m.license)}` : ""}</span></figcaption></figure>`).join("")}</div>`;
}
function sourcesList(list, title = "Sources") {
  const ok = (list || []).filter((x) => x && /^https?:\/\//i.test(x.url || ""));
  if (!ok.length) return "";
  return `<h3 class="sec">${title}</h3><ol class="refs">${ok.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title || x.url)}</a></li>`).join("")}</ol>`;
}
const vivid = () => (theme.dark ? VIVID_DARK : VIVID_LIGHT);
const RECON_COLORS = ["#C0662F", "#2F7D6D", "#7A5FB0", "#A67C00", "#5E8FC4", "#B5487A", "#3B6E3B", "#8C4A2F"];
function colorOf(key) {
  if (S.war) { const m = S.warMap || warSides(S.war, S.year); return m.has(key) ? SIDE_COLORS[m.get(key) % SIDE_COLORS.length] : [theme.other1, theme.other2, theme.other3][hash(clean(key)) % 3]; }
  if (S.reconKeys?.has(key) && key !== S.sel) { // reconstruction groups: distinct, stable inks (e.g. all Chola lands share one)
    const ks = [...S.reconKeys]; return RECON_COLORS[ks.indexOf(key) % RECON_COLORS.length];
  }
  if (S.journey) return chainKeys(S.journey, S.year).has(key) ? theme.highlight : [theme.other1, theme.other2, theme.other3][hash(clean(key)) % 3];
  if (key === S.sel) return theme.highlight;
  const i = S.featured.get(key);
  return i != null ? vivid()[i] : [theme.other1, theme.other2, theme.other3][hash(clean(key)) % 3];
}
function inkOn(hex) { // readable label colour on a fill
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? "#111111" : "#ffffff";
}
function yToPos(y) {
  for (let i = 1; i < BREAKS.length; i++) {
    const [y0, p0] = BREAKS[i - 1], [y1, p1] = BREAKS[i];
    if (y <= y1) return p0 + ((Math.max(y, y0) - y0) / (y1 - y0)) * (p1 - p0);
  }
  return 1;
}
function posToY(p) {
  p = Math.max(0, Math.min(1, p));
  for (let i = 1; i < BREAKS.length; i++) {
    const [y0, p0] = BREAKS[i - 1], [y1, p1] = BREAKS[i];
    if (p <= p1) return Math.round(y0 + ((p - p0) / (p1 - p0)) * (y1 - y0));
  }
  return BREAKS[BREAKS.length - 1][0];
}
const clampYear = (y) => Math.max(S.range[0], Math.min(S.range[1], Math.round(y))) || 1; // no year 0

function readTheme() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n) => cs.getPropertyValue(n).trim();
  const dt = document.documentElement.dataset.theme;
  theme = { ocean: v("--ocean"), grat: v("--grat"), unknown: v("--unknown"), peoplesBg: v("--peoples-bg"), peoplesLine: v("--peoples-line"),
    other1: v("--other-1"), other2: v("--other-2"), other3: v("--other-3"), border: v("--border"), highlight: v("--highlight"),
    ink: v("--ink"), ink3: v("--ink-3"), bg: v("--bg"), labelSoft: v("--label-soft"), rule: v("--rule"),
    dark: dt === "dark" };
  const c = document.createElement("canvas"); c.width = c.height = 6;
  const x = c.getContext("2d"); x.fillStyle = theme.peoplesBg; x.fillRect(0, 0, 6, 6);
  x.strokeStyle = theme.peoplesLine; x.lineWidth = 1.6; x.beginPath();
  for (let i = -6; i <= 12; i += 3) { x.moveTo(i, 6); x.lineTo(i + 6, 0); }
  x.stroke(); theme.hatch = ctx.createPattern(c, "repeat");
}

// ---------------------------------------------------------------- data
async function fetchJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); }
function memo(map, key, url, post = (x) => x) {
  if (!map.has(key)) map.set(key, fetchJSON(url).then(post).catch((e) => { map.delete(key); throw e; }));
  return map.get(key);
}
// No polygon here legitimately covers more than half the globe; reverse any ring whose
// winding makes d3 read it as "everything except this shape".
function rewind(fc) {
  for (const f of fc.features) for (const poly of f.geometry.coordinates)
    if (d3.geoArea({ type: "Polygon", coordinates: [poly[0]] }) > 2 * Math.PI) poly.forEach((r) => r.reverse());
  return fc;
}
const chunkOf = (y) => { let c = S.clio.chunks[0]; for (const s of S.clio.chunks) if (s <= y) c = s; return c; };
const loadChunk = (c) => memo(S.chunks, c, `data/clio/${c}.json`, rewind);
const baseYearFor = (y) => S.baseYears.reduce((b, v) => (Math.abs(v - y) < Math.abs(b - y) ? v : b), S.baseYears[0]);
const loadBase = (by) => memo(S.bases, by, `data/${by}.json`, rewind);

async function init() {
  readTheme();
  const [clio, base, content, commons, corr] = await Promise.all([
    fetchJSON("data/clio/index.json"), fetchJSON("data/index.json"),
    fetchJSON("data/content.json").catch(() => null), fetchJSON("data/commons.json").catch(() => ({})),
    fetchJSON("data/corrections.json").catch(() => null),
  ]);
  const supps = await fetchJSON("data/supplements.json").catch(() => []);
  S.media = await fetchJSON("data/media.json").catch(() => ({}));
  S.clio = clio; S.range = clio.range; S.baseYears = base.years; S.commons = commons;
  if (corr) { S.corr = { realms: corr.realms || {}, base: corr.base || {} }; correctTimelines(); }
  S.supps = prepareSupplements(supps);
  if (content) {
    S.content.eras = (content.eras || []).sort((a, b) => a.year - b.year);
    S.content.moments = (content.moments || []).sort((a, b) => a.year - b.year);
    S.content.journeys = content.journeys || [];
    S.content.wars = content.wars || [];
    for (const e of content.empires || []) for (const n of e.clio || []) S.content.byClio[n] = e;
  }
  buildStrip();
  setupMap();
  setupChart();
  setupSearch();
  setupUI();
  const h = parseHash();
  if (h.war && warById(h.war)) await openWar(h.war, h.wev);
  else if (h.journey && journeyById(h.journey)) await openJourney(h.journey, h.year);
  else if (h.moment && momentById(h.moment)) await openMoment(h.moment);
  else {
    await go(h.year ?? 1683);
    if (h.key && realm(h.key)) select(h.key, { fly: true });
  }
  $("#loading").classList.add("done");
  setTimeout(() => $("#loading")?.remove(), 400);
}

// ---------------------------------------------------------------- corrections layer
// content/corrections.json: reviewed fixes for known errors in the border data (see content/factcheck/BORDER-ISSUES.md).
const inRange = (y, [a, b]) => y >= a && y <= b;
const relabelCache = new WeakMap();
function correctFeature(f, y) {
  const c = S.corr.realms[f.properties.n];
  if (!c) return f;
  if (c.clip && !inRange(y, c.clip)) return null;
  if (c.hide && c.hide.some((r) => inRange(y, r))) return null;
  const ap = c.asPeople && c.asPeople.find((r) => inRange(y, [r.from, r.to]));
  if (ap) { // no state in these years: draw as a people in the hatched layer
    let byName = relabelCache.get(f);
    if (!byName) relabelCache.set(f, (byName = {}));
    return (byName["people:" + ap.name] ||= { type: "Feature", geometry: f.geometry, properties: { ...f.properties, n: ap.name, people: true, fixed: f.properties.n } });
  }
  const cr = c.crop && c.crop.find((r) => inRange(y, [r.from, r.to]));
  if (cr) { // draw only the part of the shape inside a lon/lat box (shape overreaches; see the note)
    cr.box2 ||= boxFeature(cr.box);
    let byName = relabelCache.get(f);
    if (!byName) relabelCache.set(f, (byName = {}));
    f = byName["crop:" + cr.box.join(",")] ||= { type: "Feature", geometry: f.geometry, properties: { ...f.properties, crop: cr.box2 } };
  }
  const rl = c.relabel && c.relabel.find((r) => inRange(y, [r.from, r.to]));
  if (!rl) return f;
  let byName = relabelCache.get(f);
  if (!byName) relabelCache.set(f, (byName = {}));
  // A member of an empire group (k ≠ n) stays in its group unless the correction names a group itself ("(…)").
  const k = f.properties.k !== f.properties.n && !String(rl.key).startsWith("(") ? f.properties.k : rl.key;
  return (byName[rl.name] ||= { type: "Feature", geometry: f.geometry, properties: { ...f.properties, n: rl.name, k, fixed: f.properties.n } });
}
function boxFeature([w, s, e, n]) { // a lon/lat rectangle as a densified, correctly wound polygon
  const ring = [];
  for (let x = w; x <= e; x += 1) ring.push([x, s]);
  for (let y = s; y <= n; y += 1) ring.push([e, y]);
  for (let x = e; x >= w; x -= 1) ring.push([x, n]);
  for (let y = n; y >= s; y -= 1) ring.push([w, y]);
  ring.push(ring[0]);
  const g = { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] }, properties: {} };
  if (d3.geoArea(g) > 2 * Math.PI) ring.reverse();
  return g;
}
function strokeItem(c, it) { // outline that respects the coastline/crop clip of reconstructed and cropped realms
  if (it.p.recon || it.p.crop) { c.save(); clipFor(c, it); c.stroke(pathOf(it.f)); c.restore(); }
  else c.stroke(pathOf(it.f));
}
function clipFor(c, it) { // apply the clip a feature needs (coastline for reconstructions, box for crops)
  if (it.p.recon) c.clip(S.landClip);
  if (it.p.crop) c.clip(pathOf(it.p.crop));
}
function splitRows(tl, a, b) { // rows inside [a,b] and outside it, cutting rows that straddle the edges
  const inside = [], outside = [];
  for (const [f, t, ar] of tl) {
    if (t < a || f > b) { outside.push([f, t, ar]); continue; }
    if (f < a) outside.push([f, a - 1, ar]);
    inside.push([Math.max(f, a), Math.min(t, b), ar]);
    if (t > b) outside.push([b + 1, t, ar]);
  }
  return { inside, outside };
}
function sumRows(a, b) { // piecewise sum of two area timelines
  const cuts = [...new Set([...a, ...b].flatMap(([f, t]) => [f, t + 1]))].sort((x, y) => x - y);
  const at = (tl, y) => (tl.find(([f, t]) => f <= y && y <= t) || [0, 0, 0])[2];
  const out = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const f = cuts[i], t = cuts[i + 1] - 1, v = at(a, f) + at(b, f);
    if (v > 0) out.push([f, t, v]);
  }
  return out;
}
function correctTimelines() {
  const R = S.clio.realms;
  for (const [name, c] of Object.entries(S.corr.realms)) {
    const r = R[name];
    if (!r) continue;
    if (c.clip) r.tl = splitRows(r.tl, c.clip[0], c.clip[1]).inside;
    for (const h of c.hide || []) r.tl = splitRows(r.tl, h[0], h[1]).outside;
    for (const ap of c.asPeople || []) r.tl = splitRows(r.tl, ap.from, ap.to).outside;
    for (const rl of c.relabel || []) {
      const { inside, outside } = splitRows(r.tl, rl.from, rl.to);
      r.tl = outside;
      if (!inside.length) continue;
      if (rl.addTo) { for (const t of rl.addTo) if (R[t]) R[t].tl = sumRows(R[t].tl, inside); continue; }
      if (rl.key.startsWith("(")) continue; // composite areas already come from Cliopatria
      const tgt = (R[rl.key] ||= { tl: [], fromCorrection: true });
      tgt.tl = tgt.tl.concat(inside).sort((x, y) => x[0] - y[0]);
    }
    if (!r.tl.length) delete R[name];
  }
}
const corrOf = (key) => S.corr.realms[key] || null;

// ---------------------------------------------------------------- reconstruction layers
// content/supplements/*.json: scholarly reconstructions where the border data is missing or too crude
// (e.g. Sangam-age Tamilakam). Regions are clipped to the coastline when drawn and marked as reconstructed.
function prepareSupplements(list) {
  S.reconKeys = new Set(list.flatMap((sp) => sp.regions.map((rg) => rg.key || rg.name)));
  for (const sp of list) {
    sp.feats = sp.regions.map((rg) => {
      const ring = rg.coords.map(([x, y]) => [x, y]);
      let geom = { type: "Polygon", coordinates: [ring] };
      if (d3.geoArea(geom) > 2 * Math.PI) ring.reverse();
      const area = Math.round(d3.geoArea(geom) * 6371 * 6371);
      const [lx, ly] = d3.geoCentroid(geom);
      const f = rg.from ?? sp.from, t = rg.to ?? sp.to;
      const feat = { type: "Feature", geometry: { type: "MultiPolygon", coordinates: [[ring]] },
        properties: { n: rg.name, k: rg.key || rg.name, f, t, a: area, l: [+lx.toFixed(2), +ly.toFixed(2)], recon: true, supp: sp.id } };
      const R = S.clio.realms;
      if (!R[rg.name]) R[rg.name] = { tl: [], recon: { sp, rg } };
      R[rg.name].tl.push([f, t, area]); R[rg.name].tl.sort((a, b) => a[0] - b[0]);
      return feat;
    });
  }
  return list;
}
function applySupplements(states, y) {
  const act = S.supps.filter((sp) => sp.from <= y && y <= sp.to);
  if (!act.length) return states;
  const replaced = new Set(act.flatMap((sp) => sp.replaces || []));
  return states.filter((f) => !replaced.has(f.properties.n))
    .concat(act.flatMap((sp) => sp.feats.filter((f) => f.properties.f <= y && y <= f.properties.t)));
}

// ---------------------------------------------------------------- navigation
async function go(y, opts = {}) {
  y = clampYear(y);
  if (!opts.keepMoment && S.view === "moment") { S.view = "world"; S.moment = null; } // travelling away closes the moment
  if (S.journey) y = Math.max(S.journey.span[0], Math.min(S.journey.span[1], Math.round(y))) || y; // journeys stay inside the empire's lifetime
  if (S.war && !opts.keepWar) exitWar();
  const token = ++S.token;
  S.year = y;
  const [chunk, base] = await Promise.all([loadChunk(chunkOf(y)), loadBase(baseYearFor(y))]);
  if (token !== S.token) return; // a newer year was requested while loading
  S.base = base;
  const fs = chunk.features.filter((f) => f.properties.f <= y && y <= f.properties.t).map((f) => correctFeature(f, y)).filter(Boolean);
  S.states = applySupplements(fs.filter((f) => !f.properties.people), y);
  S.extraPeoples = fs.filter((f) => f.properties.people);
  renderAll();
  writeHash();
  const n = S.clio.chunks, ci = n.indexOf(chunkOf(y));
  [n[ci - 1], n[ci + 1]].forEach((k) => k !== undefined && loadChunk(k).catch(() => {}));
}
function renderAll() {
  if (!S.base) return;
  if (S.war) { S.warMap = warSides(S.war, S.year); }
  else if (!S.journey) updateWindow();
  else if (S.jRendered !== S.journey.id) renderJourneyChart();
  computeFeatured();
  buildItems();
  S.hover = -1;
  draw();
  updateChartCursor();
  updateStrip();
  renderCol();
}
function chapterAfter(y) { return S.content.eras.find((e) => e.year > y) || null; }
function chapterFor(y) {
  let best = null;
  for (const e of S.content.eras) if (e.year <= y) best = e;
  return best || S.content.eras[0] || null;
}
// A chapter's title and rulers describe its own moment; only reuse them very close to that year.
function chapterNear(ch, y) {
  if (!ch) return false;
  const nx = chapterAfter(ch.year);
  return y - ch.year <= Math.min(5, nx ? (nx.year - ch.year) / 4 : 5);
}
function parseHash() {
  const raw = decodeURIComponent(location.hash.slice(1));
  const mm = raw.match(/^m\/(.+)$/);
  if (mm) return { year: null, key: null, moment: mm[1] };
  const wm = raw.match(/^w\/([^/]+)(?:\/(\d+))?$/);
  if (wm) return { year: null, key: null, war: wm[1], wev: wm[2] != null ? +wm[2] : 0 };
  const je = raw.match(/^e\/([^/]+)(?:\/(-?\d+))?$/);
  if (je) return { year: je[2] != null ? +je[2] : null, key: null, journey: je[1] };
  const m = raw.match(/^(-?\d+)(?:\/(.+))?$/);
  return m ? { year: +m[1], key: m[2] || null } : { year: null, key: null };
}
function writeHash() {
  const h = S.war ? `#w/${encodeURIComponent(S.war.id)}/${S.wIdx}` : S.journey ? `#e/${encodeURIComponent(S.journey.id)}/${S.year}` : S.view === "moment" && S.moment ? `#m/${encodeURIComponent(S.moment.id)}` : `#${S.year}${S.sel ? "/" + encodeURIComponent(S.sel) : ""}`;
  if (decodeURIComponent(location.hash) !== decodeURIComponent(h)) history.replaceState(null, "", h);
}

// ---------------------------------------------------------------- great powers
function isTopRealm(name) { const r = realm(name); return r && !r.memberOf && !NOT_A_REALM.test(name); }
function windowSeries(a, b) {
  const id = `${a}|${b}`;
  if (S.windows.has(id)) return S.windows.get(id);
  const N = 90, ys = Array.from({ length: N }, (_, i) => Math.round(a + (i * (b - a)) / (N - 1)));
  const cand = [];
  for (const [name, r] of Object.entries(S.clio.realms)) {
    if (!isTopRealm(name) || r.tl[0][0] > b || r.tl[r.tl.length - 1][1] < a) continue;
    const vals = ys.map((y) => areaAt(name, y));
    const score = vals.reduce((s, v) => s + v, 0);
    if (score > 0) cand.push({ key: name, vals, score });
  }
  cand.sort((x, y) => y.score - x.score);
  const series = cand.slice(0, 7);
  let max = 1;
  ys.forEach((_, i) => { max = Math.max(max, series.reduce((s, c) => s + c.vals[i], 0)); });
  const w = { a, b, ys, series, max };
  S.windows.set(id, w);
  return w;
}
function updateWindow() {
  const [a, b, label] = eraOf(S.year);
  if (S.win && S.win.a === a && S.win.b === b) return;
  S.win = windowSeries(a, b);
  S.win.label = label;
  renderChart();
}
function computeFeatured() {
  const f = new Map();
  if (!S.win) { S.featured = f; return; } // journey opened before any era window exists
  S.win.series.forEach((s, i) => f.set(s.key, i));
  let i = S.win.series.length;
  for (const r of realmsNow(true).slice(0, 6)) if (!f.has(r.key) && i < VIVID_LIGHT.length) f.set(r.key, i++);
  S.featured = f;
}
function realmsNow(raw = false) {
  const keys = new Map();
  for (const f of S.states) keys.set(f.properties.k, (keys.get(f.properties.k) || 0) + f.properties.a);
  const out = [...keys].filter(([k]) => !NOT_A_REALM.test(k)).map(([key, sum]) => ({ key, area: areaAt(key, S.year) || sum }));
  out.sort((a, b) => b.area - a.area);
  if (!raw) out.forEach((r) => (r.color = colorOf(r.key)));
  return out;
}

// ---------------------------------------------------------------- map
function pathOf(f) {
  let p = pathCache.get(f);
  if (!p) { p = new Path2D(geoPath(f) || ""); pathCache.set(f, p); }
  return p;
}
function buildItems() {
  const items = [];
  // Named areas in the older dataset (peoples, chiefdoms, polities Cliopatria doesn't map) form an
  // approximate hatched layer; only unnamed land stays plain = unrecorded.
  S.landClip = new Path2D();
  for (const f of S.base.features) S.landClip.addPath(pathOf(f));
  const bc = S.corr.base[String(baseYearFor(S.year))] || {};
  for (const f of S.base.features) {
    let p = f.properties;
    if (p.n && bc.hide?.includes(p.n)) p = { ...p, n: null };          // anachronistic: show as unrecorded
    else if (p.n && bc.rename?.[p.n]) p = { ...p, n: bc.rename[p.n] };
    items.push({ f, p, kind: S.peoples && p.n ? "culture" : "land" });
  }
  for (const f of S.extraPeoples || []) items.push({ f, p: { ...f.properties, n: f.properties.n }, kind: "culture", corrected: true });
  const st = [...S.states].sort((a, b) => b.properties.a - a.properties.a); // small realms on top
  for (const f of st) items.push({ f, p: f.properties, kind: "state", key: f.properties.k });
  S.items = items;
}

function setupMap() {
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    S.width = r.width; S.height = r.height; S.dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = r.width * S.dpr; canvas.height = r.height * S.dpr;
    pick.width = r.width; pick.height = r.height;
    const small = r.width < 600, pad = small ? 8 : 28;
    projection.fitExtent([[pad, pad], [r.width - pad - (small ? 36 : 50), r.height - pad - (small ? 0 : 24)]], { type: "Sphere" });
    sphere2d = new Path2D(geoPath({ type: "Sphere" }));
    grat2d = new Path2D(geoPath(d3.geoGraticule10()));
    pathCache = new WeakMap();
    if (S.ghost) S.ghost.paths = S.ghost.feats.map((f) => new Path2D(geoPath(f) || ""));
    draw();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  S.zoom = d3.zoom().scaleExtent([1, 24]).translateExtent([[-200, -200], [10000, 10000]])
    .on("start", (ev) => { S.zooming = true; if (ev.sourceEvent?.type === "mousedown") canvas.classList.add("dragging"); })
    .on("zoom", (ev) => { S.t = ev.transform; draw(); })
    .on("end", () => { S.zooming = false; canvas.classList.remove("dragging"); draw(); });
  d3.select(canvas).call(S.zoom).on("dblclick.zoom", null);

  const local = (ev) => { const r = canvas.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; };
  canvas.addEventListener("mousemove", (ev) => {
    const [x, y] = local(ev);
    const i = pickAt(x, y), it = S.items[i];
    const hv = it && it.kind === "state" ? i : -1;
    if (hv !== S.hover) { S.hover = hv; draw(); }
    const tip = $("#tooltip");
    if (!it) { tip.hidden = true; canvas.classList.remove("pointing"); return; }
    canvas.classList.toggle("pointing", it.kind === "state");
    if (it.kind === "state") {
      const p = it.p, grp = p.k !== p.n && p.k !== p.n ? `<div>Part of <strong>${esc(displayName(p.k))}</strong></div>` : "";
      const fix = p.fixed ? `<div class="m">Corrected label (map data says “${esc(clean(p.fixed))}”)</div>` : corrOf(p.n) || corrOf(p.k) ? `<div class="m">Map note: see realm panel</div>` : "";
      tip.innerHTML = p.recon
        ? `<b>${esc(p.n)}</b><div class="m">Reconstructed from ${esc(S.supps.find((x) => x.id === p.supp)?.title || "historical sources")} · approximate borders, c. ${shortYear(p.f)}–${shortYear(p.t)}</div>`
        : `<b>${esc(clean(p.n))}</b>${grp}<div class="m">${fmtArea(p.a)} · borders ${shortYear(p.f)}–${shortYear(p.t)}</div>${fix}`;
    } else if (it.kind === "culture") {
      tip.innerHTML = it.corrected
        ? `<b>${esc(it.p.n)}</b><div class="m">No unified state in ${plainYear(S.year)} (map correction; the data draws “${esc(clean(it.p.fixed))}”)</div>`
        : `<b>${esc(it.p.n)}</b><div class="m">${isCulture(it.p) ? "People or culture without a state" : "Polity outside the main border data"} · approximate, c. ${plainYear(baseYearFor(S.year))}</div>`;
    } else {
      tip.innerHTML = `<b>Unrecorded</b><div class="m">No state is recorded here in ${plainYear(S.year)}: uninhabited, or beyond the written record.</div>`;
    }
    tip.hidden = false;
    tip.style.left = Math.min(x, S.width - 300) + "px"; tip.style.top = y + "px";
  });
  canvas.addEventListener("mouseleave", () => { S.hover = -1; $("#tooltip").hidden = true; draw(); });
  canvas.addEventListener("click", (ev) => {
    const [x, y] = local(ev);
    const it = S.items[pickAt(x, y)];
    if (!it || it.kind !== "state") return select(null);
    select(it.p.recon ? it.p.n : it.key);
  });
}

function draw() {
  if (!S.items.length || !sphere2d) return;
  const { t } = S;
  ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  ctx.fillStyle = theme.ocean; ctx.fillRect(0, 0, S.width, S.height);
  ctx.save();
  ctx.translate(t.x, t.y); ctx.scale(t.k, t.k);
  ctx.strokeStyle = theme.grat; ctx.lineWidth = 0.8 / t.k; ctx.stroke(grat2d);
  ctx.strokeStyle = theme.rule; ctx.lineWidth = 1 / t.k; ctx.stroke(sphere2d);

  const sel = S.sel;
  theme.hatch.setTransform(new DOMMatrix().scale(1 / t.k)); // constant stripe width at any zoom
  for (const it of S.items) {
    ctx.fillStyle = it.kind === "land" ? theme.unknown : it.kind === "culture" ? theme.hatch : S.journey && inJourney(it) ? theme.highlight
      : it.p.recon && it.p.n === S.sel ? theme.highlight : S.war ? (warSideOf(it) >= 0 ? SIDE_COLORS[warSideOf(it) % SIDE_COLORS.length] : [theme.other1, theme.other2, theme.other3][hash(clean(it.key)) % 3]) : colorOf(it.key);
    if (it.p.recon || it.p.crop) { ctx.save(); clipFor(ctx, it); ctx.fill(pathOf(it.f)); ctx.restore(); }
    else ctx.fill(pathOf(it.f));
  }
  ctx.lineJoin = "round";
  ctx.strokeStyle = theme.border; ctx.lineWidth = 0.7 / t.k;
  for (const it of S.items) {
    if (it.kind !== "state") continue;
    if (it.p.crop && !it.p.recon) { ctx.save(); clipFor(ctx, it); ctx.stroke(pathOf(it.f)); ctx.restore(); continue; }
    if (!it.p.recon) { ctx.stroke(pathOf(it.f)); continue; }
    ctx.save(); ctx.clip(S.landClip); ctx.setLineDash([3 / t.k, 2.5 / t.k]); ctx.strokeStyle = theme.ink3; ctx.stroke(pathOf(it.f)); ctx.restore();
    ctx.strokeStyle = theme.border;
  }

  if (S.showGhost && S.ghost && sel === S.ghost.key && S.ghost.year !== S.year) {
    ctx.setLineDash([5 / t.k, 4 / t.k]); ctx.strokeStyle = theme.highlight; ctx.lineWidth = 1.6 / t.k;
    for (const p of S.ghost.paths) ctx.stroke(p);
    ctx.setLineDash([]);
  }
  drawRings();
  if (S.journey) { ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.4 / t.k; for (const it of S.items) if (inJourney(it)) strokeItem(ctx, it); }
  if (sel) {
    ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.4 / t.k;
    for (const it of S.items) if (it.kind === "state" && (matches(it, sel) || (it.p.recon && it.p.n === sel))) strokeItem(ctx, it);
  }
  if (S.hover >= 0) { ctx.strokeStyle = theme.ink; ctx.lineWidth = 2 / t.k; strokeItem(ctx, S.items[S.hover]); }
  ctx.restore();
  if (S.zooming) { clearTimeout(S.pickTimer); S.pickTimer = setTimeout(drawPick, 100); }
  else drawPick(); // label placement reads the pick buffer, so keep it current when at rest
  if (S.labels) drawLabels();
  drawSites();
  drawMomentPin();
}

function drawLabels() {
  const { t } = S;
  const pxPerKm = (projection.scale() * t.k) / 6371;
  const placed = [];
  const rank = (it) => (it.key === S.sel ? 3 : S.featured.has(it.key) ? 2 : it.kind === "state" ? 1 : 0);
  const cand = S.items.filter((it) => it.p.l && (it.kind === "state" || (it.kind === "culture" && (it.corrected || isCulture(it.p)))))
    .sort((a, b) => rank(b) - rank(a) || b.p.a - a.p.a);
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const it of cand) {
    const r = Math.sqrt(it.p.a) * pxPerKm;
    const strong = it.kind === "state" && (S.war ? warSideOf(it) >= 0 : S.journey ? inJourney(it) : S.featured.has(it.key) || it.key === S.sel || it.p.recon);
    if (r < (strong ? 26 : it.kind === "state" ? 34 : 60)) continue;
    const [x0, y0] = projection(it.p.l);
    const x = t.applyX(x0), y = t.applyY(y0);
    if (x < -50 || y < -20 || x > S.width + 50 || y > S.height + 20) continue;
    const culture = it.kind !== "state";
    if (culture) { const top = S.items[pickAt(x, y)]; if (top && top.kind === "state") continue; }
    const size = Math.max(10, Math.min(r / 6, strong ? 18 : 13));
    let text = it.p.recon ? it.p.n.replace(/\s*\(.*\)$/, "") : clean(it.p.n);
    ctx.font = culture ? `italic 500 ${size}px Inter, sans-serif` : `${strong ? 800 : 600} ${size}px Archivo, "Helvetica Neue", sans-serif`;
    ctx.letterSpacing = culture ? "0px" : `${(size * 0.05).toFixed(1)}px`;
    if (!culture) text = text.toUpperCase();
    let lines = [text], w = ctx.measureText(text).width;
    const maxW = r * 2.6;
    if (w > maxW) {
      const words = text.split(" ");
      if (words.length < 2) continue;
      let best = null;
      for (let k = 1; k < words.length; k++) {
        const a = words.slice(0, k).join(" "), b = words.slice(k).join(" ");
        const m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
        if (!best || m < best.m) best = { a, b, m };
      }
      if (best.m > maxW) continue;
      lines = [best.a, best.b]; w = best.m;
    }
    const h = size * 1.1 * lines.length;
    const box = [x - w / 2 - 4, y - h / 2 - 3, x + w / 2 + 4, y + h / 2 + 3];
    if (placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
    placed.push(box);
    if (it.key === S.sel || (it.p.recon && it.p.n === S.sel) || (S.journey && inJourney(it))) { // red chip, like the design's highlighted realm
      ctx.fillStyle = theme.highlight; ctx.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
      ctx.fillStyle = "#ffffff";
      lines.forEach((ln, k) => ctx.fillText(ln, x, y + (k - (lines.length - 1) / 2) * size * 1.1));
      continue;
    }
    if (!strong) { ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.strokeStyle = theme.bg; }
    ctx.fillStyle = strong ? inkOn(S.war && warSideOf(it) >= 0 ? SIDE_COLORS[warSideOf(it) % SIDE_COLORS.length] : colorOf(it.key)) : theme.labelSoft;
    lines.forEach((ln, k) => {
      const ly = y + (k - (lines.length - 1) / 2) * size * 1.1;
      if (!strong) ctx.strokeText(ln, x, ly);
      ctx.fillText(ln, x, ly);
    });
  }
  ctx.letterSpacing = "0px";
}

function drawPick() {
  if (!S.items.length) return;
  const { t } = S;
  pctx.setTransform(1, 0, 0, 1, 0, 0);
  pctx.clearRect(0, 0, pick.width, pick.height);
  pctx.translate(t.x, t.y); pctx.scale(t.k, t.k);
  S.items.forEach((it, i) => {
    const id = i + 1;
    pctx.fillStyle = `rgb(${id & 255},${(id >> 8) & 255},${(id >> 16) & 255})`;
    if (it.p.recon || it.p.crop) { pctx.save(); clipFor(pctx, it); pctx.fill(pathOf(it.f)); pctx.restore(); }
    else pctx.fill(pathOf(it.f));
  });
}
function pickAt(x, y) {
  if (x < 0 || y < 0 || x >= pick.width || y >= pick.height) return -1;
  const d = pctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  if (d[3] < 255) return -1;
  const id = d[0] + (d[1] << 8) + (d[2] << 16);
  return id ? id - 1 : -1;
}

function flyTo(bounds, maxK = 8) {
  const [[x0, y0], [x1, y1]] = bounds;
  if (!isFinite(x0) || !S.width) return;
  const pad = 50;
  const k = Math.max(1, Math.min(maxK, 0.85 / Math.max((x1 - x0) / (S.width - pad), (y1 - y0) / (S.height - pad))));
  d3.select(canvas).transition().duration(900).ease(d3.easeCubicInOut)
    .call(S.zoom.transform, d3.zoomIdentity.translate(S.width / 2 - k * (x0 + x1) / 2, S.height / 2 - k * (y0 + y1) / 2).scale(k));
}
function boundsOf(feats) {
  // Frame the main body of a realm: ignore polygon pieces smaller than 2% of its largest piece
  // (overseas outposts, islands) so a European empire isn't framed as the whole globe.
  const parts = [];
  for (const f of feats) for (const poly of f.geometry.coordinates) {
    const g = { type: "Polygon", coordinates: poly };
    parts.push({ g, a: d3.geoArea(g) });
  }
  const big = Math.max(0, ...parts.map((p) => p.a));
  let b = [[Infinity, Infinity], [-Infinity, -Infinity]];
  for (const p of parts) {
    if (p.a < big * 0.02) continue;
    const [[x0, y0], [x1, y1]] = geoPath.bounds(p.g);
    b = [[Math.min(b[0][0], x0), Math.min(b[0][1], y0)], [Math.max(b[1][0], x1), Math.max(b[1][1], y1)]];
  }
  return b;
}
const activeFeats = (key) => S.states.filter((f) => f.properties.k === key || f.properties.n === key);
function flyToRegion(bb) {
  const pts = [bb[0], bb[1], [bb[0][0], bb[1][1]], [bb[1][0], bb[0][1]]].map((p) => projection(p));
  flyTo([[Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1]))], [Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]], 6);
}

// ---------------------------------------------------------------- selection
async function select(key, opts = {}) {
  if (S.journey && key) { exitJourney(); }
  if (S.war && key) { exitWar(); }
  S.sel = key || null;
  S.view = key ? "realm" : "world";
  S.moment = null;
  writeHash();
  renderCol(true);
  draw();
  updateChartCursor();
  if (!key) { S.ghost = null; return; }
  if (opts.fly) flyTo(boundsOf(activeFeats(key)));
  // dashed outline of the realm at its greatest recorded extent
  const r = realm(key);
  if (!r || (S.ghost && S.ghost.key === key)) return;
  const [py] = r.tl.reduce((m, row) => (row[2] > m[2] ? row : m));
  const chunk = await loadChunk(chunkOf(py));
  if (S.sel !== key) return;
  const feats = chunk.features.filter((f) => f.properties.f <= py && py <= f.properties.t && (f.properties.k === key || f.properties.n === key));
  S.ghost = { key, year: py, feats, paths: feats.map((f) => new Path2D(geoPath(f) || "")) };
  draw();
}
async function jumpTo(key, year) {
  if (year != null && year !== S.year) await go(year);
  await select(key, { fly: true });
}
function bestYear(key) {
  const r = realm(key);
  if (!r) return null;
  if (r.tl.some(([f, t]) => f <= S.year && S.year <= t)) return S.year;
  const [f, t] = r.tl.reduce((m, row) => (row[2] > m[2] ? row : m));
  return Math.round((f + t) / 2);
}

// ---------------------------------------------------------------- left column
function renderCol(resetScroll) {
  const col = $("#col"), scroll = col.scrollTop;
  col.innerHTML = S.view === "sources" ? sourcesHTML() : S.view === "moments" ? momentsListHTML() : S.view === "empires" ? empiresListHTML()
    : S.view === "journey" && S.journey ? journeyHTML() : S.view === "war" && S.war ? warHTML() : S.view === "wars" ? warsListHTML()
    : S.view === "moment" && S.moment ? momentHTML() : S.sel && realm(S.sel) ? realmHTML() : worldHTML();
  col.scrollTop = resetScroll ? 0 : scroll;
}
function worldHTML() {
  const y = S.year, ch = chapterFor(y), near = chapterNear(ch, y);
  const top = realmsNow().slice(0, 6);
  let h = `<div class="kicker">The world in</div><p class="year">${bigYear(y)}</p>`;
  h += `<h1 class="head">${esc(near ? ch.title : eraOf(y)[2])}</h1>`;
  if (ch) {
    h += `<p class="prose">${esc(ch.overview)}</p>`;
    if (!near) h += `<p class="note">From the chapter for <button class="linkish" data-year="${ch.year}">${plainYear(ch.year)}</button>: ${esc(ch.title)}${chapterAfter(y) ? ` · next: <button class="linkish" data-year="${chapterAfter(y).year}">${plainYear(chapterAfter(y).year)}</button>` : ""}</p>`;
  }
  const rulerOf = (key) => (near ? ch.powers?.find((p) => p.clio === key)?.ruler : null);
  const showRulers = near && top.some((r) => rulerOf(r.key));
  h += `<table class="rulers"><caption class="kicker">Who ruled what · ${plainYear(y)}</caption>
    <thead><tr><th scope="col">Realm</th><th scope="col">${showRulers ? "Ruler" : "Since"}</th><th scope="col">M km²</th></tr></thead><tbody>`;
  for (const r of top) {
    const since = realm(r.key)?.tl[0][0];
    h += `<tr data-key="${esc(r.key)}"${r.key === S.sel ? ' class="sel"' : ""}><td><span class="sq" style="background:${r.color}"></span>${esc(displayName(r.key))}</td>
      <td class="who">${esc(showRulers ? rulerOf(r.key) || "—" : since != null ? shortYear(since) : "")}</td><td>${mkm(r.area)}</td></tr>`;
  }
  h += `</tbody></table><p class="note">${S.states.length} states recorded this year. Areas include colonies and member states.</p>`;
  const [ea, eb, eLabel] = eraOf(y);
  const em = S.content.moments.filter((m) => (m.year >= ea && m.year < eb) || (ea === S.range[0] && m.year < ea));
  if (em.length) {
    h += `<h3 class="sec">Defining moments · ${esc(eLabel)}</h3><ul class="mlist">`;
    for (const m of em) h += `<li><button class="mrow" data-moment="${esc(m.id)}"><span class="my">${esc(m.yearLabel || shortYear(m.year))}</span><span class="mt">${esc(m.title)}</span></button></li>`;
    h += `</ul>`;
  }
  if (ch) {
    h += `<h3 class="sec">Around the world · ${plainYear(ch.year)}</h3><div>`;
    for (const [k, label, bb] of REGIONS) {
      const txt = ch.regions?.[k];
      if (!txt) continue;
      h += `<details class="region"><summary>${label}</summary><p>${esc(txt)}</p><button class="goto" data-bb='${JSON.stringify(bb)}'>Show on map →</button></details>`;
    }
    h += `</div>`;
    if (ch.events?.length) {
      h += `<h3 class="sec">Key events</h3><ol class="events">`;
      for (const e of ch.events) h += `<li><button class="y linkish" data-year="${e.year}">${shortYear(e.year)}</button><span>${esc(e.text)}</span></li>`;
      h += `</ol>`;
    }
    h += sourcesList(ch.sources, `Sources · chapter ${plainYear(ch.year)}`);
  }
  return h;
}
function realmHTML() {
  const key = S.sel, r = realm(key), y = S.year, emp = empireOf(key);
  const area = areaAt(key, y), rank = realmsNow(true).findIndex((x) => x.key === key);
  const peak = r.tl.reduce((m, row) => (row[2] > m[2] ? row : m));
  const end = r.tl[r.tl.length - 1][1];
  const span = `${shortYear(r.tl[0][0])} – ${end >= 2024 ? "today" : shortYear(end)}`;
  const media = S.commons[r.wiki] || (emp?.wiki && S.commons[emp.wiki]);
  const now = activeFeats(key);
  let h = `<button class="back" data-act="close">← The world in ${plainYear(y)}</button>`;
  h += `<div class="kicker">${r.group ? "Empire" : "Realm"} · ${span}</div><h2 class="realm">${esc(displayName(key))}</h2>`;
  if (r.recon) {
    const { sp, rg } = r.recon;
    h += `<aside class="mapnote recon"><b>Reconstruction · ${esc(sp.title)}</b><p>${esc(rg.note || "")}</p>`;
    if (rg.capital) h += `<p><strong>Capital:</strong> ${esc(rg.capital)}</p>`;
    if (rg.ports?.length) h += `<p><strong>Ports:</strong> ${esc(rg.ports.join(", "))}</p>`;
    if (rg.rulers?.length) h += `<p><strong>Rulers named in the sources:</strong> ${rg.rulers.map((x) => `${esc(x.name)}${x.when ? ` (${esc(x.when)})` : ""}`).join("; ")}</p>`;
    if (rg.attested) h += `<p><strong>Attested in:</strong> ${esc(rg.attested)}</p>`;
    h += `</aside>`;
    if (sp.summary) h += `<h3 class="sec">${esc(sp.title)}</h3><p class="prose">${esc(sp.summary)}</p>`;
    h += sourcesList(sp.sources);
    return h;
  }
  if (emp && emp.name !== displayName(key)) h += `<p class="note">Profile: ${esc(emp.name)}</p>`;
  if (emp?.capital) h += `<p class="note">Capital: ${esc(emp.capital)}</p>`;
  if (r.memberOf?.length) h += `<p class="note">Part of ${r.memberOf.map((g) => `<button class="linkish" data-key="${esc(g)}">${esc(displayName(g))}</button>`).join(", ")}</p>`;
  const jr = journeyForRealm(key);
  if (jr) h += `<button class="playj" data-journey="${esc(jr.id)}">▶ Follow ${esc(jr.name)} through its whole history</button>`;
  h += `<div class="stats"><div><b>${area ? mkm(area) : "—"}</b><span>M km² in ${shortYear(y)}</span></div>
    <div><b>${rank >= 0 ? "#" + (rank + 1) : "—"}</b><span>largest realm</span></div>
    <div><b>${mkm(peak[2])}</b><span>peak, ${shortYear(peak[0])}${peak[1] !== peak[0] ? "–" + shortYear(peak[1]) : ""}</span></div></div>`;
  const mc = corrOf(key) || (now[0] && corrOf(now[0].properties.fixed || now[0].properties.n));
  if (mc && (mc.note || mc.scholarly)) {
    h += `<aside class="mapnote"><b>Map note</b>${mc.note ? `<p>${esc(mc.note)}</p>` : ""}${mc.scholarly ? `<p>Scholarly peak estimate: <strong>${mkm(mc.scholarly.km2)}M km²</strong>${mc.scholarly.year != null ? ` c. ${shortYear(mc.scholarly.year)}` : ""} (${esc(mc.scholarly.source)}), against ${mkm(peak[2])}M km² drawn on this map.</p>` : ""}${(mc.sources || []).filter((x) => /^https?:\/\//.test(x.url)).length ? `<p class="msrc">${mc.sources.filter((x) => /^https?:\/\//.test(x.url)).map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a>`).join(" · ")}</p>` : ""}</aside>`;
  }
  h += `<h3 class="sec">Territory through time</h3>${extentChart(r)}
    <label class="toggle"><input type="checkbox" id="ghostToggle" ${S.showGhost ? "checked" : ""}> Outline greatest extent on the map</label>`;
  if (emp?.summary) h += `<h3 class="sec">Story</h3><p class="prose">${esc(emp.summary)}</p>`;
  if (media) {
    const ry = refYear(media, r);
    h += `<h3 class="sec">Reference map${ry != null ? ` · c. ${shortYear(ry)}` : ""}</h3>`;
    if (ry != null && Math.abs(ry - y) > 10) h += `<p class="refyear">This reference shows the realm around <b>${plainYear(ry)}</b>; the map above is showing <b>${plainYear(y)}</b>, so borders will differ. <button class="linkish" data-year="${ry}">Show ${plainYear(ry)} on the map</button></p>`;
    else if (ry != null) h += `<p class="refyear">Same period as the map.</p>`;
    h += `<figure class="ref"><a href="${esc(media.page)}" target="_blank" rel="noopener"><img src="${esc(media.thumb)}" alt="${esc(media.desc || media.file)}" loading="lazy"></a>
      <figcaption>${esc(media.desc || media.file.replace(/^File:/, ""))}<br>${esc(media.artist || "Unknown author")} · ${media.licenseUrl ? `<a href="${esc(media.licenseUrl)}" target="_blank" rel="noopener">${esc(media.license)}</a>` : esc(media.license)} · <a href="${esc(media.page)}" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption></figure>`;
  }
  if (emp?.rulers?.length) {
    h += `<h3 class="sec">Notable rulers</h3><ul class="rlist">`;
    for (const x of emp.rulers) h += `<li><b>${esc(x.name)}</b><span class="r">${esc(x.reign || "")}</span>${x.note ? `<span class="n">${esc(x.note)}</span>` : ""}</li>`;
    h += `</ul>`;
  }
  if (emp?.legacy) h += `<h3 class="sec">Legacy</h3><p class="prose">${esc(emp.legacy)}</p>`;
  if (now.length > 1 || (now.length === 1 && now[0].properties.n !== key)) {
    const sorted = [...now].sort((a, b) => b.properties.a - a.properties.a);
    h += `<h3 class="sec">Made up of, in ${plainYear(y)} (${now.length})</h3><ul class="terr">`;
    for (const f of sorted.slice(0, 60)) h += `<li data-member="${esc(f.properties.n)}">${esc(clean(f.properties.n))} <small>${fmtArea(f.properties.a)}</small></li>`;
    h += `</ul>`;
  }
  const links = [r.wiki && `<a href="https://en.wikipedia.org/wiki/${encodeURIComponent(r.wiki.replace(/ /g, "_"))}" target="_blank" rel="noopener">Wikipedia</a>`,
    r.wd && `<a href="https://www.wikidata.org/wiki/${esc(r.wd)}" target="_blank" rel="noopener">Wikidata</a>`,
    r.seshat && `<a href="https://seshat-db.com/core/polity/${esc(r.seshat)}" target="_blank" rel="noopener">Seshat</a>`].filter(Boolean);
  if (links.length) h += `<h3 class="sec">Read more</h3><p class="links">${links.join(" · ")}</p>`;
  h += sourcesList(emp?.sources);
  return h;
}
// The year a Commons reference map depicts, read from its file name / caption (e.g. "c. 1030", "117AD",
// "1206–1294"); ranges resolve to the year of the realm's widest extent. null if it names no usable year.
function refYear(media, r) {
  const lo = r.tl[0][0], hi = r.tl[r.tl.length - 1][1], slack = Math.max(25, Math.round((hi - lo) / 10));
  const scan = (text, fromCaption) => {
    const out = [];
    for (const m of text.replace(/_/g, " ").matchAll(/(?<!\d)(\d{2,4})\s*(BCE|BC|B\.C\.|AD|CE|A\.D\.)?(?!\d)/gi)) {
      let y = +m[1]; if ((m[2] || "").toUpperCase().startsWith("B")) y = -y;
      if (fromCaption && y >= 1990) continue; // captions often carry upload/creation dates, not the year shown
      if (y >= lo - slack && y <= hi + slack) out.push(Math.min(hi, Math.max(lo, y)));
    }
    return out;
  };
  let ys = scan(media.file || "", false);       // the title is the most reliable statement of the year shown
  if (!ys.length) ys = scan(media.desc || "", true);
  if (!ys.length) return null;
  const areaOf = (y) => (r.tl.find(([f, t]) => f <= y && y <= t) || [0, 0, 0])[2];
  return ys.reduce((b, y) => (areaOf(y) > areaOf(b) ? y : b), ys[0]);
}
function extentChart(r) {
  const W = 400, H = 120, padB = 18;
  const f0 = r.tl[0][0], t1 = r.tl[r.tl.length - 1][1];
  const span = Math.max(20, t1 - f0), x0 = f0 - span * 0.03, x1 = t1 + span * 0.03;
  const max = Math.max(...r.tl.map((x) => x[2]));
  const X = (y) => ((y - x0) / (x1 - x0)) * W, Y = (a) => H - padB - (a / max) * (H - padB - 6);
  let line = "";
  for (const [f, t, a] of r.tl) line += `${line ? "L" : "M"}${X(f).toFixed(1)},${Y(a).toFixed(1)}H${X(t + 1).toFixed(1)}`;
  const area = `${line}V${H - padB}H${X(f0).toFixed(1)}Z`;
  const cx = X(S.year), inside = S.year >= f0 && S.year <= t1;
  return `<svg class="chart-s" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" data-x0="${x0}" data-x1="${x1}" role="img" aria-label="Territory over time; click to jump to a year">
    <path d="${area}" fill="${theme.highlight}" opacity=".14"/><path d="${line}" fill="none" stroke="${theme.highlight}" stroke-width="1.8" vector-effect="non-scaling-stroke"/>
    <line x1="0" x2="${W}" y1="${H - padB}" y2="${H - padB}" stroke="${theme.ink}" stroke-width="1" vector-effect="non-scaling-stroke"/>
    ${inside ? `<line x1="${cx}" x2="${cx}" y1="0" y2="${H - padB}" stroke="${theme.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>` : ""}
    <text x="0" y="${H - 3}">${shortYear(f0)}</text><text x="${W}" y="${H - 3}" text-anchor="end">${t1 >= 2024 ? "today" : shortYear(t1)}</text>
    <text x="2" y="11">${mkm(max)}M km²</text></svg>`;
}
function sourcesHTML() {
  return `<button class="back" data-act="world">← Back to the map</button>
    <div class="kicker">About this atlas</div><h2 class="realm">Sources</h2>
    <p class="prose">Borders are scholarly approximations. Each layer comes from an open dataset:</p>
    <ol class="sources-list">
      <li><b>State borders</b>: <a href="https://github.com/Seshat-Global-History-Databank/cliopatria" target="_blank" rel="noopener">Cliopatria</a>, Seshat Global History Databank (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>; <a href="https://doi.org/10.1038/s41597-025-04516-9" target="_blank" rel="noopener">Scientific Data, 2025</a>). Simplified for the web.</li>
      <li><b>Peoples &amp; other polities</b> (hatched): <a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noopener">historical-basemaps</a> by A. Ourednik (GPL-3.0).</li>
      <li><b>Reference maps</b>: <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener">Wikimedia Commons</a>, each credited with its author and licence.</li>
      <li><b>Narrative chapters and empire profiles</b>: written for this atlas, then fact-checked against Britannica-tier references, Wikipedia (cited statements only), Taagepera and Turchin for areas, and regional authorities such as Schwartzberg, Majumdar, the Imperial Gazetteer, the <i>Cambridge Ancient History</i> and UNESCO's <i>General History of Africa</i>. Each chapter and realm lists its sources.</li>
      <li><b>Map corrections</b>: ${Object.keys(S.corr.realms).length} realms carry reviewed fixes or notes where the border data contradicts scholarship (relabelled, trimmed or annotated). Look for "Map note" on a realm.</li>
    </ol>
    <p class="note">Keyboard: ← → move 10 years (Shift: 1 year) · [ ] previous/next chapter · Space play · Esc clear.</p>`;
}

// ---------------------------------------------------------------- wars
// Play a war event by event: each side's states coloured, each event pinned and explained (content/wars/*.json).
const SIDE_COLORS = ["#2B59D9", "#E5402A", "#2F7D6D", "#E9A93B"];
const warById = (id) => S.content.wars.find((w) => w.id === id) || null;
function warSides(w, y) { // realm/group name -> side index, for members active in year y
  const m = new Map();
  w.sides.forEach((sd, i) => sd.members.forEach((x) => { if (x.from <= y && y <= x.to && !m.has(x.clio)) m.set(x.clio, i); }));
  return m;
}
function warSideOf(it) {
  if (!S.war || it.kind !== "state") return -1;
  const m = S.warMap || (S.warMap = warSides(S.war, S.year));
  return m.has(it.p.n) ? m.get(it.p.n) : m.has(it.p.k) ? m.get(it.p.k) : -1;
}
const evTime = (e) => { const [y, mo, d] = String(e.date || "").split("-").map(Number); return e.year + (e.year >= 0 && mo ? (mo - 1) / 12 + (d ? (d - 1) / 365 : 0) : 0); };
async function openWar(id, idx = 0) {
  const w = warById(id);
  if (!w) return;
  stopPlay();
  if (S.journey) exitJourney();
  S.sel = null; S.ghost = null; S.moment = null; S.war = w; S.view = "war"; S.wIdx = Math.max(0, Math.min(w.events.length - 1, idx));
  await goWarEvent(S.wIdx, true);
}
async function goWarEvent(i, fit) {
  const w = S.war; if (!w) return;
  S.wIdx = Math.max(0, Math.min(w.events.length - 1, i));
  const e = w.events[S.wIdx];
  S.warMap = null;
  await go(e ? e.year : w.span[0], { keepWar: true });
  S.warMap = warSides(w, S.year);
  renderWarChart(); draw(); renderCol(true); writeHash();
  if (fit && w.events.length) { // frame all the war's events
    const pts = w.events.filter((x) => x.lonlat).map((x) => projection(x.lonlat));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const pad = 20;
    flyTo([[Math.min(...xs) - pad, Math.min(...ys) - pad], [Math.max(...xs) + pad, Math.max(...ys) + pad]], 7);
  }
}
function exitWar() {
  stopPlay();
  S.war = null; S.warMap = null; S.view = "world";
  S.win = null; updateWindow(); computeFeatured(); draw(); updateChartCursor(); renderCol(true); writeHash();
}
function renderWarChart() {
  const w = S.war, el = $("#chart"), t0 = w.span[0], t1 = w.span[1] + 1;
  const X = (t) => (100 * (t - t0)) / Math.max(1, t1 - t0);
  const years = []; for (let y = w.span[0]; y <= w.span[1]; y++) years.push(y);
  const step = Math.max(1, Math.ceil(years.length / 12));
  el.innerHTML = `<div class="warbar">${years.map((y, i) => `<span class="wy${i % 2 ? " alt" : ""}" style="left:${X(y)}%;width:${X(y + 1) - X(y)}%">${(i % step === 0) ? shortYear(y) : ""}</span>`).join("")}</div>
    <div class="wsides">${w.sides.map((sd, i) => `<span><i style="background:${SIDE_COLORS[i % SIDE_COLORS.length]}"></i>${esc(sd.name)}</span>`).join("")}</div>
    <div class="wmarks">${w.events.map((e, i) => `<button class="mk ev wk-${esc(e.kind || "other")}${i === S.wIdx ? " on" : ""}" data-wev="${i}" style="left:${X(evTime(e))}%" aria-label="${esc(e.label || shortYear(e.year))}: ${esc(e.text)}"><span class="tipm">${esc(e.label || shortYear(e.year))} · ${esc(e.text)}</span></button>`).join("")}</div>
    <div class="wnow"><b>${S.wIdx + 1}</b> / ${w.events.length} · ${esc(w.events[S.wIdx]?.label || "")}</div>`;
  $("#chartTitle").innerHTML = `${esc(w.name)} · ${esc(w.dateLabel || `${shortYear(w.span[0])}–${shortYear(w.span[1])}`)} <button class="exitj" data-act="exit-war" aria-label="Exit war">× Exit</button>`;
}
function warHTML() {
  const w = S.war, e = w.events[S.wIdx], m = S.warMap || warSides(w, S.year);
  let h = `<button class="back" data-act="exit-war">← Exit war</button>`;
  h += `<div class="kicker">War · ${esc(w.dateLabel || `${shortYear(w.span[0])}–${shortYear(w.span[1])}`)}</div><h2 class="realm">${esc(w.name)}</h2>`;
  if (e) {
    h += `<aside class="mapnote evnow"><b>${esc(e.label || shortYear(e.year))} · event ${S.wIdx + 1} of ${w.events.length}</b><p class="evt">${esc(e.text)}</p>${e.detail ? `<p>${esc(e.detail)}</p>` : ""}</aside>`;
    h += mediaHTML(`war:${w.id}:${S.wIdx}`);
    h += `<div class="mnav">${S.wIdx > 0 ? `<button class="mstep" data-wev="${S.wIdx - 1}">‹ Previous</button>` : "<span></span>"}${S.wIdx < w.events.length - 1 ? `<button class="mstep" data-wev="${S.wIdx + 1}">Next ›</button>` : ""}</div>`;
  }
  h += `<h3 class="sec">Sides in ${plainYear(S.year)}</h3><div class="wside-list">`;
  w.sides.forEach((sd, i) => {
    const act = sd.members.filter((x) => x.from <= S.year && S.year <= x.to).map((x) => displayName(x.clio));
    h += `<p><span class="sq" style="background:${SIDE_COLORS[i % SIDE_COLORS.length]}"></span><b>${esc(sd.name)}</b>${act.length ? `: ${esc([...new Set(act)].join(", "))}` : " <span class='muted'>(not drawn on the map this year)</span>"}</p>`;
  });
  h += `</div>`;
  if (w.summary) h += `<h3 class="sec">The war</h3><p class="prose">${esc(w.summary)}</p>`;
  if (w.casualties) h += `<p class="note">${esc(w.casualties)}</p>`;
  h += `<h3 class="sec">Timeline</h3><ol class="events jtl">`;
  w.events.forEach((x, i) => { h += `<li class="${i < S.wIdx ? "past" : i > S.wIdx ? "future" : "now"}"><button class="y linkish" data-wev="${i}">${esc(x.label || shortYear(x.year))}</button><div><span>${esc(x.text)}</span></div></li>`; });
  h += `</ol>`;
  h += sourcesList(w.sources);
  h += `<p class="note"><button class="linkish" data-act="wars">All wars</button></p>`;
  return h;
}
function warsListHTML() {
  let h = `<button class="back" data-act="world">← Back to the map</button><div class="kicker">Play a war</div><h2 class="realm">Wars</h2>
    <p class="prose">Step through a war event by event: each side's states are coloured on the map, each battle and turning point is pinned and explained. Press play to watch it unfold.</p><ul class="mlist">`;
  for (const w of S.content.wars) h += `<li><button class="mrow" data-war="${esc(w.id)}"><span class="my">${shortYear(w.span[0])}–${shortYear(w.span[1])}</span><span class="mt">${esc(w.name)}</span></button></li>`;
  return h + `</ul>`;
}

// ---------------------------------------------------------------- empire journeys
// Pick an empire: the map follows it through its whole life (content/journeys/*.json).
const journeyById = (id) => S.content.journeys.find((j) => j.id === id) || null;
// Every chain stage active in a year (an empire can include satellites or colonies drawn as separate realms).
const chainAll = (j, y) => j.chain.filter((c) => c.from <= y && y <= c.to);
const chainAt = (j, y) => chainAll(j, y)[0] || null;
const chainKeys = (j, y) => new Set(chainAll(j, y).map((c) => c.clio));
const inJourney = (it, y = S.year) => { if (!S.journey || it.kind !== "state") return false; const ks = chainKeys(S.journey, y); return ks.has(it.p.n) || ks.has(it.p.k); };
const journeyArea = (j, y) => chainAll(j, y).reduce((sum, c) => sum + areaAt(c.clio, y), 0);
function journeyRings(j) { // years whose borders are drawn as fading "growth rings"
  const [a, b] = j.span, n = Math.min(12, Math.max(4, Math.round((b - a) / 25)));
  return [...new Set(Array.from({ length: n }, (_, i) => Math.round(a + (i * (b - a)) / (n - 1))))];
}
async function featuresOf(j, y) {
  const ks = chainKeys(j, y);
  if (!ks.size) return [];
  const chunk = await loadChunk(chunkOf(y));
  return chunk.features.filter((f) => f.properties.f <= y && y <= f.properties.t).map((f) => correctFeature(f, y)).filter(Boolean)
    .filter((f) => ks.has(f.properties.n) || ks.has(f.properties.k));
}
async function openJourney(id, year) {
  const j = journeyById(id);
  if (!j) return;
  stopPlay();
  if (S.war) exitWar();
  S.sel = null; S.ghost = null; S.moment = null; S.journey = j; S.view = "journey"; S.jEvent = null; S.jOpen = new Set();
  S.rings = [];
  await go(year ?? j.span[0], { keepJourney: true });
  renderJourneyChart(); updateChartCursor(); renderCol(true); writeHash();
  // load every ring year; frame the map on the empire's full reach
  const ys = journeyRings(j), all = [];
  for (const y of ys) { const fs = await featuresOf(j, y); if (S.journey !== j) return; S.rings.push({ year: y, feats: fs }); all.push(...fs); draw(); }
  if (all.length) flyTo(boundsOf(all), 6);
}
function exitJourney() {
  S.journey = null; S.rings = []; S.view = "world"; S.jEvent = null;
  S.win = null; updateWindow(); computeFeatured(); draw(); updateChartCursor(); renderCol(true); writeHash();
}
function drawRings() {
  if (!S.journey || !S.rings?.length) return;
  const past = S.rings.filter((r) => r.year < S.year).slice(-6);
  past.forEach((r, i) => {
    ctx.globalAlpha = 0.25 + (0.6 * (i + 1)) / past.length;
    ctx.setLineDash([4 / S.t.k, 3 / S.t.k]);
    ctx.strokeStyle = theme.highlight; ctx.lineWidth = 1.2 / S.t.k;
    for (const f of r.feats) ctx.stroke(pathOf(f));
  });
  ctx.setLineDash([]); ctx.globalAlpha = 1;
}
function renderJourneyChart() {
  const j = S.journey, el = $("#chart"), [a, b] = j.span;
  const W = 1000, H = 130, N = 160;
  const ys = Array.from({ length: N }, (_, i) => Math.round(a + (i * (b - a)) / (N - 1)));
  const vals = ys.map((y) => journeyArea(j, y)), max = Math.max(1, ...vals);
  const X = (y) => ((y - a) / Math.max(1, b - a)) * W;
  const d = "M" + ys.map((y, i) => `${X(y).toFixed(1)},${(H - (vals[i] / max) * (H - 6)).toFixed(1)}`).join("L") + `L${W},${H}L0,${H}Z`;
  const ticks = 6, axis = Array.from({ length: ticks + 1 }, (_, i) => Math.round(a + (i * (b - a)) / ticks));
  const reigns = j.reigns.filter((r) => r.to >= a && r.from <= b).map((r, i) => {
    const l = Math.max(0, X(Math.max(r.from, a)) / 10), w = Math.max(0.4, (X(Math.min(r.to, b)) - X(Math.max(r.from, a))) / 10);
    return `<button class="reign${i % 2 ? " alt" : ""}" data-year="${Math.max(r.from, a)}" style="left:${l}%;width:${w}%" title="${esc(r.name)}, ${shortYear(r.from)}–${shortYear(r.to)}"><span>${esc(r.name)}</span></button>`;
  }).join("");
  el.innerHTML = `<svg class="pc" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Territory of ${esc(j.name)} over time">
      <path d="${d}" fill="${theme.highlight}" fill-opacity=".22" stroke="${theme.highlight}" stroke-width="2" vector-effect="non-scaling-stroke"/>
      <line class="cursor" x1="0" x2="0" y1="0" y2="${H}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
    <div class="axis">${axis.map((y, i) => `<span style="left:${(100 * i) / ticks}%">${shortYear(y)}</span>`).join("")}</div>
    <div class="reigns">${reigns}</div>
    <div class="cur"></div>
    <div class="legend"><span><i style="background:${theme.highlight}"></i>Territory (peak ${mkm(max)}M km²)</span></div>
    <div class="marks">${j.events.map((e, i) => `<button class="mk ev" data-jev="${i}" style="left:${X(e.year) / 10}%" aria-label="${esc(e.text)}, ${shortYear(e.year)}"><span class="tipm">${shortYear(e.year)} · ${esc(e.text)}</span></button>`).join("")}</div>`;
  $("#chartTitle").innerHTML = `${esc(j.name)} · ${shortYear(a)}–${shortYear(b)} <button class="exitj" data-act="exit-journey" aria-label="Exit empire journey">× Exit</button>`;
  S.jRendered = j.id;
}
function currentEvent(j, y) { let e = null; for (const x of j.events) if (x.year <= y) e = x; return e; }
function currentReign(j, y) { return j.reigns.find((r) => r.from <= y && y <= r.to) || null; }
function journeyHTML() {
  const j = S.journey, y = S.year, prof = j.profile ? Object.values(S.content.byClio).find((e) => e.id === j.profile) : null;
  const area = journeyArea(j, y), rg = currentReign(j, y), ev = S.jEvent != null ? j.events[S.jEvent] : currentEvent(j, y);
  let h = `<button class="back" data-act="exit-journey">← Exit journey</button>`;
  h += `<div class="kicker">Empire journey · ${shortYear(j.span[0])} – ${shortYear(j.span[1])}</div><h2 class="realm">${esc(j.name)}</h2>`;
  if (j.summary) h += `<p class="prose">${esc(j.summary)}</p>`;
  h += `<div class="stats"><div><b>${bigYear(y).replace(/<small>BCE<\/small>/, " BCE")}</b><span>now</span></div><div><b>${area ? mkm(area) : "—"}</b><span>M km² held</span></div><div><b>${esc(rg ? rg.name.split(" (")[0] : "—")}</b><span>ruler</span></div></div>`;
  if (!j.chain.length) h += `<p class="note">The map data has no borders for this empire, so its territory can't be drawn; the timeline below still applies.</p>`;
  else if (!chainAt(j, y)) h += `<p class="note">No border data for this empire in ${plainYear(y)}.</p>`;
  if (ev) {
    h += `<aside class="mapnote evnow"><b>${shortYear(ev.year)}</b><p class="evt">${esc(ev.text)}</p>${ev.detail ? `<p>${esc(ev.detail)}</p>` : ""}</aside>`;
    h += mediaHTML(`journey:${j.id}:${j.events.indexOf(ev)}`);
  }
  h += `<h3 class="sec">Timeline</h3><ol class="events jtl">`;
  j.events.forEach((e, i) => {
    const more = e.detail ? `<details data-jopen="${i}"${S.jOpen?.has(i) ? " open" : ""}><summary>Read more</summary><p>${esc(e.detail)}</p></details>` : "";
    h += `<li class="${e.year <= y ? "past" : "future"}${ev === e ? " now" : ""}"><button class="y linkish" data-jev="${i}">${shortYear(e.year)}</button><div><span>${esc(e.text)}</span>${more}</div></li>`;
  });
  h += `</ol>`;
  if (j.reigns.length) {
    h += `<h3 class="sec">Rulers</h3><ul class="rlist">`;
    for (const r of j.reigns) h += `<li class="${rg === r ? "cur" : ""}"><button class="linkish" data-year="${Math.max(r.from, j.span[0])}">${esc(r.name)}</button><span class="r">${shortYear(r.from)}–${shortYear(r.to)}</span></li>`;
    h += `</ul>`;
  }
  if (prof?.summary) h += `<h3 class="sec">Story</h3><p class="prose">${esc(prof.summary)}</p>`;
  if (prof?.legacy) h += `<h3 class="sec">Legacy</h3><p class="prose">${esc(prof.legacy)}</p>`;
  h += sourcesList(j.sources);
  h += `<p class="note"><button class="linkish" data-act="empires">All empires</button></p>`;
  return h;
}
function empiresListHTML() {
  let h = `<button class="back" data-act="world">← Back to the map</button><div class="kicker">From Sumer to the 20th century</div><h2 class="realm">Empire journeys</h2>
    <p class="prose">Pick an empire to follow its whole life: its territory growing and shrinking on the map, its rulers, and the events that made and unmade it. Press play to watch it unfold.</p>`;
  let last = null;
  for (const j of S.content.journeys) {
    const era = j.span[0] < S.range[0] ? "Before 3400 BCE" : eraOf(j.span[0])[2];
    if (era !== last) { h += `${last ? "</ul>" : ""}<h3 class="sec">${esc(era)}</h3><ul class="mlist">`; last = era; }
    h += `<li><button class="mrow" data-journey="${esc(j.id)}"><span class="my">${shortYear(j.span[0])}–${shortYear(j.span[1])}</span><span class="mt">${esc(j.name)}${j.chain.length ? "" : " <small>(no map data)</small>"}</span></button></li>`;
  }
  return h + (last ? "</ul>" : "");
}
const journeyForRealm = (key) => S.content.journeys.find((j) => j.chain.some((c) => c.clio === key)) || null;

// ---------------------------------------------------------------- defining moments
const momentById = (id) => S.content.moments.find((m) => m.id === id) || null;
const CAT = { technology: "Technology", state: "States & empires", ideas: "Ideas & belief", trade: "Trade & exchange",
  culture: "Culture", law: "Law & government", science: "Science", collapse: "Collapse", war: "War", exploration: "Exploration", atrocity: "Genocide & atrocity" };
async function openMoment(id) {
  const m = momentById(id);
  if (!m) return;
  stopPlay();
  if (S.journey) exitJourney();
  if (S.war) exitWar();
  S.sel = null; S.ghost = null; S.moment = m; S.view = "moment";
  await go(Math.max(S.range[0], m.year), { keepMoment: true });
  S.view = "moment"; S.moment = m;
  renderCol(true); writeHash(); draw(); updateChartCursor();
  if (m.lonlat) {
    const [x, y] = projection(m.lonlat), k = 3;
    d3.select(canvas).transition().duration(900).ease(d3.easeCubicInOut)
      .call(S.zoom.transform, d3.zoomIdentity.translate(S.width / 2 - k * x, S.height / 2 - k * y).scale(k));
  }
}
function momentHTML() {
  const m = S.moment, list = S.content.moments, i = list.indexOf(m);
  const prev = list[i - 1], next = list[i + 1];
  let h = `<button class="back" data-act="world">← The world in ${plainYear(S.year)}</button>`;
  h += `<div class="kicker">Defining moment · ${esc(CAT[m.category] || m.category || "")}</div>`;
  h += `<p class="year mom">${esc(m.yearLabel || plainYear(m.year))}</p><h1 class="head">${esc(m.title)}</h1>`;
  if (m.place) h += `<p class="note">${esc(m.place)}</p>`;
  const mw = S.content.wars.find((w) => w.moment === m.id);
  if (mw) h += `<button class="playj" data-war="${esc(mw.id)}">▶ Play the war, event by event</button>`;
  if (m.year < S.range[0]) h += `<p class="note">This happened before the map's border data begins (${plainYear(S.range[0])}); the map shows the earliest borders available.</p>`;
  h += `<p class="prose">${esc(m.summary || "")}</p>`;
  h += mediaHTML("moment:" + m.id);
  if (m.why) h += `<h3 class="sec">Why it changed humanity</h3><p class="prose">${esc(m.why)}</p>`;
  if (m.also) h += `<h3 class="sec">Elsewhere</h3><p class="prose">${esc(m.also)}</p>`;
  h += `<div class="mnav">${prev ? `<button class="mstep" data-moment="${esc(prev.id)}">‹ ${esc(prev.title)}</button>` : "<span></span>"}${next ? `<button class="mstep" data-moment="${esc(next.id)}">${esc(next.title)} ›</button>` : ""}</div>`;
  h += sourcesList(m.sources);
  h += `<p class="note"><button class="linkish" data-act="moments">All defining moments</button></p>`;
  return h;
}
function momentsListHTML() {
  let h = `<button class="back" data-act="world">← Back to the map</button><div class="kicker">From the first farms to today</div><h2 class="realm">Defining moments</h2>
    <p class="prose">The turning points that changed humanity, each placed on the map where it happened. Click one to travel there.</p>`;
  let last = null;
  for (const m of S.content.moments) {
    const era = m.year < S.range[0] ? "Prelude: before the first states" : eraOf(m.year)[2];
    if (era !== last) { h += `${last ? "</ul>" : ""}<h3 class="sec">${esc(era)}</h3><ul class="mlist">`; last = era; }
    h += `<li><button class="mrow" data-moment="${esc(m.id)}"><span class="my">${esc(m.yearLabel || shortYear(m.year))}</span><span class="mt">${esc(m.title)}</span></button></li>`;
  }
  return h + (last ? "</ul>" : "");
}
function drawSites() { // capitals, ports and excavations of active reconstruction layers, once zoomed in
  if (S.t.k < 5) return;
  const act = S.supps.filter((sp) => sp.from <= S.year && S.year <= sp.to);
  ctx.save(); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = '600 11px Inter, sans-serif';
  for (const sp of act) for (const st of sp.sites || []) {
    const [x0, y0] = projection(st.lonlat), x = S.t.applyX(x0), y = S.t.applyY(y0);
    if (x < 0 || y < 0 || x > S.width || y > S.height) continue;
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 2 * Math.PI); ctx.fillStyle = theme.ink; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = theme.bg; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = theme.bg; ctx.strokeText(st.name, x + 6, y); ctx.fillStyle = theme.ink; ctx.fillText(st.name, x + 6, y);
  }
  ctx.restore();
}
function drawMomentPin() {
  let m = S.view === "moment" && S.moment;
  if (!m && S.war) { const e = S.war.events[S.wIdx]; if (e && e.lonlat) m = { lonlat: e.lonlat, title: e.text.length > 50 ? e.text.slice(0, 48) + "…" : e.text }; }
  if (!m && S.journey) {
    const ev = S.jEvent != null ? S.journey.events[S.jEvent] : currentEvent(S.journey, S.year);
    if (ev && ev.lonlat && S.year - ev.year <= Math.max(3, (S.journey.span[1] - S.journey.span[0]) / 25)) m = { lonlat: ev.lonlat, title: ev.text.length > 48 ? ev.text.slice(0, 46) + "…" : ev.text };
  }
  if (!m || !m.lonlat) return;
  const [x0, y0] = projection(m.lonlat), x = S.t.applyX(x0), y = S.t.applyY(y0);
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, 14, 0, 2 * Math.PI); ctx.fillStyle = "rgba(229,64,42,.18)"; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * Math.PI); ctx.fillStyle = S.journey ? theme.ink : theme.highlight; ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = "#ffffff"; ctx.stroke();
  ctx.font = '800 14px Archivo, "Helvetica Neue", sans-serif'; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  const label = m.title, w = ctx.measureText(label).width;
  const lx = x + 14 + w + 12 > S.width ? x - 18 - w - 8 : x + 18;
  ctx.fillStyle = theme.ink; ctx.fillRect(lx - 6, y - 12, w + 12, 24);
  ctx.fillStyle = theme.bg; ctx.fillText(label, lx, y + 1);
  ctx.restore();
}

// ---------------------------------------------------------------- power chart (the timeline)
function setupChart() {
  const el = $("#chart");
  const toYear = (ev) => { const r = el.getBoundingClientRect(); const fx = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)); const [a, b] = S.journey ? S.journey.span : [S.win.a, S.win.b]; return a + fx * (b - a); };
  let drag = null, pending = null;
  const scrub = (y) => { if (pending == null) setTimeout(() => { go(pending); pending = null; }, 24); pending = y; };
  el.addEventListener("pointerdown", (ev) => {
    const wk = ev.target.closest("[data-wev]");
    if (S.war) { ev.preventDefault(); stopPlay(); if (wk) return goWarEvent(+wk.dataset.wev); 
      const r = el.getBoundingClientRect(), t = S.war.span[0] + ((ev.clientX - r.left) / r.width) * (S.war.span[1] + 1 - S.war.span[0]);
      let best = 0; S.war.events.forEach((x, i) => { if (Math.abs(evTime(x) - t) < Math.abs(evTime(S.war.events[best]) - t)) best = i; });
      return goWarEvent(best); }
    const mk = ev.target.closest(".mk");
    if (mk && mk.dataset.jev != null) { ev.preventDefault(); const e = S.journey.events[+mk.dataset.jev]; S.jEvent = +mk.dataset.jev; stopPlay(); return go(e.year); }
    if (mk) { ev.preventDefault(); return openMoment(mk.dataset.moment); }
    const rb = ev.target.closest(".reign");
    if (rb) { ev.preventDefault(); S.jEvent = null; stopPlay(); return go(+rb.dataset.year); }
    drag = { x: ev.clientX, target: ev.target }; el.setPointerCapture(ev.pointerId); stopPlay(); scrub(toYear(ev));
  });
  el.addEventListener("pointermove", (ev) => { if (drag) { if (Math.abs(ev.clientX - drag.x) > 3) drag.moved = true; scrub(toYear(ev)); } });
  el.addEventListener("pointerup", () => {
    if (drag && !drag.moved) { const s = drag.target.closest?.("[data-series]"); if (s) select(s.dataset.series); }
    drag = null;
  });
}
function renderChart() {
  const w = S.win, el = $("#chart");
  const W = 1000, H = 130, n = w.ys.length;
  const X = (i) => ((i / (n - 1)) * W).toFixed(1), Y = (v) => (H - (v / w.max) * H).toFixed(1);
  const base = new Array(n).fill(0);
  let paths = "";
  w.series.forEach((s) => {
    const top = base.map((b, i) => b + s.vals[i]);
    const d = "M" + top.map((v, i) => `${X(i)},${Y(v)}`).join("L") + "L" + base.map((v, i) => `${X(i)},${Y(v)}`).reverse().join("L") + "Z";
    paths += `<path class="series" data-series="${esc(s.key)}" d="${d}"><title>${esc(displayName(s.key))}</title></path>`;
    for (let i = 0; i < n; i++) base[i] = top[i];
  });
  const ticks = 6, axis = Array.from({ length: ticks + 1 }, (_, i) => Math.round(w.a + (i * (w.b - w.a)) / ticks));
  el.innerHTML = `<svg class="pc" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Stacked territory of the great powers, ${plainYear(w.a)} to ${plainYear(w.b)}">${paths}
      <line class="cursor" x1="0" x2="0" y1="0" y2="${H}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
    <div class="axis">${axis.map((y, i) => `<span style="left:${(100 * i) / ticks}%">${shortYear(y)}</span>`).join("")}</div>
    <div class="cur"></div>
    <div class="legend">${w.series.map((s) => `<span data-k="${esc(s.key)}"><i></i>${esc(displayName(s.key))}</span>`).join("")}</div>
    <div class="marks">${S.content.moments.filter((m) => m.year >= w.a && m.year <= w.b).map((m) =>
      `<button class="mk" data-moment="${esc(m.id)}" style="left:${(100 * (m.year - w.a)) / (w.b - w.a)}%" aria-label="${esc(m.title)}, ${esc(m.yearLabel || shortYear(m.year))}"><span class="tipm">${esc(m.yearLabel || shortYear(m.year))} · ${esc(m.title)}</span></button>`).join("")}</div>`;
  $("#chartTitle").textContent = `The great powers · ${w.label}, ${shortYear(w.a)}–${shortYear(w.b)}`;
}
function updateChartCursor() {
  if (S.war) return;
  const w = S.journey ? { a: S.journey.span[0], b: S.journey.span[1] } : S.win; if (!w) return;
  const el = $("#chart");
  el.querySelectorAll(".series").forEach((p) => p.setAttribute("fill", colorOf(p.dataset.series)));
  el.querySelectorAll(".legend span").forEach((s) => (s.querySelector("i").style.background = colorOf(s.dataset.k)));
  const fx = (S.year - w.a) / (w.b - w.a);
  const line = el.querySelector(".cursor");
  line.setAttribute("x1", fx * 1000); line.setAttribute("x2", fx * 1000); line.setAttribute("stroke", theme.ink);
  el.querySelectorAll(".mk").forEach((b) => b.classList.toggle("on", S.view === "moment" && S.moment?.id === b.dataset.moment));
  const cur = el.querySelector(".cur");
  cur.style.left = `${Math.max(2, Math.min(98, fx * 100))}%`; cur.textContent = shortYear(S.year);
}
function buildStrip() {
  const strip = $("#strip");
  let h = "";
  ERAS.forEach(([a, b, label], i) => { h += `<div class="seg" data-i="${i}" title="${label}: ${plainYear(a)} – ${plainYear(b)}" style="left:${100 * yToPos(a)}%;width:${100 * (yToPos(b) - yToPos(a))}%"></div>`; });
  for (const [y, txt] of [[-3400, "3400 BCE"], [1, "1 CE"], [1500, "1500"], [2024, "2024"]]) {
    h += `<span class="lab" style="left:${100 * yToPos(y)}%;transform:translateX(${y === -3400 ? 0 : y === 2024 ? -100 : -50}%)">${txt}</span>`;
  }
  for (const m of S.content.moments) h += `<i class="mdot" style="left:${100 * yToPos(Math.max(S.range[0], m.year))}%"></i>`;
  strip.innerHTML = h + `<div class="now"></div>`;
  const toYear = (ev) => { const r = strip.getBoundingClientRect(); return posToY((ev.clientX - r.left) / r.width); };
  let drag = false;
  strip.addEventListener("pointerdown", (ev) => { drag = true; strip.setPointerCapture(ev.pointerId); stopPlay(); go(toYear(ev)); });
  strip.addEventListener("pointermove", (ev) => { if (drag) go(toYear(ev)); });
  strip.addEventListener("pointerup", () => (drag = false));
  strip.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") { ev.preventDefault(); ev.stopPropagation(); stopPlay(); go(S.year + (ev.key === "ArrowRight" ? 1 : -1) * (ev.shiftKey ? 1 : 10)); }
  });
}
function updateStrip() {
  $("#strip .now").style.left = `${100 * yToPos(S.year)}%`;
  const ei = ERAS.indexOf(eraOf(S.year));
  document.querySelectorAll("#strip .seg").forEach((s) => s.classList.toggle("on", +s.dataset.i === ei));
  $("#strip").setAttribute("aria-valuetext", plainYear(S.year));
}
function stepChapter(dir) {
  const eras = S.content.eras;
  const target = dir > 0 ? eras.find((e) => e.year > S.year) : [...eras].reverse().find((e) => e.year < S.year);
  if (target) go(target.year);
}
function setPlayIcon(playing) {
  $("#play").innerHTML = playing ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>` : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>`;
  $("#play").setAttribute("aria-label", playing ? "Pause" : "Play");
}
function stopPlay() { if (S.playing) { clearInterval(S.playing); S.playing = null; setPlayIcon(false); } }
function togglePlay() {
  if (S.playing) return stopPlay();
  if (S.journey && S.year >= S.journey.span[1]) go(S.journey.span[0]);
  else if (!S.journey && S.year >= S.range[1]) go(S.range[0]);
  setPlayIcon(true);
  if (S.war) {
    if (S.wIdx >= S.war.events.length - 1) goWarEvent(0);
    setPlayIcon(true);
    S.playing = setInterval(() => { if (!S.war || S.wIdx >= S.war.events.length - 1) return stopPlay(); goWarEvent(S.wIdx + 1); }, 3200);
    return;
  }
  // Journeys last ~25 s whatever the empire's lifespan; the open timeline moves at a steady pace.
  const span = S.journey ? S.journey.span[1] - S.journey.span[0] : 0;
  const interval = S.journey ? Math.min(600, Math.max(110, 25000 / Math.max(1, span))) : 110;
  const jstep = S.journey ? Math.max(1, Math.round(span / (25000 / interval))) : 0;
  S.playing = setInterval(() => {
    if (S.journey) { if (S.year >= S.journey.span[1]) return stopPlay(); S.jEvent = null; return go(S.year + jstep); }
    if (S.year >= S.range[1]) return stopPlay();
    go(Math.max(S.year + 1, posToY(yToPos(S.year) + 0.0022)));
  }, interval);
}

// ---------------------------------------------------------------- search
function setupSearch() {
  const input = $("#search"), list = $("#results");
  const all = Object.entries(S.clio.realms).filter(([k]) => !NOT_A_REALM.test(k)).map(([key, r]) => ({
    key, name: displayName(key), raw: clean(key), from: r.tl[0][0], to: r.tl[r.tl.length - 1][1],
    area: Math.max(...r.tl.map((x) => x[2])), emp: !!empireOf(key),
  }));
  let active = 0, shown = [];
  const render = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { list.hidden = true; return; }
    shown = all.filter((e) => e.name.toLowerCase().includes(q) || e.raw.toLowerCase().includes(q))
      .sort((a, b) => (b.name.toLowerCase().startsWith(q) - a.name.toLowerCase().startsWith(q)) || (b.emp - a.emp) || (b.area - a.area)).slice(0, 14);
    active = 0;
    list.innerHTML = shown.length ? shown.map((e, i) => `<li data-k="${esc(e.key)}" class="${i ? "" : "active"}"><span>${esc(e.name)}${e.name !== e.raw ? ` <small>(${esc(e.raw)})</small>` : ""}</span><small>${shortYear(e.from)} – ${e.to >= 2024 ? "today" : shortYear(e.to)}</small></li>`).join("")
      : `<li><span>No match</span></li>`;
    list.hidden = false;
  };
  const choose = (key) => { list.hidden = true; input.value = ""; input.blur(); jumpTo(key, bestYear(key)); };
  input.addEventListener("input", render);
  input.addEventListener("keydown", (ev) => {
    if (list.hidden || !shown.length) return;
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault(); active = (active + (ev.key === "ArrowDown" ? 1 : shown.length - 1)) % shown.length;
      list.querySelectorAll("li").forEach((li, i) => li.classList.toggle("active", i === active));
    } else if (ev.key === "Enter") { ev.preventDefault(); choose(shown[active].key); }
    else if (ev.key === "Escape") list.hidden = true;
  });
  list.addEventListener("mousedown", (ev) => { const li = ev.target.closest("li[data-k]"); if (li) { ev.preventDefault(); choose(li.dataset.k); } });
  input.addEventListener("blur", () => setTimeout(() => (list.hidden = true), 150));
}

// ---------------------------------------------------------------- UI wiring
function setupUI() {
  $("#prev").onclick = () => { stopPlay(); stepChapter(-1); };
  $("#next").onclick = () => { stopPlay(); stepChapter(1); };
  $("#play").onclick = togglePlay;
  $("#home").onclick = (ev) => { ev.preventDefault(); select(null); d3.select(canvas).transition().duration(600).call(S.zoom.transform, d3.zoomIdentity); };
  $("#sourcesLink").onclick = (ev) => { ev.preventDefault(); S.view = "sources"; renderCol(true); };
  $("#momentsLink").onclick = (ev) => { ev.preventDefault(); if (S.journey) exitJourney(); S.view = "moments"; S.moment = null; draw(); renderCol(true); };
  $("#empiresLink").onclick = (ev) => { ev.preventDefault(); if (S.journey) exitJourney(); S.view = "empires"; S.moment = null; draw(); renderCol(true); };
  $("#dock").addEventListener("click", (ev) => { if (ev.target.closest("[data-act=exit-journey]")) exitJourney(); if (ev.target.closest("[data-act=exit-war]")) exitWar(); });
  $("#warsLink").onclick = (ev) => { ev.preventDefault(); if (S.journey) exitJourney(); if (S.war) exitWar(); S.view = "wars"; S.moment = null; draw(); renderCol(true); };
  $("#zoomIn").onclick = () => d3.select(canvas).transition().duration(300).call(S.zoom.scaleBy, 1.6);
  $("#zoomOut").onclick = () => d3.select(canvas).transition().duration(300).call(S.zoom.scaleBy, 1 / 1.6);
  $("#zoomReset").onclick = () => d3.select(canvas).transition().duration(600).call(S.zoom.transform, d3.zoomIdentity);
  const toggle = (btn, flag, after) => { btn.onclick = () => { S[flag] = !S[flag]; btn.classList.toggle("on", S[flag]); btn.setAttribute("aria-pressed", S[flag]); after(); }; };
  toggle($("#labelsBtn"), "labels", draw);
  toggle($("#peoplesBtn"), "peoples", () => { buildItems(); draw(); });

  const col = $("#col");
  col.addEventListener("click", (ev) => {
    const act = ev.target.closest("[data-act]");
    if (act) {
      if (act.dataset.act === "close") return select(null);
      if (act.dataset.act === "exit-journey") return exitJourney();
      if (act.dataset.act === "exit-war") return exitWar();
      if (act.dataset.act === "wars") { if (S.war) exitWar(); S.view = "wars"; return renderCol(true); }
      if (act.dataset.act === "empires") { if (S.journey) exitJourney(); S.view = "empires"; return renderCol(true); }
      if (act.dataset.act === "moments") { S.view = "moments"; S.moment = null; draw(); writeHash(); return renderCol(true); }
      S.view = "world"; S.moment = null; draw(); updateChartCursor(); writeHash(); return renderCol(true);
    }
    const mo = ev.target.closest("[data-moment]");
    if (mo) return openMoment(mo.dataset.moment);
    const wo = ev.target.closest("[data-war]");
    if (wo) return openWar(wo.dataset.war);
    const we = ev.target.closest("[data-wev]");
    if (we && S.war) { stopPlay(); return goWarEvent(+we.dataset.wev); }
    const jo = ev.target.closest("[data-journey]");
    if (jo) return openJourney(jo.dataset.journey);
    const je = ev.target.closest("[data-jev]");
    if (je && S.journey) { const e = S.journey.events[+je.dataset.jev]; S.jEvent = +je.dataset.jev; stopPlay(); return go(e.year); }
    const k = ev.target.closest("[data-key]");
    if (k) { stopPlay(); return select(k.dataset.key, { fly: true }); }
    const yb = ev.target.closest("[data-year]");
    if (yb) { stopPlay(); return go(+yb.dataset.year); }
    const g = ev.target.closest(".goto");
    if (g) return flyToRegion(JSON.parse(g.dataset.bb));
    const m = ev.target.closest("[data-member]");
    if (m) return select(m.dataset.member, { fly: true });
    const svg = ev.target.closest("svg.chart-s");
    if (svg) {
      const r = svg.getBoundingClientRect();
      stopPlay(); go(+svg.dataset.x0 + ((ev.clientX - r.left) / r.width) * (+svg.dataset.x1 - +svg.dataset.x0));
    }
  });
  col.addEventListener("toggle", (ev) => {
    const d = ev.target.closest?.("details[data-jopen]");
    if (!d || !S.jOpen) return;
    d.open ? S.jOpen.add(+d.dataset.jopen) : S.jOpen.delete(+d.dataset.jopen);
  }, true);
  col.addEventListener("change", (ev) => { if (ev.target.id === "ghostToggle") { S.showGhost = ev.target.checked; draw(); } });
  addEventListener("hashchange", async () => {
    const h = parseHash();
    if (h.war) { if (S.war?.id !== h.war) openWar(h.war, h.wev); else if (h.wev !== S.wIdx) goWarEvent(h.wev); return; }
    if (h.moment) { if (S.moment?.id !== h.moment) openMoment(h.moment); return; }
    if (h.journey) { if (S.journey?.id !== h.journey) openJourney(h.journey, h.year); else if (h.year != null && h.year !== S.year) go(h.year); return; }
    if (h.year != null && h.year !== S.year) await go(h.year);
    if (h.key !== S.sel) select(h.key, { fly: !!h.key });
  });
  addEventListener("keydown", (ev) => {
    if (ev.target.matches("input, textarea")) return;
    const step = ev.shiftKey ? 1 : 10;
    if (S.war && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) { stopPlay(); return goWarEvent(S.wIdx + (ev.key === "ArrowRight" ? 1 : -1)); }
    if (ev.key === "ArrowLeft") { stopPlay(); go(S.year - step); }
    else if (ev.key === "ArrowRight") { stopPlay(); go(S.year + step); }
    else if (ev.key === "PageUp" || ev.key === "[") { stopPlay(); stepChapter(-1); }
    else if (ev.key === "PageDown" || ev.key === "]") { stopPlay(); stepChapter(1); }
    else if (ev.key === " " && !ev.target.matches("button, summary")) { ev.preventDefault(); togglePlay(); }
    else if (ev.key === "Escape") { if (S.war) exitWar(); else if (S.journey) exitJourney(); else select(null); }
    else if (S.war && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) { /* handled above for years; wars use event steps */ }
  });
}

Promise.all([document.fonts.load("900 40px Archivo"), document.fonts.load("600 14px Archivo"), document.fonts.load("400 14px Inter")])
  .catch(() => {}).finally(() => init().catch((e) => {
    console.error(e);
    $("#loading").textContent = "Could not load the map data. Serve the public/ folder over HTTP.";
  }));
})();
