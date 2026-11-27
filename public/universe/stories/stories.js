/* Stories of the universe (public/universe/stories/): six animated stories, each a few chapters long, drawn on one 2D canvas.
   A chapter is a text (with its facts and sources) and a draw(v, t) function: v is the free area beside the text card, t the seconds
   since the chapter began. Chapters cross-fade; a story plays through and stops on its last chapter. Address: #<story>/<chapter>.
   Sizes and distances are to scale wherever a chapter says so; colours, glows and surface patterns are an artist's impression. */
(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
const ease = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); }, easeO = (k) => 1 - Math.pow(1 - clamp(k, 0, 1), 3);
const lerpLog = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
const fmt = (n) => Math.round(n).toLocaleString('en');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches;

const cv = $('cv'); let g = cv.getContext('2d'); // g is swapped for a card's canvas while its still is drawn
let W = 0, H = 0, DPR = 1;
function size() {
  const d = Math.min(2, devicePixelRatio || 1), w = innerWidth, h = innerHeight;
  if (w !== W || h !== H || d !== DPR) { W = w; H = h; DPR = d; cv.width = Math.round(w * d); cv.height = Math.round(h * d); }
}
// the free area beside the text card (desktop: to its right; phone: above it)
function viewport(w, h, text) {
  const ph = w <= 760;
  const x0 = ph ? 12 : text ? 470 : 40, x1 = w - (ph ? 12 : 40), y0 = ph ? 72 : 88, y1 = ph ? (text ? h * .47 : h - 110) : h - 140;
  return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, W: w, H: h, ph, s: Math.min(x1 - x0, y1 - y0) };
}

// ---------------------------------------------------------------- colour and drawing helpers
const C = { M: [255, 128, 82], K: [255, 178, 108], G: [255, 232, 190], F: [252, 246, 232], A: [214, 226, 255], B: [168, 196, 255], WD: [236, 242, 255], BD: [176, 82, 70] };
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mixc = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const WHITE = [255, 255, 255], BLACK = [0, 0, 0];

function disc(x, y, r, fill) { g.beginPath(); g.arc(x, y, Math.max(r, .3), 0, TAU); g.fillStyle = fill; g.fill(); }
function glow(x, y, r, c, a = 1) {
  if (r <= 0) return;
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, rgba(c, a)); gr.addColorStop(.22, rgba(c, a * .32)); gr.addColorStop(.55, rgba(c, a * .08)); gr.addColorStop(1, rgba(c, 0));
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore();
}
// a star: limb-darkened disc with moving granulation when large, and a glow; a speck with a glow when tiny
function star(x, y, r, c, t = 0, seed = 1, big = 1) {
  if (r < 1.6) { glow(x, y, 7 + r * 5, c, .9); disc(x, y, Math.max(.9, r), rgba(mixc(c, WHITE, .6))); return; }
  glow(x, y, r * (1.8 + .6 * big), c, .5);
  const gr = g.createRadialGradient(x - r * .12, y - r * .12, 0, x, y, r);
  gr.addColorStop(0, rgba(mixc(c, WHITE, .75))); gr.addColorStop(.55, rgba(mixc(c, WHITE, .3))); gr.addColorStop(.9, rgba(c)); gr.addColorStop(1, rgba(mixc(c, BLACK, .45)));
  disc(x, y, r, gr);
  if (r > 14) { // convection cells: a few big ones on a supergiant, many small ones otherwise
    // soft-edged cells, small on an ordinary star and few and huge on a supergiant (as in images of Betelgeuse and Antares)
    const R = rng(seed), n = Math.round(big > 1 ? clamp(r * 1.2, 30, 220) / (big * big) : clamp(r * 2.5, 40, 500));
    g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
    for (let i = 0; i < n; i++) {
      const a = R() * TAU + t * .015 * (R() - .5), d = Math.sqrt(R()) * r, s = r * (big > 1 ? (.025 + .045 * R()) * big * big : .012 + .02 * R());
      const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d, f = .5 + .5 * Math.sin(t * .5 + i * 1.7), cc = R() < .55 ? mixc(c, BLACK, .3) : mixc(c, WHITE, .4);
      const al = big > 1 ? .1 + .08 * f : .05 + .04 * f, gr = g.createRadialGradient(px, py, 0, px, py, s); gr.addColorStop(0, rgba(cc, al)); gr.addColorStop(1, rgba(cc, 0));
      g.fillStyle = gr; g.fillRect(px - s, py - s, 2 * s, 2 * s);
    }
    g.restore();
  }
}
// planets: banded giants, rocky worlds, the Earth with land, sea, cloud and ice; lit from the left
const LOOK = {
  mercury: { base: [150, 144, 138], spots: [[110, 104, 98], [178, 172, 164]] },
  venus: { base: [226, 196, 140], bands: [[236, 210, 160], [214, 182, 126]], soft: 1 },
  earth: { base: [36, 86, 168] },
  moon: { base: [160, 158, 152], spots: [[118, 116, 112], [190, 188, 182]] },
  mars: { base: [190, 98, 58], spots: [[150, 70, 44], [214, 140, 96]], cap: 1 },
  jupiter: { base: [214, 186, 150], bands: [[236, 222, 198], [176, 126, 92], [226, 204, 170], [160, 112, 82], [240, 230, 212], [196, 150, 112]], grs: 1 },
  saturn: { base: [226, 204, 156], bands: [[238, 222, 182], [204, 176, 124], [232, 214, 170], [214, 190, 140]] },
  uranus: { base: [168, 220, 226], bands: [[178, 228, 232], [156, 210, 218]], soft: 1 },
  neptune: { base: [142, 188, 205], bands: [[153, 198, 214], [130, 177, 196]], soft: 1 },
  rock: { base: [140, 120, 104], spots: [[104, 88, 76], [170, 150, 130]] },
  lava: { base: [60, 40, 34] }, hot: { base: [220, 120, 70], bands: [[240, 150, 90], [200, 100, 60]] }, ice: { base: [196, 214, 230], spots: [[170, 190, 210], [220, 232, 242]] },
};
const EARTHLAND = (() => { const R = rng(7), a = []; for (let i = 0; i < 26; i++) a.push([R() * TAU, (R() - .5) * 2.2, .25 + R() * .45, R()]); return a; })();
const CLOUDS = (() => { const R = rng(11), a = []; for (let i = 0; i < 70; i++) a.push([R() * TAU, (R() - .5) * 2.6, .04 + R() * .12, R()]); return a; })();
function blobsOnSphere(x, y, r, list, spin, col, alpha) {
  for (const [lon0, lat, sz, k] of list) {
    const lon = lon0 + spin, cl = Math.cos(lat * .55), vx = Math.sin(lon) * cl, vz = Math.cos(lon) * cl, vy = Math.sin(lat * .55);
    if (vz < -.1) continue;
    const s = r * sz * (.6 + .4 * Math.max(vz, 0));
    g.beginPath(); g.ellipse(x + vx * r, y - vy * r, s * Math.max(.15, vz), s * .8, 0, 0, TAU);
    g.fillStyle = typeof col === 'function' ? col(k) : col; g.globalAlpha = alpha * clamp(vz * 3 + .3, 0, 1); g.fill(); g.globalAlpha = 1;
  }
}
// ---------------------------------------------------------------- the planets as they look: a map of each surface wrapped on a lit sphere
// Each planet has an equirectangular map (built once: the Earth from the atlas's own present-day height map and land colours, the others
// painted from what spacecraft show), turned on its axis and tilted by its real axial tilt. Each frame a sphere is shaded from that map.
// how each axis is drawn: [lean across the picture, tip towards us], degrees. The leans are the axial tilts from the NASA fact sheets; Saturn's
// 26.7° is split so that its rings open towards us as they often do seen from the Earth; Uranus lies on its side (97.8°)
const ORI = { mercury: [0, 0], venus: [0, 0], earth: [23.4, 0], moon: [6.7, 0], mars: [25.2, 0], jupiter: [3.1, 0], saturn: [12, 17.5], uranus: [97.8, 0], neptune: [28.3, 0] };
const SPIN = { mercury: .03, venus: -.02, earth: .12, moon: .02, mars: .12, jupiter: .25, saturn: .22, uranus: .1, neptune: .15 };
const GAS = { jupiter: 1, saturn: 1, uranus: 1, neptune: 1, venus: 1 };
const hash3 = (x, y, z) => { let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = (a, b, d) => hash3(xi + a, yi + b, zi + d);
  return lerp(lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v), lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
const fbm3 = (x, y, z, o = 4) => { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * vnoise(x * f, y * f, z * f); f *= 2.03; a *= .5; } return s; };
// craters: a fixed list of bowls on the sphere, dark floors and bright rims, with a few bright ray systems
const CRATERS = (() => { const R = rng(19), a = []; for (let i = 0; i < 260; i++) { const z = R() * 2 - 1, th = R() * TAU, s = Math.sqrt(1 - z * z); const r = .015 + Math.pow(R(), 3) * .16; a.push([s * Math.cos(th), s * Math.sin(th), z, r, Math.cos(r * 1.25)]); } return a; })();
function crater(p) { let k = 0; for (const [x, y, z, r, edge] of CRATERS) { const dot = p[0] * x + p[1] * y + p[2] * z; if (dot > edge) { const q = Math.acos(Math.min(1, dot)) / r; k += q < .85 ? -.16 * (1 - q * q) : q < 1.1 ? .14 : 0; } } return k; }
// a belt or zone colour by latitude, blended over a degree or so at each edge: hard edges turn to stairs when a planet is drawn large
const band = (lat, table) => { const i = Math.max(0, table.findIndex(([lo, hi]) => lat >= lo && lat < hi)), [lo, hi, c] = table[i], w = 1.1;
  if (lat - lo < w && i > 0) return mixc(table[i - 1][2], c, .5 + .5 * (lat - lo) / w); if (hi - lat < w && i < table.length - 1) return mixc(table[i + 1][2], c, .5 + .5 * (hi - lat) / w); return c; };
const JUP = [[-90, -45, [168, 160, 150]], [-45, -33, [226, 214, 192]], [-33, -27, [176, 128, 96]], [-27, -19, [238, 228, 206]], [-19, -7, [168, 112, 78]], [-7, 7, [232, 216, 184]],
  [7, 18, [154, 98, 68]], [18, 24, [236, 224, 200]], [24, 31, [170, 122, 90]], [31, 45, [222, 210, 188]], [45, 91, [164, 158, 150]]]; // belts and zones, after Cassini and Juno images
const SAT = [[-90, -62, [196, 184, 150]], [-62, -40, [222, 202, 158]], [-40, -30, [206, 180, 130]], [-30, -20, [228, 208, 164]], [-20, -10, [214, 186, 134]], [-10, 10, [234, 214, 170]],
  [10, 20, [212, 184, 132]], [20, 30, [228, 206, 160]], [30, 40, [204, 178, 128]], [40, 62, [220, 200, 158]], [62, 75, [196, 186, 156]], [75, 91, [150, 162, 172]]]; // the blue-grey hexagon at the north pole
