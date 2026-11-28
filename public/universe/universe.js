/* The universe before the Earth (public/universe/): ten scenes drawn live with WebGL 2, from the Big Bang to the young Earth.
   Each scene is one fragment shader; the timeline, card and dock are plain DOM. See index.html and universe.css. */
(()=>{
'use strict';
const F=2.0; // seconds of cross-fade between scenes
const INFLATION_GUIDE_SCALE=2.6;

const SCENES=[
 {era:'Speculative · Artist’s impression',clock:'',unit:'',ago:'About 13.8 billion years ago',title:'A quantum beginning',
  lede:'In some proposals, space and time emerge from a quantum state. How that might lead to inflation is unknown.',
  temp:'Unknown',what:'A proposed quantum state of space and time',sure:'Speculative',
  more:'Einstein’s equations predict a singularity when run backward. A theory of quantum gravity may describe this limit differently. This moving pattern is an artist’s impression of one possibility.',
  src:'Sources: Hartle and Hawking, Wave Function of the Universe (1983); Max Planck Institute, Einstein Online',dur:8,acc:'#aeeaeb',aot:0},
 {era:'Inflation · Hypothesis',clock:'10<sup>−36</sup>',unit:'seconds after the Big Bang',ago:'until about 10⁻³² seconds',title:'Space stretches',
  lede:'Space may have expanded extremely rapidly. Follow the three gaps as they grow by the same factor.',
  temp:'The universe may have reheated at the end of inflation',what:'An unknown source driving rapid expansion',sure:'Hypothesis',
  more:'Inflation could explain why the sky looks nearly the same in every direction. It could also have stretched tiny fluctuations into the seeds of galaxies. The pattern and distance multiplier illustrate the idea. The actual expansion in inflation models is vastly larger.',
  src:'Sources: Guth 1981, Physical Review D; Planck Collaboration 2018, constraints on inflation',dur:13,acc:'#b89cff',aot:0,
  live:(t,d)=>'Illustrative scale: '+Math.pow(INFLATION_GUIDE_SCALE,clamp((t-F)/d,0,1)).toFixed(1)+'×'},
 {era:'Quark epoch',clock:'10<sup>−12</sup>',unit:'seconds after the Big Bang',ago:'until about ten millionths of a second',title:'A soup of quarks',
  lede:'Too hot for protons to hold together: quarks and gluons swim free.',
  temp:'Above about 2 trillion K',what:'Quarks, gluons, electrons, neutrinos and light',sure:'Well supported',
  more:'By about a trillionth of a second the Higgs field had given particles their mass. Matter was a plasma of quarks and the gluons that bind them. Physicists recreate this soup for an instant by smashing heavy nuclei together at CERN’s Large Hadron Collider and at Brookhaven’s RHIC. Quarks are drawn here in red, green and blue for their three “colour” charges; the pale threads are gluons.',
  src:'Sources: CERN, heavy ions and quark–gluon plasma; Brookhaven National Laboratory, RHIC',dur:12,acc:'#ff8a55',aot:0},
 {era:'Big Bang nucleosynthesis',clock:'3',unit:'minutes after the Big Bang',ago:'from about 10 seconds to 20 minutes',title:'The first nuclei',
  lede:'In twenty minutes the universe settles its mix: three-quarters hydrogen, a quarter helium.',
  temp:'About 1 billion K',what:'Protons, neutrons and the first nuclei',sure:'Well supported',
  more:'By about ten millionths of a second quarks had locked into protons (drawn red) and neutrons (drawn pale blue). From about ten seconds to twenty minutes they fused into the first nuclei: by mass, 75% hydrogen and 25% helium, with a trace of lithium, the same mix we still measure in the oldest gas. Every heavier atom was made later, in stars.',
  src:'Source: Fields, Olive, Yeh and Young 2020, Big-Bang nucleosynthesis after Planck',dur:13,acc:'#ffb85c',aot:0,
  live:(t)=>'Helium by mass: '+Math.round(25*clamp((t-2.2)/10.4,0,1))+'%'},
 {era:'Recombination',clock:'380,000',unit:'years after the Big Bang',ago:'13.8 billion years ago',title:'The first light',
  lede:'The glowing fog clears, and light crosses space for the first time.',
  temp:'About 3,000 K then; 2.7 K now',what:'The first atoms: hydrogen and helium',sure:'Well supported',
  more:'Until now the universe was a plasma that light could not cross. Cooled to about 3,000 K, electrons settled onto nuclei and the fog cleared. That light still reaches us from every direction, stretched into microwaves: the cosmic microwave background. We sit at the centre of it: this light reaches us from every direction, as if from the inside of a vast glowing shell. The colours shift to the Planck map’s, cooler blue to warmer red, which exaggerate spots that differ by about one part in 100,000. The pattern is drawn, not the real map.',
  src:'Sources: Planck Collaboration 2018; Fixsen 2009, temperature of the cosmic microwave background',dur:14,acc:'#ff9a52',aot:.003},
 {era:'The cosmic web',clock:'50',unit:'million years after the Big Bang',ago:'from 380,000 to about 100 million years',title:'The dark ages',
  lede:'No stars yet. In the dark, gravity draws matter into a web.',
  temp:'Leftover light cools from 3,000 K to about 85 K',what:'Hydrogen, helium and dark matter',sure:'Well supported',
  more:'Dark matter, about five times as plentiful as ordinary matter, gives off no light but does pull. The denser patches grew, and gas flowed along strands into knots where they met. It is drawn here as computer simulations show it, brighter where denser; in truth it gives off no light at all. Radio telescopes are searching for the faint signal this hydrogen gave off.',
  src:'Sources: Planck Collaboration 2018, dark and ordinary matter; Springel et al. 2005, the Millennium Simulation',dur:12,acc:'#e8b86a',aot:.004,
  live:(t,d)=>{const k=clamp(t/(d+F),0,1);const T=3000*Math.pow(85/3000,k);return 'Leftover light: '+(T>=1000?Math.round(T/100)*100:Math.round(T/10)*10).toLocaleString('en')+' K';}},
 {era:'Cosmic dawn',clock:'200',unit:'million years after the Big Bang',ago:'about 100 to 250 million years',title:'The first stars',
  lede:'In the knots of the web, the first stars switch on.',
  temp:'Star surfaces near 100,000 K',what:'Giant stars made only of hydrogen and helium',sure:'Likely: none confirmed yet',
  more:'The first stars were probably tens to hundreds of times the Sun’s mass. They burned out within a few million years, and their explosions made the first carbon, oxygen and iron: the beginning of the atoms in planets and in people. None has been confirmed yet; a faint, lensed galaxy called LAP1 is a candidate.',
  src:'Source: Bromm 2013, Formation of the first stars, Reports on Progress in Physics',dur:13,acc:'#7cc0ff',aot:.015},
 {era:'Reionization',clock:'290',unit:'million years after the Big Bang',ago:'250 million to 1 billion years',title:'The first galaxies',
  lede:'Stars gather into galaxies, and their light clears space a second time.',
  temp:'Cleared gas heated to about 10,000 K',what:'Small, bright galaxies and the first big black holes',sure:'Well supported: seen by telescopes',
  more:'The James Webb Space Telescope has seen galaxies as they were less than 300 million years after the Big Bang: MoM-z14 at about 280 million years, and JADES-GS-z14-0 at about 290. Their ultraviolet light split hydrogen atoms apart again, opening bubbles (the clear patches) in the grey haze of neutral gas. The bubbles grew and merged; by about a billion years the gas between galaxies had been cleared.',
  src:'Sources: Carniani et al. 2024, Nature, JADES-GS-z14-0; Naidu et al. 2025, MoM-z14',dur:13,acc:'#4fd1c5',aot:.021,
  live:(t)=>t>10.5?'Closer in: one young galaxy like these grew into the Milky Way':''},
 {era:'Cosmic noon',clock:'3.8',unit:'billion years after the Big Bang',ago:'10 billion years ago · peak from about 2 to 6 billion years',title:'Our galaxy takes shape',
  lede:'Galaxies grow by making stars and swallowing their neighbours. The Milky Way is one.',
  temp:'Leftover light under 10 K',what:'Galaxies everywhere; ours with a disc and a halo',sure:'Well supported',
  more:'Star birth across the universe peaked about 3.5 billion years after the Big Bang, at roughly ten times today’s rate. The Milky Way’s oldest stars are over 12 billion years old. The faint arc of stars is Gaia-Enceladus, a smaller galaxy it swallowed, still traceable by the Gaia satellite. The dashed ring marks the Sun’s orbit today, about 27,000 light-years from the centre. The Sun, born 5 billion years later, probably formed several thousand light-years farther in and drifted outward.',
  src:'Sources: Madau and Dickinson 2014; Helmi et al. 2018, Nature; GRAVITY Collaboration 2019; Minchev et al. 2013, radial migration',dur:14,acc:'#f2c46d',aot:.276},
 {era:'The solar system forms',clock:'9.22',unit:'billion years after the Big Bang',ago:'4,567 million years ago',title:'The Sun and the Earth',
  lede:'A cloud of gas and dust collapses. A star lights up, and rock gathers around it.',
  temp:'The young Sun glows as it contracts; fusion comes later',what:'A young Sun and a disc of dust, ice and rock',sure:'Well supported: dated in meteorites',
  more:'The cloud’s gas held atoms made by generations of earlier stars. Beyond the snow line (where the disc turns paler) water freezes into ice. The rings and gaps follow ALMA’s 2014 picture of the young star HL Tauri. The Earth grows from dust to a planet over roughly 10 to 100 million years, hot and molten at first. The young Sun shone at first by contracting; steady fusion in its core began within tens of millions of years. The oldest solids in the solar system are 4,567 million years old.',
  src:'Sources: Connelly et al. 2012, Science, the solar system’s first solids; ALMA Partnership 2015, HL Tauri; Montmerle et al. 2006, the first 100 million years',dur:18,acc:'#ffb15a',aot:.669,
  live:(t)=>t<11.5?'The young Sun and its disc: 4,567 million years ago':'Closer in, and later: the young Earth, 10 to 100 million years on, still molten'}, // the camera's move to the Earth also skips ahead in time
];
function clamp(x,a,b){return Math.min(b,Math.max(a,x));}
const N=SCENES.length, START=[]; let TOTAL=0;
for(const s of SCENES){START.push(TOTAL);TOTAL+=s.dur;}

/* ---------------------------------------------------------------- GLSL */
const VS=`#version 300 es
in vec2 p; out vec2 vUv;
void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

const HEAD=`#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uT,uG,uZ; uniform vec2 uOff;
out vec4 fragColor;
#define PI 3.14159265
#define TAU 6.2831853
float h21(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
vec2 h22(vec2 p){vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));q+=dot(q,q.yzx+33.33);return fract((q.xx+q.yz)*q.zy);}
float h31(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
 return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x),u.y);}
