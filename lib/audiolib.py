"""Gedeelde geluidsbibliotheek: twee eigen themaliedjes en geluidseffecten."""
import numpy as np, wave

SR = 44100
rng = np.random.default_rng(11)
NOTES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def freq(n, shift=0):
    semi = NOTES[n[0]] + (1 if '#' in n else 0) + (int(n[-1]) - 4) * 12 + shift
    return 261.6256 * 2 ** (semi / 12)


def tt(n): return np.arange(n) / SR


def envexp(n, a, tau):
    e = np.exp(-tt(n) / tau); ai = max(1, int(a * SR)); e[:ai] *= np.linspace(0, 1, ai); return e


def band(sig, lo, hi):
    S = np.fft.rfft(sig); f = np.fft.rfftfreq(len(sig), 1 / SR)
    S[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(S, len(sig))


def osc(fcurve, kind='saw'):
    ph = np.cumsum(fcurve) / SR
    if kind == 'saw': return 2 * (ph % 1) - 1
    if kind == 'sq': return np.sign(np.sin(2 * np.pi * ph))
    if kind == 'tri': return 2 / np.pi * np.arcsin(np.sin(2 * np.pi * ph))
    return np.sin(2 * np.pi * ph)


def fcurve(points, n):
    ts = [p[0] for p in points]; fs = [p[1] for p in points]
    return np.interp(tt(n), ts, fs)


class Track:
    def __init__(self, dur):
        self.N = int(SR * dur); self.dur = dur
        self.buf = np.zeros((self.N, 2))

    def add(self, sig, start, pan=0.0, gain=1.0):
        i = int(start * SR)
        if i >= self.N or i < 0: return
        sig = sig[: self.N - i] * gain
        self.buf[i:i + len(sig), 0] += sig * (1 - pan) * .707
        self.buf[i:i + len(sig), 1] += sig * (1 + pan) * .707

# ---------------- instrumenten ----------------
def mallet(f, length, tau=.35):
    n = int(length * SR); t = tt(n); e = envexp(n, .004, tau)
    return (np.sin(2*np.pi*f*t) + .35*np.sin(2*np.pi*2*f*t)*np.exp(-t/.08) + .12*np.sin(2*np.pi*3*f*t)) * e

def glock(f, length):
    n = int(length * SR); t = tt(n); e = envexp(n, .002, .5)
    return (np.sin(2*np.pi*2*f*t) + .25*np.sin(2*np.pi*5.4*f*t)*np.exp(-t/.05)) * e

def pluck(freqs, length=.45):
    n = int(length * SR); t = tt(n); e = envexp(n, .003, .14)
    return sum(np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*2*f*t) + .15*np.sin(2*np.pi*3*f*t) for f in freqs) * e / len(freqs)

def tri_bass(f, length):
    n = int(length * SR); t = tt(n); e = envexp(n, .01, .4)
    tri = 2/np.pi*np.arcsin(np.sin(2*np.pi*f*t)); cut = int(n*.85); e[cut:] *= np.linspace(1, 0, n-cut)
    return (tri + .4*np.sin(2*np.pi*f*t)) * e

def kick():
    n = int(.3*SR); t = tt(n); f = 50 + 110*np.exp(-t/.03)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/.12)

def clap():
    n = int(.2*SR); t = tt(n); nz = rng.standard_normal(n); nz = nz - np.concatenate([[0], nz[:-1]])*.6
    return nz*np.exp(-t/.05)*.5 + np.sin(2*np.pi*190*t)*np.exp(-t/.04)*.4

def hat():
    n = int(.06*SR); t = tt(n); nz = np.diff(np.concatenate([[0], rng.standard_normal(n)]))
    return nz*np.exp(-t/.015)*.3

def marimba(f, length):
    n = int(length*SR); t = tt(n); e = envexp(n, .002, .28)
    return (np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*4*f*t)*np.exp(-t/.04) + .2*np.sin(2*np.pi*10*f*t)*np.exp(-t/.01)) * e

