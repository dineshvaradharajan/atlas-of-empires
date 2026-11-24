/* One atlas prototype: the phone layout (760 px and narrower). Loaded before one.js, which calls PHONE.init() once its data is in,
   PHONE.tick() every frame, PHONE.story() when a moment's chapter changes and PHONE.changed() when the window is resized. It uses
   one.js's own state and functions (S, ST, X, HX, leaves, MILES, enterHistory, storyGo ...): one model, two layouts.
   The page's styles are in phone.css. */
window.PHONE = (() => {
  const q = (s) => document.querySelector(s), on = () => PH();
  const strataHTML = () => leaves.map((u) => `<i style="left:${X(u.from) * 100}%;width:${Math.max(0, X(Math.max(u.to, JOIN)) - X(u.from)) * 100}%;background:${u.color}"></i>`).join("");
  const bandsHTML = () => HERAS.map(([a, b, , , c]) => `<i style="left:${HX(a) * 100}%;width:${(HX(b) - HX(a)) * 100}%;background:${c}"></i>`).join("");
  const short = (ma) => ma < .0001 ? "today" : ageParts(ma).join(" ").replace(" million years ago", " M").replace(" billion years ago", " bn").replace(" years ago", " yr");
  const era = (y) => HERAS.find((e) => y < e[1]) || HERAS[HERAS.length - 1];
  const before = (ma) => unitAt(Math.min(OLDEST, ma * 1.0001 + 1e-6)); // the period a moment at a boundary closes, not the one it opens
  let was = null, key = "", unitShown = "", pics = [], picWhen = "", idxMode = "earth", n = 0;

  function init() {
    was = on(); if (!was) return;
    q("#pStrata").innerHTML = q("#pTileE").innerHTML = q("#paE").innerHTML = q("#psMini").innerHTML = q("#pOwnMini").innerHTML = strataHTML();
    q("#pBands").innerHTML = q("#pTileH").innerHTML = q("#paH").innerHTML = bandsHTML();
    q("#pMarks").innerHTML = MILES.map((m, i) => `<i class="${m.kind}" data-m="${i}" style="left:${X(m.ma) * 100}%"></i>`).join("");
    wire();
  }
  const changed = () => was !== null && was !== on();

  // ---------------------------------------------------------------- the sheet: the date, the column, one line, the card
  const stop = (s) => { q("#ps").dataset.stop = s; q("#pUp").setAttribute("aria-label", s === "full" ? "Close the card" : "Open the card"); };
  function tick() {
    if (!was) return;
    if (++n % 20 === 0) { let none = false; try { if (q("#app").dataset.app) none = getComputedStyle(histWin().document.body).getPropertyValue("--tab-h").trim() === "0px"; } catch (e) {} // World history hides its own tabs in a story or a search: so do we
      none ? (q("#app").dataset.notabs = "1") : delete q("#app").dataset.notabs; }
    if (ST || q("#app").dataset.app) return;
    if (S.mode === "deep") {
      const [num, unit] = ageParts(S.ma), u = unitAt(S.ma); let near = -1, best = .012; MILES.forEach((m, i) => { const d = Math.abs(X(m.ma) - X(S.ma)); if (d < best) { best = d; near = i; } });
      q("#pThumb").style.left = X(S.ma) * 100 + "%";
      const k = "d" + num + unit + u.id + near; if (k === key) return; key = k;
      q("#pNum").textContent = num; q("#pUnit").textContent = unit; q("#pDate").classList.toggle("long", num.length > 3 || (num + unit).length > 18);
      q("#pChip").style.background = u.color; q("#pChipName").textContent = u.name; q("#app").style.setProperty("--now", u.color);
      q("#pTicks").innerHTML = [[4567, "4.5 bn"], [538.8, "539 M"], [251.902, "252 M"], [66, "66 M"]].map(([m, l]) => `<span style="left:${X(m) * 100}%">${l}</span>`).join(""); q("#pTileT").innerHTML = "History &#8250;";
      q("#pDia").hidden = near < 0; q("#pRowText").textContent = near >= 0 ? MILES[near].title : u.tagline || `${u.name} ${u.rank}`;
      q("#pMarks").querySelectorAll("i").forEach((el) => el.classList.toggle("on", +el.dataset.m === near));
      const tb = q("#pTurn"); tb.hidden = near < 0;
      if (near >= 0) { const m = MILES[near]; tb.innerHTML = `<span>Turning point, ${esc(ageParts(m.ma).join(" "))}</span><b>${esc(m.title)}</b><p>${esc((m.item.text || "").split(". ").slice(0, 2).join(". ").replace(/\.?$/, "."))}</p>`; }
      const gallery = near >= 0 ? MILES[near].item?.gallery : null; picWhen = gallery ? MILES[near].title : "";
      const at = u.id + (gallery?.story || ""); if (at !== unitShown) { unitShown = at; pics = picsFor(u, gallery); const po = q("#pPic"); po.hidden = !pics.length;
        if (pics.length) { const im = q("#pPicImg"); im.dataset.fb = pics[0].image; im.src = sized(pics[0], 500); q("#pPicN").textContent = `1 of ${pics.length}`; }
        q("#pText").textContent = [u.world, u.life].filter(Boolean).join(" "); }
      q("#pTrust").textContent = S.ma > MAPPED ? "Artist's impression: no map of the Earth this old is drawn here." : S.ma > 300 ? "Rough map: reconstructions of this time differ by 600 to 1,600 km." : "Reconstructed map: PALEOMAP, Scotese and Wright 2018.";
    } else {
      const y = Math.round(S.year), e = era(y); q("#pThumb").style.left = HX(S.year) * 100 + "%";
      const k = "h" + y; if (k === key) return; key = k; unitShown = "";
      q("#pNum").textContent = y < 0 ? num(-y) : String(y); q("#pUnit").textContent = y < 0 ? "BCE" : y < 1000 ? "CE" : ""; q("#pDate").classList.remove("long");
      q("#pChip").style.background = e[4]; q("#pChipName").textContent = e[2]; q("#app").style.setProperty("--now", e[4]);
      q("#pTicks").innerHTML = [[-10000, "10,000 BCE"], [0, "1 CE"], [1500, "1500"]].map(([v, l]) => `<span style="left:${HX(v) * 100}%">${l}</span>`).join("") + '<span class="end">today</span>'; q("#pTileT").innerHTML = "&#8249; Earth";
      q("#pDia").hidden = true; q("#pRowText").textContent = `The world in ${yearText(y)}`;
    }
  }
  const num = (v) => v.toLocaleString("en-GB");
  function goMa(ma) { ma = clamp(ma, JOIN, OLDEST); setPlaying(false); if (ST) storyEnd(); if (S.mode === "hist") enterDeep(ma); else { S.ma = ma; S.dirty = true; } }
  function goYear(y) { setPlaying(false); if (ST) storyEnd(); if (S.mode === "deep") enterHistory(y); else { S.year = y; histYear(y); } }
  function step(d) { // one period (or one age) at a time: the tap that stands in for dragging the column
    if (S.mode === "deep") { const i = leaves.indexOf(unitAt(S.ma)), u = leaves[i];
      if (d > 0) { const nx = leaves[i + 1]; return !nx || nx.from <= JOIN ? goYear(Y0) : goMa(nx.from); }
      return S.ma < Math.min(u.from, OLDEST) * .9999 ? goMa(u.from) : i > 0 ? goMa(leaves[i - 1].from) : null; }
    const y = Math.round(S.year), i = HERAS.indexOf(era(y));
    if (d > 0) return goYear(HERAS[i + 1] ? HERAS[i + 1][0] : NOW_YEAR);
    return y > HERAS[i][0] ? goYear(HERAS[i][0]) : i > 0 ? goYear(HERAS[i - 1][0]) : goMa(.02);
  }
  const histTab = (name) => { if (ST) storyEnd(); listOpen(false); const crossing = S.mode !== "hist"; if (crossing) enterHistory(S.lastYear ?? Y0); // a section of World history, which takes the screen in its own phone layout
    const press = () => { try { const d = histWin().document; (d.querySelector(`#tabbar [data-tab="${name}"]`) || d.querySelector(`#bar [data-tab="${name}"]`)).click(); } catch (e) {} setTimeout(histWatch, 0); setTimeout(histWatch, 90); };
    if (crossing) setTimeout(press, 400); else press(); }; // at once when already in history; after the crossing when coming from the Earth

  // ---------------------------------------------------------------- jump to a time: the rock column as a list (and a story's chapters)
  function idx(mode) {
    idxMode = mode; const box = q("#pidxRows"), deep = S.mode === "deep"; let h = "";
    q("#pidxSeg").hidden = mode === "chapters"; q("#pidxTitle").textContent = mode === "chapters" ? ST.story.title : "Jump to a time";
    q("#pidxSeg").querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.t === mode));
    if (mode === "earth") {
      const cur = deep ? unitAt(S.ma) : null, rows = leaves.filter((u) => u.from > JOIN).map((u) => ({ at: Math.min(u.from, OLDEST), u })).concat(MILES.map((m) => ({ at: m.ma + .05, m }))).sort((a, b) => b.at - a.at);
      h = rows.map((r) => r.u ? `<button type="button" class="irow per${r.u === cur ? " cur" : ""}" data-ma="${Math.min(r.u.from, OLDEST)}"><i class="rail" style="background:${r.u.color}"></i><span class="n">${esc(r.u.name)}${r.u === cur ? '<span class="here">You are here</span>' : ""}</span><span class="v">${short(Math.min(r.u.from, OLDEST))} to ${short(r.u.to)}</span></button>`
        : `<button type="button" class="irow" data-ma="${r.m.ma}" data-m="${MILES.indexOf(r.m)}"><i class="rail" style="background:${before(r.m.ma).color}"></i><i class="d ${r.m.kind}"></i><span class="n">${esc(r.m.title)}</span><span class="v">${short(r.m.ma)}</span></button>`).join("");
    } else if (mode === "hist") {
      const cur = deep ? null : era(Math.round(S.year));
      h = HERAS.map((e) => `<button type="button" class="irow per${e === cur ? " cur" : ""}" data-y="${e[0]}"><i class="rail" style="background:${e[4]}"></i><span class="n">${esc(e[2])}${e === cur ? '<span class="here">You are here</span>' : ""}</span><span class="v">${yearText(e[0])} to ${e[1] >= NOW_YEAR ? "today" : yearText(e[1])}</span></button>`).join("");
    } else h = ST.story.chapters.map((c, k) => `<button type="button" class="irow${k === ST.i ? " cur" : ""}" data-c="${k}"><i class="rail" style="background:${before(c.ma).color}"></i><span class="n">${esc(c.title)}${k === ST.i ? '<span class="here">Reading</span>' : ""}</span><span class="v">${short(c.ma)}</span></button>`).join("");
    box.innerHTML = h; q("#pidx").hidden = false; const c = box.querySelector(".cur"); box.scrollTop = c ? Math.max(0, c.offsetTop - box.offsetTop - 92) : 0;
  }
  const idxClose = () => { q("#pidx").hidden = true; };

  // ---------------------------------------------------------------- stories: the Earth's moments as cards to swipe, opened at the one being read
  function strip(s) { const a = X(Math.min(s.from, OLDEST)), b = X(Math.max(s.to, JOIN)), w = Math.max(1e-6, b - a);
    return leaves.filter((u) => u.from > s.to && u.to < s.from).map((u) => { const l = (X(Math.min(u.from, s.from)) - a) / w, r = (X(Math.max(u.to, s.to, JOIN)) - a) / w; return `<i style="left:${l * 100}%;width:${(r - l) * 100}%;background:${u.color}"></i>`; }).join(""); }
  function cards() {
    const L = [...(D.stories || [])].sort((a, b) => b.from - a.from), box = q("#pCards");
    q("#pstCount").textContent = `${L.filter((s) => (SEEN[s.id] || 0) >= s.chapters.length).length} of ${L.length} finished`; q("#pstE").textContent = `The Earth, ${L.length}`;
    box.innerHTML = L.map((s) => { const p = s.chapters.flatMap((c) => c.pics || [])[0], t = s.chapters.length, d = Math.min(SEEN[s.id] || 0, t);
      return `<button type="button" class="pcard${d && d < t ? " doing" : ""}" data-s="${esc(s.id)}">${p ? `<img src="${esc(sized(p, 500))}" data-fb="${esc(p.image)}" alt="" loading="lazy">` : '<span class="noimg"></span>'}<span class="pstrip">${strip(s)}</span><b>${esc(s.title)}</b><small>${esc(spanOf(s))}</small><span class="prog"><i style="width:${d / t * 100}%"></i></span><em>${!d ? "Not started" : d >= t ? "Finished" : `Chapter ${d} of ${t}`}</em></button>`; }).join("");
    const c = box.querySelector(".doing"); box.scrollLeft = c ? c.offsetLeft - (box.clientWidth - c.offsetWidth) / 2 : 0;
  }
  const storiesOpen = () => { idxClose(); stop("peek"); listOpen(true); cards(); };

  // ---------------------------------------------------------------- a story playing; all of time
  function story() {
    if (!was || !ST) return; const s = ST.story;
    q("#psN").textContent = `${ST.i + 1} of ${s.chapters.length}`;
    q("#psSegs").innerHTML = s.chapters.map((c, k) => `<i class="${k === ST.i ? "on" : k > ST.i ? "todo" : ""}" style="background:${before(c.ma).color}"></i>`).join("");
    if (!q("#pidx").hidden) idxClose();
  }
  function all(open) { q("#pall").hidden = q("#pscrim").hidden = !open; if (!open) return;
    const x = X(Math.max(S.ma, JOIN)) * 64; q("#paMark").style.left = q("#paNow").style.left = x + "%"; q("#paNow").textContent = `This story, ${ageParts(S.ma).join(" ")}`;
    const nw = q("#paNow"), half = nw.offsetWidth / 2, W = q("#paStrip").clientWidth, px = x / 100 * W; nw.style.left = clamp(px, half, W - half) + "px"; }

  function wire() {
    q("#pSearch").addEventListener("click", () => q("#searchBtn").click());
    q("#pDate").addEventListener("click", () => idx(S.mode === "deep" ? "earth" : "hist"));
    q("#pPrev").addEventListener("click", () => step(-1)); q("#pNext").addEventListener("click", () => step(1));
    q("#pPlay").addEventListener("click", () => { stop("peek"); setPlaying(!S.playing); });
    q(".tilew").addEventListener("click", () => S.mode === "deep" ? goYear(Y0) : goMa(.02)); // the block or its name
    q("#pToday").addEventListener("click", () => histTab("today"));
    q("#pUp").addEventListener("click", () => { if (S.mode === "hist") { HIST.own = true; return; } const s = q("#ps").dataset.stop; stop(s === "peek" ? "half" : s === "half" ? "full" : "peek"); }); // in history: World history's own card for this year
    q("#pPic").addEventListener("click", () => { const u = unitAt(S.ma); imOpen(pics, 0, picWhen || `${u.name}, ${ageParts(S.ma).join(" ")}`); });
    const bar = q("#pBar"); let scrub = false; // the column: drag for rough moves (the steps and the list are for exact ones)
    const at = (e) => { const r = bar.getBoundingClientRect(), f = clamp((e.clientX - r.left) / r.width, 0, 1); if (S.mode === "deep") { S.ma = Math.max(JOIN, atX(f)); S.dirty = true; } else { S.year = atHX(f); histYear(S.year); } };
    bar.addEventListener("pointerdown", (e) => { bar.setPointerCapture(e.pointerId); scrub = true; setPlaying(false); stop("peek"); at(e); });
    bar.addEventListener("pointermove", (e) => { if (scrub) at(e); });
    const end = () => { scrub = false; }; bar.addEventListener("pointerup", end); bar.addEventListener("pointercancel", end);
    bar.addEventListener("keydown", (e) => { const d = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0; if (d) { e.preventDefault(); step(d); } });
    const gr = q("#pGrab"); let g0 = null; // the grabber: a tap or a short drag moves the sheet one stop
    gr.addEventListener("pointerdown", (e) => { gr.setPointerCapture(e.pointerId); g0 = e.clientY; });
    gr.addEventListener("pointerup", (e) => { if (g0 == null) return; const dy = e.clientY - g0, s = q("#ps").dataset.stop; g0 = null; if (S.mode === "hist") return;
      if (dy < -24 || Math.abs(dy) < 6) stop(s === "peek" ? "half" : "full"); else if (dy > 24) stop(s === "full" ? "half" : "peek"); });
    q("#ptabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (!b) return; setPlaying(false); idxClose(); all(false);
      q("#ptabs").querySelectorAll("button").forEach((x) => { x === b ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current"); }); // the pressed tab shows at once
      if (b.dataset.tab === "explore") { if (ST) storyEnd(); listOpen(false); if (S.mode === "hist" && q("#app").dataset.app) histExplore(); else HIST.own = false; return; }
      HIST.own = false;
      if (b.dataset.tab === "stories") return S.mode === "hist" ? histTab("stories") : q("#app").dataset.list ? listOpen(false) : storiesOpen(); // each side's own stories
      histTab("about"); });
    q("#pidx").addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) return idxClose();
      const t = e.target.closest("[data-t]"); if (t) return idx(t.dataset.t);
      const r = e.target.closest(".irow"); if (!r) return; idxClose();
      if (r.dataset.c != null) { setPlaying(false); return storyGo(+r.dataset.c); }
      if (r.dataset.y != null) return goYear(+r.dataset.y);
      goMa(+r.dataset.ma); const m = r.dataset.m != null && MILES[+r.dataset.m].item; if (m && m.then && !S.flat) fly = { lon0: S.lon, lat0: S.lat, dl: ((m.then[0] - S.lon + 540) % 360) - 180, dp: clamp(m.then[1], -70, 70) - S.lat, t: 0 }; });
    q("#pst").addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) return listOpen(false);
      const t = e.target.closest("[data-t]"); if (t) { if (t.dataset.t === "hist") histTab("stories"); return; }
      const c = e.target.closest("[data-s]"); if (c) storyStart(c.dataset.s); });
    q("#psBack").addEventListener("click", () => { storyEnd(); storiesOpen(); });
    q("#psCount").addEventListener("click", () => idx("chapters"));
    q("#psPlay").addEventListener("click", () => setPlaying(!S.playing));
    q("#psAll").addEventListener("click", () => { setPlaying(false); all(true); });
    q("#pscrim").addEventListener("click", () => all(false));
    q("#pall").addEventListener("click", (e) => { if (e.target.closest("[data-close]")) all(false); });
    q("#paEarth").addEventListener("click", () => { all(false); storyEnd(); });
    q("#paHist").addEventListener("click", () => { all(false); storyEnd(); enterHistory(Y0); });
    q("#pOwnBack").addEventListener("click", () => { HIST.own = false; });
  }
  return { init, tick, story, changed, stories: storiesOpen };
})();