const PAINTS = {
  mercury: (lon, lat, p) => { const n = fbm3(p[0] * 4, p[1] * 4, p[2] * 4), k = crater(p); const c = mixc([118, 112, 106], [178, 170, 160], n); return mixc(c, k < 0 ? [70, 66, 62] : [214, 206, 196], Math.min(1, Math.abs(k) * 2.2)); },
  moon: (lon, lat, p) => { const n = fbm3(p[0] * 3, p[1] * 3, p[2] * 3), mare = fbm3(p[0] * 1.6 + 5, p[1] * 1.6, p[2] * 1.6) > .55 && p[0] > -.2, k = crater(p);
    let c = mare ? mixc([84, 82, 80], [110, 108, 104], n) : mixc([150, 148, 142], [196, 194, 188], n); return mixc(c, k < 0 ? [70, 68, 66] : [226, 224, 218], Math.min(1, Math.abs(k) * 2)); },
  venus: (lon, lat, p) => { const n = fbm3(p[0] * 2 + lat * 3, p[1] * 2, p[2] * 6); return mixc([214, 186, 132], [240, 222, 180], n); }, // sulphuric-acid cloud tops: pale and almost featureless in visible light
  mars: (lon, lat, p) => { const n = fbm3(p[0] * 2.4, p[1] * 2.4, p[2] * 2.4), f = fbm3(p[0] * 9, p[1] * 9, p[2] * 9);
    let c = mixc([196, 108, 64], [214, 140, 92], f); if (n > .53) c = mixc(c, [112, 66, 46], clamp((n - .53) * 6, 0, .85)); // dark regions such as Syrtis Major
    const dl = lon * 180 / Math.PI, dp = lat * 180 / Math.PI; if (dp > -10 && dp < -3 && dl > -100 && dl < -40) c = mixc(c, [96, 56, 40], .55 * (1 - Math.abs(dp + 6.5) / 3.5)); // Valles Marineris
    if (dp > 78 || dp < -83) c = mixc(c, [242, 240, 236], clamp((Math.abs(dp) - (dp > 0 ? 78 : 83)) / 3, 0, 1)); return c; },
  jupiter: (lon, lat, p) => { const dp = lat * 180 / Math.PI + (fbm3(p[0] * 7, p[1] * 7, p[2] * 7) - .5) * 3.2 + Math.sin(lon * 9 + lat * 30) * .5;
    let c = band(dp, JUP); c = mixc(c, mixc(c, WHITE, .25), fbm3(p[0] * 16, p[1] * 16, p[2] * 16) * .5);
    c = mixc(c, mixc(c, [120, 80, 60], .5), Math.max(0, fbm3(p[0] * 45 + dp * .2, p[1] * 45, p[2] * 45, 3) - .5) * .9); // small eddies, seen up close
    const gx = lon / (14.5 * Math.PI / 180) * 2, gy = (lat * 180 / Math.PI + 22.5) / 4.5, gd = gx * gx + gy * gy; // the Great Red Spot: 16,350 km x about 11,000 km, at 22.5° S (2017)
    if (gd < 1.3) {
      const swirl = .5 + .5 * Math.sin(Math.sqrt(gd) * 17 + Math.atan2(gy, gx) * 2 + 2 * Math.sin(gx * 4));
      const spot = mixc([174, 68, 49], [232, 151, 110], .28 + .62 * swirl);
      c = mixc(c, gd < 1 ? spot : [240, 224, 204], gd < 1 ? .94 * (1 - gd * .22) : .7 * (1.3 - gd) / .3);
    }
    return c; },
  saturn: (lon, lat, p) => { const dp = lat * 180 / Math.PI + (fbm3(p[0] * 5, p[1] * 5, p[2] * 5) - .5) * 2; let c = band(dp, SAT); return mixc(c, mixc(c, WHITE, .2), fbm3(p[0] * 12, p[1] * 12, p[2] * 12) * .4); },
  uranus: (lon, lat, p) => { const dp = Math.abs(lat * 180 / Math.PI); return mixc([158, 212, 220], [190, 232, 236], clamp((dp - 20) / 60, 0, 1) * .8 + fbm3(p[0] * 3, p[1] * 3, p[2] * 3) * .15); },
  neptune: (lon, lat, p) => { const dp = lat * 180 / Math.PI, n = fbm3(p[0] * 4, p[1] * 4 + dp * .05, p[2] * 4); let c = mixc([125, 171, 190], [158, 202, 217], n);
    if (Math.abs(dp) > 18 && Math.abs(dp) < 50) c = mixc(c, [109, 158, 183], .35);
    const streak = fbm3(lon * 1.5, dp * .35, 3); if ((Math.abs(dp + 24) < 4 || Math.abs(dp - 32) < 3) && streak > .58) c = mixc(c, [236, 242, 255], clamp((streak - .58) * 6, 0, .9)); return c; },
};
const TX = {};
function buildTex(kind, fn, w = 512, h = 256) {
  const d = new Uint8ClampedArray(w * h * 3);
  for (let j = 0; j < h; j++) { const lat = (.5 - (j + .5) / h) * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
    for (let i = 0; i < w; i++) { const lon = ((i + .5) / w) * TAU - Math.PI, c = fn(lon, lat, [cl * Math.cos(lon), cl * Math.sin(lon), sl]), o = (j * w + i) * 3; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; } }
  TX[kind] = { w, h, d };
}
// the Earth from the atlas's data: land and sea depth from the present-day height map (data/paleo/0.webp, PALEOMAP), land colour from today's
// climate classes (data/paleo/climate-now.png, Beck et al. 2018), and clouds painted over the storm belts
function pixels(url) { return fetch(url).then((r) => r.blob()).then((b) => createImageBitmap(b, { colorSpaceConversion: 'none' })).then((bm) => { const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height; const x = c.getContext('2d'); x.drawImage(bm, 0, 0); return { w: bm.width, h: bm.height, d: x.getImageData(0, 0, bm.width, bm.height).data }; }); }
Promise.all([pixels('../../data/paleo/0.webp'), pixels('../../data/paleo/climate-now.png')]).then(([hm, cl]) => {
  const at = (im, lon, lat) => { const i = clamp(Math.floor((lon / TAU + .5) * im.w), 0, im.w - 1), j = clamp(Math.floor((.5 - lat / Math.PI) * im.h), 0, im.h - 1); return (j * im.w + i) * 4; };
  buildTex('earth', (lon, lat, p) => {
    const e = hm.d[at(hm, lon, lat)]; let c;
    if (e > 128) { const k = at(cl, lon, lat); c = [cl.d[k], cl.d[k + 1], cl.d[k + 2]]; if (lat < -1.1) c = [236, 240, 244]; }
    else c = mixc([8, 30, 82], [30, 84, 150], Math.pow(e / 127, 2.2));
    const dp = Math.abs(lat * 180 / Math.PI), belt = Math.exp(-dp * dp / 40) * .5 + Math.exp(-Math.pow(dp - 55, 2) / 180) * .6 + .15;
    const cloud = clamp((fbm3(p[0] * 3.5, p[1] * 3.5, p[2] * 3.5, 5) - .62 + belt * .25) * 3.2, 0, .85);
    return mixc(c, [250, 252, 255], cloud);
  }, 1024, 512);
}).catch(() => {});
const SPH = new Map();
// Equatorial and polar radii relative to the mean radius (NASA fact sheets).
const OBLATE = { jupiter: [71492 / 69911, 66854 / 69911], saturn: [60268 / 58232, 54364 / 58232] };
function planetPoint(x, y, kind) {
  const shape = OBLATE[kind];
  if (!shape) return [x, y];
  const roll = ORI[kind][0] * Math.PI / 180, tip = ORI[kind][1] * Math.PI / 180;
  const c = Math.cos(roll), s = Math.sin(roll), [equator, pole] = shape;
  const a = (x * c + y * s) * equator, b = (y * c - x * s) * Math.hypot(pole * Math.cos(tip), equator * Math.sin(tip));
  return [a * c - b * s, a * s + b * c];
}
function sphereImg(kind, D, spin) {
  if (!TX[kind]) { if (!PAINTS[kind]) return null; buildTex(kind, PAINTS[kind]); }
  // Sample the map at a bounded resolution. Keep one raster per planet so zooming and rotation do not allocate a canvas every frame.
  D = D < 24 ? clamp(Math.round(D), 6, 24) : Math.min(240, Math.round(D / 8) * 8);
  spin = Math.round(spin * 150) / 150;
  const tx = TX[kind];
  let raster = SPH.get(kind);
  if (!raster) { const canvas = document.createElement('canvas'); raster = { canvas, ctx: canvas.getContext('2d') }; SPH.set(kind, raster); }
  if (raster.canvas.width !== D || !raster.image) {
    raster.canvas.width = raster.canvas.height = D;
    raster.image = raster.ctx.createImageData(D, D);
    raster.spin = null;
  }
  if (raster.spin === spin && raster.texture === tx) return raster.canvas;
  const o = raster.image.data, R = D / 2;
  const [rl, nd] = ORI[kind] || [0, 0], tl = rl * Math.PI / 180, ct = Math.cos(tl), st = Math.sin(tl), cn = Math.cos(nd * Math.PI / 180), sn = Math.sin(nd * Math.PI / 180), gas = GAS[kind];
  const L = [-.52, .24, .82], Ln = Math.hypot(...L), l0 = L[0] / Ln, l1 = L[1] / Ln, l2 = L[2] / Ln;
  for (let py = 0; py < D; py++) for (let px = 0; px < D; px++) {
    const nx = (px + .5 - R) / R, ny = (R - py - .5) / R, rr = nx * nx + ny * ny; if (rr > 1) continue;
    const nz = Math.sqrt(1 - rr), ax = nx * ct - ny * st, ay0 = nx * st + ny * ct; // the axis leans across the picture, then tips towards us
    const ay = ay0 * cn + nz * sn, az = nz * cn - ay0 * sn, lat = Math.asin(clamp(ay, -1, 1)), lon = Math.atan2(ax, az) + spin;
    const u = (((lon / TAU + .5) % 1) + 1) % 1 * tx.w, v = clamp((.5 - lat / Math.PI) * tx.h, 0, tx.h - 1);
    const ix = Math.floor(u), iy = Math.floor(v), fx = u - ix, fy = v - iy;
    const i0 = (iy * tx.w + ix) * 3, i1 = (iy * tx.w + (ix + 1) % tx.w) * 3;
    const row = iy < tx.h - 1 ? tx.w * 3 : 0;
    const dif = Math.max(0, nx * l0 + ny * l1 + nz * l2), lit = (.035 + .965 * Math.pow(dif, gas ? .8 : 1)) * (gas ? .6 + .4 * Math.sqrt(nz) : 1);
    const a = clamp((1 - Math.sqrt(rr)) * R * 1.6, 0, 1), k = (py * D + px) * 4;
    for (let q = 0; q < 3; q++) o[k + q] = lerp(lerp(tx.d[i0 + q], tx.d[i1 + q], fx), lerp(tx.d[i0 + row + q], tx.d[i1 + row + q], fx), fy) * lit;
    o[k + 3] = 255 * a;
  }
  raster.ctx.putImageData(raster.image, 0, 0);
  raster.spin = spin; raster.texture = tx; return raster.canvas;
}
function planet(x, y, r, kind, t = 0, o = {}) {
  const L = LOOK[kind] || LOOK.rock;
  if (r < 1.4) { disc(x, y, Math.max(.8, r), rgba(mixc(L.base, WHITE, .3))); glow(x, y, 5, L.base, .5); return; }
  if (PAINTS[kind] || kind === 'earth') { // the real look, once its map is ready (the Earth's needs two images to load)
    const img = sphereImg(kind, 2 * r * Math.min(DPR, 2), o.spin ?? t * SPIN[kind]);
    if (img) {
      if (o.ringsBack) o.ringsBack();
      g.save(); g.translate(x, y);
      if (OBLATE[kind]) { const u = planetPoint(1, 0, kind), v = planetPoint(0, 1, kind); g.transform(u[0], u[1], v[0], v[1], 0, 0); }
      g.drawImage(img, -r, -r, 2 * r, 2 * r); g.restore();
      if (kind === 'earth' || kind === 'venus' || kind === 'neptune' || kind === 'uranus') { g.beginPath(); g.arc(x, y, r * 1.012, -2.2, .9); g.strokeStyle = rgba(kind === 'earth' ? [120, 180, 255] : kind === 'venus' ? [255, 236, 200] : [170, 210, 255], .45); g.lineWidth = Math.max(1, r * .025); g.stroke(); }
      if (o.ringsFront) o.ringsFront();
      return;
    }
  }
  if (o.ringsBack) o.ringsBack();
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
  g.fillStyle = rgba(L.base); g.fillRect(x - r, y - r, 2 * r, 2 * r);
  if (L.bands) { // latitude bands, edges rippling slowly
    const n = L.soft ? 7 : 15, R = rng(kind.length * 13);
    for (let i = 0; i < n; i++) {
      const y0 = y - r + (i + .2 * R()) * 2 * r / n, hgt = 2 * r / n * (.6 + .8 * R()), c = L.bands[i % L.bands.length];
      g.beginPath(); g.moveTo(x - r, y0);
      for (let k = 0; k <= 24; k++) { const xx = x - r + k * r / 12; g.lineTo(xx, y0 + Math.sin(k * .9 + t * .25 + i) * hgt * (L.soft ? .05 : .12)); }
      g.lineTo(x + r, y0 + hgt); g.lineTo(x - r, y0 + hgt); g.closePath(); g.fillStyle = rgba(c, L.soft ? .35 : .75); g.fill();
    }
    if (L.grs && r > 6) { g.beginPath(); g.ellipse(x + r * .25, y + r * .37, r * .117, r * .07, 0, 0, TAU); g.fillStyle = 'rgba(196,92,62,.9)'; g.fill(); } // 16,350 km wide, as in 2017
  }
  if (L.spots) { const R = rng(kind.length * 31 + 1); for (let i = 0; i < 26; i++) { disc(x + (R() - .5) * 2 * r, y + (R() - .5) * 2 * r, r * (.05 + .14 * R()), rgba(L.spots[i % 2], .35)); } }
  if (L.cap) { g.beginPath(); g.ellipse(x, y - r * .93, r * .38, r * .14, 0, 0, TAU); g.fillStyle = 'rgba(240,236,230,.85)'; g.fill(); }
  if (kind === 'earth') {
    const spin = t * .12;
    blobsOnSphere(x, y, r, EARTHLAND, spin, (k) => k < .5 ? 'rgb(74,122,64)' : k < .8 ? 'rgb(150,132,88)' : 'rgb(98,140,72)', .95);
    g.beginPath(); g.ellipse(x, y - r * .96, r * .5, r * .14, 0, 0, TAU); g.ellipse(x, y + r * .97, r * .55, r * .14, 0, 0, TAU); g.fillStyle = 'rgba(240,246,250,.9)'; g.fill();
    blobsOnSphere(x, y, r, CLOUDS, spin * 1.25, 'rgb(250,252,255)', .38);
  }
  if (o.paint) o.paint(x, y, r);
  // night side and limb
  const lx = o.lx ?? -.75, ly = o.ly ?? -.35;
  const sh = g.createRadialGradient(x + lx * r * .55, y + ly * r * .55, r * .1, x + lx * r * .2, y + ly * r * .2, r * 1.35);
  sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.55, 'rgba(0,0,0,.08)'); sh.addColorStop(1, `rgba(0,0,0,${o.night ?? .82})`);
  g.fillStyle = sh; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
  if (kind === 'earth' || kind === 'venus' || kind === 'neptune' || kind === 'uranus') { g.beginPath(); g.arc(x, y, r * 1.015, 0, TAU); g.strokeStyle = rgba(kind === 'earth' ? [120, 180, 255] : mixc(L.base, WHITE, .4), .35); g.lineWidth = Math.max(1, r * .03); g.stroke(); }
  if (o.ringsFront) o.ringsFront();
}
// Main ring boundaries in km from Saturn’s centre (Cassini). Compress the annuli in their plane before rotating them.
const SATURN_RING_EDGE = 136775;
function saturnRings(x, y, scale) {
  const tilt = Math.sin(ORI.saturn[1] * Math.PI / 180), rot = ORI.saturn[0] * Math.PI / 180;
  const bands = [[74658, 92000, .24, [171, 157, 136]], [92000, 117580, .88, [231, 219, 191]],
    [122170, 133410, .68, [214, 203, 177]], [133730, SATURN_RING_EDGE, .58, [214, 203, 177]]];
  const draw = (front) => {
    const edge = SATURN_RING_EDGE * scale;
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, tilt);
    g.beginPath(); g.rect(-edge, front ? 0 : -edge, 2 * edge, edge); g.clip();
    for (const [inner, outer, alpha, color] of bands) {
      for (let i = 0; i < 14; i++) {
        const a = lerp(inner, outer, i / 14) * scale, b = lerp(inner, outer, (i + 1.07) / 14) * scale;
        g.beginPath(); g.arc(0, 0, b, 0, TAU); g.moveTo(a, 0); g.arc(0, 0, a, 0, TAU);
        g.fillStyle = rgba(color, alpha * (.83 + .17 * Math.sin(i * 2.1 + inner))); g.fill('evenodd');
      }
    }
    g.restore();
  };
  return { back: () => draw(false), front: () => draw(true) };
}
let THUMB = false; // a card's still: no labels, they are unreadable at that size
function label(x, y, text, sub, o = {}) {
  if (THUMB) return;
  g.save(); g.textAlign = o.align || 'center'; g.textBaseline = 'alphabetic'; g.globalAlpha = o.a ?? 1;
  g.font = `${o.w || 600} ${o.size || 13}px Inter, system-ui, sans-serif`; g.fillStyle = o.color || '#f4efe6';
  g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = 6; g.fillText(text, x, y);
  if (sub) { g.font = `400 ${(o.size || 13) - 1.5}px Inter, system-ui, sans-serif`; g.fillStyle = o.subColor || '#c3beb2'; g.fillText(sub, x, y + (o.size || 13) + 3); }
  g.restore();
}
function line(x0, y0, x1, y1, c = 'rgba(244,239,230,.55)', w = 1, dash) { g.save(); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.strokeStyle = c; g.lineWidth = w; if (dash) g.setLineDash(dash); g.stroke(); g.restore(); }
function ring(x, y, r, c = 'rgba(244,239,230,.3)', w = 1, dash, ry) { g.save(); g.beginPath(); g.ellipse(x, y, Math.max(r, .1), Math.max(ry ?? r, .1), 0, 0, TAU); g.strokeStyle = c; g.lineWidth = w; if (dash) g.setLineDash(dash); g.stroke(); g.restore(); }
// a measuring bar with end ticks, drawn out over k (0..1)
function measure(x0, y, x1, k, text, sub, c = 'rgba(255,210,122,.9)') {
  const xe = lerp(x0, x1, easeO(k)); line(x0, y, xe, y, c, 1.5); line(x0, y - 5, x0, y + 5, c, 1.5); if (k > .98) line(x1, y - 5, x1, y + 5, c, 1.5);
  if (k > .6) label((x0 + x1) / 2, y - (sub ? 20 : 10), text, sub, { a: ease((k - .6) / .4), color: '#ffd27a' });
}

