/* One atlas, a prototype. One screen from the Earth's formation to today:
   - before 10,000 BCE a WebGL globe of the ancient Earth (the Earth history maps, ../data/paleo/<Ma>.webp);
   - at 10,000 BCE the globe opens out into the flat Natural Earth map, landing exactly on the World history map, which runs in a
     frame underneath (../, its own bar and dock hidden) and takes over from there;
   - one timeline in two parts that fold: the part you are in is wide, the other is a block at its end.
   The globe is a mesh in view coordinates (longitude and latitude seen from the centre of the view): each vertex moves from its place on
   the sphere, through an "unbent" sphere, to its place on the flat map. Ages are in millions of years ago (Ma); history is in years. */
"use strict";
const REL = document.querySelector('meta[name="data-version"]')?.content, VQ = REL ? "?v=" + REL : ""; // the release, on every data request (they are cached for a year)
const $ = (q) => document.querySelector(q), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), RAD = Math.PI / 180;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const OLDEST = 4567, MAPPED = 540, NOW_YEAR = 2026, Y0 = -10000, JOIN = (NOW_YEAR - Y0) / 1e6; // the join: 10,000 BCE, 12,026 years ago
// the Earth history scale (as on that page) and the World history scale (as on that page)
const STOPS = [[4567, 0], [4031, .035], [2500, .085], [1000, .14], [538.8, .21], [251.902, .47], [66, .72], [23.04, .84], [2.58, .93], [0.0117, .985], [0, 1]];
const XJ = (() => { const [a, xa] = STOPS[8], [b, xb] = STOPS[9]; return xa + (a - JOIN) / (a - b) * (xb - xa); })(); // where the join sits on that scale
function X(ma) { // 0..1 along the Earth part, which ends at the join
  if (ma >= OLDEST) return 0;
  for (let i = 1; i < STOPS.length; i++) if (ma >= STOPS[i][0]) { const [a, xa] = STOPS[i - 1], [b, xb] = STOPS[i]; return Math.min(1, (xa + (a - ma) / (a - b) * (xb - xa)) / XJ); }
  return 1;
}
function atX(x) { x = clamp(x, 0, 1) * XJ; for (let i = 1; i < STOPS.length; i++) if (x <= STOPS[i][1]) { const [a, xa] = STOPS[i - 1], [b, xb] = STOPS[i]; return a - (x - xa) / (xb - xa) * (a - b); } return 0; }
const BREAKS = [[-10000, 0], [-3400, .14], [-1000, .27], [0, .39], [1000, .54], [1500, .68], [1800, .84], [NOW_YEAR, 1]];
// the ages of history, as World history names them, each with a colour of its own and a short form for a narrow band
const HERAS = [[-10000, -3400, "Before the first states", "Before states", "#E8E2D0"], [-3400, -1200, "Bronze Age", "Bronze", "#D8A657"], [-1200, -500, "Iron Age", "Iron", "#A9B4C0"],
  [-500, 300, "Classical Antiquity", "Classical", "#F0D9A8"], [300, 600, "Late Antiquity", "Late Ant.", "#CDA9CB"], [600, 1000, "Early Middle Ages", "Early M.A.", "#93BE9E"],
  [1000, 1300, "High Middle Ages", "High M.A.", "#79B0D0"], [1300, 1500, "Late Middle Ages", "Late M.A.", "#BBCF7E"], [1500, 1800, "Early Modern", "Early Mod.", "#EBA574"],
  [1800, 1914, "Industrial & Imperial Age", "Industrial", "#D08484"], [1914, NOW_YEAR, "Modern World", "Modern", "#8F9BDD"]];
function HX(y) { for (let i = 1; i < BREAKS.length; i++) if (y <= BREAKS[i][0]) { const [a, xa] = BREAKS[i - 1], [b, xb] = BREAKS[i]; return xa + (y - a) / (b - a) * (xb - xa); } return 1; }
function atHX(x) { x = clamp(x, 0, 1); for (let i = 1; i < BREAKS.length; i++) if (x <= BREAKS[i][1]) { const [a, xa] = BREAKS[i - 1], [b, xb] = BREAKS[i]; return a + (x - xa) / (xb - xa) * (b - a); } return NOW_YEAR; }
const num = (v, d = 0) => v.toLocaleString("en-GB", { maximumFractionDigits: d });
function ageParts(ma) {
  if (ma >= 1000) return [num(ma / 1000, 2), "billion years ago"];
  if (ma >= 1) return [num(ma, ma < 10 ? 1 : 0), "million years ago"];
  const y = ma * 1e6; return [num(y >= 100000 ? Math.round(y / 10000) * 10000 : Math.round(y / 1000) * 1000), "years ago"];
}
const yearText = (y) => { y = Math.round(y); return y < 0 ? `${num(-y)} BCE` : y < 1000 ? `${y} CE` : String(y); };

const PH = () => matchMedia("(max-width: 760px)").matches; // a phone: World history underneath is in its phone layout too (see phone.js)
const S = { mode: "deep", ma: 66, year: Y0, t: 0, tT: 0, f: .08, lon: 20, lat: 14, playing: false, flat: false, pol: 0, dirty: true };
let D = null, leaves = [];

