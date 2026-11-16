"""Dreamy calm music for "Starry Space Trip": a slow, floating 3/4 in A major (~64 bpm).
Steel tongue drum (handpan-like) melody, a warm, slowly breathing analog-style synth pad (detuned saws through a soft low-pass),
a deep round sub bass on beat 1, music-box-free sparkle: soft wind chimes now and then; ambient: gentle 'space air' swells (filtered noise).
Different from the other calm videos (no marimba, ukulele, vibes, harp, guitar, flute, clarinet, felt piano, glass harmonica, harmonium,
pizzicato or choir).
Usage: python3 ep/space_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1116)

def tongue(f, length=2.4, vel=1.0):
    """Steel tongue drum: warm fundamental, a soft octave and a slightly inharmonic 'ping', long ring, soft mallet."""
    n = int(length * SR); t = tt(n)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 1.1) + .35 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / .5)
         + .12 * np.sin(2 * np.pi * f * 2.92 * t) * np.exp(-t / .18) + .05 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / .05))
    s *= 1 + .04 * np.sin(2 * np.pi * 5.2 * t) * np.exp(-t / .8)   # little beating shimmer
    env = np.minimum(t / .006, 1) * np.clip((length - t) / .3, 0, 1)
    return s * env * vel

def pad(fs, length):
    """Analog-style pad: 3 detuned saws per note, low-passed, slow swell and slow 'breathing'."""
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for f in fs:
        for d in (-.006, 0, .005):
            ph = (f * (1 + d) * t + rng.random()) % 1; s += 2 * ph - 1
    s /= 3 * len(fs)
    b, a = butter(2, 900 / (SR / 2)); s = lfilter(b, a, s)
    breath = .75 + .25 * np.sin(2 * np.pi * t / 7.5 + rng.random() * 6)
    return s * breath * np.minimum(t / 2.5, 1) * np.clip((length - t) / 2.5, 0, 1)

def sub(f, length=2.6):
    n = int(length * SR); t = tt(n)
    return np.sin(2 * np.pi * f * t) * np.minimum(t / .05, 1) * np.exp(-t / 1.4) * np.clip((length - t) / .2, 0, 1)

def chimes():
    """Soft wind chimes: 4–7 tiny bell tones, randomly from the A major pentatonic, high and quiet."""
    out = np.zeros(int(4 * SR)); pos = 0
    for _ in range(int(rng.integers(4, 8))):
        f = freq(rng.choice(['A5', 'B5', 'C#6', 'E6', 'F#6', 'A6'])); m = int(2.2 * SR); t = tt(m)
        s = (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .3)) * np.exp(-t / .9) * np.minimum(t / .002, 1)
        if pos + m < len(out): out[pos:pos + m] += s * rng.uniform(.5, 1)
        pos += int(rng.uniform(.12, .4) * SR)
    return out

BEAT = 60 / 64; BAR = 3 * BEAT; CH = 2 * BAR
# A major, floating: A - F#m - D - E / A - C#m - D - Esus
PROG = [(['A3', 'C#4', 'E4'], 'A1'), (['F#3', 'A3', 'C#4'], 'F#1'), (['D3', 'F#3', 'A3'], 'D2'), (['E3', 'G#3', 'B3'], 'E2'),
        (['A3', 'C#4', 'E4'], 'A1'), (['C#3', 'E3', 'G#3'], 'C#2'), (['D3', 'F#3', 'A3'], 'D2'), (['E3', 'A3', 'B3'], 'E2')]
MEL = ['E4', 'F#4', 'A4', 'B4', 'C#5', 'E5', 'F#5', 'A5']   # A major pentatonic
KEYS = [0, -2, 3, 0, -3, 2, 1, 0]; CYCLE = CH * len(PROG)

def section(k):
    shift = KEYS[k % len(KEYS)]; n = int((CYCLE + 8) * SR)
    L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
    def add(sig, st, pan=0., g=1.):
        i = int(st * SR)
        if i >= n or i < 0: return
        sig = sig[:n - i] * g; L[i:i + len(sig)] += (sig * (1 - pan) * .707).astype(np.float32); R[i:i + len(sig)] += (sig * (1 + pan) * .707).astype(np.float32)
    for ci, (tones, root) in enumerate(PROG):
        t0 = ci * CH; fr = [freq(x, shift) for x in tones]
        add(pad(fr + [fr[0] * 2], CH + 4), t0 - 2 if ci else t0, -.2 if ci % 2 else .2, .2)
        for b in range(2):
            add(sub(freq(root, shift + 12)), t0 + b * BAR, 0, .33)
        # soft rolling tongue-drum chord tones on beats 2 and 3 (quiet accompaniment)
        if k % 4 != 3:
            for b in range(2):
                for j, bt in enumerate((1, 2)):
                    add(tongue(fr[(j + b + ci) % 3] * (2 if j else 1), 1.6, .5), t0 + b * BAR + bt * BEAT, -.35 + j * .7, .1)
    # tongue-drum melody: slow phrases with long rings and rests; every 4th section only a few lonely notes (calmer)
    if k % 4 != 3:
        t1 = BAR; last = 4
        while t1 < CYCLE - 3:
            if rng.random() < .25: t1 += BEAT; continue
            last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
            ln = rng.choice([BEAT, BEAT, 2 * BEAT, 3 * BEAT, BEAT / 2])
            add(tongue(freq(MEL[last], shift), max(2.0, ln + 1.2), rng.uniform(.8, 1.0)), t1, rng.uniform(-.2, .2), .3)
            t1 += ln
    else:
        for j in range(6):
            add(tongue(freq(MEL[int(rng.integers(2, len(MEL)))], shift), 3.0, .7), j * CYCLE / 6 + rng.uniform(.3, 1.5), rng.uniform(-.4, .4), .24)
    return np.stack([L, R], 1)

irn = int(3.2 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .9) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [250 / (SR / 2), 1600 / (SR / 2)], 'band')
zi = [np.zeros(4), np.zeros(4)]

out = wave.open(sys.argv[1], 'wb'); out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
NT = int(TOTAL * SR); written = 0; carry = np.zeros((0, 2), np.float32); k = 0; GAIN = None
while written < NT:
    p = section(k)
    wet = np.stack([fftconvolve(p[:, c], IR[c])[:len(p)] for c in range(2)], 1).astype(np.float32)
    p = p * .7 + wet * .5
    if GAIN is None: GAIN = .5 / (np.max(np.abs(p)) + 1e-9)
    p *= GAIN; p[:len(carry)] += carry
    step = int(CYCLE * SR); chunk, carry = p[:step].copy(), p[step:]
    ts = (written + np.arange(len(chunk))) / SR
    for c in range(2):   # gentle 'space air' swells
        sw = .2 + .8 * np.sin(2 * np.pi * ts / 17.0 + c * 1.7) ** 6
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * sw * .006).astype(np.float32)
    for _ in range(max(1, int(len(chunk) / SR / 25))):
        b = chimes(); i = int(rng.integers(0, max(1, len(chunk) - len(b)))); pan = rng.uniform(-.7, .7)
        b = b[:len(chunk) - i]
        chunk[i:i + len(b), 0] += (b * .012 * (1 - pan)).astype(np.float32); chunk[i:i + len(b), 1] += (b * .012 * (1 + pan)).astype(np.float32)
    if written == 0:
        fi = int(3 * SR); chunk[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)[:, None]
    chunk = chunk[:NT - written]
    if written + len(chunk) >= NT:
        fo = min(int(6 * SR), len(chunk)); chunk[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)[:, None]
    out.writeframes((np.clip(chunk, -1, 1) * 32767).astype('<i2').tobytes())
    written += len(chunk); k += 1
    print(f'part {k}: {written / SR / 60:.1f} min', flush=True)
out.close()
