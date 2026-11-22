/* One atlas prototype: changes to the World history page when it runs inside the combined page. Loaded before app.js by hist.html,
   so the World history page itself (../index.html) is untouched.
   1. Lets the page that frames this one copy the map's WebGL canvas onto its globe (a WebGL canvas can only be read back later if it
      keeps its drawing buffer).
   2. A slimmer Stories pane, so the map is bigger: the pane is 400 px wide instead of 540, and its rows say less: an empire or a war
      shows its dates only, with how far you have read as a ring on its mark instead of "3 of 15"; a moment shows its date without
      its group (Tech, Culture ...). */
(() => {
  const get = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, opts) { return get.call(this, type, /webgl/.test(type) ? Object.assign({}, opts, { preserveDrawingBuffer: true }) : opts); };

  const css = document.createElement("style");
  css.textContent = `
    #col[data-w="wide"] { --card-w: 400px; }
    #side { left: calc(var(--gut) + 400px + 16px) !important; }
    .srow { gap: 10px; }
    .srow .nm { font-size: 14.5px; }
    /* how far a story has been read: a ring that fills clockwise, in place of the words */
    .mark.doing { border-color: transparent; background: conic-gradient(var(--highlight) calc(var(--p, .12) * 1turn), var(--rule-2) 0); }
    .mark.doing::after { inset: 2px; border: 0; border-radius: 50%; background: var(--bg); transform: none; }
    .srow:hover .mark.doing::after, .srow.hot .mark.doing::after { background: var(--chip); }
    /* the timeline of a Moments story (ages, and the moments in the current age), drawn like a war's: a round play button, one slim
       segment per age with its name under it, the moments of this age as small badges above the bar, and the way out at the right */
    @media (min-width: 761px) {
      body.sdock { --dock-h: 92px; }
      body.sdock #dock { border-radius: 30px; }
      .sdock { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; grid-template-rows: 24px auto; column-gap: 16px; row-gap: 8px; align-items: center; padding: 10px 14px 8px 18px; }
      .sdock .row2 { display: contents; }
      .sdock .pillplay { grid-column: 1; grid-row: 1 / span 2; width: 44px; height: 44px; padding: 0; justify-content: center; }
      .sdock .pillplay span { display: none; }
      .sdock .chips { grid-column: 2; grid-row: 1; height: 24px; gap: 6px; padding: 0; mask-image: linear-gradient(90deg, #000 calc(100% - 24px), transparent 100%); }
      .sdock .echip { height: 22px; max-width: 300px; gap: 6px; padding: 0 9px 0 8px; border-color: var(--rule-2); border-radius: 11px; font-size: 11.5px; }
      .sdock .echip i { width: 8px; height: 8px; border-width: 1.5px; }
      .sdock .echip.on { border-color: var(--ink); }
      .sdock .parts { grid-column: 2; grid-row: 2; height: auto; gap: 3px; overflow: visible; }
      .sdock .part { min-width: 0; height: auto; padding: 0; gap: 5px; border: 0; border-radius: 0; background: none; justify-content: flex-start; color: var(--ink-3); }
      .sdock .part::before { content: ""; display: block; height: 8px; border-radius: 4px; background: var(--rule); }
      .sdock .part.seen { background: none; } .sdock .part.seen::before { background: var(--ink-3); }
      .sdock .part.on { flex: 2.2 1 0; min-width: 0; padding: 0; background: none; color: var(--ink); } .sdock .part.on::before { background: var(--ink); }
      .sdock .part:hover { color: var(--ink); } .sdock .part:hover::before { background: var(--rule-2); } .sdock .part.on:hover::before { background: var(--ink); }
      .sdock .part small, .sdock .part em { display: none; }
      .sdock .part b, .sdock .part.on b { display: block; max-height: none; font: 500 11px/14px var(--sans); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: unset; }
      .sdock .part.on b { font-weight: 700; }
      .sdock > .row2 > .pillbtn { grid-column: 3; grid-row: 1 / span 2; }
    }
  `;
  document.head.appendChild(css);

  const trim = (row) => {
    const mt = row.querySelector(".mt"); if (!mt || mt.dataset.trim) return;
    const b = mt.querySelector("b"), m = b && /(\d+) of (\d+)/.exec(b.textContent), mark = row.querySelector(".mark");
    if (m && mark) { mark.style.setProperty("--p", Math.max(.06, +m[1] / +m[2])); mark.title = `${m[1]} of ${m[2]} read`; mark.setAttribute("aria-label", `Started: ${m[1]} of ${m[2]} read`); }
    mt.textContent = mt.textContent.split(" · ")[0]; mt.dataset.trim = "1"; // the dates only
  };
  new MutationObserver(() => document.querySelectorAll(".srow").forEach(trim)).observe(document.documentElement, { childList: true, subtree: true });
})();