// ---------------------------------------------------------------- the globe that opens out
const cv = $("#globe"), gl = cv.getContext("webgl", { antialias: true, alpha: true });
const VS = `attribute vec2 a; uniform mat3 uMi; uniform float uT; uniform vec2 uCg, uView; uniform float uRg; uniform vec3 uF;
varying vec3 vGeo; varying float vFace;
vec2 ne(float l, float p){ float p2=p*p, p4=p2*p2;
  return vec2(l*(0.8707-0.131979*p2+p4*(-0.013791+p4*(0.003971*p2-0.001529*p4))), p*(1.007226+p2*(0.015085+p4*(-0.044475+0.028874*p2-0.005916*p4)))); }
void main(){
  float c=max(1.-uT,.0006), lc=a.x*c, pc=a.y*c;
  vGeo=uMi*vec3(cos(a.y)*sin(a.x), sin(a.y), cos(a.y)*cos(a.x));
  vec3 u=vec3(cos(pc)*sin(lc)/c, sin(pc)/c, (cos(pc)*cos(lc)-1.)/c); // the sphere, unbent: c=1 a sphere, c->0 a flat sheet
  vFace=cos(pc)*cos(lc);
  vec2 g=uCg+uRg*vec2(u.x,-u.y), n=ne(a.x,a.y), f=vec2(uF.x*n.x+uF.y, -uF.x*n.y+uF.z);
  vec2 px=mix(g,f,smoothstep(0.,1.,uT));
  gl_Position=vec4(px.x/uView.x*2.-1., 1.-px.y/uView.y*2., clamp(-u.z/3.,0.,1.)*1.8-.9, 1.);
}`;
const FS = `precision highp float;
uniform float uR; uniform mat3 uM; uniform sampler2D uA, uB; uniform float uMix; uniform vec2 uTexel;
uniform float uLandMax, uSeaMax, uVeg, uReal, uHeat, uIce, uSeed, uTpp, uT, uPol; uniform vec3 uW, uSun, uH; uniform vec2 uHs; uniform sampler2D uHist;
vec2 ne(float l, float p){ float p2=p*p, p4=p2*p2;
  return vec2(l*(0.8707-0.131979*p2+p4*(-0.013791+p4*(0.003971*p2-0.001529*p4))), p*(1.007226+p2*(0.015085+p4*(-0.044475+0.028874*p2-0.005916*p4)))); }
varying vec3 vGeo; varying float vFace;
float hash(vec3 p){ p=fract(p*.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*noise(p); p=p*2.03+vec3(7.1,3.3,5.7); a*=.5; } return s; }
float dec(float v){ float x=v*255.; return x>127.5 ? pow(max(x-128.,0.)/127.,2.)*uLandMax+step(128.,x)*.5 : -pow((127.-min(x,127.))/127.,2.)*uSeaMax; }
float elev(vec2 uv){ return mix(dec(texture2D(uA,uv).r), dec(texture2D(uB,uv).r), uMix); }
vec3 seaL(float d){ vec3 c=mix(vec3(.74,.85,.93),vec3(.88,.93,.97),smoothstep(120.,1500.,d)); return mix(c,vec3(.95,.97,.985),smoothstep(1500.,5200.,d)); }
vec3 landL(float h){
  vec3 c=mix(vec3(.875,.865,.825),vec3(.80,.78,.73),smoothstep(0.,1300.,h)); c=mix(c,vec3(.69,.67,.61),smoothstep(1300.,3200.,h)); c=mix(c,vec3(.55,.53,.47),smoothstep(3200.,5400.,h));
  return mix(c,vec3(.78,.84,.71),uVeg*.6*(1.-smoothstep(700.,2600.,h))); }
void main(){
  vec3 n=normalize(vGeo); vec3 L=uSun*uM; float z=clamp(vFace,0.,1.);
  float lat=asin(clamp(n.y,-1.,1.)); float lon=atan(n.x,n.z); vec2 uv=vec2(lon/6.2831853+.5,.5-lat/3.14159265);
  float base=dot(n,L); float relief=0.; float glow=0.; vec3 real=vec3(0.);
  if(uReal>.001){
    float e=elev(uv); float dx=uTexel.x/max(cos(lat),.1);
    float ex=elev(uv+vec2(dx,0.))-elev(uv-vec2(dx,0.)); float ey=elev(uv-vec2(0.,uTexel.y))-elev(uv+vec2(0.,uTexel.y));
    vec3 east=normalize(vec3(n.z,0.,-n.x)); vec3 north=cross(n,east); float k=(e>0.?46.:13.)/(uTexel.y*40030000.);
    vec3 nn=normalize(n-(east*ex+north*ey)*k); relief=(dot(nn,L)-base)*uReal;
    real=e>0.?landL(e):seaL(-e);
    float u=lon*1.9098593, w2=lat*1.9098593, lw=1.9098593/uR;
    float gd=min(abs(u-floor(u+.5))*max(cos(lat),.05),abs(w2-floor(w2+.5)));
    real=mix(real,vec3(.80,.83,.85),(1.-smoothstep(lw*.6,lw*1.5,gd))*step(200.,-e)*.9);
    float dpx=abs(e)/max(length(vec2(ex,ey))*.5,.5)/uTpp;
    real=mix(real,vec3(.47,.46,.41),(1.-smoothstep(.5,1.3,dpx))*.8);
  }
  vec3 art=vec3(0.);
  if(uReal<.999){
    vec3 q=n+vec3(uSeed,uSeed*.37,-uSeed*.61);
    if(uW.x>.001){ float f=fbm(q*3.2); float cr=1.-smoothstep(0.,.05,abs(fbm(q*5.5+3.)-.48)); float m=smoothstep(.92-.62*uHeat,1.08-.50*uHeat,f*.9+cr*.45);
      vec3 crust=mix(vec3(.075,.052,.05),vec3(.21,.14,.11),fbm(q*13.)); vec3 lava=mix(vec3(.78,.11,.02),vec3(1.,.46,.07),smoothstep(.25,1.,m));
      art+=uW.x*mix(crust,lava,m); glow+=uW.x*m; }
    if(uW.y>.001){ float f=fbm(q*2.7+11.); float ld=smoothstep(.640,.660,f); vec3 sea=mix(vec3(.04,.24,.30),vec3(.11,.47,.45),smoothstep(.3,.7,fbm(q*5.+2.)));
      art+=uW.y*mix(sea,mix(vec3(.24,.19,.16),vec3(.38,.29,.22),fbm(q*15.)),ld); }
    if(uW.z>.001){ float f=fbm(q*1.9+23.); float ld=smoothstep(.555,.575,f); vec3 sea=mix(vec3(.03,.13,.36),vec3(.11,.40,.63),smoothstep(.30,.55,f));
      vec3 rock=mix(vec3(.58,.38,.25),vec3(.40,.29,.23),fbm(q*9.)); vec3 c=mix(sea,rock,ld);
      float ic=smoothstep(0.,.06,abs(lat)-mix(1.75,-.12,uIce)+(fbm(q*7.)-.5)*.34);
      vec3 icec=mix(vec3(.62,.75,.87),vec3(.97,.98,1.),smoothstep(.3,.68,fbm(q*6.+5.)))-ld*.07-(1.-smoothstep(0.,.014,abs(fbm(q*9.+1.)-.49)))*.20; c=mix(c,icec,ic); art+=uW.z*c; }
  }
  vec3 col=mix(art,real,uReal);
  float litL=(mix(.89+.11*z,1.,uT))*(1.+relief*.9); col=col*mix(litL,1.,glow*.7);
  if(uPol>.001){ // history: the map of peoples and states, where the copy of it reaches
    vec2 q=ne(lon,lat), hp=vec2(uH.x*q.x+uH.y,-uH.x*q.y+uH.z)/uHs; float m=min(min(hp.x,1.-hp.x),min(hp.y,1.-hp.y));
    vec3 hc=texture2D(uHist,clamp(hp,0.,1.)).rgb*mix(.90+.10*z,1.,uT); col=mix(col,hc,uPol*smoothstep(0.,.012,m)); }
  col=mix(vec3(.62,.62,.60),col,smoothstep(0.,.06,z+uT)); // a darker rim while it is a globe
  gl_FragColor=vec4(col,1.);
}`;
let U = {}, NV = 0;
function glInit() {
  const mkS = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, mkS(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, mkS(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const NX = 240, NY = 120, v = new Float32Array(NX * NY * 12); let k = 0; // a grid over the whole sphere, as plain triangles
  const P = (i, j) => { v[k++] = -Math.PI + i / NX * 2 * Math.PI; v[k++] = -Math.PI / 2 + j / NY * Math.PI; };
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { P(i, j); P(i + 1, j); P(i, j + 1); P(i + 1, j); P(i + 1, j + 1); P(i, j + 1); }
  NV = k / 2;
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);
  const a = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  for (const n of ["uMi", "uT", "uCg", "uView", "uRg", "uF", "uR", "uM", "uA", "uB", "uMix", "uTexel", "uLandMax", "uSeaMax", "uVeg", "uReal", "uHeat", "uIce", "uSeed", "uTpp", "uW", "uSun", "uHist", "uH", "uHs", "uPol"]) U[n] = gl.getUniformLocation(pr, n);
  gl.uniform1i(U.uA, 0); gl.uniform1i(U.uB, 1);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  blank = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, blank); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([60]));
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.clearColor(0, 0, 0, 0);
  HT.tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, HT.tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));
  for (const k of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(U.uHist, 2); gl.activeTexture(gl.TEXTURE0);
}
let blank = null;
const HT = { tex: null, cvs: document.createElement("canvas"), aff: [1, 0, 0], size: [1, 1], at: 0, has: false }; // the World history map, copied to a texture
const tex = new Map();
function want(ma) {
  let o = tex.get(ma); if (o) return o;
  o = { ready: false, ma }; tex.set(ma, o);
  fetch(`data/paleo/${ma}.webp${VQ}`).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then((b) => createImageBitmap(b, { colorSpaceConversion: "none", premultiplyAlpha: "none" }))
    .then((bmp) => {
      o.t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, o.t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, bmp); bmp.close && bmp.close();
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      o.ready = true; S.dirty = true;
      if (tex.size > 24) { const far = [...tex.values()].filter((x) => x.ready).sort((a, b) => Math.abs(b.ma - S.ma) - Math.abs(a.ma - S.ma))[0]; if (far && far !== o) { gl.deleteTexture(far.t); tex.delete(far.ma); } }
    }).catch(() => { tex.delete(ma); });
  return o;
}
function pair(ma) {
  const m = clamp(ma, 0, MAPPED), a = Math.floor(m / 5) * 5, b = Math.min(a + 5, MAPPED), A = want(a), B = want(b);
  if (A.ready && B.ready) return [A.t, B.t, (m - a) / 5];
  let best = null; for (const o of tex.values()) if (o.ready && (!best || Math.abs(o.ma - m) < Math.abs(best.ma - m))) best = o;
  return best ? [best.t, best.t, 0] : null;
}
function early(ma) { // the artist's impression before the maps begin: molten, ocean world, Snowball (as on the Earth history page)
  const sm = (a, b, v) => clamp((v - a) / (b - a), 0, 1), h = sm(3980, 4080, ma), p = 1 - sm(2440, 2560, ma);
  const snow = (a, b) => sm(b - 6, b + 4, ma) * (1 - sm(a - 4, a + 6, ma));
  return { w: [h, (1 - h) * (1 - p), p], heat: .12 + .88 * Math.pow(sm(4031, 4567, ma), 1.6), ice: Math.max(snow(717, 660), snow(650, 635), .5 * snow(2420, 2250)), seed: ma * .0011 };
}
let W = 0, H = 0, dpr = 1, G = { cx: 0, cy: 0, r: 100 };
function layout() {
  dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  cv.width = mk.width = Math.round(W * dpr); cv.height = mk.height = Math.round(H * dpr); gl.viewport(0, 0, cv.width, cv.height);
  syncChrome();
  const left = 24 + ($("#card").offsetWidth || 380) + 20, top = 84, bottom = H - (ST ? 190 : 158), availH = bottom - top, availW = W - left - 40; // the same on both sides of the join, so the globe never jumps
  G = { cx: left + availW / 2, cy: top + availH / 2, r: Math.max(80, Math.min(availH, availW) / 2 * .97) };
  if (PH()) { // a phone: the globe fills the width above the sheet at its lowest stop, and keeps that size when the sheet is pulled up
    const t = ST ? 84 : 64, b = H - (ST ? Math.min(360, H * .48) : 276) - 10; G = { cx: W / 2, cy: (t + b) / 2, r: Math.max(60, Math.min(b - t, W - 32) / 2) }; }
  const gr = $("#grab"); gr.style.left = G.cx - G.r + "px"; gr.style.top = G.cy - G.r + "px"; gr.style.width = gr.style.height = G.r * 2 + "px";
  S.dirty = true; drawTimeline(true); storyBar();
}
function syncChrome() { // this page's brand, switch and card sit exactly where World history's brand, site switch and card are, at any window size
  if (PH()) return;
  // the look switch sits just right of the brand, wherever the brand ends: measured on this page, so it is right before the frame
  // underneath has loaded and after the brand's font arrives (it used to wait for the frame, and sat on the brand until then)
  const placeSwitch = () => { const r = $(".brand").getBoundingClientRect(); if (r.width) $("#themeBtn").style.setProperty("--theme-x", Math.round(r.right + 12) + "px"); };
  placeSwitch();
  try {
    const d = histWin().document, R = (q) => { const e = d.querySelector(q); const r = e && e.getBoundingClientRect(); return r && r.width ? r : null; };
    const b = R("#bar .brand"), sw = R("#bar .sitesw"), col = R("#col");
    if (b) { const el = $(".brand"); el.style.width = b.width + "px"; el.style.height = b.height + "px"; placeSwitch(); }
    const tb = R("#bar .tabs"); if (tb) $("#tabs").style.left = tb.left + tb.width / 2 - 24 + "px"; // the sections, centred where World history's are
    if (col) { const narrow = S.flat && S.mode === "deep" && innerWidth < 1200; // Flat view in a small window: a narrower Earth card, so the map has the width
      for (const el of [$("#card"), $("#story")]) { el.style.left = col.left + "px"; el.style.top = col.top + "px"; el.style.width = (narrow && el.id === "card" ? Math.min(col.width, Math.max(280, Math.round(innerWidth * .3))) : col.width) + "px"; } }
  } catch (e) {}
}
// In history the card, the search box and the map buttons are World history's own, in the page underneath, while the globe (and the
// map it opens into) is drawn on this page's canvas above them. So the canvas is cut away over each of them: the map opening out no
// longer washes across the panel. Kept while the canvas fades out too, once the map underneath has taken over.
let clipShown = "", clipAt = 0;
function clipCard(now) {
  if (now - clipAt < 80) return; clipAt = now;
  let p = "";
  if (S.mode === "hist") try {
    const fw = histWin(), d = fw.document; let holes = "";
    for (const q of ["#col", "#bar .search", "#layersBtn", "#mapTools .zoom", "#noRecords"]) {
      const el = d.querySelector(q); if (!el || el.hidden) continue;
      const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 8) continue;
      const cs = fw.getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
      const x = Math.round(r.left) - 1, y = Math.round(r.top) - 1, w = Math.round(r.width) + 2, h = Math.round(r.height) + 2, k = Math.max(1, Math.min((parseFloat(cs.borderTopLeftRadius) || 0) + 1, w / 2, h / 2));
      holes += ` M${x + k} ${y}h${w - 2 * k}a${k} ${k} 0 0 1 ${k} ${k}v${h - 2 * k}a${k} ${k} 0 0 1 -${k} ${k}h-${w - 2 * k}a${k} ${k} 0 0 1 -${k} -${k}v-${h - 2 * k}a${k} ${k} 0 0 1 ${k} -${k}Z`;
    }
    if (holes) p = `path(evenodd, "M0 0H${W}V${H}H0Z${holes}")`;
  } catch (e) {}
  if (p !== clipShown) { clipShown = p; cv.style.clipPath = mk.style.clipPath = p; }
}
// where the flat map must land: exactly on the World history map in the frame underneath (its projection, then its pan and zoom)
function flatFit() {
  try {
    const iw = $("#hist").contentWindow, c = iw.document.querySelector("#map"), z = c.__zoom, r = c.getBoundingClientRect();
    if (!z || !r.width || !iw.d3) throw 0;
    const edge = []; for (let lon = -180; lon <= 180; lon += 5) edge.push([lon, 84], [lon, -57]);
    for (let lat = -57; lat <= 84; lat += 3) edge.push([-180, lat], [180, lat]);
    const small = r.width < 600, pj = iw.d3.geoNaturalEarth1().fitExtent(r.width <= 760 ? [[4, 72], [r.width - 4, Math.max(220, r.height - 300)]] : [[small ? 4 : 10, small ? 4 : 8], [r.width - (small ? 40 : 56), r.height - (small ? 4 : 30)]], { type: "MultiPoint", coordinates: edge });
    const k = pj.scale(), [tx, ty] = pj.translate();
    return [z.k * k, z.k * tx + z.x + r.left, z.k * ty + z.y + r.top];
  } catch (e) { const a = (G.r * 2.6) / (2 * Math.PI * .8707); return [a, G.cx, G.cy]; }
}
let FIT = null;
function draw() {
  const a = -S.lon * RAD, b = S.lat * RAD, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  const M = [[ca, 0, sa], [sa * sb, cb, -ca * sb], [-sa * cb, sb, ca * cb]]; // world -> view
  const real = clamp((560 - S.ma) / 20, 0, 1), e = early(S.ma), pr = real > 0 ? pair(S.ma) : null;
  if (real > 0 && !pr) { gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); S.dirty = true; return; } // the first map is still on its way: draw nothing, not the artist's impression
  if (!FIT) FIT = flatFit();
  const pxRad = (G.r + (FIT[0] * .87 - G.r) * S.t) * dpr;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix3fv(U.uMi, false, new Float32Array([M[0][0], M[0][1], M[0][2], M[1][0], M[1][1], M[1][2], M[2][0], M[2][1], M[2][2]])); // its transpose: view -> world
  gl.uniformMatrix3fv(U.uM, false, new Float32Array([M[0][0], M[1][0], M[2][0], M[0][1], M[1][1], M[2][1], M[0][2], M[1][2], M[2][2]]));
  gl.uniform1f(U.uT, S.t); gl.uniform2f(U.uCg, G.cx, G.cy); gl.uniform1f(U.uRg, G.r); gl.uniform2f(U.uView, W, H); gl.uniform3f(U.uF, FIT[0], FIT[1], FIT[2]);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, pr ? pr[0] : blank); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, pr ? pr[1] : blank);
  gl.uniform1f(U.uMix, pr ? pr[2] : 0); gl.uniform2f(U.uTexel, 1 / D.maps.width, 1 / D.maps.height);
  gl.uniform1f(U.uLandMax, D.maps.landMax); gl.uniform1f(U.uSeaMax, D.maps.seaMax); gl.uniform1f(U.uVeg, clamp((470 - S.ma) / 130, 0, 1));
  gl.uniform1f(U.uR, pxRad); gl.uniform1f(U.uTpp, D.maps.width / (2 * Math.PI) / pxRad);
  gl.uniform1f(U.uReal, pr ? real : 0); gl.uniform1f(U.uHeat, e.heat); gl.uniform1f(U.uIce, e.ice); gl.uniform1f(U.uSeed, e.seed); gl.uniform3fv(U.uW, e.w);
  gl.uniform1f(U.uPol, HT.has ? S.pol : 0); gl.uniform3f(U.uH, HT.aff[0], HT.aff[1], HT.aff[2]); gl.uniform2f(U.uHs, HT.size[0], HT.size[1]);
  const s = [-.46, .36, .81], sl = Math.hypot(...s); gl.uniform3f(U.uSun, s[0] / sl, s[1] / sl, s[2] / sl);
  gl.drawArrays(gl.TRIANGLES, 0, NV);
  drawPins(M);
}

