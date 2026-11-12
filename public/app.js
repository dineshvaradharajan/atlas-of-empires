/* The World Atlas — interactive historical world map, 10,000 BCE – today.
   State borders: Cliopatria, Seshat Global History Databank (CC BY 4.0); from 1992 on: Natural Earth (public domain).
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
  [-10000, -3400, "Before the first states"],
  [-3400, -1200, "Bronze Age"],
  [-1200, -500, "Iron Age"],
  [-500, 300, "Classical Antiquity"],
  [300, 600, "Late Antiquity"],
  [600, 1000, "Early Middle Ages"],
  [1000, 1300, "High Middle Ages"],
  [1300, 1500, "Late Middle Ages"],
  [1500, 1800, "Early Modern"],
  [1800, 1914, "Industrial & Imperial Age"],
  [1914, 2026, "Modern World"], // ends at the data's last year (set in init)
];
// Piecewise-linear time axis for the era strip: recent centuries get more room.
const BREAKS = [[-10000, 0], [-3400, 0.14], [-1000, 0.27], [0, 0.39], [1000, 0.54], [1500, 0.68], [1800, 0.84], [2026, 1]]; // the last stop is the data's last year (set in init)
const SHOW_ARROWS = false; // war maps: offensive arrows are not drawn (the data is kept; the history checker still tests them)
const WRITING = -3200; // earliest writing (Mesopotamia, Egypt): before this the map shows archaeology only
const EARLIEST = -10000; // the timeline starts here, before the border data (3400 BCE): cultures and sites only
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
  year: 1500, range: [-3400, 2026], clio: null, baseYears: [], commons: {}, corr: { realms: {}, base: {} }, supps: [],
  content: { eras: [], empires: {}, byClio: {}, moments: [], journeys: [], wars: [] }, moment: null, journey: null, rings: [], war: null,
  chunks: new Map(), bases: new Map(), windows: new Map(),
  items: [], states: [], featured: new Map(), win: null,
  t: d3.zoomIdentity, sel: null, view: "world", hover: -1, ghost: null, showGhost: true,
  labels: true, peoples: true, playing: null, width: 0, height: 0, dpr: 1, token: 0,
};
const $ = (s) => document.querySelector(s);
window.__atlas = S; S.fx = { draw: () => draw(), renderCol: () => renderCol(), setWp: (p) => setWp(p), seek: (t) => setWp(pOf(S.cineK, t), true), scr: (ll) => scr(ll), story: (t) => setStoryT(t) }; // debugging handles // read-only handle for debugging in the console
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
const displayName = (key) => S.reconName?.get(key) || clean(key); // reconstruction layers key regions by id ("corded-ware"): show the name
const realmKey = (key) => (realm(key) ? key : S.reconName?.get(key) || key); // the key the realm page is stored under
const areaAt = (key, y) => { const r = realm(key); const row = r && r.tl.find(([f, t]) => f <= y && y <= t); return row ? row[2] : 0; };
const matches = (it, key) => it.p.k === key || it.p.n === key;

// ---------------------------------------------------------------- direction B: icons, progress, ages
const ic = (d, cls = "") => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${d}</svg>`;
const I = {
  right: ic('<path d="m9 6 6 6-6 6"/>'), left: ic('<path d="m15 6-6 6 6 6"/>'),
  pin: ic('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>'),
  play: ic('<path d="M7 4.5v15l13-7.5z"/>'), pause: ic('<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>'),
  share: ic('<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>'),
  book: ic('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>'),
  chart: ic('<path d="M3 20h18M3 16l5-6 4 3 5-8 4 5"/>'), close: ic('<path d="M6 6l12 12M18 6 6 18"/>'),
  today: ic('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
  crown: ic('<path d="M4 18h16l-1.5-10-4.5 4-2-6-2 6-4.5-4z"/>'), sword: ic('<path d="M14.5 4H20v5.5L9 20.5 3.5 15z"/><path d="m6 12 6 6"/>'),
  evpin: ic('<path d="M12 22s-7-6.4-7-12a7 7 0 0 1 14 0c0 5.6-7 12-7 12z"/><circle cx="12" cy="10" r="2.6"/>'),
  star: ic('<path d="m12 4 2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16.2 7 19l1.2-5.6L4 9.6 9.6 9z"/>'),
};
// What this viewer has read, kept in their browser: events seen per empire story and war, moments seen, days visited.
const P = (() => { let p = {}; try { p = JSON.parse(localStorage.getItem("atlas.progress") || "{}") || {}; } catch { p = {}; } return Object.assign({ e: {}, w: {}, m: [], d: [], last: null }, p); })();
let pSaveT = 0;
const saveP = () => { clearTimeout(pSaveT); pSaveT = setTimeout(() => { try { localStorage.setItem("atlas.progress", JSON.stringify(P)); } catch {} }, 400); };
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
(() => { const k = dayKey(); if (!P.d.includes(k)) { P.d.push(k); P.d = P.d.slice(-60); saveP(); } })();
function markSeen(kind, id, idx) { // kind "e" (empire story) or "w" (war): the event index just shown
  if (idx == null || idx < 0) return;
  const list = (P[kind][id] ||= []);
  if (!list.includes(idx)) { list.push(idx); saveP(); }
  if (P.last?.k !== kind || P.last?.id !== id) { P.last = { k: kind, id }; saveP(); }
}
function markMoment(id) { if (!P.m.includes(id)) { P.m.push(id); saveP(); } }
const seenCount = (kind, id) => (P[kind][id] || []).length;
const storyState = (kind, id, total) => { const n = Math.min(total, seenCount(kind, id)); return n >= total && total ? "done" : n ? "doing" : ""; };
function streak() { // days in a row up to today, and this week's visited days (Monday first)
  const has = new Set(P.d), d = new Date(); let n = 0;
  for (const x = new Date(d); has.has(dayKey(x)); x.setDate(x.getDate() - 1)) n++;
  const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return { on: has.has(dayKey(x)), now: dayKey(x) === dayKey(d) }; });
  return { n, week };
}
// Moments are grouped into broad ages for the bottom bar (the app's 24 named ages, merged to 13).
const AGES = [[-99999, -1200, "Bronze Age", "To 1200 BCE"], [-1200, -500, "Iron Age", "1200–500 BCE"], [-500, 1, "Classical Age", "500–1 BCE"], [1, 500, "Antiquity", "1–500"],
  [500, 1000, "Early Middle Ages", "500–1000"], [1000, 1400, "High Middle Ages", "1000–1400"], [1400, 1530, "Age of Discovery", "1400–1530"], [1530, 1775, "Early Modern", "1530–1775"],
  [1775, 1880, "Age of Revolutions", "1775–1880"], [1880, 1914, "Age of Empire", "1880–1914"], [1914, 1945, "World Wars", "1914–1945"], [1945, 1991, "Cold War", "1945–1991"], [1991, 99999, "Our time", "1991–today"]];
const ageOf = (y) => Math.max(0, AGES.findIndex((a) => a[0] <= y && y < a[1]));
const ageMoments = (i) => S.content.moments.filter((m) => AGES[i][0] <= m.year && m.year < AGES[i][1]);
// The Stories list's period filter.
const PERIODS = [["all", "All", -1e9, 1e9], ["a", "Before 500 BCE", -1e9, -500], ["b", "500 BCE to 500", -500, 500], ["c", "500 to 1500", 500, 1500], ["d", "After 1500", 1500, 1e9]];
const firstSentences = (text, n = 2) => { const parts = String(text || "").match(/[^.!?]+(?:[.!?]+["'”’)]?|$)\s*/g) || []; return parts.slice(0, n).join("").trim() || String(text || ""); };
const yearLabel = (y) => (y < 0 ? `${-y}<small>BCE</small>` : `${y}`);
const rangeShort = (a, b) => (b >= S.range[1] ? `${shortYear(a)} to today` : a < 0 && b < 0 ? `${-a}–${-b} BCE` : a < 0 ? `${-a} BCE–${b}` : `${a}–${b}`);
const rangeText = (a, b) => `${shortYear(a)} to ${b >= S.range[1] ? "today" : shortYear(b)}`;
// Period newspaper clippings and photos (events after 1850), each with its credit and licence.
function mediaHTML(key) {
  const items = (S.media || {})[key];
  if (!items?.length) return "";
  const ok = (u) => /^https:\/\//i.test(u || "");
  return `<div class="media">${items.filter((m) => ok(m.image)).map((m) => `<figure class="mfig ${m.type === "newspaper" ? "news" : "photo"}">
      <a href="${safeUrl(m.page)}" target="_blank" rel="noopener"><img src="${safeUrl(m.image)}" alt="${esc(m.caption || m.publication || "")}" loading="lazy"></a>
      <figcaption>${m.type === "newspaper" ? `<b>${esc(m.publication || "Newspaper")}${m.date ? `, ${esc(m.date)}` : ""}</b> · ` : ""}${esc(m.caption || "")}
      <span class="muted"> ${esc(m.credit || "")}${m.license ? ` · ${esc(m.license)}` : ""}</span></figcaption></figure>`).join("")}</div>`;
}
// Every link built from data goes through here: only http(s) addresses, escaped (a "javascript:" link would run code).
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || "")) ? esc(u) : "#");
function sourcesList(list, title = "Sources") {
  const ok = (list || []).filter((x) => x && /^https?:\/\//i.test(x.url || ""));
  if (!ok.length) return "";
  return `<h3 class="sec">${title}</h3><ol class="refs">${ok.map((x) => `<li><a href="${safeUrl(x.url)}" target="_blank" rel="noopener">${esc(x.title || x.url)}</a></li>`).join("")}</ol>`;
}
const vivid = () => (theme.dark ? VIVID_DARK : VIVID_LIGHT);
const RECON_COLORS = ["#C0662F", "#2F7D6D", "#7A5FB0", "#A67C00", "#5E8FC4", "#B5487A", "#3B6E3B", "#8C4A2F"];
const PRINCELY = "Indian princely states"; // key shared by every region of content/supplements/princely-states.json
function tint(c, f) { // mix a colour with the page background (f = share of background)
  const v = c.match(/^#([0-9a-f]{6})$/i) ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) : null;
  const b = theme.bg.match(/^#([0-9a-f]{6})$/i) ? [1, 3, 5].map((i) => parseInt(theme.bg.slice(i, i + 2), 16)) : [255, 255, 255];
  if (!v) return c;
  return "#" + v.map((x, i) => Math.round(x * (1 - f) + b[i] * f).toString(16).padStart(2, "0")).join("");
}
function colorOf(key) {
  if (S.war) { const m = S.warMap || warSides(S.war, warT()); return m.has(key) ? SIDE_COLORS[m.get(key) % SIDE_COLORS.length] : [theme.other1, theme.other2, theme.other3][hash(clean(key)) % 3]; }
  if (key === PRINCELY && key !== S.sel && !S.journey) return tint(colorOf("(British Empire)"), 0.5); // under British paramountcy, not British-ruled: a lighter shade of the Raj
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
    water: v("--water"), waterLabel: v("--water-label"),
    dark: dt === "dark" };
  const c = document.createElement("canvas"); c.width = c.height = 6;
  const x = c.getContext("2d"); x.fillStyle = theme.peoplesBg; x.fillRect(0, 0, 6, 6);
  x.strokeStyle = theme.peoplesLine; x.lineWidth = 1.6; x.beginPath();
  for (let i = -6; i <= 12; i += 3) { x.moveTo(i, 6); x.lineTo(i + 6, 0); }
  x.stroke(); theme.hatch = ctx.createPattern(c, "repeat");
}

// ---------------------------------------------------------------- data
// Each release stamps its version on index.html (tools/deploy.sh); data requests carry it, so browsers and the edge can keep
// every data file for a year and a new release is never served stale. Locally there is no stamp and nothing is added.
const DATA_V = document.querySelector('meta[name="data-version"]')?.content || "";
const V = (url) => (DATA_V ? `${url}${url.includes("?") ? "&" : "?"}v=${DATA_V}` : url);
async function fetchJSON(url) { const r = await fetch(V(url)); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); }
// Loaded files are kept for reuse, but a cache with `max` keeps only the most recently used ones: jumping around in time
// used to keep every border file and base map (and their GPU shapes) for the whole visit, until the tab ran out of memory.
function memo(map, key, url, post = (x) => x, max = 0) {
  if (map.has(key)) { const v = map.get(key); if (max) { map.delete(key); map.set(key, v); } return v; }
  map.set(key, fetchJSON(url).then(post).catch((e) => { map.delete(key); throw e; }));
  if (max) for (const k of map.keys()) { if (map.size <= max) break; if (k !== key) map.delete(k); }
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
const loadChunk = (c) => memo(S.chunks, c, `data/clio/${c}.json`, rewind, 12);
let HOME_YEAR = 1683; // the year the atlas opens on: replaced at start-up by the year of something that happened on today's date
const baseYearFor = (y) => S.baseYears.reduce((b, v) => (Math.abs(v - y) < Math.abs(b - y) ? v : b), S.baseYears[0]);
const loadBase = (by) => memo(S.bases, by, `data/${by}.json`, rewind, 8);

async function init() {
  readTheme();
  const [clio, base, content, commons, corr, supps, media, sites] = await Promise.all([ // all at once, not one after another
    fetchJSON("data/clio/index.json"), fetchJSON("data/index.json"),
    fetchJSON("data/content.json").catch(() => null), fetchJSON("data/commons.json").catch(() => ({})),
    fetchJSON("data/corrections.json").catch(() => null), fetchJSON("data/supplements.json").catch(() => []),
    fetchJSON("data/media.json").catch(() => ({})), fetchJSON("data/sites.json").catch(() => []),
  ]);
  S.media = media;
  S.clio = clio; S.range = [Math.min(EARLIEST, clio.range[0]), clio.range[1]]; S.baseYears = base.years; S.commons = commons;
  ERAS[ERAS.length - 1][1] = BREAKS[BREAKS.length - 1][0] = S.range[1]; // the last era and the time axis end at the present
  S.sites = sites;
  fetchJSON("data/physical.json").then(preparePhysical).then(() => draw()).catch(() => {}); // rivers, lakes, sea names: drawn once loaded
  if (GL) { GL.loadTexture("relief", "data/relief.jpg"); GL.loadTexture("shelf", "data/shelf.png"); } // terrain shading; seabed for ice-age coasts
  fetchJSON("data/iceage.json").then((d) => { S.iceage = prepareIceage(d); draw(); }).catch(() => {});
  fetchJSON("data/disputed.json").then((d) => { S.disputed = d.map((a) => ({ ...a, f: { type: "Feature", geometry: { type: "MultiPolygon", coordinates: a.coords.map(wind) }, properties: {} } })); draw(); }).catch(() => {});
  { const im = new Image(); im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(im, 0, 0); S.shelfPix = { w: im.width, h: im.height, d: x.getImageData(0, 0, im.width, im.height).data }; }; im.src = V("data/shelf.png"); }
  if (corr) { S.corr = { realms: corr.realms || {}, base: corr.base || {} }; correctTimelines(); }
  S.supps = prepareSupplements(supps);
  if (content) {
    S.content.eras = (content.eras || []).sort((a, b) => a.year - b.year);
    S.content.moments = (content.moments || []).sort((a, b) => a.year - b.year);
    S.content.journeys = content.journeys || [];
    S.content.wars = content.wars || [];
    for (const e of content.empires || []) for (const n of e.clio || []) S.content.byClio[n] = e;
  }
  setupMap();
  setupChart();
  setupSearch();
  setupUI();
  setupDock();
  pickToday();
  S.restoring = true;
  await applyHash(parseHash(), true);
  setTimeout(() => (S.restoring = false), 0);
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
    f = byName["crop:" + cr.box.join(",")] ||= { type: "Feature", geometry: f.geometry, properties: { ...f.properties, crop: cr.box2, cropBox: cr.box } };
  }
  const cuts = c.cut ? c.cut.filter((r) => inRange(y, [r.from, r.to])) : [];
  if (cuts.length) { // draw the shape except inside these lon/lat boxes (territory it never held)
    cuts.forEach((r) => (r.box2 ||= boxFeature(r.box)));
    let byName = relabelCache.get(f);
    if (!byName) relabelCache.set(f, (byName = {}));
    f = byName["cut:" + cuts.map((r) => r.box.join(",")).join("|") + (f.properties.crop ? ":c" : "")] ||= { type: "Feature", geometry: f.geometry, properties: { ...f.properties, cut: cuts.map((r) => r.box2), cutBoxes: cuts.map((r) => r.box) } };
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
  if (it.p.recon || it.p.crop || it.p.cut) { c.save(); clipFor(c, it); c.stroke(pathOf(it.f)); c.restore(); }
  else c.stroke(pathOf(it.f));
}
function clipFor(c, it) { // apply the clip a feature needs (coastline for reconstructions, box for crops)
  if (it.p.recon) c.clip(S.landClip);
  if (it.p.crop) c.clip(pathOf(it.p.crop));
  if (it.p.cut) { const p = new Path2D(); p.rect(-1e5, -1e5, 2e5, 2e5); for (const cf of it.p.cut) p.addPath(pathOf(cf)); c.clip(p, "evenodd"); }
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
  S.reconName = new Map();
  for (const sp of list) for (const rg of sp.regions) if (rg.key && rg.key !== rg.name && !S.reconName.has(rg.key)) S.reconName.set(rg.key, rg.name);
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
  if (GL && S.playing > 0) warmAhead(y);
  const n = S.clio.chunks, ci = n.indexOf(chunkOf(y));
  [n[ci - 1], n[ci + 1]].forEach((k) => k !== undefined && loadChunk(k).catch(() => {}));
}
function warmAhead(y) { // during timeline playback, load and triangulate the next base map / border chunk before they are needed
  const ahead = posToY(yToPos(y) + 0.02), key = `${baseYearFor(ahead)}|${chunkOf(ahead)}`;
  if (S.warmedFor === key) return;
  S.warmedFor = key;
  const jobs = [];
  if (baseYearFor(ahead) !== baseYearFor(y)) jobs.push(loadBase(baseYearFor(ahead)).then((b) => b.features));
  const ck = chunkOf(ahead);
  jobs.push(loadChunk(ck).then((c) => c.features.filter((f) => f.properties.f <= ahead && y <= f.properties.t).map((f) => correctFeature(f, Math.max(y, f.properties.f)))));
  Promise.all(jobs).then((lists) => GL.warm(lists.flat())).catch(() => {});
}
function renderAll() {
  if (!S.base) return;
  const nr = $("#noRecords"); if (nr) nr.hidden = !(S.year < WRITING && !S.war && S.view !== "journey");
  if (S.war) { S.warMap = warSides(S.war, warT()); }
  else if (!S.journey) updateWindow();
  else if (S.jRendered !== S.journey.id) renderJourneyChart();
  computeFeatured();
  buildItems();
  S.hover = -1;
  draw();
  updateChartCursor();
  updateDock();
  if (S.playing > 0 && performance.now() - (S.colAt || 0) < 500) { // timeline playback: full column at most twice a second, the year every step
    const ye = $("#col .bigy.live"); if (ye) ye.innerHTML = yearLabel(S.year);
  } else { S.colAt = performance.now(); renderCol(); }
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
  const tm = raw.match(/^t\/(\d+)$/);
  if (tm) return { year: null, key: null, tstory: Math.max(0, +tm[1] - 1) };
  const mm = raw.match(/^m\/(.+)$/);
  if (mm) return { year: null, key: null, moment: mm[1] };
  const pm = raw.match(/^p\/(-?[\d.]+),(-?[\d.]+)$/);
  if (pm) return { year: null, key: null, place: [+pm[1], +pm[2]] };
  const sm = raw.match(/^s\/(.+)$/);
  if (sm) return { year: null, key: null, site: sm[1] };
  const wm = raw.match(/^w\/([^/]+)(?:\/(c?)(\d+))?$/);
  if (wm) return { year: null, key: null, war: wm[1], wev: wm[3] != null && !wm[2] ? +wm[3] : 0, chap: wm[2] ? Math.max(0, +wm[3] - 1) : null };
  const je = raw.match(/^e\/([^/]+)(?:\/(-?\d+))?$/);
  if (je) return { year: je[2] != null ? +je[2] : null, key: null, journey: je[1] };
  if (LISTS.has(raw) || raw === "about") return { year: null, key: null, list: raw === "about" ? "sources" : raw };
  const m = raw.match(/^(-?\d+)(?:\/(.+))?$/);
  return m ? { year: +m[1], key: m[2] || null } : { year: null, key: null, bad: !!raw };
}
// Opening a page adds a browser history entry (so Back steps back through pages); moving through time, chapters or
// events within the same page only updates the address. Several writes in one step make a single entry.
const pageOf = (h) => { const r = decodeURIComponent(h.replace(/^#/, "")); const m = r.match(/^(?:-?\d+)?(?:\/(.+))?$/); return m ? "y/" + (m[1] || "") : r.replace(/^([we]\/[^/]+).*$/, "$1"); };
// Show the page a web address names. Unknown addresses say so and fall back to the nearest sensible page.
// "On this day": the home page opens on a dated event (from the wars) that happened on today's date in another year,
// or the nearest date to it; the same pick all day.
function pickToday() {
  const now = new Date(), md = [now.getMonth() + 1, now.getDate()];
  const doy = (m, d) => new Date(2001, m - 1, d).getTime() / 864e5;
  const today = doy(...md), all = [];
  for (const w of S.content.wars) (w.events || []).forEach((e, i) => {
    const m = String(e.date || "").match(/-(\d\d)-(\d\d)$/);
    if (!m || !e.lonlat || e.year == null || e.year > now.getFullYear() - 1) return;
    let gap = Math.abs(doy(+m[1], +m[2]) - today); gap = Math.min(gap, 365 - gap);
    all.push({ w, i, e, gap });
  });
  if (!all.length) return;
  const best = Math.min(...all.map((x) => x.gap));
  if (best > 10) return;
  const pool = all.filter((x) => x.gap === best);
  const pick = pool[hash(`${now.getFullYear()}-${md.join("-")}`) % pool.length];
  S.today = { war: pick.w, idx: pick.i, e: pick.e, exact: best === 0 };
  HOME_YEAR = pick.e.year;
}
// Today's story: the war opened at each step's event, the card telling the step.
async function openTodayStory(step = 0, keepPlay) {
  const t = S.today; if (!t) return;
  if (!keepPlay) stopPlay();
  const steps = todaySteps(); step = Math.max(0, Math.min(steps.length - 1, step));
  const st = steps[step];
  if (S.war?.id !== t.war.id) { S.from = null; await openWar(t.war.id, st.idx); }
  else await goWarEvent(st.idx, false, true);
  S.tstory = { step }; S.wTab = "story";
  renderCol(true); writeHash(); draw();
}
function brokenLink(what) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); $("#stage").append(t); }
  t.textContent = `That link points to ${what} that isn't in the atlas. Showing the map instead.`;
  t.classList.add("on"); clearTimeout(S.toastT); S.toastT = setTimeout(() => t.classList.remove("on"), 5000);
}
async function applyHash(h, first = false) {
  const leaveDrill = () => { if (S.war) exitWar(); if (S.journey) exitJourney(); S.moment = null; S.site = null; };
  if (h.tstory != null) { if (first) await go(HOME_YEAR); if (S.today) return openTodayStory(h.tstory); }
  if (h.site) {
    if (!(S.sites || []).some((x) => x.id === h.site)) brokenLink("a site");
    else { if (first) await go(-3000); if (S.site?.id !== h.site || S.view !== "site") openSite(h.site); return; }
  } else if (h.war) {
    if (!warById(h.war)) brokenLink("a war");
    else if (S.war?.id !== h.war) return openWar(h.war, h.wev, h.chap);
    else { if (story()) { if (h.chap != null && h.chap !== S.chap) openChapter(h.chap); } else if (h.wev !== S.wIdx) goWarEvent(h.wev); return; }
  } else if (h.journey) {
    if (!journeyById(h.journey)) brokenLink("an empire's story");
    else if (S.journey?.id !== h.journey) return openJourney(h.journey, h.year);
    else { if (h.year != null && h.year !== S.year) await go(h.year); return; }
  } else if (h.moment) {
    if (!momentById(h.moment)) brokenLink("a moment");
    else { if (S.moment?.id !== h.moment || S.view !== "moment") await openMoment(h.moment); return; }
  } else if (h.place) {
    if (first) await go(HOME_YEAR);
    return openPlace(h.place);
  } else if (h.bad) brokenLink("a page");
  if (h.list) {
    leaveDrill(); S.from = null; S.sel = null; S.view = h.list; if (h.list !== "sources") S.lastList = h.list;
    if (first) await go(HOME_YEAR);
    draw(); renderCol(true); return;
  }
  const home = !location.hash || h.bad || h.war || h.journey || h.moment || h.site; // unknown ids land on the home page
  const year = h.year ?? (home ? HOME_YEAR : S.year);
  let key = h.key;
  if (key && !realm(key)) { brokenLink("a realm"); key = null; }
  const wasDrill = S.war || S.journey || S.view !== "world" && S.view !== "realm";
  leaveDrill();
  if (first || year !== S.year) await go(year);
  if (key !== S.sel || wasDrill) await select(key, { fly: !!key });
  if (home && !key) { S.view = "today"; S.place = null; renderCol(true); draw(); }
  if (home && !first) d3.select(canvas).transition().duration(600).call(S.zoom.transform, d3.zoomIdentity);
  writeHash(); // tidy the address (a broken link is replaced by the page actually shown)
}
function writeHash() { if (!S.hashQueued) { S.hashQueued = true; queueMicrotask(commitHash); } }
function commitHash() {
  S.hashQueued = false;
  const h = S.tstory && S.war ? `#t/${S.tstory.step + 1}` : LISTS.has(S.view) && !S.war && !S.journey ? `#${S.view === "sources" ? "about" : S.view}` : S.view === "place" && S.place ? `#p/${S.place.ll[0].toFixed(2)},${S.place.ll[1].toFixed(2)}` : S.view === "site" && S.site ? `#s/${encodeURIComponent(S.site.id)}` : S.war ? `#w/${encodeURIComponent(S.war.id)}/${story() ? "c" + (S.chap + 1) : S.wIdx}` : S.journey ? `#e/${encodeURIComponent(S.journey.id)}/${S.year}` : S.view === "moment" && S.moment ? `#m/${encodeURIComponent(S.moment.id)}` : `#${S.year}${S.sel ? "/" + encodeURIComponent(S.sel) : ""}`;
  const home = !S.war && !S.journey && !S.sel && S.view === "today"; // Today has a bare URL
  const url = home ? location.pathname + location.search : h, now = location.hash;
  if (decodeURIComponent(now) === decodeURIComponent(home ? "" : h)) return;
  if (!S.restoring && pageOf(now) !== pageOf(home ? "" : h)) history.pushState(null, "", url);
  else history.replaceState(null, "", url);
}

// ---------------------------------------------------------------- back navigation
// Opening a war, empire journey, moment or site from one of the lists remembers that list; leaving returns to it.
const LISTS = new Set(["wars", "empires", "moments", "sources"]);
const DRILLS = new Set(["war", "journey", "moment", "site", "place"]);
const BACK = { wars: "Stories", empires: "Stories", moments: "Stories", sources: "About" };
function noteFrom() { if (LISTS.has(S.view)) S.from = S.view; else if (!DRILLS.has(S.view)) S.from = null; }
function backLabel(dflt) { return S.from ? BACK[S.from] : dflt; }
function goBack() { // after leaving a drill-down: show the list it was opened from, if any
  const v = S.from; S.from = null;
  if (!v) return false;
  S.view = v; renderCol(true); writeHash();
  return true;
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
  const extras = cand.slice(7, 13).map((c) => c.key); // the next-largest realms of the era also get colours, fixed for the whole era
  let max = 1;
  ys.forEach((_, i) => { max = Math.max(max, series.reduce((s, c) => s + c.vals[i], 0)); });
  const w = { a, b, ys, series, max, extras };
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
  // Colours belong to the era, not the year: the era's great powers, then its next-largest realms. Choosing the extras
  // year by year made colours jump between countries during playback (a realm keeps its colour while it exists).
  S.win.series.forEach((s, i) => f.set(s.key, i));
  let i = S.win.series.length;
  for (const k of S.win.extras || []) if (!f.has(k) && i < VIVID_LIGHT.length) f.set(k, i++);
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

// ---------------------------------------------------------------- WebGL renderer
// Territory fills, borders and graticule are drawn on the GPU (#gl) when WebGL is available; labels, pins and
// highlight outlines stay on the 2D overlay (#map). Shapes are projected once, triangulated with earcut and cached,
// so pan/zoom only change two uniforms; year changes cross-fade. Falls back to Canvas2D if WebGL is unavailable.
const GL = (() => {
  const cv = document.getElementById("gl");
  if (!cv || typeof earcut !== "function") return null;
  const gl = cv.getContext("webgl", { stencil: true, antialias: true, alpha: false });
  if (!gl) return null;
  const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, `attribute vec2 p; uniform vec2 u_t; uniform float u_k; uniform vec2 u_size;
      void main(){ vec2 s = p * u_k + u_t; gl_Position = vec4(s.x / u_size.x * 2.0 - 1.0, 1.0 - s.y / u_size.y * 2.0, 0.0, 1.0); }`));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, `precision mediump float; uniform vec4 u_c; uniform vec4 u_c2; uniform float u_hatch; uniform float u_dpr; uniform float u_a;
      void main(){ vec4 c = u_c; if (u_hatch > 0.5) { float d = mod((gl_FragCoord.x + gl_FragCoord.y) / u_dpr, 4.2); c = d < 1.2 ? u_c2 : u_c; } gl_FragColor = vec4(c.rgb, c.a * u_a); }`));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { console.warn("WebGL unavailable, using Canvas2D:", e); return null; }
  gl.useProgram(prog);
  const L = (n) => gl.getUniformLocation(prog, n), aP = gl.getAttribLocation(prog, "p");
  const U = { t: L("u_t"), k: L("u_k"), size: L("u_size"), c: L("u_c"), c2: L("u_c2"), hatch: L("u_hatch"), dpr: L("u_dpr"), a: L("u_a") };
  let geo = new WeakMap();                 // feature -> { fill: Float32Array, line: Float32Array }
  const colors = new Map();
  const rgba = (c) => {
    if (colors.has(c)) return colors.get(c);
    const x = (rgba.cx ||= document.createElement("canvas").getContext("2d")); x.fillStyle = "#000"; x.fillStyle = c; const h = x.fillStyle; // one scratch canvas for every colour
    const v = h.startsWith("#") ? [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).concat(1)
      : (h.match(/[\d.]+/g) || [0, 0, 0, 1]).map((n, i) => (i < 3 ? n / 255 : +n));
    if (v.length === 3) v.push(1);
    colors.set(c, v); return v;
  };
  function rings(feature) { // projected (zoom-1 screen) rings via a recording path context
    const out = []; let cur = null;
    const rec = { beginPath() {}, moveTo(x, y) { cur = [x, y]; out.push(cur); }, lineTo(x, y) { cur.push(x, y); }, closePath() {}, arc() {} };
    d3.geoPath(projection, rec)(feature);
    return out.filter((r) => r.length >= 6);
  }
  const area2 = (r) => { let a = 0; for (let i = 0; i < r.length; i += 2) { const j = (i + 2) % r.length; a += r[i] * r[j + 1] - r[j] * r[i + 1]; } return a; };
  function build(feature) {
    let g = geo.get(feature);
    if (g) return g;
    const rs = rings(feature), fill = [], line = [];
    if (rs.length) {
      let big = rs[0]; for (const r of rs) if (Math.abs(area2(r)) > Math.abs(area2(big))) big = r;
      const ext = Math.sign(area2(big)), polys = [];
      for (const r of rs) { if (Math.sign(area2(r)) === ext || !polys.length) polys.push([r]); else polys[polys.length - 1].push(r); }
      for (const poly of polys) {
        const flat = [], holes = [];
        poly.forEach((r, i) => { if (i) holes.push(flat.length / 2); for (const v of r) flat.push(v); });
        const idx = earcut(flat, holes);
        for (const i of idx) fill.push(flat[2 * i], flat[2 * i + 1]);
      }
      for (const r of rs) for (let i = 0; i < r.length; i += 2) { const j = (i + 2) % r.length; line.push(r[i], r[i + 1], r[j], r[j + 1]); }
    }
    g = { fill: new Float32Array(fill), line: new Float32Array(line) };
    geo.set(feature, g);
    return g;
  }
  // A "layer" = one uploaded vertex buffer for a set of items, with per-item ranges.
  function makeLayer(items) {
    let nf = 0, nl = 0;
    const gs = items.map((it) => { const g = build(it.f); nf += g.fill.length; nl += g.line.length; return g; });
    const fill = new Float32Array(nf), line = new Float32Array(nl), ranges = [];
    let of = 0, ol = 0;
    gs.forEach((g, i) => { fill.set(g.fill, of); line.set(g.line, ol); ranges.push({ it: items[i], f0: of / 2, fn: g.fill.length / 2, l0: ol / 2, ln: g.line.length / 2 }); of += g.fill.length; ol += g.line.length; });
    const fb = gl.createBuffer(), lb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fb); gl.bufferData(gl.ARRAY_BUFFER, fill, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, lb); gl.bufferData(gl.ARRAY_BUFFER, line, gl.STATIC_DRAW);
    return { items, fb, lb, ranges };
  }
  const freeLayer = (l) => { if (l) { gl.deleteBuffer(l.fb); gl.deleteBuffer(l.lb); } };
  let cur = null, prev = null, fadeT0 = 0, statics = null, landLayer = null;
  const FADE = 260;
  function setItems(items) {
    if (cur && cur.items === items) return;
    // During playback (the timeline or an empire journey) years arrive faster than a cross-fade can finish, and fading
    // each one in made the map pulse; consecutive years differ little, so playback swaps layers instantly.
    if (S.playing > 0) { freeLayer(prev); freeLayer(cur); prev = null; }
    else { // a new year arriving mid-fade fades from whichever layer is mostly on screen (no jump to a half-faded layer)
      const e = prev ? (performance.now() - fadeT0) / FADE : 1;
      if (prev && e < 0.5) freeLayer(cur); else { freeLayer(prev); prev = cur; }
    }
    cur = makeLayer(items); fadeT0 = performance.now();
    freeLayer(landLayer); landLayer = null;
  }
  function makeStatics() {
    const ls = [];
    for (const g of [d3.geoGraticule10(), { type: "Sphere" }]) {
      const r = rings({ type: "Feature", geometry: g.type === "Sphere" ? g : g, properties: {} });
      ls.push(r.flatMap((ring) => { const o = []; for (let i = 0; i + 3 < ring.length; i += 2) o.push(ring[i], ring[i + 1], ring[i + 2], ring[i + 3]); return o; }));
    }
    const sph = build({ type: "Feature", geometry: { type: "Sphere" }, properties: {} });
    const mk = (arr) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW); return { b, n: arr.length / 2 }; };
    return { grat: mk(ls[0]), sphereLine: mk(ls[1]), sphereFill: mk(Array.from(sph.fill)) };
  }
  function bindPos(buf) { gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0); }
  function color(c, a = 1) { const v = rgba(c); gl.uniform4f(U.c, v[0], v[1], v[2], v[3]); gl.uniform1f(U.hatch, 0); gl.uniform1f(U.a, a); }
  function drawLayer(layer, fillOf, alpha) {
    bindPos(layer.fb);
    const later = [];
    for (const r of layer.ranges) {
      if (!r.fn) continue;
      if (r.it.p.recon || r.it.p.crop || r.it.p.cut) { later.push(r); continue; }
      const f = fillOf(r.it);
      if (f === "HATCH") { const a = rgba(theme.peoplesBg), b = rgba(theme.peoplesLine); gl.uniform4f(U.c, ...a); gl.uniform4f(U.c2, ...b); gl.uniform1f(U.hatch, 1); gl.uniform1f(U.a, alpha); }
      else color(f, alpha);
      gl.drawArrays(gl.TRIANGLES, r.f0, r.fn);
    }
    // clipped items (reconstructions to the coastline, crops to their box) via the stencil buffer
    for (const r of later) {
      gl.enable(gl.STENCIL_TEST);
      gl.clearStencil(r.it.p.cut && !r.it.p.crop && !r.it.p.recon ? 1 : 0); gl.clear(gl.STENCIL_BUFFER_BIT); gl.clearStencil(0); // a cut-only item starts everywhere

      gl.colorMask(false, false, false, false); gl.stencilFunc(gl.ALWAYS, 1, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
      if (r.it.p.recon) {
        if (!landLayer) landLayer = makeLayer(S.items.filter((it) => it.kind !== "state"));
        bindPos(landLayer.fb); color("#000"); for (const q of landLayer.ranges) if (q.fn) gl.drawArrays(gl.TRIANGLES, q.f0, q.fn);
      }
      if (r.it.p.crop) {
        const g = build(r.it.p.crop), b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, g.fill, gl.STREAM_DRAW); bindPos(b);
        if (r.it.p.recon) { gl.stencilFunc(gl.EQUAL, 1, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR); gl.drawArrays(gl.TRIANGLES, 0, g.fill.length / 2); gl.stencilFunc(gl.EQUAL, 2, 0xff); }
        else { gl.drawArrays(gl.TRIANGLES, 0, g.fill.length / 2); gl.stencilFunc(gl.EQUAL, 1, 0xff); }
        gl.deleteBuffer(b);
      } else gl.stencilFunc(gl.EQUAL, 1, 0xff);
      if (r.it.p.cut) { // punch the cut boxes out of the stencil
        const ref = r.it.p.recon && r.it.p.crop ? 2 : 1;
        gl.stencilFunc(gl.ALWAYS, 0, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        for (const cf of r.it.p.cut) { const g = build(cf), b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, g.fill, gl.STREAM_DRAW); bindPos(b); gl.drawArrays(gl.TRIANGLES, 0, g.fill.length / 2); gl.deleteBuffer(b); }
        gl.stencilFunc(gl.EQUAL, ref, 0xff);
      }
      gl.colorMask(true, true, true, true); gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      bindPos(layer.fb); color(fillOf(r.it), alpha); gl.drawArrays(gl.TRIANGLES, r.f0, r.fn);
      gl.disable(gl.STENCIL_TEST);
    }
    // borders of ordinary states (reconstructed/cropped borders are drawn on the 2D overlay)
    bindPos(layer.lb); color(theme.borderLine || theme.border, alpha);
    for (const r of layer.ranges) if (r.ln && r.it.kind === "state" && !r.it.p.recon && !r.it.p.crop && !r.it.p.cut) gl.drawArrays(gl.LINES, r.l0, r.ln);
  }
  // ---- world images draped on the map (data/relief.jpg terrain shading, data/shelf.png shallow seabed)
  // A lon/lat grid of vertices, projected on the CPU like every other shape, with texture coordinates in lon/lat.
  const rprog = gl.createProgram();
  let rasterOK = true;
  try {
    gl.attachShader(rprog, sh(gl.VERTEX_SHADER, `attribute vec2 p; attribute vec2 uv; uniform vec2 u_t; uniform float u_k; uniform vec2 u_size; varying vec2 v_uv;
      void main(){ v_uv = uv; vec2 s = p * u_k + u_t; gl_Position = vec4(s.x / u_size.x * 2.0 - 1.0, 1.0 - s.y / u_size.y * 2.0, 0.0, 1.0); }`));
    gl.attachShader(rprog, sh(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 v_uv; uniform sampler2D u_tex; uniform float u_mode; uniform float u_drop; uniform vec4 u_land; uniform float u_str;
      void main(){ float v = texture2D(u_tex, v_uv).r;
        if (u_mode < 0.5) { gl_FragColor = vec4(vec3(mix(1.0, v, u_str)), 1.0); }                         // relief: multiplied over the map
        else { float d = v * 255.0; if (d < 0.5 || d > u_drop) discard; gl_FragColor = u_land; } }`));    // seabed above the old sea level: dry land
    gl.linkProgram(rprog);
    if (!gl.getProgramParameter(rprog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(rprog));
  } catch (e) { console.warn("map images unavailable:", e); rasterOK = false; }
  const RL = (n) => gl.getUniformLocation(rprog, n);
  const RU = rasterOK ? { t: RL("u_t"), k: RL("u_k"), size: RL("u_size"), tex: RL("u_tex"), mode: RL("u_mode"), drop: RL("u_drop"), land: RL("u_land"), str: RL("u_str") } : null;
  const rP = rasterOK ? gl.getAttribLocation(rprog, "p") : -1, rUV = rasterOK ? gl.getAttribLocation(rprog, "uv") : -1;
  const textures = {};
  let mesh = null;
  function loadTexture(name, url) {
    if (!rasterOK || textures[name]) return;
    textures[name] = { ready: false };
    const img = new Image();
    img.onload = () => {
      const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
      textures[name] = { ready: true, tx };
      draw();
    };
    img.src = V(url);
  }
  function makeMesh() { // 1° steps; rows of triangles between consecutive latitudes
    const pos = [], uv = [], step = 1;
    const P = (lon, lat) => { const q = projection([lon, lat]); return q || [0, 0]; };
    for (let lat = 90; lat > -90; lat -= step) for (let lon = -180; lon < 180; lon += step) {
      const a = [lon, lat], b = [lon + step, lat], c = [lon + step, lat - step], d = [lon, lat - step];
      for (const v of [a, b, c, a, c, d]) { pos.push(...P(v[0], v[1])); uv.push((v[0] + 180) / 360, (90 - v[1]) / 180); }
    }
    const mk = (arr) => { const bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW); return bf; };
    return { pos: mk(pos), uv: mk(uv), n: pos.length / 2 };
  }
  function drawRaster(name, t, opts) {
    const tx = textures[name];
    if (!tx?.ready) return;
    if (!mesh) mesh = makeMesh();
    gl.disableVertexAttribArray(aP);
    gl.useProgram(rprog);
    gl.uniform2f(RU.t, t.x, t.y); gl.uniform1f(RU.k, t.k); gl.uniform2f(RU.size, S.width, S.height);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tx.tx); gl.uniform1i(RU.tex, 0);
    gl.uniform1f(RU.mode, opts.mode); gl.uniform1f(RU.drop, opts.drop || 0); gl.uniform1f(RU.str, opts.str ?? 1);
    const c = rgba(opts.land || "#000"); gl.uniform4f(RU.land, c[0], c[1], c[2], 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.pos); gl.enableVertexAttribArray(rP); gl.vertexAttribPointer(rP, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uv); gl.enableVertexAttribArray(rUV); gl.vertexAttribPointer(rUV, 2, gl.FLOAT, false, 0, 0);
    if (opts.mode < 0.5) gl.blendFunc(gl.DST_COLOR, gl.ZERO); // multiply
    gl.drawArrays(gl.TRIANGLES, 0, mesh.n);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disableVertexAttribArray(rP); gl.disableVertexAttribArray(rUV);
    gl.useProgram(prog);
    gl.uniform2f(U.t, t.x, t.y); gl.uniform1f(U.k, t.k); gl.uniform2f(U.size, S.width, S.height); gl.uniform1f(U.dpr, S.dpr);
  }
  return {
    loadTexture,
    resize(w, h, dpr) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); geo = new WeakMap(); freeLayer(cur); freeLayer(prev); freeLayer(landLayer); cur = prev = landLayer = null; statics = null; mesh = null; },
    setItems,
    warm(features) { // triangulate shapes ahead of time, a few milliseconds at a time while the browser is idle
      const todo = features.filter((f) => f && !geo.has(f));
      const step = (dl) => {
        const end = performance.now() + (dl?.timeRemaining ? Math.min(12, dl.timeRemaining()) : 8);
        while (todo.length && performance.now() < end) build(todo.pop());
        if (todo.length) (window.requestIdleCallback || setTimeout)(step);
      };
      if (todo.length) (window.requestIdleCallback || setTimeout)(step);
    },
    fading: () => prev && performance.now() - fadeT0 < FADE,
    frame(t, fillOf) {
      if (!statics) statics = makeStatics();
      gl.viewport(0, 0, cv.width, cv.height);
      const o = rgba(theme.ocean); gl.clearColor(o[0], o[1], o[2], 1); gl.clearStencil(0); gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform2f(U.t, t.x, t.y); gl.uniform1f(U.k, t.k); gl.uniform2f(U.size, S.width, S.height); gl.uniform1f(U.dpr, S.dpr);
      bindPos(statics.grat.b); color(theme.grat); gl.drawArrays(gl.LINES, 0, statics.grat.n);
      const drop = seaDrop(S.year);
      if (drop > 0.5) drawRaster("shelf", t, { mode: 1, drop, land: theme.unknown }); // land the lower sea left dry
      const e = prev ? Math.min(1, (performance.now() - fadeT0) / FADE) : 1;
      if (prev && e < 1) drawLayer(prev, fillOf, 1);
      if (cur) drawLayer(cur, fillOf, prev && e < 1 ? e * e * (3 - 2 * e) : 1);
      const fade = Math.max(0, Math.min(1, (14 - t.k) / 8)); // the shading grid is ~18 km a cell: fade it out when zoomed in close
      if (S.relief === true && fade > 0) drawRaster("relief", t, { mode: 0, str: (theme.dark ? 0.55 : 0.8) * fade }); // hills and mountains
      if (e >= 1 && prev) { freeLayer(prev); prev = null; }
      bindPos(statics.sphereLine.b); color(theme.rule); gl.drawArrays(gl.LINES, 0, statics.sphereLine.n);
    },
  };
})();
if (GL) document.documentElement.classList.add("webgl");

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
    const keep = S.zoom && S.width ? projection.invert(S.t.invert([S.width / 2, S.height / 2])) : null; // geographic centre to hold across the refit
    S.width = r.width; S.height = r.height; S.dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = r.width * S.dpr; canvas.height = r.height * S.dpr;
    if (GL) GL.resize(r.width, r.height, S.dpr);
    if (S.chartKind && !S.war && !S.journey) { renderListChart(S.chartKind); updateChartCursor(); } // its lanes are packed to the width
    pick.width = r.width; pick.height = r.height;
    const small = r.width < 600, pad = small ? 8 : 28;
    // fit the lived-in world (84°N to 57°S), not the whole sphere: Antarctica and the empty polar seas wasted a third of the canvas
    const edge = []; for (let lon = -180; lon <= 180; lon += 5) edge.push([lon, 84], [lon, -57]);
    for (let lat = -57; lat <= 84; lat += 3) edge.push([-180, lat], [180, lat]);
    if (phone()) projection.fitExtent([[4, 60], [r.width - 4, Math.max(200, r.height * 0.3)]], { type: "MultiPoint", coordinates: edge }); // above the sheet
    else projection.fitExtent([[small ? 4 : 10, small ? 4 : 8], [r.width - (small ? 40 : 56), r.height - (small ? 4 : 30)]], { type: "MultiPoint", coordinates: edge });
    sphere2d = new Path2D(geoPath({ type: "Sphere" }));
    grat2d = new Path2D(geoPath(d3.geoGraticule10()));
    pathCache = new WeakMap();
    if (S.ghost) S.ghost.paths = S.ghost.feats.map((f) => new Path2D(geoPath(f) || ""));
    if (keep && isFinite(keep[0]) && isFinite(keep[1]) && Math.abs(keep[1]) <= 85 && Math.abs(keep[0]) <= 180 && S.t.k > 1.01) { // only when zoomed in on a real place
      const [x, y] = projection(keep), k = S.t.k;
      d3.select(canvas).interrupt().call(S.zoom.transform, d3.zoomIdentity.translate(S.width / 2 - k * x, S.height / 2 - k * y).scale(k));
      if (story()) flyTo(boxBounds(S.cine.chapters[S.chap].bbox), 24, 600, hudInset()); // the map area changed: re-frame the chapter
      else if (S.war && S.cine?.shots?.length) { S.shotIdx = -1; camFor(S.wt, null, true); }
    }
    draw();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  S.zoom = d3.zoom().scaleExtent([1, 24]).translateExtent([[-200, -200], [10000, 10000]])
    .on("start", (ev) => { S.zooming = true; if (ev.sourceEvent?.type === "mousedown") canvas.classList.add("dragging"); })
    .on("zoom", (ev) => { S.t = ev.transform; if (!S.cinePlay) scheduleDraw(); }) // playback redraws every frame itself
    .on("end", () => { S.zooming = false; canvas.classList.remove("dragging"); draw(); });
  d3.select(canvas).call(S.zoom).on("dblclick.zoom", null);

  const local = (ev) => { const r = canvas.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; };
  canvas.addEventListener("mousemove", (ev) => {
    const [x, y] = local(ev);
    const lp = pinAt(x, y);
    if (listOnMap()) {
      const tip = $("#tooltip");
      if (lp) { tip.innerHTML = `<b>${esc(lp.name)}</b><div class="m">${esc(lp.when)}${lp.place ? " · " + esc(lp.place) : ""}</div>`; tip.hidden = false; tip.style.left = Math.min(x, S.width - 300) + "px"; tip.style.top = y + "px"; }
      else tip.hidden = true;
      canvas.classList.toggle("pointing", !!lp);
      if ((lp?.id || null) !== (S.listHot || null)) { S.listHot = lp?.id || null; draw(); }
      return;
    }
    const sh = siteAt(x, y);
    if (sh) {
      const tip = $("#tooltip");
      tip.innerHTML = `<b>${esc(sh.name)}</b><div class="m">${esc(sh.dateLabel || "")} · ${esc((EVIDENCE[sh.evidence] || EVIDENCE.archaeology)[0])}</div>`;
      tip.hidden = false; tip.style.left = Math.min(x, S.width - 300) + "px"; tip.style.top = y + "px";
      canvas.classList.toggle("pointing", !S.war && !S.journey); if (S.hover !== -1) { S.hover = -1; draw(); }
      return;
    }
    let i = pickAt(x, y); const own = claimedPick(x, y); if (own >= 0) i = own; // a claim drawn as the viewer's country hovers as it
    const it = S.items[i];
    const hv = it && it.kind === "state" ? i : -1;
    if (hv !== S.hover) { S.hover = hv; draw(); }
    const tip = $("#tooltip");
    if (!it) { tip.hidden = true; canvas.classList.remove("pointing"); return; }
    canvas.classList.toggle("pointing", !S.war && !S.journey);
    if (it.kind === "state") {
      const p = it.p, grp = p.k !== p.n && displayName(p.k) !== clean(p.n) ? `<div>Part of <strong>${esc(displayName(p.k))}</strong></div>` : "";
      tip.innerHTML = p.recon
        ? `<b>${esc(p.n)}</b><div class="m">Approximate borders, c. ${shortYear(p.f)}–${shortYear(p.t)}</div>`
        : `<b>${esc(clean(p.n))}</b>${grp}<div class="m">${fmtArea(p.a)} · borders ${shortYear(p.f)}–${shortYear(p.t)}</div>`;
      const da = S.disputed && !S.war ? disputedAt(projection.invert([S.t.invertX(x), S.t.invertY(y)])) : null;
      if (da && !(VIEWER && da.admin === VIEWER)) tip.innerHTML += disputedNote(da);
    } else if (it.kind === "culture") {
      tip.innerHTML = it.corrected
        ? `<b>${esc(it.p.n)}</b><div class="m">No unified state in ${plainYear(S.year)}</div>`
        : `<b>${esc(it.p.n)}</b><div class="m">${isCulture(it.p) ? "People or culture without a state" : "Smaller state or chiefdom"} · approximate, c. ${plainYear(baseYearFor(S.year))}</div><div class="m">Click to see who ruled this spot</div>`;
    } else {
      tip.innerHTML = `<b>Unrecorded</b><div class="m">No state is drawn here in ${plainYear(S.year)}. Click to see who ruled this spot.</div>`;
    }
    tip.hidden = false;
    tip.style.left = Math.min(x, S.width - 300) + "px"; tip.style.top = y + "px";
  });
  canvas.addEventListener("mouseleave", () => { S.hover = -1; $("#tooltip").hidden = true; draw(); });
  canvas.addEventListener("click", (ev) => {
    if (S.war || S.journey) return; // a war replay or empire journey keeps the screen: the map only shows hover details
    const [x, y] = local(ev);
    if (listOnMap()) { const lp = pinAt(x, y); if (lp) { S.listHot = null; return lp.open(); } return; } // the map shows the list: only its pins are clickable
    const sh = siteAt(x, y);
    if (sh) return openSite(sh.id);
    S.clickLL = projection.invert([S.t.invertX(x), S.t.invertY(y)]); // for "who ruled this spot through history"
    if (S.picking) { S.picking = false; canvas.classList.remove("picking"); return openPlace(S.clickLL, { name: "Your place", save: true }); }
    const own = claimedPick(x, y), it = S.items[own >= 0 ? own : pickAt(x, y)]; // clicks on a claim drawn as the viewer's country select that country
    if (it && it.kind !== "state") return openPlace(S.clickLL); // a gap between drawn states: who ruled this spot
    if (!it) return S.view === "realm" ? select(null) : null;
    select(it.p.recon ? it.p.n : it.key, { ll: S.clickLL }); // the country's page opens straight away
  });
}

function hidePop() { if (!S.pop && $("#pop").hidden) return; S.pop = null; $("#pop").hidden = true; draw(); }
function fillOf(it) { // the fill for an item; "HATCH" = peoples pattern
  if (it.kind === "land") return theme.unknown;
  if (it.kind === "culture") return S.war ? theme.unknown : "HATCH";
  if (S.journey && inJourney(it)) return theme.highlight;
  if (it.p.recon && it.p.n === S.sel) return theme.highlight;
  if (S.war) { const sd = warSideOf(it); return sd >= 0 ? sideTint(sd) : theme.unknown; } // only the warring sides keep (soft) colour
  return colorOf(it.key);
}
function scheduleDraw() { // at most one redraw per screen frame, however many zoom/pan events arrive
  if (!S.drawRaf) S.drawRaf = requestAnimationFrame(() => { S.drawRaf = 0; draw(); });
}
function draw() {
  if (S.drawRaf) { cancelAnimationFrame(S.drawRaf); S.drawRaf = 0; } // a direct draw makes a pending one redundant
  if (!S.items.length || !sphere2d) return;
  if (GL) return drawGL();
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
    const fl = fillOf(it); ctx.fillStyle = fl === "HATCH" ? theme.hatch : fl;
    if (it.p.recon || it.p.crop || it.p.cut) { ctx.save(); clipFor(ctx, it); ctx.fill(pathOf(it.f)); ctx.restore(); }
    else ctx.fill(pathOf(it.f));
  }
  ctx.lineJoin = "round";
  ctx.strokeStyle = theme.border; ctx.lineWidth = 0.7 / t.k;
  for (const it of S.items) {
    if (it.kind !== "state") continue;
    if ((it.p.crop || it.p.cut) && !it.p.recon) { ctx.save(); clipFor(ctx, it); ctx.stroke(pathOf(it.f)); ctx.restore(); continue; }
    if (!it.p.recon) { ctx.stroke(pathOf(it.f)); continue; }
    ctx.save(); ctx.clip(S.landClip); ctx.setLineDash([3 / t.k, 2.5 / t.k]); ctx.strokeStyle = theme.ink3; ctx.stroke(pathOf(it.f)); ctx.restore();
    ctx.strokeStyle = theme.border;
  }
  drawWater();
  drawIce();
  drawDisputed();
  drawOccupations();

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
  drawClaims();
  ctx.restore();
  if (S.zooming || S.cinePlay || S.playing > 0) { clearTimeout(S.pickTimer); S.pickTimer = setTimeout(drawPick, 100); }
  else drawPick(); // label placement reads the pick buffer, so keep it current when at rest
  if (S.labels) drawLabels();
  drawWaterLabels();
  drawCinema();
  drawAncientSites();
  drawSites();
  drawListPins();
  drawMomentPin();
}

// ---------------------------------------------------------------- disputed areas (data/disputed.json, tools/disputed.py)
// What locals expect to see: a viewer in a country that claims a disputed area sees it as part of that country (its colour,
// the line of control dotted, outer edges as ordinary borders), e.g. Azad Kashmir and Aksai Chin in India, the Falklands in
// Argentina, Nagorno-Karabakh in Azerbaijan. Everyone else sees a dashed outline under the neutral place name.
// The viewer's country comes from the browser's time zone; ?pov=IND (or ?pov=none) overrides it.
const TZ_COUNTRY = {
  "Asia/Kolkata": "IND", "Asia/Calcutta": "IND", "Asia/Karachi": "PAK", "Asia/Shanghai": "CHN", "Asia/Chongqing": "CHN", "Asia/Harbin": "CHN", "Asia/Urumqi": "CHN",
  "Asia/Taipei": "TWN", "Asia/Tokyo": "JPN", "Asia/Seoul": "KOR", "Europe/Kyiv": "UKR", "Europe/Kiev": "UKR", "Europe/London": "GBR", "Europe/Madrid": "ESP",
  "Atlantic/Canary": "ESP", "Africa/Casablanca": "MAR", "Asia/Damascus": "SYR", "Asia/Beirut": "LBN", "Asia/Gaza": "PSE", "Asia/Hebron": "PSE",
  "Asia/Tbilisi": "GEO", "Asia/Baku": "AZE", "Europe/Chisinau": "MDA", "America/Caracas": "VEN", "Asia/Kathmandu": "NPL", "Asia/Katmandu": "NPL",
  "Asia/Ho_Chi_Minh": "VNM", "Asia/Saigon": "VNM", "Asia/Manila": "PHL", "Asia/Kuala_Lumpur": "MYS", "Asia/Kuching": "MYS", "Asia/Nicosia": "CYP",
  "Europe/Nicosia": "CYP", "Europe/Belgrade": "SRB", "Africa/Mogadishu": "SOM", "Africa/Juba": "SSD", "Africa/Khartoum": "SDN", "Europe/Moscow": "RUS",
  "Asia/Jerusalem": "ISR", "America/Paramaribo": "SUR", "Europe/Lisbon": "PRT", "America/Montevideo": "URY", "America/Santiago": "CHL",
  "Asia/Riyadh": "SAU", "Asia/Dubai": "ARE", "America/Havana": "CUB", "America/Port-au-Prince": "HTI", "Indian/Mauritius": "MUS",
  "Indian/Antananarivo": "MDG", "Indian/Comoro": "COM", "Indian/Mahe": "SYC", "Africa/Djibouti": "DJI", "Africa/Malabo": "GNQ",
  "America/Tegucigalpa": "HND", "America/Guatemala": "GTM", "Asia/Brunei": "BRN", "America/Bogota": "COL", "America/Managua": "NIC",
  "America/Jamaica": "JAM", "Europe/Dublin": "IRL", "Europe/Copenhagen": "DNK", "Atlantic/Reykjavik": "ISL", "America/Sao_Paulo": "BRA",
  "America/Argentina/Buenos_Aires": "ARG", "America/Argentina/Cordoba": "ARG", "America/Argentina/Mendoza": "ARG", "America/Argentina/Salta": "ARG",
  "America/Argentina/Ushuaia": "ARG", "America/Buenos_Aires": "ARG", "Asia/Yerevan": "ARM", "Europe/Athens": "GRC", "Europe/Istanbul": "TUR",
};
const COUNTRY = { // display name and capital (to find the country's colour on the map)
  IND: ["India", [77.2, 28.6]], PAK: ["Pakistan", [73.05, 33.7]], CHN: ["China", [116.4, 39.9]], TWN: ["Taiwan", [121.5, 25.03]], JPN: ["Japan", [139.7, 35.7]],
  KOR: ["South Korea", [127, 37.55]], UKR: ["Ukraine", [30.5, 50.45]], ARG: ["Argentina", [-58.4, -34.6]], GBR: ["the United Kingdom", [-0.13, 51.5]],
  ESP: ["Spain", [-3.7, 40.4]], MAR: ["Morocco", [-6.84, 34.0]], SYR: ["Syria", [36.3, 33.5]], LBN: ["Lebanon", [35.5, 33.9]], PSE: ["Palestine", [35.2, 31.9]],
  GEO: ["Georgia", [44.8, 41.7]], AZE: ["Azerbaijan", [49.9, 40.4]], MDA: ["Moldova", [28.85, 47.0]], VEN: ["Venezuela", [-66.9, 10.5]], NPL: ["Nepal", [85.3, 27.7]],
  VNM: ["Vietnam", [105.85, 21.0]], PHL: ["the Philippines", [121, 14.6]], MYS: ["Malaysia", [101.7, 3.15]], CYP: ["Cyprus", [33.4, 35.17]], SRB: ["Serbia", [20.46, 44.8]],
  SOM: ["Somalia", [45.3, 2.04]], SSD: ["South Sudan", [31.6, 4.85]], SDN: ["Sudan", [32.5, 15.6]], RUS: ["Russia", [37.6, 55.75]], ISR: ["Israel", [35.2, 31.78]],
  USA: ["the United States", [-77, 38.9]], FRA: ["France", [2.35, 48.85]], MUS: ["Mauritius", [57.5, -20.16]], MDG: ["Madagascar", [47.5, -18.9]],
  SUR: ["Suriname", [-55.2, 5.85]], PRT: ["Portugal", [-9.14, 38.7]], URY: ["Uruguay", [-56.2, -34.9]], CHL: ["Chile", [-70.65, -33.45]], SAU: ["Saudi Arabia", [46.7, 24.7]],
  ARE: ["the UAE", [54.37, 24.45]], CUB: ["Cuba", [-82.4, 23.1]], HTI: ["Haiti", [-72.3, 18.55]], CAN: ["Canada", [-75.7, 45.4]], IRL: ["Ireland", [-6.26, 53.35]],
  DNK: ["Denmark", [12.57, 55.68]], ISL: ["Iceland", [-21.9, 64.15]], COM: ["Comoros", [43.25, -11.7]], SYC: ["Seychelles", [55.45, -4.62]], DJI: ["Djibouti", [43.15, 11.6]],
  GNQ: ["Equatorial Guinea", [8.78, 3.75]], HND: ["Honduras", [-87.2, 14.1]], GTM: ["Guatemala", [-90.5, 14.6]], BRA: ["Brazil", [-47.9, -15.8]], COL: ["Colombia", [-74.07, 4.71]],
  NIC: ["Nicaragua", [-86.25, 12.13]], JAM: ["Jamaica", [-76.8, 18.0]], BRN: ["Brunei", [114.94, 4.9]], EGY: ["Egypt", [31.24, 30.04]], KEN: ["Kenya", [36.82, -1.29]],
  GUY: ["Guyana", [-58.16, 6.8]], BTN: ["Bhutan", [89.64, 27.47]], IRN: ["Iran", [51.39, 35.69]], BLZ: ["Belize", [-88.77, 17.25]], GAB: ["Gabon", [9.45, 0.39]], ERI: ["Eritrea", [38.93, 15.33]],
  SAH: ["the Sahrawi Republic", [-13.2, 27.15]],
  ARM: ["Armenia", [44.51, 40.18]], GRC: ["Greece", [23.73, 37.98]], TUR: ["Turkey", [32.85, 39.93]],
};
const cname = (iso) => COUNTRY[iso]?.[0] || iso;
const VIEWER = (() => {
  const q = new URLSearchParams(location.search).get("pov");
  let c = null;
  if (q) c = /^none$/i.test(q) ? null : q.toUpperCase();
  else try { c = TZ_COUNTRY[Intl.DateTimeFormat().resolvedOptions().timeZone] || null; } catch { c = null; }
  return c;
})();
const disputedNow = (y = S.year) => (S.disputed || []).filter((a) => a.since <= y && (a.until == null || y <= a.until));
function viewerColor() { // the colour of the realm drawn at the viewer's capital this year
  const cap = COUNTRY[VIEWER]?.[1];
  if (!cap) return theme.highlight;
  const at = `${S.year}|${S.sel}|${S.hover}`;
  if (S.viewerColorAt?.at === at) return S.viewerColorAt.c;
  const it = S.items.find((x) => x.kind === "state" && d3.geoContains(x.f, cap)); // as drawn now (red while selected)
  const fl = it ? fillOf(it) : null, c = fl && fl !== "HATCH" ? fl : theme.highlight;
  S.viewerColorAt = { at, c };
  return c;
}
function drawDisputed() { // inside the map transform
  if (S.war) return;
  const list = disputedNow();
  if (!list.length) return;
  const k = S.t.k;
  ctx.save(); ctx.lineJoin = "round";
  for (const a of list) {
    if (VIEWER && a.admin === VIEWER) continue; // the viewer's country holds it: drawn as an ordinary part of it
    if (VIEWER && a.claim.includes(VIEWER)) continue; // drawn by drawClaims, after the selection outlines
    ctx.setLineDash([4 / k, 3 / k]); ctx.lineCap = "butt"; ctx.strokeStyle = theme.ink3; ctx.lineWidth = 0.9 / k; ctx.stroke(pathOf(a.f));
  }
  ctx.restore();
}
function claimedPick(x, y) { // index of the viewer's own realm when (x, y) is in an area drawn as part of it, else -1
  if (!VIEWER || S.war || S.journey || !S.disputed) return -1;
  const ll = projection.invert([S.t.invertX(x), S.t.invertY(y)]), a = ll && disputedAt(ll);
  if (!a || a.admin === VIEWER || !a.claim.includes(VIEWER)) return -1;
  return viewerIdx();
}
function drawClaims() { // inside the map transform, after selection/hover outlines: areas the viewer's country claims, as part of it
  if (!VIEWER || S.war || S.journey) return;
  const list = disputedNow().filter((a) => a.admin !== VIEWER && a.claim.includes(VIEWER));
  if (!list.length) return;
  const idx = viewerIdx();
  if (idx < 0) return;
  const own = S.items[idx], fl = fillOf(own), vc = fl === "HATCH" ? theme.highlight : fl, k = S.t.k;
  const ownPath = new Path2D();
  for (const it of S.items) if (it.kind === "state" && it.key === own.key) ownPath.addPath(pathOf(it.f));
  const outside = new Path2D(); outside.rect(-1e5, -1e5, 2e5, 2e5); outside.addPath(ownPath);
  for (const a of list) outside.addPath(pathOf(a.f)); // edges between two claimed areas are inside the country too
  const lit = S.sel === own.key ? 1.4 : S.hover >= 0 && S.items[S.hover]?.key === own.key ? 2 : 0; // outline the whole claimed shape when selected/hovered
  ctx.save(); ctx.lineJoin = "round";
  ctx.fillStyle = vc;
  for (const a of list) { const p = pathOf(a.f); ctx.fill(p); ctx.strokeStyle = vc; ctx.lineWidth = 1.2 / k; ctx.stroke(p); } // fill, and cover borders between claims
  for (const a of list) {
    const p = pathOf(a.f);
    ctx.save(); ctx.clip(ownPath); ctx.strokeStyle = vc; ctx.lineWidth = 4.5 / k; ctx.stroke(p); ctx.restore(); // hide the outline along the shared edge
    ctx.save(); ctx.clip(outside, "evenodd"); // outer edges: an ordinary border (or the selection outline)
    ctx.strokeStyle = lit ? theme.ink : theme.border; ctx.lineWidth = 2 * (lit || 0.7) / k; ctx.stroke(p); ctx.restore(); // half of it shows (clipped)
    ctx.save(); ctx.clip(ownPath); ctx.setLineDash([0.01 / k, 4.5 / k]); ctx.lineCap = "round"; ctx.strokeStyle = theme.ink; ctx.lineWidth = 2.6 / k; ctx.stroke(p); ctx.restore(); // the line of control: round dots
  }
  ctx.restore();
}
function viewerIdx() {
  const cap = COUNTRY[VIEWER]?.[1];
  return cap ? S.items.findIndex((v) => v.kind === "state" && d3.geoContains(v.f, cap)) : -1;
}
function disputedAt(ll) { return ll ? disputedNow().find((a) => d3.geoContains(a.f, ll)) : null; }
function disputedNote(a) {
  const mine = VIEWER && a.claim.includes(VIEWER) && a.admin !== VIEWER;
  const name = (VIEWER && a.names?.[VIEWER]) || a.name;
  const held = a.admin ? `administered by ${cname(a.admin)}` : "";
  const claims = a.claim.length ? `claimed by ${a.claim.map(cname).join(" and ")}` : "";
  return `<div class="m disp"><b>${esc(name)}</b> · disputed${held || claims ? `: ${[held, claims].filter(Boolean).join("; ")}` : ""}${mine ? `. Shown as part of ${cname(VIEWER)}, as on maps used in ${cname(VIEWER)}.` : ""}</div>`;
}

// ---------------------------------------------------------------- the end of the ice age (data/iceage.json)
// Sea level relative to today (a published curve, content/iceage) decides which shallow seabed was dry land; ice-sheet
// outlines are dated slices drawn on the land they covered.
// d3 reads a ring's winding to tell inside from outside: outer rings must enclose the small side, holes the large one
const wind = (rings) => rings.map((r, i) => { const big = d3.geoArea({ type: "Polygon", coordinates: [r] }) > 2 * Math.PI; return (i === 0) === big ? r.slice().reverse() : r; });
function prepareIceage(d) {
  const sl = (d.sealevel || []).slice().sort((a, b) => a.year - b.year);
  const ice = (d.ice || []).filter((x) => !/^Antarctic/.test(x.name)) // its outline runs through the pole along the date line; mostly off the map anyway
    .map((x) => ({ ...x, f: { type: "Feature", geometry: { type: "Polygon", coordinates: wind(x.coords) }, properties: {} } }));
  const years = [...new Set(ice.map((x) => x.year))].sort((a, b) => a - b);
  return { sl, ice, years };
}
function seaDrop(y) { // metres below today's level, interpolated; 0 once the curve reaches today's level
  const sl = S.iceage?.sl;
  if (!sl?.length || y > sl[sl.length - 1].year) return 0;
  if (y <= sl[0].year) return Math.max(0, -sl[0].m);
  for (let i = 1; i < sl.length; i++) if (y <= sl[i].year) {
    const a = sl[i - 1], b = sl[i], f = (y - a.year) / (b.year - a.year);
    return Math.max(0, -(a.m + f * (b.m - a.m)));
  }
  return 0;
}
function dryThen([lon, lat], y = S.year) { // was this spot of today's sea dry land in year y?
  const sp = S.shelfPix, drop = seaDrop(y);
  if (!sp || drop < 1) return false;
  const x = Math.min(sp.w - 1, Math.floor((lon + 180) / 360 * sp.w)), r = Math.min(sp.h - 1, Math.floor((90 - lat) / 180 * sp.h));
  const d = sp.d[(r * sp.w + x) * 4];
  return d > 0 && d <= drop;
}
function iceNow(y) { // the dated slice nearest to this year (none once the ice sheets are gone)
  const ys = S.iceage?.years;
  if (!ys?.length || y > ys[ys.length - 1] + 500) return [];
  let best = ys[0];
  for (const v of ys) if (Math.abs(v - y) < Math.abs(best - y)) best = v;
  return S.iceage.ice.filter((x) => x.year === best);
}
function iceRegions(list) { // "Laurentide ice sheet (joined to …)" → plain region names, biggest ice first
  const has = (rx) => list.some((x) => rx.test(x.name));
  return [has(/Laurentide|Innuitian|Cordilleran ice sheet/) && "much of Canada", has(/Scandinavian/) && "Scandinavia", has(/British-Irish/) && "the Scottish Highlands",
    has(/Svalbard|Franz Josef|Novaya/) && "the Arctic islands", has(/Greenland/) && "Greenland"].filter(Boolean).join(", ").replace(/, ([^,]*)$/, " and $1");
}
function drawIce() { // inside the map transform
  const list = iceNow(S.year);
  if (!list.length) return;
  ctx.save();
  ctx.fillStyle = theme.dark ? "rgba(220,232,240,.22)" : "rgba(246,250,253,.92)";
  ctx.strokeStyle = theme.water; ctx.lineWidth = 1 / S.t.k; ctx.setLineDash([4 / S.t.k, 3 / S.t.k]);
  for (const x of list) { const p = pathOf(x.f); ctx.fill(p); ctx.stroke(p); }
  ctx.restore();
}

// ---------------------------------------------------------------- rivers, lakes and seas (Natural Earth, data/physical.json)
// Rivers and lakes sit on top of the territory fills (so the Nile and the Indus stay visible under any empire); bigger
// rivers appear first and smaller ones as you zoom in. Sea and ocean names are drawn in the water, river names along them.
function preparePhysical(ph) {
  const feat = (type, coordinates, props) => ({ type: "Feature", geometry: { type, coordinates }, properties: props });
  S.phys = {
    rivers: ph.rivers.map((r) => feat("MultiLineString", r.c, { n: r.n, r: r.r })),
    lakes: ph.lakes.map((l) => feat("MultiPolygon", l.c, { n: l.n, r: l.r })),
    seas: ph.seas,
  };
  // where to write each big river's name: the middle of its longest stretch
  const byName = new Map();
  for (const f of S.phys.rivers) {
    const { n, r } = f.properties;
    if (!n || r > 3) continue;
    for (const line of f.geometry.coordinates) {
      const len = line.length, cur = byName.get(n);
      if (!cur || len > cur.len) byName.set(n, { n, r, len, line });
    }
  }
  S.phys.riverNames = [...byName.values()].filter((x) => x.len >= 8).sort((a, b) => a.r - b.r || b.len - a.len);
}
const riverMaxRank = (k) => (k < 1.6 ? 3 : k < 3 ? 4 : k < 5 ? 5 : 6);
function drawWater() { // call inside the map transform
  if (!S.phys) return;
  const k = S.t.k, maxR = riverMaxRank(k);
  ctx.save();
  ctx.strokeStyle = theme.water; ctx.lineCap = "round";
  for (const f of S.phys.rivers) {
    const r = f.properties.r;
    if (r > maxR) continue;
    ctx.lineWidth = (r <= 2 ? 1.3 : r <= 4 ? 0.95 : 0.7) / k;
    ctx.stroke(pathOf(f));
  }
  ctx.fillStyle = theme.ocean; ctx.lineWidth = 0.8 / k;
  for (const f of S.phys.lakes) {
    if (f.properties.r > maxR + 1 && k < 4) continue;
    const p = pathOf(f); ctx.fill(p); ctx.stroke(p);
  }
  ctx.restore();
}
function drawWaterLabels() { // screen space, after the realm names, avoiding them
  if (!S.phys || !S.labels || S.journey) return;
  const k = S.t.k, placed = S.labelBoxes ? S.labelBoxes : (S.labelBoxes = mapObstacles());
  const free = (b) => b[0] > 2 && b[1] > 2 && b[2] < S.width - 2 && b[3] < S.height - 2 && !placed.some((q) => b[0] < q[2] && b[2] > q[0] && b[1] < q[3] && b[3] > q[1]);
  ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = theme.waterLabel;
  const seaMax = k < 1.4 ? 0 : k < 2.6 ? 1 : k < 5 ? 2 : k < 8 ? 3 : 4; // whole world: oceans only
  for (const sea of S.phys.seas) {
    if (sea.r > (S.war ? Math.min(seaMax, 1) : seaMax) || (S.war && sea.k === "ocean" && k > 3)) continue; // wars: only the big seas
    if (S.year < -2000 && (dryThen(sea.l) || iceNow(S.year).some((x) => d3.geoContains(x.f, sea.l)))) continue; // dry land or under ice then: no sea name
    const [x0, y0] = projection(sea.l), x = S.t.applyX(x0), y = S.t.applyY(y0);
    const ocean = sea.k === "ocean", size = ocean ? 12 : sea.r <= 1 ? 11 : 10;
    ctx.font = `italic ${ocean ? 500 : 400} ${size}px Inter, sans-serif`; ctx.letterSpacing = ocean ? "2px" : "0.6px";
    const text = ocean ? sea.n.toUpperCase() : sea.n, words = text.split(" ");
    const lines = words.length > 2 && !ocean ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [text];
    const w = Math.max(...lines.map((l) => ctx.measureText(l).width)), h = size * 1.2 * lines.length;
    const box = [x - w / 2 - 3, y - h / 2 - 2, x + w / 2 + 3, y + h / 2 + 2];
    if (!free(box)) continue;
    placed.push(box);
    lines.forEach((l, i) => ctx.fillText(l, x, y + (i - (lines.length - 1) / 2) * size * 1.2));
  }
  if (k >= 2.2 && !S.war) { // river names along the river
    ctx.font = "italic 400 10.5px Inter, sans-serif"; ctx.letterSpacing = "0.4px";
    const maxR = k < 3 ? 1 : k < 5 ? 2 : 3;
    for (const rv of S.phys.riverNames) {
      if (rv.r > maxR) continue;
      const mid = Math.floor(rv.line.length / 2), a = rv.line[Math.max(0, mid - 2)], b = rv.line[Math.min(rv.line.length - 1, mid + 2)];
      const [ax, ay] = projection(a), [bx, by] = projection(b);
      const x1 = S.t.applyX(ax), y1 = S.t.applyY(ay), x2 = S.t.applyX(bx), y2 = S.t.applyY(by);
      const x = (x1 + x2) / 2, y = (y1 + y2) / 2, w = ctx.measureText(rv.n).width;
      let ang = Math.atan2(y2 - y1, x2 - x1); if (ang > Math.PI / 2) ang -= Math.PI; if (ang < -Math.PI / 2) ang += Math.PI;
      const hw = (Math.abs(Math.cos(ang)) * w + Math.abs(Math.sin(ang)) * 11) / 2 + 2, hh = (Math.abs(Math.sin(ang)) * w + Math.abs(Math.cos(ang)) * 11) / 2 + 2;
      const box = [x - hw, y - hh, x + hw, y + hh];
      if (!free(box)) continue;
      placed.push(box);
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.lineWidth = 3; ctx.strokeStyle = theme.bg; ctx.globalAlpha = 0.85; ctx.strokeText(rv.n, 0, -6); ctx.globalAlpha = 1;
      ctx.fillText(rv.n, 0, -6); ctx.restore();
    }
  }
  ctx.letterSpacing = "0px";
  ctx.restore();
}
function drawGL() {
  const { t } = S;
  GL.setItems(S.items);
  GL.frame(t, fillOf);
  ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  ctx.clearRect(0, 0, S.width, S.height);
  ctx.save();
  ctx.translate(t.x, t.y); ctx.scale(t.k, t.k);
  ctx.lineJoin = "round";
  drawWater();
  drawIce();
  drawDisputed();
  for (const it of S.items) { // borders the GPU skips: reconstructions (dashed, coast-clipped) and crops
    if (it.kind !== "state" || !(it.p.recon || it.p.crop || it.p.cut)) continue;
    ctx.save(); clipFor(ctx, it);
    if (it.p.recon) { ctx.setLineDash([3 / t.k, 2.5 / t.k]); ctx.strokeStyle = theme.ink3; } else ctx.strokeStyle = theme.border;
    ctx.lineWidth = 0.7 / t.k; ctx.stroke(pathOf(it.f)); ctx.restore();
  }
  drawOccupations();
  const sel = S.sel;
  if (S.showGhost && S.ghost && sel === S.ghost.key && S.ghost.year !== S.year) {
    ctx.setLineDash([5 / t.k, 4 / t.k]); ctx.strokeStyle = theme.highlight; ctx.lineWidth = 1.6 / t.k;
    for (const p of S.ghost.paths) ctx.stroke(p);
    ctx.setLineDash([]);
  }
  drawRings();
  if (S.journey) { ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.4 / t.k; for (const it of S.items) if (inJourney(it)) strokeItem(ctx, it); }
  if (sel) { ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.4 / t.k; for (const it of S.items) if (it.kind === "state" && (matches(it, sel) || (it.p.recon && it.p.n === sel))) strokeItem(ctx, it); }
  if (S.hover >= 0) { ctx.strokeStyle = theme.ink; ctx.lineWidth = 2 / t.k; strokeItem(ctx, S.items[S.hover]); }
  drawClaims();
  ctx.restore();
  if (S.zooming || GL.fading() || S.cinePlay || S.playing > 0) { clearTimeout(S.pickTimer); S.pickTimer = setTimeout(drawPick, 120); } // the hit-test layer waits until the map is still
  else drawPick();
  if (S.labels) drawLabels();
  drawWaterLabels();
  drawCinema();
  drawAncientSites();
  drawSites();
  drawListPins();
  drawMomentPin();
  if (GL.fading()) { cancelAnimationFrame(S.fadeRaf); S.fadeRaf = requestAnimationFrame(draw); } // keep animating the cross-fade
}
// Screen boxes (map pixels) covered by the legend and map tools, so labels are not drawn underneath them.
function mapObstacles() {
  const c = canvas.getBoundingClientRect(), out = [];
  for (const el of [$("#legend"), $("#mapTools")]) {
    if (!el || el.hidden || !el.offsetParent) continue;
    const r = el.getBoundingClientRect();
    if (r.width && r.height) out.push([r.left - c.left - 4, r.top - c.top - 4, r.right - c.left + 4, r.bottom - c.top + 4]);
  }
  return out;
}
// The legend lists only what this year's map shows: peoples only when that layer has any, sites only while some are in use.
function updateLegend() {
  const lg = $("#legend");
  const show = { peoples: S.peoples && S.items.some((it) => it.kind === "culture"), site: !S.war && S.view !== "journey" && sitesNow().length > 0 };
  for (const sp of lg.querySelectorAll("[data-l]")) sp.hidden = show[sp.dataset.l] === false;
}
function drawLabels() {
  const { t } = S;
  const pxPerKm = (projection.scale() * t.k) / 6371;
  const placed = mapObstacles(); // keep names off the legend and the zoom buttons
  const rank = (it) => (it.key === S.sel ? 3 : S.featured.has(it.key) ? 2 : it.kind === "state" ? 1 : 0);
  // names placed last frame go first among equals, so names don't pop in and out as areas change slightly year to year
  const was = S.lastPlaced || new Set(), now = new Set();
  const cand = S.items.filter((it) => it.p.l && (it.kind === "state" || (it.kind === "culture" && (it.corrected || isCulture(it.p)))))
    .sort((a, b) => rank(b) - rank(a) || was.has(b.p.n) - was.has(a.p.n) || b.p.a - a.p.a);
  const anchors = (S.lblAnchor ||= new Map());
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const it of cand) {
    const r = Math.sqrt(it.p.a) * pxPerKm;
    const strong = it.kind === "state" && (S.war ? warSideOf(it) >= 0 : S.journey ? inJourney(it) : S.featured.has(it.key) || it.key === S.sel || it.p.recon);
    if (S.war && !strong) continue;
    if (r < (strong ? 26 : it.kind === "state" ? 34 : 60)) continue;
    // Keep a name where it was while the realm's centre moves only a little (each year's shape has a slightly different
    // centre, which made names slide around during playback).
    const id = it.p.n, an = anchors.get(id);
    let ll = it.p.l;
    if (an && d3.geoDistance(an.l, ll) * 6371 < 0.3 * Math.sqrt(it.p.a)) ll = an.l;
    const inBox = ([w, s, e, n]) => ll[0] >= w && ll[0] <= e && ll[1] >= s && ll[1] <= n;
    if ((it.p.cropBox && !inBox(it.p.cropBox)) || it.p.cutBoxes?.some(inBox)) continue; // the name's spot is clipped away
    const [x0, y0] = projection(ll);
    const x = t.applyX(x0), y = t.applyY(y0);
    if (x < -50 || y < -20 || x > S.width + 50 || y > S.height + 20) continue;
    const culture = it.kind !== "state";
    if (culture) { const top = S.items[pickAt(x, y)]; if (top && top.kind === "state") continue; }
    // Size follows the realm's size, but a name must fit inside it: names on a coloured realm are white, so any part
    // sticking out over grey land or sea disappears. Try one line, then two, shrinking the type until it fits.
    let text = it.p.recon ? it.p.n.replace(/\s*\(.*\)$/, "") : clean(it.p.n);
    if (!culture) text = text.toUpperCase();
    const maxW = r * (culture ? 2.2 : strong ? 1.25 : 1.6), minSize = S.war ? 8.5 : 9;
    let size = S.war ? Math.max(9, Math.min(r / 8, 12)) : Math.max(10, Math.min(r / 7.5, strong ? 16 : 12.5));
    if (an && Math.abs(an.size - size) < 1.5) size = an.size; // no small size changes from year to year
    const setFont = (sz) => {
      ctx.font = culture ? `italic 500 ${sz}px Inter, sans-serif` : `${strong && !S.war ? 800 : 600} ${sz}px Archivo, "Helvetica Neue", sans-serif`;
      ctx.letterSpacing = culture ? "0px" : `${(sz * (S.war ? 0.14 : 0.05)).toFixed(1)}px`;
    };
    const layout = () => { // the narrower of one line and the best two-line split, at the current font
      const one = ctx.measureText(text).width, words = text.split(" ");
      let best = { lines: [text], w: one };
      for (let k = 1; k < words.length; k++) {
        const a = words.slice(0, k).join(" "), b = words.slice(k).join(" ");
        const m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
        if (m < best.w && (one > maxW || m < one * 0.6)) best = { lines: [a, b], w: m };
      }
      return best;
    };
    setFont(size);
    let { lines, w } = layout();
    if (w > maxW) { size = Math.max(minSize, Math.floor(size * (maxW / w) * 2) / 2); setFont(size); ({ lines, w } = layout()); }
    if (w > maxW * 1.08) continue; // still doesn't fit: leave it unnamed at this zoom
    const h = size * 1.1 * lines.length;
    const box = [x - w / 2 - 4, y - h / 2 - 3, x + w / 2 + 4, y + h / 2 + 3];
    if (box[0] < 2 || box[1] < 2 || box[2] > S.width - 2 || box[3] > S.height - 2) continue; // never cut a name at the map's edge
    if (placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
    placed.push(box); now.add(id); anchors.set(id, { l: ll, size });
    if (it.key === S.sel || (it.p.recon && it.p.n === S.sel) || (S.journey && inJourney(it))) { // red chip, like the design's highlighted realm
      ctx.fillStyle = theme.highlight; ctx.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
      ctx.fillStyle = "#ffffff";
      lines.forEach((ln, k) => ctx.fillText(ln, x, y + (k - (lines.length - 1) / 2) * size * 1.1));
      continue;
    }
    if (S.war) { ctx.globalAlpha = 0.62; ctx.fillStyle = theme.ink; lines.forEach((ln, k) => ctx.fillText(ln, x, y + (k - (lines.length - 1) / 2) * size * 1.1)); ctx.globalAlpha = 1; continue; } // quiet names under the action
    ctx.lineWidth = strong ? 2.5 : 3; ctx.lineJoin = "round";
    ctx.strokeStyle = strong ? colorOf(it.key) : theme.bg; // a name on a coloured realm keeps a rim of that colour, so it stays readable at the edges
    ctx.fillStyle = strong ? inkOn(colorOf(it.key)) : theme.labelSoft;
    lines.forEach((ln, k) => {
      const ly = y + (k - (lines.length - 1) / 2) * size * 1.1;
      ctx.strokeText(ln, x, ly);
      ctx.fillText(ln, x, ly);
    });
  }
  ctx.letterSpacing = "0px";
  S.labelBoxes = placed; S.lastPlaced = now;
}

function drawPick() {
  if (!S.items.length) return;
  const { t } = S;
  if (S.pickFor && S.pickFor.items === S.items && S.pickFor.k === t.k && S.pickFor.x === t.x && S.pickFor.y === t.y && S.pickFor.w === pick.width) return; // unchanged
  S.pickFor = { items: S.items, k: t.k, x: t.x, y: t.y, w: pick.width };
  pctx.setTransform(1, 0, 0, 1, 0, 0);
  pctx.clearRect(0, 0, pick.width, pick.height);
  pctx.translate(t.x, t.y); pctx.scale(t.k, t.k);
  S.items.forEach((it, i) => {
    const id = i + 1;
    pctx.fillStyle = `rgb(${id & 255},${(id >> 8) & 255},${(id >> 16) & 255})`;
    if (it.p.recon || it.p.crop || it.p.cut) { pctx.save(); clipFor(pctx, it); pctx.fill(pathOf(it.f)); pctx.restore(); }
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

// The part of the map the card, the tools and the bottom bar leave free: the camera frames things inside it.
function freeBox() {
  const c = canvas.getBoundingClientRect(), box = { l: 0, t: 0, r: S.width, b: S.height };
  if (!c.width) return box;
  if (phone()) {
    box.t = 64;
    for (const el of [$("#col"), $("#dock")]) if (el && el.offsetHeight) box.b = Math.min(box.b, el.getBoundingClientRect().top - c.top - 8);
    return box;
  }
  box.t = 80; box.r = S.width - 76;
  const col = $("#col"); if (col && col.offsetHeight) box.l = col.getBoundingClientRect().right - c.left + 12;
  const d = $("#dock"); if (d && d.offsetHeight) box.b = d.getBoundingClientRect().top - c.top - 12;
  if (box.r - box.l < 240) box.l = 0;
  return box;
}
const phone = () => matchMedia("(max-width: 760px)").matches;
function flyTo(bounds, maxK = 8, ms = 900) {
  const [[x0, y0], [x1, y1]] = bounds;
  if (!isFinite(x0) || !S.width) return;
  const f = freeBox(), pad = 40, w = Math.max(120, f.r - f.l - pad), h = Math.max(120, f.b - f.t - pad);
  const k = Math.max(1, Math.min(maxK, 0.9 / Math.max((x1 - x0) / w, (y1 - y0) / h)));
  d3.select(canvas).transition().duration(ms).ease(d3.easeCubicInOut)
    .call(S.zoom.transform, d3.zoomIdentity.translate((f.l + f.r) / 2 - k * (x0 + x1) / 2, (f.t + f.b) / 2 - k * (y0 + y1) / 2).scale(k));
}
function hudInset() { const f = freeBox(); return { top: f.t, bottom: S.height - f.b }; }
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
  loadRealmPlace(key, opts.ll);
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
const tabOf = () => (S.view === "today" || S.tstory ? "today" : LISTS.has(S.view) && S.view !== "sources" || S.war || S.journey || S.view === "moment" ? "stories" : S.view === "sources" ? "" : "map");
function renderCol(resetScroll) {
  syncChart();
  const col = $("#col"), scroll = col.scrollTop;
  const v = S.view;
  col.dataset.w = LISTS.has(v) && v !== "sources" && !S.war && !S.journey ? "wide" : S.war || S.journey || v === "realm" || v === "place" || v === "sources" ? "story" : "";
  col.innerHTML = S.tstory && S.war ? todayStoryHTML() : v === "today" ? homeHTML() : v === "sources" ? sourcesHTML() : (v === "moments" || v === "empires" || v === "wars") && !S.war && !S.journey ? storiesHTML()
    : v === "journey" && S.journey ? journeyHTML() : v === "war" && S.war ? warHTML()
    : v === "moment" && S.moment ? momentHTML() : v === "site" && S.site ? siteHTML() : v === "place" && S.place ? placeHTML() : S.sel && realm(S.sel) ? realmHTML() : worldHTML();
  col.scrollTop = resetScroll ? 0 : scroll;
  if (S.pop && (S.war || S.journey || v !== "world" && v !== "realm")) hidePop();
  syncChrome();
  renderDock();
  renderSide();
}
// Header tab, body classes and the floating extras that follow the page shown.
function syncChrome() {
  const tab = tabOf();
  document.querySelectorAll("[data-tab]").forEach((a) => (a.getAttribute("data-tab") === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  $("#legend").hidden = !S.war;
  $("#compare").hidden = !(S.compare && !S.war && !S.journey && !S.tstory);
  document.body.classList.toggle("sdock", !!(S.war && !S.tstory || S.journey || S.view === "moment"));
  document.body.classList.toggle("jdock", !!S.journey);
}
// Card building blocks.
const cardHead = (back, right = "", act = "back") => `<div class="chead">${back ? `<button class="back" data-act="${act}">${I.left}${esc(back)}</button>` : "<span></span>"}${right ? `<span class="count">${right}</span>` : ""}</div>`;
const progBar = (n, total) => `<div class="prog" role="img" aria-label="${n} of ${total}"><i style="width:${total ? (100 * n) / total : 0}%"></i></div>`;
const kick = (t, grey) => `<div class="kicker${grey ? " grey" : ""}">${t}</div>`;
const navRow = (prevAttr, next) => `<div class="navrow"><button class="round" ${prevAttr || "disabled"} aria-label="Earlier">${I.left}</button>${next
  ? `<button class="navnext" ${next.attr}><span><small>${esc(next.small)}</small><b>${esc(next.title)}</b></span>${I.right}</button>`
  : `<button class="navnext done" data-act="back"><span><small>The end</small><b>Back to Stories</b></span>${I.right}</button>`}</div>`;
const seg2 = (tabs, cur, name) => `<div class="seg2" role="tablist">${tabs.map(([k, t]) => `<button role="tab" data-${name}="${k}" aria-selected="${k === cur}">${t}</button>`).join("")}</div>`;
const srcFold = (list) => { const ok = (list || []).filter((x) => x && /^https?:\/\//i.test(x.url || "")); return ok.length ? `<details class="srcs"><summary>${ok.length} source${ok.length > 1 ? "s" : ""}</summary><ol class="refs">${ok.map((x) => `<li><a href="${safeUrl(x.url)}" target="_blank" rel="noopener">${esc(x.title || x.url)}</a></li>`).join("")}</ol></details>` : ""; };
const EVIDENCE = {
  written: ["Written records", "ev-written"],
  archaeology: ["Archaeology only · no written records", "ev-arch"],
  disputed: ["Disputed · not proven", "ev-disputed"],
  legendary: ["Legendary · not proven", "ev-legend"],
};
const evidenceBadge = (ev) => { const e = EVIDENCE[ev] || EVIDENCE.archaeology; return `<span class="evb ${e[1]}">${esc(e[0])}</span>`; };
// The sites layer is the ancient world: a site is drawn only in its own period. "until" missing means it still stands
// today; then it shows until the end of antiquity (500 CE) or 200 years after it was built, whichever is later.
// Nothing is drawn after 1500. Undated legends never appear on the timeline (search still finds every site).
const siteEnd = (st) => Math.min(st.until ?? Math.max(500, st.built + 200), 1500);
const siteShown = (st, y) => st.built != null && st.built <= y && y <= siteEnd(st);
const sitesNow = (y = S.year) => (S.sites || []).filter((st) => siteShown(st, y));
function culturesNow(y = S.year) { // archaeological-culture regions active this year (from the reconstruction layers)
  const seen = new Map();
  for (const sp of S.supps) if (sp.kind === "cultures") for (const rg of sp.regions) if ((rg.from ?? sp.from) <= y && y <= (rg.to ?? sp.to) && !seen.has(rg.name)) seen.set(rg.name, rg);
  return [...seen.values()];
}
function prehistoryHTML(y) {
  let h = kick("The world in") + `<p class="bigy live">${yearLabel(y)}</p><h1 class="ttl">Before the first states</h1>`;
  h += `<aside class="mapnote norecords"><b>No written records</b><p>Writing begins around ${shortYear(WRITING)} in Mesopotamia and Egypt. Everything the map shows for this time is known from archaeology: excavated sites, radiocarbon dates and the spread of tools, pottery and farming. Areas are approximate, and blank land means no culture has been mapped there, not that no one lived there.</p></aside>`;
  const drop = seaDrop(y), ice = iceNow(y);
  if (drop >= 1 || ice.length) h += `<aside class="mapnote iceage"><b>The end of the ice age</b><p>${drop >= 1 ? `The sea stood about <strong>${Math.round(drop)} m lower</strong> than today, so shallow seabed was dry land (drawn grey beyond today's coasts). ` : ""}${ice.length ? `Ice sheets (white, dashed edge) still covered ${esc(iceRegions(ice))}.` : ""} Reconstructions are approximate; see Sources.</p></aside>`;
  const cs = culturesNow(y);
  if (cs.length) {
    h += `<h3 class="sec">Cultures · ${plainYear(y)}</h3><ul class="mlist">`;
    for (const rg of cs) h += `<li><button class="mrow" data-key="${esc(rg.name)}"><span class="my">${esc(rg.dateLabel || "")}</span><span class="mt">${esc(rg.name)} ${evidenceBadge(rg.evidence)}</span></button></li>`;
    h += `</ul>`;
  }
  const ss = sitesNow(y);
  if (ss.length) {
    h += `<h3 class="sec">Sites in use · ${plainYear(y)}</h3><ul class="mlist">`;
    for (const st of ss) h += `<li><button class="mrow" data-site="${esc(st.id)}"><span class="my">${esc(st.dateLabel || shortYear(st.built))}</span><span class="mt">${esc(st.name)} ${evidenceBadge(st.evidence)}</span></button></li>`;
    h += `</ul>`;
  }
  if (!cs.length && !ss.length) h += `<p class="note">Nothing is mapped for this year yet. Try a later year, or the sites list in search.</p>`;
  const em = S.content.moments.filter((m) => m.year < -3400 && m.year <= y + 2000 && m.year >= y - 3000);
  if (em.length) {
    h += `<h3 class="sec">Defining moments</h3><ul class="mlist">`;
    for (const m of em) h += `<li><button class="mrow${m.worldChanging ? " wc" : ""}" data-moment="${esc(m.id)}"><span class="my">${esc(m.yearLabel || shortYear(m.year))}</span><span class="mt">${esc(m.title)}</span></button></li>`;
    h += `</ul>`;
  }
  return h;
}
function splitLead(text, n = 2) { // first n sentences, and the remainder
  const parts = String(text || "").match(/[^.!?]+(?:[.!?]+["'”’)]?|$)\s*/g) || [];
  let i = 0, lead = "";
  while (i < parts.length && (i < n || lead.length < 120)) lead += parts[i++];
  const rest = parts.slice(i).join("").trim();
  return rest.length > 80 ? [lead.trim(), rest] : [String(text || ""), ""];
}
function worldHTML() {
  const y = S.year;
  if (y < (S.clio.range?.[0] ?? -3400)) return prehistoryHTML(y);
  const ch = chapterFor(y), near = chapterNear(ch, y);
  const top = realmsNow().slice(0, 6);
  let h = kick("The world in") + `<p class="bigy live">${yearLabel(y)}</p><h1 class="ttl">${esc(near ? ch.title : eraOf(y)[2])}</h1>`;
  if (ch) {
    h += `<p class="prose">${esc(firstSentences(ch.overview, 2))}</p>`;
    if (!near) h += `<p class="note">From the chapter for <button class="linkish" data-year="${ch.year}">${plainYear(ch.year)}</button>${chapterAfter(y) ? ` · next chapter: <button class="linkish" data-year="${chapterAfter(y).year}">${plainYear(chapterAfter(y).year)}</button>` : ""}</p>`;
  }
  h += kick("Largest powers", 1) + `<div class="chiprow" style="margin-top:-6px">${top.slice(0, 5).map((r) => `<button class="pchip" data-key="${esc(realmKey(r.key))}"><i style="background:${r.color}"></i>${esc(displayName(r.key))}</button>`).join("")}</div>`;
  const wars = S.content.wars.filter((w) => w.span[0] <= y && y <= w.span[1]);
  const more = [["rulers", "Who ruled what"], ["wars", "Wars under way"], ["regions", "Region by region"]];
  h += kick(`More about ${shortYear(y)}`, 1) + `<div class="grid2" style="margin-top:-6px">${more.map(([k, t]) => `<button class="morebtn" data-more="${k}" aria-expanded="${S.worldMore === k}">${esc(t)}${I.right}</button>`).join("")}<button class="morebtn" data-act="about">Sources${I.right}</button></div>`;
  if (S.worldMore === "rulers") {
    const rulerOf = (key) => (near ? ch.powers?.find((p) => p.clio === key)?.ruler : null);
    const showRulers = near && top.some((r) => rulerOf(r.key));
    h += `<table class="rulers"><thead><tr><th scope="col">Realm</th><th scope="col">${showRulers ? "Ruler" : "Since"}</th><th scope="col">M km²</th></tr></thead><tbody>`;
    for (const r of top) {
      const since = realm(realmKey(r.key))?.tl[0]?.[0];
      h += `<tr data-key="${esc(realmKey(r.key))}"><td><span class="sq" style="background:${r.color}"></span>${esc(displayName(r.key))}</td><td class="who">${esc(showRulers ? rulerOf(r.key) || "—" : since != null ? shortYear(since) : "")}</td><td>${mkm(r.area)}</td></tr>`;
    }
    h += `</tbody></table><p class="note">${S.states.length} states recorded this year. Areas include colonies and member states.</p>`;
  } else if (S.worldMore === "wars") {
    h += wars.length ? `<div class="lgroup">${wars.map((w) => `<button class="lrow" data-war="${esc(w.id)}">${I.sword}<span class="t"><b>${esc(w.name)}</b><small>${esc(w.dateLabel || rangeText(w.span[0], w.span[1]))}</small></span>${I.right}</button>`).join("")}</div>`
      : `<p class="note">None of the atlas's ${S.content.wars.length} war stories is under way in ${plainYear(y)}.</p>`;
    const [ea, eb, eLabel] = eraOf(y), em = S.content.moments.filter((m) => m.year >= ea && m.year < eb);
    if (em.length) h += `<h3 class="sec">Defining moments · ${esc(eLabel)}</h3><ul class="mlist">${em.map((m) => `<li><button class="mrow" data-moment="${esc(m.id)}"><span class="my">${esc(m.yearLabel || shortYear(m.year))}</span><span class="mt">${esc(m.title)}</span></button></li>`).join("")}</ul>`;
  } else if (S.worldMore === "regions" && ch) {
    h += `<div>${REGIONS.filter(([k]) => ch.regions?.[k]).map(([k, label, bb]) => `<details class="region"><summary>${label}</summary><p>${esc(ch.regions[k])}</p><button class="goto" data-bb='${JSON.stringify(bb)}'>Show on map →</button></details>`).join("")}</div>`;
    if (ch.events?.length) h += `<h3 class="sec">Key events</h3><ol class="events">${ch.events.map((e) => `<li><button class="y linkish" data-year="${e.year}">${shortYear(e.year)}</button><span>${esc(e.text)}</span></li>`).join("")}</ol>`;
    h += sourcesList(ch.sources, `Sources · chapter ${plainYear(ch.year)}`);
  }
  return h;
}
// Today: the event that happened on this date, a one-minute story about it, and the viewer's way back in.
function homeHTML() {
  const t = S.today, d = new Date(), md = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  let h = "";
  if (t) {
    h += kick(`${t.exact ? "Today in history" : "Near this day"} · ${esc(t.exact ? md : t.e.label || md)}`) + `<p class="bigy">${yearLabel(t.e.year)}</p><h1 class="ttl">${esc(t.e.text)}</h1>`;
    if (t.e.detail) h += `<p class="prose">${esc(firstSentences(t.e.detail, 2))}</p>`;
    h += `<div class="navrow"><button class="pillbtn dark" data-act="tstory" style="flex:1;height:48px">${I.play.replace("<svg", '<svg style="fill:currentColor;stroke:none;width:12px;height:12px"')}Play today's story · 1 min</button><button class="round" data-act="share" aria-label="Share today's story" style="width:48px;height:48px">${I.share}</button></div>`;
  } else h += kick("The world in") + `<p class="bigy">${yearLabel(S.year)}</p><h1 class="ttl">${esc(chapterFor(S.year)?.title || eraOf(S.year)[2])}</h1>`;
  const mine = myPlace();
  h += `<div class="lgroup"><button class="lrow" data-act="myplace">${I.pin}<span class="t"><b>Who ruled your place?</b><small>${esc(mine ? mine.name : "Pick any spot on the map")}</small></span>${I.right}</button>`;
  const last = P.last && (P.last.k === "e" ? journeyById(P.last.id) : warById(P.last.id));
  if (last) {
    const total = last.events.length, n = Math.min(total, seenCount(P.last.k, last.id));
    h += `<button class="lrow" data-act="continue">${I.book}<span class="t"><b>Continue · ${esc(last.name)}</b><span class="bar"><i style="width:${(100 * n) / total}%"></i></span></span><span class="m">${n} of ${total}</span>${I.right}</button>`;
  } else h += `<button class="lrow" data-tab="stories">${I.book}<span class="t"><b>Start a story</b><small>${S.content.journeys.length} empires, ${S.content.wars.length} wars, ${S.content.moments.length} moments</small></span>${I.right}</button>`;
  h += `</div>`;
  const st = streak();
  h += `<div class="streak"><span>${st.n > 1 ? `${st.n} days in a row` : "Come back tomorrow for a new day"}</span><span class="dots" aria-hidden="true">${st.week.map((x) => `<i class="${x.now ? "now" : x.on ? "on" : ""}"></i>`).join("")}</span></div>`;
  return h;
}
// The viewer's place: one they picked, else their country's capital (from the time zone).
function myPlace() {
  try { const p = JSON.parse(localStorage.getItem("atlas.place") || "null"); if (p?.ll) return p; } catch {}
  const c = COUNTRY[VIEWER]; return c ? { name: `Capital of ${c[0].replace(/^the /, "")}`, ll: c[1] } : null;
}
// Today's story: four steps built from the war event on this date (the war so far, the day, what came next, what changed).
function todaySteps() {
  const t = S.today; if (!t) return [];
  const w = t.war, ev = w.events, nx = ev[t.idx + 1], pv = ev[t.idx - 1];
  const steps = [{ label: `The ${w.name.replace(/^The /, "")}`, idx: pv ? t.idx - 1 : t.idx, kick: w.dateLabel || rangeText(w.span[0], w.span[1]), title: w.name, text: firstSentences(w.summary, 2) }];
  steps.push({ label: t.e.text, idx: t.idx, kick: t.e.label, title: t.e.text, text: firstSentences(t.e.detail, 3) });
  if (nx) steps.push({ label: nx.text, idx: t.idx + 1, kick: nx.label, title: nx.text, text: firstSentences(nx.detail, 3) });
  steps.push({ label: "What it cost", idx: nx ? t.idx + 1 : t.idx, kick: "What it cost", title: "What it cost", text: w.casualties || firstSentences(w.summary, 3), last: true });
  return steps;
}
function todayStoryHTML() {
  const steps = todaySteps(), i = S.tstory.step, st = steps[i], w = S.today.war;
  const d = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  let h = cardHead("Today", `${i + 1} of ${steps.length}`, "today");
  h += `<div class="prog" style="background:none;display:flex;gap:4px;height:4px">${steps.map((_, k) => `<i style="position:static;flex:1;background:${k <= i ? "var(--ink)" : "var(--rule)"}"></i>`).join("")}</div>`;
  h += kick(`${S.today.exact ? "Today in history" : "Near this day"} · ${esc(d)} ${S.today.e.year}`) + `<h1 class="ttl">${esc(st.title)}</h1>`;
  if (st.kick && !st.last) h += kick(esc(st.kick), 1);
  if (st.text) h += `<p class="prose">${esc(st.text)}</p>`;
  h += `<h3 class="sec">Go deeper</h3><div class="lgroup"><button class="lrow" data-war="${esc(w.id)}">${I.book}<span class="t"><b>${esc(w.name)}</b><small>War story</small></span><span class="m">${w.events.length} events</span>${I.right}</button></div>`;
  h += navRow(i > 0 ? `data-tstep="${i - 1}"` : 'data-act="today"', i < steps.length - 1 ? { attr: `data-tstep="${i + 1}"`, small: "Next", title: steps[i + 1].title } : { attr: `data-war="${esc(w.id)}"`, small: "Go deeper", title: `The whole story · ${w.events.length} events` });
  return h;
}
// ---------------------------------------------------------------- this place through time
// tools/placeindex.py: who held each half-degree square of the map, period by period, in 10° tiles (data/place/).
const placeTiles = new Map();
async function placeRuns([lon, lat]) {
  const cx = Math.floor(lon * 2), cy = Math.floor(lat * 2);
  const tile = async (tx, ty) => memo(placeTiles, `${tx}_${ty}`, `data/place/${tx}_${ty}.json`).catch(() => null);
  // the clicked square, else the nearest square with data (a click on a coast can land in the sea)
  for (let d = 0; d <= 2; d++) {
    for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue;
      const x = cx + dx, y = cy + dy, tx = Math.floor(x / 20) * 10, ty = Math.floor(y / 20) * 10;
      const t = await tile(tx, ty), runs = t?.cells[`${x - tx * 2},${y - ty * 2}`];
      if (runs) return runs.map(([a, b, i]) => ({ from: a, to: b, name: t.names[i] }));
    }
  }
  return [];
}
async function openPlace(ll, opts = {}) {
  const from = opts.from ?? S.sel;
  noteFrom(); stopPlay(); hidePop();
  if (S.journey) exitJourney();
  if (S.war) exitWar();
  if (opts.save) try { localStorage.setItem("atlas.place", JSON.stringify({ name: opts.name, ll })); } catch {}
  S.place = { ll, runs: null, from, name: opts.name }; S.view = "place"; S.moment = null; S.site = null; S.sel = null;
  renderCol(true); draw(); writeHash();
  flyCenter(ll, Math.max(S.t.k, 4), 900);
  const runs = await placeRuns(ll);
  if (S.place?.ll !== ll) return;
  S.place.runs = runs; renderCol(true);
}
function placeHTML() {
  const { ll, runs, from } = S.place;
  const lat = `${Math.abs(ll[1]).toFixed(1)}°${ll[1] >= 0 ? "N" : "S"}`, lon = `${Math.abs(ll[0]).toFixed(1)}°${ll[0] >= 0 ? "E" : "W"}`;
  const back = from === "today" ? "Today" : from ? displayName(from) : `The world in ${plainYear(S.year)}`;
  let h = cardHead(back, runs?.length ? `${new Set(runs.map((r) => r.name)).size} rulers on record` : "", "close-place");
  h += kick("Who ruled") + `<h1 class="ttl xl">${esc(S.place.name || "This spot")}</h1>`;
  if (!S.place.name || /^Capital of/.test(S.place.name)) h += `<p class="sub" style="margin-top:-10px">${S.place.name ? esc(S.place.name.replace(/^Capital of /, "")) + " · " : ""}${lat}, ${lon}</p>`;
  if (!runs) return h + `<p class="note">Looking through ${shortYear(S.range[0])} to ${shortYear(S.range[1])}…</p>`;
  if (!runs.length) return h + `<p class="note">No recorded state has held this spot on the map. Try a spot nearer to land.</p><button class="pillbtn block" data-act="pickplace">${I.pin}Choose another place</button>`;
  h += `<div class="hrows">`;
  let last = null;
  for (const r of runs) {
    if (last != null && r.from > last + 1) h += `<div class="hrow gap"><i class="sq"></i><span class="nm"><b>No state on record</b></span><span class="yr">${rangeText(last + 1, r.from - 1)}</span><svg></svg></div>`;
    const now = r.from <= S.year && S.year <= r.to;
    h += `<button class="hrow${now ? " now" : ""}" data-pkey="${esc(r.name)}" data-pyear="${Math.max(r.from, Math.min(r.to, Math.round((r.from + r.to) / 2)))}"><i class="sq" style="background:${colorOf(r.name)}"></i><span class="nm"><b>${esc(displayName(r.name))}</b></span><span class="yr">${rangeText(r.from, r.to)}</span>${I.right}</button>`;
    last = Math.max(last ?? r.to, r.to);
  }
  h += `</div><p class="note">A gap between two rows means the atlas has no state on record here for those years. Pick a row to see the map in that year.</p>`;
  return h + `<button class="pillbtn block" data-act="pickplace">${I.pin}Choose another place</button>`;
}
function siteHTML() {
  const st = S.site, inUse = st.built == null || (st.built <= S.year && S.year <= (st.until ?? S.range[1]));
  let h = cardHead(backLabel(`The world in ${plainYear(S.year)}`), "", "close-site");
  h += kick(`${esc((st.kind || "site").replace("-", " "))} · ${esc(st.dateLabel || shortYear(st.built))}${st.unesco ? " · UNESCO World Heritage" : ""}`) + `<h1 class="ttl l">${esc(st.name)}</h1>`;
  if (st.altNames?.length) h += `<p class="note">Also: ${esc(st.altNames.join(", "))}</p>`;
  h += `<aside class="mapnote evnote">${evidenceBadge(st.evidence)}<p>${esc(st.evidenceNote || "")}</p></aside>`;
  if (st.image?.image) h += `<figure class="mfig"><img src="${safeUrl(st.image.image)}" alt="${esc(st.image.caption || st.name)}" loading="lazy"><figcaption>${esc(st.image.caption || "")} <a href="${safeUrl(st.image.page)}" target="_blank" rel="noopener">${esc(st.image.credit || "Wikimedia Commons")} · ${esc(st.image.license || "")}</a></figcaption></figure>`;
  if (st.summary) h += `<p class="prose">${esc(st.summary)}</p>`;
  const tooOld = st.built != null && (st.until ?? st.built) < S.range[0];
  h += st.built == null ? `<p class="note">A story without a date or remains: it is not drawn on the timeline.</p>`
    : tooOld ? `<p class="note">In use ${esc(st.dateLabel || "")}: older than the map's starting date (${shortYear(S.range[0])}), so it is not drawn on the timeline.</p>`
    : `<p class="note">In use ${esc(st.dateLabel || "")}${st.standing ? "; remains can still be seen today" : ""}.${inUse ? "" : ` <button class="linkish" data-year="${st.built}">Show it in its time</button>`}</p>`;
  const cult = st.culture && st.built != null && culturesNow(st.built).concat(culturesNow((st.built + (st.until ?? st.built)) / 2)).find((rg) => rg.key === st.culture || rg.name === st.culture);
  if (cult) h += `<p class="note">Culture: <button class="linkish" data-key="${esc(cult.name)}">${esc(cult.name)}</button></p>`;
  h += sourcesList(st.sources);
  return h;
}
function openSite(id) {
  const st = (S.sites || []).find((x) => x.id === id);
  if (!st) return;
  noteFrom();
  stopPlay();
  if (S.journey) exitJourney();
  if (S.war) exitWar();
  S.sel = null; S.site = st; S.view = "site";
  const inUse = st.built == null || siteShown(st, S.year); // opened from search in another age: travel to when it is drawn
  const after = () => { S.view = "site"; S.site = st; renderCol(true); draw(); writeHash(); flyCenter(st.lonlat, Math.max(S.t.k, 5), 900); };
  if (inUse) after(); else go(Math.max(S.range[0], st.built)).then(after);
}
function realmHTML() {
  const key = S.sel, r = realm(key), y = S.year, emp = empireOf(key);
  const area = areaAt(key, y);
  const peak = r.tl.reduce((m, row) => (row[2] > m[2] ? row : m));
  const end = r.tl[r.tl.length - 1][1];
  const span = `${shortYear(r.tl[0][0])} – ${end >= S.range[1] ? "today" : shortYear(end)}`;
  const media = S.commons[r.wiki] || (emp?.wiki && S.commons[emp.wiki]);
  const now = activeFeats(key);
  const alive = end >= S.range[1] - 1;
  let h = cardHead(`The world in ${plainYear(y)}`, "", "close");
  h += kick(alive && !r.group ? `Country · since ${shortYear(r.tl[0][0])}` : `${r.group ? "Empire" : "Realm"} · ${span.replace(" – ", " to ")}`) + `<h1 class="ttl xl">${esc(displayName(key))}</h1>`;
  if (emp && emp.name !== displayName(key) && !r.recon) h += `<p class="sub">${esc(emp.name)}</p>`;
  if (r.recon) {
    const { sp, rg } = r.recon;
    if (sp.kind === "cultures") { // an archaeological culture: say how it is known
      h += `<aside class="mapnote evnote">${evidenceBadge(rg.evidence)}<p>${esc(rg.evidenceNote || "")}</p></aside>`;
      if (rg.dateLabel) h += `<p class="note">${esc(rg.dateLabel)} · its extent is approximate, from where its sites have been found.</p>`;
      if (rg.summary) h += `<p class="prose">${esc(rg.summary)}</p>`;
      const ss = (S.sites || []).filter((x) => x.culture === rg.key);
      if (ss.length) h += `<h3 class="sec">Sites</h3><ul class="mlist">${ss.map((x) => `<li><button class="mrow" data-site="${esc(x.id)}"><span class="my">${esc(x.dateLabel || "")}</span><span class="mt">${esc(x.name)}</span></button></li>`).join("")}</ul>`;
      h += sourcesList(rg.sources || sp.sources);
      return h;
    }
    h += `<aside class="mapnote recon"><b>Approximate borders</b>${rg.note ? `<p>${esc(rg.note)}</p>` : ""}`;
    if (rg.capital) h += `<p><strong>Capital:</strong> ${esc(rg.capital)}</p>`;
    if (rg.ports?.length) h += `<p><strong>Ports:</strong> ${esc(rg.ports.join(", "))}</p>`;
    if (rg.rulers?.length) h += `<p><strong>Rulers named in the sources:</strong> ${rg.rulers.map((x) => `${esc(x.name)}${x.when ? ` (${esc(x.when)})` : ""}`).join("; ")}</p>`;
    if (rg.attested) h += `<p><strong>Attested in:</strong> ${esc(rg.attested)}</p>`;
    h += `</aside>`;
    if (sp.summary) h += `<h3 class="sec">${esc(sp.title)}</h3><p class="prose">${esc(sp.summary)}</p>`;
    h += sourcesList(sp.sources);
    return h;
  }
  if (emp?.summary) { const [lead, rest] = splitLead(emp.summary); h += `<p class="prose">${esc(lead)}</p>`; if (rest) h += `<details class="more"><summary>Read more</summary><p class="prose">${esc(rest)}</p></details>`; }
  h += realmPlaceHTML(key);
  h += `<div class="facts">${emp?.capital ? `<div><span>Capital</span><b>${esc(emp.capital.split(";")[0])}</b></div>` : ""}<div><span>Area in ${shortYear(y)}</span><b>${area ? `${mkm(area)} million km²` : "Not drawn"}</b></div><div><span>At its peak</span><b>${shortYear(peak[0])}, ${mkm(peak[2])} million km²</b></div></div>`;
  if (r.memberOf?.length) h += `<p class="note">Part of ${r.memberOf.map((g) => `<button class="linkish" data-key="${esc(g)}">${esc(displayName(g))}</button>`).join(", ")}</p>`;
  const jr = journeyForRealm(key);
  if (jr) h += `<button class="pillbtn dark block" data-journey="${esc(jr.id)}">${I.book}Follow ${esc(jr.name)} through its history</button>`;

  const lead = emp && S.media[`empire:${emp.id}`]?.[0]; // the picture comes after who ruled this spot, so that list is seen first
  if (lead) h += `<figure class="lead"><img src="${safeUrl(lead.image)}" alt="${esc(lead.caption)}" loading="lazy"><figcaption>${esc(lead.caption)} <a href="${safeUrl(lead.page)}" target="_blank" rel="noopener">${esc(lead.credit)} · ${esc(lead.license)}</a></figcaption></figure>`;
  h += `<h3 class="sec">Territory through time</h3>${extentChart(r)}
    <label class="toggle"><input type="checkbox" id="ghostToggle" ${S.showGhost ? "checked" : ""}> Outline greatest extent on the map</label>`;
  if (media) {
    const ry = refYear(media, r);
    h += `<h3 class="sec">Reference map${ry != null ? ` · c. ${shortYear(ry)}` : ""}</h3>`;
    if (ry != null && Math.abs(ry - y) > 10) h += `<p class="refyear">This reference shows the realm around <b>${plainYear(ry)}</b>; the map above is showing <b>${plainYear(y)}</b>, so borders will differ. <button class="linkish" data-year="${ry}">Show ${plainYear(ry)} on the map</button></p>`;
    else if (ry != null) h += `<p class="refyear">Same period as the map.</p>`;
    h += `<figure class="ref"><a href="${safeUrl(media.page)}" target="_blank" rel="noopener"><img src="${safeUrl(media.thumb)}" alt="${esc(media.desc || media.file)}" loading="lazy"></a>
      <figcaption>${esc(media.desc || media.file.replace(/^File:/, ""))}<br>${esc(media.artist || "Unknown author")} · ${media.licenseUrl ? `<a href="${safeUrl(media.licenseUrl)}" target="_blank" rel="noopener">${esc(media.license)}</a>` : esc(media.license)} · <a href="${safeUrl(media.page)}" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption></figure>`;
  }
  if (emp?.rulers?.length) {
    const pic = (i, x) => { const m = S.media[`ruler:${emp.id}:${i}`]?.[0]; return m && m.caption.startsWith(x.name) ? m : null; }; // index-keyed: the name must still match
    const pics = emp.rulers.map((x, i) => pic(i, x));
    const any = pics.some(Boolean);
    h += `<h3 class="sec">Notable rulers</h3><ul class="rlist${any ? " withpic" : ""}">`;
    emp.rulers.forEach((x, i) => {
      const m = pics[i];
      const img = !any ? "" : m ? `<a class="pp" href="${safeUrl(m.page)}" target="_blank" rel="noopener" title="${esc(m.article)} · ${esc(m.credit)} · ${esc(m.license)}"><img src="${safeUrl(m.image)}" alt="${esc(x.name)}" loading="lazy"></a>` : `<span class="pp none" aria-hidden="true">${esc(x.name.trim()[0] || "")}</span>`;
      h += `<li>${img}<b>${esc(x.name)}</b><span class="r">${esc(x.reign || "")}</span>${x.note ? `<span class="n">${esc(x.note)}</span>` : ""}</li>`;
    });
    h += `</ul>`;
    if (any) h += `<details class="more credits"><summary>Portrait credits</summary><p class="note">${pics.map((m, i) => m && `${esc(emp.rulers[i].name)}: <a href="${safeUrl(m.page)}" target="_blank" rel="noopener">${esc(m.credit)}</a> (${esc(m.license)})`).filter(Boolean).join(" · ")}</p></details>`;
  }
  if (emp?.legacy) h += `<h3 class="sec">Legacy</h3><p class="prose">${esc(emp.legacy)}</p>`;
  if (now.length > 1 || (now.length === 1 && now[0].properties.n !== key)) {
    const sorted = [...now].sort((a, b) => b.properties.a - a.properties.a);
    h += `<h3 class="sec">Made up of, in ${plainYear(y)} (${now.length})</h3><ul class="terr">`;
    for (const f of sorted.slice(0, 60)) h += `<li data-member="${esc(f.properties.n)}">${esc(clean(f.properties.n))} <small>${fmtArea(f.properties.a)}</small></li>`;
    h += `</ul>`;
  }
  const mc = corrOf(key) || (now[0] && corrOf(now[0].properties.fixed || now[0].properties.n));
  if (mc?.scholarly) // published estimates of the realm's size (the notes beside it are for the people who maintain the map)
    h += `<details class="more mapacc"><summary>How big did it get?</summary><aside class="mapnote"><p>Scholarly peak estimate: <strong>${mkm(mc.scholarly.km2)}M km²</strong>${mc.scholarly.year != null ? ` c. ${shortYear(mc.scholarly.year)}` : ""} (${esc(mc.scholarly.source)}), against ${mkm(peak[2])}M km² on this map.</p></aside></details>`;
  const links = [r.wiki && `<a href="https://en.wikipedia.org/wiki/${encodeURIComponent(r.wiki.replace(/ /g, "_"))}" target="_blank" rel="noopener">Wikipedia</a>`,
    r.wd && `<a href="https://www.wikidata.org/wiki/${esc(r.wd)}" target="_blank" rel="noopener">Wikidata</a>`,
    r.seshat && `<a href="https://seshat-db.com/core/polity/${esc(r.seshat)}" target="_blank" rel="noopener">Seshat</a>`].filter(Boolean);
  if (links.length) h += `<h3 class="sec">Read more</h3><p class="links">${links.join(" · ")}</p>`;
  h += sourcesList(emp?.sources);
  return h;
}
// A realm's page: every state recorded at one spot of it (where it was clicked, else its middle), newest first.
function realmPlaceHTML(key) {
  const rp = S.realmPlace;
  if (!rp || rp.key !== key) return "";
  let h = `<h3 class="sec">Who ruled this spot</h3>`;
  if (!rp.runs) return h + `<p class="note">Looking it up…</p>`;
  if (!rp.runs.length) return "";
  const rows = [...rp.runs].reverse(), shown = rows.slice(0, 6);
  h += `<div class="hrows">${shown.map((r) => {
    const now = r.from <= S.year && S.year <= r.to;
    return `<button class="hrow${now ? " now" : ""}" data-rkey="${esc(r.name)}" data-pyear="${Math.max(r.from, Math.min(r.to, Math.round((r.from + r.to) / 2)))}"><i class="sq" style="background:${colorOf(r.name)}"></i><span class="nm"><b>${esc(displayName(r.name))}</b></span><span class="yr">${rangeText(r.from, r.to)}</span>${I.right}</button>`;
  }).join("")}`;
  const first = rows[rows.length - 1].from;
  if (first > S.range[0] + 10) h += `<div class="hrow gap"><i class="sq"></i><span class="nm"><b>No state on record here yet</b></span><span class="yr">Before ${shortYear(first)}</span><svg></svg></div>`;
  h += `</div>`;
  if (rows.length > shown.length) h += `<button class="pillbtn block" data-act="place">${I.pin}All ${rows.length} rulers of this spot</button>`;
  return h;
}
async function loadRealmPlace(key, ll) {
  if (!ll) { // no click: the middle of the realm's biggest piece this year
    const fs = activeFeats(key); if (!fs.length) { S.realmPlace = null; return; }
    const big = fs.reduce((m, f) => (f.properties.a > m.properties.a ? f : m));
    ll = big.properties.l || d3.geoCentroid(big);
  }
  const rp = (S.realmPlace = { key, ll, runs: null });
  rp.runs = await placeRuns(ll);
  if (S.realmPlace === rp && S.sel === key) renderCol(false);
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
    <text x="0" y="${H - 3}">${shortYear(f0)}</text><text x="${W}" y="${H - 3}" text-anchor="end">${t1 >= S.range[1] ? "today" : shortYear(t1)}</text>
    <text x="2" y="11">${mkm(max)}M km²</text></svg>`;
}
function sourcesHTML() { // the About page (#about; #sources still opens it)
  const L = (url, text) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener">${text}</a>`;
  const n = (x) => x.toLocaleString("en");
  const leads = Object.keys(S.media || {}).filter((k) => k.startsWith("empire:")).length;
  const media = Object.keys(S.media || {}).filter((k) => k.startsWith("moment:")).length;
  const portraits = Object.keys(S.media || {}).filter((k) => k.startsWith("ruler:")).length;
  const sitePics = (S.sites || []).filter((x) => x.image?.image).length;
  return `${cardHead("Back to the map", "", "world")}
    ${kick("About")}<h1 class="ttl l">The World Atlas</h1>
    <p class="prose">An interactive map of world history from 10,000 BCE to today: who ruled what in any year, how far every empire reached, the wars that redrew the map and the moments that changed it, with the sources behind each one.</p>
    <p class="note about-by">Made by <b>Dinesh Varadharajan</b> · <a href="mailto:gvdinesh@gmail.com">gvdinesh@gmail.com</a></p>
    <aside class="mapnote about-insp"><b>Inspired by</b><p class="insp-site">${L("https://www.bharatrajya.com/", "bharatrajya.com")}</p><p>The idea for this atlas came from <strong>Bharat Rajya</strong>, an interactive map of the kingdoms of Indian history. Thank you for showing what a history map can be.</p></aside>

    <h3 class="sec">Read without the map</h3>
    <p class="note">Every story is also a plain page: <a href="/empires/">empires</a>, <a href="/wars/">wars</a>, <a href="/moments/">moments</a>, <a href="/eras/">chapters</a>, <a href="/realms/">realms</a> and <a href="/sites/">ancient sites</a>.</p>

    <h3 class="sec">Licence</h3>
    <p class="note">The atlas's code and its own writing are released under the ${L("https://github.com/dineshvaradharajan/atlas-of-empires/blob/main/LICENSE", "MIT licence")}. The datasets and images below keep their own licences, credited here and wherever they appear.</p>

    <h3 class="sec">Borders and map data</h3>
    <ol class="sources-list">
      <li><b>State borders</b>: ${L("https://github.com/Seshat-Global-History-Databank/cliopatria", "Cliopatria")}, Seshat Global History Databank (${L("https://creativecommons.org/licenses/by/4.0/", "CC BY 4.0")}); paper in <i>Scientific Data</i> (2025), ${L("https://doi.org/10.1038/s41597-025-04516-9", "doi:10.1038/s41597-025-04516-9")}. Simplified for the web.</li>
      <li><b>Borders from 1992 to today</b>: ${L("https://www.naturalearthdata.com/", "Natural Earth")} 1:10m countries (public domain), with the changes since 1992 dated (Czechoslovakia, Eritrea, Hong Kong, South Sudan, Crimea and others). Disputed places follow Natural Earth's default view and are outlined with dashes.</li>
      <li><b>Peoples and other polities</b> (hatched layer): ${L("https://github.com/aourednik/historical-basemaps", "historical-basemaps")} by André Ourednik (GPL-3.0).</li>
      <li><b>Map corrections</b>: ${n(Object.keys(S.corr.realms).length)} realms carry reviewed fixes where the border data contradicts scholarship, each with its sources in the atlas's data files.</li>
      <li><b>Reconstruction layers</b> (e.g. Sangam-age Tamilakam) and <b>archaeological cultures and ancient sites</b>: compiled for this atlas from the publications cited on each page.</li>
      <li><b>Rivers, lakes and sea names</b>: ${L("https://www.naturalearthdata.com/", "Natural Earth")} 1:50m (public domain).</li>
      <li><b>Disputed areas</b>: Natural Earth 1:10m admin-0 disputed areas (public domain), shown the way local maps show them.</li>
      <li><b>Terrain shading and the ice-age coastline</b>: ${L("https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO5/TOPO/ETOPO5/", "NOAA ETOPO5")} world elevation grid (public domain).</li>
      <li><b>Ice-age sea level</b>: Lambeck, Rouby, Purcell, Sun &amp; Sambridge 2014, “Sea level and global ice volumes from the Last Glacial Maximum to the Holocene”, <i>PNAS</i> 111:15296 (${L("https://doi.org/10.1073/pnas.1411762111", "doi:10.1073/pnas.1411762111")}).</li>
      <li><b>Ice sheets</b>: NADI-1, Dalton et al. 2023, <i>Quaternary Science Reviews</i> 321:108345 (${L("https://zenodo.org/records/8161764", "data, CC BY 4.0")}); DATED-1, Hughes et al. 2016, <i>Boreas</i> 45:1–45 (${L("https://doi.pangaea.de/10.1594/PANGAEA.848117", "data, CC BY 3.0")}); Stroeven et al. 2016 for Scandinavia's last ice; present-day Greenland ice from Natural Earth.</li>
      <li><b>War storyboards</b>: front lines, occupied areas and battles traced for this atlas from campaign maps (West Point atlases and Wikimedia Commons maps) and cited statements; each war lists its sources.</li>
    </ol>

    <h3 class="sec">Pictures</h3>
    <ol class="sources-list">
      <li><b>Wikimedia Commons</b>: ${n(Object.keys(S.commons || {}).length)} reference maps, ${n(leads)} empire pictures and ${n(sitePics)} site photos, each credited with its author and licence where it appears (CC BY, CC BY-SA, CC0 or public domain).</li>
      <li><b>Period photos and newspapers</b> (${n(media)} moments): Wikimedia Commons, the Library of Congress (Chronicling America), the US National Archives, UN Archives and the Internet Archive, each credited where shown.</li>
      <li><b>Ruler portraits</b> (${n(portraits)}): lead images of Wikipedia articles, matched through Wikidata, freely licensed on Wikimedia Commons and credited per portrait.</li>
    </ol>

    <h3 class="sec">Facts and writing</h3>
    <ol class="sources-list">
      <li>Chapters, empire profiles, moments, wars and journeys are written for this atlas and fact-checked against ${L("https://en.wikipedia.org/", "Wikipedia")} (cited statements only), ${L("https://www.wikidata.org/", "Wikidata")}, ${L("https://seshat-db.com/", "Seshat")}, Britannica-level references, museum and university pages, Taagepera and Turchin for empire areas, and regional authorities such as Schwartzberg, Majumdar, the Imperial Gazetteer and the <i>Cambridge Ancient History</i>. Every page lists its own sources.</li>
      <li>The twelve world regions follow the rows of the SenseForMaps decade-by-decade timeline poster.</li>
    </ol>

    <h3 class="sec">Software and fonts</h3>
    <ol class="sources-list">
      <li>${L("https://d3js.org/", "D3.js")} by Mike Bostock (ISC) and ${L("https://github.com/mapbox/earcut", "earcut")} by Mapbox (ISC).</li>
      <li>${L("https://fonts.google.com/specimen/Archivo", "Archivo")} (Omnibus-Type) and ${L("https://rsms.me/inter/", "Inter")} (Rasmus Andersson), both SIL Open Font License, via Google Fonts.</li>
      <li>Data prepared with Python and ${L("https://ffmpeg.org/", "FFmpeg")}; hosted on Cloudflare Pages. Built with the help of Claude (Anthropic).</li>
    </ol>

    <h3 class="sec">Corrections</h3>
    <p class="note">Borders are scholarly approximations. Spotted an error? Write to <a href="mailto:gvdinesh@gmail.com">gvdinesh@gmail.com</a> or open an issue on ${L("https://github.com/dineshvaradharajan/atlas-of-empires", "GitHub")}; border errors are best reported to Cliopatria too, so every user of the dataset benefits.</p>
    <p class="note">Keyboard: ← → move 10 years (Shift: 1 year) · [ ] previous/next chapter · Space play · Esc clear.</p>`;
}

