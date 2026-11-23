/* Earth history: a globe of the ancient Earth and a rock-column timeline. Data: ../data/earth-history.json (tools/prehistory.py),
   maps: ../data/paleo/<Ma>.webp (tools/paleo.py, then tools/paleo_webp.py). Ages are in millions of years ago (Ma) throughout. */
"use strict";
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const RAD = Math.PI / 180;
const OLDEST = 4567, MAPPED = 540; // the Earth forms; the oldest map
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
// light (the atlas's own theme, the default) or dark (a planet seen from space): from the address, else this browser's last choice.
// Set here rather than in an inline script, which the site's security policy does not allow.
let LIGHT = (() => { let v = new URLSearchParams(location.search).get("view"); try { v = v || localStorage.getItem("deepView"); } catch (e) {} return v !== "space"; })();
document.body.classList.toggle("light", LIGHT);
// the release, stamped on the page by tools/deploy.sh: data files are cached for a year, so every request names it
const REL = document.querySelector('meta[name="data-version"]')?.content, VQ = REL ? "?v=" + REL : "";
const ROOT = "../";

// ---------------------------------------------------------------- the time scale
// Equal time is not equal width: the last 540 million years, where there is a map, get most of the bar.
const STOPS = [[4567, 0], [4031, .035], [2500, .085], [1000, .14], [538.8, .21], [251.902, .47], [66, .72], [23.04, .84], [2.58, .93], [0.0117, .985], [0, 1]];
function X(ma) {
  if (ma >= STOPS[0][0]) return 0;
  for (let i = 1; i < STOPS.length; i++) if (ma >= STOPS[i][0]) { const [a, xa] = STOPS[i - 1], [b, xb] = STOPS[i]; return xa + (a - ma) / (a - b) * (xb - xa); }
  return 1;
}
function atX(x) {
  x = clamp(x, 0, 1);
  for (let i = 1; i < STOPS.length; i++) if (x <= STOPS[i][1]) { const [a, xa] = STOPS[i - 1], [b, xb] = STOPS[i]; return a - (x - xa) / (xb - xa) * (a - b); }
  return 0;
}
const num = (v, d = 0) => v.toLocaleString("en-GB", { maximumFractionDigits: d, minimumFractionDigits: 0 });
function ageParts(ma) {
  if (ma >= 1000) return [num(ma / 1000, 2), "billion years ago"];
  if (ma >= 10) return [num(ma, 0), "million years ago"];
  if (ma >= 1) return [num(ma, 1), "million years ago"];
  const y = ma * 1e6;
  if (y < 50) return ["Today", ""];
  const r = y >= 100000 ? Math.round(y / 10000) * 10000 : y >= 10000 ? Math.round(y / 1000) * 1000 : Math.round(y / 100) * 100;
  return [num(r), "years ago"];
}
const ageText = (ma) => ageParts(ma).join(" ").trim();

// ---------------------------------------------------------------- state
const S = { ma: OLDEST, lon: 20, lat: 12, zoom: 1, playing: false, tab: "world", curve: "temperature", sel: null, life: false, hover: null, dirty: true };
let D = null, leaves = [], tops = [], byId = {}, miles = [];
const GROUPS = [["microbes", "Microbes", "#b89cff", "#7a5cd6"], ["algae-plants", "Algae and plants", "#7fd67a", "#3f9a3a"], ["fungi", "Fungi", "#d9b57a", "#a67c3a"], ["invertebrates", "Animals without backbones", "#ffa24d", "#e07a1f"],
  ["fish", "Fish", "#5cc8e8", "#1f95bd"], ["amphibians", "Amphibians", "#4fd1b0", "#169a7c"], ["reptiles", "Reptiles", "#d8d85a", "#9a9a1e"], ["dinosaurs", "Dinosaurs", "#ff7a6b", "#d9412f"], ["birds", "Birds", "#8fb8ff", "#3f6fd9"],
  ["mammals", "Mammals", "#ff9ecb", "#d6478f"], ["primates", "Primates", "#e58cff", "#a640c9"], ["humans", "Humans", "#f4efe6", "#111111"]]; // id, name, colour on dark, colour on light
const gcol = (id) => { const g = GROUPS.find((x) => x[0] === id); return g ? g[LIGHT ? 3 : 2] : "#888"; };
let INK, PAPER, HOT;
function inks() { INK = LIGHT ? "#111111" : "#f4efe6"; PAPER = LIGHT ? "#ffffff" : "#05070d"; HOT = LIGHT ? "#e5402a" : "#ff6a4d"; }
inks();
const CURVES = [["temperature", "Temperature"], ["co2", "Carbon dioxide"], ["oxygen", "Oxygen"], ["sea-level", "Sea level"], ["marine-genera", "Sea life"], ["day-length", "Day length"]];

// ---------------------------------------------------------------- the globe (WebGL: one quad, the sphere is traced per pixel)
const cv = $("#globe"), mk = $("#marks"), ctx = mk.getContext("2d");
const gl = cv.getContext("webgl", { antialias: false, alpha: false }) || cv.getContext("experimental-webgl");
const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision highp float;
uniform vec2 uC; uniform float uR; uniform mat3 uM; uniform sampler2D uA, uB; uniform float uMix; uniform vec2 uTexel;
uniform float uLandMax, uSeaMax, uVeg, uReal, uHeat, uIce, uSeed, uLight, uTpp; uniform vec3 uW, uSun, uAtm, uBg;
float hash(vec3 p){ p=fract(p*.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*noise(p); p=p*2.03+vec3(7.1,3.3,5.7); a*=.5; } return s; }
float dec(float v){ float x=v*255.; return x>127.5 ? pow(max(x-128.,0.)/127.,2.)*uLandMax+step(128.,x)*.5 : -pow((127.-min(x,127.))/127.,2.)*uSeaMax; }
float elev(vec2 uv){ return mix(dec(texture2D(uA,uv).r), dec(texture2D(uB,uv).r), uMix); }
vec3 seaCol(float d){ vec3 c=mix(vec3(.42,.76,.82),vec3(.17,.50,.72),smoothstep(0.,220.,d)); c=mix(c,vec3(.05,.22,.46),smoothstep(200.,3200.,d)); return mix(c,vec3(.025,.10,.27),smoothstep(3200.,6200.,d)); }
vec3 landCol(float h){
  vec3 bare=mix(vec3(.74,.62,.47),vec3(.62,.47,.35),smoothstep(0.,1300.,h)); bare=mix(bare,vec3(.47,.39,.33),smoothstep(1300.,3600.,h)); bare=mix(bare,vec3(.90,.89,.87),smoothstep(3800.,5600.,h));
  vec3 veg=mix(vec3(.30,.47,.25),vec3(.50,.56,.31),smoothstep(0.,900.,h));
  return mix(bare,veg,uVeg*(1.-smoothstep(700.,2600.,h))); }
// the atlas's light theme: pale water, grey land with a hint of green once plants have spread
vec3 seaL(float d){ vec3 c=mix(vec3(.74,.85,.93),vec3(.88,.93,.97),smoothstep(120.,1500.,d)); return mix(c,vec3(.95,.97,.985),smoothstep(1500.,5200.,d)); }
vec3 landL(float h){
  vec3 c=mix(vec3(.875,.865,.825),vec3(.80,.78,.73),smoothstep(0.,1300.,h)); c=mix(c,vec3(.69,.67,.61),smoothstep(1300.,3200.,h)); c=mix(c,vec3(.55,.53,.47),smoothstep(3200.,5400.,h));
  return mix(c,vec3(.78,.84,.71),uVeg*.6*(1.-smoothstep(700.,2600.,h))); }