// the sky behind every chapter: fixed random stars, twinkling a little
const SKY = (() => { const R = rng(3), a = []; for (let i = 0; i < 700; i++) a.push([R(), R(), Math.pow(R(), 3) * 1.4 + .25, R(), R()]); return a; })();
function sky(w, h, t, dim = 1, drift = 0) {
  for (const [x, y, s, ph, hue] of SKY) {
    const tw = .65 + .35 * Math.sin(t * (.6 + ph) + ph * 40);
    const px = ((x * w + drift * s * 30) % w + w) % w;
    g.fillStyle = rgba(hue < .2 ? [255, 210, 170] : hue > .85 ? [190, 210, 255] : [240, 240, 236], .55 * tw * dim * Math.min(1, s));
    g.fillRect(px, y * h, s, s);
  }
}
// galaxy pictures, drawn once into small canvases and then scaled: a barred spiral (the Milky Way), Andromeda seen almost edge on,
// and irregular dwarfs
function sprite(n, fn) { const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'); const old = g; g = x; fn(n); g = old; return c; }
function spiralSprite(n, seed, arms = 2, warm = [255, 226, 180], cool = [150, 180, 255], bar = 1) {
  // a disc of faint stars thinning outwards, brighter arms along logarithmic spirals (with minor arms between when arms is 4),
  // pink star-forming knots in the arms and a warm bulge: many small, faint additive dots so the light builds up smoothly
  return sprite(n, () => {
    const R = rng(seed), c = n / 2, k2 = (n / 512) * (n / 512);
    glow(c, c, n * .5, warm, .22); glow(c, c, n * .14, [255, 236, 200], .85);
    g.globalCompositeOperation = 'lighter';
    const disc = Math.round(16000 * k2 + 300), arm = Math.round(22000 * k2 + 500);
    for (let i = 0; i < disc; i++) { const rr = -Math.log(1 - R() * .97) * .11, th = R() * TAU; if (rr > .49) continue;
      g.fillStyle = rgba(mixc(warm, cool, clamp(rr * 2.4, 0, 1)), .1 + .12 * R()); g.fillRect(c + Math.cos(th) * rr * n, c + Math.sin(th) * rr * n, 1, 1); }
    for (let i = 0; i < arm; i++) {
      const a = i % arms, major = arms < 4 || a % 2 === 0, rr = .05 + Math.pow(R(), .8) * .43;
      const th = a * TAU / arms + Math.log(rr * 12) * 2.6 + (R() - .5) * (major ? .5 : .8) * (1.1 - rr), sp = (R() - .5) * .035;
      const px = c + Math.cos(th) * (rr + sp) * n, py = c + Math.sin(th) * (rr + sp) * n;
      g.fillStyle = rgba(mixc(warm, cool, clamp(rr * 2.6, 0, 1)), (major ? .2 : .1) + .2 * R()); g.fillRect(px, py, 1 + R(), 1 + R());
      if (R() < .02 && rr > .14) { g.fillStyle = 'rgba(255,120,170,.4)'; g.fillRect(px, py, 2, 2); }
    }
    if (bar) { g.save(); g.translate(c, c); g.rotate(.5); g.scale(1, .32); const gr = g.createRadialGradient(0, 0, 0, 0, 0, n * .12); gr.addColorStop(0, 'rgba(255,232,190,.65)'); gr.addColorStop(1, 'rgba(255,232,190,0)'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, n * .12, 0, TAU); g.fill(); g.restore(); }
    g.globalCompositeOperation = 'source-over';
  });
}
function blobSprite(n, seed, c1 = [200, 214, 255]) { return sprite(n, () => { const R = rng(seed), c = n / 2; g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 2600; i++) { const a = R() * TAU, d = Math.pow(R(), 1.6) * n * .45; g.fillStyle = rgba(mixc(c1, [255, 230, 200], R()), .5); g.fillRect(c + Math.cos(a) * d * (1 + .3 * Math.sin(a * 3 + seed)), c + Math.sin(a) * d * .7, 1.6, 1.6); } glow(c, c, n * .35, c1, .55); }); }
// the galaxy types of a deep field, as Hubble shows them: smooth yellow-orange ellipticals, spirals with blue arms and yellow cores,
// thin edge-on discs split by a dust lane, lumpy blue irregulars, and the most distant as small red smudges
let MW = null, M31 = null, M33 = null, LMC = null, SMC = null, SGR = null;
function sprites() {
  if (MW) return;
  MW = spiralSprite(640, 5, 4); M31 = spiralSprite(512, 9, 2, [255, 214, 170], [170, 190, 255], 0); M33 = spiralSprite(256, 13, 2, [220, 220, 255], [140, 180, 255], 0);
  LMC = blobSprite(192, 21); SMC = blobSprite(128, 23); SGR = blobSprite(128, 27, [255, 214, 170]);

}
function drawSprite(img, x, y, size, rot = 0, squash = 1, a = 1) { if (size < 2) { glow(x, y, 6, [230, 230, 255], .6 * a); return; }
  if (size < 70) glow(x, y, size * .7, [235, 225, 255], a * (1 - size / 70) * .9); /* drawn small, a picture fades to nothing: a glow keeps it seen */ g.save(); g.globalAlpha = a; g.globalCompositeOperation = 'lighter'; g.translate(x, y); g.rotate(rot); g.scale(1, squash); g.drawImage(img, -size / 2, -size / 2, size, size); g.restore(); }

