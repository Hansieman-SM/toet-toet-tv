"""Calm autumn-forest music: plucked nylon-guitar arpeggios in a slow 3/4 waltz, a soft wooden flute,
warm low strings, light wind and rustling leaves, now and then a sleepy owl and a little bird.
Usage: python3 ep/autumn_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1029)

def pluck(f, length=3.0, bright=.5):
    """Karplus-Strong string via lfilter (fast)."""
    n = int(length * SR); N = max(2, int(SR / f - .5)); fa = SR / (N + .5)
    exc = np.zeros(n); i = np.arange(N); pw = 1.1 + (1 - bright) * 1.4
    exc[:N] = sum(np.sin(2 * np.pi * h * i / N + rng.uniform(0, 6.3)) / h ** pw for h in range(1, max(2, min(40, N // 3))))
    g = .996
    a = np.zeros(N + 2); a[0] = 1; a[N] = -g / 2; a[N + 1] = -g / 2
    s = lfilter([1.0], a, exc)
    s = np.interp(np.arange(n) * (f / fa), np.arange(n), s, right=0.)   # exact tuning
    at = int(.004 * SR); s[:at] *= np.linspace(0, 1, at)
    s[-int(.3 * SR):] *= np.linspace(1, 0, int(.3 * SR))
    return s / (np.max(np.abs(s)) + 1e-9)

def flute(f, length):
    n = int(length * SR); t = tt(n)
    vib = 1 + .004 * np.sin(2 * np.pi * 4.8 * t) * np.minimum(t / .8, 1)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    s = np.sin(ph) + .18 * np.sin(2 * ph) + .06 * np.sin(3 * ph)
    breath = lfilter(*butter(2, [min(f * 1.5, 8000) / (SR / 2), min(f * 4, 16000) / (SR / 2)], 'band'), rng.standard_normal(n)) * .25
    env = np.minimum(t / .35, 1) * np.clip((length - t) / .6, 0, 1)
    return (s + breath) * env

def strings(fs, length):
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for f in fs:
        for d in (-.003, 0, .003):
            ph = (f * (1 + d) * t) % 1; s += 2 * ph - 1
    b, a = butter(2, 900 / (SR / 2)); s = lfilter(b, a, s) / (3 * len(fs))
    env = np.minimum(t / 2.5, 1) * np.clip((length - t) / 2.5, 0, 1)
    return s * env * (1 + .1 * np.sin(2 * np.pi * .15 * t))

def owl():
    out = []
    for f0, ln in ((392, .45), (370, .9)):
        n = int(ln * SR); t = tt(n); s = np.sin(2 * np.pi * f0 * t * (1 - .03 * t / ln)) * np.sin(np.pi * t / ln) ** 1.5
        out.append(s); out.append(np.zeros(int(.25 * SR)))
    return np.concatenate(out)

def chirp():
    out = []
    for _ in range(rng.integers(2, 5)):
        n = int(.09 * SR); t = tt(n); f = 3200 + 1600 * np.sin(np.pi * t / .09)
        out.append(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .09) ** 2); out.append(np.zeros(int(.06 * SR)))
    return np.concatenate(out)

BEAT = 60 / 64; BAR = 3 * BEAT; CH = 2 * BAR
# F major / D minor, gentle waltz harmony: (chord tones low->high, bass)
PROG = [(['F3', 'A3', 'C4', 'F4'], 'F2'), (['D3', 'F3', 'A3', 'D4'], 'D2'), (['A#2', 'D3', 'F3', 'A#3'], 'A#1'), (['C3', 'E3', 'G3', 'C4'], 'C2'),
        (['A2', 'C3', 'E3', 'A3'], 'A1'), (['D3', 'F3', 'A3', 'C4'], 'D2'), (['G2', 'A#2', 'D3', 'F3'], 'G1'), (['C3', 'F3', 'G3', 'C4'], 'C2')]
MEL = ['C5', 'D5', 'F5', 'G5', 'A5', 'C6', 'D6']
KEYS = [0, 2, -3, 0, 5, -2, 3, -1]; CYCLE = CH * len(PROG)
PATTERN = [0, 2, 3, 1, 3, 2]   # bass on 1, then a rocking arpeggio in eighths

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 6) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * CH
        add(strings([freq(root, shift + 12), freq(tones[1], shift)], CH + 3), t0 - 1.0 if ci else t0, 0, .16)
        for bar in range(2):
            b0 = t0 + bar * BAR
            add(pluck(freq(root, shift + 12), 3.5, .3), b0, -.15, .30)
            for j, idx in enumerate(PATTERN[1:], 1):
                hum = rng.uniform(-.012, .012)
                add(pluck(freq(tones[idx], shift + 12), 2.5, .45), b0 + j * BEAT / 2 + hum, rng.uniform(-.35, .1), rng.uniform(.14, .19))
    # flute: slow phrases in two of every three sections
    if k % 3 != 2:
        tt0 = rng.uniform(.5, 3.0); last = 3
        while tt0 < CYCLE - 4:
            if rng.random() < .22: tt0 += rng.choice([BAR, 2 * BAR]); continue
            last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
            ln = rng.choice([BEAT * 2, BAR, BAR, BAR + BEAT, 2 * BAR])
            add(flute(freq(MEL[last], shift - 12 if shift > 2 else shift), ln + .4), tt0, .25, .11)
            tt0 += ln
    if k % 2 == 1: add(owl(), rng.uniform(8, CYCLE - 8), rng.uniform(-.5, .5), .045)
    for _ in range(rng.integers(1, 3)): add(chirp(), rng.uniform(2, CYCLE - 2), rng.uniform(-.7, .7), .025)
    return np.stack([L, R], 1)

irn = int(2.5 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .6) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [250 / (SR / 2), 1800 / (SR / 2)], 'band')
zi = [np.zeros(4), np.zeros(4)]

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .75 + wet * .45
    if GAIN is None: GAIN = .5 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    # wind + rustling leaves: soft band-passed noise with slow gusts (~13 s)
    ts = (written + np.arange(len(chunk))) / SR; gust = .35 + .65 * np.sin(2 * np.pi * ts / 13.0 + 1) ** 4
    for c in range(2):
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * gust * .018).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
