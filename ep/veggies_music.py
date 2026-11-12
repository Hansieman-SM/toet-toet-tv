"""Calm garden-dance music for "Dancing Fruit & Veggies": a light, gently swinging 4/4 in G major (~84 bpm).
Soft wooden marimba melody, ukulele off-beat strums, round sine bass on 1 and 3, a warm 'hum' choir pad, very soft shaker;
ambient: garden breeze, a happy little bee buzzing past now and then, a far-away chirping sparrow.
Different from the other calm videos (no vibes, harp, guitar, flute, clarinet, felt piano, glass harmonica, harmonium or pizzicato).
Usage: python3 ep/veggies_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1113)

def marimba(f, length=1.2, vel=1.0):
    """Wooden marimba bar: fundamental + 4x and 10x partials that die fast, soft mallet."""
    n = int(length * SR); t = tt(n)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / .55) + .3 * np.sin(2 * np.pi * f * 4.0 * t) * np.exp(-t / .07) + .06 * np.sin(2 * np.pi * f * 9.8 * t) * np.exp(-t / .015)
    env = np.minimum(t / .003, 1) * np.clip((length - t) / .2, 0, 1)
    return s * env * vel

def uke(fs, length=.5, down=True):
    """Soft ukulele strum: nylon plucks, a few ms apart (down- or upstroke), short decay."""
    n = int(length * SR); out = np.zeros(n)
    order = fs if down else fs[::-1]
    for j, f in enumerate(order):
        d = int(j * .011 * SR); m = n - d; t = tt(m)
        s = sum(np.sin(2 * np.pi * h * f * t + h) * np.exp(-t * (5 + h * 3.5)) / h for h in range(1, 6))
        s[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR)); out[d:] += s
    b, a = butter(2, 3200 / (SR / 2)); return lfilter(b, a, out) / len(fs)

def bassnote(f, length=.9):
    n = int(length * SR); t = tt(n)
    s = np.sin(2 * np.pi * f * t) + .2 * np.sin(4 * np.pi * f * t) * np.exp(-t / .2)
    return s * np.minimum(t / .015, 1) * np.exp(-t / .7) * np.clip((length - t) / .1, 0, 1)

def choir(fs, length):
    """Warm 'ooh' pad: sines with formant-ish 2nd/3rd partials, slow swell, gentle chorus."""
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for j, f in enumerate(fs):
        for d in (-.002, .002):
            vib = 1 + .003 * np.sin(2 * np.pi * (4.6 + j * .4) * t + j)
            ph = 2 * np.pi * np.cumsum(f * (1 + d) * vib) / SR
            s += np.sin(ph) + .3 * np.sin(2 * ph) + .12 * np.sin(3 * ph)
    s /= 2 * len(fs)
    return s * np.minimum(t / 1.5, 1) * np.clip((length - t) / 1.5, 0, 1)

def shaker():
    n = int(.07 * SR); t = tt(n)
    s = rng.standard_normal(n); s = lfilter(*butter(2, [5000 / (SR / 2), 11000 / (SR / 2)], 'band'), s)
    return s * np.exp(-t / .02)

def bee():
    """A little bee buzzing past: buzzy saw ~210 Hz with wobble, panned across by the caller."""
    L = rng.uniform(1.8, 2.6); n = int(L * SR); t = tt(n)
    f0 = rng.uniform(190, 230) * (1 + .04 * np.sin(2 * np.pi * 3.1 * t))
    ph = np.cumsum(f0) / SR % 1; s = 2 * ph - 1
    s = lfilter(*butter(2, [300 / (SR / 2), 2500 / (SR / 2)], 'band'), s)
    return s * np.sin(np.pi * t / L) ** 2

def chirp():
    """Far-away sparrow: 2–4 quick high chirps."""
    out = np.zeros(int(1.0 * SR)); pos = 0
    for _ in range(int(rng.integers(2, 5))):
        m = int(rng.uniform(.06, .1) * SR); tk = tt(m); f0 = rng.uniform(3600, 4600)
        s = np.sin(2 * np.pi * np.cumsum(f0 * (1 + .25 * np.sin(np.pi * tk / tk[-1]))) / SR) * np.sin(np.pi * tk / tk[-1])
        if pos + m < len(out): out[pos:pos + m] += s
        pos += m + int(rng.uniform(.05, .12) * SR)
    return out

BEAT = 60 / 84; BAR = 4 * BEAT; CH = 2 * BAR
# G major, sunny and simple: G - Em - C - D / G - C - Am - D
PROG = [(['G3', 'B3', 'D4'], 'G1'), (['E3', 'G3', 'B3'], 'E1'), (['C3', 'E3', 'G3'], 'C2'), (['D3', 'F#3', 'A3'], 'D2'),
        (['G3', 'B3', 'D4'], 'G1'), (['C3', 'E3', 'G3'], 'C2'), (['A2', 'C3', 'E3'], 'A1'), (['D3', 'F#3', 'A3'], 'D2')]
MEL = ['D4', 'E4', 'G4', 'A4', 'B4', 'D5', 'E5', 'G5']   # G major pentatonic
KEYS = [0, 2, -2, 0, 3, -3, 1, 0]; CYCLE = CH * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 8) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    sw = BEAT * .08   # gentle swing on the off-beats
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * CH; fr = [freq(x, shift) for x in tones]
        add(choir([f * 2 for f in fr], CH + 3), t0 - 1.5 if ci else t0, 0, .09)
        for b in range(8):
            tb = t0 + b * BEAT
            if b % 2 == 0: add(bassnote(freq(root, shift + 12) * (1.5 if b % 4 == 2 else 1), .9), tb, 0, .3)
            add(uke(fr, .45, down=b % 2 == 0), tb + BEAT / 2 + sw, -.35, .13)
            if k % 4 != 3:
                add(shaker(), tb + BEAT / 2 + sw, .4, .05); add(shaker(), tb, .4, .025)
    # marimba melody: little sing-song phrases with rests; every 4th section only sparse answers (calmer)
    if k % 4 != 3:
        t1 = BAR; last = 3
        while t1 < CYCLE - 2:
            if rng.random() < .2: t1 += BEAT; continue
            last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
            ln = rng.choice([BEAT / 2, BEAT, BEAT, BEAT * 1.5, 2 * BEAT])
            off = sw if (t1 / (BEAT / 2)) % 2 > .5 else 0
            f = freq(MEL[last], shift)
            add(marimba(f, max(.8, ln + .4), rng.uniform(.8, 1.0)), t1 + off, .15, .3)
            if ln >= 2 * BEAT:   # marimba roll on long notes
                for r in range(1, 6): add(marimba(f, .5, .35), t1 + off + r * BEAT / 3, .15, .3)
            t1 += ln
    else:
        for j in range(8):
            add(marimba(freq(MEL[int(rng.integers(3, len(MEL)))], shift), 1.4, .7), j * CH / 2 + rng.uniform(.3, 1.2), rng.uniform(-.3, .3), .22)
    return np.stack([L, R], 1)

irn = int(2.2 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .55) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [180 / (SR / 2), 1000 / (SR / 2)], 'band')
zi = [np.zeros(4), np.zeros(4)]

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .8 + wet * .35
    if GAIN is None: GAIN = .5 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    ts = (written + np.arange(len(chunk))) / SR
    for c in range(2):
        gust = .3 + .7 * np.sin(2 * np.pi * ts / 11.0 + c * 1.1) ** 4
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * gust * .005).astype(np.float32)
    for _ in range(max(1, int(len(chunk) / SR / 30))):
        b = bee(); i = int(rng.integers(0, len(chunk) - len(b))); pn = np.linspace(rng.choice([-.8, .8]), 0, len(b)); pn = pn if rng.random() < .5 else -pn
        chunk[i:i + len(b), 0] += (b * .010 * (1 - pn)).astype(np.float32); chunk[i:i + len(b), 1] += (b * .010 * (1 + pn)).astype(np.float32)
    for _ in range(int(len(chunk) / SR / 14)):
        b = chirp(); i = int(rng.integers(0, len(chunk) - len(b))); pan = rng.uniform(-.7, .7)
        chunk[i:i + len(b), 0] += (b * .006 * (1 - pan)).astype(np.float32); chunk[i:i + len(b), 1] += (b * .006 * (1 + pan)).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
