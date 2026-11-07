"""Lange themamuziek en extra geluidseffecten voor Toet op avontuur."""
import numpy as np, subprocess, wave, os, tempfile
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

# 3/4 "shape hunt" waltz in G: ukulele strums, bouncy bass, whistle-like lead (episode en01)
SH_A = [[('D5',2),('G5',2),('B5',2)], [('A5',3),('G5',1),('E5',2)], [('D5',2),('E5',2),('G5',2)], [('A5',6)],
        [('B5',2),('A5',2),('G5',2)], [('E5',2),('G5',2),('A5',2)], [('F#5',2),('E5',2),('D5',2)], [('G5',4),('-',2)]]
SH_ACH = ['G','C','G','D','Em','C','D','G']
SH_B = [[('E5',1),('F#5',1),('G5',2),('E5',2)], [('C5',2),('E5',2),('G5',2)], [('B4',1),('C5',1),('D5',2),('G5',2)], [('B5',4),('A5',2)],
        [('C6',2),('B5',2),('A5',2)], [('G5',2),('E5',2),('C5',2)], [('D5',2),('A5',2),('F#5',2)], [('G5',6)]]
SH_BCH = ['Em','C','G','G','Am','C','D','G']

def whistle(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.03, 1); r = np.ones(n); cut = max(1, int(n*.75)); r[cut:] = np.linspace(1, 0, n-cut)
    vib = np.sin(2*np.pi*5.2*t) * .004 * np.minimum(t/.25, 1)
    ph = 2*np.pi*f*np.cumsum(1 + vib)/SR
    return (np.sin(ph) + .08*np.sin(2*ph)) * a * r * .8

def shapes_long(dur, shift=0):
    BEAT = .6; BAR = 3*BEAT; E = BEAT/2
    tr = Track(dur)
    CH = {'G': ('G2', ['G3','B3','D4','G4']), 'C': ('C3', ['C4','E4','G4','C5']), 'D': ('D3', ['A3','D4','F#4','A4']),
          'Em': ('E3', ['B3','E4','G4','B4']), 'Am': ('A2', ['A3','C4','E4','A4'])}
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(SH_A, SH_ACH), (SH_B, SH_BCH), (SH_A, SH_ACH), (None, ['C','G','Am','D','C','G','D','G'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'G'),(None,'D')] + body[:nb - 4] + [(SH_A[6], 'D'), ([('G5',6)], 'G')]
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; root, ch4 = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in ch4]
        tr.add(tri_bass(freq(root, shift), BEAT*.9 if not fin else BAR), t0, 0, .6)
        if not fin:
            tr.add(tri_bass(freq(root, shift)*1.5, BEAT*.8), t0 + 2*BEAT, 0, .4)
            for b in (1, 2):
                tr.add(pluck(fr, .35), t0 + b*BEAT, -.3, .38); tr.add(pluck(fr[1:], .25), t0 + b*BEAT + E, -.3, .22)
                tr.add(shaker(), t0 + b*BEAT, .45, .45); tr.add(shaker(), t0 + b*BEAT + E, .45, .25)
            if bi >= 2: tr.add(djembe_low(), t0, -.1, .45)
        else: tr.add(pluck(fr, 2.0), t0, -.3, .45)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate([ch4[1], ch4[2], ch4[3]]): tr.add(kalimba([freq(n, shift + 12)], .9), t0 + k*BEAT, .3, .22)
        if mel:
            pos = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*E + (1.4 if fin else .1)
                    tr.add(whistle(f, L), t0 + pos*E, .1, .32); tr.add(marimba(f, L), t0 + pos*E, .15, .3)
                pos += ln
    return tr.buf

def lullaby(dur):
    tmp = os.path.join(tempfile.gettempdir(), f'lull_{int(dur)}.wav')
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

# ---------- "kind friends" (episode en02): gentle swing in F, pan flute lead, vibes, walking bass, brushes ----------
KF_A = [[('C5',2),('F5',2),('A5',3),('G5',1)], [('F5',2),('D5',2),('A4',4)], [('D5',2),('F5',2),('A#5',3),('A5',1)], [('G5',6),('-',2)],
        [('A5',2),('C6',2),('A5',2),('F5',2)], [('G5',3),('A#5',1),('A5',2),('G5',2)], [('E5',2),('G5',2),('C6',2),('A#5',2)], [('A5',6),('-',2)]]
KF_ACH = ['F','Dm','A#','C','F','Gm','C','F']
KF_B = [[('D6',3),('C6',1),('A#5',2),('A5',2)], [('C6',4),('A5',2),('F5',2)], [('A#5',3),('A5',1),('G5',2),('D5',2)], [('F5',4),('A5',4)],
        [('F5',2),('G5',2),('A5',2),('A#5',2)], [('C6',3),('A5',1),('E5',4)], [('G5',2),('A5',2),('A#5',2),('E5',2)], [('F5',6),('-',2)]]
KF_BCH = ['A#','F','Gm','Dm','A#','Am','C','F']

def panflute(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.06, 1); r = np.ones(n); cut = max(1, int(n*.7)); r[cut:] = np.linspace(1, 0, n-cut)
    vib = np.sin(2*np.pi*4.8*t) * .005 * np.minimum(t/.3, 1)
    ph = 2*np.pi*f*np.cumsum(1 + vib)/SR
    breath = band(rng.standard_normal(n), f*.8, f*3.5) * .12 * np.exp(-t/.12)
    return (np.sin(ph) + .12*np.sin(2*ph) + .05*np.sin(3*ph) + breath) * a * r * .8