// ---------------------------------------------------------------- wars
// Play a war event by event: each side's states coloured, each event pinned and explained (content/wars/*.json).
const SIDE_COLORS = ["#2B59D9", "#E5402A", "#2F7D6D", "#E9A93B"];
const warById = (id) => S.content.wars.find((w) => w.id === id) || null;
// A member counts from its entry date (fromDate, else 1 Jan of `from`) until its exit date (toDate, else the end of `to`).
const memberOn = (x, t) => (x.fromDate ? fracDate(x.fromDate) : x.from) <= t + 1e-9 && t < (x.toDate ? fracDate(x.toDate) : x.to + 1);
function warSides(w, t) { // realm/group name -> side index, for members at war at time t (fractional year)
  const m = new Map();
  w.sides.forEach((sd, i) => sd.members.forEach((x) => { if (memberOn(x, t) && !m.has(x.clio)) m.set(x.clio, i); }));
  return m;
}
const warT = () => (S.war && S.wt != null ? S.wt : S.year);
function syncSides(playing) { // recolour as states enter or leave the war (by day, not by year)
  const b = warSides(S.war, S.wt), a = S.warMap;
  const changed = !a || a.size !== b.size || [...b].some(([k, v]) => a.get(k) !== v);
  if (changed && a && playing) allianceChange(a, b, S.wt);
  if (changed) S.warMap = b;
}
function warSideOf(it) {
  if (!S.war || it.kind !== "state") return -1;
  const m = S.warMap || (S.warMap = warSides(S.war, warT()));
  // a relabelled shape (border corrections) still belongs to the side its original name was listed under
  return m.has(it.p.n) ? m.get(it.p.n) : m.has(it.p.k) ? m.get(it.p.k) : it.p.fixed && m.has(it.p.fixed) ? m.get(it.p.fixed) : -1;
}
const fracDate = (s, fallback) => { // "1916-07-01" -> 1916.497 (fractional year)
  const m = String(s ?? "").match(/^(-?\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return fallback ?? NaN;
  const y = +m[1], mo = m[2] ? +m[2] : 0, d = m[3] ? +m[3] : 0;
  return mo ? y + ((mo - 1) * 30.4375 + (d ? d - 1 : 0)) / 365.25 : y; // BCE too: year y spans [y, y+1)
};
const evTime = (e) => (e.year >= 0 ? fracDate(e.date, e.year) : e.year);
async function openWar(id, idx = 0, chap = null) {
  const w = warById(id);
  if (!w) return;
  noteFrom();
  stopPlay();
  if (S.journey) exitJourney();
  S.sel = null; S.ghost = null; S.moment = null; S.war = w; S.view = "war"; S.wTab = "story"; S.wIdx = Math.max(0, Math.min(w.events.length - 1, idx));
  S.cine = null; S.shotIdx = -1; S.chap = 0;
  S.callOn = false; S.callPt = null; // drop the previous war's pinned event label
  for (const el of [$("#cCall"), $("#cSub")]) { el.classList.remove("on"); delete el.dataset.k; }
  try { S.cine = await loadCinema(w); } catch (e) { console.warn("war layers unavailable", e); }
  if (S.war !== w) return;
  S.cineK = cineKnots(w, S.cine);
  $("#cine").hidden = false; document.body.classList.add("warmode");
  if (S.legendHTML == null) S.legendHTML = $("#legend").innerHTML;
  if (story()) await openChapter(chap ?? chapterForTime(evTime(w.events[S.wIdx] || {})));
  else await goWarEvent(S.wIdx, true);
}
async function goWarEvent(i, fit, keepPlay) {
  const w = S.war; if (!w) return;
  if (story()) {
    const e = w.events[Math.max(0, Math.min(w.events.length - 1, i))], te = evTime(e), C = S.cine.chapters;
    let n = C.findIndex((c) => c.t0 - 0.01 <= te && te <= c.t1 + 0.01 && inChapter(e.lonlat, c));
    if (n < 0) n = chapterForTime(te);
    const ok = inChapter(e.lonlat, C[n]);
    return openChapter(n, { t: Math.min(C[n].t1, Math.max(C[n].t0, te)), wIdx: ok ? w.events.indexOf(e) : undefined, keepPlay });
  }
  S.wIdx = Math.max(0, Math.min(w.events.length - 1, i));
  const e = w.events[S.wIdx];
  const K = S.cineK;
  S.wp = e ? K.P[S.wIdx + 1] : 0; S.wt = e ? K.T[S.wIdx + 1] : K.t0;
  S.subAt = performance.now();
  S.warMap = null;
  await go(warYear(S.wt), { keepWar: true });
  if (S.war !== w) return;
  S.warMap = warSides(w, warT());
  renderWarChart(); updateHud(); draw(); renderCol(true); writeHash();
  if (fit && S.cine?.shots?.length) { S.shotIdx = -1; camFor(S.wt, e, true); }
  else if (fit && w.events.length) { // frame all the war's events
    const pts = w.events.filter((x) => x.lonlat).map((x) => projection(x.lonlat));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const pad = 20;
    flyTo([[Math.min(...xs) - pad, Math.min(...ys) - pad], [Math.max(...xs) + pad, Math.max(...ys) + pad]], 7);
    S.shotIdx = -1;
  } else camFor(S.wt, e, true);
}
function exitWar() {
  stopPlay();
  S.war = null; S.warMap = null; S.cine = null; S.view = "world"; S.tstory = null;
  $("#cine").hidden = true; document.body.classList.remove("warmode");
  if (S.legendHTML != null) $("#legend").innerHTML = S.legendHTML;
  S.win = null; updateWindow(); computeFeatured(); draw(); updateChartCursor(); renderCol(true); writeHash();
}
function renderWarChart() {
  S.chartKind = null;
  $("#chartSub").textContent = story() ? "Each card is a chapter · click one to open it" : "Each mark is an event · drag across the chart to travel";
  const w = S.war, el = $("#chart"), t0 = w.span[0], t1 = w.span[1] + 1;
  const X = (S.warX = (t) => (100 * (t - t0)) / Math.max(1, t1 - t0));
  const years = []; for (let y = w.span[0]; y <= w.span[1]; y++) years.push(y);
  const step = Math.max(1, Math.ceil(years.length / 12));
  const C = S.cine;
  $("#legend").innerHTML = w.sides.map((sd, i) => `<span><i class="sw" style="background:${sideTint(i)};outline:1.5px solid ${SIDE_COLORS[i % SIDE_COLORS.length]};outline-offset:-1.5px"></i>${esc(sd.name)}</span>`).join("")
    + `<span><i class="sw unknown"></i>Not in the war</span>`
    + (C ? `<span class="wl"><i class="occ"></i>Occupied (occupier's colour)</span><span class="wl"><i class="fl"></i>Front line</span>${SHOW_ARROWS ? `<span class="wl"><i class="ar"></i>Offensive</span>` : ""}<span class="wl"><i class="bt"></i>Battle under way</span>` : "");
  if (story()) {
    el.classList.add("story");
    el.innerHTML = `<div class="wchap">${S.cine.chapters.map((c, i) => `<button type="button" data-chap="${i}" class="${i === S.chap ? "on" : ""}" aria-label="Chapter ${i + 1}: ${esc(c.title)}"><canvas data-thumb="${i}" width="300" height="180" aria-hidden="true"></canvas><b>${i + 1} · ${esc(chapRange(c, true))}</b><span>${esc(c.title)}</span></button>`).join("")}</div>`;
    $("#chartTitle").innerHTML = `${esc(w.name)} · ${esc(w.dateLabel || "")} <button class="exitj wspeed" data-act="war-speed" aria-label="Playback speed">${S.cineSpeed || 1}×</button> <button class="exitj" data-act="exit-war" aria-label="Exit war">× Exit</button>`;
    // no stage thumbnails: the bar names the stages instead, and the thumbnails held a canvas per stage of every war opened
    return;
  }
  el.classList.remove("story");
  el.innerHTML = `<div class="warbar">${years.map((y, i) => `<span class="wy${i % 2 ? " alt" : ""}" style="left:${X(y)}%;width:${X(y + 1) - X(y)}%">${(i % step === 0) ? shortYear(y) : ""}</span>`).join("")}</div>
    <div class="wmarks">${w.events.map((e, i) => `<button class="mk ev wk-${esc(e.kind || "other")}${i === S.wIdx ? " on" : ""}" data-wev="${i}" style="left:${X(evTime(e))}%" aria-label="${esc(e.label || shortYear(e.year))}: ${esc(e.text)}"><span class="tipm">${esc(e.label || shortYear(e.year))} · ${esc(e.text)}</span></button>`).join("")}</div>
    <div class="wcur" style="left:${X(S.wt ?? t0)}%"></div>
    <div class="wnow"><b>${S.wIdx + 1}</b> / ${w.events.length} · ${esc(w.events[S.wIdx]?.label || "")}</div>`;
  $("#chartTitle").innerHTML = `${esc(w.name)} · ${esc(w.dateLabel || `${shortYear(w.span[0])}–${shortYear(w.span[1])}`)} <button class="exitj wspeed" data-act="war-speed" aria-label="Playback speed">${S.cineSpeed || 1}×</button> <button class="exitj" data-act="exit-war" aria-label="Exit war">× Exit</button>`;
}

// ---------------------------------------------------------------- war cinema
// Continuous playback: a clock (S.wt, fractional year) drives the borders, front lines, occupied areas, offensive
// arrows, battle markers, subtitles and the camera. Layers come from content/cinema/<war>.json; wars without one
// still get the clock, subtitles and a camera that follows the events.
const warYear = (t) => { // which year's borders to show; a war can override (e.g. 1917 borders until Brest-Litovsk)
  const w = S.war, o = (S.cine?.baseYears || []).find((b) => fracDate(b.start) <= t && t <= fracDate(b.end));
  return o ? o.year : Math.max(w.span[0], Math.min(w.span[1], Math.floor(t + 1e-9)));
};
function cineKnots(w, C) { // playback seconds <-> war time; half real time, half evenly spaced events (busy months play slower)
  const ev = w.events.map(evTime), n = ev.length;
  for (let i = 0; i < n;) { // events known only to the year: spread them through that year so the clock still moves
    let j = i; while (j < n && ev[j] === ev[i] && !/^\d{3,4}-\d{2}/.test(w.events[j].date || "")) j++;
    if (j - i > 1 && Number.isInteger(ev[i])) for (let q = i; q < j; q++) ev[q] = ev[i] + (0.9 * (q - i + 0.5)) / (j - i);
    i = Math.max(j, i + 1);
  }
  const t0 = C ? Math.min(fracDate(C.start), n ? ev[0] - 0.02 : Infinity) : Math.max(w.span[0], (n ? ev[0] : w.span[0]) - 0.08);
  const t1 = C ? fracDate(C.end) + 0.02 : Math.min(w.span[1] + 1, (n ? ev[n - 1] : w.span[1]) + 0.2);
  const D = Math.max(40, Math.min(110, 24 + 2.4 * n));
  const T = [t0], P = [0];
  ev.forEach((t, i) => {
    const tt = Math.max(T[T.length - 1], Math.min(t1, t));
    T.push(tt); P.push(Math.max(P[P.length - 1] + 0.9, D * (0.5 * (tt - t0) / Math.max(1e-6, t1 - t0) + 0.5 * (i + 0.5) / n)));
  });
  T.push(t1); P.push(Math.max(D, P[P.length - 1] + 2));
  return { T, P, D: P[P.length - 1], t0, t1 };
}
const pOf = (K, t) => { for (let i = 0; i < K.T.length - 1; i++) if (t <= K.T[i + 1]) { const a = K.T[i], b = K.T[i + 1]; return b > a ? K.P[i] + ((K.P[i + 1] - K.P[i]) * (Math.max(a, t) - a)) / (b - a) : K.P[i + 1]; } return K.D; };
const tOf = (K, p) => { for (let i = 0; i < K.P.length - 1; i++) if (p <= K.P[i + 1]) { const a = K.P[i], b = K.P[i + 1]; return b > a ? K.T[i] + ((K.T[i + 1] - K.T[i]) * (Math.max(a, p) - a)) / (b - a) : K.T[i + 1]; } return K.t1; };

function resample(pts, n, closed) { // n points evenly spaced along a line or ring (lon/lat)
  const P = pts.map((p) => [p[0], p[1]]);
  if (closed && P.length > 2 && P[0][0] === P[P.length - 1][0] && P[0][1] === P[P.length - 1][1]) P.pop();
  if (closed) P.push(P[0]);
  const L = [0];
  for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot((P[i][0] - P[i - 1][0]) * Math.cos((P[i][1] * Math.PI) / 180), P[i][1] - P[i - 1][1]));
  const tot = L[L.length - 1] || 1, out = [], m = closed ? n : n - 1;
  for (let s = 0, j = 0; s < n; s++) {
    const d = (s / m) * tot;
    while (j < L.length - 2 && L[j + 1] < d) j++;
    const u = (d - L[j]) / (L[j + 1] - L[j] || 1);
    out.push([P[j][0] + (P[j + 1][0] - P[j][0]) * u, P[j][1] + (P[j + 1][1] - P[j][1]) * u]);
  }
  return out;
}
const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const sArea = (r) => r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
function alignTo(pts, prev, closed) { // match point order to the previous keyframe so shapes morph instead of twisting
  if (!prev) return pts;
  if (!closed) return d2(pts[0], prev[0]) + d2(pts[pts.length - 1], prev[prev.length - 1]) > d2(pts[0], prev[prev.length - 1]) + d2(pts[pts.length - 1], prev[0]) ? pts.slice().reverse() : pts;
  let r = Math.sign(sArea(pts)) !== Math.sign(sArea(prev)) ? pts.slice().reverse() : pts;
  let best = 0, bestD = Infinity;
  for (let o = 0; o < r.length; o++) { let s = 0; for (let j = 0; j < r.length; j++) s += d2(r[(j + o) % r.length], prev[j]); if (s < bestD) { bestD = s; best = o; } }
  return r.map((_, j) => r[(j + best) % r.length]);
}
function smoothLL(pts) { // Catmull-Rom through the path's points
  if (pts.length < 3) return pts.map((p) => [p[0], p[1]]);
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let s = 0; s < 10; s++) {
      const u = s / 10, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u3)));
    }
  }
  out.push([pts[pts.length - 1][0], pts[pts.length - 1][1]]);
  return out;
}
async function loadCinema(w) {
  if (!w.cinema) return null;
  if (w._cine) return w._cine;
  const c = await fetchJSON(`data/cinema/${encodeURIComponent(w.id)}.json`);
  const prep = (x, closed) => {
    let prev = null;
    x.keys = (x.keys || []).map((k) => { const pts = alignTo(resample(k.line || k.coords, closed ? 192 : 128, closed), prev, closed); prev = pts; return { t: fracDate(k.date), pts }; });
    x.tEnd = x.end ? fracDate(x.end) : null;
  };
  (c.fronts = c.fronts || []).forEach((f) => prep(f, false));
  (c.occupations = c.occupations || []).forEach((o) => prep(o, true));
  (c.arrows = c.arrows || []).forEach((a) => { a.t0 = fracDate(a.start); a.t1 = Math.max(fracDate(a.end), a.t0 + 0.02); a.smooth = smoothLL(a.path); });
  (c.battles = c.battles || []).forEach((b) => { b.t0 = fracDate(b.start); b.t1 = Math.max(fracDate(b.end || b.start), b.t0 + 0.03); });
  c.shots = (c.shots || []).map((s) => ({ ...s, t: fracDate(s.date) })).sort((a, b) => a.t - b.t);
  (c.chapters = c.chapters || []).forEach((ch) => { ch.t0 = fracDate(ch.start); ch.t1 = fracDate(ch.end); ch.arrowSet = new Set(ch.arrows || []); });
  return (w._cine = c);
}
function trackAt(x, t, holdTo) { // interpolated shape of a front or occupied area at time t, with fade in/out
  const k = x.keys, FADE = 0.05;
  if (!k.length || t < k[0].t - FADE) return null;
  const end = x.tEnd ?? holdTo;
  if (t > end + FADE) return null;
  const a = t < k[0].t ? 1 - (k[0].t - t) / FADE : t > end ? 1 - (t - end) / FADE : 1;
  if (t <= k[0].t) return { pts: k[0].pts, a };
  if (t >= k[k.length - 1].t) return { pts: k[k.length - 1].pts, a };
  let i = 0; while (k[i + 1].t < t) i++;
  const u = (t - k[i].t) / (k[i + 1].t - k[i].t), A = k[i].pts, B = k[i + 1].pts;
  return { pts: A.map((p, j) => [p[0] + (B[j][0] - p[0]) * u, p[1] + (B[j][1] - p[1]) * u]), a };
}
const tintCache = new Map();
function sideTint(i) { // territory fill: the side colour softened toward the background, so movement on top reads first
  const c = SIDE_COLORS[i % SIDE_COLORS.length], bg = String(theme.bg).trim(), key = c + bg;
  if (!tintCache.has(key)) {
    const p = (h) => [1, 3, 5].map((j) => parseInt(h.slice(j, j + 2), 16)), A = p(c), B = /^#[0-9a-f]{6}$/i.test(bg) ? p(bg) : [255, 255, 255];
    tintCache.set(key, "#" + A.map((v, j) => Math.round(v * 0.45 + B[j] * 0.55).toString(16).padStart(2, "0")).join(""));
  }
  return tintCache.get(key);
}
const occPat = new Map();
function occPattern(c) {
  if (!occPat.has(c)) {
    const cv = document.createElement("canvas"); cv.width = cv.height = 8;
    const x = cv.getContext("2d"); x.strokeStyle = c; x.lineWidth = 1.2;
    x.beginPath(); x.moveTo(0, 8); x.lineTo(8, 0); x.moveTo(-1, 1); x.lineTo(1, -1); x.moveTo(7, 9); x.lineTo(9, 7); x.stroke();
    occPat.set(c, ctx.createPattern(cv, "repeat"));
  }
  return occPat.get(c);
}
function drawOccupations() { // inside the map transform: occupied land takes the occupier's tint (fine stripes mark it as occupied)
  const C = S.cine; if (!S.war || !C || !C.occupations.length) return;
  const t = S.wt, k = S.t.k, M = ctx.getTransform();
  // Occupied ground is anyone's land but the occupier's own (enemy, neutral or unrecorded): draw each side's areas on
  // an offscreen layer, erase that side's own states from it, gather the sides on one layer, keep only land, and lay it
  // on the map. While the map moves (playback, pan, zoom) the layers are half resolution; at rest they are full.
  const sc = S.cinePlay || S.zooming ? 0.5 : 1;
  const W = Math.ceil(canvas.width * sc), H = Math.ceil(canvas.height * sc);
  const L = S.occLayer || (S.occLayer = document.createElement("canvas")), A = S.occAll || (S.occAll = document.createElement("canvas"));
  for (const c of [L, A]) if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
  const lc = L.getContext("2d"), ac = A.getContext("2d");
  const Ms = new DOMMatrix([M.a * sc, M.b * sc, M.c * sc, M.d * sc, M.e * sc, M.f * sc]);
  const inv = M.inverse(), c0 = inv.transformPoint(new DOMPoint(0, 0)), c1 = inv.transformPoint(new DOMPoint(canvas.width, canvas.height));
  const vx0 = Math.min(c0.x, c1.x), vx1 = Math.max(c0.x, c1.x), vy0 = Math.min(c0.y, c1.y), vy1 = Math.max(c0.y, c1.y); // the view, in projected units
  const ring = (pts) => { // projected path and its bounding box
    const q = new Path2D(); let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pts.forEach((p, i) => { const [x, y] = projection(p); i ? q.lineTo(x, y) : q.moveTo(x, y); if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; });
    q.closePath(); q.off = x1 < vx0 || x0 > vx1 || y1 < vy0 || y0 > vy1; return q;
  };
  const chx = story() ? S.cine.chapters[S.chap] : null;
  const sides = [...new Set(C.occupations.map((o) => o.side ?? 1))];
  // Masks that depend only on the view and the borders (not on war time) are cached, so playback with a still camera
  // only repaints the areas: land (where occupation may show) and, per side, that side's own states (erased).
  // A mask is drawn once for a reference view (with a margin while the map moves) and reused, shifted and scaled, until
  // the view leaves the margin, the zoom changes by more than a third, or the borders change.
  const P = sc < 1 ? Math.round(Math.max(W, H) / 2) : 0, vk = `${W}x${H}`;
  const blit = (x, key, paint) => {
    const cache = S.occMasks || (S.occMasks = new Map());
    let m = cache.get(key + vk);
    const R = m && Ms.multiply(m.ref.inverse()), ri = R && R.inverse();
    const ok = m && m.items === S.items && R.a > 0.75 && R.a < 1.33 && [[0, 0], [W, H]].every(([px, py]) => {
      const q = ri.transformPoint(new DOMPoint(px, py)); return q.x >= -m.P - 1 && q.y >= -m.P - 1 && q.x <= W + m.P + 1 && q.y <= H + m.P + 1;
    });
    if (!ok) {
      if (cache.size > 5) cache.clear();
      const cv = m?.cv || document.createElement("canvas"); cv.width = W + 2 * P; cv.height = H + 2 * P;
      const c = cv.getContext("2d"); c.setTransform(new DOMMatrix().translate(P, P).multiply(Ms)); c.fillStyle = "#000"; paint(c);
      m = { items: S.items, cv, ref: Ms, P }; cache.set(key + vk, m);
    }
    x.setTransform(ok ? R : new DOMMatrix()); x.drawImage(m.cv, -m.P, -m.P); x.setTransform(1, 0, 0, 1, 0, 0);
  };
  let drew = false;
  ac.setTransform(1, 0, 0, 1, 0, 0); ac.clearRect(0, 0, W, H);
  for (const side of sides) {
    let any = false;
    for (const o of C.occupations) {
      if ((o.side ?? 1) !== side) continue;
      const s = trackAt(o, t, S.cineK.t1); if (!s) continue;
      const path = ring(s.pts); if (path.off) continue; // nothing of it on screen
      if (!any) { lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, W, H); lc.setTransform(Ms); any = true; }
      const ch = chx && s.pts.some((q) => inBox(q, chx.bbox)) ? chx : null, s0 = ch ? trackAt(o, ch.t0, S.cineK.t1) : null;
      if (ch) { // new ground in the occupier's full colour, ground already held at the chapter's start in its tint
        lc.globalAlpha = 0.62 * s.a; lc.fillStyle = SIDE_COLORS[side % SIDE_COLORS.length]; lc.fill(path);
        if (s0) { lc.save(); lc.clip(path); lc.globalAlpha = s.a; lc.fillStyle = sideTint(side); lc.fill(ring(s0.pts)); lc.restore(); }
      } else { lc.globalAlpha = s.a; lc.fillStyle = sideTint(side); lc.fill(path); }
      const pat = occPattern(SIDE_COLORS[side % SIDE_COLORS.length]); pat.setTransform(new DOMMatrix().scale(1 / k));
      lc.globalAlpha = 0.35 * s.a; lc.fillStyle = pat; lc.fill(path);
    }
    if (!any) continue;
    const own = S.items.filter((it) => it.kind === "state" && warSideOf(it) === side);
    const ownKey = own.map((it) => S.items.indexOf(it)).join(".");
    lc.globalAlpha = 1; lc.globalCompositeOperation = "destination-out";
    blit(lc, `own${side}|${ownKey}|`, (x) => { for (const it of own) x.fill(pathOf(it.f)); });
    lc.globalCompositeOperation = "source-over";
    ac.drawImage(L, 0, 0); drew = true;
  }
  if (!drew) return;
  ac.globalCompositeOperation = "destination-in"; blit(ac, "land|", (x) => x.fill(S.landClip)); // land only
  ac.globalCompositeOperation = "source-over";
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(A, 0, 0, canvas.width, canvas.height); ctx.restore();
  ctx.globalAlpha = 1;
}
const scr = (ll) => { const [x, y] = projection(ll); return [S.t.applyX(x), S.t.applyY(y)]; };
function polyLine(pts) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); }
function arrowState(a, t, keep) { // drawn fraction and opacity of an offensive arrow at time t (keep: never fade)
  if (t < a.t0) return null;
  const after = t - a.t1, alpha = keep || after <= 0.03 ? 1 : 1 - (after - 0.03) / 0.07;
  if (alpha <= 0) return null;
  const prog = Math.min(1, (t - a.t0) / (a.t1 - a.t0));
  return { prog, e: 1 - (1 - prog) ** 2, alpha };
}
function drawCinema() { // screen space, above the labels: fronts, offensives, battles
  drawFlash();
  const C = S.cine; if (!S.war || !C) return;
  const t = S.wt, k = S.t.k, K = S.cineK, now = performance.now();
  ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round";
  // front lines: one thin dark line where the two sides meet
  for (const f of C.fronts) {
    const last = f.keys[f.keys.length - 1]?.t ?? 0;
    const s = trackAt(f, t, last >= K.t1 - 0.06 ? K.t1 : last + 0.1); if (!s) continue;
    const chx = story() ? S.cine.chapters[S.chap] : null, here = !chx || s.pts.some((q) => inBox(q, chx.bbox)), ch = here ? chx : null;
    const g = ch && t > ch.t0 + 0.01 ? trackAt(f, ch.t0, frontHold(f)) : null;
    if (g) { polyLine(g.pts.map(scr)); ctx.setLineDash([5, 4]); ctx.globalAlpha = 0.55; ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]); }
    polyLine(s.pts.map(scr));
    const fa = here ? s.a : 0.3 * s.a; // fronts outside the chapter's place stay faint
    ctx.globalAlpha = 0.7 * fa; ctx.strokeStyle = theme.bg; ctx.lineWidth = 4; ctx.stroke();
    ctx.globalAlpha = fa; ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.8; ctx.stroke();
  }
  // offensives: tapered arrows in the side's full colour, growing while the campaign runs (off: SHOW_ARROWS)
  const chA = story() ? S.cine.chapters[S.chap].arrowSet : null;
  for (const a of SHOW_ARROWS ? C.arrows : []) {
    if (chA && !chA.has(a.name)) continue;
    const st = arrowState(a, t, !!chA); if (!st) continue;
    const P = a.smooth.map(scr), seg = [0];
    for (let i = 1; i < P.length; i++) seg.push(seg[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const want = seg[seg.length - 1] * st.e; if (want < 6) continue;
    const pts = [P[0]];
    for (let i = 1; i < P.length; i++) {
      if (seg[i] <= want) { pts.push(P[i]); continue; }
      const u = (want - seg[i - 1]) / (seg[i] - seg[i - 1]); pts.push([P[i - 1][0] + (P[i][0] - P[i - 1][0]) * u, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * u]); break;
    }
    const W = Math.min(11, 4 + k * 0.45), hl = W * 1.9, tip = pts[pts.length - 1];
    let back = pts[0]; for (let i = pts.length - 1; i >= 0; i--) if (Math.hypot(tip[0] - pts[i][0], tip[1] - pts[i][1]) > hl) { back = pts[i]; break; }
    const ang = Math.atan2(tip[1] - back[1], tip[0] - back[0]);
    const body = pts.filter((p) => Math.hypot(tip[0] - p[0], tip[1] - p[1]) > hl * 0.8);
    const neck = [tip[0] - Math.cos(ang) * hl * 0.8, tip[1] - Math.sin(ang) * hl * 0.8];
    body.push(neck);
    const L = [], R = [];
    body.forEach((p, i) => {
      const q = body[Math.min(body.length - 1, i + 1)], o = body[Math.max(0, i - 1)], dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1;
      const hw = (W / 2) * (0.25 + 0.75 * (i / Math.max(1, body.length - 1)));
      L.push([p[0] - (dy / d) * hw, p[1] + (dx / d) * hw]); R.push([p[0] + (dy / d) * hw, p[1] - (dx / d) * hw]);
    });
    ctx.beginPath();
    L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.lineTo(neck[0] - Math.sin(ang) * hl * 0.62, neck[1] + Math.cos(ang) * hl * 0.62);
    ctx.lineTo(tip[0], tip[1]);
    ctx.lineTo(neck[0] + Math.sin(ang) * hl * 0.62, neck[1] - Math.cos(ang) * hl * 0.62);
    for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath();
    ctx.globalAlpha = 0.92 * st.alpha; ctx.fillStyle = SIDE_COLORS[(a.side ?? 0) % SIDE_COLORS.length]; ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = theme.bg; ctx.stroke();
  }
  // battles: only while fought; a small burst with a short name (losses are listed under the date)
  const placed = [];
  ctx.globalAlpha = 1;
  for (const b of C.battles) {
    const chB = story() ? S.cine.chapters[S.chap] : null;
    if (chB && !inChapter(b.lonlat, chB)) continue;
    const over = chB && t > b.t1 && b.t1 >= chB.t0 - 0.01;
    if (t < b.t0 || (t > b.t1 && !over) || !b.lonlat) continue;
    const [x, y] = scr(b.lonlat), ph = (now / 1500) % 1;
    if (x < -20 || y < -20 || x > S.width + 20 || y > S.height + 20) continue;
    if (S.cinePlay && !over) { ctx.globalAlpha = 0.6 * (1 - ph); ctx.beginPath(); ctx.arc(x, y, 6 + 12 * ph, 0, 2 * Math.PI); ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.beginPath();
    for (let i = 0; i < 12; i++) { const r = i % 2 ? 2.6 : 6.5, a2 = (i * Math.PI) / 6; ctx.lineTo(x + Math.cos(a2) * r, y + Math.sin(a2) * r); }
    ctx.closePath(); ctx.fillStyle = theme.ink; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = theme.bg; ctx.stroke();
    const lab = b.name.replace(/\s*\(.*\)\s*$/, "").replace(/^(First|Second|Third)?\s*Battle of (the )?/i, (m, n) => (n ? n + " " : "")).replace(/^the /i, "");
    ctx.font = '700 11px Inter, sans-serif'; ctx.textBaseline = "middle";
    const w = ctx.measureText(lab).width;
    let lx = x + 10, box = [lx - 2, y - 8, lx + w + 2, y + 8];
    if (placed.some((q) => box[0] < q[2] && box[2] > q[0] && box[1] < q[3] && box[3] > q[1])) { lx = x - 10 - w; box = [lx - 2, y - 8, lx + w + 2, y + 8]; }
    if (placed.some((q) => box[0] < q[2] && box[2] > q[0] && box[1] < q[3] && box[3] > q[1])) continue;
    placed.push(box);
    ctx.textAlign = "left"; ctx.lineWidth = 3.5; ctx.strokeStyle = theme.bg; ctx.strokeText(lab, lx, y); ctx.fillStyle = theme.ink; ctx.fillText(lab, lx, y);
  }
  ctx.restore(); ctx.globalAlpha = 1;
  placeCallout();
}
// ---------------------------------------------------------------- war storyboard
// A war with chapters (content/cinema/<war>.json "chapters") plays as a storyboard. Each chapter frames one episode and
// shows only its own change: the front at its start (dashed) and end (solid), the ground that changed hands in strong
// colour, and the offensives that did it. Play animates a chapter, then moves on to the next.
const inBox = (ll, b) => !!ll && ll[0] >= b[0] && ll[0] <= b[2] && ll[1] >= b[1] && ll[1] <= b[3];
const story = () => !!(S.war && S.cine?.chapters?.length);
function boxBounds(b) { // projected (zoom-1) bounds of a lon/lat box
  const pts = []; for (let i = 0; i <= 4; i++) { const lo = b[0] + ((b[2] - b[0]) * i) / 4; pts.push(projection([lo, b[1]]), projection([lo, b[3]])); }
  return [[Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1]))], [Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]];
}
function chapterForTime(t) { // the chapter covering t, else the nearest one by its start
  const C = S.cine.chapters; let best = 0;
  C.forEach((c, i) => { if (Math.abs(c.t0 - t) < Math.abs(C[best].t0 - t)) best = i; });
  const inside = C.findIndex((c) => c.t0 - 0.01 <= t && t <= c.t1 + 0.01);
  return inside >= 0 ? inside : best;
}
const MON3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function chapRange(c, short) {
  const ym = (d) => { const m = String(d).match(/^(-?\d+)(?:-(\d{2}))?/); return [+m[1], m[2] ? +m[2] : 1]; }; // BCE dates start with "-"
  const [y0, m0] = ym(c.start), [y1, m1] = ym(c.end);
  if (y0 < 0 || y1 < 0) { const by = (y) => `${Math.abs(y)}${y < 0 ? " BCE" : ""}`; return y0 === y1 ? (m0 === m1 ? `${MON3[m0 - 1]} ${by(y0)}` : `${MON3[m0 - 1]}–${MON3[m1 - 1]} ${by(y0)}`) : short ? `${by(y0)}–${by(y1)}` : `${MON3[m0 - 1]} ${by(y0)} – ${MON3[m1 - 1]} ${by(y1)}`; }
  if (y0 === y1) return m0 === m1 ? `${MON3[m0 - 1]} ${y0}` : `${MON3[m0 - 1]}–${MON3[m1 - 1]} ${y0}`;
  return short ? `${y0}–${String(y1).slice(2)}` : `${MON3[m0 - 1]} ${y0} – ${MON3[m1 - 1]} ${y1}`;
}
const inChapter = (ll, ch) => inBox(ll, ch.bbox); // a chapter is one place: other fronts stay out
function eventAt(t) { // the last war event reached by t inside the current chapter (-1 if none yet)
  const ch = S.cine.chapters[S.chap]; let i = -1;
  S.war.events.forEach((e, j) => { const te = evTime(e); if (te >= ch.t0 - 0.01 && te <= t + 1e-6 && inChapter(e.lonlat, ch)) i = j; });
  return i;
}
const chapterEvents = (ch) => S.war.events.map((e, i) => ({ e, i, t: evTime(e) })).filter((x) => x.t >= ch.t0 - 0.01 && x.t <= ch.t1 + 0.01 && inChapter(x.e.lonlat, ch));
async function openChapter(n, opts = {}) {
  const C = S.cine; if (!C?.chapters?.length) return;
  n = Math.max(0, Math.min(C.chapters.length - 1, n));
  const ch = C.chapters[n];
  if (!opts.keepPlay) stopPlay();
  S.chap = n; S.wt = opts.t ?? ch.t1;
  S.wIdx = opts.wIdx ?? eventAt(S.wt); // -1 until the chapter's first event
  S.subAt = performance.now(); S.warMap = null;
  await go(warYear(S.wt), { keepWar: true });
  if (!story() || S.chap !== n) return;
  S.warMap = warSides(S.war, warT());
  renderWarChart(); updateHud(); draw(); renderCol(true); writeHash();
  flyTo(boxBounds(ch.bbox), 24, opts.fast ? 700 : 1400, hudInset());
}
function setStoryT(t) {
  S.wt = t;
  const i = eventAt(t);
  if (i !== S.wIdx) { S.wIdx = i; S.subAt = performance.now(); renderCol(); }
  const y = warYear(t);
  syncSides(S.cinePlay);
  if (y !== S.year && y !== S.cineYear) { S.cineYear = y; go(y, { keepWar: true }).then(() => { S.cineYear = null; }); }
  updateHud(); draw();
}
function playChapter(chain) { // animate the current chapter from its start; with chain, continue through the next ones
  const ch = S.cine.chapters[S.chap], n = S.chap;
  if (S.wt >= ch.t1 - 1e-4 || S.wt < ch.t0) setStoryT(ch.t0);
  const dur = 7 + 0.8 * ch.arrows.length; // seconds at 1x
  S.cinePlay = true; S.playing = -1; S.chain = chain; setPlayIcon(true);
  let last = 0;
  const tick = (now) => {
    if (!S.cinePlay || !story() || S.chap !== n) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    const t = Math.min(ch.t1, S.wt + (dt * (S.cineSpeed || 1) * (ch.t1 - ch.t0)) / dur);
    setStoryT(t);
    if (t < ch.t1) { S.cineRaf = requestAnimationFrame(tick); return; }
    S.cinePlay = false; draw();
    if (!S.chain || n >= S.cine.chapters.length - 1) return stopPlay();
    const sp = S.cineSpeed || 1;
    S.chainTimer = setTimeout(async () => {
      if (!S.playing) return;
      const next = S.cine.chapters[n + 1];
      await openChapter(n + 1, { t: next.t0, keepPlay: true });
      S.chainTimer = setTimeout(() => { if (S.playing && S.chap === n + 1) playChapter(true); }, 1500 / sp);
    }, 2200 / sp);
  };
  S.cineRaf = requestAnimationFrame(tick);
}
function placeCallout() { // the current event, pinned where it happened with a leader line
  const el = $("#cCall"), e = S.war?.events[S.wIdx];
  S.callPt = null;
  if (S.callOn && e?.lonlat) {
    const [x, y] = scr(e.lonlat);
    if (x > 8 && y > 8 && x < S.width - 8 && y < S.height - 8) {
      const w = el.offsetWidth, h = el.offsetHeight, gap = 54;
      const fl = freeBox().l;
      let left = x - gap - w;
      if (left < fl + 8) left = x + gap;
      if (left + w > S.width - 12) left = Math.max(12, x - gap - w);
      const top = Math.max(hudInset().top, Math.min(S.height - h - 44, y - h / 2));
      el.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
      S.callPt = { x, y, ax: left < x ? left + w : left, ay: Math.max(top + 10, Math.min(top + h - 10, y)) };
    }
  }
  el.classList.toggle("on", !!S.callPt);
  $("#cSub").classList.toggle("on", !!S.callOn && !S.callPt);
  if (!S.callPt) return;
  const { x, y, ax, ay } = S.callPt;
  ctx.save(); ctx.strokeStyle = theme.ink; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(x + (ax < x ? -10 : 10), ay); ctx.lineTo(x, y); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 2 * Math.PI); ctx.fillStyle = theme.highlight; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = theme.bg; ctx.stroke();
  ctx.restore();
}
const frontHold = (f) => { const last = f.keys[f.keys.length - 1]?.t ?? 0; return last >= S.cineK.t1 - 0.06 ? S.cineK.t1 : last + 0.1; };
async function drawThumbs() { // one small map per chapter: borders, occupied land, fronts and offensives at its end
  const C = S.cine, w = S.war; if (!C?.chapters?.length) return;
  if (!C._thumbs) {
    C._thumbs = [];
    for (const ch of C.chapters) {
      const y = Math.floor(ch.t1), chunk = await loadChunk(chunkOf(y));
      if (S.cine !== C) return;
      const feats = chunk.features.filter((f) => f.properties.f <= y && y <= f.properties.t).map((f) => correctFeature(f, y)).filter((f) => f && !f.properties.people);
      const cv = document.createElement("canvas"); cv.width = 300; cv.height = 180;
      const m = cv.getContext("2d"), b = ch.bbox, sm = warSides(w, ch.t1);
      const pj = d3.geoEquirectangular().fitExtent([[4, 4], [296, 176]], { type: "MultiPoint", coordinates: [[b[0], b[1]], [b[2], b[3]], [b[0], b[3]], [b[2], b[1]]] });
      const gp = d3.geoPath(pj, m), ring = (pts, close) => { m.beginPath(); pts.forEach((p, i) => { const [x, yy] = pj(p); i ? m.lineTo(x, yy) : m.moveTo(x, yy); }); if (close) m.closePath(); };
      m.fillStyle = theme.bg; m.fillRect(0, 0, 300, 180);
      for (const f of feats) { const sd = sm.has(f.properties.n) ? sm.get(f.properties.n) : sm.has(f.properties.k) ? sm.get(f.properties.k) : f.properties.fixed && sm.has(f.properties.fixed) ? sm.get(f.properties.fixed) : -1; m.fillStyle = sd >= 0 ? sideTint(sd) : theme.unknown; m.beginPath(); gp(f); m.fill(); }
      for (const o of C.occupations) { const s = trackAt(o, ch.t1, S.cineK.t1); if (!s) continue; ring(s.pts, true); m.globalAlpha = 0.45; m.fillStyle = SIDE_COLORS[(o.side ?? 1) % SIDE_COLORS.length]; m.fill(); m.globalAlpha = 1; }
      m.strokeStyle = theme.ink; m.lineWidth = 2; m.lineJoin = "round";
      for (const f of C.fronts) { const s = trackAt(f, ch.t1, frontHold(f)); if (s) { ring(s.pts); m.stroke(); } }
      for (const a of SHOW_ARROWS ? C.arrows : []) if (ch.arrowSet.has(a.name)) {
        m.strokeStyle = m.fillStyle = SIDE_COLORS[(a.side ?? 0) % SIDE_COLORS.length]; m.lineWidth = 5; ring(a.smooth); m.stroke();
        const P = a.smooth.map((p) => pj(p)), tip = P[P.length - 1], bk = P[Math.max(0, P.length - 4)], ang = Math.atan2(tip[1] - bk[1], tip[0] - bk[0]);
        m.beginPath(); m.moveTo(tip[0] + Math.cos(ang) * 6, tip[1] + Math.sin(ang) * 6); m.lineTo(tip[0] + Math.cos(ang + 2.4) * 11, tip[1] + Math.sin(ang + 2.4) * 11); m.lineTo(tip[0] + Math.cos(ang - 2.4) * 11, tip[1] + Math.sin(ang - 2.4) * 11); m.closePath(); m.fill();
      }
      C._thumbs.push(cv);
    }
  }
  document.querySelectorAll("#chart canvas[data-thumb]").forEach((c) => { const src = C._thumbs[+c.dataset.thumb]; if (src) c.getContext("2d").drawImage(src, 0, 0, c.width, c.height); });
}
function warHead(w, total, at) {
  return cardHead(backLabel("Stories"), `${at} of ${total}`) + progBar(at, total) + kick(`War · ${rangeText(w.span[0], w.span[1])}`)
    + `<h1 class="ttl l">${esc(w.name)}</h1>` + seg2([["story", "Story"], ["about", "About"]], S.wTab || "story", "wtab");
}
function warAboutHTML(w) {
  let h = "";
  if (w.summary) h += `<p class="prose">${esc(w.summary)}</p>`;
  if (w.casualties) h += `<div class="facts two"><div style="grid-column:1/-1"><span>What it cost</span><b>${esc(w.casualties)}</b></div></div>`;
  h += `<h3 class="sec">Sides in ${plainYear(S.year)}</h3><div class="wside-list">`;
  w.sides.forEach((sd, i) => {
    const act = sd.members.filter((x) => x.from <= S.year && S.year <= x.to).map((x) => displayName(x.clio));
    h += `<p><span class="sq" style="background:${SIDE_COLORS[i % SIDE_COLORS.length]}"></span><b>${esc(sd.name)}</b>${act.length ? `: ${esc([...new Set(act)].join(", "))}` : " <span class='note'>(not drawn on the map this year)</span>"}</p>`;
  });
  h += `</div>`;
  if (story()) h += `<h3 class="sec">On the map</h3><ul class="changed"><li><i class="ghost"></i>Front at the start of the stage</li><li><i class="solid"></i>Front at the end</li><li><i class="newg"></i>Ground taken during the stage</li></ul>`;
  if (S.cine?.note) h += `<p class="note">${esc(S.cine.note)}</p>`;
  return h + srcFold([...(w.sources || []), ...(S.cine?.sources || [])]);
}
const evPlace = (e) => [e.place, e.kind && e.kind !== "other" ? e.kind.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()) : ""].filter(Boolean).join(" · ");
function storyHTML() { // a war told stage by stage (its chapters)
  const w = S.war, C = S.cine, ch = C.chapters[S.chap], e = S.wIdx >= 0 ? w.events[S.wIdx] : null;
  markSeen("w", w.id, S.wIdx);
  let h = warHead(w, w.events.length, Math.max(0, S.wIdx + 1));
  if ((S.wTab || "story") === "about") return h + warAboutHTML(w);
  h += kick(`Stage ${S.chap + 1} of ${C.chapters.length} · ${esc(ch.title)}`, 1);
  if (e) {
    h += `<div class="stack"><p class="bigy s">${esc((e.label || shortYear(e.year)).replace(/\s*[–-]\s*/, " to "))}</p><h2 class="ttl s">${esc(e.text)}</h2>${evPlace(e) ? `<div class="placeline">${I.pin}${esc(evPlace(e))}</div>` : ""}</div>`;
    if (e.detail) h += `<p class="prose">${esc(firstSentences(e.detail, 3))}</p>`;
    h += mediaHTML(`war:${w.id}:${S.wIdx}`);
  } else h += `<div class="stack"><p class="bigy s">${esc(chapRange(ch))}</p><h2 class="ttl s">${esc(ch.title)}</h2></div><p class="prose">${esc(ch.text)}</p>`;
  const evs = chapterEvents(ch), k = evs.findIndex((x) => x.i === S.wIdx);
  const nextEv = k >= 0 ? evs[k + 1] : evs.find((x) => x.t > S.wt - 1e-6) || null;
  const prev = k > 0 ? `data-wev="${evs[k - 1].i}"` : S.chap > 0 ? `data-chap="${S.chap - 1}"` : "";
  const nc = C.chapters[S.chap + 1];
  const next = nextEv ? { attr: `data-wev="${nextEv.i}"`, small: `Next · ${nextEv.e.label || shortYear(nextEv.e.year)}`, title: nextEv.e.text }
    : nc ? { attr: `data-chap="${S.chap + 1}"`, small: `Next stage · ${chapRange(nc, true)}`, title: nc.title } : null;
  return h + navRow(prev, next);
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function updateHud() {
  const w = S.war; if (!w) return;
  const t = S.wt, y = warYear(t), monthly = t >= 0 && w.span[1] - w.span[0] < 40 && w.events.some((e) => /^\d{4}-\d{2}/.test(e.date || ""));
  $("#cMonth").textContent = monthly ? MONTHS[Math.max(0, Math.min(11, Math.floor((t - Math.floor(t)) * 12)))] : "";
  $("#cYear").textContent = shortYear(Math.floor(t + 1e-9)); // the real year, even when another year's borders are shown
  const shots = S.cine?.shots || [];
  const ch = story() ? S.cine.chapters[S.chap] : null;
  let sh = null; if (!ch) for (const s of shots) if (s.t <= t + 1e-6) sh = s;
  $("#cShot").textContent = ch ? ch.title : sh?.caption || "";
  const C = S.cine, now = [];
  if (C) {
    for (const a of SHOW_ARROWS ? C.arrows : []) { const st = arrowState(a, t); if (st && st.prog < 1) now.push(`<span><i class="ar" style="background:${SIDE_COLORS[(a.side ?? 0) % SIDE_COLORS.length]}"></i>${esc(a.name)}</span>`); }
    for (const b of C.battles) if (t >= b.t0 && t <= b.t1) now.push(`<span><i class="bt"></i><b>${esc(b.name)}</b>${b.casualties ? ` · ${esc(b.casualties)}` : ""}</span>`);
  }
  const nowHTML = now.slice(0, 4).join("");
  const nl = $("#cNow"); if (nl.dataset.h !== nowHTML) { nl.innerHTML = nowHTML; nl.dataset.h = nowHTML; }
  const e = w.events[S.wIdx], te = e ? evTime(e) : 0;
  const reached = e && (ch ? te >= ch.t0 - 0.01 && te <= t + 1e-6 && inChapter(e.lonlat, ch) : S.cineK.T[S.wIdx + 1] <= t + 1e-6);
  const show = reached && (!S.cinePlay || performance.now() - S.subAt < 6500);
  $("#cThe").textContent = ch ? `Chapter ${S.chap + 1} of ${S.cine.chapters.length} · ${chapRange(ch)}` : "";
  S.callOn = !!(show && e?.lonlat && S.cine);
  const call = $("#cCall"), ck = `${w.id}:${S.wIdx}`;
  if (S.callOn && call.dataset.k !== ck) { call.innerHTML = `<b>${esc(e.label || shortYear(e.year))}</b>${esc(e.text)}`; call.dataset.k = ck; }
  const sub = $("#cSub");
  if (show) { const html = `<b>${esc(e.label || shortYear(e.year))}</b>${esc(e.text)}`; if (sub.dataset.k !== `${w.id}:${S.wIdx}`) { sub.innerHTML = html; sub.dataset.k = `${w.id}:${S.wIdx}`; } }
  sub.classList.toggle("on", !!show && !S.callPt);
  const cur = $("#chart .wcur"); if (cur && S.warX) cur.style.left = S.warX(t) + "%";
}
function flyCenter(ll, k, ms = 1800) {
  if (!S.width) return;
  const [x, y] = projection(ll), f = freeBox(); k = Math.max(1, Math.min(24, k));
  d3.select(canvas).transition().duration(ms).ease(d3.easeCubicInOut)
    .call(S.zoom.transform, d3.zoomIdentity.translate((f.l + f.r) / 2 - k * x, (f.t + f.b) / 2 - k * y).scale(k));
}
const shotK = (z) => 2 ** (z - 1); // web-map-style shot zoom: 1 = whole world, each level doubles (3 = a continent, 5 = a front)
function camFor(t, e, jump) { // follow the action: the latest camera shot, else keep the current event in view
  const shots = S.cine?.shots || [];
  if (shots.length) {
    let i = -1; shots.forEach((s, j) => { if (s.t <= t + 1e-6) i = j; });
    if (i >= 0 && (jump || i > S.shotIdx)) { S.shotIdx = i; flyCenter(shots[i].center, shotK(shots[i].zoom || 3), jump ? 1100 : 2200); }
    return;
  }
  if (!e?.lonlat) return;
  const [x, y] = scr(e.lonlat);
  const f = freeBox(), mx = (f.r - f.l) * 0.12, my = (f.b - f.t) * 0.12;
  if (x < f.l + mx || x > f.r - mx || y < f.t + my || y > f.b - my) flyCenter(e.lonlat, Math.max(S.t.k, 2), 1500);
}
function setWp(p, playing) {
  const w = S.war, K = S.cineK; if (!w) return;
  S.wp = Math.max(0, Math.min(K.D, p)); S.wt = tOf(K, S.wp);
  let i = 0; for (let j = 0; j < w.events.length; j++) if (K.P[j + 1] <= S.wp + 1e-9) i = j;
  if (i !== S.wIdx) {
    S.wIdx = i; S.subAt = performance.now();
    renderCol(true); writeHash();
    document.querySelectorAll("#chart .wmarks .mk").forEach((m, j) => m.classList.toggle("on", j === i));
    const now = $("#chart .wnow"); if (now) now.innerHTML = `<b>${i + 1}</b> / ${w.events.length} · ${esc(w.events[i]?.label || "")}`;
    if (playing && !S.cine?.shots?.length) camFor(S.wt, w.events[i], false);
  }
  if (playing && S.cine?.shots?.length) camFor(S.wt, null, false);
  const y = warYear(S.wt);
  syncSides(playing);
  if (y !== S.year && y !== S.cineYear) { S.cineYear = y; go(y, { keepWar: true }).then(() => { S.cineYear = null; }); }
  updateHud(); draw();
}
function allianceChange(a, b, t) { // who entered or left the war between two side maps (banner + flash)
  const w = S.war, msgs = [], keys = new Set();
  const y1 = Math.floor(t), when = t >= 0 && w.span[1] - w.span[0] < 40 ? `${MONTHS[Math.max(0, Math.min(11, Math.floor((t - y1) * 12)))]} ${y1}` : shortYear(y1);
  const named = (ks) => { const u = [...new Set(ks.map(displayName))]; return u.length > 3 ? `${u.slice(0, 3).join(", ")} and ${u.length - 3} more` : u.join(", "); };
  const STOP = /^(the|of|and|empire|kingdom|republic|state|states|union|federal|people's|democratic|united|first|second|third|grand|duchy|principality|socialist|soviet)$/i;
  const words = (k) => new Set(clean(k).split(/[\s,()-]+/).filter((x) => x.length > 3 && !STOP.test(x)));
  w.sides.forEach((sd, i) => {
    let inn = [...b].filter(([k, s]) => s === i && !a.has(k)).map(([k]) => k);
    let out = [...a].filter(([k, s]) => s === i && !b.has(k)).map(([k]) => k);
    // a state redrawn under a new name (Russian Empire -> Russian Republic) is neither joining nor leaving
    const same = (x, y) => { const A = words(x); return [...words(y)].some((q) => A.has(q)); };
    const renamed = new Set(); inn.forEach((x) => out.forEach((y) => { if (same(x, y)) { renamed.add(x); renamed.add(y); } }));
    inn = inn.filter((x) => !renamed.has(x)); out = out.filter((x) => !renamed.has(x));
    if (inn.length) { msgs.push(`<span><i style="background:${SIDE_COLORS[i % SIDE_COLORS.length]}"></i>${esc(named(inn))} ${inn.length > 1 ? "join" : "joins"} the ${esc(sd.name)}</span>`); inn.forEach((k) => keys.add(k)); }
    if (out.length) msgs.push(`<span class="out"><i style="background:${SIDE_COLORS[i % SIDE_COLORS.length]}"></i>${esc(named(out))}: out of the war</span>`);
  });
  if (!msgs.length) return;
  const el = $("#cJoin"); el.innerHTML = `<b>${esc(when)}</b>${msgs.join("")}`; el.classList.add("on");
  clearTimeout(S.joinTimer); S.joinTimer = setTimeout(() => el.classList.remove("on"), 4200 / (S.cineSpeed || 1));
  S.flash = { keys, at: performance.now() };
}
function drawFlash() { // outline states that just joined, pulsing for a few seconds (map space)
  const f = S.flash; if (!S.war || !f) return;
  const age = (performance.now() - f.at) / 3200; if (age > 1 || !S.cinePlay) return;
  const { t } = S;
  ctx.save(); ctx.translate(t.x, t.y); ctx.scale(t.k, t.k); ctx.lineJoin = "round";
  ctx.globalAlpha = (1 - age) * (0.55 + 0.45 * Math.sin(age * Math.PI * 6) ** 2);
  ctx.strokeStyle = theme.ink; ctx.lineWidth = 3.2 / t.k;
  for (const it of S.items) if (it.kind === "state" && (f.keys.has(it.p.n) || f.keys.has(it.p.k))) strokeItem(ctx, it);
  ctx.restore(); ctx.globalAlpha = 1;
}
function cineTick(now) {
  if (!S.cinePlay || !S.war) return;
  const dt = S.cineLast ? Math.min(0.1, (now - S.cineLast) / 1000) : 0; S.cineLast = now;
  const p = S.wp + dt * (S.cineSpeed || 1);
  if (p >= S.cineK.D) { setWp(S.cineK.D, true); return stopPlay(); }
  setWp(p, true);
  S.cineRaf = requestAnimationFrame(cineTick);
}

function warHTML() {
  if (story()) return storyHTML();
  const w = S.war, e = w.events[S.wIdx];
  markSeen("w", w.id, S.wIdx);
  let h = warHead(w, w.events.length, S.wIdx + 1);
  if ((S.wTab || "story") === "about") return h + warAboutHTML(w);
  if (e) {
    h += `<div class="stack"><p class="bigy s">${esc(e.label || shortYear(e.year))}</p><h2 class="ttl s">${esc(e.text)}</h2>${evPlace(e) ? `<div class="placeline">${I.pin}${esc(evPlace(e))}</div>` : ""}</div>`;
    if (e.detail) h += `<p class="prose">${esc(firstSentences(e.detail, 3))}</p>`;
    h += mediaHTML(`war:${w.id}:${S.wIdx}`);
  }
  const nx = w.events[S.wIdx + 1];
  return h + navRow(S.wIdx > 0 ? `data-wev="${S.wIdx - 1}"` : "", nx ? { attr: `data-wev="${S.wIdx + 1}"`, small: `Next · ${nx.label || shortYear(nx.year)}`, title: nx.text } : null);
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
  noteFrom();
  stopPlay();
  if (S.war) exitWar();
  S.sel = null; S.ghost = null; S.moment = null; S.journey = j; S.view = "journey"; S.jEvent = null; S.jOpen = new Set(); S.jTab = "story"; S.jKing = null;
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
  S.chartKind = null;
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
  $("#chartSub").textContent = "Territory over time, reigns below · drag across the chart to travel";
  S.jRendered = j.id;
}
function currentEvent(j, y) { let e = null; for (const x of j.events) if (x.year <= y) e = x; return e; }
function currentReign(j, y) { return j.reigns.find((r) => r.from <= y && y <= r.to) || null; }
const evText = (e) => { const m = String(e.text).match(/^(c\.\s?\d+(?:\s?BCE)?):\s*(.*)$/); return m ? { when: m[1], text: m[2] } : { when: null, text: e.text }; };
function reignOf(j, y) { // the reign covering y, else the nearest one
  if (!j.reigns.length) return -1;
  const i = j.reigns.findIndex((r) => r.from <= y && y <= r.to);
  if (i >= 0) return i;
  const dist = (r) => Math.min(Math.abs(r.from - y), Math.abs(r.to - y));
  let best = 0; j.reigns.forEach((r, k) => { if (dist(r) < dist(j.reigns[best])) best = k; });
  return best;
}
const jEventIdx = (j) => (S.jEvent != null ? S.jEvent : j.events.indexOf(currentEvent(j, S.year)));
const reignName = (r) => r.name.replace(/\s*\(r\..*?\)\s*/, "").replace(/\s*\(.*\)$/, "");
// A king, opened from his crown on the timeline: portrait (when the profile has one), reign, note, land won or lost, events.
function kingProfile(j, r) { // the empire profile's entry for this king, matched by name
  const prof = j.profile ? Object.values(S.content.byClio).find((e) => e.id === j.profile) : null;
  if (!prof?.rulers?.length) return {};
  const nm = reignName(r).toLowerCase();
  const i = prof.rulers.findIndex((x) => { const a = x.name.toLowerCase(); return a === nm || nm.startsWith(a + " ") || a.startsWith(nm + " ") || nm.startsWith(a + ","); });
  if (i < 0) return {};
  const m = S.media[`ruler:${prof.id}:${i}`]?.[0];
  return { note: prof.rulers[i].note, pic: m && m.caption.startsWith(prof.rulers[i].name) ? m : null };
}
function kingHTML(j) {
  const i = S.jKing, r = j.reigns[i], kp = kingProfile(j, r), n = j.reigns.length;
  const from = Math.max(r.from, j.span[0]), to = Math.min(r.to, j.span[1]), years = Math.max(1, r.to - r.from);
  const a0 = journeyArea(j, from), a1 = journeyArea(j, to);
  const evs = j.events.map((e, k) => ({ e, k })).filter((x) => reignOf(j, x.e.year) === i);
  let h = cardHead(j.name, `King ${i + 1} of ${n}`, "king-close") + kick(`King · ${esc(j.name)}`);
  if (kp.pic) { const cr = /^no machine-readable|^unknown/i.test(kp.pic.credit || "") || !kp.pic.credit ? "Wikimedia Commons" : short(kp.pic.credit.replace(/\s+/g, " "), 48);
    h += `<figure class="kpic"><img src="${safeUrl(kp.pic.image)}" alt="Portrait of ${esc(reignName(r))}"><figcaption><a href="${safeUrl(kp.pic.page)}" target="_blank" rel="noopener">${esc(cr)}</a> · ${esc(kp.pic.license || "")}</figcaption></figure>`; }
  h += `<div class="stack"><h1 class="ttl xl">${esc(reignName(r))}</h1><p class="sub" style="margin:0">Reigned ${rangeText(r.from, r.to)} · ${years} year${years > 1 ? "s" : ""}</p></div>`;
  if (kp.note) h += `<p class="prose">${esc(kp.note)}.</p>`.replace("..</p>", ".</p>");
  if (a0 || a1) {
    const ch = a0 ? Math.round((100 * (a1 - a0)) / a0) : null;
    h += `<div class="facts two"><div><span>Land when it began</span><b>${a0 ? `${mkm(a0)} million km²` : "Not drawn"}</b></div><div><span>Land when it ended</span><b>${a1 ? `${mkm(a1)} million km²` : "Not drawn"}</b>${ch != null && a1 ? `<em class="${ch > 0 ? "up" : ch < 0 ? "down" : ""}">${ch > 0 ? "+" : ""}${ch}% in this reign</em>` : ""}</div></div>`;
  }
  h += `<h3 class="sec">${evs.length ? `In this reign · ${evs.length} event${evs.length > 1 ? "s" : ""}` : "In this reign"}</h3>`;
  h += evs.length ? `<div class="lgroup">${evs.map(({ e, k }) => { const t = evText(e); return `<button class="lrow" data-jev="${k}">${I.evpin}<span class="t"><b>${esc(t.text)}</b><small>${esc(t.when || shortYear(e.year))}</small></span>${I.right}</button>`; }).join("")}</div>`
    : `<p class="note">The atlas has no events recorded in this reign.</p>`;
  const nx = j.reigns[i + 1];
  return h + navRow(i > 0 ? `data-king="${i - 1}"` : "", nx ? { attr: `data-king="${i + 1}"`, small: `Next king · ${shortYear(nx.from)}–${shortYear(nx.to)}`, title: reignName(nx) } : null);
}
async function openKing(i) { // jump to the start of a reign and show the king in the card
  const j = S.journey; if (!j?.reigns[i]) return;
  stopPlay(); S.jKing = i; S.jEvent = null; S.jTab = "story";
  await go(Math.max(j.span[0], j.reigns[i].from));
  renderCol(true);
}
function journeyHTML() {
  if (S.jKing != null && S.journey.reigns[S.jKing]) return kingHTML(S.journey);
  const j = S.journey, y = S.year, prof = j.profile ? Object.values(S.content.byClio).find((e) => e.id === j.profile) : null;
  const total = j.events.length, ei = jEventIdx(j), ev = j.events[ei];
  markSeen("e", j.id, ei);
  let h = cardHead(backLabel("Stories"), `${Math.max(0, ei + 1)} of ${total}`) + progBar(Math.max(0, ei + 1), total);
  h += kick(`Empire story · ${rangeText(j.span[0], j.span[1])}`) + `<h1 class="ttl l">${esc(j.name)}</h1>` + seg2([["story", "Story"], ["about", "About"]], S.jTab || "story", "jtab");
  if ((S.jTab || "story") === "about") {
    if (prof?.summary || j.summary) h += `<p class="prose">${esc(prof?.summary || j.summary)}</p>`;
    const area = journeyArea(j, y);
    h += `<div class="facts two">${prof?.capital ? `<div><span>Capital</span><b>${esc(prof.capital)}</b></div>` : ""}<div><span>At its peak</span><b>${prof?.peak ? `${prof.peak.year != null ? shortYear(prof.peak.year) + ". " : ""}${esc(prof.peak.note || "")}` : "—"}</b></div><div><span>Held in ${shortYear(y)}</span><b>${area ? `${mkm(area)} million km²` : "Not drawn"}</b></div></div>`;
    if (prof?.legacy) h += `<h3 class="sec">Legacy</h3><p class="prose">${esc(prof.legacy)}</p>`;
    if (!j.chain.length) h += `<p class="note">Its territory isn't shown on the map.</p>`;
    return h + srcFold(j.sources);
  }
  const ri = reignOf(j, ev ? ev.year : y), rg = j.reigns[ri];
  if (rg) h += kick(`Under ${esc(reignName(rg))} · ${rangeText(rg.from, rg.to)}`, 1);
  if (ev) {
    const t = evText(ev);
    h += `<div class="stack"><p class="bigy">${t.when ? esc(t.when) : yearLabel(ev.year)}</p><h2 class="ttl s">${esc(t.text)}</h2></div>`;
    if (ev.detail) h += `<p class="prose">${esc(firstSentences(ev.detail, 3))}</p>`;
    h += mediaHTML(`journey:${j.id}:${ei}`);
  } else h += `<div class="stack"><p class="bigy live">${yearLabel(y)}</p><h2 class="ttl s">The story begins</h2></div><p class="prose">${esc(firstSentences(j.summary || prof?.summary, 2))}</p>`;
  if (!j.chain.length) h += `<p class="note">Its territory isn't shown on the map, but the story still applies.</p>`;
  else if (!chainAt(j, y)) h += `<p class="note">Its territory isn't shown for ${plainYear(y)}.</p>`;
  const nx = j.events[ei + 1];
  return h + navRow(ei > 0 ? `data-jev="${ei - 1}"` : "", nx ? { attr: `data-jev="${ei + 1}"`, small: `Next · ${evText(nx).when || shortYear(nx.year)}`, title: evText(nx).text } : null);
}
// Stories: one list for empires, wars and moments, with what this viewer has read.
function storyItems(kind) {
  const C = S.content;
  if (kind === "wars") return C.wars.map((w) => ({ id: w.id, name: w.name, a: w.span[0], b: w.span[1], total: w.events.length, st: storyState("w", w.id, w.events.length), n: Math.min(w.events.length, seenCount("w", w.id)), attr: "data-war" }));
  if (kind === "moments") return C.moments.map((m) => ({ id: m.id, name: m.title, a: m.year, b: m.year, when: m.yearLabel || shortYear(m.year), cat: CAT[m.category] || "", st: P.m.includes(m.id) ? "done" : "", attr: "data-moment", wc: m.worldChanging, place: m.place }));
  return C.journeys.map((j) => ({ id: j.id, name: j.name, a: j.span[0], b: j.span[1], total: j.events.length, st: storyState("e", j.id, j.events.length), n: Math.min(j.events.length, seenCount("e", j.id)), attr: "data-journey" }));
}
function storiesHTML() {
  const kind = S.view, per = PERIODS.find((x) => x[0] === (S.period || "all")), all = storyItems(kind);
  const items = all.filter((x) => x.a >= per[2] && x.a < per[3]);
  const C = S.content;
  const count = kind === "empires" ? `${all.filter((x) => x.st === "done").length} of ${all.length} finished` : kind === "wars" ? `${all.filter((x) => x.st).length} of ${all.length} started`
    : per[0] === "all" ? `${all.filter((x) => x.st).length} of ${all.length} read` : `${items.length} ${per[1].replace(/^./, (c) => c.toLowerCase())} shown`;
  let h = `<div class="chead"><h1 class="ttl l">Stories</h1><span class="count">${count}</span></div>`;
  h += seg2([["empires", `Empires · ${C.journeys.length}`], ["wars", `Wars · ${C.wars.length}`], ["moments", `Moments · ${C.moments.length}`]], kind, "stab");
  h += `<div class="chiprow" role="group" aria-label="Period">${PERIODS.map(([k, t]) => `<button class="fchip" data-period="${k}" aria-pressed="${k === per[0]}">${t}</button>`).join("")}</div>`;
  h += `<div class="srows">${items.map((x) => {
    const meta = kind === "moments" ? `${esc(x.when)}${x.cat ? ` · ${esc(x.cat.split(" ")[0])}` : ""}` : x.st === "doing" ? `${rangeShort(x.a, x.b)} · <b>${x.n} of ${x.total}</b>` : `${rangeShort(x.a, x.b)} · ${x.total} events`;
    return `<button class="srow${x.id === S.listHot ? " hot" : ""}" ${x.attr}="${esc(x.id)}"><span class="mark ${x.st}" aria-label="${x.st === "done" ? "Finished" : x.st === "doing" ? "Started" : "Not started"}"></span><span class="nm">${esc(x.name)}</span><span class="mt">${meta}</span>${I.right}</button>`;
  }).join("") || `<p class="empty">Nothing in this period.</p>`}</div>`;
  return h;
}
// "On the map": the list row being pointed at (else the story in progress), beside the list.
function renderSide() {
  const el = $("#side");
  if (!(LISTS.has(S.view) && S.view !== "sources" && !S.war && !S.journey) || matchMedia("(max-width: 760px)").matches) { el.hidden = true; return; }
  const items = storyItems(S.view);
  const x = items.find((i) => i.id === S.listHot) || (P.last && items.find((i) => i.id === P.last.id && i.st === "doing"));
  if (!x) { el.hidden = true; return; }
  const btn = S.view === "moments" ? "Open the moment" : x.st === "doing" ? `Continue · ${x.n} of ${x.total}` : x.st === "done" ? "Read it again" : "Start the story";
  const sub = S.view === "moments" ? `${esc(x.when)}${x.place ? ` · ${esc(x.place)}` : ""}` : `${rangeText(x.a, x.b)} · ${x.total} events`;
  el.innerHTML = kick("On the map") + `<h2 class="ttl">${esc(x.name)}</h2><p class="sub" style="margin:0">${sub}</p><button class="pillbtn dark" ${x.attr}="${esc(x.id)}">${I.play.replace("<svg", '<svg style="fill:currentColor;stroke:none;width:12px;height:12px"')}${btn}</button>`;
  el.hidden = false;
}
const journeyForRealm = (key) => S.content.journeys.find((j) => j.chain.some((c) => c.clio === key)) || null;

// ---------------------------------------------------------------- defining moments
const momentById = (id) => S.content.moments.find((m) => m.id === id) || null;
const CAT = { technology: "Technology", state: "States & empires", ideas: "Ideas & belief", trade: "Trade & exchange",
  culture: "Culture", law: "Law & government", science: "Science", collapse: "Collapse", war: "War", exploration: "Exploration", atrocity: "Genocide & atrocity" };
async function openMoment(id, keepPlay) {
  const m = momentById(id);
  if (!m) return;
  noteFrom();
  if (!keepPlay) stopPlay();
  if (S.journey) exitJourney();
  if (S.war) exitWar();
  S.sel = null; S.ghost = null; S.moment = m; S.view = "moment";
  await go(Math.max(S.range[0], m.year), { keepMoment: true });
  S.view = "moment"; S.moment = m;
  renderCol(true); writeHash(); draw(); updateChartCursor();
  if (m.lonlat) requestAnimationFrame(() => flyCenter(m.lonlat, 3, 900)); // after the card is drawn, so the free area is known
}
function momentHTML() {
  const m = S.moment, list = S.content.moments, i = list.indexOf(m), prev = list[i - 1], next = list[i + 1];
  markMoment(m.id);
  let h = cardHead(backLabel("Moments"), `${i + 1} of ${list.length}`);
  h += kick(`Moment · ${esc(CAT[m.category] || m.category || "")}${m.worldChanging ? " · World-changing" : ""}`);
  h += `<div class="stack"><p class="bigy m">${esc(m.yearLabel || plainYear(m.year))}</p><h1 class="ttl">${esc(m.title)}</h1>${m.place ? `<div class="placeline">${I.pin}${esc(m.place)}</div>` : ""}</div>`;
  if (m.year < S.range[0]) h += `<p class="note">This happened before the earliest borders on the map (${plainYear(S.range[0])}).</p>`;
  h += `<p class="prose">${esc(m.summary || "")}</p>`;
  h += mediaHTML("moment:" + m.id);
  if (m.why) h += kick("Why it mattered", 1) + `<p class="prose" style="margin-top:-6px">${esc(m.why)}</p>`;
  if (m.also) h += `<details class="more"><summary>Elsewhere at the time</summary><p class="prose">${esc(m.also)}</p></details>`;
  const mw = S.content.wars.find((w) => w.moment === m.id);
  if (mw) h += `<button class="pillbtn block" data-war="${esc(mw.id)}">${I.sword}Play the war, event by event</button>`;
  h += srcFold(m.sources);
  return h + navRow(prev ? `data-moment="${esc(prev.id)}"` : "", next ? { attr: `data-moment="${esc(next.id)}"`, small: `Next · ${next.yearLabel || shortYear(next.year)}`, title: next.title } : null);
}
// Ancient sites and monuments (content/ancient/sites-*.json): shown while in use. Dashed hollow = disputed or legendary.
const SITE_SHAPE = { settlement: "circle", city: "circle", "rock-art": "square" };
function drawAncientSites() {
  updateLegend();
  S.siteHits = [];
  if (S.war || S.view === "journey" || listOnMap()) return;
  const list = sitesNow().sort((a, b) => (b.unesco ? 1 : 0) - (a.unesco ? 1 : 0)); // landmarks get their names first
  if (!list.length) return;
  const many = list.length > 14 && S.t.k < 2.5, placed = S.labels && S.labelBoxes ? [...S.labelBoxes] : mapObstacles(); // site names avoid realm names too
  let named = 0; const maxNamed = S.t.k < 2.5 ? 8 : S.t.k < 5 ? 16 : Infinity; // zoomed out, name only a few: zoom in for the rest
  ctx.save(); ctx.font = '600 11px Inter, sans-serif'; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  for (const st of list) {
    const [x0, y0] = projection(st.lonlat), x = S.t.applyX(x0), y = S.t.applyY(y0);
    if (x < -10 || y < -10 || x > S.width + 10 || y > S.height + 10) continue;
    const unsure = st.evidence === "disputed" || st.evidence === "legendary", sel = S.site?.id === st.id, r = sel ? 7 : 5.5;
    const shape = SITE_SHAPE[st.kind] || "triangle";
    ctx.beginPath();
    if (shape === "circle") ctx.arc(x, y, r * 0.85, 0, 2 * Math.PI);
    else if (shape === "square") ctx.rect(x - r * 0.75, y - r * 0.75, r * 1.5, r * 1.5);
    else { ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.95, y + r * 0.7); ctx.lineTo(x - r * 0.95, y + r * 0.7); ctx.closePath(); }
    ctx.fillStyle = unsure ? theme.bg : sel ? theme.highlight : theme.ink; ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = unsure ? theme.ink : theme.bg; if (unsure) ctx.setLineDash([2, 2]); ctx.stroke(); ctx.setLineDash([]);
    S.siteHits.push({ x, y, st });
    if (many && !sel && !st.unesco) continue; // when crowded, name only the landmark sites
    if (!sel && named >= maxNamed) continue;
    const w = ctx.measureText(st.name).width, box = [x + 8, y - 8, x + 12 + w, y + 8];
    if (box[2] > S.width - 2 || box[3] > S.height - 2 || box[1] < 2) continue;
    if (placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
    placed.push(box); named++;
    ctx.lineWidth = 3; ctx.strokeStyle = theme.bg; ctx.strokeText(st.name, x + 9, y); ctx.fillStyle = sel ? theme.highlight : theme.ink; ctx.fillText(st.name, x + 9, y);
  }
  ctx.restore();
}
const siteAt = (x, y) => { let best = null, bd = 9; for (const h of S.siteHits || []) { const d = Math.hypot(h.x - x, h.y - y); if (d < bd) { bd = d; best = h.st; } } return best; };
// Capitals, seats and ports of the reconstruction layers. A city shows only when it lies inside a state drawn this year,
// and only where it matters: on a realm's page or in an empire's story, that realm's cities; on the open map, a few
// non-overlapping names once zoomed well in.
function sitesThisYear() {
  if (S.siteCtx?.year === S.year && S.siteCtx.states === S.states) return S.siteCtx.list;
  const list = [];
  for (const sp of S.supps) if (sp.from <= S.year && S.year <= sp.to && sp.sites?.length) {
    const feats = S.states.filter((f) => f.properties.supp === sp.id);
    for (const st of sp.sites) { const f = feats.find((g) => d3.geoContains(g, st.lonlat)); if (f) list.push({ st, n: f.properties.n, k: f.properties.k }); }
  }
  S.siteCtx = { year: S.year, states: S.states, list };
  return list;
}
function drawSites() {
  if (S.war || listOnMap()) return;
  const focus = S.journey ? chainKeys(S.journey, S.year) : S.sel ? new Set([S.sel, realmKey(S.sel)]) : null;
  if (!focus && S.t.k < 8) return;
  let list = sitesThisYear();
  if (focus) list = list.filter((x) => focus.has(x.n) || focus.has(x.k));
  if (!list.length) return;
  const placed = focus ? [] : (S.labels && S.labelBoxes ? [...S.labelBoxes] : mapObstacles());
  let named = 0; const maxNamed = focus ? Infinity : S.t.k < 12 ? 6 : 14;
  ctx.save(); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = '600 11px Inter, sans-serif';
  for (const { st } of list) {
    const [x0, y0] = projection(st.lonlat), x = S.t.applyX(x0), y = S.t.applyY(y0);
    if (x < 0 || y < 0 || x > S.width || y > S.height) continue;
    const w = ctx.measureText(st.name).width, box = [x - 4, y - 8, x + 10 + w, y + 8];
    const free = !placed.some((q) => box[0] < q[2] && box[2] > q[0] && box[1] < q[3] && box[3] > q[1]);
    if (!focus && (!free || named >= maxNamed)) continue; // the open map: no crowding, no overlaps
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 2 * Math.PI); ctx.fillStyle = theme.ink; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = theme.bg; ctx.stroke();
    if (free) { placed.push(box); named++; ctx.lineWidth = 3; ctx.strokeStyle = theme.bg; ctx.strokeText(st.name, x + 6, y); ctx.fillStyle = theme.ink; ctx.fillText(st.name, x + 6, y); }
  }
  ctx.restore();
}
// ---------------------------------------------------------------- the open list, on the map
// Opening Moments, Wars or Empires shows where each one happened: moments as dots, wars and empires as labelled pins
// (at the middle of their events). The map underneath fades back; hovering a pin or a list row picks it out.
const listOnMap = () => (S.view === "moments" || S.view === "wars" || S.view === "empires") && !S.war && !S.journey;
function middleOf(events) {
  const pts = (events || []).map((e) => e.lonlat).filter(Boolean);
  if (!pts.length) return null;
  let best = pts[0], bd = Infinity; // the event place closest to all the others (always a real place, never mid-ocean)
  for (const p of pts) { const d = pts.reduce((s, q) => s + d3.geoDistance(p, q), 0); if (d < bd) { bd = d; best = p; } }
  return best;
}
function listPins() {
  S.pinCache ||= {};
  if (S.pinCache[S.view]) return S.pinCache[S.view];
  const C = S.content;
  const pins = S.view === "moments" ? C.moments.filter((m) => m.lonlat).map((m) => ({ id: m.id, name: m.title, when: m.yearLabel || shortYear(m.year), place: m.place, lonlat: m.lonlat, dot: !m.worldChanging, wc: !!m.worldChanging, open: () => openMoment(m.id) }))
    : S.view === "wars" ? C.wars.map((w) => ({ id: w.id, name: w.name, when: w.dateLabel, lonlat: middleOf(w.events), open: () => openWar(w.id) }))
    : C.journeys.map((j) => ({ id: j.id, name: j.name, when: `${shortYear(j.span[0])}–${shortYear(j.span[1])}`, lonlat: middleOf(j.events), open: () => openJourney(j.id) }));
  return (S.pinCache[S.view] = pins.filter((p) => p.lonlat));
}
function pinAt(x, y) {
  let best = null, bd = 10;
  for (const h of S.pinHits || []) { const d = Math.hypot(h.x - x, h.y - y); if (d < bd) { bd = d; best = h.pin; } }
  return best;
}
function drawListPins() {
  S.pinHits = [];
  if (!listOnMap()) return;
  ctx.save();
  ctx.globalAlpha = 0.3; ctx.fillStyle = theme.bg; ctx.fillRect(0, 0, S.width, S.height); ctx.globalAlpha = 1; // fade the map back a little
  const pins = listPins(), placed = mapObstacles(), hot = S.listHot;
  const pts = pins.map((p) => { const [x0, y0] = projection(p.lonlat); return { p, x: S.t.applyX(x0), y: S.t.applyY(y0) }; });
  for (const { p, x, y } of pts) {
    if (x < -10 || y < -10 || x > S.width + 10 || y > S.height + 10) continue;
    const isHot = p.id === hot, r = isHot ? 7 : p.wc ? 6 : p.dot ? 3.5 : 5.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = isHot || p.wc ? theme.highlight : p.dot ? theme.ink3 : theme.ink; ctx.fill(); // world-changing moments in red, the rest quieter
    ctx.lineWidth = 1.5; ctx.strokeStyle = theme.bg; ctx.stroke();
    S.pinHits.push({ x, y, pin: p });
  }
  // names: the hovered one first, then (wars, empires) as many as fit
  ctx.textBaseline = "middle"; ctx.textAlign = "left";
  const order = pts.filter((q) => q.p.id === hot).concat(pts.filter((q) => q.p.id !== hot && !q.p.dot));
  for (const { p, x, y } of order) {
    const isHot = p.id === hot;
    ctx.font = isHot ? '800 13px Archivo, "Helvetica Neue", sans-serif' : '600 11.5px Inter, sans-serif';
    const text = isHot ? `${p.name} · ${p.when}` : p.name, w = ctx.measureText(text).width;
    let box = [x + 8, y - 8, x + 14 + w, y + 8], tx = x + 10;
    if (box[2] > S.width - 4) { box = [x - 14 - w, y - 8, x - 8, y + 8]; tx = x - 10 - w; }
    if (!isHot && (box[0] < 2 || box[1] < 2 || box[3] > S.height - 2 || placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]))) continue;
    placed.push(box);
    if (isHot) { ctx.fillStyle = theme.highlight; ctx.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]); ctx.fillStyle = "#fff"; }
    else { ctx.lineWidth = 3; ctx.strokeStyle = theme.bg; ctx.strokeText(text, tx, y); ctx.fillStyle = theme.ink; }
    ctx.fillText(text, tx, y);
  }
  ctx.restore();
}
function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function drawCallout(x, y, kicker, title) { // white card beside a pin: red kicker over a short title
  ctx.save();
  ctx.font = '600 15px Inter, sans-serif'; const tw = ctx.measureText(title).width;
  ctx.font = '600 11px Inter, sans-serif'; const kw = kicker ? ctx.measureText(kicker).width * 1.1 : 0;
  const w = Math.min(320, Math.max(tw, kw) + 28), h = kicker ? 56 : 38;
  let lx = x + 20, ly = y - h / 2;
  if (lx + w > S.width - (phone() ? 8 : 80)) lx = x - 20 - w;
  lx = Math.max(8, lx);
  ly = Math.max(84, Math.min(S.height - h - 8, ly));
  ctx.shadowColor = "rgba(0,0,0,.12)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  rrect(ctx, lx, ly, w, h, 8); ctx.fillStyle = theme.bg; ctx.fill();
  ctx.shadowColor = "transparent"; ctx.lineWidth = 1; ctx.strokeStyle = theme.ink; ctx.stroke();
  ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  if (kicker) { ctx.font = '600 11px Inter, sans-serif'; ctx.fillStyle = "#c8321e"; ctx.letterSpacing = "1px"; ctx.fillText(kicker.toUpperCase(), lx + 14, ly + 22); ctx.letterSpacing = "0px"; }
  ctx.font = '600 15px Inter, sans-serif'; ctx.fillStyle = theme.ink;
  let t = title; while (ctx.measureText(t).width > w - 28 && t.length > 4) t = t.slice(0, -2);
  ctx.fillText(t === title ? t : t.trimEnd() + "…", lx + 14, ly + (kicker ? 44 : 25));
  ctx.restore();
}
const short = (t, n = 44) => (t.length > n ? t.slice(0, n - 2).trimEnd() + "…" : t);
function drawMomentPin() {
  let m = null;
  if (S.view === "moment" && S.moment) m = { lonlat: S.moment.lonlat, kicker: `${S.moment.yearLabel || shortYear(S.moment.year)}${S.moment.place ? " · " + S.moment.place.split(/[,(]/)[0].trim() : ""}`, title: short(S.moment.title) };
  else if (S.view === "place" && S.place) m = { lonlat: S.place.ll, ring: true, kicker: S.place.runs?.length ? `${S.place.name ? S.place.name.replace(/^Capital of /, "") + " in " : ""}${shortYear(S.year)}` : "", title: (() => { const r = S.place.runs?.find((x) => x.from <= S.year && S.year <= x.to); return r ? displayName(r.name) : ""; })() };
  else if (S.view === "today" && S.today && !S.war) m = { lonlat: S.today.e.lonlat, kicker: `Today, ${S.today.e.label || shortYear(S.today.e.year)}`, title: short(S.today.e.text, 40) };
  else if (S.pop) m = { lonlat: S.pop.ll, ring: true };
  if (!m && S.war && !S.callPt) { const e = S.war.events[S.wIdx]; if (e && e.lonlat && S.cineK.T[S.wIdx + 1] <= S.wt + 1e-6) m = { lonlat: e.lonlat }; }
  if (!m && S.journey) {
    const ev = S.jEvent != null ? S.journey.events[S.jEvent] : currentEvent(S.journey, S.year);
    if (ev && ev.lonlat && S.year - ev.year <= Math.max(3, (S.journey.span[1] - S.journey.span[0]) / 25)) m = { lonlat: ev.lonlat, kicker: evText(ev).when || shortYear(ev.year), title: short(evText(ev).text) };
  }
  if (!m || !m.lonlat) return;
  const [x0, y0] = projection(m.lonlat), x = S.t.applyX(x0), y = S.t.applyY(y0);
  ctx.save();
  if (m.ring) { ctx.beginPath(); ctx.arc(x, y, 9, 0, 2 * Math.PI); ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.fillStyle = theme.ink; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = theme.ink; ctx.beginPath(); ctx.arc(x, y, 9, 0, 2 * Math.PI); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(x, y, 10, 0, 2 * Math.PI); ctx.fillStyle = theme.highlight; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "#ffffff"; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = theme.ink; ctx.beginPath(); ctx.arc(x, y, 12, 0, 2 * Math.PI); ctx.stroke(); }
  ctx.restore();
  if (m.title) drawCallout(x, y, m.kicker, m.title);
}