void main(){
  vec2 p=(gl_FragCoord.xy-uC)/uR; float r2=dot(p,p); vec3 col;
  float st=hash(vec3(floor(gl_FragCoord.xy/2.),1.)); vec3 sky=vec3(.016,.024,.047)+vec3(.9,.92,1.)*smoothstep(.9972,1.,st)*(.35+.65*hash(vec3(floor(gl_FragCoord.xy/2.),7.)));
  if(uLight>.5) sky=uBg;
  if(r2<1.){
    float z=sqrt(1.-r2); vec3 nv=vec3(p,z); vec3 n=nv*uM; vec3 L=uSun*uM;
    float lat=asin(clamp(n.y,-1.,1.)); float lon=atan(n.x,n.z); vec2 uv=vec2(lon/6.2831853+.5,.5-lat/3.14159265);
    float base=dot(n,L); float relief=0.; float glow=0.; float wet=0.;
    vec3 real=vec3(0.);
    if(uReal>.001){
      float e=elev(uv); float dx=uTexel.x/max(cos(lat),.1);
      float ex=elev(uv+vec2(dx,0.))-elev(uv-vec2(dx,0.)); float ey=elev(uv-vec2(0.,uTexel.y))-elev(uv+vec2(0.,uTexel.y));
      vec3 east=normalize(vec3(n.z,0.,-n.x)); vec3 north=cross(n,east); float k=(e>0.?46.:13.)/(uTexel.y*40030000.);
      vec3 nn=normalize(n-(east*ex+north*ey)*k); relief=(dot(nn,L)-base)*uReal;
      real=e>0.?landCol(e):seaCol(-e); wet=e>0.?0.:1.;
      if(uLight>.5){
        real=e>0.?landL(e):seaL(-e);
        float u=lon*1.9098593, w2=lat*1.9098593, lw=1.9098593/uR; // lines every 30 degrees, on open sea
        float gd=min(abs(u-floor(u+.5))*max(cos(lat),.05),abs(w2-floor(w2+.5)));
        real=mix(real,vec3(.80,.83,.85),(1.-smoothstep(lw*.6,lw*1.5,gd))*step(200.,-e)*.9);
        float dpx=abs(e)/max(length(vec2(ex,ey))*.5,.5)/uTpp; // how many screen pixels from the shore
        real=mix(real,vec3(.47,.46,.41),(1.-smoothstep(.5,1.3,dpx))*.8);
      }
    }
    vec3 art=vec3(0.); float artWet=0.;
    if(uReal<.999){
      vec3 q=n+vec3(uSeed,uSeed*.37,-uSeed*.61);
      if(uW.x>.001){ float f=fbm(q*3.2); float cr=1.-smoothstep(0.,.05,abs(fbm(q*5.5+3.)-.48)); float m=smoothstep(.92-.62*uHeat,1.08-.50*uHeat,f*.9+cr*.45);
        vec3 crust=mix(vec3(.075,.052,.05),vec3(.21,.14,.11),fbm(q*13.)); vec3 lava=mix(vec3(.78,.11,.02),vec3(1.,.46,.07),smoothstep(.25,1.,m));
        art+=uW.x*mix(crust,lava,m); glow+=uW.x*m; }
      if(uW.y>.001){ float f=fbm(q*2.7+11.); float ld=smoothstep(.640,.660,f); vec3 sea=mix(vec3(.04,.24,.30),vec3(.11,.47,.45),smoothstep(.3,.7,fbm(q*5.+2.)));
        art+=uW.y*mix(sea,mix(vec3(.24,.19,.16),vec3(.38,.29,.22),fbm(q*15.)),ld); artWet+=uW.y*(1.-ld); }
      if(uW.z>.001){ float f=fbm(q*1.9+23.); float ld=smoothstep(.555,.575,f); vec3 sea=mix(vec3(.03,.13,.36),vec3(.11,.40,.63),smoothstep(.30,.55,f));
        vec3 rock=mix(vec3(.58,.38,.25),vec3(.40,.29,.23),fbm(q*9.)); vec3 c=mix(sea,rock,ld);
        float ic=smoothstep(0.,.06,abs(lat)-mix(1.75,-.12,uIce)+(fbm(q*7.)-.5)*.34);
        vec3 icec=mix(vec3(.62,.75,.87),vec3(.97,.98,1.),smoothstep(.3,.68,fbm(q*6.+5.)))-ld*.07-(1.-smoothstep(0.,.014,abs(fbm(q*9.+1.)-.49)))*.20; c=mix(c,icec,ic); art+=uW.z*c; artWet+=uW.z*(1.-ld)*(1.-ic); }
    }
    col=mix(art,real,uReal); wet=mix(artWet,wet,uReal);
    if(uLight>.5){ // flat, even light with relief shading and a slightly darker rim: a printed globe, not a planet in space
      float litL=(.89+.11*z)*(1.+relief*.9); col=col*mix(litL,1.,glow*.7);
      col=mix(vec3(.62,.62,.60),col,smoothstep(0.,.007,1.-sqrt(r2)));
    } else {
    float day=smoothstep(-.28,.42,base); float lit=mix(.13,1.,day)*(1.+relief*1.25);
    col=col*mix(lit,.72+.28*lit,glow);
    vec3 Hv=normalize(uSun+vec3(0.,0.,1.)); col+=wet*day*pow(max(dot(nv,Hv),0.),70.)*vec3(.55,.60,.62)*.55;
    float fr=pow(1.-z,2.6); col=mix(col,uAtm*mix(.25,1.,day),fr*.62);
    col=mix(sky+uAtm*.5,col,smoothstep(0.,.012,1.-sqrt(r2)));
    }
  } else {
    float d=sqrt(r2)-1.; float side=.55+.45*dot(normalize(p),normalize(uSun.xy)); col=sky+uAtm*exp(-d*30.)*.62*side+uAtm*exp(-d*6.)*.07;
    if(uLight>.5) col=uBg*(1.-.10*exp(-d*24.)); // a soft shadow round the globe
  }
  gl_FragColor=vec4(uLight>.5?col:pow(col,vec3(.92)),1.);
}`;
let U = {};
function glInit() {
  const mkS = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, mkS(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, mkS(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  for (const n of ["uC", "uR", "uM", "uA", "uB", "uMix", "uTexel", "uLandMax", "uSeaMax", "uVeg", "uReal", "uHeat", "uIce", "uSeed", "uW", "uSun", "uAtm", "uLight", "uTpp", "uBg"]) U[n] = gl.getUniformLocation(pr, n);
  gl.uniform1i(U.uA, 0); gl.uniform1i(U.uB, 1);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  blank = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, blank); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([60]));
}
let blank = null;
const tex = new Map(); // Ma -> {t, ready}
function want(ma) {
  let o = tex.get(ma); if (o) return o;
  o = { ready: false, ma }; tex.set(ma, o);
  fetch(`${ROOT}data/paleo/${ma}.webp${VQ}`).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then((b) => createImageBitmap(b, { colorSpaceConversion: "none", premultiplyAlpha: "none" }))
    .then((bmp) => {
      o.t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, o.t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, bmp); bmp.close && bmp.close();
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      o.ready = true; S.dirty = true; if (D) $("#loading").classList.add("done");
      if (tex.size > 30) { const far = [...tex.values()].filter((x) => x.ready).sort((a, b) => Math.abs(b.ma - S.ma) - Math.abs(a.ma - S.ma))[0]; if (far && far !== o) { gl.deleteTexture(far.t); tex.delete(far.ma); } }
    }).catch(() => { tex.delete(ma); });
  return o;
}
let lastMa = OLDEST;
function pair(ma) { // the two maps either side of this time, or the nearest one that has arrived
  const m = clamp(ma, 0, MAPPED), a = Math.floor(m / 5) * 5, b = Math.min(a + 5, MAPPED), A = want(a), B = want(b);
  if (A.ready && B.ready) { const dir = ma < lastMa ? -5 : 5; for (const k of [1, 2]) { const n = a + dir * k; if (n >= 0 && n <= MAPPED) want(n); } return [A.t, B.t, (m - a) / 5]; }
  let best = null; for (const o of tex.values()) if (o.ready && (!best || Math.abs(o.ma - m) < Math.abs(best.ma - m))) best = o;
  return best ? [best.t, best.t, 0] : null;
}

// the early Earth, for which no map exists: which impression to draw and how
function early(ma) {
  const sm = (a, b, v) => clamp((v - a) / (b - a), 0, 1);
  const h = sm(3980, 4080, ma), p = 1 - sm(2440, 2560, ma);
  const snow = (a, b) => sm(b - 6, b + 4, ma) * (1 - sm(a - 4, a + 6, ma)); // from a (older) to b (younger)
  return { w: [h, (1 - h) * (1 - p), p], heat: .12 + .88 * Math.pow(sm(4031, 4567, ma), 1.6), ice: Math.max(snow(717, 660), snow(650, 635), .5 * snow(2420, 2250)), seed: ma * .0011,
    atm: h > .5 ? [.95, .32, .10] : p < .5 ? [.93, .58, .30] : [.42, .64, 1] };
}
function vegAt(ma) { return clamp((470 - ma) / 130, 0, 1); } // land plants from about 470 Ma, widespread forests by about 340 Ma

let W = 0, H = 0, dpr = 1, rdpr = 1, G = { cx: 0, cy: 0, r: 100 }, Gt = null, M = null;
function glSize(r) { rdpr = r; cv.width = Math.round(W * r); cv.height = Math.round(H * r); gl.viewport(0, 0, cv.width, cv.height); }
function layout() {
  dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  mk.width = Math.round(W * dpr); mk.height = Math.round(H * dpr); glSize(dpr);
  const wide = W > 980, phone = W <= 760, dock = parseFloat(getComputedStyle($("#app")).getPropertyValue("--dock-h")) || 148, lifeH = S.life ? Math.min(H * (phone ? .62 : .46), phone ? 9999 : 430) : 0;
  const top = LIGHT ? 84 : 62, bottom = H - dock - lifeH - (LIGHT ? 14 : 8), left = wide ? (W > 1180 ? 372 : 330) + 24 : 0, right = wide ? (W > 1180 ? 264 : 240) + 24 : 0;
  const cardTop = phone && !S.life ? $("#now").getBoundingClientRect().top : 0; // phones: the globe sits in the space above the card
  const availH = phone && !S.life && cardTop > top + 120 ? cardTop - 10 - top : bottom - top - (phone && !S.life ? H * .30 : 0), availW = W - left - right - 32;
  const r = Math.max(60, Math.min(availH, Math.max(availW, wide ? 420 : 0)) / 2 * .97);
  Gt = { cx: left + (W - left - right) / 2, cy: top + availH / 2, r };
  if (!G.set) { G = { ...Gt, set: true }; }
  S.dirty = true; lifeW = 0; drawTrackStatics(); if (S.life && D) lifeTick();
}
function matrix() { // world -> view, for a globe centred on S.lon, S.lat
  const a = -S.lon * RAD, b = S.lat * RAD, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  return [[ca, 0, sa], [sa * sb, cb, -ca * sb], [-sa * cb, sb, ca * cb]];
}
function project(lon, lat) {
  const l = lon * RAD, p = lat * RAD, w = [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
  const v = M.map((r) => r[0] * w[0] + r[1] * w[1] + r[2] * w[2]), R = G.r * S.zoom;
  return v[2] > .08 ? [G.cx + R * v[0], G.cy - R * v[1], v[2]] : null;
}
function draw() {
  M = matrix(); const R = G.r * S.zoom, real = clamp((560 - S.ma) / 20, 0, 1), e = early(S.ma);
  let pr = real > 0 ? pair(S.ma) : null;
  gl.uniform2f(U.uC, G.cx * rdpr, (H - G.cy) * rdpr); gl.uniform1f(U.uR, R * rdpr);
  gl.uniformMatrix3fv(U.uM, false, new Float32Array([M[0][0], M[1][0], M[2][0], M[0][1], M[1][1], M[2][1], M[0][2], M[1][2], M[2][2]]));
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, pr ? pr[0] : blank); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, pr ? pr[1] : blank);
  gl.uniform1f(U.uMix, pr ? pr[2] : 0); gl.uniform2f(U.uTexel, 1 / D.maps.width, 1 / D.maps.height);
  gl.uniform1f(U.uLandMax, D.maps.landMax); gl.uniform1f(U.uSeaMax, D.maps.seaMax); gl.uniform1f(U.uVeg, vegAt(S.ma));
  gl.uniform1f(U.uLight, LIGHT ? 1 : 0); gl.uniform3f(U.uBg, 1, 1, 1); gl.uniform1f(U.uTpp, D.maps.width / (2 * Math.PI) / (R * rdpr));
  gl.uniform1f(U.uReal, pr ? real : 0); gl.uniform1f(U.uHeat, e.heat); gl.uniform1f(U.uIce, e.ice); gl.uniform1f(U.uSeed, e.seed); gl.uniform3fv(U.uW, e.w);
  const s = [-.46, .36, .81], sl = Math.hypot(...s); gl.uniform3f(U.uSun, s[0] / sl, s[1] / sl, s[2] / sl);
  const atm = real >= 1 ? [.42, .64, 1] : e.atm.map((v, i) => v + ([.42, .64, 1][i] - v) * real); gl.uniform3fv(U.uAtm, atm);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  drawMarks();
}

// ---------------------------------------------------------------- places on the globe: events and oldest fossils, where they sat at their own time
let pins = [];
const windowFor = (ma) => clamp(.03 * ma + 1.2, 1.2, 9); // how close in time a place must be to show (plates drift, so not for long)
function drawMarks() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); pins = [];
  if (ST) return drawStory();
  if (S.ma > MAPPED + 20) return;
  const w = windowFor(S.ma), list = [];
  for (const e of D.events) if (e.then && (Math.abs(e.ma - S.ma) <= w || S.sel?.item === e)) list.push({ item: e, type: "event", ma: e.ma });
  for (const o of D.origins) if (o.then && (Math.abs(o.fossilMa - S.ma) <= w || S.sel?.item === o)) list.push({ item: o, type: "origin", ma: o.fossilMa });
  for (const p of list) {
    const xy = project(p.item.then[0], p.item.then[1]); if (!xy) continue;
    const on = S.sel?.item === p.item, hov = S.hover === p.item, a = on ? 1 : clamp(1.15 - Math.abs(p.ma - S.ma) / w, .18, 1) * (.45 + .55 * xy[2]);
    p.x = xy[0]; p.y = xy[1]; pins.push(p);
    ctx.globalAlpha = a; ctx.lineWidth = 2; ctx.strokeStyle = PAPER;
    const col = p.type === "origin" ? gcol(p.item.group) : p.item.kind === "extinction" ? HOT : INK;
    ctx.fillStyle = col; ctx.beginPath();
    if (p.type === "origin") { const s = on || hov ? 7 : 5; ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x + s, p.y); ctx.lineTo(p.x, p.y + s); ctx.lineTo(p.x - s, p.y); ctx.closePath(); }
    else ctx.arc(p.x, p.y, on || hov ? 6.5 : 4.5, 0, 7);
    ctx.fill(); ctx.stroke();
    if (on) { ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, 7); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke();
      const t = p.type === "origin" ? "Oldest " + p.item.name.toLowerCase() : p.item.title; ctx.font = '700 13px "Source Serif 4", Georgia, serif'; ctx.lineWidth = 4; ctx.strokeStyle = LIGHT ? "rgba(255,255,255,.92)" : "rgba(4,6,12,.85)"; ctx.strokeText(t, p.x + 18, p.y + 4); ctx.fillStyle = INK; ctx.fillText(t, p.x + 18, p.y + 4); }
  }
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------- reading the data
function unitAt(ma) { return leaves.find((u) => ma <= u.from && ma > u.to) || (ma <= 0 ? leaves[leaves.length - 1] : leaves[0]); }
function chain(u) { const out = []; for (let p = byId[u.parent]; p; p = byId[p.parent]) out.push(p); return out; }
function sample(id, ma) { // a curve's value at this time: a number, a [low, high] range, or null where the record does not reach
  const c = D.curves.find((x) => x.id === id); if (!c) return null; const P = c.points;
  const end = P[P.length - 1]; if (ma < end[0] && end[0] <= .1) return end.length > 2 ? [end[1], end[2]] : end[1]; // a record that ends just short of today holds to today
  if (ma > P[0][0] || ma < end[0]) return null;
  for (let i = 1; i < P.length; i++) if (ma >= P[i][0]) { const a = P[i - 1], b = P[i], f = a[0] === b[0] ? 0 : (a[0] - ma) / (a[0] - b[0]); return a.length > 2 ? [a[1] + f * (b[1] - a[1]), a[2] + f * (b[2] - a[2])] : a[1] + f * (b[1] - a[1]); }
  return null;
}
const sig = (v) => v >= 1000 ? num(Math.round(v / 10) * 10) : v >= 100 ? num(Math.round(v / 5) * 5) : v >= 10 ? num(v, 0) : num(v, 1);
function gauges(ma) {
  const t = sample("temperature", ma), c = sample("co2", ma), o = sample("oxygen", ma), op = o == null ? sample("oxygen-precambrian", ma) : null, s = sample("sea-level", ma), d = sample("day-length", ma), g = sample("marine-genera", ma);
  const cell = (k, v, u) => v == null ? "" : `<div><dt>${k}</dt><dd>${v}${u ? `<small>${u}</small>` : ""}</dd></div>`;
  const pct = (v) => v < .001 ? "almost none" : v < .1 ? num(v, 3) : v < 1 ? num(v, 2) : num(v, 0);
  const pre = ma < .0002; // the records end before industry: say so at "today", when carbon dioxide has since passed 420 ppm
  const h = cell(pre ? "Temp. before industry" : "Temperature", t == null ? null : num(t, 0), "°C") + cell(pre ? "CO₂ before industry" : "CO₂", c == null ? null : sig(c), "ppm") +
    cell("Oxygen", o != null ? num(o, 0) : op ? (op[1] < .001 ? "almost none" : pct(op[0]) + " to " + pct(op[1])) : null, o != null || (op && op[1] >= .001) ? "%" : "") +
    cell("Sea level", s == null ? null : (s > 0 ? "+" : "") + num(Math.round(s / 5) * 5), "m") + cell("Day", d == null ? null : num(d, 1), "h") + cell("Sea life", g == null ? null : sig(g), "genera");
  return h || `<div class="none">No measured readings reach back this far.</div>`;
}
function trust(ma) {
  if (ma > 1800) return ["art", "<b>Artist's impression.</b> No map of the Earth this old exists. The shapes of land and sea shown here are not real."];
  if (ma > MAPPED) return ["art", "<b>Artist's impression.</b> Only rough outlines of the continents are known for this time, and they are not drawn here yet. The shapes shown are not real."];
  if (ma > 300) return ["", "<b>Rough map.</b> Published reconstructions of this time differ by 600 to 1,600 km, and by more in East Asia."];
  if (ma > 100) return ["", "<b>Good map.</b> The layout of the continents is well supported. How far east or west they sat is uncertain."];
  return ["", "<b>Well-known map.</b> Published reconstructions agree on the layout of the continents to within a few hundred kilometres."];
}

// ---------------------------------------------------------------- the panels
let shownUnit = null, shownCurve = null, shownGauges = null, shownTrust = null, trackW = 800, milesW = 1;
function renderNow() {
  const [n, u] = ageParts(S.ma); $("#ageNum").textContent = n; $("#ageUnit").textContent = u;
  const unit = unitAt(S.ma);
  const gh = gauges(S.ma); if (gh !== shownGauges) { shownGauges = gh; $("#gauges").innerHTML = gh; }
  const [cls, txt] = trust(S.ma); if (txt !== shownTrust) { shownTrust = txt; const tr = $("#trust"); tr.className = "trust " + cls; tr.innerHTML = txt.replace(/^<b>([^<]+?)\.?<\/b>\s*(.*)$/, "<b>$1</b><span>$2</span>"); }
  const cl = $("#cursor"), x = X(S.ma); cl.style.left = x * 100 + "%"; cl.classList.toggle("flip", x > 1 - 175 / Math.max(200, trackW)); $("#cursorLabel").textContent = ageText(S.ma);
  $("#track").setAttribute("aria-valuenow", Math.round(S.ma)); $("#track").setAttribute("aria-valuetext", ageText(S.ma) + ", " + unit.name);
  renderCurveNow(); lifeTick(); mileTick(); imText(); nudgeTick();
  if (unit !== shownUnit) {
    shownUnit = unit; document.documentElement.style.setProperty("--unit", unit.color);
    $("#unitName").textContent = unit.name;
    $("#unitLine").textContent = [unit.rank, ...chain(unit).map((p) => p.name + " " + p.rank)].join(", ").replace(/^./, (c) => c.toUpperCase()) + `. ${rangeText(unit).replace(/^./, (c) => c.toUpperCase())}.`;
    $("#tagline").textContent = unit.tagline || "";
    document.querySelectorAll("#rowB span").forEach((el) => el.classList.toggle("cur", el.dataset.id === unit.id));
    renderTab(); if (!ST) { pics = picsFor(unit); picI = 0; renderPic(); if (IM.open) { IM.list = pics; imShow(0); } }
  }
  renderAround();
}
const rangeText = (u) => { const cls = (v) => v >= 1000 ? 2 : v >= 1 ? 1 : 0, f = (v, bare) => v >= 1000 ? num(v / 1000, 2) + (bare ? "" : " billion") : v >= 1 ? num(v, v < 10 ? 2 : 0) + (bare ? "" : " million") : num(Math.round(v * 1e6 / 100) * 100);
  return u.to === 0 ? `${f(u.from)} years ago to today` : `${f(u.from, cls(u.from) === cls(u.to))} to ${f(u.to)} years ago`; };
function renderTab() { // the whole account of this time: the world, life, climate, then what changed, with dates to jump to
  const u = shownUnit, b = $("#tabBody"); if (!u) return;
  const sec = (title, text) => text ? `<h3>${title}</h3><p>${emph(text)}</p>` : "";
  const ch = u.changes?.length ? u.changes : [];
  b.innerHTML = sec("The world", u.world) + sec("Life", u.life) + sec("Climate", u.climate) +
    (ch.length ? `<h3>What changed</h3><ul class="mlist">${ch.map((c) => `<li><button type="button" class="mrow" data-ma="${c.ma}"><span class="my">${esc(ageShort(c.ma))}</span><span class="mt"><b>${esc(c.title)}</b>${emph(c.text)}</span></button></li>`).join("")}</ul>` : "") +
    (u.evidenceNote ? `<p class="how">How we know: ${esc(u.evidenceNote)}</p>` : "");
  b.scrollTop = 0;
}
// Highlight what a reader scans for: dates and amounts, and the names of places, creatures and continents.
const HL_NUM = /\b(?:(?:about|around|c\.|over|nearly|almost|some) )?\d[\d,.]*(?:\s?(?:to|and|or|–|-)\s?\d[\d,.]*)?(?:\s(?:billion|million|thousand))?(?:\s(?:years?(?: ago| old| long| later| earlier)?|°C|degrees|per ?cent|%|metres|kilometres|km|centimetres|cm|ppm|tonnes|kg|species|genera))|\b\d+(?:\.\d+)?\s?%/g;
const HL_NAME = /(?<=[a-z,;:)] )(?!The |This |These |That |Its |In |On |At |By |For |From |When |While |Then |But |And |So |Earth\b|Moon\b|Sun\b)([A-Z][a-zé]{2,}(?:[ -](?:[A-Z][a-zé]+|de|of|la))*)/g;
function emph(text) {
  return esc(text).replace(HL_NUM, (m) => `<b class="hn">${m}</b>`).replace(HL_NAME, (m) => `<strong class="hw">${m}</strong>`);
}
const ageShort = (ma) => ma >= 1000 ? num(ma / 1000, 2) + " bn" : ma >= 1 ? num(ma, ma < 10 ? 1 : 0) + " M" : num(Math.round(ma * 1e6 / 100) * 100) + " yr";
// pictures of this time: the unit's own, else its parents'; life scenes first
let pics = [], picI = 0;
function picsFor(u) {
  const ids = [u.id, ...chain(u).map((p) => p.id)], rank = { scene: 0, landscape: 1, reconstruction: 2, rock: 3, fossil: 4 };
  const out = []; // the unit's own pictures first, then its parents' until there are enough for a slideshow
  for (const id of ids) { if (out.length >= 6) break; out.push(...D.images.filter((i) => i.unit === id).sort((a, b) => (b.quality | 0) - (a.quality | 0) || rank[a.type] - rank[b.type])); }
  return out;
}
// a Commons thumbnail at another width. Wikimedia serves only these widths, and none wider than the original file
const STD = [120, 250, 330, 500, 960, 1280, 1920];
function thumb(url, w, ow) {
  if (!/\/\d+px-/.test(url)) return url;
  let s = STD.find((x) => x >= w) || 1920;
  if (ow) { const fit = STD.filter((x) => x <= ow); if (!fit.length) return url; if (s > ow) s = fit[fit.length - 1]; }
  return url.replace(/\/\d+px-/, `/${s}px-`);
}
const fallback = (q) => `data-fb="${esc(q.image)}"`; // if a size is refused, the listed (checked) one; see the error listener in wire()
addEventListener("error", (e) => { const t = e.target; if (t.tagName === "IMG" && t.dataset.fb && t.src !== t.dataset.fb) t.src = t.dataset.fb; }, true);
const FIT = new Set(["fossil", "reconstruction", "rock"]); // shown whole on a blurred backdrop rather than cropped to fill the screen
function renderPic() {
  const f = $("#pic"); f.hidden = !pics.length; if (!pics.length) return;
  const p = pics[picI]; $("#picImg").onerror = () => { $("#picImg").onerror = null; $("#picImg").src = p.image; }; $("#picImg").src = thumb(p.image, 960, p.width); $("#picImg").alt = p.caption; $("#picLink").href = p.page;
  $("#picCap").textContent = p.caption; $("#picLink").textContent = `${p.credit}, ${p.license}, Wikimedia Commons`; $("#picN").textContent = `${picI + 1} of ${pics.length}`;
  document.querySelector(".picnav").hidden = pics.length < 2;
  const n = 5, start = clamp(picI - 2, 0, Math.max(0, pics.length - n));
  $("#picThumbs").innerHTML = pics.length < 2 ? "" : pics.slice(start, start + n).map((q, k) => `<button type="button" data-p="${start + k}" class="${start + k === picI ? "on" : ""}" aria-label="${esc(q.subject || q.caption)}"><img src="${esc(thumb(q.image, 120, q.width))}" ${fallback(q)} alt="" loading="lazy"></button>`).join("") + (pics.length > n ? `<span>${pics.length} pictures</span>` : "");
}

// ---------------------------------------------------------------- step into this world: the pictures full screen
const IM = { open: false, i: 0, t: 0, auto: !reduced, front: 0, tok: 0, list: [] };
function imOpen(i = picI) {
  if (!pics.length) return;
  IM.open = true; IM.list = pics; $("#immerse").hidden = false; document.body.classList.add("immersed");
  imShow(i); imText(); $("#imClose").focus();
}
function imClose() { IM.open = false; $("#immerse").hidden = true; document.body.classList.remove("immersed"); picI = clamp(IM.i, 0, Math.max(0, pics.length - 1)); renderPic(); $("#picOpen").focus(); }
function imShow(i) {
  const L = IM.list; if (!L.length) return;
  IM.i = (i + L.length) % L.length; IM.t = performance.now();
  const p = L[IM.i], tok = ++IM.tok, nx = IM.front ? $("#imA") : $("#imB"), cur = IM.front ? $("#imB") : $("#imA"), url = thumb(p.image, innerWidth * Math.min(devicePixelRatio || 1, 2) > 1400 ? 1920 : 1280, p.width);
  const go = () => {
    if (tok !== IM.tok) return;
    nx.classList.remove("on"); void nx.offsetWidth; nx.classList.toggle("fit", FIT.has(p.type));
    nx.style.setProperty("--kx", (Math.random() * 6 - 3).toFixed(1) + "%"); nx.style.setProperty("--ky", (Math.random() * 4 - 2).toFixed(1) + "%");
    nx.classList.add("on"); cur.classList.remove("on"); IM.front ^= 1;
    $("#immerse .imgs").style.setProperty("--blur", `url("${thumb(p.image, 250, p.width)}")`);
  };
  const load = (u, again) => { nx.src = u; (nx.decode ? nx.decode() : Promise.resolve()).then(go, () => (again && u !== p.image ? load(p.image, false) : go())); };
  nx.alt = p.caption; load(url, true);
  $("#imCap").textContent = p.caption; $("#imCred").textContent = `${p.credit}, ${p.license}, Wikimedia Commons`; $("#imCred").href = p.page;
  $("#imThumbs").innerHTML = L.map((q, k) => `<button type="button" data-k="${k}" class="${k === IM.i ? "on" : ""}" aria-label="${esc(q.subject || q.caption)}"><img src="${esc(thumb(q.image, 250, q.width))}" ${fallback(q)} alt="" loading="lazy"></button>`).join("");
  const on = $("#imThumbs .on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center" });
  if (L.length > 1) { const q = L[(IM.i + 1) % L.length]; new Image().src = thumb(q.image, innerWidth * Math.min(devicePixelRatio || 1, 2) > 1400 ? 1920 : 1280, q.width); }
  $("#imPrev").hidden = $("#imNext").hidden = L.length < 2;
}
function imText() { // what time this is, and the way to the next and previous time (or chapter, in a story)
  if (!IM.open) return;
  if (ST) {
    const s = ST.story, c = s.chapters[ST.i], pv = s.chapters[ST.i - 1], nx = s.chapters[ST.i + 1];
    $("#imWhen").textContent = `${s.title}, chapter ${ST.i + 1} of ${s.chapters.length}`; $("#imTitle").textContent = c.title;
    $("#imEarlier").textContent = pv ? "Previous chapter" : ""; $("#imEarlier").hidden = !pv; $("#imLater").textContent = nx ? "Next chapter: " + nx.title : ""; $("#imLater").hidden = !nx;
  } else {
    const u = unitAt(S.ma), k = leaves.indexOf(u), pv = leaves[k - 1], nx = leaves[k + 1];
    $("#imWhen").textContent = ageText(S.ma); $("#imTitle").textContent = "The " + u.name;
    $("#imEarlier").textContent = pv ? "Earlier: the " + pv.name : ""; $("#imEarlier").hidden = !pv; $("#imLater").textContent = nx ? "Later: the " + nx.name : ""; $("#imLater").hidden = !nx;
  }
}
function imStep(d) { // earlier or later time (a story: chapter)
  if (ST) return storyGo(ST.i + d);
  const k = leaves.indexOf(unitAt(S.ma)) + d, u = leaves[k]; if (!u) return;
  setPlaying(false); setMa(atX((X(u.from) + X(u.to)) / 2));
}
function imPlayIcon() { $("#imPlayIcon").setAttribute("d", IM.auto ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z"); $("#imPlay").setAttribute("aria-label", IM.auto ? "Pause the slideshow" : "Play the slideshow"); }

// ---------------------------------------------------------------- stories: one thread of the Earth's history in chapters
let ST = null; // { story, i, t }
function storyCards() {
  const S2 = D.stories || [];
  $("#storiesBtn").hidden = $("#storiesTab").hidden = !S2.length;
  // oldest first, grouped by the era each moment mostly falls in; every card shows where it sits in the Earth's 4.5 billion years
  const eraOf = (s) => { const u = unitAt((s.from + s.to) / 2); return [u, ...chain(u)].find((x) => x.rank === "era") || chain(u).pop() || u; };
  const strata = leaves.map((u) => `<i style="left:${(X(u.from) * 100).toFixed(2)}%;width:${((X(u.to) - X(u.from)) * 100).toFixed(2)}%;background:${u.color}"></i>`).join("");
  let h = "", era = null;
  for (const s of [...S2].sort((a, b) => b.from - a.from)) {
    const e = eraOf(s), p = s.chapters.flatMap((c) => c.pics || []).find((q) => q.type === "scene" || q.type === "landscape") || s.chapters.flatMap((c) => c.pics || [])[0];
    if (e !== era) { era = e; h += `<h3 class="sera"><i style="background:${e.color}"></i>${esc(e.name)} ${esc(e.rank)}<span>${esc(rangeText(e))}</span></h3>`; }
    const x0 = X(s.from) * 100, x1 = X(s.to) * 100;
    h += `<button type="button" class="scard" data-s="${esc(s.id)}">
      ${p ? `<img src="${esc(thumb(p.image, 500, p.width))}" ${fallback(p)} alt="" loading="lazy">` : "<i class='noimg'></i>"}
      <span class="sbody"><b>${esc(s.title)}</b><small>${esc(rangeText(s).replace(/^./, (c) => c.toUpperCase()))}. ${s.chapters.length} chapters</small><em>${esc(s.summary || "")}</em>
      <span class="smini" aria-hidden="true"><span class="smrock">${strata}</span><span class="smspan" style="left:${x0.toFixed(2)}%;width:${Math.max(.8, x1 - x0).toFixed(2)}%"></span></span>
      <span class="sgo">Start</span></span></button>`;
  }
  $("#storyCards").innerHTML = h;
}
// ---------------------------------------------------------------- the forces that shaped the Earth (in the Moments sheet)
const FICON = {
  volcanism: '<path d="M3 20h18l-6-9h-6z"/><path d="M9 11l1.5-3h3L15 11"/><path d="M12 6V3M8.5 5 7 3.5M15.5 5 17 3.5"/>',
  water: '<path d="M12 3c3.5 4.5 6 7.7 6 10.5a6 6 0 0 1-12 0C6 10.7 8.5 7.5 12 3z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2.5"/>',
  oxygen: '<circle cx="8" cy="14" r="4"/><circle cx="16.5" cy="9" r="3"/><circle cx="17" cy="17.5" r="1.8"/><circle cx="10" cy="5" r="1.5"/>',
  ice: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5"/>',
  drift: '<circle cx="12" cy="12" r="9"/><path d="M7 7.5c2 .3 3 1.8 2.5 3.5S7 13.5 6 15.5M14 5c-.5 2 1 3 2.5 3.5s2 2.5 1 4.5-3 2.5-3.5 4"/>',
  impacts: '<circle cx="15" cy="15" r="5"/><path d="M11.5 11.5 4 4M13 9.8 8 3M9.8 13 3 8"/>',
  evolution: '<path d="M8 3c0 6 8 6 8 12 0 3-2 5-4 6M16 3c0 6-8 6-8 12 0 3 2 5 4 6"/><path d="M9 7h6M9 17h6M10.5 12h3"/>',
  people: '<path d="M4 21V11h4v10M10 21V5h4v16M16 21v-7h4v7M2 21h20"/>',
};
let FX = null;
function forceCards() {
  const F = D.forces || [];
  $("#forces").hidden = !F.length;
  $("#forceGrid").innerHTML = F.map((f, i) => `<button type="button" class="ftile" data-f="${i}" aria-expanded="false" aria-controls="forceOpen">
    <svg viewBox="0 0 24 24" aria-hidden="true">${FICON[f.id] || FICON.drift}</svg><b>${esc(f.title)}</b><span>${esc(f.line || "")}</span></button>`).join("");
}
function forceShow(i) {
  const F = D.forces || [], f = F[i], box = $("#forceOpen");
  FX = f && FX !== i ? i : null;
  document.querySelectorAll(".ftile").forEach((b) => { const on = +b.dataset.f === FX; b.classList.toggle("on", on); b.setAttribute("aria-expanded", on); });
  if (FX === null) { box.hidden = true; return; }
  const what = (r) => !r ? "" : r[0] === "s" ? "Moment" : r[0] === "o" ? "First appearance" : "";
  const src = (f.sources || []).map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`).join("");
  box.innerHTML = `<h3><svg viewBox="0 0 24 24" aria-hidden="true">${FICON[f.id] || FICON.drift}</svg>${esc(f.title)}</h3><p>${emph(f.text)}</p>
    <ul class="mlist">${(f.examples || []).map((x, k) => `<li><button type="button" class="mrow" data-fx="${k}"><span class="my">${esc(ageShort(x.ma))}</span><span class="mt"><b>${esc(x.title)}</b>${what(x.ref) ? `<small>${what(x.ref)}${x.ref[0] === "s" ? ": start it" : ""}</small>` : ""}</span></button></li>`).join("")}</ul>
    ${src ? `<ul class="src">${src}</ul>` : ""}`;
  box.hidden = false;
  box.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function forceGo(k) {
  const x = (D.forces || [])[FX]?.examples?.[k]; if (!x) return;
  const [t, id] = (x.ref || "").split(":");
  $("#storyList").hidden = true; setPlaying(false);
  if (t === "s") return storyStart(id);
  if (ST) storyEnd();
  const it = t === "e" ? D.events.find((e) => e.id === id) : t === "o" ? D.origins.find((o) => o.id === id) : null;
  if (it) select(t === "e" ? "event" : "origin", it); else { select(null); setMa(x.ma); }
}
function storyStart(id, i = 0) {
  const s = (D.stories || []).find((x) => x.id === id); if (!s) return;
  ST = { story: s, i: -1, t: 0, rec: S.records }; if (S.records) setRecords(false, true); $("#storyList").hidden = true; $("#app").dataset.story = s.id; setPlaying(false); select(null); if (S.life) setLife(false);
  $("#story").hidden = false;
  layout(); storyGo(i);
}
function storyGo(i) {
  const s = ST.story; i = clamp(i, 0, s.chapters.length - 1); const c = s.chapters[i]; ST.i = i; ST.t = performance.now();
  if (S.sel) select(null, null, false);
  setMa(c.ma); if (c.then) flyTo(c.then[0], c.then[1]);
  pics = c.pics?.length ? c.pics : picsFor(unitAt(c.ma)); picI = 0; renderPic(); renderStory(); // a chapter with no pictures of its own shows its time's
  storyBar();
  if (IM.open) { IM.list = pics; imShow(0); imText(); }
  S.dirty = true; hashSoon();
}
function storyEnd() {
  const rec = ST?.rec; ST = null; delete $("#app").dataset.story; $("#story").hidden = true; setPlaying(false); if (rec) setRecords(true, true);
  shownUnit = null; renderNow(); layout(); S.dirty = true; hashSoon();
}
const EVLABEL = { geology: "From rocks", fossil: "From fossils", genetic: "From DNA", archaeology: "From remains", disputed: "Disputed" };
function renderStory() {
  const s = ST.story, c = s.chapters[ST.i], n = s.chapters.length;
  const refs = (c.refs || []).map((r) => { const [t, id] = r.split(":"), it = t === "e" ? D.events.find((e) => e.id === id) : D.origins.find((o) => o.id === id); return it ? { t: t === "e" ? "event" : "origin", it } : null; }).filter(Boolean);
  $("#story").innerHTML = `<button type="button" class="x" data-act="end" aria-label="Leave this moment">${'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'}</button>
    <p class="skick">${esc(s.title)}<span>Chapter ${ST.i + 1} of ${n}</span></p>
    <div class="sprog"><i style="width:${(ST.i + 1) / n * 100}%"></i></div>
    <h1>${esc(c.title)}</h1>
    <p class="swhen">${esc(c.dateLabel || ageText(c.ma))}${c.place ? `. ${esc(c.place)}` : ""}</p>
    <p class="stext">${emph(c.text)}</p>
    ${c.species?.length ? `<div class="sspec">${c.species.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
    <div class="ev"><span class="chip ${esc(c.evidence)}">${EVLABEL[c.evidence] || esc(c.evidence || "")}</span><span>${esc(c.evidenceNote || "")}</span></div>
    ${c.ma > MAPPED ? `<p class="trust art"><b>Artist's impression.</b> There is no map of the Earth this old; the globe is not real here.</p>` : ""}
    ${refs.length ? `<p class="srel">More: ${refs.map((r, k) => `<button type="button" class="linkish" data-ref="${k}">${esc(r.t === "event" ? r.it.title : "First " + r.it.name.toLowerCase())}</button>`).join(", ")}</p>` : ""}
    ${c.sources?.length ? `<ul class="src">${c.sources.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a></li>`).join("")}</ul>` : ""}
    <div class="snav"><button type="button" data-act="prev" ${ST.i ? "" : "disabled"}>Previous</button>${ST.i < n - 1 ? `<button type="button" class="dark" data-act="next">Next chapter</button>` : `<button type="button" class="dark" data-act="end">Finish</button>`}</div>`;
  $("#story").scrollTop = 0; storyRefs = refs;
}
let storyRefs = [];
// The story's own time bar, as World history does for its stories: one segment per chapter (the current one wider), the
// chapter named above it, dates under it, Play, and a way out to the whole of Earth history at this moment.
function storyBar() {
  const s = ST.story, n = s.chapters.length, cur = ST.i, c = s.chapters[cur];
  const rest = n - 1, wCur = Math.max(1, (0.16 * rest) / 0.84), W = rest + wCur; let x = 0;
  const G = s.chapters.map((_, k) => { const w = (k === cur ? wCur : 1) / W * 100, g = { x, w }; x += w; return g; });
  const edge = (p) => (p > 85 ? " r" : p < 15 ? " l" : "");
  $("#sBar").innerHTML = s.chapters.map((ch, k) => `<button type="button" class="sseg ${k === cur ? "on" : k < cur ? "seen" : ""}${edge(G[k].x + G[k].w / 2)}" data-c="${k}" style="left:${G[k].x.toFixed(2)}%;width:${G[k].w.toFixed(2)}%" aria-pressed="${k === cur}" aria-label="Chapter ${k + 1} of ${n}: ${esc(ch.title)}, ${esc(ch.dateLabel || ageText(ch.ma))}" data-label="${k + 1}. ${esc(ch.title)}">${k === cur ? "<i></i>" : ""}</button>`).join("");
  const tw = $("#sBar").clientWidth || 800; let last = -1e9;
  $("#sYrs").innerHTML = s.chapters.map((ch, k) => { const px = G[k].x / 100 * tw; if (px - last < 64 && k !== cur) return ""; last = px; return `<span class="${k === cur ? "on" : ""}" style="left:${G[k].x.toFixed(2)}%">${esc(ageShort(ch.ma))}</span>`; }).join("");
  $("#sHead").textContent = `${cur + 1} of ${n}: ${c.title}`; $("#sWhen").textContent = c.dateLabel || ageText(c.ma);
}
function drawStory() { // the chapter's sites where they sat at the time, and its route
  const c = ST.story.chapters[ST.i]; if (c.ma > MAPPED + 20) return;
  const prog = reduced ? 1 : clamp((performance.now() - ST.t) / 1800, 0, 1);
  if (c.route?.path?.length > 1) {
    const P = c.route.path, pts = [];
    for (let k = 0; k < P.length - 1; k++) for (let s = 0; s < 16; s++) pts.push(slerp(P[k], P[k + 1], s / 16));
    pts.push(P[P.length - 1]);
    const upto = Math.max(2, Math.round(pts.length * prog)), col = LIGHT ? "#e5402a" : "#ffb35c";
    ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.setLineDash([7, 6]); ctx.beginPath(); let pen = false, last = null, prev = null;
    for (let k = 0; k < upto; k++) { const xy = project(pts[k][0], pts[k][1]); if (!xy) { pen = false; continue; } pen ? ctx.lineTo(xy[0], xy[1]) : ctx.moveTo(xy[0], xy[1]); pen = true; prev = last; last = xy; }
    ctx.stroke(); ctx.setLineDash([]);
    if (last && prev) { const a = Math.atan2(last[1] - prev[1], last[0] - prev[0]); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(last[0] + 9 * Math.cos(a), last[1] + 9 * Math.sin(a)); ctx.lineTo(last[0] + 9 * Math.cos(a + 2.5), last[1] + 9 * Math.sin(a + 2.5)); ctx.lineTo(last[0] + 9 * Math.cos(a - 2.5), last[1] + 9 * Math.sin(a - 2.5)); ctx.fill(); }
    if (prog < 1) S.dirty = true;
  }
  const here = [];
  for (const t of c.sites || []) {
    if (!t.then) continue; const xy = project(t.then[0], t.then[1]); if (!xy) continue;
    here.push({ t, xy }); pins.push({ item: t, type: "site", ma: t.ma ?? c.ma, x: xy[0], y: xy[1] });
    ctx.globalAlpha = .45 + .55 * xy[2]; ctx.fillStyle = HOT; ctx.strokeStyle = PAPER; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(xy[0], xy[1], 6, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(xy[0], xy[1], 12 + 3 * Math.sin(performance.now() / 300), 0, 7); ctx.strokeStyle = HOT; ctx.lineWidth = 1.5; ctx.stroke();
  }
  // labels: each tries right, left, above and below its pin, and takes the first spot clear of the other pins and labels
  ctx.font = '700 13px "Source Serif 4", Georgia, serif'; ctx.lineWidth = 4; ctx.strokeStyle = LIGHT ? "rgba(255,255,255,.92)" : "rgba(4,6,12,.85)"; ctx.fillStyle = INK;
  const cr = mk.getBoundingClientRect(), cards = ["#story", "#rail", "#now", "#bar", "#dock"].map((q) => document.querySelector(q)).filter((el) => el && !el.hidden && el.offsetParent)
    .map((el) => { const r = el.getBoundingClientRect(); return [r.left - cr.left - 6, r.top - cr.top - 6, r.right - cr.left + 6, r.bottom - cr.top + 6]; });
  const boxes = [...here.map(({ xy }) => [xy[0] - 14, xy[1] - 14, xy[0] + 14, xy[1] + 14]), ...cards], hit = (b) => boxes.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
  for (const { t, xy } of here) {
    const w = ctx.measureText(t.name).width, [x, y] = xy, h = 16;
    const spots = [[x + 16, y + 4], [x - 16 - w, y + 4], [x - w / 2, y - 18], [x - w / 2, y + 26], [x + 16, y - 14], [x + 16, y + 22], [x - 16 - w, y - 14], [x - 16 - w, y + 22]];
    let at = spots.find(([lx, ly]) => !hit([lx - 2, ly - h + 4, lx + w + 2, ly + 4])) || spots[0];
    boxes.push([at[0] - 2, at[1] - h + 4, at[0] + w + 2, at[1] + 4]);
    ctx.globalAlpha = .45 + .55 * xy[2]; ctx.strokeText(t.name, at[0], at[1]); ctx.fillText(t.name, at[0], at[1]);
  }
  ctx.globalAlpha = 1; if (!reduced && (c.sites || []).some((t) => t.then)) S.dirty = true; // the rings pulse
}
function slerp(a, b, f) { // a point part of the way along the great circle from a to b ([lon, lat])
  const v = (p) => { const l = p[0] * RAD, q = p[1] * RAD; return [Math.cos(q) * Math.cos(l), Math.cos(q) * Math.sin(l), Math.sin(q)]; };
  const A = v(a), B = v(b), d = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1)); if (d < 1e-6) return a;
  const s1 = Math.sin((1 - f) * d) / Math.sin(d), s2 = Math.sin(f * d) / Math.sin(d), P = [0, 1, 2].map((k) => A[k] * s1 + B[k] * s2);
  return [Math.atan2(P[1], P[0]) / RAD, Math.asin(clamp(P[2], -1, 1)) / RAD];
}
let aroundKey = "";
function renderAround() {
  const u = shownUnit, list = [];
  for (const e of D.events) if (e.ma <= u.from && e.ma > u.to) list.push({ ma: e.ma, t: e.title, item: e, type: "event" });
  for (const o of D.origins) if (o.fossilMa <= u.from && o.fossilMa > u.to) list.push({ ma: o.fossilMa, t: "First " + o.name.toLowerCase(), item: o, type: "origin" });
  list.sort((a, b) => b.ma - a.ma);
  let near = null; for (const x of list) if (!near || Math.abs(x.ma - S.ma) < Math.abs(near.ma - S.ma)) near = x;
  const key = u.id + "|" + (near ? near.t : "") + "|" + list.filter((x) => x.ma >= S.ma).length + "|" + (S.sel ? S.sel.item.id : "");
  if (key === aroundKey) return; aroundKey = key;
  $("#aroundTitle").textContent = "In the " + u.name;
  around = list;
  const isMile = (it) => miles.some((m) => m.item === it);
  $("#aroundList").innerHTML = list.length ? list.map((x, i) => `<li><button type="button" data-i="${i}" class="${x.ma < S.ma ? "" : "past"}${x === near || S.sel?.item === x.item ? " on" : ""}${isMile(x.item) ? " turn" : ""}"><span class="t">${esc(x.t)}</span><span class="d">${esc(ageShort(x.ma))}</span></button></li>`).join("") : '<li class="none">No dated events are listed here.</li>';
  const on = $("#aroundList .on"); if (on && !S.sel) on.scrollIntoView({ block: "nearest" });
}
let around = [];
function select(type, item, fly = true) {
  S.sel = item ? { type, item } : null; aroundKey = "";
  const d = $("#detail");
  if (!item) { d.hidden = true; delete $("#app").dataset.sel; S.dirty = true; renderAround(); return; }
  $("#app").dataset.sel = "1";
  const ma = type === "origin" ? item.fossilMa : item.ma;
  const chip = `<span class="chip ${esc(item.evidence)}">${{ geology: "From rocks", fossil: "From fossils", genetic: "From DNA", archaeology: "From remains", disputed: "Disputed" }[item.evidence] || esc(item.evidence)}</span>`;
  const src = (item.sources || []).map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`).join("");
  let h = `<button type="button" class="x" id="detailClose" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
  if (type === "origin") {
    h += `<h3>${esc(item.name)}</h3><p class="when">${esc(item.sci)}. Oldest fossils ${esc(item.dateLabel || "c. " + ageText(ma))}${item.extinctMa ? ", died out " + ageText(item.extinctMa) : ""}.</p><p>${emph(item.text)}</p>`;
    h += `<p><b>Oldest known:</b> ${esc(item.oldest?.name || "")}${item.oldest?.place ? ", " + esc(item.oldest.place) : ""}.</p>`;
    if (item.clockMa) h += `<p><b>By DNA estimates:</b> ${item.clockMa[0] === item.clockMa[1] ? "about " + ageText(item.clockMa[0]) : num(item.clockMa[0]) + " to " + ageText(item.clockMa[1])}.</p>`;
    if (item.claimMa) h += `<p><b>Oldest disputed claim:</b> ${ageText(item.claimMa)}.</p>`;
  } else h += `<h3>${esc(item.title)}</h3><p class="when">${esc(item.dateLabel || ageText(ma))}${item.place ? ". Evidence today: " + esc(item.place) : ""}</p><p>${emph(item.text)}</p>`;
  h += `<div class="ev">${chip}<span>${esc(item.evidenceNote || "")}</span></div>${src ? `<ul class="src">${src}</ul>` : ""}`;
  d.innerHTML = h; d.hidden = false; d.scrollTop = 0;
  if (fly) { setMa(ma); if (item.then && ma <= MAPPED) flyTo(item.then[0], item.then[1]); }
  S.dirty = true; renderAround();
}
let fly = null;
function flyTo(lon, lat) { let dl = ((lon - S.lon + 540) % 360) - 180; fly = { lon0: S.lon, lat0: S.lat, dl, dp: clamp(lat, -70, 70) - S.lat, t: 0 }; }

