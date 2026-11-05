"""Calm balloon-ride music: a lilting slow 6/8 in F major (~48 dotted-quarter bpm). Soft clarinet melody, pizzicato strings
(bass + gentle broken chords), a warm reed-organ (harmonium) pad, glockenspiel sparkles, a light summer breeze and,
now and then, a tiny songbird far away. Different mood from the other calm videos: no piano, harp, kalimba, guitar or flute.
Usage: python3 ep/balloons_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1106)

def clarinet(f, length, vel=1.0):
    """Woody clarinet: mostly odd harmonics, soft breathy attack, slow gentle vibrato."""
    n = int(length * SR); t = tt(n)
    vib = 1 + .0035 * np.sin(2 * np.pi * 4.6 * t) * np.minimum(t / .8, 1)
    phs = 2 * np.pi * f * np.cumsum(vib) / SR
    s = np.sin(phs) + .32 * np.sin(3 * phs) + .12 * np.sin(5 * phs) + .05 * np.sin(7 * phs) + .06 * np.sin(2 * phs)
    env = np.minimum(t / .09, 1) * np.clip((length - t) / .35, 0, 1) * (1 - .12 * np.minimum(t / 2, 1))
    b, a = butter(1, min(3000, f * 6) / (SR / 2)); s = lfilter(b, a, s)
    breath = lfilter(*butter(2, [1200 / (SR / 2), 4000 / (SR / 2)], 'band'), rng.standard_normal(n)) * .04 * np.exp(-t / .15)
    return (s * .7 + breath) * env * vel

def pizz(f, length=1.2):
    """Plucked string (pizzicato): quick decay, warm."""
    n = int(length * SR); t = tt(n)
    s = sum(np.sin(2 * np.pi * f * h * t) * np.exp(-t * (3 + h * 2.2)) / h for h in range(1, 6))
    at = int(.004 * SR); s[:at] *= np.linspace(0, 1, at)
    b, a = butter(1, min(2200, f * 4) / (SR / 2)); return lfilter(b, a, s)

def harmonium(fs, length):
    """Reed-organ pad: filtered saw-like reeds, slow swell, very slight bellows wobble."""
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for f in fs:
        for d in (-.0018, .0018):
            ph = (f * (1 + d) * t) % 1; s += (2 * ph - 1)
    b, a = butter(2, 900 / (SR / 2)); s = lfilter(b, a, s) / (2 * len(fs))
    env = np.minimum(t / 2.2, 1) * np.clip((length - t) / 2.2, 0, 1)
    return s * env * (1 + .07 * np.sin(2 * np.pi * .23 * t))

def glock(f, length=1.6):
    n = int(length * SR); t = tt(n)
    return (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .12)) * np.exp(-t / .6)

def bird():
    """A tiny far-away songbird: two or three soft rising chirps."""
    out = np.zeros(int(1.2 * SR)); pos = 0
    for _ in range(rng.integers(2, 4)):
        m = int(rng.uniform(.07, .12) * SR); tk = tt(m); f0 = rng.uniform(2800, 3600)
        f = f0 + rng.uniform(500, 1100) * tk / tk[-1]
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tk / tk[-1])
        out[pos:pos + m] += s; pos += m + int(rng.uniform(.05, .12) * SR)
    return out

Q = 60 / 48 / 3          # one eighth note in 6/8 (dotted quarter = 48 bpm)
BAR = 6 * Q; CH = 2 * BAR
# F major, sunny and floating: F - Dm - Bb - C / Am - Bb - Gm - C(sus)
PROG = [(['F3', 'A3', 'C4', 'E4'], 'F2'), (['D3', 'F3', 'A3', 'C4'], 'D2'), (['A#2', 'D3', 'F3', 'A3'], 'A#1'), (['C3', 'E3', 'G3', 'A#3'], 'C2'),
        (['A2', 'C3', 'E3', 'G3'], 'A1'), (['A#2', 'D3', 'F3', 'A3'], 'A#1'), (['G2', 'A#2', 'D3', 'F3'], 'G1'), (['C3', 'F3', 'G3', 'A#3'], 'C2')]
MEL = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5', 'D5']
KEYS = [0, 2, -3, 0, 5, -2, 3, -1]; CYCLE = CH * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 8) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * CH
        add(harmonium([freq(x, shift + 12) for x in tones[:3]], CH + 3), t0 - 1 if ci else t0, 0, .12)
        for bar in range(2):
            b0 = t0 + bar * BAR
            # pizzicato bass on 1 and 4, broken chord eighths 2-3 and 5-6 (lilting 6/8)
            add(pizz(freq(root, shift + 12), 1.6), b0, -.1, .30)
            add(pizz(freq(root, shift + 12 + 7), 1.4), b0 + 3 * Q, -.1, .20)
            for j, e in enumerate((1, 2, 4, 5)):
                if rng.random() < .15: continue
                add(pizz(freq(tones[1 + j % 3], shift + 12), 1.0), b0 + e * Q + rng.uniform(0, .008), .35 - j * .1, .11)
    # clarinet melody in two of every three sections; long notes in dotted rhythm, lots of air
    if k % 3 != 2:
        t1 = rng.uniform(.5, 2) + BAR; last = 3
        while t1 < CYCLE - 4:
            if rng.random() < .22: t1 += rng.choice([3 * Q, BAR]); continue
            last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
            ln = rng.choice([2 * Q, 3 * Q, 3 * Q, 4 * Q, 6 * Q])
            f = freq(MEL[last], shift + 12 if shift < -1 else shift)
            add(clarinet(f, ln + .3, rng.uniform(.8, 1.0)), t1, -.15, .20)
            t1 += ln + Q * rng.choice([0, 0, 1])
    else:
        # answer section: glockenspiel melody, sparse and high
        t1 = rng.uniform(1, 3)
        while t1 < CYCLE - 4:
            nm = MEL[int(rng.integers(3, len(MEL)))]
            add(glock(freq(nm, shift + 12)), t1, rng.uniform(-.3, .3), .09)
            t1 += rng.choice([3 * Q, 3 * Q, 6 * Q, 9 * Q])
    # glockenspiel sparkles at the end of some phrases
    for _ in range(rng.integers(2, 5)):
        st = rng.integers(1, len(PROG)) * CH - 3 * Q
        for j, nm in enumerate(rng.choice(['C6', 'E6', 'F6', 'G6', 'A6'], size=3, replace=False)):
            add(glock(freq(nm, shift)), st + j * Q * .5, rng.uniform(-.6, .6), .05)
    return np.stack([L, R], 1)

irn = int(2.6 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .7) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [250 / (SR / 2), 1600 / (SR / 2)], 'band')
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
    # light summer breeze (~11 s swells) + a far-away songbird now and then
    ts = (written + np.arange(len(chunk))) / SR
    for c in range(2):
        gust = .35 + .65 * np.sin(2 * np.pi * ts / 11.0 + c * 1.1) ** 4
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * gust * .008).astype(np.float32)
    for _ in range(int(len(chunk) / SR / 14)):
        b = bird(); i = int(rng.integers(0, len(chunk) - len(b))); pan = rng.uniform(-.7, .7)
        chunk[i:i + len(b), 0] += (b * .010 * (1 - pan)).astype(np.float32); chunk[i:i + len(b), 1] += (b * .010 * (1 + pan)).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