def kalimba(freqs, length=.6):
    n = int(length*SR); t = tt(n); e = envexp(n, .002, .22)
    return sum(np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*5.9*f*t)*np.exp(-t/.03) for f in freqs) * e / len(freqs)

def sine_bass(f, length):
    n = int(length*SR); t = tt(n); e = envexp(n, .01, .35)
    return (np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t)) * e

def djembe_low():
    n = int(.35*SR); t = tt(n); f = 70 + 60*np.exp(-t/.02)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/.13)

def djembe_slap():
    n = int(.15*SR); t = tt(n); nz = band(rng.standard_normal(n), 600, 5000)
    return (nz*.6 + np.sin(2*np.pi*330*t)*.6) * np.exp(-t/.035)

def shaker():
    n = int(.07*SR); t = tt(n); nz = band(rng.standard_normal(n), 5000, 14000)
    return nz * np.minimum(t/.015, 1) * np.exp(-t/.025) * .5

# ---------------- themaliedjes ----------------
def toet_theme(dur=60.0, shift=0):
    """Truckje Toet-tune (C groot), 120 bpm; intro 2 maten, A B A, outro."""
    E, BAR = .25, 2.0
    tr = Track(dur)
    CH = {'C': (['C3','G3'], ['C4','E4','G4']), 'G': (['G2','D3'], ['B3','D4','G4']), 'Am': (['A2','E3'], ['C4','E4','A4']),
          'F': (['F2','C3'], ['C4','F4','A4']), 'Em': (['E3','B3'], ['B3','E4','G4'])}
    A = [[('E5',1),('E5',1),('G5',2),('E5',1),('C5',1),('D5',2)], [('D5',1),('D5',1),('B4',1),('D5',1),('G5',3),('-',1)],
         [('C5',1),('E5',1),('A5',2),('G5',1),('E5',1),('C5',2)], [('F5',1),('E5',1),('D5',1),('C5',1),('D5',3),('-',1)],
         [('E5',1),('E5',1),('G5',2),('C6',2),('B5',1),('A5',1)], [('G5',2),('D5',1),('E5',1),('F5',2),('E5',1),('D5',1)],
         [('C5',1),('D5',1),('E5',1),('F5',1),('A5',2),('G5',2)], [('C5',4),('-',2),('G4',1),('B4',1)]]
    ACH = ['C','G','Am','F','C','G','F','C']
    B = [[('A5',2),('G5',1),('F5',1),('A5',2),('C6',2)], [('B5',2),('A5',1),('G5',1),('D5',4)],
         [('G5',1),('E5',1),('G5',1),('E5',1),('B5',2),('G5',2)], [('A5',1),('C6',1),('B5',1),('A5',1),('E5',4)],
         [('F5',1),('G5',1),('A5',1),('F5',1),('C6',3),('-',1)], [('B5',1),('A5',1),('G5',1),('F5',1),('D5',2),('G4',2)],
         [('C5',1),('E5',1),('G5',1),('C6',1),('G5',1),('E5',1),('C5',2)], [('C5',2),('-',6)]]
    BCH = ['F','G','Em','Am','F','G','C','C']
    song = [(None,'C'),(None,'G')] + list(zip(A, ACH)) + list(zip(B, BCH)) + list(zip(A, ACH)) + \
           list(zip([A[4], A[5], A[6], [('C5',1),('E5',1),('G5',1),('C6',5)]], ['C','G','F','C']))
    nbars = int(dur // BAR); song = song[:nbars - 4] + song[-4:] if nbars < len(song) else song
    last = len(song) - 1
    for bi, (mel, ch) in enumerate(song):
        t0 = bi * BAR; roots, tri = CH[ch]; fin = bi == last
        for beat in range(4 if not fin else 1):
            tr.add(tri_bass(freq(roots[beat % 2], shift), 2*E*.95 if not fin else BAR), t0 + beat*2*E, 0, .55)
        fr = [freq(n, shift) for n in tri]
        for k in range(4 if not fin else 1):
            tr.add(pluck(fr, .45 if not fin else 1.8), t0 + ((2*k+1)*E if not fin else 0), -.35, .42)
        if not fin:
            for beat in range(4):
                if beat in (0, 2): tr.add(kick(), t0 + beat*2*E, 0, .75)
                if beat in (1, 3) and bi >= 2: tr.add(clap(), t0 + beat*2*E, .1, .32)
            for k in range(8): tr.add(hat(), t0 + k*E + (.02 if k % 2 else 0), .4, .5 if k % 2 else .3)
        else:
            tr.add(kick(), t0, 0, .7)
        if mel:
            pos = 0
            for note, ln in mel:
                if note != '-':
                    f = freq(note, shift); length = ln*E + (1.5 if fin and ln > 2 else .25)
                    tr.add(mallet(f, length, .35 if ln < 3 else .6), t0 + pos*E, .05, .6)
                    tr.add(glock(f, length), t0 + pos*E, .25, .12)
                pos += ln
    return tr.buf

def safari_theme(dur=60.0, shift=0):
    E, BAR = .25, 2.0
    tr = Track(dur)
    CH = {'C': ('C3', ['C4','E4','G4']), 'F': ('F2', ['C4','F4','A4']), 'G': ('G2', ['B3','D4','G4']), 'Am': ('A2', ['C4','E4','A4'])}
    A = [([('G5',1),('A5',1),('G5',1),('E5',1),('D5',2),('C5',2)], 'C'), ([('C5',1),('D5',1),('E5',2),('G5',1),('A5',1),('G5',2)], 'F'),
         ([('A5',1),('G5',1),('E5',1),('D5',1),('E5',2),('D5',2)], 'G'), ([('C5',3),('-',1),('E5',1),('D5',1),('C5',2)], 'C'),
         ([('E5',1),('G5',1),('A5',2),('C6',2),('A5',2)], 'Am'), ([('G5',1),('A5',1),('G5',1),('E5',1),('C5',2),('D5',2)], 'F'),
         ([('E5',1),('D5',1),('E5',1),('G5',1),('D5',4)], 'G'), ([('C5',2),('-',6)], 'C')]
    song = [(None, 'C'), (None, 'G')] + A + A + A + [A[4], A[5], A[6], ([('C5',1),('E5',1),('G5',1),('C6',5)], 'C')]
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

# ---------------- geluidseffecten ----------------
def honk():
    out = np.zeros(int(.6*SR))
    for d in (0, .28):
        n = int(.22*SR); t = tt(n)
        sq = np.sign(np.sin(2*np.pi*392*t)) + np.sign(np.sin(2*np.pi*494*t))
        e = np.ones(n); a = int(.01*SR); e[:a] = np.linspace(0, 1, a); e[-a*3:] = np.linspace(1, 0, a*3)
        i = int(d*SR); out[i:i+n] += sq*e*.5
    return out

def moo(pitch=1.0):
    n = int(1.3*SR); t = tt(n)
    f = fcurve([(0, 150), (.25, 175), (1.0, 140), (1.3, 120)], n) * pitch * (1 + .015*np.sin(2*np.pi*5*t))
    s = osc(f, 'saw'); s = band(s, 80, 900) + .5*band(s, 900, 1500) * np.clip((t - .2) / .3, 0, 1)
    env = np.minimum(t/.12, 1) * np.clip((1.3 - t)/.5, 0, 1)
    return s * env * 1.2

def chime(note='C6'):
    f = freq(note); n = int(1.2*SR); t = tt(n)
    return (np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*2.76*f*t)*np.exp(-t/.15) + .2*np.sin(2*np.pi*5.4*f*t)*np.exp(-t/.05)) * envexp(n, .002, .45)

