"""Structural checks for a war cinema file: what the app needs to draw it (dates, ordering, shapes, ranges).
History checks (does the map match the sources?) are in check_history.py.
Run: python3 -I tools/cinema/validate.py [cinema.json]"""
import json, re, sys
import os; P=sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'content', 'cinema', 'world-war-i.json')
D=json.load(open(P)); err=[]
S,E=D['start'],D['end']
iso=re.compile(r'^-?\d{1,4}-\d{2}-\d{2}$')
import importlib.util
_s = importlib.util.spec_from_file_location('geo', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'geo.py')); geo = importlib.util.module_from_spec(_s); _s.loader.exec_module(geo)
def chkdate(d,ctx):
    if not iso.match(d): err.append(f'bad date {d} {ctx}')
    elif not (geo.frac(S) - 1e-6 <= geo.frac(d) <= geo.frac(E) + 1e-6): err.append(f'out of range {d} {ctx}')
BOX={'Western':(1.5,47,8,52),'Eastern':(17,47,41,60),'Italian':(10,45,14,47.2),'Serbian':(18.5,40.5,23,45.5),
     'Macedonian':(18.5,40,24.5,45),'Romanian':(22,43,30,48),'Gallipoli':(26.1,40,26.4,40.4),'Sinai':(32,29,38.5,36.5),
     'Mesopotamian':(42,30,48.5,36),'Caucasus':(38.5,37.5,46,42)}
def inbox(pts,b): return all(b[0]<=x<=b[2] and b[1]<=y<=b[3] for x,y in pts)
for f in D.get('fronts', []):
    b=(-180,-60,180,80)
    ks=f['keys']; ds=[k['date'] for k in ks]
    if [geo.frac(x) for x in ds]!=sorted(geo.frac(x) for x in ds) or len(set(ds))!=len(ds): err.append('keys not ascending '+f['name'])
    if not 2<=len(ks)<=120: err.append('key count '+f['name'])
    n=set(len(k['line']) for k in ks)
    for k in ks:
        chkdate(k['date'],f['name'])
        if not 2<=len(k['line'])<=400: err.append(f"line len {f['name']} {k['date']}")
        if not inbox(k['line'],b): err.append(f"outside theatre {f['name']} {k['date']}")
    print(f"front {f['name']}: {len(ks)} keys, points/line {n}")
for o in D.get('occupations', []):
    ks=o['keys']; ds=[k['date'] for k in ks]
    if o['side'] not in (0,1,2,3): err.append('side '+o['name'])
    if [geo.frac(x) for x in ds]!=sorted(geo.frac(x) for x in ds): err.append('occ not ascending '+o['name'])
    if not 1<=len(ks)<=120: err.append('occ key count '+o['name'])
    for k in ks:
        chkdate(k['date'],o['name']); c=k['coords']
        if not 4<=len(c)<=600: err.append(f"ring len {len(c)} {o['name']}")
        if not inbox(c,(-180,-60,180,80)): err.append('occ coords '+o['name'])
    print(f"occ side {o['side']} {o['name']}: {len(ks)} keys")
for a in D.get('arrows', []):
    chkdate(a['start'],a['name']); chkdate(a['end'],a['name'])
    if geo.frac(a['start'])>geo.frac(a['end']): err.append('arrow order '+a['name'])
    if not 2<=len(a['path'])<=40: err.append('arrow len '+a['name'])
    if a['side'] not in (0,1,2,3): err.append('arrow side')
for b in D.get('battles', []):
    chkdate(b['start'],b['name']); chkdate(b['end'],b['name'])
    if geo.frac(b['start'])>geo.frac(b['end']): err.append('battle order '+b['name'])
    if not isinstance(b['casNum'],int): err.append('casNum '+b['name'])
for s in D.get('shots', []): chkdate(s['date'],'shot')
print('counts: fronts',len(D.get('fronts',[])),'occupations',len(D.get('occupations',[])),'arrows',len(D.get('arrows',[])),'battles',len(D.get('battles',[])),'chapters',len(D.get('chapters',[])),'claims',len(D.get('claims',[])),'sources',len(D.get('sources',[])))
print('ERRORS:',err or 'none')