// ---------------------------------------------------------------- the card (the Earth part; in history the World history card shows)
function unitAt(ma) { return leaves.find((u) => ma <= u.from && ma > u.to) || (ma <= 0 ? leaves[leaves.length - 1] : leaves[0]); }
let shown = "", picUnit = null, cardPics = [];
function renderCard() {
  const [n, u] = ageParts(S.ma), unit = unitAt(S.ma), near = S.ma < .1;
  const sub = `${unit.name} ${unit.rank}` + (near ? ` · ${yearText(Math.round((NOW_YEAR - S.ma * 1e6) / 1000) * 1000)}` : "");
  const key = n + u + unit.id + near; if (key === shown) return; shown = key;
  $("#ageNum").textContent = n; $("#ageUnit").textContent = u; $("#ageSub").textContent = sub;
  $("#chipSw").style.background = unit.color; $("#chipName").textContent = unit.name;
  $("#tagline").textContent = unit.tagline || ""; $("#body").textContent = unit.world || "";
  if (unit.id !== picUnit) { picUnit = unit.id; cardPics = picsFor(unit); const po = $("#picOpen"); po.hidden = !cardPics.length;
    if (cardPics.length) { const im = $("#picImg"); im.dataset.fb = cardPics[0].image; im.src = sized(cardPics[0], 500); $("#picN").textContent = `${cardPics.length} pictures`; } }
  const hint = $("#hint"); hint.hidden = !near;
  if (near) { const y = Math.max(0, Math.round((S.ma - JOIN) * 1e6 / 1000) * 1000); hint.innerHTML = y ? `<b>History begins in ${num(y)} years.</b> Keep going and the first peoples and states appear on the globe.` : "<b>History begins here.</b>"; }
  $("#trust").textContent = S.ma > MAPPED ? "Artist's impression: no map of the Earth this old is drawn here." : S.ma > 300 ? "Rough map: reconstructions of this time differ by 600 to 1,600 km." : "Reconstructed map: PALEOMAP, Scotese and Wright 2018.";
}

// ---------------------------------------------------------------- step into this world: the pictures of a time, full screen
const STD = [120, 250, 330, 500, 960, 1280, 1920]; // the thumbnail widths Wikimedia serves
function sized(p, w) { const u = p.image; if (!/\/\d+px-/.test(u)) return u; const fit = STD.filter((x) => !p.width || x <= p.width); if (!fit.length) return u; return u.replace(/\/\d+px-/, `/${fit.find((x) => x >= w) || fit[fit.length - 1]}px-`); }
let byUnit = {};
function picsFor(u) { // the period's own pictures, then its parents' until there are at least six
  let list = (D.images || []).filter((p) => p.unit === u.id).sort((a, b) => (b.quality || 0) - (a.quality || 0));
  for (let p = byUnit[u.parent]; p && list.length < 6; p = byUnit[p.parent]) list = list.concat((D.images || []).filter((q) => q.unit === p.id));
  return list;
}
const IM = { list: [], i: 0, when: "" };
function imOpen(list, i, when) { if (!list.length) return; IM.list = list; IM.when = when || ""; setPlaying(false); $("#immerse").hidden = false;
  $("#imThumbs").innerHTML = list.map((p, k) => `<button type="button" data-k="${k}" aria-label="Picture ${k + 1}"><img src="${esc(sized(p, 250))}" data-fb="${esc(p.image)}" alt="" loading="lazy"></button>`).join(""); imShow(i || 0); $("#imClose").focus(); }
