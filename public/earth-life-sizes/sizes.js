// The size charts are dense, so each page's chart fills the width of the window, and a click opens it on its own, full screen: there a
// click zooms in 2.5 times where it lands, dragging moves around it, the wheel or a pinch zooms, and Esc or the close button goes back.
// The same behaviour as the Earth gallery's charts and posters (imZoom in public/one/one.js). No dependencies; loaded by every size page.
(() => {
  const chart = document.querySelector('.chart'); if (!chart) return;
  const box = document.createElement('div');
  box.className = 'zoombox'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'The size chart, full screen');
  box.innerHTML = '<img alt=""><button type="button" class="zclose" aria-label="Close the chart">×</button><p class="zhint">Click to zoom in · drag to move · Esc to close</p>';
  document.body.appendChild(box);
  const img = box.querySelector('img'), shut = box.querySelector('.zclose');
  img.src = chart.currentSrc || chart.src; img.alt = chart.alt;
  let z = 1, x = 0, y = 0, drag = null, moved = false;
  const pts = new Map(); let pinch = 0;
  const apply = () => { img.style.transform = z > 1 ? `translate(${x}px, ${y}px) scale(${z})` : ''; box.classList.toggle('zoomed', z > 1); };
  const at = (e) => { const b = box.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  function zoomAt(nz, cx, cy) {
    nz = Math.max(1, Math.min(6, nz));
    if (nz === 1) { z = 1; x = 0; y = 0; } else { x = cx - (cx - x) * nz / z; y = cy - (cy - y) * nz / z; z = nz; }
    apply();
  }
  function open() { box.hidden = false; zoomAt(1); document.documentElement.style.overflow = 'hidden'; shut.focus(); }
  function close() { box.hidden = true; document.documentElement.style.overflow = ''; chart.focus(); }
  chart.tabIndex = 0; chart.setAttribute('role', 'button'); chart.title = 'Open the chart full screen to zoom in';
  chart.addEventListener('click', open);
  chart.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  shut.addEventListener('click', close);
  addEventListener('keydown', (e) => { if (!box.hidden && e.key === 'Escape') close(); });
  img.addEventListener('pointerdown', (e) => {
    e.preventDefault(); try { img.setPointerCapture(e.pointerId); } catch (err) { /* not every pointer can be captured */ }
    pts.set(e.pointerId, at(e));
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); drag = null; } else { drag = at(e); moved = false; }
  });
  img.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return; const p = at(e); pts.set(e.pointerId, p);
    if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); zoomAt(z * d / pinch, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); pinch = d; moved = true; return; }
    if (!drag) return; const dx = p[0] - drag[0], dy = p[1] - drag[1];
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    if (moved && z > 1) { x += dx; y += dy; drag = p; apply(); }
  });
  const lift = (e) => { const p = at(e); if (drag && !moved && pts.size === 1) zoomAt(z > 1 ? 1 : 2.5, p[0], p[1]); pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; if (!pts.size) drag = null; };
  img.addEventListener('pointerup', lift); img.addEventListener('pointercancel', (e) => { pts.delete(e.pointerId); drag = null; pinch = 0; });
  box.addEventListener('wheel', (e) => { e.preventDefault(); const [cx, cy] = at(e); zoomAt(z * Math.exp(-Math.max(-120, Math.min(120, e.deltaY)) * .002), cx, cy); }, { passive: false });
})();
