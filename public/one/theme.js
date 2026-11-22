/* The atlas's look: "sage" (light) or "midnight" (dark). Loaded in the head, before the styles, so the page is never drawn in the wrong
   one. The choice is kept in this browser; without one, the device's own light or dark setting decides. ?theme=sage|midnight in the
   address shows one without keeping it. World history in the frame takes the same look (one/hist-patch.js). */
window.LOOK = (() => {
  const ALL = ["sage", "midnight"], KEY = "atlas.look";
  const saved = () => { try { const t = localStorage.getItem(KEY); return ALL.includes(t) ? t : null; } catch (e) { return null; } };
  const asked = new URLSearchParams(location.search).get("theme");
  const pick = () => (ALL.includes(asked) ? asked : saved() || (matchMedia("(prefers-color-scheme: dark)").matches ? "midnight" : "sage"));
  const apply = (t) => { document.documentElement.dataset.theme = t; const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t === "midnight" ? "#121211" : "#f1f5f2"; };
  apply(pick());
  return { get: () => document.documentElement.dataset.theme, set(t) { if (!ALL.includes(t)) return; try { localStorage.setItem(KEY, t); } catch (e) {} apply(t); }, toggle() { this.set(this.get() === "midnight" ? "sage" : "midnight"); return this.get(); } };
})();