def pop():
    n = int(.25*SR); t = tt(n)
    nz = band(rng.standard_normal(n), 400, 8000) * np.exp(-t/.02)
    th = np.sin(2*np.pi*np.cumsum(120 + 200*np.exp(-t/.01))/SR) * np.exp(-t/.05)
    return nz*1.2 + th*.8

def splash():
    n = int(.7*SR); t = tt(n)
    nz = band(rng.standard_normal(n), 300, 4000) * np.minimum(t/.03, 1) * np.exp(-t/.18)
    blub = np.sin(2*np.pi*np.cumsum(fcurve([(0, 300), (.15, 700), (.4, 400)], n))/SR) * np.exp(-t/.12) * .5
    return nz + blub

def whoosh_up(length=1.2):
    n = int(length*SR); t = tt(n)
    f = fcurve([(0, 220), (length, 880)], n)
    s = osc(f, 'sine') * (.7 + .3*np.sin(2*np.pi*12*t)) + .3*osc(f*2, 'sine')
    return s * np.minimum(t/.05, 1) * np.clip((length - t)/.15, 0, 1) * .6

def arpeggio(notes=('C5', 'E5', 'G5', 'C6'), step=.09):
    out = np.zeros(int((len(notes)*step + 1.0)*SR))
    for i, nt in enumerate(notes):
        s = glock(freq(nt), 1.0); j = int(i*step*SR); out[j:j+len(s)] += s
    return out

