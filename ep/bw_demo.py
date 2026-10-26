"""Zacht slaapliedje: speeldoos, zachte pad, harp-arpeggio, galm. 3/4-maat, 72 bpm, 60 s."""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve
from audiolib import SR, freq, tt, envexp

DUR = 60.0; N = int(SR * DUR)
B = 60 / 72          # tel
BAR = 3 * B          # 2,5 s
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(5)

def add(sig, start, pan=0.0, g=1.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[:N - i] * g
    L[i:i + len(sig)] += sig * (1 - pan) * .707
    R[i:i + len(sig)] += sig * (1 + pan) * .707

def musicbox(f, length=2.4):
    n = int(length * SR); t = tt(n)
    s = np.sin(2*np.pi*f*t) * np.exp(-t/.9) + .35*np.sin(2*np.pi*4*f*t)*np.exp(-t/.25) + .12*np.sin(2*np.pi*6.1*f*t)*np.exp(-t/.08)
    a = int(.003*SR); s[:a] *= np.linspace(0, 1, a)
    return s

def pad(freqs, length):
    n = int(length * SR); t = tt(n)
    s = sum(np.sin(2*np.pi*f*t + k) + .25*np.sin(2*np.pi*2.003*f*t) for k, f in enumerate(freqs)) / len(freqs)
    env = np.minimum(t / 1.0, 1) * np.clip((length - t) / 1.2, 0, 1)
    trem = 1 + .06*np.sin(2*np.pi*.25*t)
    return s * env * trem

def harp(f, length=2.0):
    n = int(length * SR); t = tt(n)
    s = (np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t)*np.exp(-t/.3)) * np.exp(-t/.7)
    a = int(.006*SR); s[:a] *= np.linspace(0, 1, a)
    return s

def bass(f, length):
    n = int(length * SR); t = tt(n)
    return np.sin(2*np.pi*f*t) * np.minimum(t/.08, 1) * np.exp(-t/1.4)

CH = {'C': ('C3', ['C4', 'E4', 'G4']), 'Am': ('A2', ['A3', 'C4', 'E4']), 'F': ('F2', ['F3', 'A3', 'C4']),
      'G': ('G2', ['G3', 'B3', 'D4']), 'Dm': ('D3', ['D4', 'F4', 'A4'])}
MEL = [  # (noot, tellen)
    ([('E5', 2), ('G5', 1)], 'C'), ([('A5', 2), ('G5', 1)], 'Am'), ([('F5', 1), ('E5', 1), ('D5', 1)], 'F'), ([('D5', 3)], 'G'),
    ([('E5', 2), ('G5', 1)], 'C'), ([('C6', 2), ('B5', 1)], 'Am'), ([('A5', 1), ('G5', 1), ('D5', 1)], 'F'), ([('C5', 3)], 'C'),
]
bars = [(None, 'C'), (None, 'G')] + MEL + MEL + MEL[:4] + [(None, 'F'), ([('E5', 1), ('D5', 1), ('C5', 1)], 'G'), ([('C5', 3)], 'C'), (None, 'C')]

for bi, (mel, ch) in enumerate(bars):
    t0 = bi * BAR; root, tri = CH[ch]
    last = bi >= len(bars) - 2
    fr = [freq(n) for n in tri]
    add(pad(fr, BAR + 1.2), t0, 0, .35)
    add(bass(freq(root), BAR), t0, 0, .5)
    if 2 <= bi < len(bars) - 1:
        for k, n in enumerate([tri[0], tri[1], tri[2]]):
            add(harp(freq(n, 12) if bi >= 10 else freq(n)), t0 + k * B + .02, -.4 + k * .4, .18 if bi >= 10 else .22)
    if mel:
        pos = 0
        oct_ = 0 if bi < 18 else -12
        for n, ln in mel:
            add(musicbox(freq(n, oct_), max(2.4, ln * B + 1.5)), t0 + pos * B, .1, .55)
            pos += ln

mix = np.stack([L, R], 1)
# galm: exponentieel uitstervende ruis (2,2 s)
irn = int(2.2 * SR); ti = tt(irn)
for c in range(2):
    ir = rng.standard_normal(irn) * np.exp(-ti / .55); ir[0] = 0
    wet = fftconvolve(mix[:, c], ir)[:N] / np.sqrt(np.sum(ir**2)) * .35
    mix[:, c] = mix[:, c] + wet
mix /= np.max(np.abs(mix)) + 1e-9
mix *= .7  # rustig niveau
fi = int(1.5*SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(3.0*SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
