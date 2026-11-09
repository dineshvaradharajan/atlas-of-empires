"""Structural checks for a war cinema file: what the app needs to draw it (dates, ordering, shapes, ranges).
History checks (does the map match the sources?) are in check_history.py.
Run: python3 -I tools/cinema/validate.py [cinema.json]"""
import json, re, sys
import os; P=sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'content', 'cinema', 'world-war-i.json')
D=json.load(open(P)); err=[]
S,E=D['start'],D['end']
iso=re.compile(r'^\d{4}-\d{2}-\d{2}$')
def chkdate(d,ctx):
    if not iso.match(d): err.append(f'bad date {d} {ctx}')
    elif not (S<=d<=E): err.append(f'out of range {d} {ctx}')
BOX={'Western':(1.5,47,8,52),'Eastern':(17,47,41,60),'Italian':(10,45,14,47.2),'Serbian':(18.5,40.5,23,45.5),
     'Macedonian':(18.5,40,24.5,45),'Romanian':(22,43,30,48),'Gallipoli':(26.1,40,26.4,40.4),'Sinai':(32,29,38.5,36.5),
     'Mesopotamian':(42,30,48.5,36),'Caucasus':(38.5,37.5,46,42)}
def inbox(pts,b): return all(b[0]<=x<=b[2] and b[1]<=y<=b[3] for x,y in pts)
for f in D['fronts']:
    b=(-6,28,50,62)
    ks=f['keys']; ds=[k['date'] for k in ks]
    if ds!=sorted(ds) or len(set(ds))!=len(ds): err.append('keys not ascending '+f['name'])
    if not 2<=len(ks)<=120: err.append('key count '+f['name'])
    n=set(len(k['line']) for k in ks)
    for k in ks:
        chkdate(k['date'],f['name'])
        if not 2<=len(k['line'])<=400: err.append(f"line len {f['name']} {k['date']}")
        if not inbox(k['line'],b): err.append(f"outside theatre {f['name']} {k['date']}")
    print(f"front {f['name']}: {len(ks)} keys, points/line {n}")
for o in D['occupations']:
    ks=o['keys']; ds=[k['date'] for k in ks]
    if o['side'] not in (0,1): err.append('side '+o['name'])
    if ds!=sorted(ds): err.append('occ not ascending '+o['name'])
    if not 1<=len(ks)<=120: err.append('occ key count '+o['name'])
    for k in ks:
        chkdate(k['date'],o['name']); c=k['coords']
        if not 4<=len(c)<=600: err.append(f"ring len {len(c)} {o['name']}")
        if not inbox(c,(-5,28,50,61)): err.append('occ coords '+o['name'])
    print(f"occ side {o['side']} {o['name']}: {len(ks)} keys")
for a in D['arrows']:
    chkdate(a['start'],a['name']); chkdate(a['end'],a['name'])
    if a['start']>a['end']: err.append('arrow order '+a['name'])
    if not 2<=len(a['path'])<=40: err.append('arrow len '+a['name'])
    if a['side'] not in (0,1): err.append('arrow side')
for b in D['battles']:
    chkdate(b['start'],b['name']); chkdate(b['end'],b['name'])
    if b['start']>b['end']: err.append('battle order '+b['name'])
    if not isinstance(b['casNum'],int): err.append('casNum '+b['name'])
ds=[s['date'] for s in D['shots']]
if ds!=sorted(ds): err.append('shots not ascending')
for s in D['shots']: chkdate(s['date'],'shot')
print('counts: fronts',len(D['fronts']),'occupations',len(D['occupations']),'arrows',len(D['arrows']),'battles',len(D['battles']),'shots',len(D['shots']),'sources',len(D['sources']))
print('ERRORS:',err or 'none')