// ---------------------------------------------------------------- story 1: the Earth among the planets
const KM = { Mercury: 2439.7, Venus: 6051.8, Earth: 6371, Mars: 3389.5, Jupiter: 69911, Saturn: 58232, Uranus: 25362, Neptune: 24622, Moon: 1737.4, Sun: 695700 }; // mean radii, NASA planetary fact sheets
const KIND = { Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Jupiter: 'jupiter', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune' };
const ROCKY = ['Mercury', 'Venus', 'Earth', 'Mars'], ALL8 = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
const halfW = (n) => n === 'Saturn' ? SATURN_RING_EDGE : KM[n];
function layout(names, s) { let x = 0; const pos = {}; names.forEach((n, i) => { const r = halfW(n) * s; x += (i ? Math.max(14, r * .25) : 0) + r; pos[n] = x; x += r; }); return { pos, total: x }; }
const fitScale = (names, width) => { let s = width / names.reduce((a, n) => a + halfW(n) * 2.25, 0); for (let i = 0; i < 4; i++) s *= width / layout(names, s).total; return s; };
function lineup(v, names, s, off, spinTime, pop, hl) {
  const { pos } = layout(names, s); let lastX = -1e9, bump = false;
  names.forEach((n, i) => {
    const k = pop ? pop(n, i) : 1; if (k <= 0) return;
    const x = off + pos[n], r = KM[n] * s * easeO(k), y = v.cy;
    let o = {};
    if (n === 'Saturn') { const rg = saturnRings(x, y, r / KM.Saturn); o = { ringsBack: rg.back, ringsFront: rg.front }; }
    planet(x, y, r, KIND[n], spinTime + i * 3, o);
    const close = i > 0 && x - lastX < 70; lastX = x; bump = close ? !bump : false;
    const ly = y + Math.max(r * (n === 'Saturn' ? .9 : 1), 3) + 22 + (bump ? 15 : 0); // close neighbours take turns, so their names do not run together
    label(x, ly, n, null, { a: clamp(k, 0, 1) * (hl && hl !== n ? .7 : 1), color: hl === n ? '#ffd27a' : '#f4efe6' });
  });
  return pos;
}
const voyagerPhoto = new Image();
voyagerPhoto.src = '../img/pale-blue-dot.jpg';
const S1 = {
  thumb: 1, id: 'planets', title: 'The Earth among the planets', short: 'Planets', accent: '#7cc0ff',
  blurb: 'Four rocky worlds, four giants and a Sun that could hold more than a million Earths.',
  chapters: [
    { short: 'Rocky worlds', title: 'Four rocky worlds',
      text: 'The four planets nearest the Sun are made of rock and metal. The Earth is the largest of them, with Venus close behind; Mars is about half the Earth\'s width and Mercury little more than a third.',
      facts: [['Earth', '12,742 km across'], ['Venus', '95% of the Earth\'s width'], ['Mars', '53%'], ['Mercury', '38%']],
      src: 'Source: NASA Planetary Fact Sheet (mean radii)', dur: 10,
      draw(v, t, spinTime = t) { const s = fitScale(ROCKY, v.w * .8), L = layout(ROCKY, s); lineup(v, ROCKY, s, v.cx - L.total / 2, spinTime, (n, i) => (t - .2 - i * .35) / .9, 'Earth'); } },
    { short: 'Giants', title: 'Then the giants',
      text: 'Beyond Mars the planets are giants of gas and ice. Jupiter is eleven times as wide as the Earth: about 1,300 Earths would fit inside it. Saturn, with its rings, is nearly as big; Uranus and Neptune are about four Earths across.',
      facts: [['Jupiter', '11.0 Earths across'], ['Saturn', '9.1 (rings: 21)'], ['Uranus', '4.0'], ['Neptune', '3.9']],
      src: 'Sources: NASA Planetary Fact Sheet; Irwin et al. 2024 (Uranus and Neptune colours)', dur: 12,
      draw(v, t, spinTime = t) {
        const s0 = fitScale(ROCKY, v.w * .8), s1 = fitScale(ALL8, v.w * .96), k = ease((t - .4) / 3), s = lerpLog(s0, s1, k);
        const L0 = layout(ROCKY, s0), e0 = v.cx - L0.total / 2 + L0.pos.Earth, L1 = layout(ALL8, s1), e1 = v.cx - L1.total / 2 + L1.pos.Earth;
        const L = layout(ALL8, s), off = lerp(e0, e1, k) - L.pos.Earth;
        lineup(v, ALL8, s, off, spinTime, (n, i) => i < 4 ? 1 : (t - 1.5 - (i - 4) * .45) / 1, 'Earth');
      } },
    { short: 'Red Spot', title: 'A storm wider than the Earth',
      text: 'Jupiter\'s Great Red Spot is a storm that has been watched since at least 1831. It has been shrinking, but in 2017 it was still about 16,350 km wide: the whole Earth would fit inside it.',
      facts: [['Great Red Spot', 'about 16,350 km (2017)'], ['Earth', '12,742 km'], ['Watched since', 'at least 1831']],
      src: 'Source: Simon et al. 2018, Astronomical Journal 155:151; NASA', dur: 11,
      draw(v, t) {
        const R = v.s * (v.ph ? 1.05 : 1.25), s = R / KM.Jupiter, jx = v.cx - R * .3, jy = v.cy - R * .37;
        g.save(); g.beginPath(); g.rect(v.x0 - 40, 0, v.W, v.H); g.clip();
        planet(jx, jy, R, 'jupiter', t * .4, { spin: -.2706 }); // turned so the Red Spot (22.5° S) faces us a little right of centre
        g.restore();
        const lat = -22.5 * Math.PI / 180, roll = ORI.jupiter[0] * Math.PI / 180;
        const ax = Math.sin(.2706) * Math.cos(lat), ay = Math.sin(lat);
        const [dx, dy] = planetPoint(ax * Math.cos(roll) + ay * Math.sin(roll), ax * Math.sin(roll) - ay * Math.cos(roll), 'jupiter');
        const gx = jx + R * dx, gy = jy + R * dy, a = 8175 * s * .96, b = R * .072;
        const er = KM.Earth * s, k = ease((t - 1) / 2.5);
        const ex = lerp(v.x1 - er - 10, gx, k), ey = gy + b + er + 10;
        ring(gx, gy, a, 'rgba(255,210,122,.8)', 1.5, [6, 5], b);
        planet(ex, ey, er, 'earth', t, { night: .55 });
        if (t > 1) label(gx, gy - b - 14, 'Great Red Spot, 2017', '16,350 km across', { a: ease(t - 1), color: '#ffd27a' });
        label(ex, ey + er + 18, 'The Earth', '12,742 km', { a: ease(t - .3) });
      } },
    { short: 'Rings', title: 'Saturn\'s rings',
      text: 'Saturn\'s bright main rings measure about 273,000 km from edge to edge, more than two thirds of the way from the Earth to the Moon. Yet in most places they are only about ten metres thick: ice, from grains to boulders.',
      facts: [['Main rings', 'about 273,000 km across'], ['Earth to Moon', '384,400 km'], ['Thickness', 'mostly about 10 m']],
      src: 'Sources: NASA Saturn Fact Sheet; NASA Cassini mission', dur: 12,
      draw(v, t) {
        const s = (v.w * .8) / 384400, sx = v.cx, sy = v.cy - v.h * .1, r = KM.Saturn * s, rg = saturnRings(sx, sy, s);
        planet(sx, sy, r, 'saturn', t, { ringsBack: rg.back, ringsFront: rg.front });
        const outer = SATURN_RING_EDGE * s, yb = sy + outer * .35 + 34;
        measure(sx - outer, yb, sx + outer, (t - .8) / 1.6, 'Main rings', '273,000 km');
        const ey = v.cy + v.h * .34, ex0 = v.cx - 384400 * s / 2, ex1 = ex0 + 384400 * s;
        const k = (t - 3) / 2.2;
        if (k > 0) {
          planet(ex0, ey, KM.Earth * s, 'earth', t); planet(ex1, ey, KM.Moon * s, 'moon', t);
          measure(ex0, ey - 18, ex1, k, 'Earth to Moon', '384,400 km', 'rgba(124,192,255,.9)');
          label(ex0, ey + 22, 'Earth', null, { size: 12 }); label(ex1, ey + 22, 'Moon', null, { size: 12 });
        }
      } },
    { short: 'The Sun', title: 'And the Sun',
      text: 'The Sun is 109 times as wide as the Earth: about 1.3 million Earths would fit inside it. It holds 99.86% of all the mass in the solar system; the planets, moons, asteroids and comets share the rest.',
      facts: [['Sun', '1.39 million km across'], ['Earths across it', '109'], ['Share of the mass', '99.86%']],
      src: 'Source: NASA Sun Fact Sheet', dur: 13,
      draw(v, t) {
        const R = Math.min(v.h * .44, v.w * .34), sx = v.x0 + R + 10, sy = v.cy, s = R / KM.Sun;
        star(sx, sy, R, [255, 214, 140], t, 4, 1);
        const n = Math.floor(clamp((t - 1.5) / 4, 0, 1) * 109), re = KM.Earth * s;
        for (let i = 0; i < n; i++) disc(sx - R + re + i * 2 * re, sy, re * .92, 'rgba(70,130,220,.95)');
        if (n) label(sx, sy + R + 26, `${n} Earths`, n === 109 ? 'side by side across the Sun' : null, { color: '#7cc0ff' });
        const jx = Math.min(sx + R + v.w * .12, v.x1 - 60), rj = KM.Jupiter * s;
        planet(jx, sy, rj, 'jupiter', t); label(jx, sy + rj + 20, 'Jupiter', null, { size: 12 });
        planet(jx + rj + 30, sy, re, 'earth', t); label(jx + rj + 30, sy + rj + 20, 'Earth', null, { size: 12 });
      } },
    { short: 'Blue dot', title: 'A pale blue dot',
      text: 'On 14 February 1990, Voyager 1 turned its camera back from about 6 billion km away and photographed the Earth. In that picture our planet is less than a single pixel, caught in a band of scattered sunlight.',
      facts: [['Distance', 'about 6 billion km'], ['Size in the picture', 'less than a pixel'], ['Taken', '14 February 1990']],
      src: 'Photo: NASA/JPL-Caltech, Voyager 1 Pale Blue Dot (PIA00452)', photo: true, dur: 11,
      draw(v, t) {
        if (!voyagerPhoto.naturalWidth) return;
        const h = Math.min(v.h * .95, v.w * .9 * voyagerPhoto.naturalHeight / voyagerPhoto.naturalWidth);
        const w = h * voyagerPhoto.naturalWidth / voyagerPhoto.naturalHeight;
        const k = ease((t - 1) / 5), z = lerp(1, 1.8, k);
        const ex = lerp(v.cx + w * .26, v.cx, k), ey = lerp(v.cy + h * .06, v.cy, k);
        g.save(); g.beginPath(); g.rect(v.x0, v.y0, v.w, v.h); g.clip();
        g.drawImage(voyagerPhoto, ex - w * z * 345 / 453, ey - h * z * 345 / 614, w * z, h * z);
        g.restore();
        const a = ease((t - 2) / 1.5);
        if (a > 0) { ring(ex, ey, 17, `rgba(255,210,122,${.8 * a})`, 1.5); label(ex, ey - 30, 'The Earth', 'from about 6 billion km', { a, color: '#ffd27a' }); }
      } },
  ],
};

// ---------------------------------------------------------------- story 2: the Sun among the stars
// radii in Sun radii; each with its source in the chapter that brings it in
const SR = [
  { n: 'Earth', r: .00916, p: 'earth' }, { n: 'Jupiter', r: .10045, p: 'jupiter' }, { n: 'Sirius B', r: .0084, c: C.WD },
  { n: 'Proxima Centauri', r: .1542, c: C.M }, { n: 'The Sun', r: 1, c: [255, 220, 150] }, { n: 'Sirius A', r: 1.711, c: C.A },
  { n: 'Arcturus', r: 25.4, c: C.K }, { n: 'Aldebaran', r: 44.2, c: [255, 160, 96] }, { n: 'Rigel', r: 78.9, c: C.B },
  { n: 'Antares', r: 680, c: [255, 110, 70] }, { n: 'Betelgeuse', r: 764, c: [255, 128, 80] }, { n: 'VY Canis Majoris', r: 1420, c: [255, 100, 66] },
];
const SRn = Object.fromEntries(SR.map((s) => [s.n, s]));
const AU = 215.03; // Sun radii in one astronomical unit
function starRow(v, names, fresh, t, prevNames, orbitsOn) {
  const list = names.map((n) => SRn[n]).sort((a, b) => a.r - b.r), rMax = list[list.length - 1].r;
  // the scale that fits the whole row: the largest no taller than 80% of the area, and all of them side by side within its width
  const fit = (ns) => { const rs = ns.map((n) => SRn[n].r); return Math.min(v.h * .4 / Math.max(...rs), v.w * .86 / (2 * rs.reduce((a, r) => a + r, 0))); };
  const s = lerpLog(fit(prevNames || names), fit(names), ease((t - .3) / 2.6));
  // right to left from the largest, each touching the next with a small gap
  let x = v.x1 - Math.min(v.w * .06, 40);
  const pos = [];
  for (let i = list.length - 1; i >= 0; i--) { const r = list[i].r * s, vis = Math.max(r, 3); x -= vis; pos[i] = x; x -= vis + Math.max(16, r * .12); }
  const shift = Math.max(0, v.x0 + 20 - (x + 16)); // keep the small ones on screen
  list.forEach((st, i) => {
    const k = fresh.includes(st.n) ? easeO((t - .6 - fresh.indexOf(st.n) * .5) / 1.2) : 1; if (k <= 0) return;
    const px = pos[i] + shift, r = st.r * s * k, y = v.cy;
    if (st.p) planet(px, y, r, st.p, t); else star(px, y, r, st.c, t, i + 3, st.r > 300 ? 2.4 : st.r > 20 ? 1.5 : 1);
    if (orbitsOn && st.n === names[names.length - 1]) {
      const ko = ease((t - 2.5) / 1.5);
      if (ko > 0) [['Earth', 1], ['Mars', 1.524], ['Jupiter', 5.203]].forEach(([n, au]) => {
        const rr = au * AU * s; ring(px, y, rr, `rgba(124,192,255,${.6 * ko})`, 1.2, [4, 4]);
        if (rr > 18) label(px, y - rr - 6, n, null, { size: 11.5, a: ko, color: '#9fd0ff' });
      });
    }
    const small = r < 22, ly = small ? y - Math.max(r, 3) - 30 - (i % 2) * 34 : y + r + 22;
    if (small) line(px, y - Math.max(r, 3) - 4, px, ly + 4, 'rgba(244,239,230,.35)');
    label(px, ly, st.n, st.r >= 1 ? `${st.r >= 10 ? fmt(st.r) : st.r} × the Sun` : st.p ? `${(st.r * 109.1).toFixed(st.r < .05 ? 0 : 1)} × the Earth` : `${st.r.toFixed(st.r < .05 ? 4 : 2)} × the Sun`, { a: clamp(k, 0, 1), size: 12.5, color: st.n === 'The Sun' ? '#ffd27a' : '#f4efe6' });
  });
}
const S2 = {
  thumb: 4, id: 'stars', title: 'The Sun among the stars', short: 'Stars', accent: '#ffb15a',
  blurb: 'From red dwarfs barely bigger than Jupiter to supergiants that would swallow Mars\'s orbit.',
  chapters: [
    { short: 'Red dwarfs', title: 'Smaller than you might think',
      text: 'Our nearest star, Proxima Centauri, is a red dwarf only about one and a half times as wide as Jupiter. Red dwarfs like it are the most common stars of all: about three in four of the stars near the Sun.',
      facts: [['Proxima Centauri', '0.15 × the Sun'], ['Jupiter', '0.10 × the Sun'], ['Red dwarfs near us', 'about 3 in 4']],
      src: 'Sources: Kervella et al. 2017, A&A 598:L7 (Proxima); RECONS census of nearby stars', dur: 11,
      draw(v, t) { starRow(v, ['Earth', 'Jupiter', 'Proxima Centauri', 'The Sun'], ['Earth', 'Jupiter', 'Proxima Centauri', 'The Sun'], t); } },
    { short: 'Sirius', title: 'A brighter neighbour',
      text: 'Sirius, the brightest star in our night sky, is a white star 1.7 times as wide as the Sun and about 25 times as bright. Its faint companion, Sirius B, is a white dwarf: the dead core of a star, about the size of the Earth.',
      facts: [['Sirius A', '1.71 × the Sun'], ['Sirius B', 'about the Earth\'s size'], ['Distance', '8.6 light years']],
      src: 'Sources: Davis et al. 2011, Publ. Astron. Soc. Australia 28:58; Bond et al. 2017, ApJ 840:70', dur: 11,
      draw(v, t) { starRow(v, ['Sirius B', 'Proxima Centauri', 'The Sun', 'Sirius A'], ['Sirius B', 'Sirius A'], t, ['Earth', 'Jupiter', 'Proxima Centauri', 'The Sun']); } },
    { short: 'Giants', title: 'Giants',
      text: 'Arcturus and Aldebaran are old stars that have run out of hydrogen at their centres and swollen into giants, 25 and 44 times as wide as the Sun. In about five billion years the Sun will swell like this too.',
      facts: [['Arcturus', '25 × the Sun'], ['Aldebaran', '44 × the Sun'], ['The Sun, in 5 billion years', 'a red giant']],
      src: 'Sources: Ramírez & Allende Prieto 2011, ApJ 743:135; Richichi & Roccatagliata 2005, A&A 433:305', dur: 11,
      draw(v, t) { starRow(v, ['The Sun', 'Sirius A', 'Arcturus', 'Aldebaran'], ['Arcturus', 'Aldebaran'], t, ['Sirius B', 'Proxima Centauri', 'The Sun', 'Sirius A']); } },
    { short: 'Rigel', title: 'A blue supergiant',
      text: 'Rigel, Orion\'s bright foot, is a young, hot, massive star about 79 times as wide as the Sun and tens of thousands of times as bright. Stars like it burn through their fuel in a few million years.',
      facts: [['Rigel', '79 × the Sun'], ['Surface', 'about 12,000 °C'], ['Distance', 'about 860 light years']],
      src: 'Source: Moravveji et al. 2012, ApJ 747:108', dur: 11,
      draw(v, t) { starRow(v, ['The Sun', 'Arcturus', 'Aldebaran', 'Rigel'], ['Rigel'], t, ['The Sun', 'Sirius A', 'Arcturus', 'Aldebaran']); } },
    { short: 'Supergiants', title: 'Red supergiants',
      text: 'Antares and Betelgeuse are red supergiants, each hundreds of times as wide as the Sun. Put Betelgeuse where the Sun is and its surface would reach past the orbit of Mars. Both will end as supernovae.',
      facts: [['Antares', 'about 680 × the Sun'], ['Betelgeuse', 'about 760 × the Sun'], ['Betelgeuse in our place', 'past Mars']],
      src: 'Sources: Ohnaka et al. 2013, A&A 555:A24 (Antares); Joyce et al. 2020, ApJ 902:63 (Betelgeuse)', dur: 13,
      draw(v, t) { starRow(v, ['The Sun', 'Rigel', 'Antares', 'Betelgeuse'], ['Antares', 'Betelgeuse'], t, ['The Sun', 'Arcturus', 'Aldebaran', 'Rigel'], true); } },
    { short: 'VY CMa', title: 'Among the largest known',
      text: 'VY Canis Majoris is one of the largest stars known, roughly 1,400 times as wide as the Sun: in our place it would reach beyond Jupiter. Sizes this large are hard to measure; its puffy edge sheds gas into space.',
      facts: [['VY Canis Majoris', 'about 1,420 × the Sun'], ['In our place', 'past Jupiter'], ['How sure', 'this estimate ± 120; others differ']],
      src: 'Source: Wittkowski et al. 2012, A&A 540:L12', dur: 13,
      draw(v, t) { starRow(v, ['The Sun', 'Rigel', 'Betelgeuse', 'VY Canis Majoris'], ['VY Canis Majoris'], t, ['The Sun', 'Rigel', 'Antares', 'Betelgeuse'], true); } },
  ],
};

const STORIES = [S1, S2];
window.__STORIES = STORIES; // the other stories are added by the code below

// ---------------------------------------------------------------- story 3: the nearest stars
// right ascension and declination (degrees) and distance (light years); type: M red dwarf, K orange, G yellow, F, A white, WD white dwarf, BD brown dwarf.
// Distances from Gaia DR3 and the RECONS list of the nearest stars; positions to a fraction of a degree
const NEAR = [
  ['Proxima Centauri', 217.43, -62.68, 4.25, 'M'], ['Alpha Centauri A', 219.90, -60.83, 4.37, 'G'], ['Alpha Centauri B', 219.92, -60.85, 4.37, 'K'],
  ['Barnard\'s Star', 269.45, 4.69, 5.96, 'M'], ['Luhman 16', 162.31, -53.32, 6.5, 'BD'], ['WISE 0855−0714', 133.79, -7.24, 7.4, 'BD'],
  ['Wolf 359', 164.12, 7.01, 7.86, 'M'], ['Lalande 21185', 165.83, 35.97, 8.31, 'M'], ['Sirius A', 101.29, -16.72, 8.66, 'A'], ['Sirius B', 101.31, -16.74, 8.66, 'WD'],
  ['Luyten 726-8', 24.75, -17.95, 8.79, 'M'], ['Ross 154', 282.46, -23.84, 9.70, 'M'], ['Ross 248', 355.48, 44.17, 10.3, 'M'], ['Epsilon Eridani', 53.23, -9.46, 10.5, 'K'],
  ['Lacaille 9352', 346.47, -35.85, 10.7, 'M'], ['Ross 128', 176.93, .80, 11.0, 'M'], ['EZ Aquarii', 339.64, -15.30, 11.1, 'M'], ['Procyon', 114.83, 5.22, 11.4, 'F'],
  ['61 Cygni', 316.73, 38.75, 11.4, 'K'], ['Struve 2398', 280.69, 59.63, 11.5, 'M'], ['Groombridge 34', 4.60, 44.02, 11.6, 'M'], ['DX Cancri', 127.45, 26.78, 11.7, 'M'],
  ['Epsilon Indi', 330.84, -56.79, 11.9, 'K'], ['Tau Ceti', 26.02, -15.94, 11.9, 'G'],
].map(([n, ra, de, d, ty]) => { const a = ra * Math.PI / 180, b = de * Math.PI / 180; return { n, d, ty, p: [d * Math.cos(b) * Math.cos(a), d * Math.cos(b) * Math.sin(a), d * Math.sin(b)] }; });
const NEARM = NEAR.filter((s) => s.ty === 'M').length;
const TYC = { M: C.M, K: C.K, G: C.G, F: C.F, A: C.A, WD: C.WD, BD: C.BD }, TYR = { M: 3.4, K: 4.6, G: 5.4, F: 5.8, A: 6.6, WD: 2, BD: 2.4 };
function starMap(v, t, o = {}) {
  const yaw = (o.yaw ?? 0.6) + (CALM ? 0 : t * .07), pitch = .5, sc = v.s * .44 / 12.5 * (o.zoom || 1), f = 46, cx = v.cx, cy = v.cy + v.h * .04;
  const P = (p) => { const x = p[0] * Math.cos(yaw) - p[1] * Math.sin(yaw), y = p[0] * Math.sin(yaw) + p[1] * Math.cos(yaw), z = p[2];
    const dep = y * Math.cos(pitch) + z * Math.sin(pitch), up = z * Math.cos(pitch) - y * Math.sin(pitch), k = f / (f + dep); return [cx + x * sc * k, cy - up * sc * k, dep, k]; };
  for (const R of [5, 10]) { g.beginPath(); for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, q = P([R * Math.cos(a), R * Math.sin(a), 0]); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.strokeStyle = 'rgba(124,192,255,.28)'; g.lineWidth = 1; g.stroke();
    const q = P([R, 0, 0]); label(q[0] + 4, q[1] - 4, `${R} light years`, null, { size: 11, color: '#9fd0ff', align: 'left', a: .8 }); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, q0 = P([0, 0, 0]), q1 = P([10 * Math.cos(a), 10 * Math.sin(a), 0]); line(q0[0], q0[1], q1[0], q1[1], 'rgba(124,192,255,.08)'); }
  const sun = P([0, 0, 0]); star(sun[0], sun[1], 4.2, [255, 222, 160], t); label(sun[0], sun[1] + 20, 'The Sun', null, { color: '#ffd27a', size: 12.5 });
  const L = NEAR.map((s) => ({ s, q: P(s.p), b: P([s.p[0], s.p[1], 0]) })).sort((a, b) => b.q[2] - a.q[2]);
  for (const { s, q, b } of L) {
    const on = !o.focus || o.focus.includes(s.n) || (o.type && o.type === s.ty), a = on ? 1 : .28, pulse = on && o.focus ? .5 + .5 * Math.sin(t * 3) : 0;
    line(b[0], b[1], q[0], q[1], `rgba(244,239,230,${.22 * a})`); disc(b[0], b[1], 1.2, `rgba(244,239,230,${.3 * a})`);
    g.save(); g.globalAlpha *= a; star(q[0], q[1], TYR[s.ty] * q[3] * (1 + .25 * pulse), TYC[s.ty], t, 1); g.restore();
    if (on && o.focus) { const sub = o.sub?.[s.n] ?? `${s.d} light years`; label(q[0] + 9, q[1] - 7, s.n, sub, { align: 'left', size: 12, a: .95 }); }
    else if (o.labelAll && !/ B$/.test(s.n)) label(q[0] + 8, q[1] - 6, s.n.replace(/ A$/, ''), null, { align: 'left', size: 10.5, a: .55 + .3 * q[3] });
  }
  return P;
}
const S3 = {
  thumb: 0, id: 'nearest-stars', title: 'The nearest stars', short: 'Near stars', accent: '#9fd0ff',
  blurb: 'Every star and brown dwarf within 12 light years of the Sun, in three dimensions.',
  chapters: [
    { short: 'Neighbours', title: 'Our neighbourhood',
      text: 'These are all the known stars and brown dwarfs within about 12 light years of the Sun, placed in three dimensions. The rings lie in the plane of the Earth\'s equator; each star stands on a stalk above or below it.',
      facts: [['Systems shown', `${NEAR.length} stars and brown dwarfs`], ['Farthest here', '11.9 light years'], ['One light year', '9.46 trillion km']],
      src: 'Sources: RECONS, The One Hundred Nearest Star Systems; ESA Gaia DR3', dur: 12,
      draw(v, t) { starMap(v, t, { labelAll: true }); } },
    { short: 'Alpha Cen', title: 'Alpha Centauri, the closest',
      text: 'The nearest star is Proxima Centauri, a red dwarf 4.25 light years away, circling the pair Alpha Centauri A and B. Its light takes 4.2 years to reach us; Voyager 1, the fastest probe leaving the solar system, would need about 75,000 years. Proxima has at least one planet the size of the Earth.',
      facts: [['Proxima Centauri', '4.25 light years'], ['Voyager 1 at 17 km/s', 'about 75,000 years'], ['Proxima b', 'found 2016']],
      src: 'Sources: Anglada-Escudé et al. 2016, Nature 536:437; NASA/JPL Voyager', dur: 13, live: (t) => `Light from Proxima, on its way: ${(4.2 * ((t % 5) / 5)).toFixed(1)} years`,
      draw(v, t) { const P = starMap(v, t, { focus: ['Proxima Centauri', 'Alpha Centauri A', 'Alpha Centauri B'], yaw: 2.2, sub: { 'Alpha Centauri B': '' } });
        const a = P([0, 0, 0]), b = P(NEAR[0].p), k = (t % 5) / 5; line(a[0], a[1], b[0], b[1], 'rgba(255,210,122,.35)', 1, [3, 4]);
        const x = lerp(b[0], a[0], k), y = lerp(b[1], a[1], k); glow(x, y, 16, [255, 230, 170], .9); disc(x, y, 2, '#fff'); } },
    { short: 'Barnard', title: 'Barnard\'s Star, on the move',
      text: 'Barnard\'s Star, a red dwarf six light years away, crosses our sky faster than any other star. It is coming closer: in about 10,000 years it will pass within 3.8 light years. In 2025 astronomers confirmed four small planets around it.',
      facts: [['Distance', '5.96 light years'], ['Closest, in about 10,000 years', '3.8 light years'], ['Planets', '4, all smaller than the Earth']],
      src: 'Sources: Basant et al. 2025, ApJ Letters 982:L1; Gaia DR3', dur: 12,
      draw(v, t) { const P = starMap(v, t, { focus: ['Barnard\'s Star'], yaw: 4.3 }); const s = NEAR[3].p, q0 = P(s), d = Math.hypot(...s), u = s.map((x) => x / d);
        const tgt = [u[0] * 3.8 + u[1] * 1.2, u[1] * 3.8 - u[0] * 1.2, u[2] * 3.8], q1 = P(tgt), k = ease((t - 1.5) / 4);
        line(q0[0], q0[1], lerp(q0[0], q1[0], k), lerp(q0[1], q1[1], k), 'rgba(255,128,82,.8)', 1.5, [5, 4]); if (k > .9) label(q1[0], q1[1] + 18, 'in about 10,000 years', null, { size: 11.5, color: '#ff9a70' }); } },
    { short: 'Sirius', title: 'Sirius, the brightest',
      text: 'Sirius is the brightest star in our night sky because it is both close, 8.6 light years away, and about 25 times as bright as the Sun. Its companion, Sirius B, is a white dwarf: a star\'s burnt-out core, as heavy as the Sun but the size of the Earth.',
      facts: [['Distance', '8.6 light years'], ['Brightness', 'about 25 Suns'], ['Sirius B', 'Sun\'s mass, Earth\'s size']],
      src: 'Sources: Bond et al. 2017, ApJ 840:70; Gaia DR3', dur: 12,
      draw(v, t) { starMap(v, t, { focus: ['Sirius A', 'Sirius B'], yaw: 5.2, sub: { 'Sirius B': 'white dwarf' } }); } },
    { short: 'Red dwarfs', title: 'Mostly red dwarfs',
      text: `Most of our neighbours are red dwarfs: small, cool stars too faint to see without a telescope. Here they are ${NEARM} of the ${NEAR.length}. The Sun, Alpha Centauri A and Tau Ceti are among the few yellow stars nearby.`,
      facts: [['Red dwarfs here', `${NEARM} of ${NEAR.length}`], ['Seen without a telescope', 'none of them'], ['Lifetimes', 'up to trillions of years']],
      src: 'Source: RECONS census of stars within 10 parsecs', dur: 11,
      draw(v, t) { starMap(v, t, { type: 'M', focus: [], yaw: 1.4 }); } },
    { short: 'Brown dwarfs', title: 'Failed stars, found late',
      text: 'Some neighbours were found only recently. Luhman 16, two brown dwarfs 6.5 light years away, was discovered in 2013, and WISE 0855−0714, at 7.4 light years, in 2014. Brown dwarfs are too small to keep hydrogen burning; WISE 0855 is about as cold as a freezer.',
      facts: [['Luhman 16', '6.5 light years, found 2013'], ['WISE 0855−0714', '7.4 light years, found 2014'], ['WISE 0855 temperature', 'about −25 °C']],
      src: 'Sources: Luhman 2013, ApJ 767:L1; Luhman 2014, ApJ 786:L18', dur: 12,
      draw(v, t) { starMap(v, t, { focus: ['Luhman 16', 'WISE 0855−0714'], yaw: 3.0 }); } },
  ],
};

// ---------------------------------------------------------------- story 4: the nearest galaxies
// a map seen from above, in light years: distances to scale, directions on the page simplified so each fits
const GX = { MW: [0, 0], SUN: [0, -26700], SGR: [50500, 21800], LMC: [-158000, -30000], SMC: [-185000, -85000], M31: [1.5e6, 2.0e6], M33: [2.1e6, 1.75e6] };
const DWARFS = (() => { const R = rng(17), a = []; for (let i = 0; i < 70; i++) { const host = i < 30 ? GX.MW : i < 55 ? GX.M31 : [lerp(-2e6, 3.5e6, R()), lerp(-1.5e6, 4e6, R())]; const d = (i < 55 ? 1.5e5 + R() * 9e5 : 0), a0 = R() * TAU; a.push([host[0] + Math.cos(a0) * d, host[1] + Math.sin(a0) * d, 2 + R() * 2.5]); } return a; })();
function camOf(v, cam) { const s = v.w / cam[2]; return (p) => [v.cx + (p[0] - cam[0]) * s, v.cy - (p[1] - cam[1]) * s, s]; }
function tweenCam(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerpLog(a[2], b[2], k)]; }
function galaxies(v, t, cam, o = {}) {
  sprites(); const M = camOf(v, cam), s = v.w / cam[2], rot = CALM ? 0 : t * .015;
  const m31 = o.m31 || GX.M31;
  for (const [x, y, r] of DWARFS) { const q = M([x, y]); glow(q[0], q[1], r * 2.2, [210, 220, 255], .35 * (o.dwarfs ?? .4)); }
  const minG = 26; // far out, the big galaxies keep a visible size (labelled), or they vanish into dots
  const q0 = M(GX.MW); drawSprite(MW, q0[0], q0[1], Math.max(minG, 100000 / .96 * s), rot);
  if (s * 100000 < minG) label(q0[0], q0[1] + 24, 'Milky Way', null, { size: 12 });
  const sp = M([GX.SUN[0] * Math.cos(rot) - GX.SUN[1] * Math.sin(rot), GX.SUN[0] * Math.sin(rot) + GX.SUN[1] * Math.cos(rot)]);
  if (o.sun) { disc(sp[0], sp[1], 3, '#ffd27a'); glow(sp[0], sp[1], 12, [255, 210, 122], .8); label(sp[0] + 8, sp[1] + 4, 'The Sun', '26,700 light years from the centre', { align: 'left', size: 12, color: '#ffd27a' }); }
  const q = (k) => M(GX[k]);
  const sg = q('SGR'); drawSprite(SGR, sg[0], sg[1], 14000 * s, .9, .4, .9);
  if (o.stream) { // the Sagittarius stream: torn-off stars along the dwarf's looping orbit, which passes through it
    g.save(); g.globalCompositeOperation = 'lighter'; const R = rng(5), ph = .408, k = ease((t - 1) / 3);
    for (let i = 0; i < 1400; i++) { const a = R() * TAU * k - Math.PI * k, ua = Math.cos(a) * 55000 + (R() - .5) * 5000, wb = Math.sin(a) * 22000 + (R() - .5) * 5000;
      const p = M([ua * Math.cos(ph) - wb * Math.sin(ph), ua * Math.sin(ph) + wb * Math.cos(ph)]); g.fillStyle = 'rgba(255,214,170,.5)'; g.fillRect(p[0], p[1], 1.6, 1.6); }
    g.restore(); }
  const lm = q('LMC'), sm = q('SMC'); drawSprite(LMC, lm[0], lm[1], Math.max(14, 32000 * s), .3); drawSprite(SMC, sm[0], sm[1], Math.max(10, 19000 * s), .8);
  const a3 = M(m31); drawSprite(M31, a3[0], a3[1], Math.max(minG * 1.3, 152000 / .96 * s), .65 + rot * .5, .32);
  const t3 = q('M33'); drawSprite(M33, t3[0], t3[1], Math.max(minG * .6, 61000 / .96 * s), .2, .75);
  if (152000 * s < minG) label(a3[0], a3[1] + 22, 'Andromeda', null, { size: 12 });
  return { M, s, sp, q, a3 };
}
function distLine(from, to, text, sub, k, c = 'rgba(255,210,122,.75)') { const x = lerp(from[0], to[0], easeO(k)), y = lerp(from[1], to[1], easeO(k)); line(from[0], from[1], x, y, c, 1.2, [5, 4]); if (k > .8) label((from[0] + to[0]) / 2, (from[1] + to[1]) / 2 - 10, text, sub, { color: '#ffd27a', size: 12.5, a: ease((k - .8) / .2) }); }
const CAMS = [[0, 0, 160000], [12000, 4000, 200000], [-80000, -30000, 560000], [800000, 950000, 4.2e6], [800000, 950000, 4.2e6], [800000, 1000000, 1.15e7]];
const camAt = (i, t) => tweenCam(CAMS[Math.max(0, i - 1)], CAMS[i], ease((t - .2) / 3));
const S4 = {
  thumb: 3, id: 'nearest-galaxies', title: 'The nearest galaxies', short: 'Galaxies', accent: '#b89cff',
  blurb: 'The Milky Way, the small galaxies around it, and Andromeda heading our way.',
  chapters: [
    { short: 'Milky Way', title: 'Our galaxy',
      text: 'The Milky Way is a barred spiral galaxy about 100,000 light years across, holding between 100 and 400 billion stars. The Sun sits in a minor arm, about 26,700 light years from the centre, and takes some 230 million years to go once around.',
      facts: [['Width', 'about 100,000 light years'], ['Stars', '100 to 400 billion'], ['Sun to centre', '26,700 light years']],
      src: 'Sources: GRAVITY Collaboration 2019, A&A 625:L10 (distance to the centre); NASA', dur: 12,
      draw(v, t) { galaxies(v, t, camAt(0, t), { sun: 1 }); } },
    { short: 'Sagittarius', title: 'A galaxy being eaten',
      text: 'About 70,000 light years from us and 50,000 from the Milky Way\'s centre, below its disc, the Sagittarius dwarf galaxy is being torn apart. Its stars are strung out in a stream that loops right around our galaxy. It was found only in 1994. (Seen from above, as here, it seems to sit at the disc\'s edge.)',
      facts: [['Distance', 'about 70,000 light years'], ['Found', '1994'], ['Fate', 'absorbed into the Milky Way']],
      src: 'Sources: Ibata, Gilmore & Irwin 1994, Nature 370:194; Majewski et al. 2003', dur: 12,
      draw(v, t) { const r = galaxies(v, t, camAt(1, t), { sun: 0, stream: 1 }); distLine(r.sp, r.q('SGR'), 'Sagittarius dwarf', 'about 70,000 light years', (t - 2) / 2); } },
    { short: 'Magellanic', title: 'The Magellanic Clouds',
      text: 'The Large and Small Magellanic Clouds are the brightest galaxies around ours, easy to see by eye from the southern hemisphere. The Large Cloud is about 162,000 light years away, the Small about 200,000.',
      facts: [['Large Cloud', 'about 162,000 light years'], ['Small Cloud', 'about 200,000 light years'], ['Seen from', 'the southern hemisphere']],
      src: 'Sources: Pietrzyński et al. 2019, Nature 567:200; Graczyk et al. 2020, ApJ 904:13', dur: 12,
      draw(v, t) { const r = galaxies(v, t, camAt(2, t), {}); const M = r.M; distLine(M(GX.MW), r.q('LMC'), 'Large Cloud', '162,000 ly', (t - 2.2) / 2); distLine(M(GX.MW), r.q('SMC'), 'Small Cloud', '200,000 ly', (t - 3.4) / 2); } },
    { short: 'Andromeda', title: 'Andromeda',
      text: 'The Andromeda galaxy, 2.5 million light years away, is the most distant thing most people can see with the naked eye. It is a spiral like ours, somewhat larger, with roughly a trillion stars. The light we see from it left before our species existed.',
      facts: [['Distance', 'about 2.5 million light years'], ['Stars', 'roughly a trillion'], ['Its neighbour', 'the Triangulum galaxy']],
      src: 'Sources: Riess et al. 2012, ApJ 745:156; NASA/ESA Hubble', dur: 12,
      draw(v, t) { const r = galaxies(v, t, camAt(3, t), { dwarfs: .7 }); const M = r.M; distLine(M(GX.MW), r.a3, 'Andromeda', '2.5 million light years', (t - 2.6) / 2); const t3 = r.q('M33'); if (t > 4) label(t3[0] + 14, t3[1] + 4, 'Triangulum', '2.7 million ly', { align: 'left', size: 12, a: ease(t - 4) }); } },
    { short: 'Collision?', title: 'Heading our way',
      text: 'Andromeda is falling towards us at about 110 km/s. Whether it will merge with the Milky Way is less certain than once thought: a 2025 study puts the chance of a merger within the next 10 billion years at about one in two.',
      facts: [['Approach speed', 'about 110 km/s'], ['Chance of merging in 10 billion years', 'about 50%'], ['Danger to the Sun', 'almost none: stars rarely collide']],
      src: 'Sources: van der Marel et al. 2012, ApJ 753:8; Sawala et al. 2025, Nature Astronomy', dur: 13, live: (t) => `Time-lapse: +${(clamp((t - 1) / 10, 0, 1) * 5).toFixed(1)} billion years`,
      draw(v, t) { const k = ease((t - 1) / 10), m = [lerp(GX.M31[0], 260000, k), lerp(GX.M31[1], 300000, k)]; const r = galaxies(v, t, tweenCam(CAMS[4], [130000, 150000, 1.6e6], ease((t - 1) / 10)), { m31: m, dwarfs: .3 });
        if (k > .95) label(v.cx, v.y1 - 10, 'A close pass: a merger is possible, not certain', null, { color: '#ffd27a' }); } },
    { short: 'Local Group', title: 'The Local Group',
      text: 'The Milky Way, Andromeda and Triangulum are the big three of the Local Group, a family of more than 80 galaxies about 10 million light years across. Most of the rest are faint dwarfs, and new ones are still being found.',
      facts: [['Members', 'more than 80 known galaxies'], ['Width', 'about 10 million light years'], ['Largest', 'Andromeda, then the Milky Way']],
      src: 'Sources: McConnachie 2012, AJ 144:4 (updated catalogue); NASA', dur: 12,
      draw(v, t) { const r = galaxies(v, t, camAt(5, t), { dwarfs: 1 }); const c = r.M([800000, 1000000]); ring(c[0], c[1], 5e6 * r.s, 'rgba(184,156,255,.45)', 1.2, [6, 6]); label(c[0], c[1] - 5e6 * r.s - 10, 'The Local Group, about 10 million light years across', null, { color: '#cdb8ff', size: 12.5, a: ease(t - 2) }); } },
  ],
};

