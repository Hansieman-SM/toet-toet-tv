"""Eigen muziek + dierengeluiden voor De Grote Vier. 120 bpm, 60 s."""
import numpy as np, wave, sys

SR = 44100
E = 0.25                 # achtste noot
BAR = 2.0
DUR = 60.0
N = int(SR * DUR)
M = np.zeros((N, 2))     # muziek
FX = np.zeros((N, 2))    # dierengeluiden
rng = np.random.default_rng(3)

NOTES = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def freq(n):
    semi = NOTES[n[0]] + (1 if '#' in n else 0) + (int(n[-1]) - 4) * 12
    return 261.6256 * 2 ** (semi / 12)

def add(buf, sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    buf[i:i+len(sig), 0] += sig * (1 - pan) * .707
    buf[i:i+len(sig), 1] += sig * (1 + pan) * .707

def tt(n): return np.arange(n) / SR
def envexp(n, a, tau):
    e = np.exp(-tt(n) / tau); ai = max(1, int(a*SR)); e[:ai] *= np.linspace(0, 1, ai); return e

def band(sig, lo, hi):
    S = np.fft.rfft(sig); f = np.fft.rfftfreq(len(sig), 1/SR)
    S[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(S, len(sig))

def glide_osc(f0, f1, n, kind='saw', vib=0, vibr=5):
    t = tt(n); f = np.linspace(f0, f1, n) * (1 + vib*np.sin(2*np.pi*vibr*t))
    ph = np.cumsum(f) / SR
    if kind == 'saw': return 2*(ph % 1) - 1
    if kind == 'sq': return np.sign(np.sin(2*np.pi*ph))
    return np.sin(2*np.pi*ph)

# ---------- instrumenten ----------
def marimba(f, length):
    n = int(length*SR); t = tt(n); e = envexp(n, .002, .28)
    return (np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*4*f*t)*np.exp(-t/.04) + .2*np.sin(2*np.pi*10*f*t)*np.exp(-t/.01)) * e

def kalimba(freqs, length=.6):
    n = int(length*SR); t = tt(n); e = envexp(n, .002, .22)
    return sum(np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*5.9*f*t)*np.exp(-t/.03) for f in freqs) * e / len(freqs)

def bass(f, length):
    n = int(length*SR); t = tt(n); e = envexp(n, .01, .35)
    return (np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t)) * e

def djembe_low():
    n = int(.35*SR); t = tt(n); f = 70 + 60*np.exp(-t/.02)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/.13)

def djembe_slap():
    n = int(.15*SR); t = tt(n)
    nz = band(rng.standard_normal(n), 600, 5000)
    return (nz*.6 + np.sin(2*np.pi*330*t)*.6) * np.exp(-t/.035)

def shaker():
    n = int(.07*SR); t = tt(n)
    nz = band(rng.standard_normal(n), 5000, 14000)
    e = np.minimum(t/.015, 1) * np.exp(-t/.025)
    return nz * e * .5

# ---------- dierengeluiden ----------
def roar():
    n = int(1.9*SR); t = tt(n)
    base = glide_osc(140, 75, n, 'saw', .04, 7)
    growl = 1 + .6*np.sin(2*np.pi*28*t)
    nz = band(rng.standard_normal(n), 80, 1400)
    s = band(base, 60, 900)*1.4 + nz*.9
    env = np.minimum(t/.35, 1) * np.clip((1.9 - t)/.9, 0, 1)
    return s * growl * env * 1.1

def trumpet():
    n = int(1.5*SR); t = tt(n)
    f0 = np.interp(t, [0, .15, .5, 1.1, 1.5], [330, 520, 600, 560, 470])
    ph = np.cumsum(f0 * (1 + .02*np.sin(2*np.pi*9*t))) / SR
    s = 2*(ph % 1) - 1
    s = band(s, 250, 4500) + .25*band(rng.standard_normal(n), 800, 3000)
    env = np.minimum(t/.08, 1) * np.clip((1.5 - t)/.35, 0, 1)
    rum = glide_osc(60, 50, n, 'saw') * np.clip(1 - t/.3, 0, 1) * .6   # "prrr" aanzet
    return (s*env + band(rum, 30, 400)) * .9