function imShow(i) { const n = IM.list.length; IM.i = (i + n) % n; const p = IM.list[IM.i], src = sized(p, innerWidth * Math.min(devicePixelRatio || 1, 2) > 1400 ? 1920 : 1280);
  const im = $("#imImg"); im.dataset.fb = p.image; im.src = src; im.alt = p.caption || ""; $("#imBg").style.backgroundImage = `url("${sized(p, 500)}")`;
  $("#imWhen").textContent = `${IM.when}${IM.when ? " \u00b7 " : ""}${IM.i + 1} of ${n}`; $("#imCap").textContent = p.caption || "";
  const a = $("#imCred"); a.textContent = [p.credit, p.license, "Wikimedia Commons"].filter(Boolean).join(", "); a.href = p.page || p.image;
  document.querySelectorAll("#imThumbs button").forEach((b) => b.classList.toggle("on", +b.dataset.k === IM.i)); $("#imThumbs .on")?.scrollIntoView({ inline: "center", block: "nearest" });
  $("#imPrev").hidden = $("#imNext").hidden = n < 2; }
function imClose() { $("#immerse").hidden = true; }

// ---------------------------------------------------------------- moments: a thread of the Earth's history told in chapters on the globe
let ST = null, fly = null;
const rangeOf = (s) => `${ageParts(s.from).join(" ").replace(" ago", "")} to ${s.to < .001 ? "today" : ageParts(s.to).join(" ")}`;
const thumb = (u) => /\/\d+px-/.test(u) ? u.replace(/\/\d+px-/, "/500px-") : u;
// how far each moment has been read, kept in this browser (as World history keeps its own)
const SEEN = (() => { try { return JSON.parse(localStorage.getItem("one.moments") || "{}") || {}; } catch (e) { return {}; } })();
function momentList() { // the Earth's moments as a side pane, oldest first
  const L = [...(D.stories || [])].sort((a, b) => b.from - a.from);
  $("#mTotal").textContent = L.length; $("#mCount").textContent = `${L.filter((s) => (SEEN[s.id] || 0) >= s.chapters.length).length} of ${L.length} finished`;
  $("#momentRows").innerHTML = L.map((s) => { const p = s.chapters.flatMap((c) => c.pics || [])[0], n = Math.min(SEEN[s.id] || 0, s.chapters.length), st = !n ? "" : n >= s.chapters.length ? "done" : "doing";
    return `<button type="button" class="erow" data-s="${esc(s.id)}"><span class="mark ${st}" style="--p:${Math.max(.06, n / s.chapters.length)}" aria-label="${st === "done" ? "Finished" : st ? `Started: ${n} of ${s.chapters.length} read` : "Not started"}"></span>${p ? `<img src="${esc(sized(p, 250))}" data-fb="${esc(p.image)}" alt="" loading="lazy">` : '<span class="noimg"></span>'}<span class="t"><b>${esc(s.title)}</b><small>${esc(spanOf(s))}</small></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>`; }).join("");
}
function spanOf(s) { const a = ageParts(s.from), b = ageParts(Math.max(s.to, .001)); return a[1] === b[1] ? `${a[0]} to ${b[0]} ${a[1]}` : `${a[0]} ${a[1].replace(" years ago", "")} to ${b[0]} ${b[1]}`; } // "252 to 66 million years ago"
function listOpen(on) { on ? ($("#app").dataset.list = "1") : delete $("#app").dataset.list; if (on) { momentList(); $("#mlist").scrollTop = 0; } shell(); }
function storyStart(id) {
  const s = (D.stories || []).find((x) => x.id === id); if (!s) return;
  listOpen(false); setPlaying(false); if (S.flat) setFlat(false); if (S.mode === "hist") enterDeep(JOIN);
  ST = { story: s, i: 0, t0: 0 }; $("#app").dataset.story = "1"; $("#sdock").hidden = false; layout(); storyGo(0); shell();
}
function storyGo(i) {
  const s = ST.story; ST.i = clamp(i, 0, s.chapters.length - 1); const c = s.chapters[ST.i], p = (c.pics || [])[0];
  S.ma = clamp(c.ma, 0, OLDEST); S.dirty = true;
  const to = c.then || (c.ma < 1 ? c.focus : null); if (to) fly = { lon0: S.lon, lat0: S.lat, dl: ((to[0] - S.lon + 540) % 360) - 180, dp: clamp(to[1], -70, 70) - S.lat, t: 0 };
  if ((SEEN[s.id] || 0) < ST.i + 1) { SEEN[s.id] = ST.i + 1; try { localStorage.setItem("one.moments", JSON.stringify(SEEN)); } catch (e) {} }
  $("#story").innerHTML = `<div class="chead"><button type="button" class="back" data-act="list"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Stories</button><span class="count">${ST.i + 1} of ${s.chapters.length}</span></div>
    <div class="kicker">${esc(s.title)}</div>
    ${p ? `<figure><img src="${esc(thumb(p.image))}" data-fb="${esc(p.image)}" alt="${esc(p.caption || "")}"><figcaption>${esc(p.credit || "")}${p.license ? ", " + esc(p.license) : ""}</figcaption></figure>` : ""}
    <h1>${esc(c.title)}</h1><div class="sub">${esc(c.dateLabel || "")}${c.place ? " \u00b7 " + esc(c.place) : ""}</div><p>${esc(c.text)}</p><button type="button" class="rm" data-act="more">Read the full chapter</button>
    <div class="snav"><button type="button" data-act="prev" ${ST.i ? "" : "disabled"}>Previous</button><button type="button" class="go" data-act="next">${ST.i < s.chapters.length - 1 ? "Next chapter" : "Finish"}</button></div>`;
  $("#story").classList.remove("open"); $("#story").scrollTop = 0; ST.t0 = performance.now(); storyBar(); shell(); window.PHONE?.story();
}
function storyBar() { // the moment's timeline: a segment and a date per chapter, and the chapters' names as badges above them, in two rows
  if (!ST) return; const s = ST.story, n = s.chapters.length, cur = ST.i, w = $("#sBar").clientWidth || 800, seg = (w + 3) / n;
  $("#sBar").innerHTML = s.chapters.map((c, k) => `<button type="button" tabindex="-1" class="sseg${k === cur ? " on" : k < cur ? " seen" : ""}" data-c="${k}" title="${esc(c.title)}">${k === cur ? "<i></i>" : ""}</button>`).join("");
  $("#sBadges").innerHTML = s.chapters.map((c, k) => `<button type="button" class="sbadge${k === cur ? " on" : k < cur ? " seen" : ""}" data-c="${k}"${k === cur ? ' aria-current="step"' : ""} title="${esc(c.title)}">${esc(c.title)}</button>`).join("");
  let last = -99; $("#sDates").innerHTML = s.chapters.map((c, k) => { const x = k * seg; if (x - last < 62 && k !== cur) return ""; last = x; return `<span class="${k === cur ? "on" : ""}" style="left:${x}px">${esc(ageParts(c.ma).join(" ").replace(" million years ago", " M").replace(" billion years ago", " bn").replace(" years ago", " yr"))}</span>`; }).join("");
  // names: this chapter first, then outwards from it, each in the first of two rows where it has room over its own segment
  const els = [...$("#sBadges").children], rows = [[], []], order = s.chapters.map((_, k) => k).sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur));
  for (const k of order) { const el = els[k], bw = el.offsetWidth, cx = k * seg + (seg - 3) / 2, l = clamp(cx - bw / 2, 0, Math.max(0, w - bw)), r = l + bw;
    const row = rows.findIndex((R) => R.every(([a, b]) => r + 6 <= a || l >= b + 6));
    if (row < 0) { el.classList.add("hid"); continue; } rows[row].push([l, r]); el.style.left = l + "px"; el.style.top = (row ? 0 : 26) + "px"; } // the nearer row is the one just above the bar
}
function storyEnd() { ST = null; delete $("#app").dataset.story; $("#sdock").hidden = true; setPlaying(false); setTimeout(() => { layout(); shell(); }, 0); shown = ""; S.ma = Math.max(S.ma, JOIN); S.dirty = true; mk.getContext("2d").clearRect(0, 0, mk.width, mk.height); }
const mk = $("#marks");
function drawPins(M) { // the chapter's fossil sites, where they sat at the time (only on the round globe)
  const x = mk.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H); if (!ST || S.t > .01) return;
  const boxes = [];
  for (const t of ST.story.chapters[ST.i].sites || []) {
    const ll = t.then || (S.ma < 1 ? t.lonlat : null); if (!ll) continue;
    const l = ll[0] * RAD, p = ll[1] * RAD, w = [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)], v = M.map((r) => r[0] * w[0] + r[1] * w[1] + r[2] * w[2]); if (v[2] < .08) continue;
    const px = G.cx + G.r * v[0], py = G.cy - G.r * v[1];
    x.fillStyle = "#e5402a"; x.strokeStyle = "#fff"; x.lineWidth = 2; x.beginPath(); x.arc(px, py, 6, 0, 7); x.fill(); x.stroke();
    x.font = '700 13px "Source Serif 4", Georgia, serif'; const tw = x.measureText(t.name).width, spots = [[px + 14, py + 4], [px - 14 - tw, py + 4], [px - tw / 2, py - 14], [px - tw / 2, py + 24]];
    const at = spots.find(([a, b]) => boxes.every((o) => a + tw < o[0] || a > o[2] || b < o[1] || b - 14 > o[3])) || spots[0]; boxes.push([at[0], at[1] - 14, at[0] + tw, at[1]]);
    x.lineWidth = 4; x.strokeStyle = "rgba(255,255,255,.92)"; x.strokeText(t.name, at[0], at[1]); x.fillStyle = "#111"; x.fillText(t.name, at[0], at[1]);
  }
}

