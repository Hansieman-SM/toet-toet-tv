"""Calm garden-pond music for "Koi Pond": a slow, gently swaying 3/4 in F major (~60 bpm).
Soft ocarina melody (round, hollow vessel-flute tone with a breathy attack and light vibrato), hammered-dulcimer arpeggios (two slightly
detuned struck string courses, soft felt hammers), a warm, slowly breathing bowed viola pad (two voices), a round low sine bass on beat 1;
ambient: a small waterfall trickling, water-drop plinks now and then, a far-away frog. Different from the other calm videos (no celesta,
felt piano, pizzicato, tongue drum, synth pad, marimba, ukulele, harp, flute, clarinet, harmonica, autoharp, vibraphone or choir).
Usage: python3 ep/koi_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, tt
from audiolib import freq as _freq
def freq(n, shift=0):
    if len(n) > 2 and n[1] == 'b': return _freq(n[0] + n[2:], shift - 1)
    return _freq(n, shift)
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(2611)
bo, ao = butter(2, 3000 / (SR / 2))

def ocarina(f, length=1.5, vel=1.0):
    """Ocarina: nearly pure tone + a little 2nd/3rd harmonic, breath noise in the attack, gentle delayed vibrato."""
    n = int(length * SR); t = tt(n)
    vib = 1 + .005 * np.sin(2 * np.pi * 4.8 * t) * np.clip((t - .3) / .4, 0, 1)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    s = np.sin(ph) + .12 * np.sin(2 * ph) + .06 * np.sin(3 * ph)
    s += lfilter(bo, ao, rng.standard_normal(n)) * (.12 * np.exp(-t / .06) + .015)
    env = np.minimum(t / .06, 1) * np.clip((length - t) / .2, 0, 1)
    return s * env * vel * .5

def ks(f, length=2.4, bright=.5):
    n = int(length * SR); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p) * .8
    b, a = butter(1, (1500 + 3500 * bright) / (SR / 2)); buf = lfilter(b, a, buf)
    out = np.zeros(n); out[:p] = buf
    for i in range(p, n): out[i] = .997 * .5 * (out[i - p] + out[i - p + 1])
    return out * np.clip((length - tt(n)) / .3, 0, 1)

CACHE = {}
def dulcimer(f):
    """Hammered dulcimer: two struck courses slightly detuned (shimmer) + a soft felt 'thump'."""
    k = round(f, 1)
    if k not in CACHE:
        a = ks(f, 2.4, .55); b = ks(f * 1.0035, 2.4, .55); n = len(a); t = tt(n)
        CACHE[k] = (a + b) * .5 + np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / .05) * .2
    return CACHE[k]

def viola_pad(f, length):
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for d in (1, 1.004):
        ph = 2 * np.pi * f * d * t + .002 * f * np.sin(2 * np.pi * 5.0 * t)
        for h, a in ((1, 1), (2, .5), (3, .3), (4, .15), (5, .08)): s += a * np.sin(h * ph)
    env = np.minimum(t / 1.2, 1) * np.clip((length - t) / 1.2, 0, 1)
    b, a = butter(2, 1800 / (SR / 2)); return lfilter(b, a, s * env) * .25

def sub(f, length):
    n = int(length * SR); t = tt(n); return np.sin(2 * np.pi * f * t) * np.minimum(t / .05, 1) * np.exp(-t / 1.6)

def drop():
    n = int(.35 * SR); t = tt(n); f = 900 + rng.uniform(0, 700)
    return np.sin(2 * np.pi * (f * t + 900 * t * t)) * np.exp(-t / .05) * np.minimum(t / .002, 1)

def frog():
    n = int(.5 * SR); t = tt(n)
    s = np.sign(np.sin(2 * np.pi * 180 * t)) * (np.sin(2 * np.pi * 22 * t) > 0)
    b, a = butter(2, [250 / (SR / 2), 1200 / (SR / 2)], 'band')
    return lfilter(b, a, s) * np.sin(np.pi * t / .5)

BEAT = 1.0; BAR = 3 * BEAT
# F major: F – Dm – Bb – C / F – Am – Bb – Csus4-C
PROG = [(['F3', 'A3', 'C4'], 'F2'), (['D3', 'F3', 'A3'], 'D2'), (['Bb2', 'D3', 'F3'], 'Bb1'), (['C3', 'E3', 'G3'], 'C2'),
        (['F3', 'A3', 'C4'], 'F2'), (['A2', 'C3', 'E3'], 'A1'), (['Bb2', 'D3', 'F3'], 'Bb1'), (['C3', 'F3', 'G3'], 'C2')]
MEL = ['C5', 'D5', 'F5', 'G5', 'A5', 'C6', 'D6']   # F major pentatonic
KEYS = [0, 0, 2, 0, -3, 0, 1, -2]; CYCLE = BAR * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 8) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * BAR; fr = [freq(x, shift) for x in tones]
        add(sub(freq(root, shift), BAR), t0, 0, .2)
        if k % 4 != 1:
            add(viola_pad(fr[1], BAR + 1.5), t0 - .3, -.3, .1); add(viola_pad(fr[2], BAR + 1.5), t0 - .3, .3, .08)
        # dulcimer: rolling arpeggio of 6 eighths per bar (up and down)
        arp = [fr[0], fr[1], fr[2], fr[0] * 2, fr[2], fr[1]]
        for j, f in enumerate(arp): add(dulcimer(f * 2), t0 + j * BEAT / 2, -.5 + j * .2, .11 if j else .14)
    if k % 4 != 3:
        t1 = BAR + rng.uniform(0, .3); last = 2
        while t1 < CYCLE - 3:
            if rng.random() < .2: t1 += BEAT * 1.5; continue
            phrase = int(rng.integers(3, 6))
            for q in range(phrase):
                if t1 >= CYCLE - 3: break
                last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
                ln = float(rng.choice([BEAT, BEAT, BEAT * 1.5, BEAT * 2, BEAT * .5]))
                if q == phrase - 1: ln = BEAT * 3
                add(ocarina(freq(MEL[last], shift - 12), ln * .96, rng.uniform(.8, 1)), t1, rng.uniform(-.15, .15), .22)
                t1 += ln
            t1 += BEAT * float(rng.choice([1.5, 2, 3]))
    return np.stack([L, R], 1)

irn = int(2.4 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .6) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [1500 / (SR / 2), 6000 / (SR / 2)], 'band')
zi = [np.zeros(4), np.zeros(4)]
FR = frog()

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .75 + wet * .4
    if GAIN is None: GAIN = .5 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    ts = (written + np.arange(len(chunk))) / SR
    for c in range(2):   # small waterfall trickle (left-weighted, softly fluctuating)
        sw = .7 + .3 * np.sin(2 * np.pi * ts / 7.0 + c) * np.sin(2 * np.pi * ts / 3.1)
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * sw * (.007 if c == 0 else .004)).astype(np.float32)
    for _ in range(int(rng.integers(3, 7))):   # water-drop plinks
        d = drop(); i = int(rng.integers(0, len(chunk) - len(d))); pan = rng.uniform(-.7, .7); g = rng.uniform(.01, .02)
        chunk[i:i + len(d), 0] += (d * g * (1 - pan)).astype(np.float32); chunk[i:i + len(d), 1] += (d * g * (1 + pan)).astype(np.float32)
    if rng.random() < .6:   # far-away frog, two croaks
        i = int(rng.integers(0, len(chunk) - 2 * len(FR))); pan = rng.uniform(-.6, .6)
        for j in range(2):
            ii = i + j * int(.7 * SR); m = min(len(FR), len(chunk) - ii)
            chunk[ii:ii + m, 0] += (FR[:m] * .008 * (1 - pan)).astype(np.float32); chunk[ii:ii + m, 1] += (FR[:m] * .008 * (1 + pan)).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