def vibes(freqs, length):
    n = int(length*SR); t = tt(n); e = envexp(n, .004, .9) * (1 + .25*np.sin(2*np.pi*5*t))
    return sum(np.sin(2*np.pi*f*t) + .2*np.sin(2*np.pi*4*f*t)*np.exp(-t/.06) for f in freqs) * e / len(freqs)

def brush_hit():
    n = int(.25*SR); t = tt(n)
    return band(rng.standard_normal(n), 900, 6000) * np.minimum(t/.008, 1) * np.exp(-t/.07) * .5

def kind_long(dur, shift=0):
    BEAT = .625; BAR = 4*BEAT; SW = BEAT*.62
    tr = Track(dur)
    CH = {'F': ('F2', ['A3','C4','F4']), 'Dm': ('D3', ['A3','D4','F4']), 'A#': ('A#2', ['A#3','D4','F4']), 'C': ('C3', ['G3','C4','E4']),
          'Gm': ('G2', ['G3','A#3','D4']), 'Am': ('A2', ['A3','C4','E4'])}
    pos_t = lambda p: (p // 2) * BEAT + (p % 2) * SW
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(KF_A, KF_ACH), (KF_B, KF_BCH), (KF_A, KF_ACH), (None, ['Dm','A#','F','C','Dm','Gm','C','C'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'F'),(None,'C')] + body[:nb - 4] + [(KF_A[6], 'C'), ([('F5',8)], 'F')]
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; root, tri = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in tri]; rf = freq(root, shift)
        if not fin:
            for b, m in enumerate([1, 1.5, 2, 1.5]): tr.add(sine_bass(rf*m, BEAT*.85), t0 + b*BEAT, 0, .6)
            tr.add(vibes(fr, BAR*.95), t0, -.35, .38)
            for b in (1, 3): tr.add(pluck(fr, .22), t0 + b*BEAT + SW, -.2, .2)
            if bi >= 2:
                for b in (1, 3): tr.add(brush_hit(), t0 + b*BEAT, .3, .5)
                for b in range(4): tr.add(shaker(), t0 + b*BEAT, .45, .3); tr.add(shaker(), t0 + b*BEAT + SW, .45, .2)
                tr.add(djembe_low(), t0, -.1, .35)
        else:
            tr.add(sine_bass(rf, BAR), t0, 0, .6); tr.add(vibes(fr, BAR*1.2), t0, -.35, .45)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate(tri + [tri[1]]): tr.add(glock(freq(n, shift + 12), .9), t0 + k*BEAT, .3, .14)
        if mel:
            p = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*BEAT/2 + (1.4 if fin else .12)
                    tr.add(panflute(f, L), t0 + pos_t(p), .1, .42); tr.add(mallet(f*2, min(L, .6), .3), t0 + pos_t(p), .25, .07)
                p += ln
    return tr.buf

# ---------- "opposites" (episode en03): bouncy oom-pah march in D, clarinet-like lead, reed-organ chords, tuba bass, xylophone, woodblock ----------
OP_A = [[('A4',1),('D5',1),('F#5',1),('A5',1),('F#5',2),('D5',2)], [('E5',1),('F#5',1),('G5',2),('E5',4)], [('C#5',1),('E5',1),('A5',2),('G5',1),('F#5',1),('E5',2)], [('F#5',2),('E5',2),('D5',4)],
        [('B4',1),('D5',1),('G5',2),('B5',2),('G5',2)], [('A5',2),('F#5',1),('D5',1),('A5',4)], [('G5',1),('F#5',1),('E5',1),('D5',1),('C#5',2),('E5',2)], [('D5',6),('-',2)]]
OP_ACH = ['D','A','A','D','G','D','A','D']
OP_B = [[('F#5',2),('-',2),('D5',2),('-',2)], [('G5',2),('-',2),('E5',2),('-',2)], [('A5',1),('B5',1),('A5',1),('G5',1),('F#5',4)], [('E5',2),('F#5',2),('A4',4)],
        [('D6',2),('B5',2),('G5',2),('B5',2)], [('A5',2),('F#5',2),('D5',4)], [('E5',2),('G5',2),('C#5',2),('E5',2)], [('D5',4),('A4',2),('D5',2)]]
OP_BCH = ['D','Em','A','A','G','D','A','D']

def clarinet(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.03, 1); r = np.ones(n); cut = max(1, int(n*.8)); r[cut:] = np.linspace(1, 0, n-cut)
    vib = np.sin(2*np.pi*5.5*t) * .004 * np.minimum(t/.3, 1)
    ph = 2*np.pi*f*np.cumsum(1 + vib)/SR
    return (np.sin(ph) + .45*np.sin(3*ph) + .2*np.sin(5*ph) + .08*np.sin(7*ph)) * a * r * .5

def reed(freqs, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.02, 1) * np.exp(-t/.5)
    return sum(np.sin(2*np.pi*f*t) + .35*np.sin(4*np.pi*f*t) + .15*np.sin(6*np.pi*f*t) for f in freqs) * a / len(freqs) * .7