// ---------------------------------------------------------------- one timeline in two parts
function buildTimeline() {
  const dark = (c) => { const n = parseInt(c.slice(1), 16); return (.299 * (n >> 16) + .587 * (n >> 8 & 255) + .114 * (n & 255)) < 120; }; // white names on the dark bands
  $("#stripStrata").innerHTML = leaves.map((u) => `<i style="left:${X(u.from) * 100}%;width:${Math.max(0, X(Math.max(u.to, JOIN)) - X(u.from)) * 100}%;background:${u.color}"></i>`).join("");
  $("#strata").innerHTML = leaves.map((u) => `<i title="${esc(u.name)}" data-w="${Math.max(0, X(Math.max(u.to, JOIN)) - X(u.from))}" style="left:${X(u.from) * 100}%;width:${Math.max(0, X(Math.max(u.to, JOIN)) - X(u.from)) * 100}%;background:${u.color};color:${dark(u.color) ? "#fff" : "#111"}">${esc(u.name)}</i>`).join("");
  // the turning points for life, as on the Earth history page: a diamond on the band and a name above it
  MILES = (D.milestones || []).filter((m) => m.ma > JOIN).map((m) => { const [t, id] = m.ref.split(":"); return { ...m, item: t === "e" ? D.events.find((e) => e.id === id) : D.origins.find((o) => o.id === id) }; }).filter((m) => m.item);
  $("#miles").innerHTML = MILES.map((m, i) => `<button type="button" class="mile ${m.kind}" data-m="${i}" title="${esc(m.title)}">${esc(m.label)}</button>`).join("");
  $("#mileMarks").innerHTML = MILES.map((m, i) => `<i class="${m.kind}" data-m="${i}" style="left:${X(m.ma) * 100}%"></i>`).join("");
  const bands = (named) => HERAS.map(([a, b, n, sh, col]) => `<i title="${esc(n)}"${named ? ` data-w="${HX(b) - HX(a)}" data-s="${esc(sh)}"` : ""} style="left:${HX(a) * 100}%;width:${(HX(b) - HX(a)) * 100}%;background:${col}">${named ? esc(n) : ""}</i>`).join("");
  $("#hbands").innerHTML = bands(true); $("#stripHist").innerHTML = bands(false);
}
let shownF = -1, MILES = [], nearMile = -1;
function drawTimeline(force) {
  const f = S.f, deep = 1 - f;
  if (force || Math.abs(f - shownF) > .0005) {
    shownF = f;
    $("#tlDeep").style.width = deep * 100 + "%"; $("#tlHist").style.width = f * 100 + "%";
    $("#tlDeep").classList.toggle("folded", deep < .25); $("#tlHist").classList.toggle("folded", f < .25);
    $("#capDeep").style.opacity = deep < .25 ? 0 : 1; $("#capHist").style.opacity = f < .25 ? 0 : 1;
    const w = $("#tl").clientWidth || 1000; let last = -99, h = "";
    if (deep >= .4) for (const [m, l] of [[4567, "4.57 bn"], [2500, "2.5 bn"], [1000, "1 bn"], [538.8, "539 M"], [251.902, "252 M"], [66, "66 M"], [2.58, "2.6 M"]]) { const px = X(m) * deep * w; if (px - last > 54) { last = px; h += `<span style="left:${X(m) * deep * 100}%">${l}</span>`; } }
    if (f >= .4) for (const [y, l] of [[-10000, "10,000 BCE"], [-3400, "3400 BCE"], [-1000, "1000 BCE"], [0, "1 CE"], [1000, "1000"], [1500, "1500"], [1800, "1800"], [NOW_YEAR, "Today"]]) { const px = (deep + HX(y) * f) * w; if (px - last > 62) { last = px; h += `<span style="left:${(deep + HX(y) * f) * 100}%">${l}</span>`; } }
    $("#ticks").innerHTML = h;
    for (const el of $("#strata").children) { const px = +el.dataset.w * deep * w, full = el.title; // the name where its band has room, a short form where it nearly has, else none
      el.textContent = px > full.length * 6.1 + 9 ? full : px > 36 ? full.slice(0, 4).replace(/[aeiou]$/, "") + "." : ""; }
    for (const el of $("#hbands").children) { const px = +el.dataset.w * f * w, full = el.title, sh = el.dataset.s; el.textContent = px > full.length * 6.1 + 9 ? full : px > sh.length * 6.1 + 9 ? sh : ""; }
    const box = $("#miles"), els = [...box.children], placed = [], order = MILES.map((m, i) => i).sort((a, b) => MILES[a].priority - MILES[b].priority || MILES[b].ma - MILES[a].ma);
    box.style.width = deep * 100 + "%"; $("#mileMarks").style.width = deep * 100 + "%"; box.hidden = $("#mileMarks").hidden = deep < .4;
    if (deep >= .4) { const bw = deep * w; for (const el of els) el.classList.remove("hid");
      for (const i of order) { const el = els[i], cw = el.offsetWidth, cx = X(MILES[i].ma) * bw, l = clamp(cx - cw / 2, 0, bw - cw), r = l + cw;
        if (placed.every(([a, b]) => r + 6 <= a || l >= b + 6)) { placed.push([l, r]); el.style.left = l + "px"; } else el.classList.add("hid"); } }
  }
  // the turning point the cursor is on: its name is filled, and the card says what happened
  let near = -1; if (S.mode === "deep" && !ST) { let best = .006; MILES.forEach((m, i) => { const d = Math.abs(X(m.ma) - X(S.ma)); if (d < best) { best = d; near = i; } }); }
  if (near !== nearMile) { nearMile = near; document.querySelectorAll("#miles .mile, #mileMarks i").forEach((el) => el.classList.toggle("on", +el.dataset.m === near));
    const tb = $("#turn"); tb.hidden = near < 0; if (near >= 0) { const m = MILES[near], it = m.item; tb.innerHTML = `<span>TURNING POINT \u00b7 ${esc(ageParts(m.ma).join(" "))}</span><b>${esc(m.title)}</b><p>${esc((it.text || "").split(". ").slice(0, 2).join(". ").replace(/\.?$/, "."))}</p>`; } }
  const x = S.mode === "deep" ? X(S.ma) * deep : deep + HX(S.year) * f;
  $("#cursor").style.left = $("#pill").style.left = x * 100 + "%";
  $("#pill").textContent = S.mode === "deep" ? ageParts(S.ma).join(" ").replace(" million years ago", " M").replace(" billion years ago", " bn") : yearText(S.year);
  $("#pill").style.transform = `translateX(${x < .05 ? "-10%" : x > .95 ? "-90%" : "-50%"})`;
}

