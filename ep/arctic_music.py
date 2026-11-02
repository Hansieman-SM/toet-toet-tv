"""Calm arctic-night music: slow 4/4 (~56 bpm) in E-flat major, soft felt-piano melody, warm glass-harmonica pad,
gentle electric-piano (FM bell) chords, sparkling snowflake tinkles, a soft low bowed bass, and a cold airy wind.
Different mood from the other calm videos: no plucked strings, no harp/kalimba, no flute.
Usage: python3 ep/arctic_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1103)

def felt_piano(f, length, vel=1.0):
    """Soft, muted piano: a few inharmonic partials, quick decay of the highs, low-passed (felt)."""
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for h, a, d in ((1, 1, 1.6), (2, .42, .9), (3, .16, .55), (4, .07, .35), (5, .03, .25)):
        fh = f * h * (1 + .0004 * h * h)
        s += a * np.sin(2 * np.pi * fh * t + rng.uniform(0, 6.3)) * np.exp(-t / d)
    s += .2 * np.sin(2 * np.pi * f * 1.002 * t) * np.exp(-t / 2.2)
    at = int(.012 * SR); s[:at] *= np.linspace(0, 1, at)
    s *= np.clip((length - t) / .4, 0, 1)
    b, a2 = butter(1, min(2400, f * 5) / (SR / 2)); return lfilter(b, a2, s) * vel

def glass_pad(fs, length):
    """Glass-harmonica-like pad: pure partials, slow swell, slight beating."""
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for f in fs:
        for d, a in ((-.0025, .5), (.0025, .5)):
            s += a * (np.sin(2 * np.pi * f * (1 + d) * t) + .25 * np.sin(2 * np.pi * 2 * f * (1 + d) * t) + .08 * np.sin(2 * np.pi * 3 * f * t))
    env = np.minimum(t / 3.0, 1) * np.clip((length - t) / 3.0, 0, 1)
    return s * env / len(fs) * (1 + .12 * np.sin(2 * np.pi * .11 * t))

def epiano(f, length):
    """FM bell / electric piano tone."""
    n = int(length * SR); t = tt(n)
    idx = 1.6 * np.exp(-t / .5)
    s = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) * np.exp(-t / 2.0)
    s += .3 * np.sin(2 * np.pi * f * 14 * t) * np.exp(-t / .05) * .2
    at = int(.006 * SR); s[:at] *= np.linspace(0, 1, at); s *= np.clip((length - t) / .5, 0, 1)
    return s

def tinkle():
    """Snowflake sparkle: a short run of tiny high bell notes."""
    notes = rng.choice(['D#6', 'F6', 'G6', 'A#6', 'C7', 'D#7'], size=rng.integers(3, 6))
    out = np.zeros(int(2.5 * SR)); pos = 0
    for nm in notes:
        f = freq(nm); n = int(1.2 * SR); t = tt(n)
        s = (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .1)) * np.exp(-t / .45)
        e = min(len(out), pos + n); out[pos:e] += s[:e - pos]; pos += int(rng.uniform(.09, .16) * SR)
    return out

def bowed_bass(f, length):
    n = int(length * SR); t = tt(n)
    ph = (f * t) % 1; s = (2 * ph - 1) + .5 * (((2 * f) * t) % 1 * 2 - 1)
    b, a = butter(2, 380 / (SR / 2)); s = lfilter(b, a, s)
    env = np.minimum(t / 1.5, 1) * np.clip((length - t) / 1.8, 0, 1)
    return s * env

BEAT = 60 / 56; BAR = 4 * BEAT; CH = 2 * BAR
# E-flat major, dreamy: Eb - Cm - Ab - Bb / Gm - Ab - Fm - Bb(sus)
PROG = [(['D#3', 'G3', 'A#3', 'D4'], 'D#2'), (['C3', 'D#3', 'G3', 'A#3'], 'C2'), (['G#2', 'C3', 'D#3', 'G3'], 'G#1'), (['A#2', 'D3', 'F3', 'A#3'], 'A#1'),
        (['G2', 'A#2', 'D3', 'F3'], 'G1'), (['G#2', 'C3', 'D#3', 'G3'], 'G#1'), (['F2', 'G#2', 'C3', 'D#3'], 'F1'), (['A#2', 'D#3', 'F3', 'G#3'], 'A#1')]
MEL = ['A#4', 'C5', 'D#5', 'F5', 'G5', 'A#5', 'C6']
KEYS = [0, -2, 3, 0, -4, 2, -1, 1]; CYCLE = CH * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 8) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * CH
        add(glass_pad([freq(x, shift + 12) for x in tones[1:]], CH + 4), t0 - 1.5 if ci else t0, 0, .10)
        add(bowed_bass(freq(root, shift + 12), CH + 1.5), t0, -.05, .10)
        # electric-piano chord on beat 1 of each bar, softly rolled
        for bar in range(2):
            b0 = t0 + bar * BAR
            for j, tn in enumerate(tones):
                add(epiano(freq(tn, shift + 12), BAR + 1), b0 + j * .045 + rng.uniform(0, .01), -.3 + j * .2, .06)
            # gentle off-beat pulse on beat 3
            add(epiano(freq(tones[2], shift + 12), BEAT * 2), b0 + 2 * BEAT, .25, .04)
    # felt-piano melody in two of every three sections; long notes, lots of space
    if k % 3 != 1:
        t1 = rng.uniform(.5, 2.5); last = 3
        while t1 < CYCLE - 5:
            if rng.random() < .25: t1 += rng.choice([BEAT * 2, BAR]); continue
            last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
            ln = rng.choice([BEAT, BEAT * 2, BEAT * 2, BEAT * 3, BAR])
            f = freq(MEL[last], shift - 12 if shift > 2 else shift)
            add(felt_piano(f, ln + 1.8, rng.uniform(.8, 1.0)), t1, .15, .22)
            if rng.random() < .3: add(felt_piano(f / 2 * 1.5, ln + 1.5, .5), t1 + .02, -.1, .12)   # soft fifth below
            t1 += ln
    else:
        # answer section: higher, sparser epiano melody
        t1 = rng.uniform(1, 3)
        while t1 < CYCLE - 5:
            nm = MEL[int(rng.integers(2, len(MEL)))]
            add(epiano(freq(nm, shift), BAR), t1, rng.uniform(-.3, .3), .07)
            t1 += rng.choice([BEAT * 2, BEAT * 3, BAR])
    for _ in range(rng.integers(2, 5)): add(tinkle(), rng.uniform(2, CYCLE - 3), rng.uniform(-.8, .8), .035)
    return np.stack([L, R], 1)

irn = int(3.2 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .9) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [500 / (SR / 2), 3200 / (SR / 2)], 'band')
zi = [np.zeros(4), np.zeros(4)]

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .7 + wet * .55
    if GAIN is None: GAIN = .5 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    # cold airy wind: band-passed noise with slow swells (~17 s), slightly different per channel
    ts = (written + np.arange(len(chunk))) / SR
    for c in range(2):
        gust = .3 + .7 * np.sin(2 * np.pi * ts / 17.0 + c * 1.3) ** 4
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * gust * .012).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