def tuba(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.015, 1) * np.exp(-t/.35)
    return (np.sin(2*np.pi*f*t) + .3*np.sin(4*np.pi*f*t)) * a

def woodblock(pitch=1.0):
    n = int(.12*SR); t = tt(n)
    return (np.sin(2*np.pi*900*pitch*t) + .5*np.sin(2*np.pi*1650*pitch*t)) * np.exp(-t/.025) * .6

def xylo(f, length):
    n = int(min(length, .5)*SR); t = tt(n)
    return (np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*3.9*f*t)*np.exp(-t/.03)) * np.exp(-t/.12)

def opp_long(dur, shift=0):
    BEAT = .5; BAR = 4*BEAT; E = BEAT/2
    tr = Track(dur)
    CH = {'D': ('D2', 'A2', ['F#3','A3','D4']), 'A': ('A2', 'E2', ['E3','A3','C#4']), 'G': ('G2', 'D2', ['G3','B3','D4']),
          'Em': ('E2', 'B2', ['E3','G3','B3'])}
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(OP_A, OP_ACH), (OP_B, OP_BCH), (OP_A, OP_ACH), (None, ['G','D','Em','A','G','D','A','A'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'D'),(None,'A')] + body[:nb - 4] + [(OP_A[6], 'A'), ([('D5',8)], 'D')]
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; r1, r2, tri = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in tri]
        if not fin:
            for b in range(4):
                tr.add(tuba(freq(r1 if b % 2 == 0 else r2, shift), BEAT*.8), t0 + b*BEAT, 0, .55)   # oom
                tr.add(reed(fr, BEAT*.45), t0 + b*BEAT + E, -.3, .3)                                 # pah
            if bi >= 2:
                for b in range(4): tr.add(woodblock(1.0 if b % 2 else 1.25), t0 + b*BEAT + (E if b == 3 else 0), .4, .35)
                tr.add(kick(), t0, 0, .5); tr.add(kick(), t0 + 2*BEAT, 0, .4)
        else:
            tr.add(tuba(freq(r1, shift), BAR), t0, 0, .6); tr.add(reed(fr, BAR), t0, -.3, .4)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate([tri[0], tri[1], tri[2], tri[1]]): tr.add(xylo(freq(n, shift + 12), .5), t0 + k*BEAT, .3, .3)
        if mel:
            p = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*E + (1.4 if fin else .05)
                    tr.add(clarinet(f, L), t0 + p*E, .1, .38); tr.add(xylo(f*2, L), t0 + p*E, .2, .12)
                p += ln
    return tr.buf

# ---------- "weather" (episode en04): sunny calypso in G, steel-pan lead, marimba off-beats, ukulele strum, bass, congas + shaker ----------
WE_A = [[('B4',1),('D5',1),('G5',2),('B5',1),('A5',1),('G5',2)], [('E5',1),('G5',1),('C6',2),('B5',1),('A5',3)], [('A4',1),('D5',1),('F#5',2),('A5',1),('G5',1),('F#5',2)], [('G5',3),('D5',1),('B4',4)],
        [('B4',1),('D5',1),('G5',2),('B5',2),('D6',2)], [('C6',1),('B5',1),('A5',1),('G5',1),('E5',4)], [('D5',1),('E5',1),('F#5',1),('A5',1),('G5',1),('F#5',1),('E5',1),('F#5',1)], [('G5',6),('-',2)]]
WE_ACH = ['G','C','D','G','G','Em','D','G']
WE_B = [[('E5',2),('G5',1),('E5',1),('C6',2),('B5',2)], [('A5',2),('G5',1),('E5',1),('D5',4)], [('C5',1),('E5',1),('G5',1),('A5',1),('B5',2),('A5',2)], [('G5',2),('E5',2),('D5',4)],
        [('E5',1),('E5',1),('G5',2),('C6',1),('C6',1),('B5',2)], [('A5',1),('B5',1),('A5',1),('G5',1),('D5',4)], [('C5',1),('D5',1),('E5',1),('F#5',1),('A5',2),('F#5',2)], [('G5',4),('D5',2),('G5',2)]]
WE_BCH = ['C','G','Am','D','C','G','D','G']

def steelpan(f, length):
    n = int(min(length, 1.6)*SR); t = tt(n)
    e = np.minimum(t/.004, 1) * np.exp(-t/.45)
    return (np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*2*f*t)*np.exp(-t/.25) + .25*np.sin(2*np.pi*3.01*f*t)*np.exp(-t/.12)
            + .15*np.sin(2*np.pi*1.5*f*t)*np.exp(-t/.08)) * e * .55

def uke(freqs, length=.3, down=True):
    n = int(length*SR); out = np.zeros(n); fs = freqs if down else freqs[::-1]
    for i, f in enumerate(fs):
        o = int(i*.012*SR); m = n - o; t = tt(m)
        out[o:] += (np.sin(2*np.pi*f*t) + .4*np.sin(4*np.pi*f*t) + .2*np.sin(6*np.pi*f*t)) * np.exp(-t/.14)
    return out / len(freqs) * .6

def conga(high=False):
    n = int(.25*SR); t = tt(n); f0 = 330 if high else 220
    return np.sin(2*np.pi*np.cumsum(f0 + 60*np.exp(-t/.02))/SR) * np.exp(-t/(.09 if high else .13)) * .8

