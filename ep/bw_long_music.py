"""60 minuten zachte slaapmuziek: vier eigen wiegeliedjes, wisselende toonsoort, tempo en instrument.
Wordt per stuk gegenereerd en met overlap (galmstaart) achter elkaar naar één wav geschreven."""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve
from audiolib import SR, freq, tt

TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 3600.0
rng = np.random.default_rng(21)

def musicbox(f, length):
    n = int(length * SR); t = tt(n)
    s = np.sin(2*np.pi*f*t)*np.exp(-t/.9) + .35*np.sin(2*np.pi*4*f*t)*np.exp(-t/.25) + .12*np.sin(2*np.pi*6.1*f*t)*np.exp(-t/.08)
    a = int(.003*SR); s[:a] *= np.linspace(0, 1, a); return s

def softpiano(f, length):
    n = int(length * SR); t = tt(n)
    s = (np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*2*f*t)*np.exp(-t/.6) + .15*np.sin(2*np.pi*3*f*t)*np.exp(-t/.3)) * np.exp(-t/1.3)
    a = int(.012*SR); s[:a] *= np.linspace(0, 1, a); return s * .9

def kalimba(f, length):
    n = int(length * SR); t = tt(n)
    s = (np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*5.9*f*t)*np.exp(-t/.04)) * np.exp(-t/.7)
    a = int(.003*SR); s[:a] *= np.linspace(0, 1, a); return s

def pad(freqs, length):
    n = int(length * SR); t = tt(n)
    s = sum(np.sin(2*np.pi*f*t + k) + .25*np.sin(2*np.pi*2.003*f*t) for k, f in enumerate(freqs)) / len(freqs)
    return s * np.minimum(t/1.0, 1) * np.clip((length - t)/1.2, 0, 1) * (1 + .06*np.sin(2*np.pi*.25*t))

def harp(f, length=2.0):
    n = int(length * SR); t = tt(n)
    s = (np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t)*np.exp(-t/.3)) * np.exp(-t/.7)
    a = int(.006*SR); s[:a] *= np.linspace(0, 1, a); return s

def bass(f, length):
    n = int(length * SR); t = tt(n)
    return np.sin(2*np.pi*f*t) * np.minimum(t/.08, 1) * np.exp(-t/1.4)

CH = {'C': ('C3', ['C4','E4','G4']), 'Am': ('A2', ['A3','C4','E4']), 'F': ('F2', ['F3','A3','C4']),
      'G': ('G2', ['G3','B3','D4']), 'Dm': ('D3', ['D4','F4','A4']), 'Em': ('E3', ['E4','G4','B4'])}
SONGS = [
    [([('E5',2),('G5',1)],'C'), ([('A5',2),('G5',1)],'Am'), ([('F5',1),('E5',1),('D5',1)],'F'), ([('D5',3)],'G'),
     ([('E5',2),('G5',1)],'C'), ([('C6',2),('B5',1)],'Am'), ([('A5',1),('G5',1),('D5',1)],'F'), ([('C5',3)],'C')],
    [([('G5',2),('E5',1)],'C'), ([('F5',2),('A5',1)],'F'), ([('G5',1),('E5',1),('C5',1)],'C'), ([('D5',3)],'G'),
     ([('E5',2),('C5',1)],'Am'), ([('A4',2),('C5',1)],'F'), ([('D5',1),('E5',1),('D5',1)],'G'), ([('C5',3)],'C')],
    [([('E5',2),('A5',1)],'Am'), ([('A5',2),('G5',1)],'F'), ([('E5',1),('G5',1),('E5',1)],'C'), ([('D5',3)],'G'),
     ([('C5',2),('E5',1)],'Am'), ([('F5',2),('A5',1)],'F'), ([('G5',1),('F5',1),('D5',1)],'G'), ([('C5',3)],'C')],
    [([('C5',1),('E5',1),('G5',1)],'C'), ([('B4',2),('D5',1)],'G'), ([('C5',1),('E5',1),('A5',1)],'Am'), ([('G5',3)],'Em'),
     ([('A5',1),('G5',1),('F5',1)],'F'), ([('E5',2),('C5',1)],'C'), ([('D5',2),('B4',1)],'G'), ([('C5',3)],'C')],
]
LEADS = [musicbox, softpiano, kalimba]
KEYS = [0, 5, -3, 2, -5, 3]       # toonsoort-verschuivingen (halve tonen)
TEMPOS = [72, 68, 70, 66]

def piece(si, shift, bpm, lead):
    Bt = 60 / bpm; BAR = 3 * Bt
    mel = SONGS[si]
    bars = [(None, mel[0][1]), (None, mel[3][1])] + mel + [(m if i % 2 == 0 else None, c) for i, (m, c) in enumerate(mel)] + mel + [(None, 'C'), (None, 'C')]
    length = len(bars) * BAR
    n = int((length + 4.0) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR); sig = sig[:n - i] * g
        L[i:i+len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i+len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for bi, (m, ch) in enumerate(bars):
        t0 = bi * BAR; root, tri = CH[ch]
        add(pad([freq(x_, shift) for x_ in tri], BAR + 1.2), t0, 0, .33)
        add(bass(freq(root, shift), BAR), t0, 0, .45)
        if 2 <= bi < len(bars) - 2:
            up = 12 if 10 <= bi < 18 else 0
            for k, nt in enumerate(tri): add(harp(freq(nt, shift + up)), t0 + k * Bt + .02, -.4 + k * .4, .2)
        if m:
            pos = 0; o = -12 if bi >= 18 else 0
            for nt, ln in m:
                add(lead(freq(nt, shift + o), max(2.4, ln * Bt + 1.5)), t0 + pos * Bt, .1, .55); pos += ln
    # zachte in- en uitgang van elk stuk
    fo = int(3 * SR); end = int(length * SR)
    for ch_ in (L, R): ch_[end - fo:end] *= np.linspace(1, .35, fo, dtype=np.float32)
    return np.stack([L, R], 1), length

irn = int(2.2 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .55) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir**2))

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p, length = piece(k % 4, KEYS[k % len(KEYS)], TEMPOS[k % len(TEMPOS)], LEADS[(k // 2) % 3])
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p + wet * .35
    if GAIN is None: GAIN = .62 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN
    p[:len(carry)] += carry
    step = int(length * SR)
    chunk, carry = p[:step], p[step:]
    if written == 0:
        fi = int(2 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = int(6 * SR); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'stuk {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