def sad():
    n = int(1.6*SR); t = tt(n)
    f = np.where(t < .5, freq('G4'), np.where(t < 1.0, freq('F#4'), freq('F4') * (1 - .03*np.clip(t - 1.0, 0, .6))))
    f = f * (1 + .02*np.sin(2*np.pi*6*t))
    s = band(osc(f, 'saw'), 150, 2500) * (.6 + .4*np.cos(2*np.pi*2*t)**2)
    env = np.minimum(t/.05, 1) * np.clip((1.6 - t)/.3, 0, 1)
    return s * env * .7

def tada():
    out = np.zeros(int(2.0*SR))
    for d, ch in ((0, ['G4', 'B4', 'D5']), (.18, ['C5', 'E5', 'G5', 'C6'])):
        n = int((1.6 if d else .18)*SR); t = tt(n)
        s = sum(band(osc(np.full(n, freq(c)), 'saw'), 200, 4000) for c in ch) / len(ch)
        env = np.minimum(t/.01, 1) * (np.exp(-t/.8) if d else np.ones(n))
        if not d: env[-int(.02*SR):] *= np.linspace(1, 0, int(.02*SR))
        i = int(d*SR); out[i:i+n] += s * env
    return out * .8

def tick():
    n = int(.12*SR); t = tt(n)
    return np.sin(2*np.pi*1500*t) * np.exp(-t/.012) + .5*np.sin(2*np.pi*900*t)*np.exp(-t/.02)

def boing():
    n = int(.7*SR); t = tt(n)
    f = fcurve([(0, 180), (.12, 520), (.7, 330)], n) * (1 + .12*np.sin(2*np.pi*14*t)*np.exp(-t/.25))
    return osc(f, 'sine') * envexp(n, .005, .25) * .9

def rustle(length=1.2):
    n = int(length*SR); t = tt(n)
    nz = band(rng.standard_normal(n), 1500, 9000)
    return nz * (.5 + .5*np.abs(np.sin(2*np.pi*7*t))) * np.minimum(t/.1, 1) * np.clip((length - t)/.2, 0, 1) * .5

def squeak():
    out = np.zeros(int(.6*SR))
    for d in (0, .22):
        n = int(.15*SR); t = tt(n)
        s = osc(fcurve([(0, 2100), (.08, 2900), (.15, 2500)], n), 'sine') * np.minimum(t/.01, 1) * np.exp(-t/.07)
        i = int(d*SR); out[i:i+n] += s
    return out * .7