def weather_long(dur, shift=0):
    BEAT = .5; BAR = 4*BEAT; E = BEAT/2
    tr = Track(dur)
    CH = {'G': ('G2', ['G3','B3','D4']), 'C': ('C3', ['G3','C4','E4']), 'D': ('D3', ['F#3','A3','D4']),
          'Em': ('E2', ['G3','B3','E4']), 'Am': ('A2', ['A3','C4','E4'])}
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(WE_A, WE_ACH), (WE_B, WE_BCH), (WE_A, WE_ACH), (None, ['C','D','G','Em','C','D','G','G'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'G'),(None,'D')] + body[:nb - 4] + [(WE_A[6], 'D'), ([('G5',8)], 'G')]
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; root, tri = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in tri]; rf = freq(root, shift)
        if not fin:
            # calypso bass: 1, (and of 2), 3
            for p, m in [(0, 1), (3, 1), (4, 1.5), (6, 2)]: tr.add(sine_bass(rf*m, E*1.6), t0 + p*E, 0, .55)
            for p, dn in [(0, 1), (2, 1), (3, 0), (5, 0), (6, 1)]: tr.add(uke(fr, .3, bool(dn)), t0 + p*E, -.3, .28)
            for p in (1, 3, 5, 7): tr.add(marimba(fr[2]*2 if p % 4 == 1 else fr[1]*2, .25), t0 + p*E, .35, .12)
            if bi >= 2:
                for p, hi in [(0, 0), (3, 1), (4, 1), (6, 0), (7, 1)]: tr.add(conga(bool(hi)), t0 + p*E, .2 if hi else -.15, .4)
                for p in range(8): tr.add(shaker(), t0 + p*E, .45, .22 if p % 2 else .32)
        else:
            tr.add(sine_bass(rf, BAR), t0, 0, .6); tr.add(uke(fr, BAR), t0, -.3, .4)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate([tri[2], tri[1], tri[2], tri[0]]): tr.add(steelpan(freq(n, shift + 12), .6), t0 + k*BEAT + (E if k % 2 else 0), .2, .22)
        if mel:
            p = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*E + (1.4 if fin else .1)
                    tr.add(steelpan(f, L), t0 + p*E, .1, .45)
                    if ln >= 2 and not fin: tr.add(steelpan(f, .3), t0 + p*E + E, .1, .18)   # pan "roll" echo
                p += ln
    return tr.buf

# ---------- "homes" (episode en05): bouncy country/bluegrass in D, fiddle lead, banjo rolls, boom-chick bass + guitar, brush snare ----------
HM_A = [[('F#5',2),('A5',2),('B5',1),('A5',1),('F#5',2)], [('G5',2),('B5',2),('D6',2),('B5',2)], [('A5',1),('B5',1),('A5',1),('F#5',1),('E5',2),('F#5',2)], [('D5',6),('-',2)],
        [('F#5',2),('A5',2),('D6',2),('C#6',1),('B5',1)], [('B5',2),('G5',2),('E5',2),('G5',2)], [('F#5',1),('G5',1),('A5',2),('E5',2),('C#5',2)], [('D5',6),('-',2)]]
HM_ACH = ['D','G','A','D','D','G','A','D']
HM_B = [[('G5',3),('A5',1),('B5',2),('G5',2)], [('F#5',3),('G5',1),('A5',2),('F#5',2)], [('E5',2),('F#5',2),('G5',2),('B5',2)], [('A5',6),('-',2)],
        [('G5',2),('B5',2),('D6',2),('B5',2)], [('A5',2),('F#5',2),('D5',2),('F#5',2)], [('E5',2),('A5',2),('G5',1),('F#5',1),('E5',2)], [('D5',6),('-',2)]]
HM_BCH = ['G','D','Em','A','G','D','A','D']

def fiddle(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.05, 1); r = np.ones(n); cut = max(1, int(n*.75)); r[cut:] = np.linspace(1, 0, n-cut)
    vib = np.sin(2*np.pi*5.6*t) * .006 * np.minimum(t/.25, 1)
    ph = 2*np.pi*f*np.cumsum(1 + vib)/SR
    s = sum(np.sin(k*ph) * (1/k) * (1 if k < 4 else .6) for k in range(1, 9))
    bow = band(rng.standard_normal(n), 2000, 7000) * .05 * (1 + np.exp(-t/.05))
    return (s * .32 + bow) * a * r

def banjo(f, length=.3):
    n = int(length*SR); t = tt(n)
    return sum(np.sin(2*np.pi*k*f*t) * np.exp(-t*(7 + k*5)) / k for k in range(1, 7)) * np.minimum(t/.001, 1) * .7

def buzz(length=2.0):
    n = int(length*SR); t = tt(n); f = 210 + 25*np.sin(2*np.pi*3*t) + 15*np.sin(2*np.pi*7.3*t)
    s = band(osc(f, 'saw'), 150, 2500) * (.7 + .3*np.sin(2*np.pi*31*t))
    return s * np.minimum(t/.15, 1) * np.clip((length - t)/.3, 0, 1) * .5
def tweet():
    out = np.zeros(int(.9*SR))
    for d, f0, f1 in ((0, 2400, 3400), (.18, 2600, 3600), (.42, 3200, 2200)):
        n = int(.13*SR); t = tt(n); s = osc(fcurve([(0, f0), (.13, f1)], n), 'sine') * np.sin(np.pi*t/.13) * (1 + .3*np.sin(2*np.pi*60*t))
        i = int(d*SR); out[i:i+n] += s
    return out * .55
