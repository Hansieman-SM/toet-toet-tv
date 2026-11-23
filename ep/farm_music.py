"""Calm country lullaby for "Sunset Farm": slow 4/4 in G major (~58 bpm).
Soft harmonica melody (reedy, gentle vibrato, breathy attack), autoharp strums (zither-like plucked chords, rolled slowly), a long bowed
double-bass note per chord, very soft brushes on beats 2 and 4; ambient: evening crickets, a far-away cowbell now and then, a soft breeze.
Different from the other calm videos (no celesta, felt piano, pizzicato, tongue drum, synth pad, marimba, ukulele, harp, flute or choir).
Usage: python3 ep/farm_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, tt
from audiolib import freq as _freq
def freq(n, shift=0):
    if len(n) > 2 and n[1] == 'b': return _freq(n[0] + n[2:], shift - 1)
    return _freq(n, shift)
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1123)
bh, ah = butter(2, 2600 / (SR / 2))

def harmonica(f, length=1.5, vel=1.0):
    """Harmonica: free reed – strong odd + even harmonics, gentle low-passed tone, slow vibrato, breath noise in the attack."""
    n = int(length * SR); t = tt(n)
    vib = 1 + .004 * np.sin(2 * np.pi * 5.2 * t) * np.clip((t - .25) / .4, 0, 1)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    s = np.zeros(n)
    for h, a in ((1, 1), (2, .55), (3, .42), (4, .2), (5, .14), (6, .06)): s += a * np.sin(h * ph)
    s += rng.standard_normal(n) * .05 * np.exp(-t / .08)
    env = np.minimum(t / .07, 1) * np.clip((length - t) / .18, 0, 1) * (1 - .15 * t / max(length, .1))
    return lfilter(bh, ah, s * env) * vel * .55

def ks(f, length=2.5, bright=.5):
    """Karplus-Strong plucked string (autoharp-like zither tone)."""
    n = int(length * SR); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p) * .8
    b, a = butter(1, (1200 + 3000 * bright) / (SR / 2)); buf = lfilter(b, a, buf)
    out = np.zeros(n); out[:p] = buf
    for i in range(p, n): out[i] = .996 * .5 * (out[i - p] + out[i - p + 1 if i - p + 1 < i else i - p])
    return out * np.clip((length - tt(n)) / .3, 0, 1)

CACHE = {}
def string(f):
    k = round(f, 1)
    if k not in CACHE: CACHE[k] = ks(f, 2.6, .35)
    return CACHE[k]

def bowed_bass(f, length=4.0):
    n = int(length * SR); t = tt(n)
    s = np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .12 * np.sin(6 * np.pi * f * t)
    env = np.minimum(t / .5, 1) * np.clip((length - t) / .8, 0, 1)
    return s * env

bb, ab = butter(2, [2500 / (SR / 2), 9000 / (SR / 2)], 'band')
def brush(length=.35):
    n = int(length * SR); t = tt(n)
    return lfilter(bb, ab, rng.standard_normal(n)) * np.minimum(t / .03, 1) * np.exp(-t / .1)

def cowbell():
    n = int(2.2 * SR); t = tt(n)
    s = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in ((540, 1, .5), (812, .6, .35), (1350, .3, .2)))
    return s * np.minimum(t / .003, 1)

BEAT = 60 / 58; BAR = 4 * BEAT
# G major: G – Em – C – D / G – Bm – C – Dsus4-D
PROG = [(['G3', 'B3', 'D4'], 'G2'), (['E3', 'G3', 'B3'], 'E2'), (['C3', 'E3', 'G3'], 'C2'), (['D3', 'F#3', 'A3'], 'D2'),
        (['G3', 'B3', 'D4'], 'G2'), (['B2', 'D3', 'F#3'], 'B1'), (['C3', 'E3', 'G3'], 'C2'), (['D3', 'G3', 'A3'], 'D2')]
MEL = ['D4', 'E4', 'G4', 'A4', 'B4', 'D5', 'E5', 'G5']   # G major pentatonic
KEYS = [0, 0, -2, 0, 3, 0, -1, 2]; CYCLE = BAR * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 8) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * BAR; fr = [freq(x, shift) for x in tones]
        add(bowed_bass(freq(root, shift), BAR + .3), t0, 0, .17)
        # autoharp: slow rolled strum on beat 1, lighter strum on beat 3
        for bt, g in ((0, .16), (2, .1)):
            notes = fr + [f * 2 for f in fr]
            for j, f in enumerate(notes): add(string(f), t0 + bt * BEAT + j * .045, -.4 + j * .16, g)
        if k % 4 != 3:
            for bt in (1, 3): add(brush(), t0 + bt * BEAT, .2, .05)
    # harmonica melody: long sighing phrases with breaths; every 4th section rests (only autoharp + bass)
    if k % 4 != 3:
        t1 = BAR * .5 + rng.uniform(0, .3); last = 3
        while t1 < CYCLE - 2.5:
            if rng.random() < .2: t1 += BEAT * 1.5; continue
            phrase = int(rng.integers(3, 6))
            for q in range(phrase):
                if t1 >= CYCLE - 2.5: break
                last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
                ln = float(rng.choice([BEAT, BEAT, BEAT * 1.5, BEAT * 2, BEAT * .5]))
                if q == phrase - 1: ln = BEAT * 2.5
                add(harmonica(freq(MEL[last], shift), ln * .97, rng.uniform(.8, 1)), t1, rng.uniform(-.15, .15), .2)
                t1 += ln
            t1 += BEAT * float(rng.choice([1, 1.5, 2]))
    return np.stack([L, R], 1)

irn = int(2.2 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .55) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [120 / (SR / 2), 700 / (SR / 2)], 'band')
zi = [np.zeros(4), np.zeros(4)]
CB = cowbell()

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .75 + wet * .38
    if GAIN is None: GAIN = .5 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    ts = (written + np.arange(len(chunk))) / SR
    for c in range(2):   # soft breeze
        sw = .3 + .7 * np.sin(2 * np.pi * ts / 29.0 + c * 1.1) ** 4
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * sw * .005).astype(np.float32)
    # evening crickets: soft chirp trains (~4.5 kHz), pulsing
    cr = np.sin(2 * np.pi * 4500 * ts) * (np.sin(2 * np.pi * 28 * ts) > .3) * (np.sin(2 * np.pi * ts / 1.6) > .2)
    cr2 = np.sin(2 * np.pi * 5100 * ts) * (np.sin(2 * np.pi * 31 * ts) > .4) * (np.sin(2 * np.pi * ts / 2.3 + 1) > .4)
    chunk[:, 0] += (cr * .0035 + cr2 * .0015).astype(np.float32); chunk[:, 1] += (cr * .0015 + cr2 * .0035).astype(np.float32)
    # far-away cowbell, once or twice per section
    for _ in range(int(rng.integers(1, 3))):
        i = int(rng.integers(0, max(1, len(chunk) - len(CB)))); pan = rng.uniform(-.6, .6); g = rng.uniform(.006, .012)
        m = min(len(CB), len(chunk) - i); chunk[i:i + m, 0] += (CB[:m] * g * (1 - pan)).astype(np.float32); chunk[i:i + m, 1] += (CB[:m] * g * (1 + pan)).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
