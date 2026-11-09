"""Calm firefly-meadow music: a slow, dreamy 4/4 in D-flat major (~58 bpm). Soft vibraphone melody with gentle motor tremolo,
a warm bowed string pad, slow rolling harp arpeggios and a deep humming bass; ambient: evening crickets, a light breeze and,
now and then, a soft far-away frog croak. Different mood from the other calm videos (no guitar, flute, clarinet, felt piano,
glass harmonica, harmonium or pizzicato).
Usage: python3 ep/firefly_music.py out.wav SECONDS"""
import sys; sys.path.insert(0, 'lib')
import numpy as np, wave
from scipy.signal import fftconvolve, lfilter, butter
from audiolib import SR, freq, tt
TOTAL = float(sys.argv[2]) if len(sys.argv) > 2 else 60.0
rng = np.random.default_rng(1110)

def vibes(f, length=3.5, vel=1.0):
    """Vibraphone: sine bar partials (1, 4, 10x) with a soft mallet, slow decay and motor tremolo (~4.5 Hz)."""
    n = int(length * SR); t = tt(n)
    s = np.sin(2 * np.pi * f * t) + .22 * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t / .5) + .05 * np.sin(2 * np.pi * f * 9.9 * t) * np.exp(-t / .12)
    env = np.exp(-t / 1.9) * np.minimum(t / .006, 1) * np.clip((length - t) / .4, 0, 1)
    trem = 1 - .28 * (.5 + .5 * np.sin(2 * np.pi * 4.5 * t))
    return s * env * trem * vel

def harp(f, length=2.6):
    """Plucked harp string: bright attack mellowing quickly, long soft tail."""
    n = int(length * SR); t = tt(n)
    s = sum(np.sin(2 * np.pi * f * h * t + h) * np.exp(-t * (1.1 + h * 1.4)) / h ** 1.3 for h in range(1, 7))
    at = int(.003 * SR); s[:at] *= np.linspace(0, 1, at)
    b, a = butter(1, min(4500, f * 7) / (SR / 2)); return lfilter(b, a, s)

def strings(fs, length):
    """Bowed string pad: detuned saws, low-passed, slow swell in and out, gentle ensemble vibrato."""
    n = int(length * SR); t = tt(n); s = np.zeros(n)
    for j, f in enumerate(fs):
        for d in (-.003, 0, .0028):
            vib = 1 + .0025 * np.sin(2 * np.pi * (5.1 + j * .3 + d * 40) * t + j)
            ph = np.cumsum(f * (1 + d) * vib) / SR % 1; s += 2 * ph - 1
    b, a = butter(2, 1100 / (SR / 2)); s = lfilter(b, a, s) / (3 * len(fs))
    env = np.minimum(t / 3.0, 1) * np.clip((length - t) / 3.0, 0, 1)
    return s * env

def hum(f, length):
    """Deep humming bass: sine + soft 2nd harmonic, slow attack."""
    n = int(length * SR); t = tt(n)
    s = np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)
    return s * np.minimum(t / .6, 1) * np.clip((length - t) / 1.2, 0, 1)

def croak():
    """A soft, far-away frog croak: two short low pulsed tones."""
    out = np.zeros(int(.9 * SR)); pos = 0
    for _ in range(int(rng.integers(1, 3))):
        m = int(rng.uniform(.16, .24) * SR); tk = tt(m); f0 = rng.uniform(180, 240)
        s = np.sign(np.sin(2 * np.pi * f0 * tk)) * .5 + np.sin(2 * np.pi * f0 * tk)
        s *= (.6 + .4 * np.sin(2 * np.pi * 28 * tk)) * np.sin(np.pi * tk / tk[-1])
        s = lfilter(*butter(2, 900 / (SR / 2)), s)
        out[pos:pos + m] += s; pos += m + int(rng.uniform(.08, .16) * SR)
    return out