def blub():
    out = np.zeros(int(.8*SR))
    for d, f0 in ((0, 300), (.16, 420), (.34, 360)):
        n = int(.12*SR); t = tt(n); s = osc(fcurve([(0, f0), (.12, f0*2.2)], n), 'sine') * np.exp(-t/.04)
        i = int(d*SR); out[i:i+n] += s
    return out * .7
NAMED.update({'buzz': buzz, 'tweet': tweet, 'blub': blub})

def homes_long(dur, shift=0):
    BEAT = .45; BAR = 4*BEAT; E = BEAT/2
    tr = Track(dur)
    CH = {'D': ('D3', ['F#3','A3','D4']), 'G': ('G2', ['G3','B3','D4']), 'A': ('A2', ['E3','A3','C#4']), 'Em': ('E3', ['E3','G3','B3'])}
    FIFTH = {'D': 'A2', 'G': 'D3', 'A': 'E3', 'Em': 'B2'}
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(HM_A, HM_ACH), (HM_B, HM_BCH), (HM_A, HM_ACH), (None, ['G','D','A','D','G','D','A','A'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'D'),(None,'A')] + body[:nb - 4] + [(HM_A[6], 'A'), ([('D5',8)], 'D')]
    last = len(song) - 1
    ROLL = [2, 1, 0, 2, 1, 0, 2, 1]     # forward roll over the chord tones (banjo, one octave up)
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; root, tri = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in tri]; rf = freq(root, shift); ff = freq(FIFTH[ch], shift)
        if not fin:
            for b, f in enumerate([rf, None, ff, None]):
                if f: tr.add(sine_bass(f, BEAT*.9), t0 + b*BEAT, 0, .6)
            for b in (1, 3): tr.add(pluck(fr, .16), t0 + b*BEAT, -.3, .26)
            for p in range(8): tr.add(banjo(fr[ROLL[p]]*2, .3), t0 + p*E, .35, .16 if p % 2 else .22)
            if bi >= 2:
                for b in (1, 3): tr.add(brush_hit(), t0 + b*BEAT, .15, .55)
                for p in range(8): tr.add(shaker(), t0 + p*E, -.4, .14 if p % 2 else .2)
        else:
            tr.add(sine_bass(rf, BAR), t0, 0, .6); tr.add(pluck(fr, BAR), t0, -.3, .35); tr.add(banjo(fr[2]*2, BAR), t0, .35, .25)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate([tri[0], tri[1], tri[2], tri[1]]): tr.add(fiddle(freq(n, shift + 12), BEAT*.95), t0 + k*BEAT, .1, .22)
        if mel:
            p = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*E + (1.4 if fin else .04)
                    tr.add(fiddle(f, L), t0 + p*E, .1, .5)
                p += ln
    return tr.buf

# ---------- "music" (episode en06): laid-back one-drop reggae in A, melodica lead, organ skank, round bass, rimshot ----------
MU_A = [[('C#5',2),('E5',2),('A5',3),('G#5',1)], [('F#5',2),('A5',2),('F#5',2),('D5',2)], [('E5',1),('F#5',1),('G#5',2),('B5',2),('G#5',2)], [('A5',6),('-',2)],
        [('C#6',2),('B5',1),('A5',1),('F#5',2),('A5',2)], [('A5',2),('F#5',1),('E5',1),('D5',4)], [('E5',2),('G#5',2),('B5',1),('A5',1),('G#5',2)], [('A5',6),('-',2)]]
MU_ACH = ['A','D','E','A','F#m','D','E','A']
MU_B = [[('F#5',3),('E5',1),('D5',2),('F#5',2)], [('E5',3),('C#5',1),('A4',4)], [('D5',2),('F#5',2),('B5',2),('A5',2)], [('G#5',6),('-',2)],
        [('A5',2),('F#5',2),('D6',3),('C#6',1)], [('C#6',2),('A5',2),('E5',4)], [('B4',1),('C#5',1),('E5',2),('G#5',2),('B5',2)], [('A5',6),('-',2)]]
MU_BCH = ['D','A','Bm','E','D','A','E','A']

def melodica(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.04, 1); r = np.ones(n); cut = max(1, int(n*.8)); r[cut:] = np.linspace(1, 0, n-cut)
    vib = np.sin(2*np.pi*5.2*t) * .003 * np.minimum(t/.4, 1)
    ph = 2*np.pi*f*np.cumsum(1 + vib)/SR
    s = sum(np.sin(k*ph) * (1/k) for k in (1, 3, 5, 7)) + .35*np.sin(2*ph)
    return (s * .42 + band(rng.standard_normal(n), f, f*4) * .03) * a * r

def organ(freqs, length=.22):
    n = int(length*SR); t = tt(n); e = np.minimum(t/.004, 1) * np.exp(-t/.09)
    return sum(np.sin(2*np.pi*f*t) + .5*np.sin(4*np.pi*f*t) + .25*np.sin(6*np.pi*f*t) for f in freqs) * e / len(freqs) * .7

def rimshot():
    n = int(.12*SR); t = tt(n)
    return (np.sin(2*np.pi*1700*t) * .5 + band(rng.standard_normal(n), 2000, 8000)) * np.exp(-t/.02) * .55