def snort():
    out = np.zeros(int(1.4*SR))
    for d, g in ((0, 1), (.45, .9), (.9, 1.1)):
        n = int(.32*SR); t = tt(n)
        nz = band(rng.standard_normal(n), 300, 2200)
        grunt = band(glide_osc(95, 70, n, 'saw'), 40, 600)
        env = np.minimum(t/.02, 1) * np.exp(-t/.12)
        i = int(d*SR); out[i:i+n] += (nz*1.2 + grunt*.8) * env * g
    return out

def bellow():
    n = int(1.7*SR); t = tt(n)
    s = glide_osc(105, 88, n, 'saw', .03, 4.5)
    s = band(s, 50, 800) + .4*band(s, 900, 1300)
    env = np.minimum(t/.2, 1) * np.clip((1.7 - t)/.6, 0, 1)
    vow = .7 + .3*np.sin(2*np.pi*.6*t)   # "boe-eeh" kleurverloop
    return s * env * vow * 1.3

SOUNDS = [(11.5, roar), (23.5, trumpet), (35.5, snort), (47.5, bellow)]

# ---------- muziek ----------
CH = {'C': ('C3', ['C4','E4','G4']), 'F': ('F2', ['C4','F4','A4']), 'G': ('G2', ['B3','D4','G4']), 'Am': ('A2', ['C4','E4','A4'])}
A = [
 ([('G5',1),('A5',1),('G5',1),('E5',1),('D5',2),('C5',2)], 'C'),
 ([('C5',1),('D5',1),('E5',2),('G5',1),('A5',1),('G5',2)], 'F'),
 ([('A5',1),('G5',1),('E5',1),('D5',1),('E5',2),('D5',2)], 'G'),
 ([('C5',3),('-',1),('E5',1),('D5',1),('C5',2)], 'C'),
 ([('E5',1),('G5',1),('A5',2),('C6',2),('A5',2)], 'Am'),
 ([('G5',1),('A5',1),('G5',1),('E5',1),('C5',2),('D5',2)], 'F'),
 ([('E5',1),('D5',1),('E5',1),('G5',1),('D5',4)], 'G'),
 ([('C5',2),('-',6)], 'C'),
]
song = [(None, 'C'), (None, 'G')] + A + A + A + [A[4], A[5], A[6], ([('C5',1),('E5',1),('G5',1),('C6',5)], 'C')]
last = len(song) - 1
for bi, (mel, ch) in enumerate(song):
    t0 = bi * BAR; root, tri = CH[ch]; fin = bi == last
    for beat in range(4 if not fin else 1):
        add(M, bass(freq(root) * (1.5 if beat == 2 else 1), .45 if not fin else 2), t0 + beat*.5, 0, .7)
    for k in range(8 if not fin else 1):
        if k in (1, 3, 4, 6) or fin:
            add(M, kalimba([freq(n) for n in tri], .6 if not fin else 2), t0 + k*E, -.4, .35)
    if not fin:
        for k, kind in enumerate(['L', '', 'S', 'S', 'L', 'L', 'S', '']):
            if kind == 'L': add(M, djembe_low(), t0 + k*E, -.1, .8)
            if kind == 'S' and bi >= 2: add(M, djembe_slap(), t0 + k*E, .2, .4)
        for k in range(16): add(M, shaker(), t0 + k*E/2, .5, .5 if k % 2 else .3)
    else:
        add(M, djembe_low(), t0, 0, .8)
    if mel:
        pos = 0
        for note, ln in mel:
            if note != '-':
                add(M, marimba(freq(note), ln*E + (1.6 if fin and ln > 2 else .3)), t0 + pos*E, .1, .6)
            pos += ln

for st, fn in SOUNDS: add(FX, fn(), st, 0, 1.0)

# muziek zachter tijdens dierengeluiden
duck = np.ones(N)
t_all = np.arange(N) / SR
for st, _ in SOUNDS:
    d = np.clip(np.minimum((t_all - (st - .3)) / .25, ((st + 2.0) - t_all) / .4), 0, 1)
    duck = np.minimum(duck, 1 - .7*d)
M *= duck[:, None]

M /= np.max(np.abs(M)) + 1e-9
FX /= np.max(np.abs(FX)) + 1e-9
mix = M * .75 + FX * .95
mix = np.tanh(mix * 1.2) / np.tanh(1.2) * .9
fi = int(.05*SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(1.5*SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
out = sys.argv[1] if len(sys.argv) > 1 else 'safari.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok')