float vn3(vec3 p){vec3 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
 float a=h31(i),b=h31(i+vec3(1,0,0)),c=h31(i+vec3(0,1,0)),d=h31(i+vec3(1,1,0)),
       e=h31(i+vec3(0,0,1)),g=h31(i+vec3(1,0,1)),k=h31(i+vec3(0,1,1)),l=h31(i+vec3(1,1,1));
 return mix(mix(mix(a,b,u.x),mix(c,d,u.x),u.y),mix(mix(e,g,u.x),mix(k,l,u.x),u.y),u.z);}
const mat2 M2=mat2(1.6,1.2,-1.2,1.6);
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<6;i++){s+=a*vn(p);p=M2*p+vec2(3.1,1.7);a*=.5;}return s;}
float fbm4(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*vn(p);p=M2*p+vec2(3.1,1.7);a*=.5;}return s;}
float fbm3(vec3 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vn3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec3 bb(float t){t=clamp(t,0.,1.6);return pow(vec3(t),vec3(1.,2.2,4.))*vec3(2.,1.45,1.15);}
float px(){return 2.*uZ/uRes.y;}
// one camera move from the first galaxies (scene 8) into our galaxy (scene 9): tau counts seconds from 2 s before the cross-fade,
// and both scenes scale by this same curve, so the young galaxy and the spiral are the same size on screen as one fades into the other
float zoomG(float tau){return exp(2.81*smoothstep(0.,6.,tau));}
// one star per lit cell; sizes are set in screen pixels so they stay sharp at any resolution
// integer hash for the star field: the float hash above leaves a faint column of extra stars where cell numbers line up
float hs(vec2 p){uvec2 q=uvec2(ivec2(p)+ivec2(65536));q=1103515245U*((q>>1U)^q.yx);uint n=1103515245U*(q.x^(q.y>>3U));return float(n)*(1./4294967295.);}
vec3 stars(vec2 p,float sc,float dens,float seed){
 vec2 g=p*sc,i=floor(g),f=fract(g)-.5;
 float b=hs(i+vec2(seed*17.,seed*31.));
 if(b>dens) return vec3(0);
 vec2 o=(vec2(hs(i+vec2(seed*53.+7.,seed*11.)),hs(i+vec2(seed*13.,seed*59.+3.)))-.5)*.7; vec2 d=f-o;
 float pw=sc*px(); float m=b/dens;
 float sz=pw*(.6+1.5*m*m);
 float core=exp(-dot(d,d)/(sz*sz));
 float tw=.8+.2*sin(uG*(1.+3.*m)+b*80.);
 vec3 c=mix(vec3(1.,.8,.62),vec3(.74,.84,1.),hs(i+vec2(seed*29.+4.,seed*71.)));
 return c*core*(.25+1.3*m*m*m)*tw;
}
vec3 scene(vec2 uv,float t);
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y*2.*uZ-uOff;
 fragColor=vec4(aces(scene(uv,uT)),1.);
}
`;

const SHADERS=[
/* 1 A quantum beginning: a moving pattern to suggest a proposed quantum state. */
`vec3 scene(vec2 uv,float time){
  float t=max(0.,time-${F.toFixed(1)});
  vec2 p=uv*2.4+vec2(2.3,-4.6);
  vec2 w=vec2(fbm3(vec3(p*1.1,t*.18)),fbm3(vec3(p*1.1+vec2(5.,-7.),-t*.16)))-.5;
  vec2 q=p+w*3.9;
  float a=fbm3(vec3(q*2.1,t*.23));
  float b=fbm3(vec3(q*2.4+vec2(-7.2,1.3),t*.21+8.));
  float detail=fbm3(vec3(q*6.8,t*.40+6.));
  float teal=exp(-abs(a-.47)*(12.+12.*detail))*(.21+.65*detail);
  float violet=exp(-abs(b-.51)*(16.+18.*detail))*(.18+.63*detail);
  float mist=fbm3(vec3(q*.95,t*.16+4.));
  return vec3(.014,.010,.040)+vec3(.07,.23,.43)*mist
      +vec3(.12,.88,.94)*teal*.53+vec3(.80,.28,.95)*violet*.57;
}`,

/* 2 Inflation: diffuse ripples stretch as three reference gaps grow by the same factor. */
`float crossDistance(vec2 p){
 vec2 d=abs(p);
 return min(max(d.x-1.2,d.y-5.),max(d.x-5.,d.y-1.2));
}
vec3 referencePair(vec3 col,vec2 uv,vec2 a,vec2 b){
 float pixel=px();
 vec2 ab=b-a;
 float along=clamp(dot(uv-a,ab)/dot(ab,ab),0.,1.);
 float line=length(uv-a-along*ab)/pixel;
 float cross=min(crossDistance((uv-a)/pixel),crossDistance((uv-b)/pixel));
 vec3 ink=vec3(.075,.042,.025);
 col=mix(col,vec3(.45,.40,.67),.48*(1.-smoothstep(.45,1.4,line)));
 col=mix(col,ink,1.-smoothstep(1.,2.,cross));
 return mix(col,vec3(1.6,1.48,1.12),1.-smoothstep(-.6,.4,cross));
}
vec3 scene(vec2 uv,float t){
 float z=t*.62; float s=fract(z),fz=floor(z);
 vec3 col=vec3(.018,.022,.062);
 for(int i=0;i<6;i++){
  float k=float(i)-s;
  float w=sin(PI*clamp((k+1.)/6.,0.,1.)); w*=w;
  float sc=exp2(k)*.6;
  float seed=float(i)+fz;
  mat2 R=rot(seed*.37);
  vec2 p=R*uv*sc+h22(vec2(seed,3.))*10.;
  // ripples: soft warm and cool patches, the seeds of later structure
  float q=(vn(p*.7+seed*3.1)-.5)+(vn(p*1.6+seed*1.3)-.5)*.5+(vn(p*3.4+seed*.7)-.5)*.25;
  vec3 rip=q>0.?vec3(1.,.42,.26):vec3(.28,.52,1.);
  col+=w*rip*smoothstep(.04,.38,abs(q))*.19;
 }
 // quantum shimmer at the smallest scale
 col+=vec3(.6,.7,1.)*pow(vn(uv*110.+floor(uG*12.)*13.7),7.)*.018;
 float reheat=smoothstep(11.5,15.,t);
 col+=bb(.75)*reheat*(.4+.6*fbm4(uv*3.+t))*.8;
 // Fit all three pairs on narrow screens and apply the same scale factor to each.
 float progress=clamp((t-${F.toFixed(1)})/${SCENES[1].dur.toFixed(1)},0.,1.);
 float halfWidth=uRes.x*uZ/uRes.y-abs(uOff.x);
 float marks=pow(${INFLATION_GUIDE_SCALE},progress)*min(1.,halfWidth/.98);
 vec3 guides=referencePair(col,uv,marks*vec2(-.34,.08),marks*vec2(-.12,.24));
 guides=referencePair(guides,uv,marks*vec2(.15,.22),marks*vec2(.34,.04));
 guides=referencePair(guides,uv,marks*vec2(-.24,-.22),marks*vec2(.19,-.17));
 return mix(col,guides,smoothstep(1.,2.8,t));
}`,

/* 3 Quark soup: a churning plasma with red, green and blue quarks and flickering gluon strings.
   Each pixel looks at its own cell and the eight around it, so glows and strings cross cell edges without being cut off */
`vec3 qp(vec2 c,float fl,float t){
 float hh=h21(c+fl*31.);
 vec2 pos=c+.5+(h22(c+fl*13.)-.5)*.56+.1*vec2(sin(t*(1.4+hh*3.)+hh*40.),cos(t*(1.2+hh*2.6)+hh*20.));
 return vec3(pos,hh);
}
float seg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float k=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*k);}
vec3 scene(vec2 uv,float t){
 vec2 p=rot(t*.015)*uv*(1.-.01*t);
 vec2 w1=vec2(fbm4(p*1.1+t*.11),fbm4(p*1.1+vec2(5.2,1.3)-t*.09));
 vec2 w2=vec2(fbm4(p*1.9+w1*2.+vec2(1.7,9.2)+t*.07),fbm4(p*1.9+w1*2.+vec2(8.3,2.8)-t*.05));
 float h=fbm(p*1.5+w2*2.);
 float fil=pow(1.-abs(2.*fbm4(p*2.6+w2*1.6-t*.08)-1.),7.);
 vec3 col=bb(.18+.55*h)*(.03+.46*h*h*h)+bb(.82)*fil*(.05+.3*h*h);
 for(int L=0;L<3;L++){
  float fl=float(L);
  float sc=2.8+fl*2.4;
  float par=1.+fl*.22;
  vec2 g=(p*par+vec2(t*.035*(fl+1.),-t*.02*(fl+.5)))*sc;
  vec2 id=floor(g);
  float pw=sc*par*px();
  float depth=1.-fl*.28;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
   vec2 c=id+vec2(x,y);
   vec3 a=qp(c,fl,t);
   if(a.z>.5) continue;
   vec2 d=g-a.xy; float r2=dot(d,d);
   float sz=pw*(2.2+2.6*fract(a.z*13.))*(1.3-fl*.25);
   float kind=fract(a.z*7.3);
   vec3 qc=kind<.34?vec3(1.,.24,.2):kind<.67?vec3(.3,1.,.45):vec3(.36,.55,1.);
   col+=qc*(exp(-r2/(sz*sz))*1.7+exp(-sqrt(r2)/(sz*2.6))*.3)*depth*(.85+.15*sin(t*7.+a.z*50.));
   // a gluon string to the quark in the next cell, switching on and off
   vec2 nb=c+(fract(a.z*31.)<.5?vec2(1,0):vec2(0,1));
   vec3 b=qp(nb,fl,t);
   float on=smoothstep(.2,.45,sin(t*(.6+a.z)+a.z*90.))*step(b.z,.5)*step(.22,fract(a.z*17.));
   if(on>0.){
    vec2 ab=b.xy-a.xy; float ln=length(ab);
    vec2 nrm=vec2(-ab.y,ab.x)/ln;
    float al=clamp(dot(g-a.xy,ab)/(ln*ln),0.,1.);
    vec2 pp=g-nrm*sin(al*PI*3.+t*9.+a.z*20.)*.035*sin(al*PI);
    float dd=seg(pp,a.xy,b.xy);
    float lw=pw*(1.1-fl*.15);
    col+=vec3(1.,.83,.55)*(exp(-dd*dd/(lw*lw))*.9+exp(-dd/(lw*5.))*.12)*on*depth*smoothstep(0.,.15,al)*smoothstep(1.,.85,al);
   }
  }
 }
 col*=1.+.2*exp(-dot(uv,uv)*.5);
 return col;
}`,

/* 4 First nuclei: protons and neutrons drifting; a few groups fuse into helium-4 with a flash.
   Like the quarks, each pixel checks the neighbouring cells, so particles can sit anywhere without lining up on a grid */
`vec3 nucleon(vec2 d,float sz,vec3 c){float r2=dot(d,d);return c*(exp(-r2/(sz*sz))*1.5+exp(-sqrt(r2)/(sz*2.2))*.22);}
vec3 scene(vec2 uv,float t){
 float cool=clamp(t/15.,0.,1.);
 vec2 p=uv*(1.1-.1*cool);
 float h=fbm(p*1.4+vec2(t*.04,0.));
 vec3 col=bb(.6-.28*cool)*(.09+.2*h*h);
 vec3 PR=vec3(1.,.42,.28),NE=vec3(.72,.82,1.);
 for(int L=0;L<3;L++){
  float fl=float(L);
  float sc=2.6+fl*2.2;
  float par=1.+fl*.25;
  vec2 g=(p*par+vec2(.05,.02)*t*(1.+fl))*sc;
  vec2 id=floor(g);
  float pw=sc*par*px();
  float dim=1.-fl*.3;
  float sz=max(.013*sc*par*(1.-fl*.28),pw*2.);
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
   vec2 c=id+vec2(x,y);
   float hh=h21(c+fl*41.),h2=h21(c+fl*7.+3.);
   if(h2>.42) continue;
   vec2 c0=c+.5+(h22(c+fl*11.)-.5)*.7+.06*vec2(sin(t*.9+hh*30.),cos(t*.8+hh*17.));
   vec2 d=g-c0;
   if(hh<.1){
    // two protons and two neutrons close in and fuse into helium-4
    float tf=2.6+h2*23.;
    float k=smoothstep(tf-1.8,tf,t);
    float rad=mix(.3,sz*1.15,k);
    float ang=t*(.6+h2)+hh*20.;
    for(int j=0;j<4;j++){
     float aj=ang+float(j)*1.5708;
     float ev=mod(float(j),2.);
     col+=nucleon(d-vec2(cos(aj),sin(aj))*rad,sz,ev<.5?PR:NE)*dim;
    }
    float fa=max(t-tf,0.);
    col+=vec3(1.,.9,.7)*exp(-fa*2.2)*step(tf,t)*exp(-dot(d,d)/(sz*sz*30.))*2.2*dim;
   } else if(hh<.17){
    // free neutrons: most are soon used up in helium or decay
    col+=nucleon(d,sz*.95,NE)*dim*(1.-smoothstep(3.,12.,t+h2*4.));
   } else {
    col+=nucleon(d,sz,PR)*dim;
   }
  }
 }
 col+=stars(p*1.3+vec2(t*.22,t*.13),16.,.25,5.)*vec3(.55,.75,1.)*.8;
 return col;
}`,

/* 5 First light: the orange fog of plasma clears, and we are inside the glow. This light reaches us from every direction, so the camera
   sits at the centre of the glowing shell, turning slowly, and the view widens to a fisheye until the pattern wraps all the way round */
`vec3 cmap(float v){v=clamp(v*.5+.5,0.,1.);
 vec3 a=vec3(.02,.07,.42),b=vec3(.13,.52,1.),c=vec3(.98,.95,.88),d=vec3(1.,.55,.12),e=vec3(.62,.06,.03);
 return v<.25?mix(a,b,v*4.):v<.5?mix(b,c,v*4.-1.):v<.75?mix(c,d,v*4.-2.):mix(d,e,v*4.-3.);}