def drum_boom(pitch=1.0):
    n = int(.6*SR); t = tt(n); f = (95 + 70*np.exp(-t/.03)) * pitch
    return (np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/.22) + band(rng.standard_normal(n), 300, 3000) * np.exp(-t/.02) * .35) * .95
def maraca():
    out = np.zeros(int(.4*SR))
    for d, g in ((0, 1), (.11, .7), (.2, .9)):
        n = int(.09*SR); tt_ = tt(n); s = band(rng.standard_normal(n), 3500, 12000) * np.minimum(tt_/.01, 1) * np.exp(-tt_/.035)
        i = int(d*SR); out[i:i+n] += s * g
    return out * .8
def xylo_note(note='C5'):
    return xylo(freq(note), .5) * .8
def toot(length=1.0):
    n = int(length*SR); t = tt(n); f = 330 * (1 + .02*np.sin(2*np.pi*6*t))
    ph = 2*np.pi*np.cumsum(f)/SR
    s = sum(np.sin(k*ph) * (1/k**.8) for k in range(1, 9))
    return s * np.minimum(t/.03, 1) * np.clip((length - t)/.15, 0, 1) * .32
NAMED.update({'drum': drum_boom, 'maraca': maraca, 'xylo': xylo_note, 'toot': toot})

def music_long(dur, shift=0):
    BEAT = .6; BAR = 4*BEAT; E = BEAT/2
    tr = Track(dur)
    CH = {'A': ('A2', ['A3','C#4','E4']), 'D': ('D3', ['A3','D4','F#4']), 'E': ('E2', ['G#3','B3','E4']),
          'F#m': ('F#2', ['A3','C#4','F#4']), 'Bm': ('B2', ['B3','D4','F#4'])}
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(MU_A, MU_ACH), (MU_B, MU_BCH), (MU_A, MU_ACH), (None, ['D','E','A','F#m','D','E','A','A'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'A'),(None,'E')] + body[:nb - 4] + [(MU_A[6], 'E'), ([('A5',8)], 'A')]
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; root, tri = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in tri]; rf = freq(root, shift)
        if not fin:
            for p, m, L in [(0, 1, 2.6), (3, 1, .9), (4, 1.5, 1.6), (6, 2, .9), (7, 1.5, .9)]: tr.add(sine_bass(rf*m, E*L), t0 + p*E, 0, .6)
            for b in range(4): tr.add(organ(fr), t0 + b*BEAT + E, -.3, .3)           # skank on the off-beats
            if bi >= 2:
                tr.add(kick(), t0 + 2*BEAT, 0, .6); tr.add(rimshot(), t0 + 2*BEAT, .15, .4)   # one-drop
                for p in range(8): tr.add(hat(), t0 + p*E + (.03 if p % 2 else 0), .4, .28 if p % 2 else .18)
        else:
            tr.add(sine_bass(rf, BAR), t0, 0, .6); tr.add(organ(fr, BAR), t0, -.3, .35)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate([tri[0], tri[2], tri[1], tri[2]]): tr.add(marimba(freq(n, shift + 12), .4), t0 + k*BEAT + E, .3, .18)
        if mel:
            p = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*E + (1.4 if fin else .05)
                    tr.add(melodica(f, L), t0 + p*E, .1, .42)
                p += ln
    return tr.buf

# ---------- "hide" (episode en07): light bossa nova in F, ocarina lead, nylon-guitar comping, root-fifth bass, clave + shaker ----------
HS_A = [[('A5',3),('G5',1),('F5',2),('C5',2)], [('D5',2),('F5',2),('A5',3),('G5',1)], [('G5',2),('E5',1),('F5',1),('G5',2),('C6',2)], [('A5',6),('-',2)],
        [('C6',3),('A#5',1),('A5',2),('F5',2)], [('G5',2),('A#5',2),('D6',3),('C6',1)], [('A#5',2),('G5',2),('E5',2),('G5',2)], [('F5',6),('-',2)]]
HS_ACH = ['F','Dm','C7','F','F','Gm','C7','F']
HS_B = [[('D6',2),('C6',1),('A#5',1),('A5',4)], [('A#5',2),('A5',1),('G5',1),('F5',4)], [('E5',2),('G5',2),('A#5',2),('D6',2)], [('C6',6),('-',2)],
        [('A5',2),('C6',2),('F6',3),('E6',1)], [('D6',2),('A#5',2),('G5',4)], [('A5',1),('G5',1),('F5',2),('E5',2),('G5',2)], [('F5',6),('-',2)]]
HS_BCH = ['Gm','F','C7','F','Dm','Gm','C7','F']

def ocarina(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.06, 1); r = np.ones(n); cut = max(1, int(n*.7)); r[cut:] = np.linspace(1, 0, n-cut)
    vib = np.sin(2*np.pi*4.8*t) * .005 * np.clip((t - .2)/.3, 0, 1)
    ph = 2*np.pi*f*np.cumsum(1 + vib)/SR
    s = np.sin(ph) + .12*np.sin(3*ph) + .05*np.sin(2*ph)
    breath = band(rng.standard_normal(n), f*.8, f*3) * .06 * (1 + 2*np.exp(-t/.05))
    return (s * .55 + breath) * a * r