// ---------------------------------------------------------------- power chart (the timeline)
// Trackpad / mouse wheel: scrolling right or down moves forward in time (one gesture = many small wheel events).
const wheelPx = (ev) => { const k = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? 400 : 1; return (Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY) * k; };
function setupChart() {
  const el = $("#chart");
  const toYear = (ev) => { const r = el.getBoundingClientRect(); const fx = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)); const [a, b] = S.journey ? S.journey.span : [S.win.a, S.win.b]; return a + fx * (b - a); };
  let drag = null, pending = null;
  const scrub = (y) => { if (pending == null) setTimeout(() => { go(pending); pending = null; }, 24); pending = y; };
  el.addEventListener("pointerdown", (ev) => {
    if (S.chartKind && !S.war && !S.journey) { // list timeline: open the item, or jump to the year clicked
      ev.preventDefault();
      const it = ev.target.closest("[data-war],[data-journey],[data-moment]");
      if (it) return it.dataset.war ? openWar(it.dataset.war) : it.dataset.journey ? openJourney(it.dataset.journey) : openMoment(it.dataset.moment);
      const r = el.getBoundingClientRect(); stopPlay(); return go(S.chartInv((ev.clientX - r.left) / r.width));
    }
    const wk = ev.target.closest("[data-wev]");
    if (S.war && ev.target.closest("[data-chap]")) return; // chapter cards are buttons, not the scrubber
    if (S.war) { ev.preventDefault(); stopPlay(); if (wk) return goWarEvent(+wk.dataset.wev);
      drag = { x: ev.clientX, target: ev.target, war: true }; el.setPointerCapture(ev.pointerId); return setWp(pOf(S.cineK, warT(ev))); }
    const mk = ev.target.closest(".mk");
    if (mk && mk.dataset.jev != null) { ev.preventDefault(); const e = S.journey.events[+mk.dataset.jev]; S.jEvent = +mk.dataset.jev; stopPlay(); return go(e.year); }
    if (mk) { ev.preventDefault(); return openMoment(mk.dataset.moment); }
    const rb = ev.target.closest(".reign");
    if (rb) { ev.preventDefault(); S.jEvent = null; stopPlay(); return go(+rb.dataset.year); }
    drag = { x: ev.clientX, target: ev.target }; el.setPointerCapture(ev.pointerId); stopPlay(); scrub(toYear(ev));
  });
  let wheelAcc = 0, wheelYear = null, wheelRaf = 0, wheelAt = 0;
  el.addEventListener("wheel", (ev) => {
    const strip = ev.target.closest(".wchap");
    if (strip) { // chapter cards: slide the row (a vertical wheel scrolls it sideways too)
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) { // the row snaps to cards, so move a whole card per notch
        ev.preventDefault(); wheelAcc += wheelPx(ev);
        if (Math.abs(wheelAcc) >= 40) { strip.scrollBy({ left: Math.sign(wheelAcc) * 142, behavior: "smooth" }); wheelAcc = 0; }
      }
      return;
    }
    ev.preventDefault();
    const dx = wheelPx(ev), w = el.getBoundingClientRect().width || 1;
    if (S.war) { // a war without chapters: step event by event
      wheelAcc += dx;
      if (Math.abs(wheelAcc) >= 60) { const n = Math.sign(wheelAcc); wheelAcc = 0; stopPlay(); goWarEvent(S.wIdx + n); }
      return;
    }
    stopPlay();
    const now = performance.now(); if (wheelYear == null || now - wheelAt > 400) wheelYear = S.year; wheelAt = now; // keep fractions within a gesture
    const base = wheelYear;
    let y;
    if (S.chartKind && !S.journey) { const f = S.chartScale(base) + dx / w, y0 = S.chartInv(f); y = y0 === Math.round(base) ? base + Math.sign(dx) * 0.34 : y0; }
    else { const [a, b] = S.journey ? S.journey.span : [S.win.a, S.win.b]; y = Math.max(a, Math.min(b, base + (dx / w) * (b - a))); }
    wheelYear = Math.max(S.range[0], Math.min(S.range[1], y));
    if (!wheelRaf) wheelRaf = setTimeout(() => { wheelRaf = 0; const t = Math.round(wheelYear); if (t !== S.year) go(t); }, 16);
  }, { passive: false });
  const warT = (ev) => { const r = el.getBoundingClientRect(); return S.war.span[0] + Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * (S.war.span[1] + 1 - S.war.span[0]); };
  el.addEventListener("pointermove", (ev) => { if (drag?.war) { if (S.war) setWp(pOf(S.cineK, warT(ev))); return; } if (drag) { if (Math.abs(ev.clientX - drag.x) > 3) drag.moved = true; scrub(toYear(ev)); } });
  el.addEventListener("pointerup", () => {
    if (drag && !drag.war && !drag.moved) { const s = drag.target.closest?.("[data-series]"); if (s) select(s.dataset.series); }
    drag = null;
  });
}
// The bottom section follows the menu: Wars, Empires and Moments each show their own clickable timeline.
const LIST_CHARTS = new Set(["wars", "empires", "moments"]);
function syncChart() {
  if (S.war || S.journey) return;
  const want = LIST_CHARTS.has(S.view) ? S.view : null;
  if (want === (S.chartKind || null)) return;
  if (want) renderListChart(want);
  else { S.chartKind = null; if (S.win) renderChart(); else updateWindow(); }
  updateChartCursor();
}
function renderListChart(kind) {
  const el = $("#chart"), Wpx = Math.max(320, el.clientWidth || 900), H = 130;
  const items = kind === "wars" ? S.content.wars.map((w) => ({ id: w.id, name: w.name, a: w.span[0], b: w.span[1] + 1, attr: "data-war", hot: !!w.cinema, when: w.dateLabel }))
    : kind === "empires" ? S.content.journeys.map((j) => ({ id: j.id, name: j.name, a: j.span[0], b: j.span[1], attr: "data-journey", when: `${shortYear(j.span[0])}–${shortYear(j.span[1])}` }))
    : S.content.moments.map((m) => ({ id: m.id, name: m.title, a: m.year, b: m.year, attr: "data-moment", when: m.yearLabel || shortYear(m.year), wc: !!m.worldChanging }));
  const a = Math.min(...items.map((i) => i.a)), b = Math.max(S.range[1], ...items.map((i) => i.b));
  const p0 = yToPos(a), p1 = yToPos(b);
  const X = (S.chartScale = (y) => (yToPos(Math.max(a, Math.min(b, y))) - p0) / (p1 - p0));
  S.chartInv = (fx) => posToY(p0 + Math.max(0, Math.min(1, fx)) * (p1 - p0));
  const pct = (v) => `${(100 * v).toFixed(2)}%`;
  let body = "";
  if (kind === "moments") { // diamonds, stacked into rows where they would overlap
    const rows = [], rowH = 15, nRows = Math.floor((H - 8) / rowH);
    for (const it of [...items].sort((p, q) => q.wc - p.wc || p.a - q.a)) { // world-changing ones claim the bottom row first
      const x = X(it.a) * Wpx;
      let r = rows.findIndex((last) => x - last >= 12);
      if (r < 0) r = rows.length < nRows ? rows.length : rows.indexOf(Math.min(...rows));
      rows[r] = x;
      body += `<button class="lmk${it.wc ? " wc" : ""}" ${it.attr}="${esc(it.id)}" style="left:${pct(X(it.a))};bottom:${4 + r * rowH}px" aria-label="${esc(it.name)}, ${esc(it.when)}"><span class="tipm">${esc(it.when)} · ${esc(it.name)}</span></button>`;
    }
  } else { // a bar per war or empire with its name beside it, packed into lanes
    const laneH = kind === "wars" ? 16 : 12, nLanes = Math.floor(H / laneH), lanes = [];
    for (const it of [...items].sort((p, q) => p.a - q.a)) {
      const inside = kind === "empires"; // empire spans are long: the name sits inside its bar
      const x0 = X(it.a) * Wpx, bw = Math.max(3, (X(it.b) - X(it.a)) * Wpx), lw = inside ? 0 : it.name.length * 6.4 + 10;
      const flip = x0 + bw + lw > Wpx - 2; // name would run off the right edge: put it before the bar
      const from = flip ? x0 - lw : x0, to = flip ? x0 + bw : x0 + bw + lw;
      let l = lanes.findIndex((end) => end <= from - 4), label = true;
      if (l < 0 && lanes.length < nLanes) l = lanes.length;
      if (l < 0) { l = lanes.indexOf(Math.min(...lanes)); label = false; }
      lanes[l] = label ? to : x0 + bw;
      const pos = flip && label ? `right:${pct(1 - X(it.b))}` : `left:${pct(X(it.a))}`;
      body += inside
        ? `<button class="lbar in" ${it.attr}="${esc(it.id)}" style="left:${pct(X(it.a))};width:${bw.toFixed(1)}px;top:${l * laneH}px;height:${laneH - 1}px" title="${esc(it.name)} · ${esc(it.when)}"><span>${esc(it.name)}</span></button>`
        : `<button class="lbar${it.hot ? " hot" : ""}${flip && label ? " flip" : ""}" ${it.attr}="${esc(it.id)}" style="${pos};top:${l * laneH}px;height:${laneH - 2}px" title="${esc(it.name)} · ${esc(it.when)}"><i style="width:${bw.toFixed(1)}px"></i>${label ? `<span>${esc(it.name)}</span>` : ""}</button>`;
    }
  }
  const cand = [-9000, -7000, -5000, -3000, -2000, -1000, 1, 500, 1000, 1500, 1700, 1800, 1900, 2000].filter((y) => y > a && y < b);
  const ticks = [a]; for (const y of cand) if ((X(y) - X(ticks[ticks.length - 1])) * Wpx > 90 && (X(b) - X(y)) * Wpx > 70) ticks.push(y);
  ticks.push(b);
  const legend = "";
  el.innerHTML = `<div class="lchart ${kind}">${body}<div class="lcur"></div></div>${legend}
    <div class="axis">${ticks.map((y) => `<span style="left:${pct(X(y))}">${shortYear(y)}</span>`).join("")}</div><div class="cur"></div>`;
  const n = items.length, what = { wars: `All wars · ${n} wars`, empires: `Empire journeys · ${n} empires`, moments: `Defining moments · ${n}` }[kind];
  $("#chartTitle").textContent = `${what}, ${shortYear(a)}–${shortYear(b)}`;
  $("#chartSub").textContent = { wars: "Each bar is a war · red ones play as a storyboard · click a war to open it", empires: "Each bar is an empire's span · click one to follow it through time", moments: "Each diamond is a defining moment · hover to read, click to open" }[kind];
  S.chartKind = kind;
}
function renderChart() {
  if (LIST_CHARTS.has(S.view) && !S.war && !S.journey) return renderListChart(S.view);
  S.chartKind = null;
  const w = S.win, el = $("#chart");
  if (!w.series.length || !w.max) {
    el.innerHTML = `<p class="nochart">No states yet. Before about 3400 BCE the map shows archaeological cultures (dashed outlines) and sites (▲ ●). There are no written records before about ${shortYear(WRITING)}: everything shown is known from excavation and dating, and areas are approximate.</p>`;
    $("#chartTitle").textContent = w.label || "Before the first states";
    $("#chartSub").textContent = "Known from archaeology only";
    return;
  }
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
  const nCult = w.series.filter((s) => realm(realmKey(s.key))?.recon?.sp.kind === "cultures").length;
  const what = nCult === w.series.length ? "The largest cultures" : nCult * 2 >= w.series.length ? "Cultures and first states" : "The great powers";
  $("#chartTitle").textContent = `${what} · ${w.label}, ${shortYear(w.a)}–${shortYear(w.b)}`;
  $("#chartSub").textContent = nCult * 2 >= w.series.length ? "Area in millions of km², approximate (known from archaeology), stacked · drag across the chart to travel"
    : "Territory in millions of km², stacked · drag across the chart to travel";
}
function updateChartCursor() {
  if (S.war) return;
  if (S.chartKind) {
    const el = $("#chart"), fx = S.chartScale(S.year), cur = el.querySelector(".cur"), line = el.querySelector(".lcur");
    if (line) line.style.left = `${fx * 100}%`;
    if (cur) { cur.style.left = `${Math.max(2, Math.min(98, fx * 100))}%`; cur.textContent = shortYear(S.year); }
    return;
  }
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
function stepChapter(dir) {
  const eras = S.content.eras;
  const target = dir > 0 ? eras.find((e) => e.year > S.year) : [...eras].reverse().find((e) => e.year < S.year);
  if (target) go(target.year);
}
function setPlayIcon(playing) {
  const b = $("#play"); if (!b) return;
  const svg = b.querySelector("svg"); if (svg) svg.outerHTML = playSvg(playing);
  b.setAttribute("aria-label", playing ? "Pause" : b.textContent.trim() || "Play");
  const d = $("#dock"); if (d) d.dataset.h = ""; // the next full render redraws the bar
}
function stopPlay() {
  if (!S.playing) return;
  const timeline = S.playing > 0;
  clearInterval(S.playing); clearTimeout(S.stepTimer); cancelAnimationFrame(S.cineRaf); clearTimeout(S.chainTimer); S.playing = null; S.playEnd = null; setPlayIcon(false);
  if (S.cinePlay) { S.cinePlay = false; updateHud(); draw(); }
  if (timeline) { renderCol(); draw(); } // catch up the column and the hit-test layer skipped during playback
}
function togglePlay() {
  if (S.playing) return stopPlay();
  if (S.tstory) { // today's story: a step every few seconds
    S.playing = -1; setPlayIcon(true);
    const tick = () => { const n = todaySteps().length; if (!S.playing || !S.tstory) return; if (S.tstory.step >= n - 1) return stopPlay(); openTodayStory(S.tstory.step + 1, true).then(() => { S.stepTimer = setTimeout(tick, 6000); }); };
    S.stepTimer = setTimeout(tick, S.tstory.step === 0 ? 300 : 4000); return;
  }
  if (S.view === "moment" && S.moment && !S.war && !S.journey) { // this age's moments, one after another
    S.playing = -1; setPlayIcon(true);
    const tick = () => { if (!S.playing) return; const ms = ageMoments(ageOf(S.moment.year)), i = ms.indexOf(S.moment); if (i < 0 || i >= ms.length - 1) return stopPlay(); openMoment(ms[i + 1].id, true).then(() => { S.stepTimer = setTimeout(tick, 5000); }); };
    S.stepTimer = setTimeout(tick, 1200); return;
  }
  if (story()) { setPlayIcon(true); playChapter(false); return; } // this stage
  if (S.war) {
    setPlayIcon(true);
    if (S.wp >= S.cineK.D - 0.05) { S.shotIdx = -1; setWp(0); }
    S.cinePlay = true; S.playing = -1; S.cineLast = 0; S.subAt = performance.now();
    S.cineRaf = requestAnimationFrame(cineTick);
    return;
  }
  let span = 0, jstep = 0, interval = 300;
  if (S.journey) { // the whole empire, from here to its end (about 30 seconds for the whole span)
    const j = S.journey; S.playEnd = j.span[1]; S.jKing = null;
    if (S.year >= j.span[1] - 1) go(j.span[0]);
    span = Math.max(1, j.span[1] - j.span[0]);
    interval = Math.min(600, Math.max(110, 30000 / span)); jstep = Math.max(1, Math.round(span / (30000 / interval)));
  } else if (S.year >= S.range[1]) go(S.range[0]);
  setPlayIcon(true);
  S.playing = setInterval(() => {
    if (S.journey) { if (S.year >= S.playEnd) return stopPlay(); S.jEvent = null; return go(Math.min(S.playEnd, S.year + jstep)); }
    if (S.year >= S.range[1]) return stopPlay();
    go(Math.max(S.year + 1, posToY(yToPos(S.year) + 0.0011))); // ~7 years a step in late antiquity, 1–2 in the modern era
  }, interval);
  setPlayIcon(true);
}

// ---------------------------------------------------------------- the bottom bar
// One bar at the bottom: a time bar while exploring, and for a story two rows — its parts (stages, rulers, ages) and the
// events inside the current part, all named.
const TICKS = [[-10000, "10,000 BCE"], [-3000, "3000 BCE"], [-1000, "1000 BCE"], [1, "1 CE"], [1000, "1000"], [1500, "1500"], [1800, "1800"]];
const dockMode = () => S.tstory && S.war ? "tstory" : S.war ? "war" : S.journey ? "journey" : S.view === "moment" && S.moment ? "moment" : "time";
const playSvg = (on) => (on ? I.pause : I.play);
function journeyCurve(j) { // the empire's territory over its whole life, as an SVG area (0–1000 wide, 0–100 high)
  if (S.jCurve?.id === j.id) return S.jCurve;
  const [a, b] = j.span, N = 220, pts = [];
  let max = 0, peak = a;
  for (let i = 0; i < N; i++) { const y = Math.round(a + (i * (b - a)) / (N - 1)), v = journeyArea(j, y); pts.push([y, v]); if (v > max) { max = v; peak = y; } }
  const X = (y) => ((1000 * (y - a)) / Math.max(1, b - a)).toFixed(1), Y = (v) => (100 - (max ? (v / max) * 92 : 0)).toFixed(1);
  const line = "M" + pts.map(([y, v]) => `${X(y)},${Y(v)}`).join("L");
  return (S.jCurve = { id: j.id, max, peak, line, d: `${line}L1000,100L0,100Z` });
}
const jx = (j) => { const [a, b] = j.span; return (y) => (100 * Math.max(0, Math.min(1, (y - a) / Math.max(1, b - a)))).toFixed(2); }; // year -> % along the empire's timeline
function partBtn(i, cur, small, name, note, attr) {
  const cls = i === cur ? "on" : i < cur ? "seen" : "";
  return `<button class="part ${cls}" ${attr} aria-pressed="${i === cur}"><small>${esc(small)}</small><b>${esc(name)}</b>${note && i !== cur ? `<em>${esc(note)}</em>` : ""}</button>`;
}
const evChip = (date, title, cls, attr) => `<button class="echip ${cls}" ${attr}><i></i><b>${esc(date)}</b><span>${esc(title)}</span></button>`;
function storyDock(parts, chips, playLabel, worldYear, partsLabel, chipsLabel) {
  return `<div class="sdock"><div class="parts" role="group" aria-label="${esc(partsLabel)}">${parts}</div>
    <div class="row2"><button class="pillplay" id="play" aria-label="${esc(playLabel)}">${playSvg(S.playing)}<span>${esc(playLabel)}</span></button>
    <div class="chips" role="group" aria-label="${esc(chipsLabel)}">${chips || `<span class="none">No events recorded in this part</span>`}</div>
    <button class="pillbtn" data-act="world-in" data-year="${worldYear}">${I.globe}The world in ${shortYear(worldYear)}</button></div></div>`;
}
function renderDock() {
  const el = $("#dock"), mode = dockMode();
  let h = "";
  if (mode === "war" && story()) {
    const C = S.cine, w = S.war, seen = new Set(P.w[w.id] || []);
    const parts = C.chapters.map((c, i) => partBtn(i, S.chap, i === S.chap ? `Stage ${i + 1} of ${C.chapters.length} · ${chapRange(c, true)}` : `${i + 1} · ${chapRange(c, true).replace(/^[A-Z][a-z]{2}(–[A-Z][a-z]{2})? /, "")}`, c.title, "", `data-chap="${i}"`)).join("");
    const chips = chapterEvents(C.chapters[S.chap]).map(({ e, i }) => evChip((e.label || shortYear(e.year)).replace(/\s+\d{4}$/, ""), e.text, i === S.wIdx ? "on" : seen.has(i) ? "seen" : "", `data-wev="${i}"`)).join("");
    h = storyDock(parts, chips, "Play this stage", Math.floor(S.wt ?? S.year), "Stages of the war", "Events in this stage");
  } else if (mode === "war") {
    const w = S.war, seen = new Set(P.w[w.id] || []);
    const years = [...new Set(w.events.map((e) => e.year))], cy = w.events[S.wIdx]?.year ?? years[0], ci = years.indexOf(cy);
    const parts = years.map((y, i) => partBtn(i, ci, i === ci ? `Year ${i + 1} of ${years.length}` : "", shortYear(y), `${w.events.filter((e) => e.year === y).length} events`, `data-wev="${w.events.findIndex((e) => e.year === y)}"`)).join("");
    const chips = w.events.map((e, i) => ({ e, i })).filter((x) => x.e.year === cy).map(({ e, i }) => evChip(e.label || shortYear(e.year), e.text, i === S.wIdx ? "on" : seen.has(i) ? "seen" : "", `data-wev="${i}"`)).join("");
    h = storyDock(parts, chips, "Play the war", cy, "Years of the war", "Events this year");
  } else if (mode === "journey") { // the empire as one timeline: its rulers as named spans, its events as markers, one Play
    const j = S.journey, ei = jEventIdx(j), seen = new Set(P.e[j.id] || []), X = jx(j);
    const cur = j.reigns.length ? reignOf(j, ei >= 0 ? j.events[ei].year : S.year) : -1;
    const rgs = j.reigns.map((r, i) => { const x = X(Math.max(r.from, j.span[0])), lab = `${reignName(r)} · ${shortYear(r.from)}–${shortYear(r.to)}`; // a crown where each king's reign begins; the name on hover
      return `<button class="crown${i === cur ? " on" : ""}${+x > 88 ? " r" : +x < 12 ? " l" : ""}" data-reign="${i}" style="left:${x}%" aria-label="${esc(reignName(r))}, ${shortYear(r.from)} to ${shortYear(r.to)}" data-label="${esc(lab)}">${I.crown}</button>`; }).join("");
    const evs = j.events.map((e, i) => { const t = evText(e), when = t.when || shortYear(e.year);
      const x = X(e.year); return `<button class="ev${i === ei ? " on" : seen.has(i) ? " seen" : ""}${+x > 88 ? " r" : +x < 12 ? " l" : ""}" data-jev="${i}" style="left:${x}%" aria-label="${esc(when)}: ${esc(t.text)}" data-label="${esc(when)} · ${esc(short(t.text, 40))}">${I.evpin}</button>`; }).join("");
    // each king's name under his crown, in the room up to the next crown (cut short with … when they are close)
    const starts = j.reigns.map((r) => +X(Math.max(r.from, j.span[0])));
    const cnames = j.reigns.map((r, i) => { const gap = (i + 1 < starts.length ? Math.max(starts[i + 1], starts[i]) : 100 + 1.5) - starts[i];
      return `<span class="cname${i === cur ? " on" : ""}" aria-hidden="true" style="left:${starts[i]}%;max-width:calc(${gap.toFixed(2)}% - 2px)">${esc(reignName(r))}</span>`; }).join("");
    let cap = "";
    if (ei >= 0) { const e = j.events[ei], t = evText(e), x = X(e.year); cap = `<div class="ecap${x < 18 ? " l" : x > 82 ? " r" : ""}" style="left:${x}%"><b>${esc(t.when || shortYear(e.year))}</b> ${esc(short(t.text, 56))}</div>`; }
    const A = journeyCurve(j);
    h = `<div class="etl"><div class="eplay"><button class="play" id="play" aria-label="Play the whole empire">${playSvg(S.playing)}</button><b class="eyear"></b></div>
      <div class="lane jt" role="group" aria-label="Timeline of ${esc(j.name)}: territory, rulers and events">
      ${A.max ? `<svg class="jarea" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path class="fillp" d="${A.d}"/><path class="linep" d="${A.line}"/></svg><span class="jpeak">Largest: ${mkm(A.max)} million km², ${shortYear(A.peak)}</span>` : `<span class="jpeak l">No borders on the map for this empire</span>`}
      <span class="erail"></span><span class="edone"></span>${evs}<span class="ehead"></span>${cap}<div class="crowns" role="group" aria-label="Kings of ${esc(j.name)}">${rgs}${cnames}</div></div>
      <button class="pillbtn" data-act="world-in" data-year="${ei >= 0 ? j.events[ei].year : S.year}">${I.globe}The world in ${shortYear(ei >= 0 ? j.events[ei].year : S.year)}</button></div>`;
  } else if (mode === "moment") {
    const m = S.moment, cur = ageOf(m.year);
    const parts = AGES.map((a, i) => { const n = ageMoments(i).length; return partBtn(i, cur, i === cur ? `Age ${i + 1} of ${AGES.length} · ${a[3]}` : a[3], a[2], `${n} moments`, `data-age="${i}"`); }).join("");
    const chips = ageMoments(cur).map((x) => evChip(x.yearLabel || shortYear(x.year), x.title, x === m ? "on" : P.m.includes(x.id) ? "seen" : "", `data-moment="${esc(x.id)}"`)).join("");
    h = storyDock(parts, chips, "Play this age", Math.max(S.range[0], m.year), "Ages of history", "Moments in this age");
  } else if (mode === "tstory") {
    const steps = todaySteps(), i = S.tstory.step;
    h = `<div class="tbar"><button class="play" id="play" aria-label="Play today's story">${playSvg(S.playing)}</button>
      <button class="step" data-tstep="${Math.max(0, i - 1)}" aria-label="Previous step">${I.left}</button><b class="tyear">${shortYear(S.today.e.year)}</b><button class="step" data-tstep="${Math.min(steps.length - 1, i + 1)}" aria-label="Next step">${I.right}</button>
      <div class="tsteps"><span class="fill" style="width:calc(${(100 * i) / Math.max(1, steps.length - 1)}% - 12px)"></span>${steps.map((st, k) => `<button class="tstep ${k === i ? "on" : k < i ? "seen" : ""}" data-tstep="${k}"><i></i>${esc(st.label.length > 34 ? st.label.slice(0, 32) + "…" : st.label)}</button>`).join("")}</div>
      <button class="pillbtn" data-act="world-in" data-year="${S.today.e.year}">${I.globe}The world in ${shortYear(S.today.e.year)}</button></div>`;
  } else {
    const labs = TICKS.filter(([y]) => y >= S.range[0]).map(([y, t]) => `<span style="left:${100 * yToPos(y)}%">${t}</span>`).join("") + `<span style="left:100%">Today</span>`;
    h = `<div class="tbar"><button class="play" id="play" aria-label="Play through time">${playSvg(S.playing)}</button>
      <button class="step" data-step="-1" aria-label="Earlier">${I.left}</button><b class="tyear" aria-live="off"></b><button class="step" data-step="1" aria-label="Later">${I.right}</button>
      <div class="track" id="track" role="slider" tabindex="0" aria-label="Year" aria-valuemin="${S.range[0]}" aria-valuemax="${S.range[1]}"><span class="rail"></span><span class="fill"></span><span class="ticks"></span><span class="segs"></span><span class="thumb"></span><span class="labs">${labs}</span></div>
      <button class="pillbtn${S.compare ? " dark" : ""}" data-act="compare" aria-pressed="${!!S.compare}">${I.chart}Compare empires</button></div>`;
  }
  if (el.dataset.h !== h) { el.innerHTML = h; el.dataset.h = h; el.dataset.mode = mode; }
  if (mode === "time") dockMarks();
  if (mode === "time" || mode === "journey") updateDock();
  el.querySelector(".part.on")?.scrollIntoView({ block: "nearest", inline: "center" });
  el.querySelector(".echip.on")?.scrollIntoView({ block: "nearest", inline: "center" });
}
// Coloured spans on the time bar: the rulers of a place, a realm's lifetime, the story pointed at in a list; ticks for moments.
function dockMarks() {
  const tr = $("#track"); if (!tr) return;
  const pct = (y) => `${(100 * yToPos(Math.max(S.range[0], Math.min(S.range[1], y)))).toFixed(2)}%`;
  const span = (a, b, c, cls = "") => `<i class="${cls}" style="left:${pct(a)};width:calc(${pct(b)} - ${pct(a)});background:${c}"></i>`;
  let segs = "", ticks = "";
  const runs = S.view === "place" ? S.place?.runs : S.view === "realm" && S.realmPlace?.key === S.sel ? S.realmPlace.runs : null;
  if (runs) segs = runs.map((r) => span(r.from, r.to, colorOf(r.name))).join("");
  else if (S.view === "realm" && S.sel && realm(S.sel)) { const r = realm(S.sel); segs = span(r.tl[0][0], r.tl[r.tl.length - 1][1], theme.highlight); }
  if (LISTS.has(S.view) && S.view !== "sources") {
    if (S.view === "moments") ticks = S.content.moments.map((m) => `<i class="${m.worldChanging ? "wc" : ""}" style="left:${pct(m.year)}"></i>`).join("");
    const hot = S.listHot && storyItems(S.view).find((x) => x.id === S.listHot);
    if (hot && S.view !== "moments") segs = span(hot.a, hot.b, theme.highlight, "hot");
  }
  const k = segs + "|" + ticks;
  if (tr.dataset.k === k) return;
  tr.dataset.k = k; tr.querySelector(".segs").innerHTML = segs; tr.querySelector(".ticks").innerHTML = ticks;
}
function updateDock() {
  const el = $("#dock");
  if (el.dataset.mode === "journey" && S.journey) { // the playhead, the part played and the current ruler follow the year
    const j = S.journey, x = jx(j)(S.year), cur = reignOf(j, S.year);
    const hd = el.querySelector(".ehead"); if (hd) hd.style.left = `${x}%`;
    const dn = el.querySelector(".edone"); if (dn) dn.style.width = `${x}%`;
    const ey = el.querySelector(".eyear"); if (ey) ey.innerHTML = yearLabel(S.year);
    if (S.playing) el.querySelectorAll(".crown").forEach((b, i) => b.classList.toggle("on", i === cur));
    return;
  }
  if (el.dataset.mode !== "time") return;
  const p = 100 * yToPos(S.year);
  const ty = el.querySelector(".tyear"); if (ty) ty.innerHTML = yearLabel(S.year);
  const th = el.querySelector(".thumb"); if (th) th.style.left = `${p}%`;
  const fl = el.querySelector(".fill"); if (fl) fl.style.width = (S.view === "realm" || S.view === "place") ? "0" : `${p}%`;
  const tr = $("#track"); if (tr) { tr.setAttribute("aria-valuenow", S.year); tr.setAttribute("aria-valuetext", plainYear(S.year)); }
  dockMarks();
}
const yearStep = (y) => (y >= 1800 ? 1 : y >= 1000 ? 5 : y >= 0 ? 10 : y >= -3000 ? 50 : 250);
function setupDock() {
  const el = $("#dock");
  let drag = false;
  const toYear = (ev) => { const r = $("#track").getBoundingClientRect(); return posToY((ev.clientX - r.left) / r.width); };
  const laneYear = (ev) => { const r = el.querySelector(".lane").getBoundingClientRect(), [a, b] = S.journey.span; return Math.round(a + Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * (b - a)); };
  el.addEventListener("pointerdown", (ev) => {
    const lane = ev.target.closest(".lane");
    if (lane && S.journey && !ev.target.closest("button")) { drag = "lane"; lane.setPointerCapture(ev.pointerId); stopPlay(); S.jEvent = null; S.jKing = null; return go(laneYear(ev)); }
    if (!ev.target.closest("#track")) return;
    drag = true; ev.target.closest("#track").setPointerCapture(ev.pointerId); stopPlay(); go(toYear(ev));
  });
  el.addEventListener("pointermove", (ev) => { if (drag === "lane" && S.journey) { S.jEvent = null; return go(laneYear(ev)); } if (drag && $("#track")) go(toYear(ev)); });
  el.addEventListener("pointerup", () => (drag = false));
  let sPos = null, sRaf = 0, sAt = 0;
  el.addEventListener("wheel", (ev) => {
    const tr = ev.target.closest("#track"), row = ev.target.closest(".parts, .chips");
    if (row) { if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) { ev.preventDefault(); row.scrollBy({ left: wheelPx(ev) }); } return; }
    if (!tr) return;
    ev.preventDefault(); stopPlay();
    const now = performance.now(); if (sPos == null || now - sAt > 400) sPos = yToPos(S.year); sAt = now;
    sPos = Math.max(0, Math.min(1, sPos + wheelPx(ev) / (tr.getBoundingClientRect().width || 1) / 6));
    if (!sRaf) sRaf = setTimeout(() => { sRaf = 0; const t = Math.max(S.range[0], Math.min(S.range[1], posToY(sPos))); if (t !== S.year) go(t); }, 16);
  }, { passive: false });
  el.addEventListener("keydown", (ev) => {
    if (!ev.target.closest("#track") || (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight")) return;
    ev.preventDefault(); ev.stopPropagation(); stopPlay(); go(S.year + (ev.key === "ArrowRight" ? 1 : -1) * (ev.shiftKey ? 1 : 10));
  });
  el.addEventListener("click", async (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    if (b.id === "play") return togglePlay();
    if (b.dataset.step) { stopPlay(); return go(S.year + +b.dataset.step * yearStep(S.year)); }
    if (b.dataset.act === "compare") { S.compare = !S.compare; if (S.compare) { if (S.win) renderChart(); updateChartCursor(); } syncChrome(); return renderDock(); }
    if (b.dataset.act === "world-in") { const y = +b.dataset.year; return leaveToWorld(y); }
    if (b.dataset.tstep != null) return openTodayStory(+b.dataset.tstep);
    if (b.dataset.chap != null && story()) { stopPlay(); return openChapter(+b.dataset.chap); }
    if (b.dataset.wev != null && S.war) { stopPlay(); return goWarEvent(+b.dataset.wev); }
    if (b.dataset.reign != null && S.journey) return openKing(+b.dataset.reign); // a crown: that king
    if (b.dataset.jev != null && S.journey) { stopPlay(); const i = +b.dataset.jev; S.jEvent = i; S.jKing = null; return go(S.journey.events[i].year); }
    if (b.dataset.age != null) { const ms = ageMoments(+b.dataset.age); if (ms.length) return openMoment((ms.find((m) => !P.m.includes(m.id)) || ms[0]).id); }
    if (b.dataset.moment) return openMoment(b.dataset.moment);
  });
}
// "The world in YEAR": leave the story for the open map at that year.
async function leaveToWorld(y) {
  stopPlay(); S.from = null; S.tstory = null;
  if (S.war) exitWar();
  if (S.journey) exitJourney();
  S.view = "world"; S.moment = null; S.sel = null; S.place = null; S.site = null;
  await go(y); renderCol(true); draw(); writeHash();
}

// ---------------------------------------------------------------- search
function reignYears(text) { // "c. 2589 – 2566 BCE" → [-2589, -2566]; "27 BCE – 14 CE" → [-27, 14]
  const t = text.replace(/[–—]/g, "-"), ys = (t.match(/\d{1,4}/g) || []).map(Number);
  if (!ys.length) return null;
  if (/\b(BCE|BC)\b/.test(t)) { if (/\b(CE|AD)\b/.test(t)) ys[0] = -ys[0]; else for (let i = 0; i < ys.length; i++) ys[i] = -ys[i]; }
  return [ys[0], ys[ys.length - 1]];
}
function setupSearch() {
  const input = $("#search"), list = $("#results");
  const all = Object.entries(S.clio.realms).filter(([k]) => !NOT_A_REALM.test(k)).map(([key, r]) => ({
    key, name: displayName(key), raw: clean(key), from: r.tl[0][0], to: r.tl[r.tl.length - 1][1],
    area: Math.max(...r.tl.map((x) => x[2])), emp: !!empireOf(key),
  })).concat((S.sites || []).map((st) => ({ key: "site:" + st.id, name: st.name, raw: (st.altNames || []).join(" "), from: st.built, to: st.until ?? S.range[1], area: 5e5, emp: false, site: true, kind: "Site", legend: st.built == null })));
  // Beyond realms and sites: empire stories, wars and their battles, defining moments and notable rulers.
  const C = S.content, pri = { Empire: 6, War: 5, Moment: 4, Ruler: 2, Battle: 1, Event: 1 };
  for (const j of C.journeys) all.push({ key: "journey:" + j.id, name: j.name, raw: "", from: j.span[0], to: j.span[1], kind: "Empire", area: 9e9 });
  for (const w of C.wars) {
    all.push({ key: "war:" + w.id, name: w.name, raw: "", from: w.span[0], to: w.span[1], kind: "War", area: 9e9 });
    (w.events || []).forEach((e, i) => all.push({ key: `war:${w.id}:${i}`, name: e.text, raw: w.name, from: e.year, to: e.year, kind: e.kind === "battle" || /^(Battle|Siege) of/.test(e.text) ? "Battle" : "Event", area: 0 }));
  }
  for (const m of C.moments) all.push({ key: "moment:" + m.id, name: m.title, raw: m.place || "", from: m.year, to: m.year, when: m.yearLabel, kind: "Moment", area: 5e9 });
  const seenEmp = new Set();
  for (const e of Object.values(C.byClio)) {
    if (seenEmp.has(e.id)) continue; seenEmp.add(e.id);
    for (const x of e.rulers || []) {
      const ys = reignYears(x.reign || ""), clio = (e.clio || []).find((k) => realm(k) && ys && realm(k).tl.some(([f, t]) => f <= ys[0] && ys[0] <= t)) || (e.clio || []).find((k) => realm(k));
      if (clio) all.push({ key: `ruler:${clio}@${ys ? ys[0] : ""}`, name: x.name, raw: e.name, from: ys?.[0], to: ys?.[1], when: x.reign, kind: "Ruler", area: 0 });
    }
  }
  let active = 0, shown = [];
  const GROUPS = [["year", "Go to a year", 1], ["realm", "Empires and countries", 5], ["place", "Places", 3], ["story", "Stories", 5], ["Ruler", "Rulers", 3], ["event", "Battles and events", 3]];
  const groupOf = (e) => (e.kind === "Year" ? "year" : !e.kind ? "realm" : e.site ? "place" : e.kind === "Empire" || e.kind === "War" || e.kind === "Moment" ? "story" : e.kind === "Ruler" ? "Ruler" : "event");
  const mark = (e) => !e.kind ? `<span class="mk"><i style="background:${colorOf(e.key)}"></i></span>` : `<span class="mk">${e.site ? I.pin : e.kind === "War" || e.kind === "Battle" ? I.sword : e.kind === "Empire" ? I.book : e.kind === "Ruler" ? I.crown : e.kind === "Year" ? I.globe : I.today}</span>`;
  const meta = (e) => e.legend ? "Legend · not proven" : e.kind === "Empire" ? "Empire story" : e.kind === "War" ? `War story · ${shortYear(e.from)} to ${shortYear(e.to)}` : e.kind === "Moment" ? `Moment, ${esc(e.when || shortYear(e.from))}` : e.kind === "Year" ? "The world that year"
    : e.when ? esc(e.when) : e.from == null ? "" : e.from === e.to ? shortYear(e.from) : rangeText(e.from, e.to);
  const render = () => {
    const q = input.value.trim().toLowerCase();
    document.body.classList.toggle("searching", !!q || phone() && document.activeElement === input);
    if (!q) { list.hidden = true; return; }
    const pool = all.filter((e) => e.name.toLowerCase().includes(q) || e.raw.toLowerCase().includes(q))
      .sort((a, b) => (b.name.toLowerCase().startsWith(q) - a.name.toLowerCase().startsWith(q)) || ((pri[b.kind] || 3) - (pri[a.kind] || 3)) || (b.emp - a.emp) || (b.area - a.area));
    const ym = q.match(/^(\d{1,5})\s*(bce|bc|ce|ad)?$/);
    const yr = ym ? (/^b/.test(ym[2] || "") ? -+ym[1] : +ym[1]) : null;
    if (yr != null && yr >= S.range[0] && yr <= S.range[1] && yr !== 0) pool.unshift({ key: `year:${yr}`, name: `The world in ${plainYear(yr)}`, raw: "", kind: "Year" });
    shown = []; let h = "";
    for (const [g, title, n] of GROUPS) {
      const items = pool.filter((e) => groupOf(e) === g).slice(0, n);
      if (!items.length) continue;
      h += `<div class="grp">${title}</div>`;
      for (const e of items) { const i = shown.length; shown.push(e); h += `<div class="res${i ? "" : " active"}" role="option" data-k="${esc(e.key)}">${mark(e)}<span class="nm">${esc(e.name)}${e.raw && e.kind && e.kind !== "Moment" ? ` <small>· ${esc(e.raw)}</small>` : ""}</span><span class="meta">${meta(e)}</span>${i ? "" : `<span class="enter">Enter</span>`}</div>`; }
    }
    active = 0;
    list.innerHTML = shown.length ? h + `<div class="foot"><span>Type a year, such as 1857, to jump straight to it.</span><span>Enter to open</span></div>` : `<p class="none">Nothing matches “${esc(input.value.trim())}”. Try a year, such as 1857.</p>`;
    list.hidden = false;
  };
  const choose = (key) => {
    list.hidden = true; input.value = ""; input.blur(); document.body.classList.remove("searching");
    const [kind, rest] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
    if (kind === "year") return leaveToWorld(+rest);
    if (kind === "site") return openSite(rest);
    if (kind === "journey") { S.from = null; return openJourney(rest); }
    if (kind === "moment") { S.from = null; return openMoment(rest); }
    if (kind === "war") { S.from = null; const [id, ev] = rest.split(":"); return openWar(id, ev != null ? +ev : 0); }
    leaveStories(); S.place = null;
    if (kind === "ruler") { const at = rest.lastIndexOf("@"), k = rest.slice(0, at), y = rest.slice(at + 1); return jumpTo(k, y ? +y : bestYear(k)); }
    jumpTo(key, bestYear(key));
  };
  input.addEventListener("input", render);
  input.addEventListener("focus", () => { if (phone()) document.body.classList.add("searching"); render(); });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") { input.value = ""; render(); input.blur(); document.body.classList.remove("searching"); return; }
    if (list.hidden || !shown.length) return;
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault(); active = (active + (ev.key === "ArrowDown" ? 1 : shown.length - 1)) % shown.length;
      list.querySelectorAll(".res").forEach((li, i) => li.classList.toggle("active", i === active));
    } else if (ev.key === "Enter") { ev.preventDefault(); choose(shown[active].key); }
  });
  list.addEventListener("mousedown", (ev) => { const li = ev.target.closest("[data-k]"); if (li) { ev.preventDefault(); choose(li.dataset.k); } });
  input.addEventListener("blur", () => setTimeout(() => { list.hidden = true; if (!phone() || !input.value) document.body.classList.remove("searching"); }, 150));
  $("#searchCancel").addEventListener("click", () => { input.value = ""; list.hidden = true; input.blur(); document.body.classList.remove("searching"); });
}

