"""Lange themamuziek en extra geluidseffecten voor Toet op avontuur."""
import numpy as np, subprocess, wave, os
from audiolib import *

TOET_A = [[('E5',1),('E5',1),('G5',2),('E5',1),('C5',1),('D5',2)], [('D5',1),('D5',1),('B4',1),('D5',1),('G5',3),('-',1)],
          [('C5',1),('E5',1),('A5',2),('G5',1),('E5',1),('C5',2)], [('F5',1),('E5',1),('D5',1),('C5',1),('D5',3),('-',1)],
          [('E5',1),('E5',1),('G5',2),('C6',2),('B5',1),('A5',1)], [('G5',2),('D5',1),('E5',1),('F5',2),('E5',1),('D5',1)],
          [('C5',1),('D5',1),('E5',1),('F5',1),('A5',2),('G5',2)], [('C5',4),('-',2),('G4',1),('B4',1)]]
TOET_ACH = ['C','G','Am','F','C','G','F','C']
TOET_B = [[('A5',2),('G5',1),('F5',1),('A5',2),('C6',2)], [('B5',2),('A5',1),('G5',1),('D5',4)],
          [('G5',1),('E5',1),('G5',1),('E5',1),('B5',2),('G5',2)], [('A5',1),('C6',1),('B5',1),('A5',1),('E5',4)],
          [('F5',1),('G5',1),('A5',1),('F5',1),('C6',3),('-',1)], [('B5',1),('A5',1),('G5',1),('F5',1),('D5',2),('G4',2)],
          [('C5',1),('E5',1),('G5',1),('C6',1),('G5',1),('E5',1),('C5',2)], [('C5',2),('-',6)]]
TOET_BCH = ['F','G','Em','Am','F','G','C','C']
# rustige tussenstukken (alleen begeleiding + glock) zodat het niet eentonig wordt
TOET_C = [None] * 8
TOET_CCH = ['Am','F','C','G','Am','F','G','G']

def toet_long(dur, shift=0, soft=False):
    E, BAR = .25, 2.0
    tr = Track(dur)
    CH = {'C': (['C3','G3'], ['C4','E4','G4']), 'G': (['G2','D3'], ['B3','D4','G4']), 'Am': (['A2','E3'], ['C4','E4','A4']),
          'F': (['F2','C3'], ['C4','F4','A4']), 'Em': (['E3','B3'], ['B3','E4','G4'])}
    nb = int(dur // BAR)
    body = []
    cyc = [(TOET_A, TOET_ACH), (TOET_B, TOET_BCH), (TOET_A, TOET_ACH), (TOET_C, TOET_CCH)]
    i = 0
    while len(body) < nb - 6:
        m, c = cyc[i % 4]; body += list(zip(m, c)); i += 1
    body = body[:nb - 6]
    outro = list(zip([TOET_A[4], TOET_A[5], TOET_A[6], [('C5',1),('E5',1),('G5',1),('C6',5)]], ['C','G','F','C']))
    song = [(None,'C'),(None,'G')] + body + outro
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi * BAR; roots, tri = CH[ch]; fin = bi == last
        for beat in range(4 if not fin else 1):
            tr.add(tri_bass(freq(roots[beat % 2], shift), 2*E*.95 if not fin else BAR), t0 + beat*2*E, 0, .55)
        fr = [freq(n, shift) for n in tri]
        for k in range(4 if not fin else 1):
            tr.add(pluck(fr, .45 if not fin else 1.8), t0 + ((2*k+1)*E if not fin else 0), -.35, .42)
        if not fin and not soft:
            for beat in range(4):
                if beat in (0, 2): tr.add(kick(), t0 + beat*2*E, 0, .75)
                if beat in (1, 3) and bi >= 2: tr.add(clap(), t0 + beat*2*E, .1, .32)
            for k in range(8): tr.add(hat(), t0 + k*E + (.02 if k % 2 else 0), .4, .5 if k % 2 else .3)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate(tri + [tri[1]]): tr.add(glock(freq(n, shift + 12), .8), t0 + k * .5, .3, .18)
        if mel:
            pos = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); length = ln*E + (1.5 if fin and ln > 2 else .25)
                    tr.add(mallet(f, length, .35 if ln < 3 else .6), t0 + pos*E, .05, .6)
                    tr.add(glock(f, length), t0 + pos*E, .25, .12)
                pos += ln
    return tr.buf