def nylon(freqs, length=.5):
    n = int(length*SR); out = np.zeros(n)
    for i, f in enumerate(freqs):        # soft strum: each string 12 ms later
        d = int(i*.012*SR); m = n - d
        if m <= 0: continue
        t = tt(m)
        out[d:] += sum(np.sin(2*np.pi*k*f*t) * np.exp(-t*(3 + k*3)) / k**1.3 for k in range(1, 6)) * np.minimum(t/.004, 1)
    t = tt(n)
    return out / len(freqs) * np.clip((length - t)/.06, 0, 1) * .8

def clave():
    n = int(.15*SR); t = tt(n)
    return (np.sin(2*np.pi*2500*t) * .8 + np.sin(2*np.pi*3900*t) * .25) * np.exp(-t/.018) * .5

def meow(pitch=1.0):
    n = int(.75*SR); t = tt(n); f = fcurve([(0, 520), (.18, 820), (.5, 700), (.75, 430)], n) * pitch
    s = band(osc(f, 'saw'), 500, 3500) * (.75 + .25*np.sin(2*np.pi*6*t))
    wah = .5 + .5*np.sin(np.pi*np.clip(t/.75, 0, 1))
    return s * wah * np.minimum(t/.05, 1) * np.clip((.75 - t)/.2, 0, 1) * .55

def purr(length=1.6):
    n = int(length*SR); t = tt(n)
    s = band(rng.standard_normal(n), 60, 500) * (.5 + .5*np.sin(2*np.pi*24*t)) * (.6 + .4*np.sin(2*np.pi*1.2*t))
    return s * np.minimum(t/.2, 1) * np.clip((length - t)/.3, 0, 1) * .9

def tiptoe():
    out = np.zeros(int(.9*SR))
    for d, note in ((0, 'E6'), (.22, 'G6'), (.44, 'E6'), (.66, 'C6')):
        s = pluck([freq(note)], .2) * .5; i = int(d*SR); out[i:i+len(s)] += s
    return out
NAMED.update({'meow': meow, 'purr': purr, 'tiptoe': tiptoe, 'clave': clave})

def hide_long(dur, shift=0):
    BEAT = .5; BAR = 4*BEAT; E = BEAT/2
    tr = Track(dur)
    CH = {'F': ('F2', ['A3','C4','F4','A4']), 'Dm': ('D3', ['A3','D4','F4','A4']), 'Gm': ('G2', ['A#3','D4','G4','A#4']),
          'C7': ('C3', ['A#3','E4','G4','C5'])}
    FIFTH = {'F': 'C3', 'Dm': 'A2', 'Gm': 'D3', 'C7': 'G2'}
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(HS_A, HS_ACH), (HS_B, HS_BCH), (HS_A, HS_ACH), (None, ['Dm','Gm','C7','F','Dm','Gm','C7','C7'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'F'),(None,'C7')] + body[:nb - 4] + [(HS_A[6], 'C7'), ([('F5',8)], 'F')]
    last = len(song) - 1
    COMP = [0, 3, 6, 10, 13]          # bossa guitar stabs on a 16-step (8th-note, 2 bars feel squeezed into one) grid
    CLAVE = [0, 3, 6, 10, 12]
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; root, ch4 = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in ch4]; rf = freq(root, shift); ff = freq(FIFTH[ch], shift)
        S16 = BAR/16
        if not fin:
            for b, f in ((0, rf), (6, ff), (8, rf), (14, ff)): tr.add(sine_bass(f, S16*5), t0 + b*S16, 0, .55)
            for p in COMP: tr.add(nylon(fr, S16*2.6), t0 + p*S16, -.3, .3)
            if bi >= 2:
                for p in CLAVE: tr.add(clave(), t0 + p*S16, .35, .22)
                for p in range(16): tr.add(shaker(), t0 + p*S16, -.45, .13 if p % 2 else .19)
                tr.add(kick(), t0, 0, .25); tr.add(kick(), t0 + 8*S16, 0, .2)
        else:
            tr.add(sine_bass(rf, BAR), t0, 0, .6); tr.add(nylon(fr, BAR), t0, -.3, .4)
        if mel is None and not fin and bi >= 2:
            for k, n in enumerate([ch4[3], ch4[2], ch4[1], ch4[2]]): tr.add(glock(freq(n, shift), .5), t0 + k*BEAT + E, .3, .1)
        if mel:
            p = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*E + (1.4 if fin else .05)
                    tr.add(ocarina(f, L), t0 + p*E, .1, .48)
                p += ln
    return tr.buf

# ---------- "fruit picnic" (episode en08): gentle Celtic-style jig in D, 6/8 – tin whistle lead, musette accordion, bodhran, plucked bouzouki ----------
JG_A = [[('D5',2),('F#5',1),('A5',2),('F#5',1)], [('G5',2),('B5',1),('A5',2),('F#5',1)], [('E5',1),('F#5',1),('G5',1),('A5',2),('E5',1)], [('F#5',3),('D5',3)],
        [('D5',2),('F#5',1),('A5',2),('D6',1)], [('B5',2),('G5',1),('A5',2),('F#5',1)], [('E5',1),('G5',1),('F#5',1),('E5',2),('C#5',1)], [('D5',6)]]
