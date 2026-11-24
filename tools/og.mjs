#!/usr/bin/env node
/* Share images (1200 x 630) for the atlas's pages: the real map at that view, with a caption card.

   A link to worldatlas.site/#w/... always previews as the home page, because the part after # never reaches a server. The plain
   pages (/wars/..., /moments/..., /empires/..., /eras/..., /realms/...) are what gets shared, and each can name its own picture. This draws
   those pictures: it opens World history (public/world.html) in a headless Chrome at each view, hides the page's controls, puts
   a caption card where the atlas's own card sits, and saves a JPEG.

     node tools/og.mjs --sample DIR          a few of each kind into DIR, to look at
     node tools/og.mjs [--only wars,moments] [--out public/og]     the full run
     node tools/og.mjs --only realms --shard 1/3                   one of three runs side by side
     Realm pages are read from public/realms/, so run tools/seo.py first.

   Needs the site served locally (python3 tools/serve.py, or any static server on public/) and Google Chrome installed.
   Nothing is installed: Chrome is driven over its debugging port with Node's own WebSocket. */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, mkdtempSync, rmSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i < 0 ? d : process.argv[i + 1]; };
const SAMPLE = arg("--sample", null), OUT = SAMPLE || join(ROOT, arg("--out", "public/og"));
const BASE = arg("--base", "http://localhost:8767"), ONLY = arg("--only", "").split(",").filter(Boolean);
const IDS = arg("--ids", "").split(",").filter(Boolean); // --ids a,b with --sample: those pages
const CHROME = arg("--chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
const W = 1200, H = 630, PORT = 9300 + Math.floor(Math.random() * 500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- what to draw: one entry a page, from the same data the pages are written from
const J = (...p) => JSON.parse(readFileSync(join(ROOT, "public", "data", ...p), "utf8"));
const C = J("content.json");
const whole = (kind, o) => { const p = join(ROOT, "public", "data", "story", `${kind}-${o.id}.json`); return existsSync(p) ? { ...o, ...JSON.parse(readFileSync(p, "utf8")) } : o; };
// the first whole sentence: not cut at "c." or an initial, nor inside brackets, nor so short that it says nothing
const first = (t) => { let out = ""; for (const p of String(t || "").match(/[^.!?]+(?:[.!?]+["'”’)]?|$)\s*/g) || []) { out += p; const s = out.trim();
  if (s.length >= 60 && !/(?:\b(?:c|ca|St|Mt|Dr|Mr|vs|No|approx)|\b[A-Z])\.$/.test(s) && (s.match(/\(/g) || []).length <= (s.match(/\)/g) || []).length) break; } return out.trim(); };
const pts = (list) => (list || []).map((e) => e.lonlat).filter((p) => Array.isArray(p) && p.length === 2);
const yr = (y) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : String(y));
const span = (a, b) => (a < 0 && b < 0 ? `${-a} to ${-b} BCE` : `${yr(a)} to ${b >= 2026 ? "today" : yr(b)}`);
const items = [];
for (const w0 of C.wars) { const w = whole("w", w0); items.push({ sec: "wars", id: w.id, hash: `w/${w.id}`, focus: pts(w.events), kick: `War, ${w.dateLabel || span(...w.span)}`, title: w.name, line: first(w.summary) }); }
for (const m of C.moments) items.push({ sec: "moments", id: m.id, hash: `m/${m.id}`, focus: pts([m]), kick: `A moment that changed the world, ${m.yearLabel || yr(m.year)}`, title: m.title, line: first(m.summary) });
const EMP = Object.fromEntries(C.empires.map((e) => [e.id, e]));
for (const j0 of C.journeys) { const j = whole("e", j0), pk = EMP[j.profile]?.peak?.year, at = pk != null && pk >= j.span[0] && pk <= j.span[1] ? pk : Math.round((j.span[0] + j.span[1]) / 2); // drawn at its height
  items.push({ sec: "empires", id: j.id, hash: `e/${j.id}/${at}`, focus: pts(j.events), kick: `Empire, ${span(...j.span)}`, title: j.name, line: first(j.summary) }); }
for (const e of C.eras) items.push({ sec: "eras", id: String(e.year), hash: String(e.year), kick: `The world in ${yr(e.year)}`, title: e.title, line: first(e.overview) });
// Realm pages (/realms/<slug>/): read from the pages tools/seo.py wrote (run it first), so the slugs, names and the view each page
// links to ("See ... on the map in <its peak year>") are the pages' own. The line is the state's profile, else its short note.
const unesc = (t) => String(t).replace(/&(amp|lt|gt|quot|#x27|#39);/g, (m, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'", "#39": "'" }[e]));
const RD = join(ROOT, "public", "realms");
if (existsSync(RD)) {
  const notes = existsSync(join(ROOT, "public", "data", "realm-notes.json")) ? J("realm-notes.json") : {}, prof = {};
  for (const e of C.empires) for (const n of [...(e.clio || []), ...(e.recon || [])]) prof[n] = e;
  for (const slug of readdirSync(RD).sort()) {
    const f = join(RD, slug, "index.html"); if (!existsSync(f)) continue;
    const h = readFileSync(f, "utf8"), m = h.match(/href="\/#(-?\d+)\/([^"]+)"[^>]*>See /); if (!m) continue;
    const name = decodeURIComponent(m[2]), title = unesc(h.match(/<h1>([^<]*)<\/h1>/)?.[1] || name);
    const lede = unesc(h.match(/<p class="lede">([^<]*)/)?.[1] || "");
    items.push({ sec: "realms", id: slug, hash: `${m[1]}/${m[2]}`, kicker: unesc(h.match(/<p class="kicker">([^<]*)/)?.[1] || ""), kick: unesc(h.match(/<p class="kicker">([^<]*)/)?.[1] || "").replace(" · ", ", "), title, line: first(prof[name]?.summary || notes[name]?.text || lede) });
  }
}
// The Earth's periods and stories (/earth/..., also from the pages tools/seo.py wrote): the globe of the home page at that time
const ED = join(ROOT, "public", "earth"), EH = J("earth-history.json");
for (const [dir, pre] of [[ED, ""], [join(ED, "stories"), "story-"]]) if (existsSync(dir)) for (const slug of readdirSync(dir).sort()) {
  const f = join(dir, slug, "index.html"); if (!existsSync(f) || slug === "stories") continue;
  const h = readFileSync(f, "utf8"), m = h.match(/href="\/#(earth\/[^"]+)"/); if (!m) continue;
  const st = pre && EH.stories.find((x) => x.id === slug), kicker = unesc(h.match(/<p class="kicker">([^<]*)/)?.[1] || "");
  // a period: its tagline, then the opening sentences of its text until they fill two or three lines (a long one is cut with an ellipsis)
  const u = !pre && EH.units.find((x) => x.id === slug); let open = "";
  for (const t of u ? `${u.world || ""} ${u.life || ""}`.trim().split(/(?<=[.!?])\s+(?=[A-Z])/) : []) { if (open.length >= 80) break; open = `${open} ${t}`.trim(); } // in order, none skipped: "they" and "that" must keep what they point to
  const at = st ? `earth/${st.chapters[Math.floor(st.chapters.length / 2)].ma}` : m[1]; // a story: the globe of its middle chapter
  items.push({ sec: "earth", id: pre + slug, page: "index.html?theme=sage", hash: at, kicker, kick: kicker, title: unesc(h.match(/<h1>([^<]*)/)?.[1] || slug), tag: u?.tagline || "", line: u ? open : first(unesc(h.match(/<p class="lede">([^<]*)/)?.[1] || "")) });
}
let todo = items.filter((it) => !ONLY.length || ONLY.includes(it.sec));
if (!SAMPLE && !process.argv.includes("--force")) todo = todo.filter((it) => !existsSync(join(OUT, it.sec, `${it.id}.jpg`))); // a run that stopped picks up where it left off
const [SH, OF] = arg("--shard", "1/1").split("/").map(Number); // --shard 2/3: every third page, from the second, to run three at once
todo = todo.filter((it, i) => i % OF === SH - 1);
if (SAMPLE && IDS.length) todo = IDS.map((id) => todo.find((it) => it.id === id)).filter(Boolean);
else if (SAMPLE) { const pick = { wars: ["peloponnesian-war", "world-war-ii"], moments: ["egypt-unified", "moon-landing"], empires: ["rome", "mongol"], eras: ["1492", "-500"], realms: ["kanva-dynasty", "mahan", "jalayirid-sultanate", "licchavi-kingdom-of-nepal", "republic-of-india"] };
  todo = Object.entries(pick).filter(([sec]) => !ONLY.length || ONLY.includes(sec)).flatMap(([sec, ids]) => ids.map((id) => items.find((it) => it.sec === sec && it.id === id) || items.find((it) => it.sec === sec))).filter((v, i, a) => v && a.indexOf(v) === i); }

// ---------------------------------------------------------------- Chrome, over its debugging port
const profile = mkdtempSync(join(tmpdir(), "atlas-og-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, `--window-size=${W},${H}`, "--hide-scrollbars", "--no-first-run", "--mute-audio", "--enable-unsafe-swiftshader", "about:blank"], { stdio: "ignore" });
const done = () => { try { chrome.kill(); } catch (e) {} try { rmSync(profile, { recursive: true, force: true }); } catch (e) {} };
process.on("exit", done); process.on("SIGINT", () => process.exit(1)); process.on("SIGTERM", () => process.exit(1));
// Every call has a time limit: a tab that stops answering (it happened once, 540 pictures in) is closed and a fresh one opened.
let target = null, ws = null, seq = 0; const waiting = new Map();
for (let i = 0; i < 60 && !target; i++) { await sleep(250); try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); target = l.find((t) => t.type === "page"); } catch (e) {} }
if (!target) { console.error("og: Chrome did not start"); process.exit(1); }
const cdp = (method, params = {}, ms = 30000) => new Promise((r, x) => { const id = ++seq;
  const t = setTimeout(() => { waiting.delete(id); x(new Error(`${method} took over ${ms / 1000} s`)); }, ms);
  waiting.set(id, { r: (v) => { clearTimeout(t); r(v); }, x: (e) => { clearTimeout(t); x(e); } }); ws.send(JSON.stringify({ id, method, params })); });
const attach = async () => {
  ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r, x) => { ws.onopen = r; ws.onerror = x; });
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && waiting.has(m.id)) { const { r, x } = waiting.get(m.id); waiting.delete(m.id); m.error ? x(new Error(m.error.message)) : r(m.result); } };
  await cdp("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false }); };
const freshTab = async () => { const old = target; try { ws.close(); } catch (e) {} for (const { x } of waiting.values()) x(new Error("tab replaced")); waiting.clear();
  target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  try { await fetch(`http://127.0.0.1:${PORT}/json/close/${old.id}`); } catch (e) {} await attach(); };
await attach();
const js = async (expression) => { const r = await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };

// The page's own controls go; the caption card takes the place of the atlas's card, which the map is already framed beside.
const HIDE = `
  #bar, #dock, #col, #mapTools, #legend, #noRecords, #tooltip, #pop, #side, #chart, #tabbar, #toast, #cine, #sheet, #compare, #stopbar, #framebar,
  #strip, #viewSeg, #todayBtn, #card, #story, #sdock, #marks, #themeBtn, #ps, #ptabs, #plogo, #ptop, .rp-fab { display: none !important; }`;
// Two layouts, each with BOX, the room it leaves the subject. card (wars, moments, empires, eras): a caption card at the left,
// the map beside it. note (realms): the map fades into white paper at the left, under the name, a line and the years in big
// numerals. --style picks one for every page; bare (the map alone, for designing a layout) takes --box x0,y0,x1,y1.
const STYLES = { card: `
  #ogcap { position: fixed; z-index: 99; left: 28px; top: 28px; bottom: 28px; width: 396px; box-sizing: border-box; padding: 30px 30px 26px; display: flex; flex-direction: column;
    border: 1px solid #111; border-radius: 16px; background: #fff; box-shadow: 0 12px 34px rgba(0,0,0,.14); color: #111; font-family: Inter, system-ui, sans-serif; }
  #ogcap .b { display: flex; align-items: center; gap: 10px; font: 800 15px/1 "Source Serif 4", Georgia, serif; letter-spacing: .1em; }
  #ogcap .b img { width: 34px; height: 24px; }
  #ogcap .t { display: contents; } #ogcap .g:empty { display: none; }
  #ogcap .k { margin-top: auto; font: 600 15px/1.35 Inter, sans-serif; color: #c8321e; }
  #ogcap h1 { margin: 10px 0 0; font: 800 44px/1.06 "Source Serif 4", Georgia, serif; letter-spacing: -.01em; overflow-wrap: break-word; }
  #ogcap h1.m { font-size: 37px; } #ogcap h1.s { font-size: 31px; }
  #ogcap p { margin: 16px 0 0; font: 400 18px/1.42 Inter, sans-serif; color: #2b2b28; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5; overflow: hidden; }
  #ogcap .y { display: none; }
  #ogcap .u { margin-top: 20px; padding-top: 14px; border-top: 1px solid #e3e3dd; font: 500 14px/1 Inter, sans-serif; color: #5e5e59; }`,
  note: `
  #ogcap { position: fixed; z-index: 99; inset: 0; pointer-events: none; color: #111; font-family: Inter, system-ui, sans-serif; }
  #ogcap::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 600px; background: linear-gradient(90deg, #fff 0, #fff 400px, rgba(255,255,255,0) 600px); }
  #ogcap .b { position: absolute; left: 52px; top: 46px; display: flex; align-items: center; gap: 10px; font: 800 13px/1 "Source Serif 4", Georgia, serif; letter-spacing: .16em; }
  #ogcap .b img { width: 30px; height: 21px; }
  #ogcap .t { position: absolute; left: 52px; top: 121px; width: 400px; }
  #ogcap .k { font: 600 13px/1.2 Inter, sans-serif; letter-spacing: .18em; text-transform: uppercase; color: #c8321e; }
  #ogcap h1 { margin: 12px 0 0; font: 800 58px/1.02 "Source Serif 4", Georgia, serif; letter-spacing: -.015em; }
  #ogcap h1.m { font-size: 48px; } #ogcap h1.s { font-size: 40px; }
  #ogcap p { margin: 20px 0 0; width: 352px; font: 400 17px/1.5 Inter, sans-serif; color: #3b3b37; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
  #ogcap .y { position: absolute; left: 52px; bottom: 68px; font: 800 76px/.9 "Source Serif 4", Georgia, serif; letter-spacing: -.02em; color: #c8321e; white-space: nowrap; }
  #ogcap .y.m { font-size: 58px; } #ogcap .y.s { font-size: 44px; }
  #ogcap .u { position: absolute; left: 52px; bottom: 44px; font: 500 14px/1 Inter, sans-serif; color: #5e5e59; }`,
  globe: `
  html[data-theme] { --page: #fff !important; }
  #globe { transform: translateX(90px); }
  #ogcap { zoom: 1.33333; }
  #ogcap .g { margin: 18px 0 0; width: 352px; font: 600 17px/1.4 Inter, sans-serif; color: #111; }
  #ogcap .g:not(:empty) + p { margin-top: 8px; }
  #ogcap .y small { display: block; margin-top: 8px; font: 600 18px/1 Inter, sans-serif; letter-spacing: 0; }`,
  bare: `
  #ogcap { display: none !important; }`,
};
STYLES.globe = STYLES.note + STYLES.globe; // the Earth: the same paper, over the globe (drawn in a larger window, so the globe fills more of it)
const BOXES = { card: [452, 36, W - 28, H - 36], note: [440, 60, W - 50, H - 40], bare: [28, 28, W - 28, H - 28] };
const styleOf = (it) => arg("--style", it.sec === "realms" ? "note" : it.sec === "earth" ? "globe" : "card");
const boxOf = (it) => (arg("--box", "") ? arg("--box").split(",").map(Number) : BOXES[styleOf(it)]);
const setup = `(() => { if (document.getElementById("ogcap")) return; const s = document.createElement("style"); s.id = "ogstyle"; document.head.append(s);
  const d = document.createElement("div"); d.id = "ogcap"; d.innerHTML = '<div class="b"><img src="logo.png" alt="">THE WORLD ATLAS</div><div class="t"><div class="k"></div><h1></h1><div class="g"></div><p></p></div><div class="y"></div><div class="u">worldatlas.site</div>'; document.body.append(d); })()`;
// note: the kicker ("Realm · approximate borders · 1574–1708") splits into its label and the years, which get the numerals
const caption = (it) => { const st = styleOf(it), parts = it.kicker ? it.kicker.split(" · ") : [], yrs = (st === "note" || st === "globe") && parts.length > 1 && /\d/.test(parts.at(-1)) ? parts.pop().replace(/ \(.*\)$/, "") : "";
  const yl = st === "globe" ? yrs.replace(/ to /, "–").replace(/ (?:billion |million )?years ago$/, "").length : yrs.length;
  const kick = (st === "note" || st === "globe") && it.kicker ? parts.join(", ") : it.kick;
  return `(() => { document.getElementById("ogstyle").textContent = ${JSON.stringify(HIDE + STYLES[st])};
  const c = document.getElementById("ogcap"), h = c.querySelector("h1"), y = c.querySelector(".y"); c.querySelector(".k").textContent = ${JSON.stringify(kick)}; h.textContent = ${JSON.stringify(it.title)};
  h.className = ${JSON.stringify(it.title)}.length > 44 ? "s" : ${JSON.stringify(it.title)}.length > 24 ? "m" : ""; c.querySelector("p").textContent = ${JSON.stringify(it.line)}; c.querySelector(".g").textContent = ${JSON.stringify(it.tag || "")};
  h.style.fontSize = ""; if (${(st === "note" || st === "globe")}) for (const z of [48, 40, 34, 29, 25, 22]) { if (h.offsetHeight <= 182 && h.scrollWidth <= h.clientWidth) break; h.style.fontSize = z + "px"; } // the whole name, never cut off
  y.innerHTML = ${JSON.stringify(st === "globe" ? yrs.replace(/ to /, "–").replace(/ ((?:billion |million )?years ago)$/, "<small>$1</small>") : yrs)}; y.className = "y" + (${yl} > 13 ? " s" : ${yl} > 9 ? " m" : ""); })()`; };
// settled: the loading note is gone, the fonts are in, and nothing has been fetched for a moment (borders, a war's layers)
const settle = async (min) => { await sleep(min); for (let i = 0; i < 40; i++) { const ok = await js(`(async () => { await document.fonts.ready; const n = performance.getEntriesByType("resource").length; await new Promise((r) => setTimeout(r, 450)); return !document.querySelector("#loading") && performance.getEntriesByType("resource").length === n; })()`); if (ok) return; } };

// The atlas frames a view for its own page. Here the caption card is wider, so the subject (a moment's place, a war's or an empire's
// events) is moved to the middle of the room beside the card, and the map zoomed out if they would not fit there.
const FRAME = `((P, box, zin, area) => { const c = document.querySelector("#map"), r = c.getBoundingClientRect(), z = c.__zoom; if (!z || !P.length) return false;
  const edge = []; for (let lon = -180; lon <= 180; lon += 5) edge.push([lon, 84], [lon, -57]); for (let lat = -57; lat <= 84; lat += 3) edge.push([-180, lat], [180, lat]);
  const pj = d3.geoNaturalEarth1().fitExtent([[10, 8], [r.width - 56, r.height - 30]], { type: "MultiPoint", coordinates: edge }), Q = P.map((p) => pj(p)).filter(Boolean); if (!Q.length) return false;
  const xs = Q.map((q) => q[0]).sort((a, b) => a - b), ys = Q.map((q) => q[1]).sort((a, b) => a - b), cut = Q.length > 8 ? 1 : 0; // one far-off event does not set the frame
  const x0 = xs[cut], x1 = xs[xs.length - 1 - cut], y0 = ys[cut], y1 = ys[ys.length - 1 - cut], [L, T, R, B] = box;
  const fit = Math.min((R - L) * (zin ? .6 : .8) / Math.max(1e-6, (x1 - x0) * z.k), (B - T) * (zin ? .6 : .8) / Math.max(1e-6, (y1 - y0) * z.k));
  const k = zin ? Math.max(1, Math.min(zin, z.k * fit)) : Math.max(1, z.k * Math.min(1, fit)); // zin: may zoom in, up to that scale, to a realm's shape
  c.__zoom = d3.zoomIdentity.translate((L + R) / 2 - k * (x0 + x1) / 2, (T + B) / 2 - k * (y0 + y1) / 2).scale(k);
  document.getElementById("ogring")?.remove();
  if (area && area * k * k < 320) { // too small to see: a red ring round it (an oval clear of the corners of its box)
    const m = c.__zoom, d = document.createElement("div"), w = (x1 - x0) * k * 1.42 + 40, h = (y1 - y0) * k * 1.42 + 40; d.id = "ogring";
    d.style.cssText = "position:fixed;z-index:98;box-sizing:border-box;border:3px solid #e8432d;border-radius:50%;width:" + w + "px;height:" + h + "px;left:" + (r.left + m.applyX((x0 + x1) / 2) - w / 2) + "px;top:" + (r.top + m.applyY((y0 + y1) / 2) - h / 2) + "px"; document.body.append(d); }
  c.dispatchEvent(new WheelEvent("wheel", { deltaY: .5, clientX: (L + R) / 2, clientY: (T + B) / 2, bubbles: true, cancelable: true })); return true; })`;
let loaded = 0, n = 0; const t0 = Date.now(), failed = [];
const draw = async (it) => {
  const url = `${BASE}/${it.page || "world.html"}#${it.hash}`, big = it.sec === "earth" ? 4 / 3 : 1;
  if (it.page) { loaded = 0; await cdp("Emulation.setDeviceMetricsOverride", { width: W * big, height: H * big, deviceScaleFactor: 1, mobile: false }); await cdp("Page.navigate", { url: "about:blank" }); await sleep(200); } // a page of its own each time
  if (!loaded || loaded > 100) { await cdp("Page.navigate", { url }); loaded = 1; await settle(2500); } // a fresh page every 100 pictures
  else { await js(`location.hash = ${JSON.stringify("#" + it.hash)}`); loaded++; await settle(1400); }
  await js(setup); await js(caption(it));
  let focus = it.focus, zin = 0, area = 0;
  if (it.sec === "earth") await js("S.lon = 12; S.lat = 6; fly = null; S.dirty = true"); // every globe faces the same way (its page turns to a turning point)
  if (it.sec === "realms") { const bb = await js("window.atlasSelBox ? window.atlasSelBox() : null"); // the realm's own shape, filling about 60% of the room
    if (bb && bb[0][0] <= bb[1][0]) { focus = [bb[0], bb[1], [bb[0][0], bb[1][1]], [bb[1][0], bb[0][1]]]; zin = 24; area = bb[2]; } else console.log(`og: ${it.id}: ${bb ? "crosses the date line" : "no shape on the map"}; the atlas's own view is used`); } // 24: as close as the atlas itself goes
  if (focus?.length) await js(`${FRAME}(${JSON.stringify(focus)}, ${JSON.stringify(boxOf(it))}, ${zin}, ${area})`);
  await sleep(450); // the map's cross-fade, and the redraw after the move
  const shot = await cdp("Page.captureScreenshot", { format: "jpeg", quality: 78, clip: { x: 0, y: 0, width: W * big, height: H * big, scale: 1 / big } });
  const file = join(OUT, it.sec, `${it.id}.jpg`); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, Buffer.from(shot.data, "base64")); };
for (const it of todo) {
  let ok = false;
  for (let tries = 0; tries < 2 && !ok; tries++) {
    try { await draw(it); ok = true; }
    catch (e) { console.log(`og: ${it.sec}/${it.id}: ${e.message}; opening a fresh tab`); loaded = 0; try { await freshTab(); } catch (e2) { console.error(`og: no fresh tab: ${e2.message}`); process.exit(1); } }
  }
  if (!ok) failed.push(`${it.sec}/${it.id}`);
  if (++n % 20 === 0 || SAMPLE) console.log(`og: ${n}/${todo.length} ${it.sec}/${it.id}`);
}
console.log(`og: ${n - failed.length} images in ${Math.round((Date.now() - t0) / 1000)} s -> ${OUT}`);
if (failed.length) console.log(`og: not drawn (run again to retry): ${failed.join(", ")}`);
ws.close(); done(); process.exit(0);