// ---------------------------------------------------------------- the timeline
function drawTrackStatics() {
  if (!D) return;
  const seg = (u) => `<span data-id="${u.id}" title="${esc(u.name)}" style="left:${X(u.from) * 100}%;width:${(X(u.to) - X(u.from)) * 100}%;background:${u.color}">${esc(u.name)}</span>`;
  $("#rowA").innerHTML = tops.map(seg).join(""); $("#rowB").innerHTML = leaves.map(seg).join("");
  const tw = trackW = $("#track").clientWidth || trackW; milesW = $("#milesIn").clientWidth || milesW; // hide names that do not fit their band
  document.querySelectorAll("#rowB span").forEach((el) => { const need = el.textContent.length * 6.6 + 8; if (el.clientWidth < need) el.style.fontSize = "0"; });
  const ticks = [[4567, "4.57 bn"], [2500, "2.5 bn"], [1000, "1 bn"], [538.8, "539 M"], [251.902, "252 M"], [66, "66 M"], [23.04, "23 M"], [2.58, "2.6 M"], [0, "today"]];
  $("#axis").innerHTML = ticks.filter((t) => tw > 700 || [4567, 251.902, 66, 0].includes(t[0])).map(([m, l]) => `<span style="left:${X(m) * 100}%">${l}</span>`).join("");
  $("#ticksE").innerHTML = D.events.map((e) => `<i class="${e.kind === "extinction" ? "x5" : ""}" style="left:${X(e.ma) * 100}%"></i>`).join("");
  layoutMiles(); drawCurve(); if (shownUnit) document.querySelectorAll("#rowB span").forEach((el) => el.classList.toggle("cur", el.dataset.id === shownUnit.id));
}
// ---------------------------------------------------------------- turning points for life: labels above the timeline
function buildMiles() {
  miles = (D.milestones || []).map((m) => {
    const [t, id] = m.ref.split(":"), item = t === "e" ? D.events.find((e) => e.id === id) : D.origins.find((o) => o.id === id);
    return { ...m, type: t === "e" ? "event" : "origin", item };
  }).filter((m) => m.item);
  $("#milesIn").innerHTML = miles.map((m, i) => `<button type="button" class="mile ${m.kind}" data-m="${i}" title="${esc(m.title)}, ${esc(ageText(m.ma))}">${esc(m.label)}</button>`).join("");
  $("#mileMarks").innerHTML = miles.map((m, i) => `<i class="${m.kind}" data-m="${i}" style="left:${X(m.ma) * 100}%"></i>`).join("");
}
function layoutMiles() { // most important first; a label that has no room in either row is hidden (its marker stays, with a tooltip)
  const box = $("#milesIn"), w = box.clientWidth; if (!w || !miles.length) return;
  const els = [...box.children], rows = [[], []], gap = 6;
  const order = miles.map((m, i) => i).sort((a, b) => miles[a].priority - miles[b].priority || miles[b].ma - miles[a].ma);
  for (const el of els) { el.classList.remove("hid"); el.style.left = "0px"; }
  const marks = [...$("#mileMarks").children], kept = []; // markers closer than 9 px: only the more important one is drawn
  for (const i of order) { const x = X(miles[i].ma) * w, near = kept.some((k) => Math.abs(k - x) < 9); marks[i].classList.toggle("hid", near); if (!near) kept.push(x); }
  for (const i of order) {
    const el = els[i], cw = el.offsetWidth, cx = X(miles[i].ma) * w, l = clamp(cx - cw / 2, 0, w - cw), r = l + cw;
    const row = rows.findIndex((rw) => rw.every(([a, b]) => r + gap <= a || l >= b + gap));
    if (row < 0) { el.classList.add("hid"); continue; }
    rows[row].push([l, r]); el.style.left = l + "px"; el.style.top = row * 19 + "px"; el.style.setProperty("--tip", (cx - l) + "px");
  }
}
let mileOn = -1;
function mileTick() { // the label at the cursor is filled; while playing, crossing one slows time and flashes it
  let on = -1; const w = milesW;
  miles.forEach((m, i) => { if (Math.abs(X(m.ma) - X(S.ma)) * w < 7) on = i; });
  if (on === mileOn) return; mileOn = on;
  document.querySelectorAll("#milesIn .mile, #mileMarks i").forEach((el) => el.classList.toggle("on", +el.dataset.m === on));
}
function drawCurve() {
  const c = D.curves.find((x) => x.id === S.curve), svg = $("#curve"); if (!c) { svg.innerHTML = ""; return; }
  const P = c.points, vals = P.flatMap((p) => p.slice(1)), lo = Math.min(...vals), hi = Math.max(...vals), y = (v) => 38 - (v - lo) / (hi - lo || 1) * 34;
  svg.setAttribute("viewBox", "0 0 1000 40");
  const line = P.map((p, i) => (i ? "L" : "M") + (X(p[0]) * 1000).toFixed(1) + " " + y(p.length > 2 ? (p[1] + p[2]) / 2 : p[1]).toFixed(1)).join("");
  svg.innerHTML = `<path class="base" d="M0 39.5H1000"/><path class="ln" d="${line}"/>`;
  document.querySelectorAll("#curvePick button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.c === S.curve));
  renderCurveNow();
}
function renderCurveNow() {
  const c = D.curves.find((x) => x.id === S.curve); if (!c) return; const v = sample(S.curve, S.ma);
  const h = v == null ? `${esc(c.title)}: the record starts ${ageText(c.points[0][0])}` : `${esc(c.title)}: <b>${sig(Array.isArray(v) ? (v[0] + v[1]) / 2 : v)}</b> ${esc(c.unit)}`;
  if (h !== shownCurve) { shownCurve = h; $("#curveNow").innerHTML = h; }
}

// ---------------------------------------------------------------- life through time
// a chart of when each group lived: a row per group, from its oldest fossils to today or to when it died out, under a strip of the
// periods. Two scales: the timeline's own (all 4.5 billion years) or the 540 million years since animals, where most groups live.
// Each kind of life (fish, reptiles ...) is a heading that folds its rows away and says how many of them are alive at this time.
const LIFE = { span: (() => { try { return localStorage.getItem("lifeSpan") || "animals"; } catch (e) { return "animals"; } })(), shut: new Set() };
let lifeRows = [], lifeCats = [], lifeW = 0;
const LX = (ma) => LIFE.span === "all" ? X(ma) : clamp((538.8 - ma) / 538.8, 0, 1);
function buildLife() {
  let h = "";
  for (const [g, name] of GROUPS) {
    const rows = D.origins.filter((o) => o.group === g).sort((a, b) => b.fossilMa - a.fossilMa); if (!rows.length) continue;
    const col = gcol(g), shut = LIFE.shut.has(g), st = Math.max(...rows.map((o) => o.fossilMa));
    h += `<div class="lcat" data-g="${g}" style="--g:${col}"><button type="button" class="lnm" aria-expanded="${!shut}" data-fold="${g}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${shut ? "M9 6l6 6-6 6" : "M6 9l6 6 6-6"}"/></svg><i class="sw"></i><b>${esc(name)}</b><span class="lcn"></span></button>` +
      `<span class="ltr">${shut ? `<i class="band" style="left:${LX(st) * 100}%;width:${(1 - LX(st)) * 100}%"></i>` : ""}</span></div>`;
    if (shut) continue;
    for (const o of rows) {
      const x0 = LX(o.fossilMa), x1 = LX(o.extinctMa || 0), ck = o.clockMa ? Math.max(...o.clockMa) : 0, [nm, sub] = o.name.replace(/\)$/, "").split(" (");
      h += `<div class="lrow" data-id="${o.id}" style="--g:${col}"><button type="button" class="lnm" title="${esc(o.name)}">${esc(nm)}${sub ? ` <small>${esc(sub)}</small>` : ""}</button><span class="ltr">` +
        (ck > o.fossilMa && LX(ck) < x0 ? `<i class="clk" style="left:${LX(ck) * 100}%;width:${(x0 - LX(ck)) * 100}%"></i>` : "") +
        `<i class="bar" style="left:${x0 * 100}%;width:${Math.max(.3, (x1 - x0) * 100)}%"></i>` +
        (o.extinctMa ? `<span class="lend" style="${x1 > .9 ? `right:${(1 - x1) * 100}%;padding-right:6px` : `left:${x1 * 100}%;padding-left:6px`}">×<span class="lt"> died out ${esc(ageShort(o.extinctMa))}</span></span>` : "") +
        `<span class="lfrom" style="right:${(1 - x0) * 100}%">${esc(ageShort(o.fossilMa))}</span></span></div>`;
    }
  }
  $("#lifeRows").innerHTML = `<div class="lgrid">${h}<div class="lcur" aria-hidden="true"><i id="lifeLine"></i></div></div>`;
  lifeRows = [...document.querySelectorAll("#lifeRows .lrow")].map((el) => ({ el, o: D.origins.find((x) => x.id === el.dataset.id), st: null }));
  lifeCats = [...document.querySelectorAll("#lifeRows .lcat")].map((el) => ({ el, rows: D.origins.filter((o) => o.group === el.dataset.g), n: -1 }));
  document.querySelectorAll("#lifeSpan button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.span === LIFE.span));
  lifeW = 0;
}
function lifeScale() { // the strip of periods and the dates under it, only redrawn when the scale or the width changes
  if (lifeW) return; const tr = $("#lifeScale .ltr"), w = tr.clientWidth; if (!w) return; lifeW = w;
  const units = LIFE.span === "all" ? leaves : leaves.filter((u) => u.to < 538.8);
  $("#lifeStrip").innerHTML = units.map((u) => { const a = LX(Math.min(u.from, LIFE.span === "all" ? u.from : 538.8)), b = LX(u.to), px = (b - a) * w;
    return `<span style="left:${a * 100}%;width:${(b - a) * 100}%;background:${u.color}" title="${esc(u.name)}">${px > u.name.length * 6.4 + 8 ? esc(u.name) : ""}</span>`; }).join("");
  const T = LIFE.span === "all" ? [[4567, "4.57 bn"], [2500, "2.5 bn"], [1000, "1 bn"], [538.8, "539 M"], [251.9, "252 M"], [66, "66 M"], [0, "today"]]
    : [[538.8, "539 M"], [443.8, "444 M"], [358.9, "359 M"], [251.9, "252 M"], [201.4, "201 M"], [145, "145 M"], [66, "66 M"], [23, "23 M"], [0, "today"]];
  let last = -99; $("#lifeTicks").innerHTML = T.map(([m, l]) => { const px = LX(m) * w; if (px - last < 46) return ""; last = px; return `<span style="left:${LX(m) * 100}%">${l}</span>`; }).join("");
}
function lifeTick() {
  if (!S.life) return; let n = 0;
  for (const g of D.origins) if (S.ma <= g.fossilMa && S.ma >= (g.extinctMa || 0)) n++;
  for (const r of lifeRows) {
    const st = S.ma > r.o.fossilMa ? "fut" : S.ma < (r.o.extinctMa || 0) ? "dead" : "alive";
    if (st !== r.st) { r.st = st; r.el.dataset.st = st; }
    r.el.classList.toggle("on", S.sel?.item === r.o);
  }
  for (const c of lifeCats) { const k = c.rows.filter((o) => S.ma <= o.fossilMa && S.ma >= (o.extinctMa || 0)).length; if (k !== c.n) { c.n = k; c.el.querySelector(".lcn").textContent = `${k} of ${c.rows.length} alive`; c.el.dataset.st = k ? "alive" : "none"; } }
  $("#lifeCount").textContent = `${n} of ${D.origins.length} groups alive ${S.ma < 0.0002 ? "today" : ageText(S.ma)}`;
  const x = LX(S.ma), before = LIFE.span !== "all" && S.ma > 538.8;
  $("#lifeLine").style.left = x * 100 + "%"; $("#lifeLine").hidden = before;
  const pill = $("#lifePill"); pill.style.left = x * 100 + "%"; pill.textContent = before ? `${ageShort(S.ma)}: before animals` : S.ma < 0.0002 ? "today" : ageShort(S.ma); pill.classList.toggle("edge", before || x < .06); pill.classList.toggle("end", x > .94);
  lifeScale();
}
function lifeRebuild() { const box = $("#lifeRows"), top = box.scrollTop; buildLife(); lifeTick(); box.scrollTop = top; }
function setLife(on) {
  S.life = on; $("#life").hidden = !on; $("#lifeBtn").setAttribute("aria-pressed", on); $("#lifeTab").setAttribute("aria-pressed", on); $("#app").dataset.view = on ? "life" : "world";
  for (const r of lifeRows) r.st = null; lifeW = 0; layout(); lifeTick();
}

// ---------------------------------------------------------------- about
function buildAbout() {
  const cr = D.curves.filter((c) => CURVES.some((k) => k[0] === c.id) || c.id === "oxygen-precambrian").map((c) => `<li>${esc(c.title)}: ${esc(c.source.title)}. ${esc((c.source.licence || "").split(" (")[0])}.</li>`).join("");
  $("#aboutBody").innerHTML = `
  <p>The globe is drawn from published reconstructions of the ancient Earth. They are careful scientific estimates, and they get less certain the further back they go.</p>
  <table><tr><th>Time</th><th>What is drawn</th><th>How far to trust it</th></tr>
  <tr><td>Today to 100 million years ago</td><td>Land height, sea depth, coasts and shallow seas</td><td>Well known. Independent reconstructions agree on the layout of the continents to about 60 to 220 km.</td></tr>
  <tr><td>100 to 300 million years ago</td><td>The same</td><td>Good. They agree to about 400 km.</td></tr>
  <tr><td>300 to 540 million years ago</td><td>The same, with less detail</td><td>Rough. They differ by 600 to 1,600 km, and by more in East Asia.</td></tr>
  <tr><td>Before 540 million years ago</td><td>An artist's impression</td><td>Not a map. The shapes of land and sea are invented to show the kind of world it was.</td></tr></table>
  <h3>What the map cannot show</h3>
  <ul><li>Where the continents sat east to west is poorly known before about 180 million years ago, because all older sea floor has been destroyed. Their order and their distance from the poles are much better known.</li>
  <li>The colours are ours. The data gives height and depth only: land is drawn as bare rock before plants spread across it (from about 470 million years ago) and green afterwards. Forests, deserts and ice sheets are not drawn.</li>
  <li>Deep ocean floors older than about 180 million years are drawn at one flat depth, because nothing is known of them.</li>
  <li>There is one map every 5 million years. What you see in between is a blend of the two nearest maps.</li>
  <li>Events and fossil sites are shown where that spot of ground sat at the time, so they move with the continents.</li></ul>
  <h3>Sources</h3>
  <ul class="cred"><li>Maps: ${esc(D.maps.credit)}. Places are moved back in time with the PALEOMAP plate model through the GPlates Web Service.</li>
  <li>Time scale and colours: International Chronostratigraphic Chart, International Commission on Stratigraphy.</li>${cr}
  <li>Every event and every group in the life timeline lists its own sources when you open it.</li></ul>`;
}

// ---------------------------------------------------------------- moving through time and around the globe
function setMa(ma) { lastMa = S.ma; S.ma = clamp(ma, 0, OLDEST); S.dirty = true; renderNow(); hashSoon(); }
let hashT = 0;
function hashSoon() { clearTimeout(hashT); hashT = setTimeout(() => { history.replaceState(null, "", ST ? `#s/${ST.story.id}/${ST.i + 1}` : "#" + (S.ma >= 10 ? Math.round(S.ma) : +S.ma.toFixed(3))); }, 250); }
function setView(v) { // "atlas" or "space": the same page and the same moment, drawn two ways
  LIGHT = v !== "space"; document.body.classList.toggle("light", LIGHT); inks();
  try { localStorage.setItem("deepView", LIGHT ? "atlas" : "space"); } catch (e) {}
  const u = new URL(location.href); if (LIGHT) u.searchParams.delete("view"); else u.searchParams.set("view", "space"); history.replaceState(null, "", u);
  $("#themeColor").content = LIGHT ? "#ffffff" : "#04060c";
  const MOON = '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  $("#themeIcon").innerHTML = LIGHT ? MOON : SUN; $("#themeBtn").setAttribute("aria-label", LIGHT ? "Dark view" : "Light view"); $("#themeBtn").title = LIGHT ? "Dark view: the Earth seen from space" : "Light view";
  if (D) { buildLife(); layout(); lifeTick(); S.dirty = true; }
}
function setRecords(on, keep) { // the climate records under the timeline: folded away unless asked for
  S.records = on; if (on) $("#app").dataset.records = "open"; else delete $("#app").dataset.records;
  $("#recBtn").setAttribute("aria-expanded", on); const t = on ? "Hide climate records" : "Show climate records"; $("#recBtn").setAttribute("aria-label", t);
  if (!keep) try { localStorage.setItem("deepRecords", on ? "1" : "0"); } catch (e) {}
  if (D) { layout(); drawCurve(); }
}
// Earth history hands over to World history: from 10,000 BCE (12,000 years ago) the atlas follows people
const HANDOVER = 0.012; let nudgeShut = false;
function nudgeTick(pop) {
  const show = !ST && !nudgeShut && S.ma <= HANDOVER, n = $("#nudge");
  if (show === !n.hidden && !pop) return;
  n.hidden = !show; if (!show) return;
  $("#nudgeKick").textContent = S.ma < 0.0002 ? "You have reached today" : "World history covers this time";
  if (pop && !reduced) { n.classList.remove("pop"); void n.offsetWidth; n.classList.add("pop"); }
}
function setPlaying(p) { S.playing = p; const ic = p ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z"; $("#playIcon").setAttribute("d", ic); $("#sPlayIcon").setAttribute("d", ic); $("#sPlay").setAttribute("aria-label", p ? "Pause" : "Play this moment"); $("#play").setAttribute("aria-label", p ? "Pause" : "Play through time"); if (p) idle = 0; if (p && S.ma <= 0 && !ST) setMa(OLDEST); if (p && ST) ST.t = performance.now(); }
let last = performance.now(), idle = 0, vel = [0, 0], flash = null, spin = false, lastDraw = 0, movedAt = 0;
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (S.playing && ST) { const f = $("#sBar .on i"); if (f) f.style.width = Math.min(100, (now - ST.t) / 120) + "%"; if (now - ST.t > 12000) { if (ST.i < ST.story.chapters.length - 1) storyGo(ST.i + 1); else setPlaying(false); } }
  else if (S.playing) {
    const slow = flash && now - flash.t < 1600 ? .12 : 1, x0 = X(S.ma), x = x0 + dt / 85 * slow;
    if (!reduced) for (let i = 0; i < miles.length; i++) { const mx = X(miles[i].ma); if (mx > x0 && mx <= x) { flash = { i, t: now }; const el = $(`#milesIn [data-m="${i}"]`); if (el) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); } } }
    if (x >= 1) { setMa(0); setPlaying(false); nudgeShut = false; nudgeTick(true); } else setMa(atX(x));
  }
  if (IM.open && IM.auto && IM.list.length > 1 && now - IM.t > 8000) imShow(IM.i + 1);
  if (fly) { fly.t = Math.min(1, fly.t + dt / .9); const k = fly.t * fly.t * (3 - 2 * fly.t); S.lon = fly.lon0 + fly.dl * k; S.lat = fly.lat0 + fly.dp * k; S.dirty = true; if (fly.t >= 1) fly = null; }
  else if (!dragging) {
    if (Math.abs(vel[0]) + Math.abs(vel[1]) > .02) { S.lon -= vel[0] * dt; S.lat = clamp(S.lat + vel[1] * dt, -85, 85); vel[0] *= .93; vel[1] *= .93; S.dirty = true; }
    else if (!reduced && !S.sel && !ST && !document.hidden) { idle += dt; if (idle > 2.5 && idle < 62) { S.lon += dt * 2.2; spin = true; } } // a slow turn while nobody touches it, for a minute
  }
  if (Gt) for (const k of ["cx", "cy", "r"]) if (Math.abs(G[k] - Gt[k]) > .3) { G[k] += (Gt[k] - G[k]) * (reduced ? 1 : Math.min(1, dt * 8)); S.dirty = true; }
  // while the globe is dragged, flung, flown or played it is drawn at a lower resolution; sharp again once it settles
  const moving = dragging || fly || S.playing || Math.abs(vel[0]) + Math.abs(vel[1]) > .02;
  if (moving) movedAt = now;
  if (dpr > 1.25) { const want = moving ? Math.max(1, dpr * .6) : dpr; if (want !== rdpr && (moving || now - movedAt > 200)) { glSize(want); S.dirty = true; } }
  if (D && (S.dirty || (spin && now - lastDraw > 32))) { S.dirty = spin = false; lastDraw = now; draw(); } // the idle turn: 30 frames a second
  requestAnimationFrame(frame);
}
let dragging = null;
function pinAt(x, y) { let best = null, bd = 14; for (const p of pins) { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } } return best; }
function wire() {
  cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); dragging = { x: e.clientX, y: e.clientY, moved: 0, t: performance.now() }; vel = [0, 0]; idle = 0; fly = null; cv.classList.add("drag"); });
  cv.addEventListener("pointermove", (e) => {
    if (dragging) {
      const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y, k = 1 / (G.r * S.zoom) / RAD, now = performance.now(), dt = Math.max(.008, (now - dragging.t) / 1000);
      S.lon -= dx * k; S.lat = clamp(S.lat + dy * k, -85, 85); vel = [dx * k / dt * .5 + vel[0] * .5, dy * k / dt * .5 + vel[1] * .5];
      dragging.x = e.clientX; dragging.y = e.clientY; dragging.t = now; dragging.moved += Math.abs(dx) + Math.abs(dy); S.dirty = true; idle = 0;
    } else {
      const p = pinAt(e.clientX, e.clientY), tip = $("#tip"); if ((p?.item || null) !== S.hover) { S.hover = p?.item || null; S.dirty = true; }
      cv.style.cursor = p ? "pointer" : ""; tip.hidden = !p;
      if (p) { tip.textContent = p.type === "site" ? p.item.name + (p.item.note ? ": " + p.item.note : "") : p.type === "origin" ? "Oldest " + p.item.name.toLowerCase() + ", " + ageText(p.ma) : p.item.title + ", " + ageText(p.ma); tip.style.left = p.x + "px"; tip.style.top = p.y + "px"; }
    }
  });
  const up = (e) => { if (!dragging) return; const d = dragging; dragging = null; cv.classList.remove("drag"); if (d.moved < 5) { vel = [0, 0]; const p = pinAt(e.clientX, e.clientY); if (p && p.type !== "site") select(p.type, p.item); } };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  cv.addEventListener("wheel", (e) => { e.preventDefault(); S.zoom = clamp(S.zoom * Math.exp(-e.deltaY * .0016), .7, 5); S.dirty = true; idle = 0; }, { passive: false });
  const tr = $("#track"); let scrub = false;
  const at = (e) => { const r = tr.getBoundingClientRect(); setPlaying(false); setMa(atX((e.clientX - r.left) / r.width)); };
  tr.addEventListener("pointerdown", (e) => { tr.setPointerCapture(e.pointerId); scrub = true; at(e); });
  tr.addEventListener("pointermove", (e) => { if (scrub) at(e); });
  tr.addEventListener("pointerup", () => { scrub = false; }); tr.addEventListener("pointercancel", () => { scrub = false; });
  $("#play").addEventListener("click", () => setPlaying(!S.playing));
  addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === " " && !e.target.closest("button, a")) { e.preventDefault(); setPlaying(!S.playing); }
    else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && IM.open) { e.preventDefault(); IM.auto = false; imPlayIcon(); imShow(IM.i + (e.key === "ArrowRight" ? 1 : -1)); }
    else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && ST) { e.preventDefault(); setPlaying(false); storyGo(ST.i + (e.key === "ArrowRight" ? 1 : -1)); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); setPlaying(false); setMa(atX(X(S.ma) + (e.key === "ArrowRight" ? 1 : -1) * (e.shiftKey ? .002 : .01))); }
    else if (e.key === "Escape" && IM.open) imClose();
    else if (e.key === "Escape" && !$("#storyList").hidden) $("#storyList").hidden = true;
    else if (e.key === "Escape" && ST && !S.sel) storyEnd();
    else if (e.key === "Escape") { if (!$("#about").hidden) $("#about").hidden = true; else if (S.sel) select(null); else if (S.life) setLife(false); }
  });
  $("#tabBody").addEventListener("click", (e) => { const b = e.target.closest("[data-ma]"); if (b) { setPlaying(false); setMa(+b.dataset.ma); } });
  $("#aroundList").addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) { const x = around[+b.dataset.i]; setPlaying(false); select(x.type, x.item); } });
  $("#picOpen").addEventListener("click", () => imOpen(picI));
  $("#picThumbs").addEventListener("click", (e) => { const b = e.target.closest("[data-p]"); if (b) { picI = +b.dataset.p; renderPic(); } });
  $("#imClose").addEventListener("click", imClose);
  $("#imPrev").addEventListener("click", () => { IM.auto = false; imPlayIcon(); imShow(IM.i - 1); }); $("#imNext").addEventListener("click", () => { IM.auto = false; imPlayIcon(); imShow(IM.i + 1); });
  $("#imPlay").addEventListener("click", () => { IM.auto = !IM.auto; IM.t = performance.now(); imPlayIcon(); });
  $("#imThumbs").addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b) { IM.auto = false; imPlayIcon(); imShow(+b.dataset.k); } });
  $("#imEarlier").addEventListener("click", () => imStep(-1)); $("#imLater").addEventListener("click", () => imStep(1));
  let sx = null; $("#immerse").addEventListener("pointerdown", (e) => { sx = e.clientX; }); $("#immerse").addEventListener("pointerup", (e) => { if (sx != null && Math.abs(e.clientX - sx) > 50 && !e.target.closest(".imthumbs")) { IM.auto = false; imPlayIcon(); imShow(IM.i + (e.clientX < sx ? 1 : -1)); } sx = null; });
  const openStories = () => { $("#storyList").hidden = false; $("#storyListClose").focus(); };
  $("#storiesBtn").addEventListener("click", openStories); $("#storiesTab").addEventListener("click", openStories);
  $("#storyList").addEventListener("click", (e) => { const c = e.target.closest("[data-s]"), f = e.target.closest("[data-f]"), fx = e.target.closest("[data-fx]");
    if (f) forceShow(+f.dataset.f); else if (fx) forceGo(+fx.dataset.fx); else if (c) storyStart(c.dataset.s); else if (e.target.id === "storyList" || e.target.closest("#storyListClose")) $("#storyList").hidden = true; });
  $("#story").addEventListener("click", (e) => { const a = e.target.closest("[data-act]"), r = e.target.closest("[data-ref]");
    if (r) { const x = storyRefs[+r.dataset.ref]; select(x.t, x.it, false); return; }
    if (!a) return; setPlaying(false); if (a.dataset.act === "prev") storyGo(ST.i - 1); else if (a.dataset.act === "next") storyGo(ST.i + 1); else storyEnd(); });
  $("#sBar").addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (b) { setPlaying(false); storyGo(+b.dataset.c); } });
  $("#sPlay").addEventListener("click", () => setPlaying(!S.playing));
  $("#sOut").addEventListener("click", () => storyEnd()); // leave the story at this moment: the whole of Earth history, same time
  $("#picPrev").addEventListener("click", () => { picI = (picI + pics.length - 1) % pics.length; renderPic(); }); $("#picNext").addEventListener("click", () => { picI = (picI + 1) % pics.length; renderPic(); });
  $("#detail").addEventListener("click", (e) => { if (e.target.closest("#detailClose")) select(null); });
  $("#milesIn").addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (b) { const m = miles[+b.dataset.m]; setPlaying(false); select(m.type, m.item); } });
  $("#recBtn").addEventListener("click", () => setRecords(!S.records));
  $("#nudgeClose").addEventListener("click", () => { nudgeShut = true; nudgeTick(); });
  $("#curvePick").addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (b) { S.curve = b.dataset.c; drawCurve(); } });
  $("#lifeBtn").addEventListener("click", () => setLife(!S.life)); $("#lifeTab").addEventListener("click", () => setLife(!S.life));
  $("#aboutTab").addEventListener("click", () => { $("#about").hidden = false; $("#aboutClose").focus(); }); $("#lifeClose").addEventListener("click", () => setLife(false));
  $("#lifeRows").addEventListener("click", (e) => {
    const f = e.target.closest("[data-fold]"), b = e.target.closest(".lrow");
    if (f) { const g = f.dataset.fold; LIFE.shut.has(g) ? LIFE.shut.delete(g) : LIFE.shut.add(g); return lifeRebuild(); }
    if (b) { setPlaying(false); select("origin", D.origins.find((o) => o.id === b.dataset.id)); }
  });
  $("#lifeSpan").addEventListener("click", (e) => { const b = e.target.closest("[data-span]"); if (!b || b.dataset.span === LIFE.span) return; LIFE.span = b.dataset.span; try { localStorage.setItem("lifeSpan", LIFE.span); } catch (er) {} lifeRebuild(); });
  $("#themeBtn").addEventListener("click", () => setView(LIGHT ? "space" : "atlas"));
  $("#aboutBtn").addEventListener("click", () => { $("#about").hidden = false; $("#aboutClose").focus(); });
  $("#about").addEventListener("click", (e) => { if (e.target.id === "about" || e.target.closest("#aboutClose")) $("#about").hidden = true; });
  addEventListener("resize", () => { layout(); if (ST) storyBar(); });
  addEventListener("hashchange", () => { const h = parseFloat(location.hash.slice(1)); if (h >= 0 && h <= OLDEST && Math.abs(h - S.ma) > .5) { setPlaying(false); select(null); setMa(h); } });
}