// ---------------------------------------------------------------- story 5: how big is the universe?
const ORB = [['Mercury', .387, 'mercury'], ['Venus', .723, 'venus'], ['Earth', 1, 'earth'], ['Mars', 1.524, 'mars'], ['Jupiter', 5.203, 'jupiter'], ['Saturn', 9.537, 'saturn'], ['Uranus', 19.19, 'uranus'], ['Neptune', 30.07, 'neptune']];
const AUinLY = 63241;
function solar(v, t, pxAU, cx, cy, fade = 1, speed = 1) {
  for (const [n, a, k] of ORB) { const r = a * pxAU; if (r < 1.5) continue; const al = fade * clamp(r / 30, .2, 1);
    ring(cx, cy, r, `rgba(244,239,230,${.22 * al})`); const th = (CALM ? 1 : t * speed) * .9 / Math.pow(a, 1.5) + a * 7; planet(cx + Math.cos(th) * r, cy + Math.sin(th) * r, clamp(r * .02, 1.6, 5), k, t);
    if (r > 40 && fade > .5) label(cx + Math.cos(th) * r, cy + Math.sin(th) * r - 10, n, null, { size: 11, a: fade * .85 }); }
  star(cx, cy, clamp(pxAU * .004652, 2.5, 18), [255, 220, 150], t);
}
const deepFieldPhoto = new Image();
deepFieldPhoto.src = '../img/hubble-ultra-deep-field.jpg';
const WEB = (() => { const R = rng(31), nodes = [], links = []; for (let i = 0; i < 300; i++) { const a = R() * TAU, d = 2.3 * Math.sqrt(R()); nodes.push([Math.cos(a) * d, Math.sin(a) * d]); }
  nodes.forEach((p, i) => { const d = nodes.map((q, j) => [Math.hypot(q[0] - p[0], q[1] - p[1]), j]).sort((a, b) => a[0] - b[0]); for (let k = 1; k <= 3; k++) if (d[k][1] > i) links.push([i, d[k][1]]); }); return { nodes, links }; })();