JG_ACH = ['D','G','A','D','D','G','A','D']
JG_B = [[('A5',2),('B5',1),('A5',1),('G5',1),('F#5',1)], [('G5',2),('E5',1),('B4',3)], [('A5',2),('B5',1),('C#6',2),('A5',1)], [('D6',3),('A5',3)],
        [('B5',2),('A5',1),('G5',2),('B5',1)], [('A5',2),('F#5',1),('D5',3)], [('E5',1),('F#5',1),('G5',1),('A5',1),('B5',1),('C#6',1)], [('D6',3),('-',3)]]
JG_BCH = ['D','Em','A','D','G','D','A','D']

def whistle_tin(f, length):
    n = int(length*SR); t = tt(n); a = np.minimum(t/.025, 1); r = np.ones(n); cut = max(1, int(n*.75)); r[cut:] = np.linspace(1, 0, n-cut)
    bend = 1 - .02*np.exp(-t/.03)                       # tiny 'cut' into the note
    vib = np.sin(2*np.pi*5.6*t) * .004 * np.clip((t - .25)/.3, 0, 1)
    ph = 2*np.pi*f*np.cumsum(bend + vib)/SR
    s = np.sin(ph) + .18*np.sin(2*ph) + .06*np.sin(3*ph)
    breath = band(rng.standard_normal(n), f*1.2, f*4) * .05 * (1 + 3*np.exp(-t/.03))
    return (s * .5 + breath) * a * r

def musette(freqs, length):
    n = int(length*SR); t = tt(n); e = np.minimum(t/.03, 1) * np.clip((length - t)/.08, 0, 1)
    out = np.zeros(n)
    for f in freqs:
        for det in (1.0, 1.006):                          # two reeds slightly apart = wobbly accordion sound
            ph = 2*np.pi*f*det*t
            out += np.sin(ph) + .45*np.sin(2*ph) + .25*np.sin(3*ph) + .1*np.sin(5*ph)
    return out * e / (2*len(freqs)) * .5

def bodhran(accent=False):
    n = int(.25*SR); t = tt(n); f = (80 if accent else 120) + 50*np.exp(-t/.02)
    return (np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/(.12 if accent else .06)) + band(rng.standard_normal(n), 200, 1800) * np.exp(-t/.015) * .3) * (.9 if accent else .45)

def munch():
    out = np.zeros(int(1.1*SR))
    for k in range(4):
        m = int(.09*SR); t = tt(m); s = band(rng.standard_normal(m), 900, 5000) * np.exp(-t/.025)
        s += np.sin(2*np.pi*160*t) * np.exp(-t/.03) * .4
        i = int(k*.25*SR); out[i:i+m] += s * (.9 - k*.1)
    return out * .6

def crack():
    n = int(.6*SR); t = tt(n)
    s = band(rng.standard_normal(n), 400, 6000) * np.exp(-t/.05) + np.sin(2*np.pi*np.cumsum(140 + 80*np.exp(-t/.02))/SR) * np.exp(-t/.15) * .7
    return s * .8
NAMED.update({'munch': munch, 'crack': crack})

def picnic_long(dur, shift=0):
    E = .175; BAR = 6*E
    tr = Track(dur)
    CH = {'D': ('D3', ['D4','F#4','A4']), 'G': ('G2', ['G3','B3','D4']), 'A': ('A2', ['A3','C#4','E4']), 'Em': ('E3', ['E3','G3','B3'])}
    FIFTH = {'D': 'A2', 'G': 'D3', 'A': 'E3', 'Em': 'B2'}
    nb = int(dur // BAR); body = []; i = 0
    cyc = [(JG_A, JG_ACH), (JG_B, JG_BCH), (JG_A, JG_ACH), (None, ['G','D','A','D','G','D','Em','A'])]
    while len(body) < nb - 4:
        m, c = cyc[i % 4]; body += list(zip(m if m else [None]*8, c)); i += 1
    song = [(None,'D'),(None,'A')] + body[:nb - 4] + [(JG_A[6], 'A'), ([('D5',6)], 'D')]
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi*BAR; root, ch3 = CH[ch]; fin = bi == last; fr = [freq(n, shift) for n in ch3]; rf = freq(root, shift); ff = freq(FIFTH[ch], shift)
        if not fin:
            tr.add(tri_bass(rf, 2*E), t0, 0, .5); tr.add(tri_bass(ff, 2*E), t0 + 3*E, 0, .45)
            for p in (1, 2, 4, 5): tr.add(musette(fr, E*.85), t0 + p*E, -.25, .22 if p in (1, 4) else .16)
            if bi >= 2:
                for p in range(6): tr.add(bodhran(p in (0, 3)), t0 + p*E, .2, .35 if p in (0, 3) else .2)
        else:
            tr.add(tri_bass(rf, BAR), t0, 0, .55); tr.add(musette(fr, BAR*1.4), t0, -.25, .3)
        if mel is None and not fin and bi >= 2:      # quieter bars: bouzouki arpeggio instead of the whistle
            for k, n in enumerate([ch3[0], ch3[1], ch3[2], ch3[1], ch3[2], ch3[1]]):
                tr.add(pluck([freq(n, shift)*2], .4), t0 + k*E, .35, .16)
        if mel:
            p = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); L = ln*E + (1.2 if fin else .03)
                    tr.add(whistle_tin(f, L), t0 + p*E, .1, .42)
                p += ln
    return tr.buf
