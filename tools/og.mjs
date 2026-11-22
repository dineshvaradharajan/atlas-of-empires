#!/usr/bin/env node
/* Share images (1200 x 630) for the atlas's pages: the real map at that view, with a caption card.

   A link to worldatlas.site/#w/... always previews as the home page, because the part after # never reaches a server. The plain
   pages (/wars/..., /moments/..., /empires/..., /eras/...) are what gets shared, and each can name its own picture. This draws
   those pictures: it opens World history (public/world.html) in a headless Chrome at each view, hides the page's controls, puts
   a caption card where the atlas's own card sits, and saves a JPEG.

     node tools/og.mjs --sample DIR          a few of each kind into DIR, to look at
     node tools/og.mjs [--only wars,moments] [--out public/og]     the full run

   Needs the site served locally (python3 tools/serve.py, or any static server on public/) and Google Chrome installed.
   Nothing is installed: Chrome is driven over its debugging port with Node's own WebSocket. */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i < 0 ? d : process.argv[i + 1]; };
const SAMPLE = arg("--sample", null), OUT = SAMPLE || join(ROOT, arg("--out", "public/og"));
const BASE = arg("--base", "http://localhost:8767"), ONLY = arg("--only", "").split(",").filter(Boolean);
const CHROME = arg("--chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
const W = 1200, H = 630, PORT = 9300 + Math.floor(Math.random() * 500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- what to draw: one entry a page, from the same data the pages are written from
const J = (...p) => JSON.parse(readFileSync(join(ROOT, "public", "data", ...p), "utf8"));
const C = J("content.json");
const whole = (kind, o) => { const p = join(ROOT, "public", "data", "story", `${kind}-${o.id}.json`); return existsSync(p) ? { ...o, ...JSON.parse(readFileSync(p, "utf8")) } : o; };
const first = (t, n = 1) => (String(t || "").match(/[^.!?]+(?:[.!?]+["'”’)]?|$)\s*/g) || []).slice(0, n).join("").trim();
const yr = (y) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : String(y));
const span = (a, b) => (a < 0 && b < 0 ? `${-a} to ${-b} BCE` : `${yr(a)} to ${b >= 2026 ? "today" : yr(b)}`);
const items = [];
for (const w0 of C.wars) { const w = whole("w", w0); items.push({ sec: "wars", id: w.id, hash: `w/${w.id}`, kick: `War, ${w.dateLabel || span(...w.span)}`, title: w.name, line: first(w.summary) }); }
for (const m of C.moments) items.push({ sec: "moments", id: m.id, hash: `m/${m.id}`, kick: `A moment that changed the world, ${m.yearLabel || yr(m.year)}`, title: m.title, line: first(m.summary) });
for (const j0 of C.journeys) { const j = whole("e", j0); items.push({ sec: "empires", id: j.id, hash: `e/${j.id}`, kick: `Empire, ${span(...j.span)}`, title: j.name, line: first(j.summary) }); }
for (const e of C.eras) items.push({ sec: "eras", id: String(e.year), hash: String(e.year), kick: `The world in ${yr(e.year)}`, title: e.title, line: first(e.overview) });
let todo = items.filter((it) => !ONLY.length || ONLY.includes(it.sec));
if (SAMPLE) { const pick = { wars: ["peloponnesian-war", "world-war-ii"], moments: ["egypt-unified", "moon-landing"], empires: ["rome", "mongol"], eras: ["1492", "-500"] };
  todo = Object.entries(pick).flatMap(([sec, ids]) => ids.map((id) => items.find((it) => it.sec === sec && it.id === id) || items.find((it) => it.sec === sec))).filter((v, i, a) => v && a.indexOf(v) === i); }

// ---------------------------------------------------------------- Chrome, over its debugging port
const profile = mkdtempSync(join(tmpdir(), "atlas-og-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, `--window-size=${W},${H}`, "--hide-scrollbars", "--no-first-run", "--mute-audio", "--enable-unsafe-swiftshader", "about:blank"], { stdio: "ignore" });
const done = () => { try { chrome.kill(); } catch (e) {} try { rmSync(profile, { recursive: true, force: true }); } catch (e) {} };
process.on("exit", done); process.on("SIGINT", () => process.exit(1));
let target = null;
for (let i = 0; i < 60 && !target; i++) { await sleep(250); try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); target = l.find((t) => t.type === "page"); } catch (e) {} }
if (!target) { console.error("og: Chrome did not start"); process.exit(1); }
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r, x) => { ws.onopen = r; ws.onerror = x; });
let seq = 0; const waiting = new Map();
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && waiting.has(m.id)) { const { r, x } = waiting.get(m.id); waiting.delete(m.id); m.error ? x(new Error(m.error.message)) : r(m.result); } };
const cdp = (method, params = {}) => new Promise((r, x) => { const id = ++seq; waiting.set(id, { r, x }); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expression) => { const r = await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
await cdp("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });

// The page's own controls go; the caption card takes the place of the atlas's card, which the map is already framed beside.
const CSS = `
  #bar, #dock, #col, #mapTools, #legend, #noRecords, #tooltip, #pop, #side, #chart, #tabbar, #toast, #cine, #sheet, #compare, #stopbar, #framebar { display: none !important; }
  #ogcap { position: fixed; z-index: 99; left: 28px; top: 28px; bottom: 28px; width: 396px; box-sizing: border-box; padding: 30px 30px 26px; display: flex; flex-direction: column;
    border: 1px solid #111; border-radius: 16px; background: #fff; box-shadow: 0 12px 34px rgba(0,0,0,.14); color: #111; font-family: Inter, system-ui, sans-serif; }
  #ogcap .b { display: flex; align-items: center; gap: 10px; font: 800 15px/1 "Source Serif 4", Georgia, serif; letter-spacing: .1em; }
  #ogcap .b img { width: 34px; height: 24px; }
  #ogcap .k { margin-top: auto; font: 600 15px/1.35 Inter, sans-serif; color: #c8321e; }
  #ogcap h1 { margin: 10px 0 0; font: 800 44px/1.06 "Source Serif 4", Georgia, serif; letter-spacing: -.01em; overflow-wrap: break-word; }
  #ogcap h1.m { font-size: 37px; } #ogcap h1.s { font-size: 31px; }
  #ogcap p { margin: 16px 0 0; font: 400 18px/1.42 Inter, sans-serif; color: #2b2b28; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5; overflow: hidden; }
  #ogcap .u { margin-top: 20px; padding-top: 14px; border-top: 1px solid #e3e3dd; font: 500 14px/1 Inter, sans-serif; color: #5e5e59; }`;
const setup = `(() => { if (document.getElementById("ogcap")) return; const s = document.createElement("style"); s.textContent = ${JSON.stringify(CSS)}; document.head.append(s);
  const d = document.createElement("div"); d.id = "ogcap"; d.innerHTML = '<div class="b"><img src="logo.png" alt="">THE WORLD ATLAS</div><div class="k"></div><h1></h1><p></p><div class="u">worldatlas.site</div>'; document.body.append(d); })()`;
const caption = (it) => `(() => { const c = document.getElementById("ogcap"), h = c.querySelector("h1"); c.querySelector(".k").textContent = ${JSON.stringify(it.kick)}; h.textContent = ${JSON.stringify(it.title)};
  h.className = ${JSON.stringify(it.title)}.length > 44 ? "s" : ${JSON.stringify(it.title)}.length > 24 ? "m" : ""; c.querySelector("p").textContent = ${JSON.stringify(it.line)}; })()`;
// settled: the loading note is gone, the fonts are in, and nothing has been fetched for a moment (borders, a war's layers)
const settle = async (min) => { await sleep(min); for (let i = 0; i < 40; i++) { const ok = await js(`(async () => { await document.fonts.ready; const n = performance.getEntriesByType("resource").length; await new Promise((r) => setTimeout(r, 450)); return !document.querySelector("#loading") && performance.getEntriesByType("resource").length === n; })()`); if (ok) return; } };

let loaded = false, n = 0; const t0 = Date.now();
for (const it of todo) {
  const url = `${BASE}/world.html#${it.hash}`;
  if (!loaded) { await cdp("Page.navigate", { url }); loaded = true; await settle(2500); }
  else { await js(`location.hash = ${JSON.stringify("#" + it.hash)}`); await settle(1400); }
  await js(setup); await js(caption(it)); await sleep(350); // the map's cross-fade
  const shot = await cdp("Page.captureScreenshot", { format: "jpeg", quality: 84, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  const file = join(OUT, it.sec, `${it.id}.jpg`); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, Buffer.from(shot.data, "base64"));
  if (++n % 20 === 0 || SAMPLE) console.log(`og: ${n}/${todo.length} ${it.sec}/${it.id}`);
}
console.log(`og: ${n} images in ${Math.round((Date.now() - t0) / 1000)} s -> ${OUT}`);
ws.close(); done(); process.exit(0);