// ---------------------------------------------------------------- the World history map underneath
const HIST = { ready: false, sent: null, sentAt: 0, timer: 0 };
function histInit() {
  const fr = $("#hist");
  const hook = () => { try {
    const d = fr.contentDocument; if (!d || !d.head) return;
    if (!d.getElementById("oneHide")) { const st = d.createElement("style"); st.id = "oneHide"; st.textContent = "#bar .brand,#bar .sitesw,#bar .tabs,#tabbar{visibility:hidden!important} .one-uni #dock{visibility:hidden!important} .one-globe #stage canvas{opacity:0!important;pointer-events:none!important} .one-globe #mapTools .zoom{display:none!important} @media (max-width:760px){.one-uni #sheet{display:none!important} .one-uni #bar{left:72px!important}}"; d.documentElement.classList.add("one-uni"); d.head.appendChild(st); }
  } catch (e) {} };
  fr.addEventListener("load", hook); hook();
  const poll = setInterval(() => { try { const d = fr.contentDocument, c = d.querySelector("#map"), l = d.querySelector("#loading"); if (c && c.__zoom && (!l || l.hidden || getComputedStyle(l).display === "none" || l.classList.contains("done"))) { HIST.ready = true; clearInterval(poll); hook(); layout(); restoreLate(); } } catch (e) {} }, 300);
}
const histWin = () => $("#hist").contentWindow;
function histGlobe(on) { try { histWin().document.documentElement.classList.toggle("one-globe", on); if (on) histWhole(); } catch (e) {} } // the frame's own map hidden while the globe shows it
function histWhole() { // the whole world in the frame, so the copy covers the globe: its zoom set to none, then nudged so it redraws
  try { const iw = histWin(), c = iw.document.querySelector("#map"), r = c.getBoundingClientRect(); c.__zoom = iw.d3.zoomIdentity;
    c.dispatchEvent(new iw.WheelEvent("wheel", { deltaY: 1, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true })); HT.changed = performance.now(); } catch (e) {}
}
function histFrame() { // the flat map framed for this page, on both sides of the join
  try {
    const iw = histWin(), d = iw.document, c = d.querySelector("#map"), r = c.getBoundingClientRect(); if (!r.width || !iw.d3) return;
    // after a change of look (which reloads the page): the map exactly where it was left, not this page's own framing
    let keep = null; try { keep = JSON.parse(sessionStorage.getItem("one.keep") || "null"); sessionStorage.removeItem("one.keep"); } catch (e) {}
    if (keep && keep.w === innerWidth && keep.h === innerHeight && keep.k > 0) {
      c.__zoom = iw.d3.zoomIdentity.translate(keep.x, keep.y).scale(keep.k);
      c.dispatchEvent(new iw.WheelEvent("wheel", { deltaY: .01, clientX: r.width / 2, clientY: r.height / 2, bubbles: true, cancelable: true })); HT.changed = performance.now(); return; }
    const edge = []; for (let lon = -180; lon <= 180; lon += 5) edge.push([lon, 84], [lon, -57]);
    for (let lat = -57; lat <= 84; lat += 3) edge.push([-180, lat], [180, lat]);
    const small = r.width < 600, pj = iw.d3.geoNaturalEarth1().fitExtent(r.width <= 760 ? [[4, 72], [r.width - 4, Math.max(220, r.height - 300)]] : [[small ? 4 : 10, small ? 4 : 8], [r.width - (small ? 40 : 56), r.height - (small ? 4 : 30)]], { type: "MultiPoint", coordinates: edge });
    // The framing World history itself opens on: the lived-in world (84 N to 57 S) fills the height between the bar and the timeline,
    // and North America's west coast starts just right of the card, which sits over the empty Pacific. What does not fit runs off the
    // right edge (the far Pacific), unless the window is wide enough for all of it, when it is centred in the room that is left.
    const b = iw.d3.geoPath(pj).bounds({ type: "MultiPoint", coordinates: edge });
    if (PH()) { // a phone: as World history's own phone view, the map fills the height above the sheet, centred on Europe, Africa and Asia
      const T = 64, B = r.height - 284, k0 = clamp((B - T) / (b[1][1] - b[0][1]), 1, 4), fx = pj([35, 20])[0];
      c.__zoom = iw.d3.zoomIdentity.translate(r.width / 2 - k0 * fx, (T + B) / 2 - k0 * (b[0][1] + b[1][1]) / 2).scale(k0);
      c.dispatchEvent(new iw.WheelEvent("wheel", { deltaY: .5, clientX: r.width / 2, clientY: (T + B) / 2, bubbles: true, cancelable: true })); HT.changed = performance.now(); return; }
    let card = $("#card").getBoundingClientRect(); if (S.mode === "hist") { const cr = d.querySelector("#col")?.getBoundingClientRect(); if (cr && cr.width && cr.right < r.width * .6) card = cr; }
    const T = 72, B = r.height - 20 - (S.mode === "hist" ? 86 : 124) - 8, L = card.right + 12, R = r.width - 12;
    const xa = Math.min(pj([-168.1, 65.6])[0], pj([-166.2, 60.4])[0]), xb = Math.max(pj([153.6, -28.6])[0], pj([145.8, 43.4])[0]); // Alaska's west coast; eastern Australia and Hokkaido, which stay on screen
    const k0 = Math.min((B - T) / (b[1][1] - b[0][1]), (R - L) / (xb - xa));
    let tx = L - k0 * xa; if (tx + k0 * b[1][0] < R) tx = (L + R) / 2 - k0 * (xa + b[1][0]) / 2; // room to spare: centred beside the card
    const at = [tx, (T + B) / 2 - k0 * (b[0][1] + b[1][1]) / 2];
    c.__zoom = iw.d3.zoomIdentity.translate(at[0], at[1]).scale(k0);
    c.dispatchEvent(new iw.WheelEvent("wheel", { deltaY: .5, clientX: r.width / 2, clientY: (T + B) / 2, bubbles: true, cancelable: true })); HT.changed = performance.now(); // a nudge, so it redraws there
  } catch (e) {}
}
function histCapture() { // copy the frame's map (its WebGL layer and its drawing layer) into a texture for the globe
  try {
    const iw = histWin(), d = iw.document, g = d.querySelector("#gl"), m = d.querySelector("#map"); if (!m || !m.width || !HIST.ready) return;
    const z = m.__zoom; if (!S.flat && z && (Math.abs(z.k - 1) > .02 || Math.abs(z.x) > 12 || Math.abs(z.y) > 12) && !d.documentElement.classList.contains("one-moving")) histWhole();
    const c = HT.cvs; if (c.width !== m.width || c.height !== m.height) { c.width = m.width; c.height = m.height; }
    const x = c.getContext("2d"); x.fillStyle = iw.getComputedStyle(d.documentElement).getPropertyValue("--ocean").trim() || "#fff"; x.fillRect(0, 0, c.width, c.height); if (g && g.width) x.drawImage(g, 0, 0, c.width, c.height); x.drawImage(m, 0, 0, c.width, c.height);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, HT.tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c); gl.activeTexture(gl.TEXTURE0);
    const r = m.getBoundingClientRect(), f = flatFit(); HT.aff = [f[0], f[1] - r.left, f[2] - r.top]; HT.size = [r.width, r.height]; HT.has = true; HT.at = performance.now(); S.dirty = true;
  } catch (e) {}
}
// The frame is the whole of World history: its tabs (Today, Map, Stories, About), search, profiles and story player all work. While it
// shows a plain year, this page's timeline and globe are in charge. When it shows anything else (today's story, a list, a war, a
// profile), it takes the screen as it is, with its own timeline, until it is back on a plain year.
function histWatch() {
  if (S.mode !== "hist" || !HIST.ready) return;
  let h = ""; try { h = histWin().location.hash; } catch (e) { return; }
  let own = false; if (PH()) try { const b = histWin().document.body; own = !!HIST.own || b.classList.contains("searching") || b.classList.contains("years"); } catch (e) {} // a phone: World history's own card, search or year list has the screen
  HIST.own ? ($("#app").dataset.own = "1") : delete $("#app").dataset.own;
  const m = /^#(-?\d+)$/.exec(h), app = !m || own, was = !!$("#app").dataset.app;
  if (m && performance.now() - HIST.sentAt > 700 && Math.round(S.year) !== +m[1]) { S.year = clamp(+m[1], Y0, NOW_YEAR); HIST.sent = +m[1]; HT.changed = performance.now(); }
  shell();
  if (app === was) return;
  const root = histWin().document.documentElement;
  if (app) { $("#app").dataset.app = "1"; root.classList.remove("one-uni", "one-globe"); root.style.setProperty("--dock-b", "64px"); setPlaying(false); }
  else { delete $("#app").dataset.app; root.classList.add("one-uni"); root.style.removeProperty("--dock-b"); if (!S.flat) histGlobe(true); else { delete $("#app").dataset.ready; histFrame(); FIT = flatFit(); } }
}
// Explore: back to the map on a plain year, whatever World history is showing (a story, a list, a realm's profile, About). Clicking
// its own Map tab was not enough: on a realm's profile it is already on that tab, so nothing changed and this page stayed behind it.
function histExplore() {
  const y = clamp(histNow() ?? Math.round(S.year), Y0, NOW_YEAR);
  HIST.own = false; S.year = y; HIST.sent = y; HIST.sentAt = HT.changed = performance.now();
  try { const l = histWin().location; l.replace(l.href.split("#")[0] + "#" + y); } catch (e) {} // straight away, not through the timeline's throttle
  histWatch(); // and this page takes the screen back in the same moment
}
function histYear(y) { // tell the World history map which year to show, at most a few times a second
  y = Math.round(y); if (y === HIST.sent) return;
  const go = () => { HIST.timer = 0; if (HIST.sent === Math.round(S.year)) return; HIST.sent = Math.round(S.year); HIST.sentAt = HT.changed = performance.now(); try { const l = $("#hist").contentWindow.location; l.replace(l.href.split("#")[0] + "#" + HIST.sent); } catch (e) {} }; // a full address: a bare "#year" would resolve against this page
  if (!HIST.timer) HIST.timer = setTimeout(go, performance.now() - HIST.sentAt > 140 ? 0 : 140);
}