vec3 scene(vec2 uv,float t){
 float clear=smoothstep(3.,8.5,t);
 float wide=smoothstep(6.,14.5,t);
 float r=length(uv); vec2 d2=uv/max(r,1e-4);
 // equidistant fisheye: distance from the centre of the screen is the angle away from where we look
 float th=r*mix(.45,1.62,wide*wide*(3.-2.*wide));
 vec3 rd=vec3(d2*sin(th),cos(th));
 rd.yz*=rot(.3+.03*t); rd.xz*=rot(.8+t*.09);
 float v=(fbm3(rd*4.5+2.)-.5)*2.5+(vn3(rd*13.)-.5)*.7+(vn3(rd*30.)-.5)*.25;
 // first a nearly even 3,000 K glow; then the colours of the Planck map, which exaggerate differences of one part in 100,000
 vec3 glow=bb(.62+.05*v)*(.42+.08*v);
 vec3 col=mix(glow,cmap(v)*.36,smoothstep(7.5,12.5,t));
 col*=1.-.35*smoothstep(.9,2.,r);
 // the fog of plasma, clearing in patches
 vec2 fp=uv*(1.+t*.04);
 float f=fbm(fp*1.8+vec2(t*.08,-t*.05)+fbm4(fp*2.6-t*.07)*1.2);
 vec3 fog=bb(.6+.3*f)*(.55+.6*f);
 float cl=smoothstep(f-.12,f+.12,clear*1.45-.2);
 return mix(fog,col,cl);
}`,

/* 6 Dark ages: drifting through the cosmic web as the simulations show it, brighter where denser.
   In truth none of this gave off light; the web grows more contrasted as gravity pulls matter in */
`vec3 voro(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.,d3=8.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y);vec2 r=g+h22(i+g)-f;float d=dot(r,r);
  if(d<d1){d3=d2;d2=d1;d1=d;}else if(d<d2){d3=d2;d2=d;}else if(d<d3){d3=d;}}
 return sqrt(vec3(d1,d2,d3));}
// the web, after the Millennium and IllustrisTNG renders: strands of uneven thickness and brightness, thin ones feeding in,
// clumpy knots where strands meet, and wide empty voids. Returns (strands, knots)
vec2 web(vec2 p){
 float L=fbm4(p*.25+9.);
 p+=(vec2(fbm4(p*.55),fbm4(p*.55+5.3))-.5)*1.1;
 vec3 v=voro(p);
 float e=v.y-v.x;
 float th=.018+.07*pow(vn(p*.8+3.),2.);
 float br=(.15+.85*smoothstep(.2,.75,vn(p*1.2+11.)))*smoothstep(.22,.58,L);
 float fil=(exp(-e*e/(th*th))+exp(-e/(th*4.))*.2)*br;
 vec3 v2=voro(p*2.7+7.);
 float e2=v2.y-v2.x;
 float sub=(exp(-e2*e2/.0009)+exp(-e2/.05)*.15)*smoothstep(.38,.7,L)*(.3+.7*exp(-e*3.))*.55*vn(p*2.2+4.);
 float clumps=pow(vn(p*16.),5.)*(fil+sub)*2.6;
 float k=v.z-v.x;
 float knot=(exp(-k*13.)+exp(-k*5.)*.35)*(.45+.9*vn(p*5.+2.))*smoothstep(.2,.55,L);
 return vec2(fil+sub+clumps,knot);
}
// density colours: black voids, dull ember strands, gold where dense, near white in the knots
vec3 ramp(float d){d=max(d,0.);
 vec3 c=mix(vec3(0.),vec3(.26,.08,.03),smoothstep(0.,.35,d));
 c=mix(c,vec3(.95,.56,.2),smoothstep(.3,.95,d));
 return mix(c,vec3(1.,.93,.82),smoothstep(.95,1.6,d));}
vec3 scene(vec2 uv,float t){
 vec3 col=vec3(.004,.004,.01)+vec3(.32,.09,.04)*exp(-t*.45)*.3;
 float grow=mix(.45,1.,smoothstep(0.,11.,t));
 vec2 drift=vec2(t*.014,t*.006);
 float z=1.2-.02*t;
 vec2 wf=web((uv*z*.62+drift*.45)*1.4+20.);
 col+=ramp((wf.x*.6+wf.y*.7)*grow)*.3;
 vec2 wn=web((uv*z+drift)*1.4);
 col+=ramp((wn.x*.8+wn.y*.95)*grow)*.9;
 return col;
}`,

/* 7 First stars: the same web, dimmer, with blue-white giants switching on in its densest knots, then one explodes */
`vec3 voro(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.,d3=8.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y);vec2 r=g+h22(i+g)-f;float d=dot(r,r);
  if(d<d1){d3=d2;d2=d1;d1=d;}else if(d<d2){d3=d2;d2=d;}else if(d<d3){d3=d;}}
 return sqrt(vec3(d1,d2,d3));}
// the web, after the Millennium and IllustrisTNG renders: strands of uneven thickness and brightness, thin ones feeding in,
// clumpy knots where strands meet, and wide empty voids. Returns (strands, knots)
vec2 web(vec2 p){
 float L=fbm4(p*.25+9.);
 p+=(vec2(fbm4(p*.55),fbm4(p*.55+5.3))-.5)*1.1;
 vec3 v=voro(p);
 float e=v.y-v.x;
 float th=.018+.07*pow(vn(p*.8+3.),2.);
 float br=(.15+.85*smoothstep(.2,.75,vn(p*1.2+11.)))*smoothstep(.22,.58,L);
 float fil=(exp(-e*e/(th*th))+exp(-e/(th*4.))*.2)*br;
 vec3 v2=voro(p*2.7+7.);
 float e2=v2.y-v2.x;
 float sub=(exp(-e2*e2/.0009)+exp(-e2/.05)*.15)*smoothstep(.38,.7,L)*(.3+.7*exp(-e*3.))*.55*vn(p*2.2+4.);
 float clumps=pow(vn(p*16.),5.)*(fil+sub)*2.6;
 float k=v.z-v.x;
 float knot=(exp(-k*13.)+exp(-k*5.)*.35)*(.45+.9*vn(p*5.+2.))*smoothstep(.2,.55,L);
 return vec2(fil+sub+clumps,knot);
}
// density colours: black voids, dull ember strands, gold where dense, near white in the knots
vec3 ramp(float d){d=max(d,0.);
 vec3 c=mix(vec3(0.),vec3(.26,.08,.03),smoothstep(0.,.35,d));
 c=mix(c,vec3(.95,.56,.2),smoothstep(.3,.95,d));
 return mix(c,vec3(1.,.93,.82),smoothstep(.95,1.6,d));}
