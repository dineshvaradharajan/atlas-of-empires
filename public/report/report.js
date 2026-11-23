/* "Report an issue": a small flag button near the bottom of every page of the atlas, and the panel it opens. The panel says
   what it will send about the page (the address, the year, what is selected, the view, the look, the screen and the browser),
   asks what is wrong, and posts it to /api/report (functions/api/report.js), which emails it on. The address it goes to is
   kept on the server, never here.

   Include it with <link rel="stylesheet" href="/report/report.css"> and <script src="/report/report.js" data-page="home|earth|plain" defer>.
   A page can say more about what the reader is looking at by defining window.atlasReportContext(), returning
   { page, section, year, time, period, focus, story, chapter, view, map } (any of them); one/one.js and earth-history/earth.js do.

   The button finds its own place: the lowest free spot on the right edge, clear of whatever floats over the map there (the
   timeline, Globe | Flat, Today in history, a phone's sheet and tab bar, World history's own controls in its frame). Where
   the right edge has no room it tries just left of what is in the way; with no room anywhere (a sheet pulled up to the top,
   pictures full screen) it steps aside until there is. */
(() => {
  if (window.self !== window.top || window.__atlasReport) return; // World history inside the home page's frame: the home page has the button
  window.__atlasReport = true;
  const SCRIPT = document.currentScript;
  const PAGE = (SCRIPT && SCRIPT.dataset.page) || (/^\/(index\.html)?$/.test(location.pathname) ? "home" : /^\/earth-history\//.test(location.pathname) ? "earth" : "plain");
  const ENDPOINT = "/api/report", DRAFT = "atlas.report.draft", MAX = 4000;
  document.documentElement.dataset.rpPage = PAGE;

  const TYPES = [
    ["border", "Wrong border or date", '<path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/><path d="M9 4v13M15 7v13"/>',
      "Which border or date looks wrong, and what should it be? A source helps us check it."],
    ["fact", "Wrong fact or text", '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M9 9h6M9 13h4"/>',
      "Which sentence is wrong, and what is right? A source helps us check it."],
    ["broken", "Something broken", '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.5"/>',
      "What did you do, and what happened instead?"],
    ["idea", "Suggestion", '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
      "What would make the atlas better for you?"],
  ];
  const PLACEHOLDER = "Tell us what looks wrong, or what could be better.";
  const LABELS = [["page", "Page"], ["section", "Section"], ["time", "Time"], ["year", "Year"], ["period", "Period"], ["focus", "Selected"],
    ["story", "Story"], ["chapter", "Chapter"], ["view", "View"], ["map", "Map"], ["url", "Address"], ["look", "Look"],
    ["viewport", "Screen"], ["device", "Device"], ["lang", "Language"], ["ua", "Browser"]];
  const ICON = {
    flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4.5c2.5-1.5 5-1.5 7 0s4.5 1.5 7 0v9c-2.5 1.5-5 1.5-7 0s-4.5-1.5-7 0"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get() { try { return JSON.parse(sessionStorage.getItem(DRAFT) || "null"); } catch (e) { return null; } },
    set(v) { try { v ? sessionStorage.setItem(DRAFT, JSON.stringify(v)) : sessionStorage.removeItem(DRAFT); } catch (e) {} } };
  const mq = (q) => window.matchMedia(q).matches;
  const narrow = () => mq("(max-width: 760px)");
  const coarse = () => mq("(pointer: coarse)");

  // ------------------------------------------------------------------ the look: the page's own light or dark
  function look() {
    const t = document.documentElement.dataset.theme;
    if (t === "midnight") return "midnight";
    if (t === "sage") return "sage";
    if (PAGE === "earth") return document.body.classList.contains("light") ? "classic" : "midnight";
    return mq("(prefers-color-scheme: dark)") ? "midnight" : "classic";
  }

  // ------------------------------------------------------------------ what we'll include
  function plainPage() {
    const seg = location.pathname.split("/").filter(Boolean), deep = seg.length > 1;
    const names = { empires: ["Empire", "Empires"], wars: ["War", "Wars"], moments: ["Moment", "Moments"], eras: ["Chapter of history", "Chapters of history"],
      realms: ["Realm", "Realms"], sites: ["Ancient site", "Ancient sites"], about: ["About", "About"] };
    const n = names[seg[0]];
    if (!n) return document.title.includes("not found") || document.querySelector("h1")?.textContent.match(/not found/i) ? "Page not found" : "Reading page";
    return deep ? `${n[0]} page` : `${n[1]} index`;
  }
  function device() {
    const w = innerWidth, kind = w <= 760 ? "Phone" : w <= 1180 && coarse() ? "Tablet" : "Desktop";
    const os = navigator.userAgentData?.platform || (/iPhone|iPad|iPod/.test(navigator.userAgent) ? "iOS" : /Android/.test(navigator.userAgent) ? "Android" : /Mac OS X/.test(navigator.userAgent) ? "macOS" : /Windows/.test(navigator.userAgent) ? "Windows" : /Linux/.test(navigator.userAgent) ? "Linux" : "");
    return [kind, os, coarse() ? "touch" : ""].filter(Boolean).join(" · ");
  }
  function capture() {
    let c = {};
    try { if (typeof window.atlasReportContext === "function") c = window.atlasReportContext() || {}; } catch (e) { console.warn("report: page context unavailable", e); }
    if (!c.page) c.page = PAGE === "plain" ? plainPage() : PAGE === "earth" ? "Earth history" : "The World Atlas";
    if (PAGE === "plain" && !c.focus) c.focus = (document.querySelector("main h1, h1")?.textContent || "").trim();
    const dpr = Math.round((window.devicePixelRatio || 1) * 100) / 100;
    Object.assign(c, { url: location.href, look: look() === "midnight" ? "Dark" : "Light", viewport: `${innerWidth} × ${innerHeight}${dpr !== 1 ? ` at ${dpr}x` : ""}`,
      device: device(), lang: navigator.language || "", ua: navigator.userAgent });
    const out = {};
    for (const [k] of LABELS) { const v = c[k] == null ? "" : String(c[k]).replace(/\s+/g, " ").trim(); if (v) out[k] = v.slice(0, 600); }
    return out;
  }
  function summary(c) {
    const cut = (s, n = 42) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
    const when = c.year || c.time || "";
    const parts = [when, !c.year && c.period && !c.focus ? c.period : "", c.focus || c.story || "", c.chapter ? (c.chapter.match(/^\d+ of \d+/) ? `Chapter ${c.chapter.match(/^\d+ of \d+/)[0]}` : c.chapter) : "",
      c.section || c.view || (PAGE === "plain" ? c.page : "")].filter(Boolean).map((s) => cut(s));
    return [...new Set(parts)].slice(0, 4).join(" · ") || c.page;
  }

  // ------------------------------------------------------------------ the button
  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "rp-fab rp-still" + (PAGE === "plain" ? " rp-plain" : ""); fab.dataset.rp = ""; fab.dataset.hide = "";
  fab.setAttribute("aria-label", "Report an issue"); fab.setAttribute("aria-haspopup", "dialog"); fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = ICON.flag + '<span class="rp-tip" aria-hidden="true">Report an issue</span>';

  // ------------------------------------------------------------------ finding the button a free spot
  const GAP = 10, CONTAINERS = new Set(["app", "stage"]), IGNORE = new Set(["grab", "tip"]), SKIP = new Set(["CANVAS", "IFRAME", "SCRIPT", "STYLE", "LINK", "NOSCRIPT", "TEMPLATE"]);
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0";
  const safe = () => { const cs = getComputedStyle(probe); return { t: parseFloat(cs.paddingTop) || 0, b: parseFloat(cs.paddingBottom) || 0 }; };
  const shown = (el, cs) => (el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : cs.visibility !== "hidden" && +cs.opacity > 0);
  // the floating pieces of a page: positioned children of the page itself and of its full-screen containers (#app, World history's #stage)
  function scan(doc, ox, oy, W, H, rects) {
    let overlay = false;
    const walk = (parent, depth) => {
      for (const el of parent.children) {
        if (overlay) return;
        if (SKIP.has(el.tagName) || IGNORE.has(el.id) || (el.dataset && "rp" in el.dataset) || el === probe) continue;
        const cs = doc.defaultView.getComputedStyle(el);
        if (cs.display === "none") continue;
        if (cs.display === "contents") { if (depth < 4) walk(el, depth + 1); continue; } // World history's #sheet on a wide screen: only its children have boxes
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const big = r.width * r.height >= W * H * 0.85, pos = cs.position;
        if (big && (CONTAINERS.has(el.id) || pos === "static" || pos === "relative")) { if (depth < 3) walk(el, depth + 1); continue; }
        if (pos !== "fixed" && pos !== "absolute" && pos !== "sticky") continue;
        if (!shown(el, cs)) continue;
        if (big) { // pictures full screen, a scrim, a search sheet: step aside. A see-through layer (a war's call-outs) only holds pieces: look inside
          const paints = el.getAttribute("aria-modal") === "true" || cs.backgroundImage !== "none" || !/^(transparent|rgba\(\d+, \d+, \d+, 0\))$/.test(cs.backgroundColor) || cs.backdropFilter && cs.backdropFilter !== "none";
          if (paints) { overlay = el; return; }
          if (depth < 4) walk(el, depth + 1);
          continue;
        }
        rects.push({ l: r.left + ox - GAP, t: r.top + oy - GAP, r: r.right + ox + GAP, b: r.bottom + oy + GAP });
      }
    };
    walk(doc.body, 0);
    return overlay;
  }
  function frameDoc() {
    if (PAGE !== "home") return null;
    const f = document.getElementById("hist"), app = document.getElementById("app");
    if (!f || !app || app.dataset.mode !== "hist") return null; // on the Earth's side the globe covers the frame
    try { return { doc: f.contentDocument, r: f.getBoundingClientRect() }; } catch (e) { return null; }
  }
  // the lowest y in [top, bottom - size] where a size × size square at x is clear of every rect, and what was in the way
  function slot(x, size, rects, top, bottom) {
    const blockers = [];
    let y = bottom - size;
    for (let i = 0; i < 60 && y >= top; i++) {
      const hit = rects.find((q) => q.l < x + size && q.r > x && q.t < y + size && q.b > y);
      if (!hit) return { x, y, blockers };
      blockers.push(hit); y = hit.t - size;
    }
    return { x, y: null, blockers };
  }
  let placed = false, lastLook = "", last = {};
  function place() {
    if (root && !root.hidden) return;
    const lk = look(); if (lk !== lastLook) { lastLook = lk; fab.dataset.look = lk; }
    const phone = narrow() || coarse(), size = phone ? 44 : 40;
    fab.classList.toggle("rp-phone", phone);
    const W = document.documentElement.clientWidth || innerWidth, H = innerHeight, s = safe();
    const right = phone ? 16 : 24, top = s.t + 8, bottom = H - (phone ? 16 + s.b : 24);
    const rects = [];
    let overlay = PAGE === "plain" ? false : scan(document, 0, 0, W, H, rects);
    const fr = !overlay && frameDoc();
    if (fr && fr.doc && fr.doc.body) overlay = scan(fr.doc, fr.r.left, fr.r.top, W, H, rects);
    let best = null;
    if (!overlay) {
      const first = slot(W - right - size, size, rects, top, bottom), tries = [first];
      const low = H * 0.42;
      if (first.y == null || first.y < low) // the right edge is taken low down: try just left of what is in the way
        for (const b of first.blockers) if (b.r - b.l < W * 0.8 && b.l - size >= 16) tries.push(slot(b.l - size, size, rects, top, bottom));
      best = tries.find((t) => t.y != null && t.y >= low) || tries.filter((t) => t.y != null).sort((a, b) => b.y - a.y)[0] || null;
    }
    last = { overlay: overlay && (overlay.id || overlay.className || overlay.tagName), rects: rects.length, frame: !!fr, best };
    if (!best) { fab.dataset.hide = ""; return; }
    delete fab.dataset.hide;
    fab.style.setProperty("--rp-x", `${Math.round(best.x)}px`); fab.style.setProperty("--rp-y", `${Math.round(best.y)}px`);
    fab.dataset.tip = best.x < 180 ? "right" : "left";
    if (!placed) { placed = true; requestAnimationFrame(() => requestAnimationFrame(() => fab.classList.remove("rp-still"))); }
  }
  let queued = 0;
  const soon = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; place(); }); };
  const later = () => { soon(); setTimeout(soon, 120); setTimeout(soon, 420); }; // after a click, and again once a sheet has slid
  const watch = (doc) => {
    if (!doc || doc.__rpWatched) return; doc.__rpWatched = true;
    for (const ev of ["click", "pointerup", "keyup", "transitionend", "animationend"]) doc.addEventListener(ev, later, true);
    doc.defaultView.addEventListener("hashchange", later);
  };

  // ------------------------------------------------------------------ the panel
  let root, panel, form, msg, email, hp, count, msgErr, emailErr, alertBox, sendBtn, sendLabel, done, ctxBox, ctxSum, ctxList, ctxRm;
  let ctx = {}, include = true, openedAt = 0, lastFocus = null, sending = false, inerted = [];
  function build() {
    root = document.createElement("div");
    root.className = "rp-root"; root.hidden = true; root.dataset.rp = "";
    const chips = TYPES.map(([v, label, d]) => `<label class="rp-chip"><input type="radio" name="type" value="${v}"><span><svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>${label}</span></label>`).join("");
    root.innerHTML = `<div class="rp-scrim"></div>
<section class="rp-panel" role="dialog" aria-modal="true" aria-labelledby="rpTitle" tabindex="-1">
  <div class="rp-grab" aria-hidden="true"></div>
  <div class="rp-head"><p class="rp-kick">Report an issue</p><h2 class="rp-title" id="rpTitle">What isn’t right here?</h2>
    <button type="button" class="rp-x" data-close aria-label="Close">${ICON.close}</button></div>
  <form class="rp-form" novalidate>
    <fieldset class="rp-sec rp-types"><legend>What kind of problem? <span class="rp-opt">optional</span></legend><div class="rp-chips">${chips}</div></fieldset>
    <div class="rp-sec">
      <label class="rp-label" for="rpMsg">What should we know? <span class="rp-req">required</span></label>
      <textarea class="rp-field" id="rpMsg" name="message" rows="4" maxlength="${MAX}" required aria-required="true" aria-describedby="rpMsgErr rpCount" placeholder="${esc(PLACEHOLDER)}"></textarea>
      <p class="rp-ferr" id="rpMsgErr" hidden></p>
      <div class="rp-under"><span>A link to a source helps us check it.</span><span class="rp-count" id="rpCount" aria-live="polite">0 / ${MAX}</span></div>
    </div>
    <div class="rp-sec">
      <label class="rp-label" for="rpEmail">Your email <span class="rp-opt">optional</span></label>
      <input class="rp-field" id="rpEmail" name="email" type="email" inputmode="email" autocomplete="email" maxlength="200" aria-describedby="rpEmailErr rpEmailHint" placeholder="you@example.com">
      <p class="rp-ferr" id="rpEmailErr" hidden></p>
      <p class="rp-hint" id="rpEmailHint">Only if you’d like a reply. It is used for nothing else.</p>
    </div>
    <div class="rp-hp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>
    <div class="rp-ctx" role="group" aria-labelledby="rpCtxK">
      <div class="rp-ctxtop"><span class="rp-ctxk" id="rpCtxK">We’ll include</span><button type="button" class="rp-link" data-ctx aria-describedby="rpSum">Remove</button></div>
      <p class="rp-sum" id="rpSum"></p>
      <details><summary>${ICON.chev}Everything we’ll send</summary><dl></dl></details>
    </div>
    <div class="rp-alert" role="alert" hidden>${ICON.alert}<div><b></b><span></span><br><button type="button" class="rp-link" data-retry>Try again</button></div></div>
    <div class="rp-actions"><button type="submit" class="rp-send"><span class="rp-spin" aria-hidden="true"></span><span class="rp-sendl">Send report</span></button></div>
    <p class="rp-privacy">Sent to the atlas’s maker by email. Nothing is shown publicly.</p>
  </form>
  <div class="rp-done" hidden tabindex="-1" aria-labelledby="rpDoneT">
    <div class="rp-check">${ICON.check}</div>
    <h3 id="rpDoneT">Thank you</h3>
    <p class="rp-donep"></p>
    <div class="rp-actions"><button type="button" class="rp-send" data-close>Done</button><button type="button" class="rp-ghost" data-again>Report something else</button></div>
  </div>
</section>`;
    document.body.append(root);
    const q = (s) => root.querySelector(s);
    panel = q(".rp-panel"); form = q(".rp-form"); msg = q("#rpMsg"); email = q("#rpEmail"); hp = q('input[name="website"]'); count = q("#rpCount");
    msgErr = q("#rpMsgErr"); emailErr = q("#rpEmailErr"); alertBox = q(".rp-alert"); sendBtn = q(".rp-form .rp-send"); sendLabel = q(".rp-sendl");
    done = q(".rp-done"); ctxBox = q(".rp-ctx"); ctxSum = q("#rpSum"); ctxList = q(".rp-ctx dl"); ctxRm = q("[data-ctx]");

    q(".rp-scrim").addEventListener("click", close);
    root.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
    q("[data-again]").addEventListener("click", () => { resetForm(); showForm(); msg.focus(); });
    q("[data-retry]").addEventListener("click", () => form.requestSubmit ? form.requestSubmit() : submit(new Event("submit")));
    ctxRm.addEventListener("click", () => { include = !include; renderCtx(); });
    form.addEventListener("submit", submit);
    form.addEventListener("input", (e) => {
      if (e.target === msg) { countText(); if (msg.value.trim()) fieldErr(msg, msgErr, ""); }
      if (e.target === email && emailErr.textContent) fieldErr(email, emailErr, "");
      if (e.target.name === "type") msg.placeholder = (TYPES.find((t) => t[0] === e.target.value) || [])[3] || PLACEHOLDER;
      saveDraft();
    });
    // keys typed here are for the form: the map's own shortcuts (play, step through time, Esc) must not see them
    for (const ev of ["keydown", "keyup", "keypress"]) root.addEventListener(ev, (e) => { if (ev === "keydown") onKey(e); e.stopPropagation(); });
    for (const ev of ["wheel", "pointerdown", "touchstart"]) root.addEventListener(ev, (e) => e.stopPropagation(), { passive: true });
  }
  function countText() { const n = msg.value.length; count.textContent = `${n} / ${MAX}`; count.classList.toggle("rp-near", n > MAX * 0.9); }
  function fieldErr(input, box, text) { box.textContent = text; box.hidden = !text; text ? input.setAttribute("aria-invalid", "true") : input.removeAttribute("aria-invalid"); }
  function saveDraft() { const type = form.querySelector('input[name="type"]:checked')?.value || ""; store.set(msg.value || email.value || type ? { type, message: msg.value, email: email.value } : null); }
  function restoreDraft() {
    const d = store.get(); if (!d) return;
    if (!msg.value && d.message) msg.value = d.message;
    if (!email.value && d.email) email.value = d.email;
    const r = d.type && form.querySelector(`input[name="type"][value="${d.type}"]`);
    if (r && !form.querySelector('input[name="type"]:checked')) { r.checked = true; msg.placeholder = (TYPES.find((t) => t[0] === d.type) || [])[3] || PLACEHOLDER; }
  }
  function resetForm() { form.reset(); msg.placeholder = PLACEHOLDER; countText(); fieldErr(msg, msgErr, ""); fieldErr(email, emailErr, ""); alertBox.hidden = true; include = true; ctx = capture(); renderCtx(); openedAt = Date.now(); }
  function showForm() { form.hidden = false; done.hidden = true; root.querySelector(".rp-head").hidden = false; }
  function renderCtx() {
    ctxBox.classList.toggle("rp-off", !include);
    ctxSum.textContent = include ? summary(ctx) : "Page details removed. Only your words will be sent.";
    ctxRm.textContent = include ? "Remove" : "Add back";
    ctxRm.setAttribute("aria-label", include ? "Remove the page details from the report" : "Add the page details back");
    ctxBox.querySelector("details").hidden = !include;
    ctxList.innerHTML = LABELS.filter(([k]) => ctx[k]).map(([k, l]) => `<dt>${l}</dt><dd>${esc(ctx[k])}</dd>`).join("");
  }
  function setAlert(title, text, retry = true) {
    alertBox.querySelector("b").textContent = title; alertBox.querySelector("span").textContent = text;
    alertBox.querySelector("[data-retry]").hidden = !retry; alertBox.querySelector("br").hidden = !retry; alertBox.hidden = false;
  }
  function busy(on) {
    sending = on; form.setAttribute("aria-busy", on ? "true" : "false"); sendBtn.disabled = on; sendLabel.textContent = on ? "Sending…" : "Send report";
    form.querySelectorAll("input, textarea").forEach((el) => { if (el === hp) return; if (el.type === "radio") el.disabled = on; else el.readOnly = on; });
    ctxRm.disabled = on;
  }
  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    alertBox.hidden = true;
    const text = msg.value.trim(), mail = email.value.trim();
    let bad = null;
    if (text.length < 3) { fieldErr(msg, msgErr, text ? "A few more words, please: what is wrong, and where?" : "Please tell us what’s wrong or what could be better."); bad = bad || msg; }
    if (text.length > MAX) { fieldErr(msg, msgErr, `Please keep it under ${MAX} characters.`); bad = bad || msg; }
    if (mail && !email.checkValidity()) { fieldErr(email, emailErr, "That email doesn’t look right. Leave it empty if you’d rather not get a reply."); bad = bad || email; }
    if (bad) { bad.focus(); return; }
    if (navigator.onLine === false) { setAlert("You seem to be offline.", "Your report is kept here; send it once you’re connected."); return; }
    busy(true);
    const body = { type: form.querySelector('input[name="type"]:checked')?.value || "", message: text, email: mail, website: hp.value,
      elapsed: Date.now() - openedAt, context: include ? ctx : null };
    const ac = typeof AbortController === "function" ? new AbortController() : null, timer = setTimeout(() => ac && ac.abort(), 20000);
    let res = null, data = {};
    try {
      res = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), credentials: "same-origin", signal: ac && ac.signal });
      data = await res.json().catch(() => ({}));
    } catch (err) { res = null; }
    clearTimeout(timer); busy(false);
    if (res && res.ok && data.ok !== false) {
      store.set(null);
      root.querySelector(".rp-donep").textContent = mail ? "Your report is on its way. If we need to know more, we’ll write to you." : "Your report is on its way. Every one is read, and it helps keep the atlas right.";
      form.hidden = true; root.querySelector(".rp-head").hidden = true; done.hidden = false; done.focus();
      return;
    }
    const code = data.error || "", st = res ? res.status : 0;
    if (code === "message-required" || code === "message-too-long") { fieldErr(msg, msgErr, code === "message-too-long" ? `Please keep it under ${MAX} characters.` : "Please tell us what’s wrong."); msg.focus(); return; }
    if (code === "bad-email") { fieldErr(email, emailErr, "That email doesn’t look right. Leave it empty if you’d rather not get a reply."); email.focus(); return; }
    if (st === 429) setAlert("That’s a lot of reports in a few minutes.", "Thank you for them! Please try again in ten minutes; your text is kept here.", false);
    else if (!res) setAlert("Your report didn’t send.", "We couldn’t reach the atlas’s server. Your text is kept here, so you can try again.");
    else setAlert("Your report didn’t send.", "Something went wrong on our side. Your text is kept here, so you can try again in a moment.");
    alertBox.querySelector("[data-retry]").hidden || alertBox.querySelector("[data-retry]").focus();
  }

  // ------------------------------------------------------------------ open, close, keyboard
  const focusables = () => [...panel.querySelectorAll('button, [href], input:not([type="radio"]), input[type="radio"]:checked, textarea, summary, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.disabled && !el.closest("[hidden]") && !el.closest(".rp-hp") && el.getClientRects().length);
  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    const f = focusables(); if (!f.length) return;
    // radio buttons: Tab lands on the checked one, or the first of the group when none is checked
    if (!panel.querySelector('input[name="type"]:checked')) { const r0 = panel.querySelector('input[name="type"]'); const i = f.indexOf(msg); if (r0 && i >= 0 && !f.includes(r0)) f.splice(i, 0, r0); }
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i === -1)) { e.preventDefault(); f[0].focus(); }
  }
  function position() {
    const sheet = narrow();
    root.classList.toggle("rp-sheet", sheet);
    if (sheet) return;
    const W = document.documentElement.clientWidth, H = innerHeight, fr = fab.getBoundingClientRect(), pw = Math.min(410, W - 32);
    const pr = Math.max(16, Math.min(W - fr.right, W - pw - 16));
    let pb = fab.dataset.hide != null ? 24 : H - fr.top + 10;
    root.style.setProperty("--rp-pr", `${pr}px`); root.style.setProperty("--rp-pb", `${pb}px`);
    const ph = panel.offsetHeight;
    if (H - pb - ph < 16) { pb = Math.max(16, H - ph - 16); root.style.setProperty("--rp-pb", `${pb}px`); }
    root.style.setProperty("--rp-origin", `${Math.max(0, Math.min(pw, pw - (W - pr - fr.right) - fr.width / 2))}px 100%`);
  }
  function open() {
    if (!root) build();
    if (!root.hidden) return;
    lastFocus = document.activeElement;
    root.dataset.look = look();
    ctx = capture(); include = true; renderCtx();
    if (!done.hidden) { resetForm(); showForm(); }
    restoreDraft(); countText(); openedAt = Date.now();
    root.hidden = false; position();
    fab.setAttribute("aria-expanded", "true");
    inerted = [...document.body.children].filter((el) => el !== root && !el.inert && el.tagName !== "SCRIPT");
    inerted.forEach((el) => (el.inert = true));
    if (narrow()) document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("rp-open")));
    // a wide screen: straight into the text box. A phone: the sheet itself, so the keyboard does not jump up over it before it is read
    setTimeout(() => (narrow() ? panel : msg).focus({ preventScroll: true }), narrow() ? 320 : 60);
  }
  function close() {
    if (!root || root.hidden) return;
    root.classList.remove("rp-open");
    inerted.forEach((el) => (el.inert = false)); inerted = [];
    document.documentElement.style.overflow = "";
    fab.setAttribute("aria-expanded", "false");
    const end = () => { root.hidden = true; place(); };
    mq("(prefers-reduced-motion: reduce)") ? end() : setTimeout(end, 260);
    const back = lastFocus && lastFocus.isConnected && lastFocus !== document.body ? lastFocus : fab;
    try { back.focus({ preventScroll: true }); } catch (e) {}
  }
  fab.addEventListener("click", open);

  // ------------------------------------------------------------------ start
  function start() {
    document.body.append(probe, fab);
    place();
    watch(document);
    addEventListener("resize", () => { soon(); if (root && !root.hidden) position(); });
    if (window.visualViewport) visualViewport.addEventListener("resize", soon);
    matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", soon);
    const f = PAGE === "home" && document.getElementById("hist");
    if (f) { const hook = () => { try { watch(f.contentDocument); } catch (e) {} later(); }; f.addEventListener("load", hook); hook(); }
    setInterval(() => { if (!document.hidden) place(); }, 700); // a safety net for what the events miss (a sheet dragged, a story that plays on)
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
  window.atlasReport = { open, close, place, debug: () => last };
})();
