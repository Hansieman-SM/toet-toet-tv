"""Rustgevende onderwatermuziek: zachte pads, losse kalimba/harp-noten, zeeruis, af en toe walvisroep en belletjes.
Gebruik: python3 ep/ocean_music.py out.wav SECONDEN"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(7)

def pad(fs, length):
    n = int(length * SR); t = tt(n)
    s = sum(np.sin(2*np.pi*f*t + k) + .3*np.sin(2*np.pi*f*1.004*t) + .12*np.sin(2*np.pi*2*f*t) for k, f in enumerate(fs)) / len(fs)
    env = np.minimum(t / 3.0, 1) * np.clip((length - t) / 3.0, 0, 1)
    return s * env * (1 + .08*np.sin(2*np.pi*.12*t))
def bell(f, length=4.0, kind=0):
    n = int(length * SR); t = tt(n)
    if kind == 0: s = (np.sin(2*np.pi*f*t) + .2*np.sin(2*np.pi*5.9*f*t)*np.exp(-t/.05)) * np.exp(-t/1.4)
    else: s = (np.sin(2*np.pi*f*t) + .3*np.sin(2*np.pi*2*f*t)*np.exp(-t/.4) + .1*np.sin(2*np.pi*3*f*t)*np.exp(-t/.2)) * np.exp(-t/1.8)
    a = int(.01*SR); s[:a] *= np.linspace(0, 1, a); return s
def bass(f, length):
    n = int(length * SR); t = tt(n); return np.sin(2*np.pi*f*t) * np.minimum(t/1.5, 1) * np.clip((length - t)/2, 0, 1)
def whale(length=5.0):
    n = int(length * SR); t = tt(n); k = t / length
    f = 260 + 140*np.sin(np.pi*k) - 60*k + 6*np.sin(2*np.pi*5*t)
    s = np.sin(2*np.pi*np.cumsum(f)/SR) + .3*np.sin(4*np.pi*np.cumsum(f)/SR)
    return s * np.sin(np.pi*k)**2
def bubble():
    n = int(.12*SR); t = tt(n); f = 500 + 2500*t/.12
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/.03)

PROG = [(['C4','E4','G4','B4'],'C3'), (['A3','C4','E4','G4'],'A2'), (['F3','A3','C4','E4'],'F2'), (['G3','B3','D4','A4'],'G2'),
        (['E3','G3','B3','D4'],'E2'), (['A3','C4','E4','B4'],'A2'), (['F3','A3','C4','G4'],'F2'), (['G3','C4','D4','G4'],'G2')]
PENTA = ['C5','D5','E5','G5','A5','C6','D6','E6']
KEYS = [0, -3, 2, -5, 0, 4, -2, 3]; CH = 8.0; CYCLE = CH * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 6) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR);
        if i >= n: return
        sig = sig[:n - i] * g; L[i:i+len(sig)] += (sig*(1-pan)*.707).astype(np.float32); R[i:i+len(sig)] += (sig*(1+pan)*.707).astype(np.float32)
    for ci, (tri, root) in enumerate(PROG):
        t0 = ci * CH
        add(pad([freq(v, shift) for v in tri], CH + 3), t0 - 1.5 if ci else t0, 0, .30)
        add(bass(freq(root, shift), CH + 1), t0, 0, .28)
        tt0 = t0 + .3
        while tt0 < t0 + CH - .5:
            nt = PENTA[rng.integers(len(PENTA))]
            add(bell(freq(nt, shift), 4.5, rng.integers(2)), tt0, rng.uniform(-.6, .6), rng.uniform(.10, .18))
            tt0 += rng.choice([1.0, 1.5, 2.0, 2.0, 3.0])
    if k % 2 == 1: add(whale(rng.uniform(4.5, 6.5)), rng.uniform(5, 40), rng.uniform(-.4, .4), .10)
    for _ in range(3):
        b0 = rng.uniform(0, CYCLE)
        for j in range(rng.integers(3, 7)): add(bubble(), b0 + j * rng.uniform(.08, .2), rng.uniform(-.5, .5), .05)
    return np.stack([L, R], 1)

irn = int(3.0 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .8) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir**2))
bb, ab = butter(2, 500 / (SR / 2))
zi = [np.zeros(2), np.zeros(2)]

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .7 + wet * .55
    if GAIN is None: GAIN = .55 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    # zeeruis (doorlopend gefilterd, zachte deining van ~10 s)
    ts = (written + np.arange(len(chunk))) / SR; sw = .5 + .5*np.sin(2*np.pi*ts/10.0) ** 2
    for c in range(2):
        nz, zi[c] = lfilter(bb, ab, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * sw * .05).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = int(6 * SR); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'deel {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