const S5 = {
  thumb: 5, thumbT: 3, id: 'how-big', title: 'How big is the universe?', short: 'Enormity', accent: '#4fd1c5',
  blurb: 'From eight light-minutes to the Sun to two trillion galaxies, one step at a time.',
  chapters: [
    { short: 'The Sun', title: 'Eight minutes from the Sun',
      text: 'Light, the fastest thing there is, covers 300,000 km every second. Even so, sunlight takes 8 minutes and 20 seconds to cross the 150 million km to the Earth. (Here the distance is shortened and the sizes enlarged.)',
      facts: [['Speed of light', '299,792 km per second'], ['Sun to Earth', '150 million km'], ['Light takes', '8 min 20 s']],
      src: 'Sources: BIPM (speed of light); IAU 2012 (astronomical unit)', dur: 12,
      live: (t) => { const s = clamp((t - 1) / 8, 0, 1) * 499; return `Light travelling: ${Math.floor(s / 60)} min ${String(Math.floor(s % 60)).padStart(2, '0')} s`; },
      draw(v, t) { const sx = v.x0 + v.h * .2, ex = v.x1 - 30, y = v.cy; star(sx, y, v.h * .2, [255, 214, 140], t, 4); planet(ex, y, 7, 'earth', t);
        label(ex, y + 26, 'The Earth', null, { size: 12 }); measure(sx + v.h * .2, y + v.h * .26, ex, (t - .3) / 1.5, '150 million km', null);
        const k = clamp((t - 1) / 8, 0, 1), px = lerp(sx + v.h * .2, ex, k); if (k > 0 && k < 1) { line(Math.max(sx + v.h * .2, px - 60), y, px, y, 'rgba(255,236,190,.8)', 2); glow(px, y, 18, [255, 236, 190], .9); } } },
    { short: 'Solar system', title: 'Across the solar system',
      text: 'Out to Neptune, the solar system is about 9 billion km across, and sunlight takes four hours to reach its outermost planet. The orbits here are to scale; the planets are greatly enlarged.',
      facts: [['Neptune\'s distance', '4.5 billion km (30 AU)'], ['Light takes', 'about 4 hours'], ['Voyager 1 took', '12 years to pass Neptune\'s distance']],
      src: 'Source: NASA Planetary Fact Sheet', dur: 13, live: (t) => `Sunlight after ${(clamp((t - 1) / 8, 0, 1) * 4.17).toFixed(1)} hours`,
      draw(v, t) { const pxAU = v.s * .47 / 30.07; solar(v, t, pxAU, v.cx, v.cy, 1, 1.5); const k = clamp((t - 1) / 8, 0, 1); if (k > 0 && k < 1) ring(v.cx, v.cy, k * 30.07 * pxAU, 'rgba(255,236,190,.7)', 2); } },
    { short: 'Next star', title: 'To the next star',
      text: 'Zoom out until the nearest star is in view and the whole solar system shrinks to a dot. Proxima Centauri is 268,000 times as far as the Sun. Around us, the comets of the Oort cloud may stretch a third of the way there.',
      facts: [['Proxima Centauri', '4.25 light years'], ['In Sun–Earth distances', '268,000'], ['Oort cloud', 'perhaps to 100,000 AU']],
      src: 'Sources: Gaia DR3; NASA, Oort cloud', dur: 13,
      draw(v, t) { const wAU = lerpLog(75, 5.6 * AUinLY, ease((t - .5) / 6)), pxAU = v.w / wAU, cx = v.cx + v.w * .32 * ease((t - .5) / 6), cy = v.cy;
        const oc = 100000 * pxAU; if (oc > 4) { const gr = g.createRadialGradient(cx, cy, 2000 * pxAU, cx, cy, oc); gr.addColorStop(0, 'rgba(160,200,255,.0)'); gr.addColorStop(.4, 'rgba(160,200,255,.07)'); gr.addColorStop(1, 'rgba(160,200,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, oc, 0, TAU); g.fill(); if (t > 4) label(cx, cy - oc * .6, 'Oort cloud', null, { size: 11.5, color: '#9fd0ff', a: ease(t - 4) }); }
        solar(v, t, pxAU, cx, cy, clamp(1 - (t - 2) / 3, 0, 1), 1.5);
        const px = cx - 4.25 * AUinLY * pxAU, py = cy; star(px, py, 2.6, C.M, t); if (t > 4.5) { label(px, py - 16, 'Proxima Centauri', '4.25 light years', { a: ease(t - 4.5) }); line(px + 8, py + 14, cx - 8, cy + 14, 'rgba(255,210,122,.5)', 1, [4, 4]); }
        if (t > 3) label(cx, cy + 22, 'The solar system', null, { size: 11.5, a: ease(t - 3), color: '#ffd27a' }); } },
    { short: 'One galaxy', title: 'One galaxy',
      text: 'Keep going and the nearest stars blur into the Milky Way: 100 to 400 billion stars in a disc 100,000 light years wide. Counting one star a second, it would take more than 3,000 years to count even 100 billion.',
      facts: [['Stars', '100 to 400 billion'], ['Width', 'about 100,000 light years'], ['Counting 1 a second', '3,170 years per 100 billion']],
      src: 'Source: NASA, The Milky Way galaxy', dur: 12, live: (t) => `Stars counted: ${fmt(Math.pow(clamp((t - .5) / 7, 0, 1), 3) * 1e11)}${t > 7.5 ? ' … and perhaps 300 billion more' : ''}`,
      draw(v, t) { sprites(); const sz = lerpLog(v.s * .2, v.s * 1.05, ease(t / 6)); drawSprite(MW, v.cx, v.cy, sz, CALM ? 0 : t * .02); const sp = [v.cx, v.cy + sz * .27]; disc(sp[0], sp[1], 2.2, '#ffd27a'); glow(sp[0], sp[1], 10, [255, 210, 122], .8); label(sp[0] + 8, sp[1] + 4, 'You are here', null, { align: 'left', size: 12, color: '#ffd27a' }); } },
    { short: 'Deep field', title: 'A tiny patch of sky',
      text: 'The Hubble Ultra Deep Field looked at a patch of sky about a tenth the width of the full Moon, which seemed empty. The long exposure revealed about 10,000 galaxies in this small field.',
      facts: [['Patch of sky', 'a tenth of the Moon\'s width'], ['Galaxies in it', 'about 10,000'], ['Oldest light', 'over 13 billion years old']],
      src: 'Image: NASA, ESA, S. Beckwith (STScI) and the HUDF Team, Hubble Ultra Deep Field (2004)', photo: true, dur: 12,
      draw(v, t) {
        const k = ease((t - 1.2) / 4.5), sz = lerpLog(10, v.s * .94, k);
        const x = v.cx - sz / 2, y = v.cy - sz / 2;
        if (deepFieldPhoto.naturalWidth) g.drawImage(deepFieldPhoto, x, y, sz, sz);
        g.strokeStyle = `rgba(79,209,197,${.9 - .7 * k})`; g.lineWidth = 1.5; g.strokeRect(x, y, sz, sz);
        if (k < .3) label(v.cx, y - 12, 'This patch of sky', null, { color: '#7fe3d8', size: 12.5 });
      } },
    { short: 'Everything', title: 'The observable universe',
      text: 'The part of the universe we can see is about 93 billion light years across. It holds somewhere between 200 billion and 2 trillion galaxies, strung along a web of filaments, and perhaps 10²² to 10²⁴ stars: more than the grains of sand on all the Earth\'s beaches.',
      facts: [['Width', 'about 93 billion light years'], ['Galaxies', '200 billion to 2 trillion'], ['Stars', 'about 10²² to 10²⁴']],
      src: 'Sources: Planck Collaboration 2018; Conselice et al. 2016, ApJ 830:83; Lauer et al. 2021, ApJ 906:77', dur: 13,
      live: (t) => { const e = Math.floor(lerp(9, 22, clamp((t - .5) / 7, 0, 1))); return `Stars: 1 followed by ${e} zeros${e >= 22 ? ' or more' : ''}`; },
      draw(v, t) { const z = lerpLog(.7, 2.6, ease(t / 9)), R = v.s * .5 / z, cx = v.cx, cy = v.cy, P = (p) => [cx + p[0] * R, cy + p[1] * R];
        // the cosmic web as the big simulations render it (Millennium, IllustrisTNG): soft glowing strands, slightly bent, brightest where
        // they meet; each strand is a haze of galaxies, drawn as a wide faint glow, a narrower core and scattered specks
        g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; const RR = rng(41);
        for (const [i, j] of WEB.links) { const a = P(WEB.nodes[i]), b = P(WEB.nodes[j]), mx = (a[0] + b[0]) / 2 + (RR() - .5) * R * .12, my = (a[1] + b[1]) / 2 + (RR() - .5) * R * .12, w = .5 + RR();
          for (const [lw, al] of [[14 * w, .035], [5 * w, .07], [1.6, .16]]) { g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(mx, my, b[0], b[1]); g.strokeStyle = `rgba(255,190,140,${al})`; g.lineWidth = lw / Math.sqrt(z); g.stroke(); }
          for (let k = 0; k < 9; k++) { const u = RR(), x = (1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * mx + u * u * b[0] + (RR() - .5) * 7, y = (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * my + u * u * b[1] + (RR() - .5) * 7;
            g.fillStyle = `rgba(${RR() < .6 ? '255,220,180' : '190,205,255'},.4)`; g.fillRect(x, y, 1.3, 1.3); } }
        for (const n of WEB.nodes) { const p = P(n); glow(p[0], p[1], 16 / z + 6, [255, 214, 170], .55); disc(p[0], p[1], 1.4, 'rgba(255,240,220,.9)'); }
        g.restore();
        const ko = ease((t - 5) / 2); if (ko > 0) { ring(cx, cy, R * 2.35, `rgba(79,209,197,${.7 * ko})`, 1.5, [6, 6]); label(cx, cy - R * 2.35 - 10, 'The observable universe: 93 billion light years', null, { a: ko, color: '#7fe3d8' }); } } },
  ],
};

// ---------------------------------------------------------------- story 6: the curious case of exoplanets
const DISC = [[1992, 2], [1995, 3], [1999, 30], [2002, 100], [2005, 170], [2008, 320], [2010, 500], [2012, 850], [2013, 1050], [2014, 1800], [2015, 2000], [2016, 3400], [2018, 3900], [2020, 4350], [2021, 4880], [2022, 5250], [2023, 5550], [2024, 5800], [2025.7, 6000]];
const MILES = [[1992, 'First planets, around a pulsar'], [1995, '51 Pegasi b'], [2009, 'Kepler launched'], [2014.15, '715 in one day'], [2016.35, '1,284 in one day'], [2022.2, '5,000'], [2025.7, '6,000']];
function chart(v, t) {
  const x0 = v.x0 + 40, x1 = v.x1 - 20, y0 = v.y1 - 30, y1 = v.y0 + 30, X = (yr) => lerp(x0, x1, (yr - 1990) / 37), Y = (n) => lerp(y0, y1, n / 6500);
  line(x0, y0, x1, y0, 'rgba(244,239,230,.4)'); line(x0, y0, x0, y1, 'rgba(244,239,230,.25)');
  for (const yr of [1990, 2000, 2010, 2020]) label(X(yr), y0 + 18, String(yr), null, { size: 11, color: '#9a9a93' });
  for (const n of [2000, 4000, 6000]) { line(x0, Y(n), x1, Y(n), 'rgba(244,239,230,.08)'); label(x0 - 6, Y(n) + 4, fmt(n), null, { size: 11, color: '#9a9a93', align: 'right' }); }
  const upTo = lerp(1990, 2026, ease((t - .5) / 7)); g.beginPath(); let first = true, lx = x0, ly = y0;
  for (let i = 0; i < DISC.length; i++) { const [yr, n] = DISC[i]; if (yr > upTo) { const [py, pn] = DISC[i - 1] || [1990, 0]; const k = (upTo - py) / (yr - py); lx = X(upTo); ly = Y(lerp(pn, n, k)); g.lineTo(lx, ly); break; } lx = X(yr); ly = Y(n); first ? g.moveTo(lx, ly) : g.lineTo(lx, ly); first = false; }
  g.strokeStyle = '#ff9a70'; g.lineWidth = 2.5; g.stroke(); glow(lx, ly, 14, [255, 154, 112], .9);
  MILES.forEach(([yr, txt], i) => { if (yr > upTo) return; const n = DISC.reduce((a, [y, c], j) => y <= yr ? c : a, 0), x = X(yr), y = Y(n + (yr > 2020 ? 0 : 0)); disc(x, y, 3, '#ffd27a'); label(x + (i < 3 ? 6 : -6), y - 10 - (i % 2) * 14, txt, null, { size: 11, align: i < 3 ? 'left' : 'right', color: '#ffd27a' }); });
}
const S6 = {
  thumb: 3, id: 'exoplanets', title: 'The curious case of exoplanets', short: 'Exoplanets', accent: '#ff9a70',
  blurb: 'Worlds around other stars: how they are found, and how strange they turn out to be.',
  chapters: [
    { short: 'Six thousand', title: 'More than 6,000 worlds',
      text: 'Until 1992 no planet was known outside the solar system. Since then astronomers have confirmed more than 6,000, most of them found by the Kepler and TESS space telescopes. Most stars, it turns out, have planets.',
      facts: [['Confirmed', 'more than 6,000 (September 2025)'], ['First', '1992, around a pulsar'], ['Around a star like the Sun', '1995']],
      src: 'Sources: NASA Exoplanet Archive (milestones; the curve between them is approximate); Wolszczan & Frail 1992, Nature 355:145', dur: 12,
      draw(v, t) { chart(v, t); } },
    { short: 'Transit', title: 'A shadow on a star',
      text: 'Most exoplanets are found by the dip in a star\'s light when a planet passes in front of it. A Jupiter-sized planet dims a Sun-like star by about 1%. An Earth-sized planet dims it by less than 0.01%. The graph magnifies the change in light.',
      facts: [['Jupiter in front of the Sun', 'about 1% dimmer'], ['Earth in front of the Sun', '0.008% dimmer'], ['Found this way', 'about three in four']],
      src: 'Sources: NASA Kepler and TESS missions; NASA Exoplanet Archive', dur: 12,
      draw(v, t) { const R = v.s * .22, sx = v.cx, sy = v.y0 + R + 10, rp = R * .1, ph = clamp((t - .5) / 9, 0, 1), px = lerp(sx - R * 1.8, sx + R * 1.8, ph);
        star(sx, sy, R, [255, 226, 170], t, 6); if (Math.abs(px - sx) < R + rp) disc(px, sy + R * .15, rp, '#05070d'); else disc(px, sy + R * .15, rp, 'rgba(40,50,70,.9)');
        const gx0 = v.x0 + 30, gx1 = v.x1 - 30, gy = v.y1 - 40, hgt = v.h * .2;
        const blocked = (p) => { const d = Math.hypot(lerp(-1.8, 1.8, p), .15); return ease((1.1 - d) / .2); };
        line(gx0, gy, gx1, gy, 'rgba(244,239,230,.15)'); g.beginPath(); for (let i = 0; i <= 200; i++) { const p = i / 200; if (p > ph) break; const x = lerp(gx0, gx1, p), y = gy - (1 - blocked(p)) * hgt; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.strokeStyle = '#ffd27a'; g.lineWidth = 2; g.stroke();
        label(gx0, gy - hgt - 10, 'Starlight', null, { align: 'left', size: 11.5, color: '#9a9a93' }); } },
    { short: 'Wobble', title: 'The wobble that found 51 Pegasi b',
      text: 'A planet tugs its star around in a small circle. As the star moves towards us its light is shifted bluer, then redder as it moves away. In 1995 this wobble revealed 51 Pegasi b, a giant planet that circles its star in just 4.2 days. Its discoverers won the 2019 Nobel Prize.',
      facts: [['51 Pegasi b', 'half Jupiter\'s mass'], ['Its year', '4.2 days'], ['Distance', 'about 50 light years']],
      src: 'Sources: Mayor & Queloz 1995, Nature 378:355; Nobel Prize in Physics 2019', dur: 12,
      draw(v, t) { const cx = v.cx, cy = v.cy - v.h * .12, A = v.h * .3, th = (CALM ? 1 : t) * 1.2, sxo = Math.cos(th) * A * .06, syo = Math.sin(th) * A * .02;
        ring(cx, cy, A, 'rgba(244,239,230,.2)', 1, [4, 4], A * .3); star(cx - sxo, cy - syo, v.h * .07, [255, 230, 180], t, 8); planet(cx + Math.cos(th) * A, cy + Math.sin(th) * A * .3, 6, 'hot', t);
        const vel = -Math.sin(th), bx0 = v.x0 + 40, bx1 = v.x1 - 40, by = v.y1 - 50, gr = g.createLinearGradient(bx0, 0, bx1, 0);
        ['#5a3cff', '#3c8cff', '#3cd6c8', '#7ee05a', '#f2e04a', '#ff9a3c', '#ff4a3c'].forEach((c, i) => gr.addColorStop(i / 6, c)); g.fillStyle = gr; g.fillRect(bx0, by, bx1 - bx0, 26);
        for (const f of [.14, .33, .47, .58, .71, .86]) { const x = lerp(bx0, bx1, f) + vel * 14; g.fillStyle = 'rgba(0,0,0,.85)'; g.fillRect(x - 1.5, by, 3, 26); }
        label(bx0, by - 10, 'bluer: coming towards us', null, { align: 'left', size: 11.5, color: '#8fb4ff', a: vel < 0 ? 1 : .35 }); label(bx1, by - 10, 'redder: moving away', null, { align: 'right', size: 11.5, color: '#ff9a8a', a: vel > 0 ? 1 : .35 }); } },
    { short: 'TRAPPIST-1', title: 'Seven worlds of TRAPPIST-1',
      text: 'TRAPPIST-1, a small red star 40 light years away, has seven planets about the size of the Earth, all closer to it than Mercury is to the Sun. Three lie where water could be liquid. Their years last 1.5 to 19 days. (Planets enlarged.)',
      facts: [['Planets', '7, all about Earth-sized'], ['Their years', '1.5 to 18.8 days'], ['Where water could be liquid', 'e, f and g']],
      src: 'Sources: Gillon et al. 2017, Nature 542:456; Agol et al. 2021, Planetary Science Journal 2:1', dur: 13, live: (t) => `Time-lapse: ${(t * 2.2).toFixed(0)} days`,
      draw(v, t) { const P = [['b', .01154, 1.51], ['c', .0158, 2.42], ['d', .02227, 4.05], ['e', .02925, 6.10], ['f', .03849, 9.21], ['g', .04683, 12.35], ['h', .06189, 18.77]], sc = v.s * .46 / .06189, cx = v.cx, cy = v.cy;
        g.save(); g.beginPath(); g.ellipse(cx, cy, .05 * sc, .05 * sc * .55, 0, 0, TAU); g.ellipse(cx, cy, .026 * sc, .026 * sc * .55, 0, 0, TAU); g.fillStyle = 'rgba(90,200,120,.12)'; g.fill('evenodd'); g.restore();
        star(cx, cy, 7, [255, 110, 70], t);
        for (const [n, a, per] of P) { const r = a * sc; ring(cx, cy, r, 'rgba(244,239,230,.18)', 1, null, r * .55); const th = (CALM ? 3 : t) * 2.2 / per * TAU + a * 300, x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r * .55; planet(x, y, 4.5, 'rock', t); label(x, y - 9, n, null, { size: 11, color: 'efg'.includes(n) ? '#8fe3a6' : '#f4efe6' }); } } },
    { short: 'Two suns', title: 'A planet with two suns',
      text: 'Kepler-16b circles two stars at once: an orange star and a red dwarf that orbit each other every 41 days, while the planet goes round both every 229 days. From its cloud tops there would be two sunsets.',
      facts: [['Its stars orbit each other', 'every 41 days'], ['The planet orbits both', 'every 229 days'], ['Found', '2011, by Kepler']],
      src: 'Source: Doyle et al. 2011, Science 333:1602', dur: 13, live: (t) => `Time-lapse: ${(t * 16).toFixed(0)} days`,
      draw(v, t) { const sc = v.s * .44 / .7048, cx = v.cx, cy = v.cy, d = (CALM ? 2 : t) * 16, thb = d / 41.08 * TAU, thp = d / 228.8 * TAU, sep = .2243 * sc, qa = .2 / .89, qb = .69 / .89;
        ring(cx, cy, .7048 * sc, 'rgba(244,239,230,.2)', 1, [4, 4], .7048 * sc * .45); ring(cx, cy, sep * qb, 'rgba(244,239,230,.12)', 1, null, sep * qb * .45);
        star(cx - Math.cos(thb) * sep * qa, cy - Math.sin(thb) * sep * qa * .45, 9, [255, 180, 110], t); star(cx + Math.cos(thb) * sep * qb, cy + Math.sin(thb) * sep * qb * .45, 5, [255, 110, 70], t);
        const px = cx + Math.cos(thp) * .7048 * sc, py = cy + Math.sin(thp) * .7048 * sc * .45; planet(px, py, 6, 'saturn', t); label(px, py - 12, 'Kepler-16b', null, { size: 11.5 }); } },
    { short: 'Iron rain', title: 'Could it rain iron?',
      text: 'WASP-76b is a giant planet so close to its star that one side always faces it, at about 2,400 °C: hot enough to boil iron. Astronomers detected a difference in iron absorption between its limbs. Iron could condense on the cooler side, and temperature differences could also explain the signal.',
      facts: [['Day side', 'about 2,400 °C'], ['Its year', '1.8 days'], ['Distance', 'about 640 light years']],
      src: 'Sources: Ehrenreich et al. 2020, Nature 580:597; Wardenier et al. 2021, MNRAS 506:1258', dur: 12,
      draw(v, t) { const R = v.s * .36, cx = v.cx + v.w * .05, cy = v.cy; glow(v.x0 - 40, cy, v.w * .5, [255, 200, 140], .5);
        g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip(); const gr = g.createLinearGradient(cx - R, 0, cx + R, 0); gr.addColorStop(0, '#fff2c8'); gr.addColorStop(.3, '#ff9a4a'); gr.addColorStop(.5, '#a8402a'); gr.addColorStop(.6, '#2a1830'); gr.addColorStop(1, '#0a0c1a'); g.fillStyle = gr; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        const RR = rng(3); for (let i = 0; i < 90; i++) { const x = cx + R * (.15 + .7 * RR()), y0 = cy - R + RR() * 2 * R, fall = ((CALM ? 0 : t) * (40 + 30 * RR()) + RR() * 200) % (R * .5); line(x, y0 + fall, x - 2, y0 + fall + 9, `rgba(200,210,230,${.38 * Math.sin(Math.PI * fall / (R * .5))})`, 1); }
        g.restore();
        for (let i = 0; i < 3; i++) { const y = cy - R * (.75 - i * .55), ph = ((CALM ? 0 : t) * .3 + i * .3) % 1; g.beginPath(); g.moveTo(cx - R * .6, y); g.quadraticCurveTo(cx, y - R * .25, cx + R * .6, y); g.strokeStyle = 'rgba(255,210,122,.4)'; g.lineWidth = 1.5; g.setLineDash([6, 8]); g.lineDashOffset = -ph * 56; g.stroke(); g.setLineDash([]); }
        label(cx - R * .55, cy + R + 26, 'Day side', null, { size: 12, color: '#ffd27a' }); label(cx + R * .55, cy + R + 26, 'Possible iron rain', null, { size: 12, color: '#bcc8e0' }); } },
  ],
};
STORIES.push(S3, S4, S5, S6);

// ---------------------------------------------------------------- the page: picker, chapters, dock, playback
const FADE = .9;
const nextFrame = document.createElement('canvas'), nextContext = nextFrame.getContext('2d');
const interruptedFrame = document.createElement('canvas');
let cur = null, ci = 0, ct = 0, chapterStart = 0, prevCh = null, fadeT = 1, playing = !CALM, textOn = true, last = performance.now();
const cards = $('cards');
function storyUrl(s, i) { return `#${s.id}/${i + 1}`; }
function buildCards() {
  sprites();
  cards.innerHTML = STORIES.map((s, i) => `<a class="card" href="${storyUrl(s, 0)}"><canvas width="480" height="270" data-i="${i}"></canvas><div><small>STORY ${i + 1} OF ${STORIES.length}</small><b>${esc(s.title)}</b><p>${esc(s.blurb)}</p></div></a>`).join('');
  cards.querySelectorAll('canvas').forEach((c) => {
    const s = STORIES[+c.dataset.i], ch = s.chapters[s.thumb ?? (s.chapters.length > 1 ? 1 : 0)], x = c.getContext('2d'), old = g;
    g = x; THUMB = true; x.fillStyle = '#04060c'; x.fillRect(0, 0, 480, 270); sky(480, 270, 2, .8);
    const tv = { x0: 16, x1: 464, y0: 16, y1: 254, w: 448, h: 238, cx: 240, cy: 135, W: 480, H: 270, ph: false, s: 238 };
    try { ch.draw(tv, s.thumbT ?? 9); } catch (e) { /* a still that fails leaves the card dark */ }
    THUMB = false; g = old;
  });
}
function openStory(s, i) {
  i = clamp(i, 0, s.chapters.length - 1);
  const same = cur === s;
  if (same && i === ci) return;
  if (!same) { cur = s; prevCh = null; buildDock(); }
  else if (!CALM) {
    if (prevCh && fadeT < 1) {
      // A quick second chapter change should start from the image the reader can actually see.
      interruptedFrame.width = cv.width; interruptedFrame.height = cv.height;
      interruptedFrame.getContext('2d').drawImage(cv, 0, 0);
      prevCh = { image: interruptedFrame };
    } else prevCh = { ch: s.chapters[ci], t: ct, start: chapterStart };
  }
  ci = i; ct = 0; chapterStart = s.chapters.slice(0, i).reduce((total, c) => total + c.dur, 0); fadeT = prevCh ? 0 : 1;
  document.body.classList.remove('picking'); $('cap').hidden = false; $('dock').hidden = false; $('tabStories').removeAttribute('aria-current');
  showText(); if (!same) setPlaying(!CALM);
}
function closeStory() { cur = null; prevCh = null; document.body.classList.add('picking'); $('cap').hidden = true; $('dock').hidden = true; $('tabStories').setAttribute('aria-current', 'page'); }
function route() {
  const m = /^#([\w-]+)\/(\d+)$/.exec(location.hash), s = m && STORIES.find((x) => x.id === m[1]);
  if (s) openStory(s, +m[2] - 1); else closeStory();
}
function go(i) { if (!cur) return; i = clamp(i, 0, cur.chapters.length - 1); history.replaceState(null, '', storyUrl(cur, i)); openStory(cur, i); }
function showText() {
  const ch = cur.chapters[ci], n = cur.chapters.length, idx = STORIES.indexOf(cur);
  $('kick').textContent = `${cur.title.toUpperCase()} · ${ci + 1} OF ${n}`; $('kick').style.color = cur.accent;
  $('title').textContent = ch.title; $('text').textContent = ch.text; $('live').textContent = '';
  $('facts').innerHTML = (ch.facts || []).map(([a, b]) => `<dt>${esc(a.toUpperCase())}</dt><dd>${esc(b)}</dd>`).join('');
  $('src').textContent = ch.src || ''; $('src').classList.toggle('image-credit', !!ch.photo);
  const nx = STORIES[idx + 1]; $('snext').hidden = !(ci === n - 1);
  $('snext').innerHTML = ci === n - 1 ? (nx ? `<a href="${storyUrl(nx, 0)}">Next story: ${esc(nx.title)} ›</a>` : '<a href="./">All stories</a>') : '';
  const cap = $('cap'); cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in');
  $('dname').textContent = cur.title.toUpperCase(); $('dcount').textContent = `CHAPTER ${ci + 1} OF ${n}`;
  [...$('bands').children].forEach((b, k) => b.classList.toggle('after', k > ci));
}
function buildDock() {
  const n = cur.chapters.length, base = cur.accent;
  $('bands').innerHTML = cur.chapters.map((c, k) => `<i data-k="${k}" style="left:${k / n * 100}%;width:${100 / n}%;background:${base};filter:brightness(${.62 + .38 * (k % 2 ? .8 : 1) + k * .04})">${esc(c.short)}</i>`).join('');
  $('ticks').innerHTML = cur.chapters.map((c, k) => `<span style="left:${k / n * 100}%">${k + 1}</span>`).join('');
}
function setPlaying(p) { playing = p; $('play').setAttribute('aria-label', p ? 'Pause' : 'Play'); $('playicon').innerHTML = p ? '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>'; }

function drawChapter(ctx, ch, v, t, clock) {
  const old = g; g = ctx; ctx.save();
  try {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = '#04060c'; ctx.fillRect(0, 0, W, H);
    sky(W, H, 0, .9);
    ch.draw(v, t, clock);
  } finally { ctx.restore(); g = old; }
}
function frame(now) {
  const dt = Math.min(.1, (now - last) / 1000); last = now;
  size();
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  const T = now / 1000;
  if (!cur) { g.fillStyle = '#04060c'; g.fillRect(0, 0, W, H); sky(W, H, CALM ? 0 : T, 1, CALM ? 0 : T * .3); }
  else {
    if (playing) {
      ct += dt;
      const end = cur.chapters[ci].dur;
      if (ct >= end) {
        const carry = ct - end;
        ct = end;
        if (ci < cur.chapters.length - 1) { go(ci + 1); ct = carry; }
        else setPlaying(false);
      }
      if (prevCh?.ch) prevCh.t += dt;
    }
    const ch = cur.chapters[ci], v = viewport(W, H, textOn), animT = CALM ? ch.dur * .8 : ct;
    const clock = chapterStart + animT;
    fadeT = Math.min(1, fadeT + dt / FADE);
    if (fadeT < 1 && prevCh) {
      if (prevCh.image) g.drawImage(prevCh.image, 0, 0, W, H);
      else drawChapter(g, prevCh.ch, v, prevCh.t, prevCh.start + prevCh.t);
      if (nextFrame.width !== cv.width || nextFrame.height !== cv.height) {
        nextFrame.width = cv.width; nextFrame.height = cv.height;
      }
      drawChapter(nextContext, ch, v, animT, clock);
      // Blend complete frames so a chapter's internal opacity and additive glows cannot bypass the fade.
      g.save(); g.globalAlpha = ease(fadeT); g.drawImage(nextFrame, 0, 0, W, H); g.restore();
    } else { prevCh = null; drawChapter(g, ch, v, animT, clock); }
    if (ch.live) { const lv = ch.live(animT); if ($('live').textContent !== lv) $('live').textContent = lv; }
    const n = cur.chapters.length, p = (ci + clamp(ct / ch.dur, 0, 1)) / n * 100;
    $('cursor').style.left = p + '%'; const pill = $('pill'); pill.style.left = p + '%'; if (pill.textContent !== ch.short) pill.textContent = ch.short;
  }
  requestAnimationFrame(frame);
}

$('bands').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) go(+b.dataset.k); });
$('prev').addEventListener('click', () => go(ci - 1)); $('next').addEventListener('click', () => go(ci + 1));
$('play').addEventListener('click', () => { if (!playing && cur && ci === cur.chapters.length - 1 && ct >= cur.chapters[ci].dur) { ct = 0; } setPlaying(!playing); });
$('cc').addEventListener('click', () => { textOn = !textOn; document.body.classList.toggle('notext', !textOn); $('cc').setAttribute('aria-pressed', textOn); $('cc').textContent = textOn ? 'Hide text' : 'Show text'; });
$('fs').addEventListener('click', () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); });
addEventListener('keydown', (e) => {
  if (e.target.closest?.('input,textarea')) return;
  if (!cur) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); go(ci + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(ci - 1); }
  else if (e.key === ' ') { e.preventDefault(); $('play').click(); } else if (e.key === 'Escape') { location.hash = ''; }
  else if (e.key === 'c' || e.key === 'C') $('cc').click(); else if (e.key === 'f' || e.key === 'F') $('fs').click();
});
addEventListener('hashchange', route);
buildCards();
route();
requestAnimationFrame((t) => { last = t; frame(t); });
})();