// ---------------------------------------------------------------- UI wiring
const wholeWorld = () => { if (S.t.k > 1.05) d3.select(canvas).transition().duration(600).call(S.zoom.transform, d3.zoomIdentity); }; // lists show the whole world
function leaveStories() { stopPlay(); S.tstory = null; if (S.war) exitWar(); if (S.journey) exitJourney(); S.moment = null; S.site = null; hidePop(); }
async function goToday() {
  leaveStories(); S.from = null; S.sel = null; S.place = null; S.view = "today"; S.ghost = null;
  if (S.year !== HOME_YEAR) await go(HOME_YEAR);
  S.view = "today";
  d3.select(canvas).transition().duration(600).call(S.zoom.transform, d3.zoomIdentity);
  draw(); renderCol(true); writeHash();
}
function goMap() {
  leaveStories(); S.from = null; S.place = null;
  S.view = S.sel ? "realm" : "world";
  draw(); renderCol(true); writeHash();
}
function goStories(kind) {
  leaveStories(); S.from = null; S.sel = null; S.place = null;
  S.view = kind || S.lastList || "empires"; S.lastList = S.view; S.listHot = null;
  draw(); renderCol(true); writeHash(); wholeWorld();
}
function backFromStory() {
  if (S.tstory) return goToday();
  const kind = S.war ? "wars" : S.journey ? "empires" : "moments";
  const from = S.from;
  goStories(from && from !== "sources" ? from : kind);
}
async function continueStory() {
  const L = P.last; if (!L) return goStories();
  const s = L.k === "e" ? journeyById(L.id) : warById(L.id); if (!s) return goStories();
  const seen = new Set(P[L.k][L.id] || []), next = s.events.findIndex((_, i) => !seen.has(i)), i = next < 0 ? 0 : next;
  S.from = null;
  if (L.k === "w") return openWar(s.id, i);
  await openJourney(s.id, s.events[i].year); S.jEvent = i; renderCol(true);
}
function toast(msg) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); $("#app").append(t); }
  t.textContent = msg; t.classList.add("on"); clearTimeout(S.toastT); S.toastT = setTimeout(() => t.classList.remove("on"), 3500);
}
function setupUI() {
  new ResizeObserver(() => { const c = $("#col"); document.documentElement.style.setProperty("--sheet-h", `${c.innerHTML ? c.offsetHeight : 0}px`); }).observe($("#col"));
  document.addEventListener("click", (ev) => { // the section tabs, wherever they appear (header, phone tab bar, cards)
    const t = ev.target.closest("[data-tab]"); if (!t) return;
    ev.preventDefault(); $("#search").blur();
    const k = t.dataset.tab;
    if (k === "today") return goToday();
    if (k === "map") return goMap();
    if (k === "stories") return goStories();
    if (k === "search") { document.body.classList.add("searching"); return $("#search").focus(); }
  });
  $("#home").onclick = (ev) => { ev.preventDefault(); goToday(); };
  $("#sourcesLink").onclick = (ev) => { ev.preventDefault(); openAbout(); };
  const lb = $("#layersBtn"), lp = $("#layersPanel");
  lb.onclick = () => { const open = lp.hidden; lp.hidden = !open; lb.setAttribute("aria-expanded", open); };
  document.addEventListener("pointerdown", (ev) => { if (!lp.hidden && !ev.target.closest("#mapTools")) { lp.hidden = true; lb.setAttribute("aria-expanded", "false"); } });
  $("#zoomIn").onclick = () => d3.select(canvas).transition().duration(300).call(S.zoom.scaleBy, 1.6);
  $("#zoomOut").onclick = () => d3.select(canvas).transition().duration(300).call(S.zoom.scaleBy, 1 / 1.6);
  $("#zoomReset").onclick = () => d3.select(canvas).transition().duration(600).call(S.zoom.transform, d3.zoomIdentity);
  $("#labelsBtn").onchange = (ev) => { S.labels = ev.target.checked; draw(); };
  $("#peoplesBtn").onchange = (ev) => { S.peoples = ev.target.checked; buildItems(); draw(); };
  try { S.relief = localStorage.getItem("atlas.terrain") === "on"; } catch { S.relief = false; } // off unless the viewer turned it on
  $("#terrainBtn").checked = !!S.relief;
  if (!GL) $("#terrainRow").hidden = true; // shading needs WebGL
  $("#terrainBtn").onchange = (ev) => { S.relief = ev.target.checked; try { localStorage.setItem("atlas.terrain", S.relief ? "on" : "off"); } catch {} draw(); };
  $("#compare").addEventListener("click", (ev) => { if (ev.target.closest("[data-act=compare]")) { S.compare = false; syncChrome(); renderDock(); } });

  const onStoryClick = async (ev) => { // clicks inside the card, the side card and the map popover
    const act = ev.target.closest("[data-act]")?.dataset.act;
    if (act) {
      if (act === "back") return backFromStory();
      if (act === "king-close") { S.jKing = null; return renderCol(true); }
      if (act === "today") return goToday();
      if (act === "tstory") return openTodayStory(0);
      if (act === "about") return openAbout();
      if (act === "pop-close") return hidePop();
      if (act === "close") { S.realmPlace = null; return select(null); }
      if (act === "place") { const ll = S.pop?.ll || S.realmPlace?.ll || S.clickLL; if (ll) return openPlace(ll, { from: S.sel || S.pop?.key ? S.sel : null }); return; }
      if (act === "pickplace") { S.picking = true; canvas.classList.add("picking"); return toast("Click any spot on the map to see who ruled it."); }
      if (act === "myplace") { const mp = myPlace(); if (mp) return openPlace(mp.ll, { name: mp.name, from: "today" }); S.picking = true; canvas.classList.add("picking"); return toast("Click any spot on the map to see who ruled it."); }
      if (act === "continue") return continueStory();
      if (act === "share") {
        const url = location.origin + location.pathname, text = S.today ? `${S.today.e.label}: ${S.today.e.text}` : "The World Atlas";
        if (navigator.share) return navigator.share({ title: "The World Atlas", text, url }).catch(() => {});
        return navigator.clipboard?.writeText(`${text} ${url}`).then(() => toast("Link copied"), () => toast(url));
      }
      if (act === "close-place") {
        const from = S.place?.from; S.place = null;
        if (from === "today") return goToday();
        S.view = from ? "realm" : "world"; S.sel = from || null; draw(); writeHash(); return renderCol(true);
      }
      if (act === "close-site") { S.view = "world"; S.site = null; draw(); writeHash(); if (goBack()) return; return renderCol(true); }
      if (act === "world") { const wasDrill = DRILLS.has(S.view); S.view = "world"; S.moment = null; draw(); writeHash(); if (wasDrill && goBack()) return; S.from = null; return renderCol(true); }
    }
    const t = ev.target.closest("button, [data-key], [data-year], .goto, [data-member], svg.chart-s"); if (!t) return;
    const d = t.dataset;
    if (d.more) { S.worldMore = S.worldMore === d.more ? null : d.more; return renderCol(false); }
    if (d.stab) { S.view = S.lastList = d.stab; S.listHot = null; draw(); writeHash(); return renderCol(true); }
    if (d.period) { S.period = d.period; return renderCol(true); }
    if (d.jtab) { S.jTab = d.jtab; return renderCol(true); }
    if (d.wtab) { S.wTab = d.wtab; return renderCol(true); }
    if (d.tstep != null) return openTodayStory(+d.tstep);
    if (d.moment) return openMoment(d.moment);
    if (d.site) return openSite(d.site);
    if (d.wev != null && S.war) { stopPlay(); S.tstory = null; return goWarEvent(+d.wev); }
    if (d.chap != null && story()) { S.tstory = null; return openChapter(+d.chap); }
    if (d.war) { hidePop(); return S.war?.id === d.war ? (S.tstory = null, renderCol(true)) : openWar(d.war); }
    if (d.journey) { hidePop(); return openJourney(d.journey); }
    if (d.king != null && S.journey) return openKing(+d.king);
    if (d.jev != null && S.journey) { const e = S.journey.events[+d.jev]; S.jEvent = +d.jev; S.jKing = null; stopPlay(); return go(e.year); }
    if (d.pkey) { stopPlay(); const y = +d.pyear; await go(y); renderCol(false); draw(); return; } // stay on the place, move the map to that year
    if (d.rkey) { stopPlay(); const ll = S.realmPlace?.ll; await go(+d.pyear); return select(d.rkey, { ll }); }
    if (d.key) { stopPlay(); hidePop(); return select(d.key, { fly: true, ll: S.pop?.ll }); }
    if (d.year) { stopPlay(); return go(+d.year); }
    if (t.classList.contains("goto")) return flyToRegion(JSON.parse(d.bb));
    if (d.member) return select(d.member, { fly: true });
    if (t.matches("svg.chart-s")) { const r = t.getBoundingClientRect(); stopPlay(); go(+d.x0 + ((ev.clientX - r.left) / r.width) * (+d.x1 - +d.x0)); }
  };
  for (const id of ["#col", "#side", "#pop"]) $(id).addEventListener("click", onStoryClick);
  $("#col").addEventListener("change", (ev) => { if (ev.target.id === "ghostToggle") { S.showGhost = ev.target.checked; draw(); } });
  const hotFromRow = (ev) => { // pointing at a list row picks out its pin on the map and its span on the time bar
    if (!listOnMap()) return;
    const row = ev.target.closest?.(".srow");
    const id = row ? row.dataset.moment || row.dataset.war || row.dataset.journey : null;
    if (!id || id === S.listHot) return;
    S.listHot = id; draw(); renderSide(); dockMarks();
    document.querySelectorAll("#col .srow").forEach((r) => r.classList.toggle("hot", r === row));
  };
  $("#col").addEventListener("mouseover", hotFromRow);
  addEventListener("hashchange", async () => { // typed links and the browser's Back/Forward
    S.restoring = true;
    try { await applyHash(parseHash()); } finally { setTimeout(() => (S.restoring = false), 0); }
  });
  addEventListener("resize", () => renderSide());
  addEventListener("keydown", (ev) => {
    if (ev.target.matches("input, textarea")) return;
    const step = ev.shiftKey ? 1 : 10;
    if (ev.key === "Escape") { if (S.pop) return hidePop(); if (S.picking) { S.picking = false; canvas.classList.remove("picking"); return; } if (S.war || S.journey || S.view === "moment") return backFromStory(); if (S.sel) return select(null); return; }
    if (S.tstory && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) return openTodayStory(S.tstory.step + (ev.key === "ArrowRight" ? 1 : -1));
    if (story() && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) { stopPlay(); const evs = chapterEvents(S.cine.chapters[S.chap]), k = evs.findIndex((x) => x.i === S.wIdx), n = ev.key === "ArrowRight" ? evs[k + 1] : evs[k - 1]; return n ? goWarEvent(n.i) : openChapter(S.chap + (ev.key === "ArrowRight" ? 1 : -1)); }
    if (S.war && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) { stopPlay(); return goWarEvent(S.wIdx + (ev.key === "ArrowRight" ? 1 : -1)); }
    if (S.journey && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) { stopPlay(); const j = S.journey, i = Math.max(0, Math.min(j.events.length - 1, jEventIdx(j) + (ev.key === "ArrowRight" ? 1 : -1))); S.jEvent = i; return go(j.events[i].year); }
    if (S.view === "moment" && S.moment && (ev.key === "ArrowLeft" || ev.key === "ArrowRight")) { const L = S.content.moments, n = L[L.indexOf(S.moment) + (ev.key === "ArrowRight" ? 1 : -1)]; return n && openMoment(n.id); }
    if (ev.key === "ArrowLeft") { stopPlay(); go(S.year - step); }
    else if (ev.key === "ArrowRight") { stopPlay(); go(S.year + step); }
    else if (ev.key === "PageUp" || ev.key === "[") { stopPlay(); stepChapter(-1); }
    else if (ev.key === "PageDown" || ev.key === "]") { stopPlay(); stepChapter(1); }
    else if (ev.key === " " && !ev.target.matches("button, summary, a")) { ev.preventDefault(); togglePlay(); }
  });
}
function openAbout() { leaveStories(); S.from = null; S.view = "sources"; renderCol(true); writeHash(); }

Promise.all([document.fonts.load("900 40px Archivo"), document.fonts.load("600 14px Archivo"), document.fonts.load("400 14px Inter")])
  .catch(() => {}).finally(() => init().catch((e) => {
    console.error(e);
    $("#loading").textContent = "Could not load the map. Please reload the page.";
  }));
})();