vec3 scene(vec2 uv,float t){
 vec3 col=vec3(.004,.004,.012);
 vec2 drift=vec2((t+14.)*.014,(t+14.)*.006);
 float z=.92-.02*t;
 vec2 wf=web((uv*z*.62+drift*.45)*1.4+20.);
 col+=ramp(wf.x*.6+wf.y*.7)*.18;
 vec2 q=(uv*z+drift)*1.4;
 vec2 wn=web(q);
 col+=ramp(wn.x*.8+wn.y*.95)*.55;
 // candidate stars, one per cell; a star lights only where the web is densest
 float gs=4.5;
 vec2 g=q*gs,id=floor(g),f=fract(g)-.5;
 vec2 o=(h22(id+5.1)-.5)*.6;
 vec2 ws=web((id+.5+o)/gs);
 float ign=1.2+h21(id+1.7)*9.5;
 float on=smoothstep(.12,.4,ws.y+ws.x*.6)*step(h21(id+5.3),.85)*smoothstep(ign,ign+.5,t); // one star to a dense patch: many across the web, none in the voids
 vec2 d=(f-o)/gs;
 float pp=1.4*z*px();
 float r2=dot(d,d);
 float core=exp(-r2/(pp*pp*3.));
 // halo and bubble are sized in cell units (a cell is 0.22 wide), so they fade out well inside the cell at any resolution.
 // No four-point spikes: those are made by a telescope's struts, and nothing here is seen through one
 float halo=exp(-sqrt(r2)/.011)*.35;
 float birth=1.+2.5*exp(-max(t-ign,0.)*1.5);
 col+=vec3(.68,.8,1.)*(core*3.+halo)*on*birth;
 // each star's ultraviolet splits the hydrogen around it, opening a small glowing bubble that grows for the star's few million
 // years of life: the first, local step of the clearing the next scene shows (Bromm 2013)
 float age=max(t-ign,0.), Rb=.012+.034*(1.-exp(-age*.45));
 float rb=sqrt(r2)/Rb*(1.+.25*(vn(d*90.+id)-.5));
 col+=(vec3(.16,.32,.75)*smoothstep(1.,.15,rb)*.5+vec3(.3,.55,1.)*exp(-pow((rb-1.)*5.,2.))*.3)*on;
 vec2 sn=uv-vec2(.32,.16);
 float te=t-8.5, rs=length(sn);
 if(te<0.){
  col+=vec3(.7,.82,1.)*(exp(-rs*rs/(px()*px()*6.))*3.+exp(-rs*40.)*.35)*smoothstep(1.,2.5,t);
 } else {
  // the remnant stays small against the web: a first star's supernova spreads its new elements over a few thousand light years,
  // while the strands around it are tens of times longer (Bromm 2013), so even exaggerated it covers only a knot
  // a cloud, not a ring: hot gas fills the remnant, brightest at its rim where it sweeps up the gas around it, blue-white
  // at first and redder as it cools; its newly made carbon, oxygen and iron go out with it
  float Rs=.02+.1*sqrt(te*.4);
  float rag=fbm4(sn*7./Rs+te*.15);
  float x=rs/(Rs*(.88+.24*rag));
  float fill=smoothstep(1.08,.2,x)*(.35+.65*fbm4(sn*16./Rs-te*.2));
  float rim=exp(-pow((x-.94)*4.5,2.))*(.2+.9*rag*rag);
  vec3 hot=mix(vec3(.55,.8,1.),vec3(1.,.55,.28),smoothstep(.5,4.5,te)*(.4+.6*fbm4(sn*5.+3.)));
  col+=hot*(fill*.4+rim*.75)*exp(-te*.2);
  col+=vec3(1.)*exp(-te*2.)*exp(-rs*rs*300.)*6.;
  col+=vec3(.8,.9,1.)*exp(-te*.9)*exp(-rs*14.)*.8;
 }
 return col;
}`,

/* 8 First galaxies: young galaxies blow clear bubbles in the grey haze of neutral hydrogen.
   The bubbles come from one summed field of starlight, so where they overlap they merge, and a glowing edge shows only on the outside */
`// a galaxy this young is small, compact and lumpy, not a spiral: JWST measures JADES-GS-z14-0 at about 260 pc in radius and MoM-z14 under 100 pc,
// blue with young stars (Carniani et al. 2024; Naidu et al. 2025). So: a few bright knots of star birth in a faint blue glow
vec3 galaxy(vec2 d,float sz,float h,float t){
 vec3 c=vec3(0);
 for(int i=0;i<4;i++){
  float fi=float(i);
  vec2 o=(vec2(h21(vec2(h*17.+fi,3.)),h21(vec2(h*29.+fi,7.)))-.5)*sz*1.3;
  o=rot(t*.03*(h-.5))*o;
  float s=sz*(.18+.2*h21(vec2(h*5.+fi,1.)));
  vec2 k=d-o;
  c+=vec3(.52,.7,1.)*exp(-dot(k,k)/(s*s))*(.4+.8*h21(vec2(fi,h*11.)));
 }
 float r2=dot(d,d)/(sz*sz);
 return c*1.05+vec3(.4,.55,1.)*exp(-r2*1.1)*.28+vec3(.85,.9,1.)*exp(-r2*14.)*.3;
}
// the Milky Way's own ancestor, at the centre: the same kind of lumpy young galaxy, with more knots and loose stars to hold up close
vec3 hero(vec2 d,float t){
 const float sz=.05; vec3 c=vec3(0);
 for(int i=0;i<7;i++){
  float fi=float(i);
  vec2 o=(vec2(h21(vec2(fi,13.)),h21(vec2(fi,31.)))-.5)*sz*1.5;
  o=rot(t*.02+fi)*o;
  float s=sz*(.12+.16*h21(vec2(fi,5.)));
  vec2 k=d-o;
  c+=vec3(.52,.7,1.)*exp(-dot(k,k)/(s*s))*(.5+.7*h21(vec2(fi,11.)));
 }
 float r2=dot(d,d)/(sz*sz);
 c+=stars(d/sz*1.4,16.,.45,5.)*exp(-r2*.9)*2.2;
 return c+vec3(.4,.55,1.)*exp(-r2*1.)*.3*(.7+.6*fbm4(d/sz*3.))+vec3(.85,.9,1.)*exp(-r2*12.)*.35;
}
vec3 voro(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.,d3=8.;
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y);vec2 r=g+h22(i+g)-f;float d=dot(r,r);
  if(d<d1){d3=d2;d2=d1;d1=d;}else if(d<d2){d3=d2;d2=d;}else if(d<d3){d3=d;}}
 return sqrt(vec3(d1,d2,d3));}
// the cosmic web of the scene before, simplified: near 1 on its strands and in its knots, near 0 in the voids. Galaxies form
// along it, crowded where strands meet, and the neutral gas is thickest there too (as in the THESAN and CoDa simulations)
float webd(vec2 p){
 p+=(vec2(vn(p*.9),vn(p*.9+5.3))-.5)*.5;
 vec3 v=voro(p); float e=v.y-v.x, k=v.z-v.x;
 return clamp(exp(-e*e/.025)*.75+exp(-k*6.)*.8,0.,1.);}
