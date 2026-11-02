"""Generator voor de muziek van de dagelijkse zwart-wit video's.
Elke video krijgt eigen, nieuw gegenereerde wiegeliedjes: melodie en akkoorden worden uit een seed opgebouwd
(vraag-antwoord-frasen, A A' B A), met een eigen instrumentkeuze, toonsoort, tempo en maatsoort, plus zachte omgevingsklank.
De laatste 20 minuten worden langzamer en zachter (richting slapen).

Gebruik vanuit een themascript:
    import bwmusic; bwmusic.make(out_wav, seconds, seed=101, leads=['harp','celesta'], ambient='sea', key=0, bpm=(64,72), meter=3)
"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt

def _att(s, a): a = max(1, int(a * SR)); s[:a] *= np.linspace(0, 1, a); return s
def musicbox(f, L): t = tt(int(L*SR)); return _att(np.sin(2*np.pi*f*t)*np.exp(-t/.9) + .35*np.sin(2*np.pi*4*f*t)*np.exp(-t/.25) + .1*np.sin(2*np.pi*6.1*f*t)*np.exp(-t/.08), .003)
def piano(f, L): t = tt(int(L*SR)); return _att((np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*2*f*t)*np.exp(-t/.6) + .15*np.sin(2*np.pi*3*f*t)*np.exp(-t/.3))*np.exp(-t/1.3), .012) * .9
def kalimba(f, L): t = tt(int(L*SR)); return _att((np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*5.9*f*t)*np.exp(-t/.04))*np.exp(-t/.7), .003)
def harp(f, L): t = tt(int(L*SR)); return _att((np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t)*np.exp(-t/.3) + .08*np.sin(2*np.pi*3*f*t)*np.exp(-t/.15))*np.exp(-t/1.0), .006)
def celesta(f, L): t = tt(int(L*SR)); return _att((np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*4*f*t)*np.exp(-t/.15))*np.exp(-t/.8), .002) * .8
def vibes(f, L): t = tt(int(L*SR)); return _att(np.sin(2*np.pi*f*t)*np.exp(-t/1.6)*(1 + .25*np.sin(2*np.pi*5*t)), .004)
def flute(f, L):
    t = tt(int(L*SR)); env = np.minimum(t/.12, 1)*np.clip((L - .3 - t)/.5, 0, 1)
    return (np.sin(2*np.pi*f*t*(1 + .003*np.sin(2*np.pi*4.5*t))) + .15*np.sin(4*np.pi*f*t)) * env * .55
def cello(f, L):
    t = tt(int(L*SR)); env = np.minimum(t/.25, 1)*np.clip((L - .3 - t)/.6, 0, 1)
    ph = 2*np.pi*f*t*(1 + .004*np.sin(2*np.pi*5*t))
    return sum(np.sin(k*ph)/k**1.3 for k in range(1, 7)) * env * .4
def guitar(f, L): t = tt(int(L*SR)); return _att(sum(np.sin(2*np.pi*k*f*t)*np.exp(-t*(1.2 + k*.9))/k for k in range(1, 6)), .002)
LEADS = dict(musicbox=musicbox, piano=piano, kalimba=kalimba, harp=harp, celesta=celesta, vibes=vibes, flute=flute, cello=cello, guitar=guitar)
SUSTAIN = {'flute', 'cello'}

def pad(fs, L):
    t = tt(int(L*SR)); s = sum(np.sin(2*np.pi*f*t + k) + .25*np.sin(2*np.pi*2.003*f*t) for k, f in enumerate(fs)) / len(fs)
    return s * np.minimum(t/1.2, 1) * np.clip((L - t)/1.4, 0, 1) * (1 + .06*np.sin(2*np.pi*.2*t))
def bass(f, L): t = tt(int(L*SR)); return np.sin(2*np.pi*f*t) * np.minimum(t/.1, 1) * np.exp(-t/1.6)

SCALE = [0, 2, 4, 5, 7, 9, 11]
CH = {1: [0, 4, 7], 4: [5, 9, 12], 5: [7, 11, 14], 6: [9, 12, 16], 2: [2, 5, 9], 3: [4, 7, 11]}
PROGS = [[1, 6, 4, 5], [1, 4, 1, 5], [1, 5, 6, 4], [6, 4, 1, 5], [1, 3, 4, 5], [1, 4, 6, 5], [4, 1, 5, 1], [1, 2, 5, 1]]
C4 = 261.6256
def hz(semi, shift): return C4 * 2 ** ((semi + shift) / 12)

def song(rng, meter):
    """Eén wiegeliedje: 16 maten, A A' B A, melodie uit akkoordtonen met stapjes ertussen."""
    prog = PROGS[rng.integers(len(PROGS))]; progB = PROGS[rng.integers(len(PROGS))]
    rhythms = [[2, 1], [1, 1, 1], [3], [1, 2]] if meter == 3 else [[2, 2], [1, 1, 2], [4], [2, 1, 1], [3, 1]]
    def phrase(pr, end_on_root):
        bars = []; prev = 12 + 4
        for bi, c in enumerate(pr):
            rh = rhythms[rng.integers(len(rhythms))] if bi < 3 else ([meter] if end_on_root else rhythms[rng.integers(len(rhythms))])
            notes = []
            for k, ln in enumerate(rh):
                tones = [v + 12 for v in CH[c]] + [v + 24 for v in CH[c]]
                if k > 0 and rng.random() < .35:     # stapje in de toonladder
                    cands = [12 + s for s in SCALE] + [24 + s for s in SCALE]
                else: cands = tones
                cands = [v for v in cands if 11 <= v <= 28]
                v = min(cands, key=lambda q: abs(q - prev) + rng.random() * 4)
                if bi == 3 and k == len(rh) - 1 and end_on_root: v = 12 if abs(prev - 12) < abs(prev - 24) else 24
                notes.append((v, ln)); prev = v
            bars.append((notes, c))
        return bars
    A = phrase(prog, False) + phrase(prog, True)
    A2 = [(n if i % 2 == 0 else None, c) for i, (n, c) in enumerate(A)]
    B = phrase(progB, False) + phrase(prog, True)
    return A + A2 + B + A