def roar():
    n = int(1.9*SR); t = tt(n)
    base = osc(np.linspace(140, 75, n) * (1 + .04*np.sin(2*np.pi*7*t)), 'saw')
    growl = 1 + .6*np.sin(2*np.pi*28*t)
    s = band(base, 60, 900)*1.4 + band(rng.standard_normal(n), 80, 1400)*.9
    return s * growl * np.minimum(t/.35, 1) * np.clip((1.9 - t)/.9, 0, 1) * 1.1

def trumpet():
    n = int(1.5*SR); t = tt(n)
    f0 = np.interp(t, [0, .15, .5, 1.1, 1.5], [330, 520, 600, 560, 470])
    s = osc(f0 * (1 + .02*np.sin(2*np.pi*9*t)), 'saw')
    s = band(s, 250, 4500) + .25*band(rng.standard_normal(n), 800, 3000)
    env = np.minimum(t/.08, 1) * np.clip((1.5 - t)/.35, 0, 1)
    rum = band(osc(np.linspace(60, 50, n), 'saw') * np.clip(1 - t/.3, 0, 1) * .6, 30, 400)
    return (s*env + rum) * .9

def snort():
    out = np.zeros(int(1.4*SR))
    for d, g in ((0, 1), (.45, .9), (.9, 1.1)):
        n = int(.32*SR); t = tt(n)
        s = band(rng.standard_normal(n), 300, 2200)*1.2 + band(osc(np.linspace(95, 70, n), 'saw'), 40, 600)*.8
        i = int(d*SR); out[i:i+n] += s * np.minimum(t/.02, 1) * np.exp(-t/.12) * g
    return out

def bellow():
    n = int(1.7*SR); t = tt(n)
    s = osc(np.linspace(105, 88, n) * (1 + .03*np.sin(2*np.pi*4.5*t)), 'saw')
    s = band(s, 50, 800) + .4*band(s, 900, 1300)
    return s * np.minimum(t/.2, 1) * np.clip((1.7 - t)/.6, 0, 1) * (.7 + .3*np.sin(2*np.pi*.6*t)) * 1.3

def laugh():
    out = np.zeros(int(1.2*SR))
    for i in range(5):
        n = int(.13*SR); t = tt(n)
        f = (520 - i*25) * (1 + .3*np.exp(-t/.03))
        s = band(osc(np.full(n, 1.0) * f, 'saw'), 300, 3000) * np.sin(np.pi*t/(n/SR))
        j = int(i*.2*SR); out[j:j+n] += s
    return out * .6

ANIMAL = {'lion': roar, 'elephant': trumpet, 'rhino': snort, 'buffalo': bellow, 'mouse': squeak, 'cow': moo}

# ---------------- mixen ----------------
def render(dur, music, events, out, duck_events=None):
    """events: [(tijd, signaal, gain, pan)]; duck_events: tijden waarop muziek zachter gaat (start, eind)."""
    N = int(SR * dur)
    fx = Track(dur)
    for ev in events:
        st, sig = ev[0], ev[1]; g = ev[2] if len(ev) > 2 else 1.0; pan = ev[3] if len(ev) > 3 else 0.0
        fx.add(sig, st, pan, g)
    M = music[:N].copy()
    if duck_events:
        ta = np.arange(N) / SR; duck = np.ones(N)
        for a, b in duck_events:
            d = np.clip(np.minimum((ta - (a - .3)) / .25, (b - ta) / .4), 0, 1)
            duck = np.minimum(duck, 1 - .65*d)
        M *= duck[:, None]
    M /= np.max(np.abs(M)) + 1e-9
    F = fx.buf; F = F / (np.max(np.abs(F)) + 1e-9)
    mix = M*.72 + F*.9
    mix = np.tanh(mix*1.2) / np.tanh(1.2) * .9
    fi = int(.05*SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
    fo = int(1.5*SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix*32767).astype('<i2').tobytes())