vec3 scene(vec2 uv,float t){
 vec2 p=uv*(1.06-.06*t/15.)/zoomG(t-11.); // in the last seconds the camera flies in to the galaxy at the centre
 float fogn=fbm(p*1.6+vec2(t*.02,0.))*.7+fbm4(p*4.5-t*.01)*.3;
 float F=0.; vec3 gc=vec3(0);
 float cs=.3;
 vec2 id=floor(p/cs);
 for(int y=-2;y<=2;y++)for(int x=-2;x<=2;x++){
  vec2 cid=id+vec2(x,y);
  float hh=h21(cid*1.3+.7);
  vec2 cp=(cid+.5+(h22(cid)-.5)*.6)*cs;
  float web=webd(cp*1.3+3.);
  if(hh>.15+1.1*web) continue; // most galaxies on the strands, few in the voids
  float birth=.6+(1.-web)*8.+hh*2.5; // and the densest places first: the clearing starts there (inside-out reionization)
  float age=max(t-birth,0.);
  float sig=.25*(1.-exp(-age*.3))*(.7+.3*h21(cid+9.)); // kept within the 5 x 5 cells summed, so no seams where the cells change
  vec2 d=p-cp;
  F+=step(.001,age)*exp(-dot(d,d)/max(sig*sig,1e-5));
  gc+=galaxy(d,.034+.02*hh,hh,t)*smoothstep(birth-.8,birth+.6,t);
 }
 F+=exp(-dot(p,p)/.06)*smoothstep(.4,3.,t)*1.4; // the ancestor's own clear bubble, opened early: the camera flies in through it
 gc+=hero(p,t)*smoothstep(.2,1.6,t);
 F+=smoothstep(9.5,15.5,t)*.75;
 float thr=.5+(fogn-.5)*.55+(fbm4(p*8.+t*.05)-.5)*.32;
 float ion=smoothstep(thr-.05,thr+.05,F);
 float front=exp(-pow((F-thr)/.045,2.));
 float dense=webd(p*1.3+3.); // the same web the galaxies are placed by: the haze is thickest along its strands
 vec3 fog=vec3(.3,.28,.26)*(.2+.8*fogn)*.5*(.45+.95*dense);
 vec3 bub=vec3(.008,.025,.045)+vec3(.05,.13,.2)*smoothstep(.5,2.,F)*.35;
 vec3 col=mix(fog,bub,ion);
 col+=vec3(.6,.85,1.)*front*.2*(1.-smoothstep(13.,16.,t)*.6);
 col+=stars(p,32.,.22,13.)*ion*.6;
 col+=gc;
 return col;
}`,

/* 9 Our galaxy: a barred spiral, turning slowly, with the Sun's future orbit and a swallowed neighbour */
`vec3 scene(vec2 uv,float t){
 vec3 col=stars(uv,22.,.35,2.)*.7+stars(uv,60.,.22,8.)*.5;
 uv*=max(1.,1./(.06*zoomG(t+2.))); // the camera is still flying in from the young galaxy: the spiral grows to full size by t = 4
 float incl=mix(1.0,1.12,smoothstep(0.,16.,t));
 float ci=cos(incl);
 vec2 q=rot(.28)*uv;
 vec2 dp=vec2(q.x,q.y/ci)/1.08;
 float rr=length(dp);
 float spin=t*.035;
 float ang=atan(dp.y,dp.x)+spin;
 float pitch=.24;
 float lr=log(rr+.03)/tan(pitch);
 float nz=fbm4(dp*4.+3.)-.5;
 float a1=.5+.5*cos(2.*ang-2.*lr+nz*2.5);
 float a2=.5+.5*cos(2.*ang-2.*lr+PI+.6+nz*2.5);
 float arms=pow(a1,4.)+.7*pow(a2,4.);
 float disc=exp(-rr*3.)*smoothstep(1.15,.55,rr);
 vec2 br=rot(-spin+.4)*dp;
 float bar=exp(-dot(vec2(br.x*.42,br.y*1.5),vec2(br.x*.42,br.y*1.5))*60.);
 float dust=pow(.5+.5*cos(2.*ang-2.*lr-.55+nz*2.5),8.)*smoothstep(.1,.3,rr)*smoothstep(1.,.4,rr);
 vec3 dc=vec3(.55,.68,1.)*arms*disc*2.4+vec3(1.,.85,.66)*disc*.9;
 dc+=vec3(1.,.35,.58)*pow(vn(dp*26.),6.)*arms*smoothstep(.15,.4,rr)*disc*8.;
 dc+=stars(dp,90.,.5,4.)*arms*disc*6.;
 dc*=1.-dust*.75;
 dc+=vec3(1.,.8,.55)*bar*1.1;
 float b=length(vec2(q.x,q.y*1.25));
 col+=dc+vec3(1.,.82,.56)*(exp(-b*b*55.)*2.2+exp(-b*7.)*.45);
 float dash=step(.45,fract((ang-spin)*48./TAU));
 col+=vec3(1.,.82,.5)*exp(-pow((rr-.52)*160.,2.))*dash*.28;
 float a0=2.3-spin;
 vec2 mp=.52*vec2(cos(a0),sin(a0));
 vec2 ms=rot(-.28)*(vec2(mp.x,mp.y*ci)*1.08);
 float md=length(uv-ms);
 col+=vec3(1.,.85,.5)*(exp(-md*md/(px()*px()*9.))*2.+exp(-md*30.)*.3)*(.8+.2*sin(uG*3.));
 vec2 e=rot(-.9)*(uv-vec2(.05,.0));
 float ell=length(vec2(e.x,e.y*2.6));
 float strm=exp(-pow((ell-1.28)*10.,2.))*smoothstep(-.6,.9,e.x);
 col+=stars(uv,80.,.4,21.)*strm*1.6+vec3(.6,.62,.75)*strm*.03;
 return col;
}`,

/* 10 The Sun and the Earth: the young Sun in its ringed disc of dust (after ALMA's picture of HL Tauri), then in close to the molten Earth */
`const float INC=1.2; const float ROLL=.12; const float DS=1.25;
const float EORB=.24;
vec2 earthDisc(float t){return rot(t*.05/pow(EORB,1.5))*(EORB*vec2(cos(1.4),sin(1.4)));}
vec2 toScreen(vec2 dp){return rot(ROLL)*(vec2(dp.x,dp.y*cos(INC))*DS);}
vec3 disc(vec2 uv,float t,float zk,float zf){
 float pz=px()*zf;
 vec3 col=vec3(0);
 col+=vec3(.3,.16,.11)*pow(fbm(uv*1.2+vec2(t*.01,0.)),2.)*.35;
 vec2 q=rot(-ROLL)*uv;
 float ci=cos(INC);
 vec2 dp=vec2(q.x,q.y/ci)/DS;
 float rr=length(dp);
 vec2 sp=rot(-t*.05/pow(rr+.08,1.5))*dp;
 float tex=fbm4(sp*6.)*.7+fbm4(sp*18.)*.3;
 float dens=exp(-rr*1.6)*smoothstep(1.12,.75,rr)*smoothstep(.03,.1,rr);
 // bright rings and dark gaps, as in the ALMA image of HL Tauri
 float gaps=1.-.9*exp(-pow((rr-.33)*70.,2.))-.75*exp(-pow((rr-.48)*60.,2.))-.9*exp(-pow((rr-.62)*55.,2.))
             -.8*exp(-pow((rr-.76)*65.,2.))-.7*exp(-pow((rr-.9)*70.,2.));
 float rings=.85+.15*sin(rr*95.);
 float snow=smoothstep(.36,.42,rr);
 vec3 dust=mix(vec3(1.,.56,.27),vec3(.85,.8,.95),snow*.4);
 col+=dust*dens*gaps*rings*(.45+.7*tex)*.9;
 col+=vec3(1.,.72,.45)*exp(-rr*7.)*dens*.5;
 // a few rocky bodies, sweeping round
 vec2 g=sp*30.,id=floor(g),f=fract(g)-.5;
 float hh=h21(id+2.);
 vec2 dd=(f-(h22(id+4.)-.5)*.6)/30.*DS;
 col+=vec3(1.,.78,.6)*exp(-dot(dd,dd)/(pz*pz*(2.+3.*hh)))*step(hh,.07)*smoothstep(.08,.14,rr)*smoothstep(.9,.7,rr)*.9;
 // the young Sun: small and bright, with a soft glow
 float r=length(uv);
 float sg=1./(1.+zk*zk*6.);
 col+=vec3(1.,.95,.82)*exp(-r*r/(pz*pz*10.))*3.;
 col+=vec3(1.,.82,.58)*(exp(-r*r*900./(zf*zf))*1.6+exp(-r*18./zf)*.45+exp(-r*4.)*.08)*sg;
 // faint jets along the spin axis
 float jy=abs(q.y);
 float jet=exp(-abs(q.x)/(.004+jy*.03))*exp(-jy*3.5)*smoothstep(.03,.1,jy);
 jet*=.4+.7*fbm4(vec2(q.x*30.,jy*7.-t*1.2));
 col+=vec3(.55,.72,1.)*jet*.35*sg;
 // the growing Earth, a speck in the inner disc, with its path traced faintly
 col+=vec3(.95,.8,.6)*exp(-pow((rr-EORB)*500.,2.))*.12*(1.-zk);
 vec2 ep=toScreen(earthDisc(t));
 float ed=length(uv-ep);
 float es=pz*min(1./zf,3.);
 col+=vec3(1.,.66,.4)*(exp(-ed*ed/(es*es*6.))*2.4+exp(-ed*60./(zf*min(1./zf,3.)))*.25);
 return col;
}
vec3 earth(vec2 uv,float t){
 float R=.62;
 vec3 col=stars(uv,25.,.3,3.)*.5;
 vec2 L2=normalize(vec2(-.85,.32));
 vec3 L=normalize(vec3(L2*.9,.42));
 col+=vec3(1.,.8,.55)*exp(-length(uv-vec2(-2.6,1.))*1.2)*.45;
 float r=length(uv);
 if(r<R){
  vec3 n=vec3(uv,sqrt(R*R-r*r))/R;
  vec3 m=n; m.xz=rot(t*.04)*m.xz;
  float crust=fbm3(m*3.);
  float detail=fbm3(m*11.+5.);
  float ridge=1.-abs(2.*fbm3(m*4.6+3.)-1.);
  float ridge2=1.-abs(2.*fbm3(m*9.+8.)-1.);
  float cracks=(pow(ridge,30.)+pow(ridge2,40.)*.4)*smoothstep(.38,.6,crust);
  float lava=smoothstep(.64,.71,crust);
  float lit=dot(n,L);
  float diff=max(lit,0.);
  vec3 rock=mix(vec3(.08,.07,.065),vec3(.2,.16,.125),detail)*(.55+.7*crust);
  vec3 emis=bb(.5+.12*detail)*cracks*1.05+bb(.56+.12*detail)*lava*(.45+.6*detail);
  float night=1.-smoothstep(-.15,.35,lit);
  col=rock*(diff*2.1+.025)+emis*(.55+.65*night);
  float limb=pow(1.-n.z,2.6);
  col+=vec3(1.,.58,.32)*limb*(.08+.45*max(lit+.35,0.));
 } else {
  float lt=max(dot(uv/r,L2),0.)*.8+.2;
  col+=vec3(1.,.6,.35)*exp(-(r-R)*24.)*.32*lt;
 }
 // leftover rocks still falling in; one strikes and flashes
 for(int i=0;i<3;i++){
  float fi=float(i);
  float ph=fract(t*.1+fi*.37);
  vec2 dir=normalize(vec2(-.6+fi*.55,.8-fi*.3));
  vec2 head=dir*(R+.04+1.7*(1.-ph));
  vec2 rel=uv-head;
  float al=dot(rel,dir), pe=dot(rel,vec2(-dir.y,dir.x));
  float tr=exp(-pe*pe/(px()*px()*2.5))*smoothstep(.22,0.,al)*step(0.,al);
  col+=vec3(1.,.78,.5)*tr*ph*.7;
 }
 vec2 ip=vec2(.22,.18); float te=t-15.2;
 if(te>0.){float id2=length(uv-ip);col+=vec3(1.,.85,.6)*exp(-te*1.4)*(exp(-id2*id2*900.)*2.+exp(-id2*14.)*.35)*step(length(ip),R);}
 return col;
}
vec3 scene(vec2 uv,float t){
 float k=smoothstep(10.,16.,t);
 float m=smoothstep(.5,.92,k);
 vec3 col=vec3(0);
 if(m<1.){
  vec2 ep=toScreen(earthDisc(t));
  float zoom=1.+k*k*14.;
  col=stars(uv,25.,.3,3.)*.6+disc(ep*smoothstep(0.,.3,k)+uv/zoom,t,k,1./zoom)*(1.-.55*k);
 }
 if(m>0.){
  vec3 e=earth(uv/mix(.06,1.,m*m),t);
  col=mix(col,e,m);
 }
 return col;
}`,
];

const COMP=`#version 300 es
precision highp float;
uniform sampler2D uA,uB; uniform float uMix,uG,uVignette;
in vec2 vUv; out vec4 o;
float h21(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
void main(){
 vec3 c=texture(uA,vUv).rgb;
 if(uMix>0.) c=mix(c,texture(uB,vUv).rgb,uMix);
 vec2 q=vUv-.5; c*=1.-dot(q,q)*.5*uVignette;
 c+=(h21(gl_FragCoord.xy+fract(uG*7.)*vec2(113.,71.))-.5)*.03;
 o=vec4(c,1.);
}`;

/* ---------------------------------------------------------------- WebGL */
const $=id=>document.getElementById(id);
const cv=$('gl');
const gl=cv.getContext('webgl2',{antialias:false,alpha:false,depth:false,stencil:false,powerPreference:'high-performance'});
if(!gl){
  $('nogl').hidden=false; // no title card: the film starts on its own, and only says so when it cannot run
  return;
}
const pcx=gl.getExtension('KHR_parallel_shader_compile');
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
const vsh=shader(gl.VERTEX_SHADER,VS);
function program(fsrc,name){
  const fs=shader(gl.FRAGMENT_SHADER,fsrc);
  const p=gl.createProgram();gl.attachShader(p,vsh);gl.attachShader(p,fs);gl.bindAttribLocation(p,0,'p');gl.linkProgram(p);
  return {p,fs,name,ok:false,bad:false,u:null};
}
function ready(P){
  if(P.ok) return true; if(P.bad) return false;
  if(pcx && !gl.getProgramParameter(P.p,pcx.COMPLETION_STATUS_KHR)) return false;
  if(!gl.getProgramParameter(P.p,gl.LINK_STATUS)){
    P.bad=true; console.error('Shader '+P.name+' failed:\n'+(gl.getShaderInfoLog(P.fs)||gl.getProgramInfoLog(P.p))); return false;
  }
  const U=n=>gl.getUniformLocation(P.p,n);
  P.u={res:U('uRes'),t:U('uT'),g:U('uG'),z:U('uZ'),off:U('uOff'),a:U('uA'),b:U('uB'),mix:U('uMix'),vignette:U('uVignette')};
  P.ok=true; return true;
}
const progs=SHADERS.map((s,i)=>program(HEAD+s,'scene '+(i+1)));
const comp=program(COMP,'composite');

const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const vao=gl.createVertexArray();gl.bindVertexArray(vao);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);

function target(w,h){
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
  return {tex,fb,w,h};
}
function drop(T){if(T){gl.deleteTexture(T.tex);gl.deleteFramebuffer(T.fb);}}

// Render scale adapts to the GPU: full device resolution (up to 2x) when it keeps up, less when it does not.
let scale=.8, A=null, B=null, W=0, H=0, off=[0,0], zoom=1;
function size(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const cw=Math.max(2,Math.round(cv.clientWidth*dpr)), ch=Math.max(2,Math.round(cv.clientHeight*dpr));
  if(cv.width!==cw||cv.height!==ch){cv.width=cw;cv.height=ch;}
  const w=Math.max(2,Math.round(cw*scale)), h=Math.max(2,Math.round(ch*scale));
  if(w!==W||h!==H){drop(A);drop(B);A=target(w,h);B=target(w,h);W=w;H=h;dirty=true;}
  const asp=cw/ch;
  // On a tall phone screen, widen the view so each subject fits across; lift it above the subtitles.
  zoom=asp<1?Math.min(2.2,.95/asp):1;
  off=asp>1.25?[Math.min(asp*.28,.62),.1]:asp<.9?[0,.42*zoom]:[.16,.1];
}
function drawScene(i,t,T){
  const P=progs[i];
  gl.bindFramebuffer(gl.FRAMEBUFFER,T.fb);gl.viewport(0,0,T.w,T.h);
  if(!ready(P)){gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);return;}
  gl.useProgram(P.p);
  gl.uniform2f(P.u.res,T.w,T.h);gl.uniform1f(P.u.t,t);gl.uniform1f(P.u.g,G);gl.uniform2f(P.u.off,off[0],off[1]);gl.uniform1f(P.u.z,zoom);
  gl.drawArrays(gl.TRIANGLES,0,3);
}
function composite(mix,vignette){
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,cv.width,cv.height);
  if(!ready(comp)) return;
  gl.useProgram(comp.p);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,A.tex);gl.uniform1i(comp.u.a,0);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,B.tex);gl.uniform1i(comp.u.b,1);
  gl.uniform1f(comp.u.mix,mix);gl.uniform1f(comp.u.g,G);gl.uniform1f(comp.u.vignette,vignette);
  gl.drawArrays(gl.TRIANGLES,0,3);
}

/* ---------------------------------------------------------------- timeline */
let T=0, G=0, tail=0, playing=false, started=false, ended=false, dirty=true, shown=-1, last=performance.now();
let ema=16, lastAdapt=0;
function locate(x){let i=0;while(i<N-1&&x>=START[i+1])i++;return i;}

function frame(now){
  const dt=Math.min(.25,(now-last)/1000); last=now;
  const live=!started||playing||ended;
  if(live) G+=dt;
  if(playing){T+=dt*(narrHeard()?NARR.rate[locate(T)]:1);if(STORY&&T>=STORY.hold){T=STORY.hold;setPlaying(false);}if(T>=TOTAL){T=TOTAL;finish();}} // in a story the film pauses at each chapter's moment
  if(ended) tail+=dt;
  size();
  if(live||dirty){
    const i=locate(T);
    const ti=started?T-START[i]+F+(ended?tail:0):1.2;
    let mix=0,j=-1;
    if(started&&i<N-1&&T>START[i+1]-F){j=i+1;mix=(T-(START[i+1]-F))/F;mix=mix*mix*(3-2*mix);}
    drawScene(i,ti,A);
    if(j>=0) drawScene(j,T-START[j]+F,B);
    composite(mix,i===0?0:i===1?mix:1);
    dirty=false;
    hud(mix>.5?j:i,T);
    // adapt resolution
    ema=ema*.92+dt*1000*.08;
    if(live&&now-lastAdapt>1500){
      if(ema>26&&scale>.42){scale=Math.max(.42,scale*.82);lastAdapt=now;}
      else if(ema<18.5&&scale<1){scale=Math.min(1,scale*1.1);lastAdapt=now;}
    }
  }
  if(!started){
    const ok0=ready(progs[0])&&ready(comp);
    if(ok0&&!/^#s\//.test(location.hash)){const sc=/^#(\d{1,2})$/.exec(location.hash);if(sc){T=START[clamp(+sc[1],1,N)-1];history.replaceState(null,'',location.pathname);}begin();} // #3: straight to the third scene (the atlas's search links here) // straight into the film as soon as its first scene is ready (a story link starts at its chapter instead)
  }
  progs.forEach(ready); // collect finished compiles as they land
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------------- HUD */
// the dock: one band per scene, as wide as the scene runs, coloured with its accent and named as on the design's chapter tabs
const SHORT=['Quantum','Inflation','Quark soup','First nuclei','First light','Dark ages','First stars','Galaxies','Our galaxy','Sun and Earth'];
const TICK=['Start','10⁻³⁶ s','10⁻¹² s','3 min','380,000 yr','50 m yr','200 m yr','290 m yr','3.8 bn yr','9.22 bn yr'];
const PILL=['Beginning','10⁻³⁶ seconds','10⁻¹² seconds','3 minutes','380,000 years','50 million years','200 million years','290 million years','3.8 billion years','9.22 billion years'];
const bandEls=SCENES.map((s,i)=>{
  const b=document.createElement('i');b.textContent=SHORT[i];b.style.left=(START[i]/TOTAL*100)+'%';b.style.width=(s.dur/TOTAL*100)+'%';b.style.background=s.acc;
  $('bands').appendChild(b);
  const k=document.createElement('span');k.textContent=TICK[i];k.style.left=(START[i]/TOTAL*100)+'%';$('ticks').appendChild(k);
  return b;
});
// the Earth itself waits past the last band: the tile at the bar's end (.toearth) opens the atlas there
// turning points: each sits in a scene (s) a number of seconds in (at), so it follows the scene if durations change. star: shown as a pill
// above the bands; every one gets a diamond on the bar. Dates are as the scene cards and their sources give them
const MOMENTS=[
 {s:0,at:6,star:1,pill:'Edge of physics',title:'The edge of known physics',when:'10⁻⁴³ seconds',text:'The Planck time: the earliest moment any tested theory can describe. Before it, gravity and quantum physics would have to be described together, and no tested theory does that.',src:'Planck units; Planck Collaboration 2018'},
 {s:1,at:11,star:1,pill:'Inflation ends',title:'Inflation ends',when:'about 10⁻³² seconds',text:'If inflation happened, space has now grown at least 10²⁶ times, and its stretched quantum ripples have become the seeds of all later structure.',src:'Guth 1981; Planck Collaboration 2018, constraints on inflation'},
 {s:2,at:2,title:'The Higgs field switches on',when:'about 10⁻¹² seconds',text:'Particles gain their masses, and the electromagnetic and weak forces part ways.',src:'CERN, the Higgs boson'},
 {s:2,at:8,star:1,pill:'Protons',title:'Protons and neutrons form',when:'about 10 microseconds',text:'Cooling below about 2 trillion K, the quark soup locks into protons and neutrons, the building blocks of atomic nuclei.',src:'HotQCD Collaboration (Bazavov et al. 2019); CERN, quark–gluon plasma'},
 {s:3,at:2,title:'Neutrinos break free',when:'about 1 second',text:'Neutrinos stop interacting with the rest of matter and stream away. A background of them still fills space, though it has not been detected directly.',src:'Planck Collaboration 2018 (number of neutrino species)'},
 {s:3,at:4.5,title:'Matter survives antimatter',when:'about 10 seconds',text:'Matter and antimatter annihilate almost completely. About one particle of matter in a billion is left over, and everything in the universe today is made of it.',src:'Fields et al. 2020 (about 6 × 10⁻¹⁰ protons and neutrons per photon)'},
 {s:3,at:8,star:1,pill:'First nuclei',title:'The first nuclei',when:'3 to 20 minutes',text:'Protons and neutrons fuse into helium and a trace of lithium. The mix of 75% hydrogen and 25% helium by mass is fixed for good.',src:'Fields, Olive, Yeh and Young 2020'},
 {s:4,at:2,title:'Matter takes over from light',when:'about 50,000 years',text:'Until now radiation outweighed matter. From here gravity can pull dark matter into growing clumps.',src:'Planck Collaboration 2018 (matter–radiation equality, redshift about 3,400)'},
 {s:4,at:7,star:1,pill:'First light',title:'First light',when:'380,000 years',text:'Atoms form, the glowing fog clears and light crosses space for the first time: the cosmic microwave background.',src:'Planck Collaboration 2018; Fixsen 2009'},
 {s:6,at:4,star:1,pill:'First stars',title:'Cosmic dawn',when:'about 100 to 200 million years',text:'The first stars ignite in the densest knots of the cosmic web. None has been confirmed yet; the faint, lensed galaxy LAP1 is a candidate.',src:'Bromm 2013, Reports on Progress in Physics'},
 {s:7,at:4,star:1,pill:'Oldest galaxies',title:'The oldest galaxies seen',when:'about 280 to 290 million years',text:'The James Webb Space Telescope has confirmed galaxies from this time: MoM-z14 and JADES-GS-z14-0.',src:'Carniani et al. 2024, Nature; Naidu et al. 2025'},
 {s:7,at:8,title:'Giant black holes appear',when:'by about 700 million years',text:'The earliest known quasars already hold black holes of more than a billion times the Sun’s mass, such as J0313−1806.',src:'Wang et al. 2021, Astrophysical Journal Letters'},
 {s:7,at:11,title:'Reionization ends',when:'about 1 billion years',text:'Ultraviolet light from galaxies has split the hydrogen between them apart again, clearing space.',src:'Planck Collaboration 2018 (reionization)'},
 {s:8,at:1.5,title:'The Milky Way begins forming',when:'over 12 billion years ago',text:'The oldest stars of our galaxy date from this time; the young Milky Way grows by drawing in gas and smaller galaxies.',src:'Xiang and Rix 2022, Nature'},
 {s:8,at:4,title:'Cosmic noon',when:'about 3.5 billion years',text:'Star birth across the universe peaks, at roughly ten times today’s rate.',src:'Madau and Dickinson 2014'},
 {s:8,at:7,title:'Gaia-Enceladus is swallowed',when:'about 10 billion years ago',text:'A smaller galaxy merges with the Milky Way. Its stars still move on telltale orbits, mapped by the Gaia satellite.',src:'Helmi et al. 2018, Nature'},
 {s:8,at:11,title:'Dark energy takes over',when:'about 6 billion years ago',text:'The expansion of space, slowed until now by gravity, begins to speed up.',src:'Riess et al. 1998; Perlmutter et al. 1999; Planck Collaboration 2018'},
 {s:9,at:3,star:1,pill:'Sun is born',title:'The Sun is born',when:'4,567 million years ago',text:'A cloud of gas and dust collapses into the Sun and its disc. The oldest solids in meteorites date the start of the solar system precisely.',src:'Connelly et al. 2012, Science'},
];
// Turning points and stories are switched off for now: they mostly repeated what the ten scene cards already say. Set these to true to bring them back
const SHOW_MOMENTS=false, SHOW_STORIES=false;
MOMENTS.forEach((m,i)=>{
  m.t=START[m.s]+Math.min(m.at,SCENES[m.s].dur-.3);
  if(!SHOW_MOMENTS)return;
  const d=document.createElement('i');d.dataset.m=i;d.dataset.label=m.title;d.style.left=(m.t/TOTAL*100)+'%';$('marks').appendChild(d);
  if(m.star){const b=document.createElement('button');b.type='button';b.className='mile';b.dataset.m=i;b.textContent=m.pill;b.title=m.title+', '+m.when;$('miles').appendChild(b);}
});
// the pills: placed over their moments in order, left to right; any that would overlap the one before is left out (as on the atlas)
function placeMiles(){
  const w=$('miles').clientWidth;let right=-1e9;
  for(const el of $('miles').children){const m=MOMENTS[+el.dataset.m],cw=el.offsetWidth,l=clamp(m.t/TOTAL*w-cw/2,0,Math.max(0,w-cw));
    el.style.left=l+'px';const ok=l>=right+6;el.classList.toggle('hid',!ok);if(ok)right=l+cw;}
}
placeMiles();window.addEventListener('resize',placeMiles);document.fonts&&document.fonts.ready.then(placeMiles);
let picked=-1; // a turning point chosen by click stays on the card until the playhead moves away from it
function goMoment(e){const el=e.target.closest('[data-m]');if(!el)return;e.stopPropagation();e.preventDefault();if(STORY)storyEnd();picked=+el.dataset.m;seek(MOMENTS[picked].t);}
$('miles').addEventListener('click',goMoment);
$('marks').addEventListener('pointerdown',e=>{if(e.target.closest('[data-m]'))e.stopPropagation();});
$('marks').addEventListener('click',goMoment);
let turnShown=-2;
function turnAt(x){ // the turning point the playhead is on, within a second and a half
  if(picked>=0&&Math.abs(MOMENTS[picked].t-x)<1.6)return picked;picked=-1;
  let k=-1,best=1.5;MOMENTS.forEach((m,i)=>{const d=Math.abs(m.t-x);if(d<best){best=d;k=i;}});return k;
}
// stories (stories.json, listed in the atlas's Stories): universe/#s/<id>/<chapter> plays one chapter at a time. Each chapter moves the
// film to its moment from a second or so before and pauses there; reading progress is kept as the atlas keeps its own ("one.moments")
let STORIES=[],STORY=null;
const SEEN=(()=>{try{return JSON.parse(localStorage.getItem('one.moments')||'{}')||{};}catch(e){return {};}})();
function chapterOf(c){const m=c.m?MOMENTS.find(x=>x.title===c.m):null;if(m)return m;
  return {t:START[c.s]+Math.min(c.at,SCENES[c.s].dur-.3),title:c.title,when:c.when,text:c.text,src:c.src};}
function storyGo(i){
  const st=STORY.story,n=st.chapters.length;STORY.i=clamp(i,0,n-1);const c=chapterOf(st.chapters[STORY.i]);
  document.body.classList.add('story');$('story').hidden=false;
  $('sCount').textContent=(STORY.i+1)+' of '+n;$('sKick').textContent=st.title;$('sTitle').textContent=c.title;$('sWhen').textContent=c.when;
  $('sText').textContent=c.text;$('sSrc').textContent='Source: '+c.src;
  $('sPrev').disabled=STORY.i===0;$('sNext').textContent=STORY.i<n-1?'Next chapter':'Finish';
  STORY.hold=c.t+2.5;seek(Math.max(0,c.t-1.2));setPlaying(true);
  if((SEEN[st.id]||0)<STORY.i+1){SEEN[st.id]=STORY.i+1;try{localStorage.setItem('one.moments',JSON.stringify(SEEN));}catch(e){}}
  try{history.replaceState(null,'','#s/'+encodeURIComponent(st.id)+'/'+(STORY.i+1));}catch(e){}
}
function storyEnd(){STORY=null;document.body.classList.remove('story');$('story').hidden=true;try{history.replaceState(null,'',location.pathname);}catch(e){}}
$('sPrev').addEventListener('click',()=>storyGo(STORY.i-1));
$('sNext').addEventListener('click',()=>{if(STORY.i<STORY.story.chapters.length-1)storyGo(STORY.i+1);else location.href='../#earth/stories';});
$('sClose').addEventListener('click',storyEnd);
(SHOW_STORIES?fetch('stories.json'):Promise.reject()).then(r=>r.json()).then(d=>{STORIES=d.stories||[];
  const m=/^#s\/([\w-]+)\/(\d+)$/.exec(location.hash),st=m&&STORIES.find(x=>x.id===decodeURIComponent(m[1]));
  if(st){STORY={story:st,i:0,hold:0};const go=()=>ready(progs[0])&&ready(comp)?storyGo(+m[2]-1):setTimeout(go,100);go();}
}).catch(()=>{});
// drag or click along the bands to move through the film
const tl=$('tl');
tl.setAttribute('aria-valuemax',String(TOTAL));
function tlAt(e){if(STORY)storyEnd();const r=tl.getBoundingClientRect();seek(clamp((e.clientX-r.left)/r.width,0,1)*TOTAL);}
tl.addEventListener('pointerdown',e=>{tl.setPointerCapture(e.pointerId);tlAt(e);});
tl.addEventListener('pointermove',e=>{if(tl.hasPointerCapture(e.pointerId))tlAt(e);});
tl.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();seek(T+(e.key==='ArrowRight'?5:-5));}
  else if(e.key==='Home'){e.preventDefault();e.stopPropagation();seek(0);}
  else if(e.key==='End'){e.preventDefault();e.stopPropagation();seek(START[N-1]);}
});
function fmt(s){s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
const SURE=v=>/^Well/.test(v)?'#57c99a':/^Likely/.test(v)?'#f2b84b':'#c9c4d8';
let lastLive='';
function hud(k,x){
  if(k!==shown){
    shown=k;const s=SCENES[k];
    document.documentElement.style.setProperty('--acc',s.acc);
    $('eyebrow').textContent='THE UNIVERSE · '+(k+1)+' OF '+N;
    const c=$('clock');c.parentElement.hidden=!s.clock;c.innerHTML=s.clock;c.classList.toggle('long',c.textContent.length>=6);
    $('unit').textContent=s.unit;$('ago').textContent=s.ago;
    $('title').textContent=s.title;$('era').textContent=s.era;$('lede').textContent=s.lede;
    $('temp').textContent=s.temp;$('what').textContent=s.what;
    const su=$('sure');su.textContent=s.sure;su.style.color=SURE(s.sure);su.style.borderColor=SURE(s.sure)+'8c';
    $('more').textContent=s.more;$('src').textContent=s.src;
    $('pill').textContent=PILL[k];
    const cap=$('cap');cap.classList.remove('in');void cap.offsetWidth;cap.classList.add('in');
  }
  const s=SCENES[k];
  const lv=s.live&&started?s.live(x-START[k]+F,s.dur):'';
  if(lv!==lastLive){$('live').textContent=lv;lastLive=lv;}
  const f=clamp(x/TOTAL,0,1);
  $('cursor').style.left=(f*100).toFixed(3)+'%';
  // the bubble follows the playhead but stays within the bar's ends
  const pl=$('pill'),tw=tl.clientWidth,hw=pl.offsetWidth/2;
  pl.style.left=clamp(f*tw,hw,Math.max(hw,tw-hw)).toFixed(1)+'px';
  bandEls.forEach((b,i)=>b.classList.toggle('after',START[i]>x+.01));
  const tk=SHOW_MOMENTS&&started&&!STORY?turnAt(x):-1; // in a story the story panel says it instead
  if(tk!==turnShown){turnShown=tk;const tb=$('turn');tb.hidden=tk<0;
    if(tk>=0){const m=MOMENTS[tk];tb.innerHTML='<span>TURNING POINT · '+m.when.toUpperCase()+'</span><b></b><p></p><small></small>';
      tb.querySelector('b').textContent=m.title;tb.querySelector('p').textContent=m.text;tb.querySelector('small').textContent='Source: '+m.src;}
    document.querySelectorAll('#miles .mile,#marks i').forEach(el=>el.classList.toggle('on',+el.dataset.m===tk));}
  $('time').textContent=fmt(x)+' / '+fmt(TOTAL);
  tl.setAttribute('aria-valuenow',String(Math.round(x)));tl.setAttribute('aria-valuetext',fmt(x)+', scene '+(k+1)+': '+s.title);
}

function setPlaying(v){
  playing=v;document.body.classList.toggle('playing',v);
  $('play').setAttribute('aria-label',v?'Pause':'Play');
  $('playicon').innerHTML=v?'<path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z"/>':'<path d="M8 5v14l11-7z"/>';
}
function begin(){
  if(!started){started=true;document.body.classList.remove('pre');}
  if(ended)unfinish();
  setPlaying(true);dirty=true;
}
function finish(){
  ended=true;tail=0;setPlaying(false);document.body.classList.add('ended');
  const e=$('end');e.hidden=false;requestAnimationFrame(()=>e.classList.remove('gone'));
}
function unfinish(){ended=false;tail=0;document.body.classList.remove('ended');const e=$('end');e.classList.add('gone');setTimeout(()=>{if(!ended)e.hidden=true;},900);}
function seek(x){
  if(!started){begin();}
  if(ended)unfinish();
  T=clamp(x,0,TOTAL-.05);dirty=true;
}
function toggle(){if(!started||ended){if(ended)T=0;begin();}else setPlaying(!playing);dirty=true;}
function next(){const i=locate(T);if(i<N-1)seek(START[i+1]);}
function prev(){const i=locate(T);seek(T-START[i]>2.5||i===0?START[i]:START[i-1]);}
function setText(v){document.body.classList.toggle('notext',!v);$('cc').setAttribute('aria-pressed',String(v));$('cc').textContent=v?'Hide text':'Show text';}
function fullscreen(){
  const d=document;
  if(d.fullscreenElement){d.exitFullscreen&&d.exitFullscreen().catch(()=>{});}
  else{const el=d.documentElement;el.requestFullscreen&&el.requestFullscreen().catch(()=>{});}
}

$('play').addEventListener('click',toggle);
$('again').addEventListener('click',()=>{T=0;begin();});
$('cc').addEventListener('click',()=>setText(document.body.classList.contains('notext')));
$('fs').addEventListener('click',fullscreen);
document.addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  const tag=e.target.tagName;
  if((tag==='BUTTON'||tag==='A')&&(e.key===' '||e.key==='Enter'))return;
  if(STORY&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();e.key==='ArrowRight'?$('sNext').click():STORY.i>0&&storyGo(STORY.i-1);return;} // in a story the arrows step through its chapters
  if(e.key===' '||e.key==='k'){e.preventDefault();toggle();}
  else if(e.key==='ArrowRight'){e.preventDefault();next();}
  else if(e.key==='ArrowLeft'){e.preventDefault();prev();}
  else if(e.key==='c'||e.key==='C'){setText(document.body.classList.contains('notext'));}
  else if(e.key==='f'||e.key==='F'){fullscreen();}
});
let idleT=0;
function wake(){document.body.classList.remove('idle');clearTimeout(idleT);idleT=setTimeout(()=>document.body.classList.add('idle'),2800);}
['mousemove','pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,wake,{passive:true}));
window.addEventListener('resize',()=>{dirty=true;});
document.addEventListener('visibilitychange',()=>{last=performance.now();});
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();});

/* ---------------------------------------------------------------- narration: a spoken commentary for beginners (narration/narration.json,
   recorded by tools/narration.py). On a first visit it plays with the film; once a reader has heard it (half a minute of it), later visits
   start muted and the speaker button (or N) plays it. Muting is remembered on this browser too.
   A scene's lines are spoken one after another, like a person telling the story: a breath before the first, a short pause between them.
   Spoken lines take longer than some scenes, so while the voice is heard the film runs each such scene more slowly (NARR.rate, film seconds
   per real second) until its lines fit; muted, it keeps its own pace. The voice follows pause, play and seeking (a line picked up halfway
   starts halfway), and the line being spoken shows as a subtitle. The last line plays over the closing slate.
   Browsers allow sound only after the reader has clicked or tapped the page, and the film starts by itself, so the first line may be refused:
   the film then runs at its own pace, the button shows the voice as off, and the next click or tap anywhere brings it in. One audio element
   plays every line (Safari on a phone lets an element play once a tap has started it, not each new one); a second only fetches the next line */
const NARR={on:true,blocked:false,cues:[],rate:SCENES.map(()=>1),el:new Audio(),warm:new Audio(),loaded:-1,lastX:0,heard:0,at:0};
NARR.el.preload='auto';NARR.warm.preload='auto';
try{if(localStorage.getItem('universe.narration')==='off'||localStorage.getItem('universe.heard'))NARR.on=false;}catch(e){/* storage can be blocked: the voice is then on */}
const narrHeard=()=>NARR.on&&!NARR.blocked&&NARR.cues.length>0;
function narrPlan(cues){ // real seconds: before a scene's first line, between lines, after its last; gaps grow up to GMAX where a scene has room
  const LEAD=.5,GAP=.45,END=.7,GMAX=1.2;
  for(let k=0;k<N;k++){
    const mine=cues.filter(c=>c.scene===k);if(!mine.length)continue;
    const speech=mine.reduce((a,c)=>a+c.dur,0), need=LEAD+speech+GAP*(mine.length-1)+END;
    const gap=mine.length>1?Math.min(GMAX,GAP+Math.max(0,SCENES[k].dur-need)/mine.length):0;
    const r=NARR.rate[k]=SCENES[k].dur/Math.max(SCENES[k].dur,LEAD+speech+gap*(mine.length-1)+END);
    let o=LEAD;for(const c of mine){c.t=START[k]+o*r;c.win=c.dur*r;c.r=r;o+=c.dur+gap;}
  }
  for(const c of cues)if(c.scene==='end'){c.t=TOTAL+.6;c.win=c.dur;c.r=1;}
  return cues;
}
function narrShow(){
  const b=$('nar'),heard=NARR.on&&!NARR.blocked;
  b.classList.toggle('off',!heard);b.classList.toggle('ask',NARR.on&&NARR.blocked);
  b.setAttribute('aria-pressed',String(!heard));
  b.setAttribute('aria-label',heard?'Mute the narration':'Play the narration');b.title=(heard?'Mute the narration':'Play the narration')+' (N)';
}
fetch('narration/narration.json').then(r=>r.json()).then(s=>{
  if(!s.cues.every(c=>c.file&&c.dur))return; // a script edited but not yet recorded
  NARR.cues=narrPlan(s.cues.map(c=>({...c})));
  $('nar').hidden=false;narrShow();
}).catch(()=>{});
function narrCue(x){for(let i=0;i<NARR.cues.length;i++){const c=NARR.cues[i];if(x>=c.t&&x<c.t+c.win)return i;}return -1;}
function narrPlay(){ // inside a click or tap this also unlocks the element for the rest of the visit
  const p=NARR.el.play();
  if(p&&p.catch)p.catch(e=>{if(e&&e.name==='NotAllowedError'&&!NARR.blocked){NARR.blocked=true;narrShow();}});
}
function narrSet(v){
  NARR.on=v;NARR.blocked=false;
  try{if(v)localStorage.removeItem('universe.narration');else localStorage.setItem('universe.narration','off');}catch(e){/* remembered for this visit only */}
  if(v){if(narrCue(ended?TOTAL+tail:T)>=0&&(playing||ended))narrPlay();}else NARR.el.pause();
  narrShow();dirty=true;
}
function narrTick(){
  if(NARR.cues.length){
    const x=ended?TOTAL+tail:T, jumped=Math.abs(x-NARR.lastX)>.75;NARR.lastX=x;
    const k=narrCue(x), el=NARR.el, moving=playing||ended, now=performance.now();
    if(narrHeard()&&!el.paused&&NARR.heard<30){NARR.heard+=Math.min(.25,(now-NARR.at)/1000);if(NARR.heard>=30)try{localStorage.setItem('universe.heard','1');}catch(e){}} // heard: later visits start muted
    NARR.at=now;
    if(!narrHeard()){if(!el.paused)el.pause();}
    else if(k>=0){
      const c=NARR.cues[k], want=(x-c.t)/c.r; // film seconds back to the recording's own seconds
      if(k!==NARR.loaded){
        NARR.loaded=k;el.src='narration/'+c.file;el.currentTime=Math.max(0,want);
        const nx=NARR.cues[k+1];if(nx)NARR.warm.src='narration/'+nx.file; // fetched now, so the next line starts on time
      }else if(jumped||(el.readyState>0&&Math.abs(el.currentTime-want)>1))el.currentTime=Math.max(0,want); // after a seek, or a real drift
      if(moving){if(el.paused&&!el.ended)narrPlay();}else if(!el.paused)el.pause();
    }else{
      // between lines: a line that started a moment late may still be finishing its last words; let it, unless the film jumped or stopped
      if(jumped||!moving){if(!el.paused)el.pause();if(jumped)NARR.loaded=-1;}
    }
    // the subtitle: the line the voice is on, kept while it finishes its last words, gone when it is silent or muted
    const said=narrHeard()&&NARR.loaded>=0&&(k>=0||!el.paused)?NARR.cues[k>=0?k:NARR.loaded].text:'', sb=$('sub');
    if(sb.textContent!==said){sb.textContent=said;sb.hidden=!said;}
  }
  requestAnimationFrame(narrTick);
}
requestAnimationFrame(narrTick);
$('nar').addEventListener('click',()=>narrSet(!(NARR.on&&!NARR.blocked)));
['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,e=>{ // the first click or tap anywhere lets a refused voice in
  if(!NARR.blocked||e.target.closest&&e.target.closest('#nar'))return;
  NARR.blocked=false;narrShow();
  if(NARR.on&&narrCue(ended?TOTAL+tail:T)>=0&&(playing||ended))narrPlay();
},true));
document.addEventListener('keydown',e=>{if(!e.metaKey&&!e.ctrlKey&&!e.altKey&&(e.key==='n'||e.key==='N')&&!/^(INPUT|TEXTAREA)$/.test(e.target.tagName))narrSet(!(NARR.on&&!NARR.blocked));});

document.body.classList.add('pre');
hud(0,0);
requestAnimationFrame(t=>{last=t;frame(t);});
})();