def make(out_path, total, seed=1, leads=('harp', 'musicbox'), ambient='none', key=0, bpm=(64, 72), meter=3, gain=.6):
    rng = np.random.default_rng(seed)
    SONGS = [song(rng, meter) for _ in range(4)]
    KEYS = [key + k for k in (0, 5, -3, 2, -5, 3)]
    irn = int(2.4*SR); ti = tt(irn)
    IR = [rng.standard_normal(irn) * np.exp(-ti/.6) for _ in range(2)]
    for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir**2))
    SLEEP = max(0., total - 1200)   # vanaf hier langzamer en zachter

    def piece(k, t_start):
        sleepy = t_start >= SLEEP and total > 1800
        bars = SONGS[k % 4]; shift = KEYS[k % len(KEYS)]
        b = bpm[0] + (bpm[1] - bpm[0]) * ((k * 37) % 10) / 9
        if sleepy: b *= .85
        Bt = 60 / b; BAR = meter * Bt
        lead = LEADS[leads[(k // 2) % len(leads)] if not sleepy else leads[-1]]
        lname = leads[(k // 2) % len(leads)] if not sleepy else leads[-1]
        bars = [(None, bars[0][1]), (None, bars[0][1])] + bars + [(None, 1), (None, 1)]
        length = len(bars) * BAR; n = int((length + 5) * SR)
        Lc = np.zeros(n, np.float32); Rc = np.zeros(n, np.float32)
        def add(sig, st, pan=0., g=1.):
            i = int(st*SR)
            if i >= n: return
            sig = sig[:n - i] * g; Lc[i:i+len(sig)] += (sig*(1-pan)*.707).astype(np.float32); Rc[i:i+len(sig)] += (sig*(1+pan)*.707).astype(np.float32)
        for bi, (m, c) in enumerate(bars):
            t0 = bi * BAR; tri = CH[c]
            add(pad([hz(v - 12, shift) for v in tri], BAR + 1.4), t0, 0, .30)
            add(bass(hz(tri[0] - 24, shift), BAR), t0, 0, .42)
            if 2 <= bi < len(bars) - 2 and not sleepy:
                for kk in range(meter):
                    if kk < len(tri): add(harp(hz(tri[kk], shift), 2.0), t0 + kk * Bt + .02, -.4 + kk * .4, .14)
            if m:
                pos = 0
                for v, ln in m:
                    L = ln * Bt + (.1 if lname in SUSTAIN else 1.6)
                    add(lead(hz(v, shift), max(L, .4)), t0 + pos * Bt, .1, .5); pos += ln
        fo = int(3*SR); end = int(length*SR)
        for ch_ in (Lc, Rc): ch_[end-fo:end] *= np.linspace(1, .35, fo, dtype=np.float32)
        p = np.stack([Lc, Rc], 1)
        wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
        return p + wet * .38, length, sleepy

    ZI = {}
    def filt(name, b, a, noise):
        if name not in ZI: ZI[name] = np.zeros((max(len(a), len(b)) - 1, 2))
        y, ZI[name] = lfilter(b, a, noise, axis=0, zi=ZI[name]); return y
    def amb(n, t0):
        if ambient == 'none': return 0
        t = tt(n) + t0; noise = rng.standard_normal((n, 2)).astype(np.float32)
        if ambient == 'sea':
            b, a = butter(2, 500 / (SR/2)); s = filt('sea', b, a, noise)
            return s * (.35 + .25*np.sin(2*np.pi*t/9.0))[:, None] * .5
        if ambient == 'rain':
            b, a = butter(2, [1500/(SR/2), 7000/(SR/2)], 'band'); return filt('rain', b, a, noise) * .06
        if ambient == 'wind':
            b, a = butter(2, 350 / (SR/2)); return filt('wind', b, a, noise) * (.3 + .2*np.sin(2*np.pi*t/13))[:, None] * .4
        if ambient == 'night':   # zachte krekels
            s = np.sin(2*np.pi*4200*t) * (np.sin(2*np.pi*22*t) > .6) * (np.sin(2*np.pi*t/1.3) > 0) * .006
            return np.stack([s, np.roll(s, 3000)], 1)
        if ambient == 'forest':  # af en toe een vogeltje
            s = np.zeros(n)
            for _ in range(max(1, n // (SR * 6))):
                i = rng.integers(0, max(1, n - SR)); m = int(.18*SR); tk = tt(m); f = 2500 + 900*np.sin(2*np.pi*6*tk)
                s[i:i+m] += np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi*tk/.18) * .02
            return np.stack([s, s * .6], 1)
        return 0

    out = wave.open(out_path, 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
    NT = int(total*SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; G = None
    while written < NT:
        p, length, sleepy = piece(k, written / SR)
        if G is None: G = gain / (np.max(np.abs(p)) + 1e-9)
        p *= G * (.78 if sleepy else 1)
        p[:len(carry)] += carry
        step = int(length*SR); chunk, carry = p[:step].copy(), p[step:]
        chunk = chunk[:NT - written]
        a = amb(len(chunk), written / SR)
        if not np.isscalar(a): chunk += a.astype(np.float32)
        if written == 0: fi = int(3*SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
        if written + len(chunk) >= NT: fo = min(len(chunk), int(8*SR)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
        out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
        written += len(chunk); k += 1
        print(f'piece {k}: {written/SR/60:.1f} min', flush=True)
    out.close()