// ---------------------------------------------------------------- crossing the join
let turn = null, flatAt = 0; // the globe's turn towards the flat map's centre (and back); when a chosen flat map may start to open
function enterHistory(year) {
  if (S.mode === "hist") { S.year = year; histYear(year); return; }
  delete $("#app").dataset.list; S.lastMa = S.ma; S.mode = "hist"; S.year = year; S.ma = JOIN; $("#app").dataset.mode = "hist"; delete $("#app").dataset.ready; shell();
  histYear(year);
  if (!S.flat) setFlat(true); else { histFrame(); FIT = flatFit(); } // history always opens as the flat map: the globe opens out at the join
  histGlobe(false);
}
function enterDeep(ma) {
  if (S.mode === "deep") { S.ma = ma; return; }
  S.lastYear = S.year; S.year = Y0; histYear(Y0); // leave the map underneath at the join, so the next crossing lands on the same coasts
  S.mode = "deep"; S.ma = ma; $("#app").dataset.mode = "deep"; delete $("#app").dataset.ready; delete $("#app").dataset.app; shown = ""; S.dirty = true;
  if (S.flat) setFlat(false); // the Earth always opens as the round globe
  try { const r = histWin().document.documentElement; r.classList.add("one-uni"); r.style.removeProperty("--dock-b"); } catch (e) {}
  shell();
  layout();
}
// what the header and the strip show: which section is on, and, while a story has the timeline, where it sits in all of time
// the year World history is showing: its address when that is a plain year or a story ending in its year, else its time bar
// (from the address: "#1492", a story ending in its year, or a profile such as "#-1250/Shang Dynasty")
function histNow() { try { const h = histWin().location.hash, m = /(?:^#|\/)(-?\d{1,5})$/.exec(h) || /^#(-?\d{1,5})\//.exec(h); if (m) return +m[1]; const tr = histWin().document.querySelector("#track"); if (tr && tr.getAttribute("aria-valuenow") != null) return +tr.getAttribute("aria-valuenow"); } catch (e) {} return null; }
function shell() {
  const app = !!$("#app").dataset.app; let h = ""; try { h = histWin().location.hash; } catch (e) {}
  const tab = ST || $("#app").dataset.list ? "stories" : S.mode === "deep" ? "explore" : !app || h === "" || /^#t\//.test(h) || /^#-?\d+(\/|$)/.test(h) || /^#p\//.test(h) ? "explore" : /^#about/.test(h) ? "about" : "stories";
  document.querySelectorAll("#tabs button, #ptabs button").forEach((b) => b.toggleAttribute("aria-current", b.dataset.tab === tab)); document.querySelectorAll("#tabs [aria-current], #ptabs [aria-current]").forEach((b) => b.setAttribute("aria-current", "page"));
  const strip = $("#strip"), on = !!ST || (S.mode === "hist" && app); strip.hidden = !on; if (!on) return;
  const earth = !!ST, y = earth ? null : histNow(); if (y != null) S.stripYear = y;
  const x = earth ? X(Math.max(S.ma, JOIN)) * .26 : S.stripYear != null ? .26 + HX(S.stripYear) * .74 : null;
  $("#stripMark").hidden = x == null; if (x != null) $("#stripMark").style.left = x * 100 + "%";
  $("#stripNow").textContent = earth ? `This moment: ${ageParts(S.ma).join(" ")}` : S.stripYear != null ? `Showing: ${yearText(S.stripYear)}` : "";
  $("#stripEarth").classList.toggle("here", earth); $("#stripHistBtn").classList.toggle("here", !earth);
}
function setFlat(on) { // the round globe or the flat map, by choice, at any time
  S.flat = on; on ? ($("#app").dataset.flat = "1") : delete $("#app").dataset.flat; $("#card").classList.remove("open");
  document.querySelectorAll("#viewSeg button").forEach((b) => b.setAttribute("aria-pressed", (b.dataset.v === "map") === on));
  syncChrome();
  if (on) histFrame(); // the map underneath takes this page's framing first; then the globe opens onto it
  FIT = flatFit(); delete $("#app").dataset.ready;
  if (on) { S.tT = 1; turn = { lon0: ((S.lon + 540) % 360) - 180, lat0: S.lat, lon1: 0, lat1: 0 }; }
  else { S.t = Math.max(S.t, S.tT); S.tT = 0; turn = { lon0: 0, lat0: 0, lon1: 20, lat1: 14 }; S.lon = 0; S.lat = 0; if (S.mode === "hist") histGlobe(true); }
}

// ---------------------------------------------------------------- the address keeps the state, so a refresh (or a shared link) comes back to the same place
// History uses World history's own addresses, so every link made before the two atlases were joined still works:
//   #1492  a year      #117/Roman%20Empire  a profile      #w/..., #e/..., #m/...  a story      #about, #empires ...  a page
// The Earth's side has its own, under "earth":
//   #earth/150  a time (million years ago)      #earth/150/flat  the same as the flat map
//   #earth/stories  its stories open            #earth/s/dinosaurs/13  a moment at its 13th chapter
// No address: history, in the year of today's event.
let RESTORE = null, savedAt = 0; // what the address asked for that has to wait for the World history map underneath
const startHash = (() => { try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return location.hash.slice(1); } })();
const EARTH_AT = /^earth(?:\/|$)/.test(startHash);
$("#hist").src = "world.html" + (EARTH_AT ? "#-10000" : location.hash); // the frame opens where the address says, or (for the Earth) waits at the join
function stateHash() {
  if (ST) return `#earth/s/${ST.story.id}/${ST.i + 1}`;
  if (S.mode === "hist") { let h = ""; try { h = histWin().location.hash; } catch (e) {} return h && h !== "#" ? h : `#${Math.round(S.year)}`; }
  if ($("#app").dataset.list) return "#earth/stories";
  return `#earth/${S.ma >= 10 ? Math.round(S.ma * 10) / 10 : +S.ma.toPrecision(3)}${S.flat ? "/flat" : ""}`;
}
function saveState(now) { // twice a second at most: browsers limit how often an address may be rewritten
  if (RESTORE || now - savedAt < 500) return; savedAt = now;
  try { const h = stateHash(); if (h !== location.hash) history.replaceState(null, "", h); if (S.mode === "deep" && !S.flat && !ST) sessionStorage.setItem("one.view", `${S.lon.toFixed(1)},${S.lat.toFixed(1)}`); } catch (e) {}
}
function restoreState() { // at the start, from the address; what needs the map underneath waits for restoreLate()
  let m;
  try { const v = (sessionStorage.getItem("one.view") || "").split(",").map(Number); if (v.length === 2 && v.every(isFinite)) { S.lon = v[0]; S.lat = clamp(v[1], -85, 85); } } catch (e) {} // the way the globe was turned
  if (!EARTH_AT) { RESTORE = { hist: true }; S.ma = JOIN; return; } // history: the frame is already loading that address
  const h = startHash.replace(/^earth\/?/, "");
  if ((m = /^s\/([\w-]+)\/(\d+)$/.exec(h))) { storyStart(m[1]); if (ST && +m[2] > 1) storyGo(+m[2] - 1); return; }
  if (h === "stories") { PH() && window.PHONE ? PHONE.stories() : listOpen(true); return; }
  if ((m = /^([\d.]+)(\/flat)?$/.exec(h))) { const v = parseFloat(m[1]); if (v >= JOIN && v <= OLDEST) S.ma = v; if (m[2]) RESTORE = { flat: true }; }
}
function restoreLate() {
  const r = RESTORE; RESTORE = null; if (!r) return;
  if (r.flat) return setFlat(true);
  // history: take the frame as it is. On a plain year (or no address: the year of today's event) this page's timeline is in charge;
  // on anything else (a story, a profile, a list) World history has the screen, as histWatch() sees from its address.
  let h = ""; try { h = histWin().location.hash; } catch (e) {}
  let home = NaN; try { home = parseInt(histWin().document.documentElement.dataset.homeYear, 10); } catch (e) {} // the year of today's event
  const m = /^#(-?\d+)$/.exec(h), y = m ? +m[1] : (!h || h === "#") && isFinite(home) ? home : histNow() ?? Y0;
  if (h && h !== "#") HIST.sent = Math.round(y); // nothing to send: the frame is already there
  enterHistory(clamp(y, Y0, NOW_YEAR));
}

// ---------------------------------------------------------------- time, play, input
function setPlaying(p) { S.playing = p; if (p && ST) ST.t0 = performance.now(); $("#sPlayIcon").setAttribute("d", p ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z"); $("#sPlay").setAttribute("aria-label", p ? "Pause" : "Play this moment");
  $("#playIcon").setAttribute("d", p ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z"); $("#play").setAttribute("aria-label", p ? "Pause" : "Play through time"); document.querySelectorAll(".pplay path").forEach((el) => el.setAttribute("d", p ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z")); if (p && S.mode === "hist" && S.year >= NOW_YEAR) { enterDeep(OLDEST); } }
let last = performance.now(), dragging = null, tlDrag = false, watchAt = 0;
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (S.playing) {
    if (ST) { const f = (now - ST.t0) / 11000, fill = $("#sBar .on i"); if (fill) fill.style.width = Math.min(100, f * 100) + "%"; // eleven seconds a chapter
      if (f >= 1) { if (ST.i < ST.story.chapters.length - 1) storyGo(ST.i + 1); else setPlaying(false); } }
    else if (S.mode === "deep") { const x = X(S.ma) + dt / 80; if (x >= 1) enterHistory(Y0); else { S.ma = atX(x); S.dirty = true; } }
    else { const x = HX(S.year) + dt / 70; if (x >= 1) { S.year = NOW_YEAR; setPlaying(false); } else S.year = atHX(x); histYear(S.year); }
  }
  if (S.t !== S.tT) { // opening out or rolling up: 1.2 seconds, the globe turning to face the map's centre as it goes
    const d = dt / 1.2; S.t = S.tT > S.t ? Math.min(S.tT, S.t + d) : Math.max(S.tT, S.t - d); S.dirty = true;
    if (turn) { const k = S.tT === 1 ? S.t : 1 - S.t, e = k * k * (3 - 2 * k); S.lon = turn.lon0 + (turn.lon1 - turn.lon0) * e; S.lat = turn.lat0 + (turn.lat1 - turn.lat0) * e; }
    if (S.t === S.tT) turn = null;
  }
  if (flatAt && now > flatAt) { flatAt = 0; if (S.flat && S.mode === "hist") { FIT = flatFit(); S.tT = 1; turn = { lon0: ((S.lon + 540) % 360) - 180, lat0: S.lat, lon1: 0, lat1: 0 }; } }
  if (S.mode === "hist" && S.flat && S.t >= 1 && HIST.ready && !$("#app").dataset.ready) { histGlobe(false); $("#app").dataset.ready = "1"; } // flat: the frame underneath takes over
  const polT = S.mode === "hist" ? 1 : 0; if (S.pol !== polT) { S.pol = polT > S.pol ? Math.min(1, S.pol + dt / .8) : Math.max(0, S.pol - dt / .5); S.dirty = true; } // borders fade onto the globe
  if (now - watchAt > 250) { watchAt = now; histWatch(); }
  if (S.mode === "hist" && !$("#app").dataset.ready && !$("#app").dataset.app && HIST.ready && now - HT.at > (now - (HT.changed || 0) < 2500 ? 160 : 1000)) histCapture();
  const fT = S.mode === "hist" ? .92 : S.ma < .1 ? .16 : .08; // the fold follows the side you are on
  if (!tlDrag && Math.abs(S.f - fT) > .0005) S.f += (fT - S.f) * Math.min(1, dt * 3);
  if (fly) { fly.t = Math.min(1, fly.t + dt / .9); const k = fly.t * fly.t * (3 - 2 * fly.t); S.lon = fly.lon0 + fly.dl * k; S.lat = fly.lat0 + fly.dp * k; S.dirty = true; if (fly.t >= 1) fly = null; }
  if (S.dirty && D) { S.dirty = false; draw(); if (S.mode === "deep" && !ST) renderCard(); }
  drawTimeline(); window.PHONE?.tick(now); saveState(now); clipCard(now);
  requestAnimationFrame(frame);
}
function wire() {
  const gr = $("#grab");
  gr.addEventListener("pointerdown", (e) => { if (S.t > .02) return; gr.setPointerCapture(e.pointerId); dragging = { x: e.clientX, y: e.clientY }; gr.classList.add("drag"); });
  gr.addEventListener("pointermove", (e) => { if (!dragging) return; const k = 57.3 / G.r; S.lon -= (e.clientX - dragging.x) * k; S.lat = clamp(S.lat + (e.clientY - dragging.y) * k, -85, 85); dragging.x = e.clientX; dragging.y = e.clientY; S.dirty = true; });
  const up = () => { dragging = null; gr.classList.remove("drag"); }; gr.addEventListener("pointerup", up); gr.addEventListener("pointercancel", up);
  const tl = $("#tl");
  const at = (e, start) => {
    const r = tl.getBoundingClientRect(), x = clamp((e.clientX - r.left) / r.width, 0, 1), deep = 1 - S.f, inDeep = x < deep;
    setPlaying(false); if (ST) storyEnd();
    if (start) tlDrag = inDeep ? "deep" : "hist";
    if (inDeep && S.mode === "hist") { tlDrag = false; return enterDeep(deep < .25 || !start ? Math.max(JOIN, .02) : Math.max(JOIN, atX(x / deep))); } // across the join: land just before it
    if (!inDeep && S.mode === "deep") { tlDrag = false; return enterHistory(S.f < .25 || !start ? Y0 : atHX((x - deep) / S.f)); }
    if (S.mode === "deep") { S.ma = Math.max(JOIN, atX(x / deep)); S.dirty = true; } else { S.year = atHX((x - deep) / S.f); histYear(S.year); }
  };
  tl.addEventListener("pointerdown", (e) => { tl.setPointerCapture(e.pointerId); at(e, true); });
  tl.addEventListener("pointermove", (e) => { if (tlDrag) at(e, false); });
  const end = () => { tlDrag = false; }; tl.addEventListener("pointerup", end); tl.addEventListener("pointercancel", end);
  tl.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0; if (!d) return; e.preventDefault(); setPlaying(false);
    if (S.mode === "deep") { const x = X(S.ma) + d * .01; if (x >= 1) enterHistory(Y0); else { S.ma = Math.max(JOIN, atX(x)); S.dirty = true; } }
    else { const x = HX(S.year) + d * .01; if (x < 0) enterDeep(.02); else { S.year = atHX(x); histYear(S.year); } }
  });
  $("#play").addEventListener("click", () => { if (ST) storyEnd(); setPlaying(!S.playing); });
  $("#miles").addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (!b) return; setPlaying(false); if (ST) storyEnd(); S.ma = MILES[+b.dataset.m].ma; S.dirty = true; const it = MILES[+b.dataset.m].item; if (it.then && !S.flat) fly = { lon0: S.lon, lat0: S.lat, dl: ((it.then[0] - S.lon + 540) % 360) - 180, dp: clamp(it.then[1], -70, 70) - S.lat, t: 0 }; });
  $("#more").addEventListener("click", () => { const open = $("#card").classList.toggle("open"); $("#more").textContent = open ? "Show less" : "Read more"; if (S.flat) { histFrame(); FIT = flatFit(); S.dirty = true; } });
  $("#mlist").addEventListener("click", (e) => { const c = e.target.closest("[data-s]"); if (c) storyStart(c.dataset.s); });
  $("#story").addEventListener("click", (e) => { const a = e.target.closest("[data-act]"); if (!a) return; if (a.dataset.act === "more") { const open = $("#story").classList.toggle("open"); a.textContent = open ? "Show less" : "Read the full chapter"; return; } if (a.dataset.act === "list") { storyEnd(); listOpen(true); } else if (a.dataset.act === "end" || (a.dataset.act === "next" && ST.i >= ST.story.chapters.length - 1)) { storyEnd(); listOpen(true); } else storyGo(ST.i + (a.dataset.act === "next" ? 1 : -1)); });
  addEventListener("error", (e) => { const t = e.target; if (t.tagName === "IMG" && t.dataset.fb && t.src !== t.dataset.fb) t.src = t.dataset.fb; }, true);
  addEventListener("keydown", (e) => { if (!$("#immerse").hidden) { if (e.key === "Escape") imClose(); else if (e.key === "ArrowLeft") imShow(IM.i - 1); else if (e.key === "ArrowRight") imShow(IM.i + 1); e.stopPropagation(); return; }
    if (e.key === "Escape") { if ($("#app").dataset.list) listOpen(false); else if (ST) storyEnd(); } });
  $("#viewSeg").addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) setFlat(b.dataset.v === "map"); });
  // A section of World history. Already in history, its tab is pressed at once and this page follows in the same moment (it used to
  // wait a third of a second, then up to a quarter more for the next look at the frame); coming from the Earth it waits for the crossing.
  const histTab = (name) => { if (ST) storyEnd(); const press = () => { try { histWin().document.querySelector(`#bar [data-tab="${name}"]`).click(); } catch (e) {} setTimeout(histWatch, 0); setTimeout(histWatch, 90); };
    if (S.mode !== "hist") { enterHistory(S.lastYear ?? Y0); setTimeout(press, 350); } else press(); };
  const markTab = (b) => document.querySelectorAll("#tabs button").forEach((x) => { x === b ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current"); }); // the pressed tab shows at once
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]"); if (!b) return; setPlaying(false); markTab(b);
    if (b.dataset.tab === "stories") { if (S.mode === "hist") histTab("stories"); else { if (ST) storyEnd(); listOpen(true); } return; } // each side's own stories
    listOpen(false); markTab(b); if (b.dataset.tab === "about") return histTab("about");
    if (ST) storyEnd(); if (S.mode === "hist" && $("#app").dataset.app) histExplore(); // Explore: back to the map and the full timeline
  });
  $("#todayBtn").addEventListener("click", () => histTab("today"));
  $("#themeBtn").addEventListener("click", () => { LOOK.toggle(); saveState(performance.now() + 1e4);
    try { const c = histWin().document.querySelector("#map"), z = c && c.__zoom; // where the history map was panned and zoomed to
      if (S.mode === "hist" && S.flat && z) sessionStorage.setItem("one.keep", JSON.stringify({ k: z.k, x: z.x, y: z.y, w: innerWidth, h: innerHeight })); } catch (e) {}
    location.reload(); }); // World history reads its colours when it starts; the address brings the page back to the same place
  $("#sPlay").addEventListener("click", () => setPlaying(!S.playing));
  $("#sOut").addEventListener("click", () => storyEnd());
  $("#sdock").addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (b) { setPlaying(false); storyGo(+b.dataset.c); } });
  $("#picOpen").addEventListener("click", () => { const u = unitAt(S.ma); imOpen(cardPics, 0, `${u.name}, ${ageParts(S.ma).join(" ")}`); });
  $("#story").addEventListener("click", (e) => { if (e.target.closest("figure") && ST) { const c = ST.story.chapters[ST.i]; imOpen(c.pics || [], 0, c.title); } });
  $("#immerse").addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b) imShow(+b.dataset.k); else if (e.target.closest("#imPrev")) imShow(IM.i - 1); else if (e.target.closest("#imNext")) imShow(IM.i + 1); else if (e.target.closest("#imClose") || e.target.id === "immerse" || e.target.classList.contains("imbg")) imClose(); });
  $("#searchBtn").addEventListener("click", () => { if (ST) storyEnd(); enterHistory(S.lastYear ?? Y0); setTimeout(() => { try { histWin().document.querySelector("#search").focus(); } catch (e) {} }, 400); });
  $("#stripEarth").addEventListener("click", () => { if (ST) return storyEnd(); enterDeep(S.lastMa > JOIN ? S.lastMa : .02); });
  $("#stripHistBtn").addEventListener("click", () => { if (ST) { storyEnd(); return enterHistory(S.lastYear ?? Y0); } histExplore(); });
  addEventListener("resize", () => { if (window.PHONE?.changed()) return location.reload(); layout(); if (S.flat) histFrame(); FIT = null; S.dirty = true; });
}
async function init() {
  glInit();
  D = await (await fetch("data/earth-history.json" + VQ)).json();
  for (const u of D.units) byUnit[u.id] = u;
  const hasKids = new Set(D.units.map((u) => u.parent));
  leaves = D.units.filter((u) => !hasKids.has(u.id)).sort((a, b) => b.from - a.from);
  buildTimeline(); momentList(); layout(); wire(); window.PHONE?.init(); restoreState(); histInit(); renderCard();
  requestAnimationFrame(frame);
  document.fonts?.ready.then(() => syncChrome()); // the brand is wider once its font is in
}
init().catch((e) => { console.error(e); document.body.insertAdjacentHTML("beforeend", '<p style="position:fixed;left:24px;bottom:130px;z-index:9">The prototype could not start. See the console.</p>'); });