BEAT = 60 / 58; BAR = 4 * BEAT; CH = 2 * BAR
# D-flat major, warm and floating: Db - Bbm - Gb - Ab / Fm - Gb - Ebm - Ab(sus)
PROG = [(['C#3', 'F3', 'G#3', 'C4'], 'C#2'), (['A#2', 'C#3', 'F3', 'G#3'], 'A#1'), (['F#2', 'A#2', 'C#3', 'F3'], 'F#1'), (['G#2', 'C3', 'D#3', 'F#3'], 'G#1'),
        (['F2', 'G#2', 'C3', 'D#3'], 'F1'), (['F#2', 'A#2', 'C#3', 'F3'], 'F#1'), (['D#2', 'F#2', 'A#2', 'C#3'], 'D#1'), (['G#2', 'C#3', 'D#3', 'F#3'], 'G#1')]
MEL = ['G#3', 'A#3', 'C4', 'C#4', 'D#4', 'F4', 'G#4', 'A#4', 'C#5']
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
        add(strings([freq(x, shift + 12) for x in tones], CH + 4), t0 - 2 if ci else t0, 0, .16)
        add(hum(freq(root, shift + 12), CH + .6), t0, 0, .22)
        # slow rolling harp arpeggio: up over two bars in quarter notes, a few notes left out
        arp = [tones[0], tones[1], tones[2], tones[3], tones[2], tones[1], tones[3], tones[2]]
        for j, nm in enumerate(arp):
            if rng.random() < .18: continue
            add(harp(freq(nm, shift + 12 + (12 if j in (3, 6) else 0))), t0 + j * BEAT + rng.uniform(0, .01), .4 - (j % 4) * .2, .10)
    # vibraphone melody in two of every three sections; long notes with plenty of space
    if k % 3 != 2:
        t1 = rng.uniform(.5, 1.5) + BAR; last = 4
        while t1 < CYCLE - 4:
            if rng.random() < .25: t1 += rng.choice([BEAT, 2 * BEAT]); continue
            last = int(np.clip(last + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(MEL) - 1))
            ln = rng.choice([BEAT, 2 * BEAT, 2 * BEAT, 3 * BEAT, 4 * BEAT])
            add(vibes(freq(MEL[last], shift + 12 if shift < -2 else shift), ln + 2.5, rng.uniform(.8, 1.0)), t1, -.2, .20)
            t1 += ln
    else:
        # answer section: the harp takes a sparse high melody, vibes only touch a few long notes
        t1 = rng.uniform(1, 2)
        while t1 < CYCLE - 4:
            add(harp(freq(MEL[int(rng.integers(4, len(MEL)))], shift + 12), 3.0), t1, rng.uniform(-.3, .3), .13)
            t1 += rng.choice([2 * BEAT, 3 * BEAT, 4 * BEAT])
        for _ in range(3):
            add(vibes(freq(MEL[int(rng.integers(2, 7))], shift), 5.0, .8), rng.uniform(2, CYCLE - 8), .25, .14)
    return np.stack([L, R], 1)

irn = int(3.0 * SR); ti = tt(irn)
IR = [rng.standard_normal(irn) * np.exp(-ti / .85) for _ in range(2)]
for ir in IR: ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
bw, aw = butter(2, [200 / (SR / 2), 1200 / (SR / 2)], 'band')
bc, ac = butter(2, [4200 / (SR / 2), 6200 / (SR / 2)], 'band')
zi = [np.zeros(4), np.zeros(4)]; zc = [np.zeros(4), np.zeros(4)]

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
    for c in range(2):
        # light breeze (~13 s swells)
        gust = .35 + .65 * np.sin(2 * np.pi * ts / 13.0 + c * 1.3) ** 4
        nz, zi[c] = lfilter(bw, aw, rng.standard_normal(len(chunk)), zi=zi[c]); chunk[:, c] += (nz * gust * .006).astype(np.float32)
        # evening crickets: band-limited noise gated in soft chirp trains (~3 chirps per second), slowly breathing
        cr, zc[c] = lfilter(bc, ac, rng.standard_normal(len(chunk)), zi=zc[c])
        gate = np.clip(np.sin(2 * np.pi * (2.9 + c * .37) * ts + c), 0, 1) ** 6 * (np.sin(2 * np.pi * 42 * ts) > 0)
        breathe = .5 + .5 * np.sin(2 * np.pi * ts / 23.0 + c * 2)
        chunk[:, c] += (cr * gate * breathe * .0045).astype(np.float32)
    for _ in range(int(len(chunk) / SR / 25)):
        b = croak(); i = int(rng.integers(0, len(chunk) - len(b))); pan = rng.uniform(-.6, .6)
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