// ---------------------------------------------------------------- start
async function init() {
  try { glInit(); } catch (err) { $("#loading").textContent = "This page needs WebGL to draw the globe, and your browser did not start it."; console.error(err); return; }
  { const h0 = parseFloat(location.hash.slice(1)); if (h0 >= 0 && h0 <= MAPPED + 20) { const a = Math.floor(Math.min(h0, MAPPED) / 5) * 5; want(a); want(Math.min(a + 5, MAPPED)); } }
  D = await (await fetch(ROOT + "data/earth-history.json" + VQ)).json();
  for (const u of D.units) byId[u.id] = u;
  const hasKids = new Set(D.units.map((u) => u.parent));
  leaves = D.units.filter((u) => !hasKids.has(u.id)).sort((a, b) => b.from - a.from);
  tops = ["hadean", "archean", "proterozoic", "paleozoic", "mesozoic", "cenozoic"].map((id) => byId[id]).filter(Boolean);
  $("#curvePick").innerHTML = CURVES.filter(([id]) => D.curves.some((c) => c.id === id)).map(([id, n]) => `<button type="button" data-c="${id}" aria-pressed="${id === S.curve}">${n}</button>`).join("");
  const h = parseFloat(location.hash.slice(1)); if (h >= 0 && h <= OLDEST) S.ma = h;
  let rec = false; try { rec = localStorage.getItem("deepRecords") === "1"; } catch (e) {} setRecords(rec, true);
  buildMiles(); buildLife(); buildAbout(); storyCards(); forceCards(); wire(); setView(LIGHT ? "atlas" : "space"); renderNow(); imPlayIcon();
  const sm = location.hash.match(/^#s\/([\w-]+)\/(\d+)/); if (sm) storyStart(sm[1], +sm[2] - 1);
  if (S.ma > MAPPED + 20 || [...tex.values()].some((o) => o.ready)) $("#loading").classList.add("done");
  if (S.ma > MAPPED) { want(MAPPED); want(MAPPED - 5); } // only fetch ahead for the oldest map when starting before it; otherwise draw() asks for the maps it needs
  requestAnimationFrame(frame);
}
init();

// "Report an issue" (../report/report.js) asks what the reader is looking at, so each report says where it came from
window.atlasReportContext = () => {
  const it = S.sel?.item, r = { page: "Earth history", time: ageText(S.ma), period: leaves.length ? unitAt(S.ma)?.name || "" : "" };
  if (it) r.focus = it.title || it.name || "";
  if (ST) { const n = ST.story.chapters.length, ch = ST.story.chapters[ST.i]; r.story = ST.story.title; r.chapter = `${ST.i + 1} of ${n}${ch?.title ? ": " + ch.title : ""}`; }
  r.view = S.life ? "Life through time" : document.querySelector("#app")?.dataset.records ? `Climate records: ${S.curve}` : "Globe";
  r.map = LIGHT ? "Atlas look" : "Space look";
  return r;
};