def safari_long(dur, shift=0):
    E, BAR = .25, 2.0
    tr = Track(dur)
    CH = {'C': ('C3', ['C4','E4','G4']), 'F': ('F2', ['C4','F4','A4']), 'G': ('G2', ['B3','D4','G4']), 'Am': ('A2', ['A3','C4','E4'])}
    A = [([('G5',1),('A5',1),('G5',1),('E5',1),('D5',2),('C5',2)], 'C'), ([('C5',1),('D5',1),('E5',2),('G5',1),('A5',1),('G5',2)], 'F'),
         ([('A5',1),('G5',1),('E5',1),('D5',1),('E5',2),('D5',2)], 'G'), ([('C5',3),('-',1),('E5',1),('D5',1),('C5',2)], 'C'),
         ([('E5',1),('G5',1),('A5',2),('C6',2),('A5',2)], 'Am'), ([('G5',1),('A5',1),('G5',1),('E5',1),('C5',2),('D5',2)], 'F'),
         ([('E5',1),('D5',1),('E5',1),('G5',1),('D5',4)], 'G'), ([('C5',2),('-',6)], 'C')]
    Cc = [(None, c) for c in ['Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'G']]
    nb = int(dur // BAR); body = []; i = 0
    while len(body) < nb - 6: body += (A if i % 3 != 2 else Cc); i += 1
    song = [(None, 'C'), (None, 'G')] + body[:nb - 6] + [A[4], A[5], A[6], ([('C5',1),('E5',1),('G5',1),('C6',5)], 'C')]
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi * BAR; root, tri = CH[ch]; fin = bi == last
        for beat in range(4 if not fin else 1):
            tr.add(sine_bass(freq(root, shift) * (1.5 if beat == 2 else 1), .45 if not fin else 2), t0 + beat*.5, 0, .7)
        for k in range(8 if not fin else 1):
            if k in (1, 3, 4, 6) or fin: tr.add(kalimba([freq(n, shift) for n in tri], .6 if not fin else 2), t0 + k*E, -.4, .35)
        if not fin:
            for k, kind in enumerate(['L', '', 'S', 'S', 'L', 'L', 'S', '']):
                if kind == 'L': tr.add(djembe_low(), t0 + k*E, -.1, .8)
                if kind == 'S' and bi >= 2: tr.add(djembe_slap(), t0 + k*E, .2, .4)
            for k in range(16): tr.add(shaker(), t0 + k*E/2, .5, .5 if k % 2 else .3)
        else:
            tr.add(djembe_low(), t0, 0, .8)
        if mel:
            pos = 0
            for note, ln in mel:
                if note != '-': tr.add(marimba(freq(note, shift), ln*E + (1.6 if fin and ln > 2 else .3)), t0 + pos*E, .1, .6)
                pos += ln
    return tr.buf

def lullaby(dur):
    tmp = f'/tmp/claude-0/lull_{int(dur)}.wav'
    subprocess.run(['python3', os.path.join(os.path.dirname(__file__), '..', 'ep', 'bw_long_music.py'), tmp, str(dur)], check=True, capture_output=True, cwd=os.path.join(os.path.dirname(__file__), '..'))
    with wave.open(tmp) as w: a = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, 2).astype(np.float64) / 32767
    return a

# ---------- extra effecten ----------
def slide_down(length=1.0):
    n = int(length*SR); t = tt(n); f = fcurve([(0, 900), (length, 260)], n)
    return (osc(f, 'sine') * (.8 + .2*np.sin(2*np.pi*10*t)) + .3*osc(f*1.5, 'sine')) * np.minimum(t/.05, 1) * np.clip((length - t)/.2, 0, 1) * .55
def quack():
    out = np.zeros(int(.7*SR))
    for d in (0, .3):
        n = int(.2*SR); t = tt(n); s = band(osc(fcurve([(0, 520), (.2, 380)], n), 'saw'), 600, 2500) * np.minimum(t/.01, 1) * np.exp(-t/.09)
        i = int(d*SR); out[i:i+n] += s
    return out * .8
def peep():
    out = np.zeros(int(.6*SR))
    for d in (0, .25):
        n = int(.14*SR); t = tt(n); s = osc(fcurve([(0, 2600), (.14, 3200)], n), 'sine') * np.minimum(t/.01, 1) * np.exp(-t/.06)
        i = int(d*SR); out[i:i+n] += s
    return out * .6
def baa():
    n = int(.9*SR); t = tt(n); f = fcurve([(0, 330), (.9, 300)], n) * (1 + .03*np.sin(2*np.pi*7*t))
    s = band(osc(f, 'saw'), 300, 2500) * (.6 + .4*np.abs(np.sin(2*np.pi*7*t)))
    return s * np.minimum(t/.05, 1) * np.clip((.9 - t)/.3, 0, 1)
def swish(length=.45):
    n = int(length*SR); t = tt(n); nz = rng.standard_normal(n)
    s = band(nz, 1500, 7000) * np.sin(np.pi * t / length)
    return s * .5
def rain(length):
    n = int(length*SR); t = tt(n)
    s = band(rng.standard_normal(n), 2000, 9000) * .25 + band(rng.standard_normal(n), 300, 1200) * .15
    drops = np.zeros(n)
    for k in range(int(length * 25)):
        i = int(rng.random() * (n - 2000)); drops[i:i+400] += np.sin(2*np.pi*(1800 + rng.random()*1500)*tt(400)) * np.exp(-tt(400)/.004) * .3
    return (s + drops) * np.minimum(t/1.5, 1) * np.clip((length - t)/1.5, 0, 1)
def psss(length=1.4):
    n = int(length*SR); t = tt(n)
    return band(rng.standard_normal(n), 3000, 10000) * np.exp(-t/.6) * np.minimum(t/.02, 1) * .8
def clank():
    n = int(.5*SR); t = tt(n)
    return sum(np.sin(2*np.pi*f*t) * np.exp(-t/d) for f, d in ((820, .2), (1370, .12), (2290, .07))) * .5
def yawn():
    n = int(1.6*SR); t = tt(n); f = fcurve([(0, 330), (.5, 420), (1.6, 200)], n)
    s = band(osc(f, 'saw'), 200, 1500)
    return s * np.minimum(t/.2, 1) * np.clip((1.6 - t)/.6, 0, 1) * .5
def puf():
    out = np.zeros(int(1.2*SR))
    for d in (0, .3, .6):
        n = int(.18*SR); t = tt(n); s = band(rng.standard_normal(n), 80, 600) * np.exp(-t/.05) + np.sin(2*np.pi*60*t) * np.exp(-t/.06)
        i = int(d*SR); out[i:i+n] += s
    return out
def brushes(length):
    n = int(length*SR); t = tt(n)
    return band(rng.standard_normal(n), 400, 3000) * (.6 + .4*np.sin(2*np.pi*3*t)) * np.minimum(t/.5, 1) * np.clip((length - t)/.5, 0, 1) * .5
def spray(length):
    n = int(length*SR); t = tt(n)
    return band(rng.standard_normal(n), 2500, 12000) * np.minimum(t/.3, 1) * np.clip((length - t)/.3, 0, 1) * .5
def cheer():
    out = np.zeros(int(2.0*SR))
    for k in range(4):
        s = laugh(); j = int(k * .18 * SR); out[j:j+len(s)] += s * (.6 + .1*k)
    n = len(out); t = tt(n)
    out += band(rng.standard_normal(n), 500, 4000) * np.exp(-t/.7) * .3
    return out
def twinkle(note='E6'):
    return chime(note) * .6
def bump():
    n = int(.3*SR); t = tt(n)
    return np.sin(2*np.pi*np.cumsum(90 + 40*np.exp(-t/.03))/SR) * np.exp(-t/.08) + band(rng.standard_normal(n), 200, 1500) * np.exp(-t/.03) * .4

NAMED = {
    'honk': honk, 'moo': moo, 'pop': pop, 'splash': splash, 'whoosh': whoosh_up, 'arp': arpeggio, 'sad': sad, 'tada': tada,
    'tick': tick, 'boing': boing, 'rustle': rustle, 'squeak': squeak, 'roar': roar, 'trumpet': trumpet, 'snort': snort,
    'bellow': bellow, 'laugh': laugh, 'chime': chime, 'slide': slide_down, 'quack': quack, 'peep': peep, 'baa': baa,
    'swish': swish, 'rain': rain, 'psss': psss, 'clank': clank, 'yawn': yawn, 'puf': puf, 'brushes': brushes,
    'spray': spray, 'cheer': cheer, 'twinkle': twinkle, 'bump': bump,
}
def make(name):
    parts = name.split(':'); fn = NAMED[parts[0]]
    args = []
    for a in parts[1:]:
        try: args.append(float(a))
        except ValueError: args.append(a)
    return fn(*args)
