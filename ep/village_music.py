"""Cosy calm music for "Cozy Winter Village": a slow, rocking 6/8 lullaby in E-flat major (~50 dotted-quarter beats per minute).
Celesta melody (bell-like, soft), warm felt-piano chords (muted hammer, gentle), soft pizzicato strings on the off-beats, a round
plucked bass, a very soft sleigh-bell shimmer on the first beat of some bars; ambient: soft winter wind + a quiet crackling fireplace.
Different from the other calm videos (no tongue drum, synth pad, marimba, ukulele, harp, guitar, flute or choir).
Usage: python3 ep/village_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, tt
from audiolib import freq as _freq
def freq(n, shift=0):
    # audiolib.freq ignores flats, so handle 'b' (e.g. 'Eb3', 'Bb4') here
    if len(n) > 2 and n[1] == 'b': return _freq(n[0] + n[2:], shift - 1)
    return _freq(n, shift)
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1119)

def celesta(f, length=2.2, vel=1.0):
    """Celesta: struck metal bars in a wooden box – fundamental + bright 4th harmonic that dies fast, short soft attack."""
    n = int(length * SR); t = tt(n)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / .9) + .3 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / .12)
         + .12 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .4) + .04 * np.sin(2 * np.pi * f * 7.1 * t) * np.exp(-t / .03))
    env = np.minimum(t / .004, 1) * np.clip((length - t) / .25, 0, 1)
    return s * env * vel

def felt(f, length=3.0, vel=1.0):
    """Felt piano: soft hammer (low-passed), a few harmonics, slightly detuned string pair, long gentle decay."""
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for h, a in ((1, 1), (2, .35), (3, .12), (4, .05)):
        for d in (-.0012, .0012):
            s += a * np.sin(2 * np.pi * f * h * (1 + d) * t) * np.exp(-t * (.9 + h * .5))
    s *= np.minimum(t / .012, 1) * np.clip((length - t) / .4, 0, 1)
    b, a2 = butter(1, 1800 / (SR / 2)); return lfilter(b, a2, s) * vel * .5

def pizz(f, vel=1.0):
    """Pizzicato string: plucked, short, a touch of body resonance."""
    n = int(.9 * SR); t = tt(n)
    s = (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .08) + .15 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t / .05))
    return s * np.exp(-t / .22) * np.minimum(t / .003, 1) * vel

def bass(f, length=1.8):
    n = int(length * SR); t = tt(n)
    return (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .3)) * np.minimum(t / .01, 1) * np.exp(-t / .9) * np.clip((length - t) / .2, 0, 1)

def bells(length=1.2):
    """Very soft sleigh-bell shimmer: a few tiny high band-passed noise jingles."""
    n = int(length * SR); out = np.zeros(n)
    b, a = butter(2, [5000 / (SR / 2), 9000 / (SR / 2)], 'band')
    for j in range(int(rng.integers(3, 6))):
        m = int(.25 * SR); t = tt(m); nz = lfilter(b, a, rng.standard_normal(m)) * np.exp(-t / .05)
        i = int(j * rng.uniform(.06, .12) * SR)
        if i + m < n: out[i:i + m] += nz * rng.uniform(.5, 1)
    return out

# 6/8: a bar = 2 dotted-quarter beats, 6 eighths
BEAT = 60 / 50; E8 = BEAT / 3; BAR = 2 * BEAT; CH = 2 * BAR
# E-flat major, gentle: Eb - Cm - Ab - Bb / Eb - Gm - Ab - Bbsus4
PROG = [(['Eb3', 'G3', 'Bb3'], 'Eb2'), (['C3', 'Eb3', 'G3'], 'C2'), (['Ab2', 'C3', 'Eb3'], 'Ab1'), (['Bb2', 'D3', 'F3'], 'Bb1'),
        (['Eb3', 'G3', 'Bb3'], 'Eb2'), (['G2', 'Bb2', 'D3'], 'G1'), (['Ab2', 'C3', 'Eb3'], 'Ab1'), (['Bb2', 'Eb3', 'F3'], 'Bb1')]
MEL = ['Bb4', 'C5', 'Eb5', 'F5', 'G5', 'Bb5', 'C6', 'Eb6']   # E-flat major pentatonic
KEYS = [0, 2, -3, 0, 3, -2, 0, -1]; CYCLE = CH * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 8) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * CH; fr = [freq(x, shift) for x in tones]
        for b in range(2):
            bt = t0 + b * BAR
            add(bass(freq(root, shift + 12)), bt, 0, .3)
            # felt-piano chord on beat 1 (rolled), soft
            for j, f in enumerate(fr): add(felt(f * 2, 3.2, .9), bt + j * .03, -.25 + j * .2, .16)
            # pizzicato on eighths 2,3 and 5,6 (rocking 6/8)
            if k % 4 != 3:
                for e in (1, 2, 4, 5):
                    add(pizz(fr[(e + b) % 3] * 2, .7), bt + e * E8, .35 if e % 2 else -.35, .07)
            if (ci + b) % 4 == 0 and k % 2 == 0: add(bells(), bt, rng.uniform(-.5, .5), .025)
    # celesta melody: slow lilting phrases in dotted rhythm, rests; every 4th section only a few lonely notes
    if k % 4 != 3:
        t1 = BAR; last = 3
        while t1 < CYCLE - 3:
            if rng.random() < .22: t1 += BEAT; continue
            last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
            ln = rng.choice([E8 * 2, E8, E8 * 3, E8 * 3, E8 * 6])
            add(celesta(freq(MEL[last], shift), max(1.8, ln + 1.0), rng.uniform(.75, 1.0)), t1, rng.uniform(-.2, .2), .26)
            t1 += ln
    else:
        for j in range(6):
            add(celesta(freq(MEL[int(rng.integers(1, len(MEL) - 1))], shift), 2.6, .7), j * CYCLE / 6 + rng.uniform(.3, 1.5), rng.uniform(-.4, .4), .2)
    return np.stack([L, R], 1)

irn = int(2.6 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .7) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [150 / (SR / 2), 900 / (SR / 2)], 'band')     # wind
bc, ac = butter(2, [1500 / (SR / 2), 6000 / (SR / 2)], 'band')   # fire crackle
zi = [np.zeros(4), np.zeros(4)]

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .72 + wet * .45
    if GAIN is None: GAIN = .5 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    ts = (written + np.arange(len(chunk))) / SR
    for c in range(2):   # soft winter wind
        sw = .3 + .7 * np.sin(2 * np.pi * ts / 23.0 + c * 1.3) ** 4
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * sw * .007).astype(np.float32)
    # quiet fireplace crackle: sparse little clicks
    nclk = int(len(chunk) / SR * 2.2)
    for _ in range(nclk):
        m = int(rng.uniform(.004, .02) * SR); i = int(rng.integers(0, len(chunk) - m)); tm = tt(m)
        c = lfilter(bc, ac, rng.standard_normal(m)) * np.exp(-tm / (m / SR / 3)) * rng.uniform(.004, .014); pan = rng.uniform(-.3, .3)
        chunk[i:i + m, 0] += (c * (1 - pan)).astype(np.float32); chunk[i:i + m, 1] += (c * (1 + pan)).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
