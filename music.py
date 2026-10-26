"""Eigen gecomponeerd vrolijk kinderdeuntje voor Truckje Toet. 120 bpm, 60 s."""
import numpy as np, wave, sys

SR = 44100
BPM = 120
E = 60 / BPM / 2          # achtste noot in seconden (0.25 s)
BAR = 8 * E               # 2 s per maat
DUR = 60.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

NOTES = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def freq(n):
    name, octv = n[:-1], int(n[-1])
    semi = NOTES[name[0]] + (1 if '#' in name else 0) + (octv - 4) * 12
    return 261.6256 * 2 ** (semi / 12)

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i+len(sig)] += sig * (1 - pan) * 0.5 * 2 ** 0.5
    R[i:i+len(sig)] += sig * (1 + pan) * 0.5 * 2 ** 0.5

def env(n, a=0.005, tau=0.3):
    t = np.arange(n) / SR
    e = np.exp(-t / tau)
    ai = max(1, int(a * SR)); e[:ai] *= np.linspace(0, 1, ai)
    return e, t

def mallet(f, length, tau=0.35):
    n = int(length * SR); e, t = env(n, 0.004, tau)
    s = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t/0.08) + 0.12*np.sin(2*np.pi*3*f*t)
    return s * e

def glock(f, length):
    n = int(length * SR); e, t = env(n, 0.002, 0.5)
    return (np.sin(2*np.pi*2*f*t) + 0.25*np.sin(2*np.pi*5.4*f*t)*np.exp(-t/0.05)) * e

def pluck(freqs, length=0.45):
    n = int(length * SR); e, t = env(n, 0.003, 0.14)
    s = sum(np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*2*f*t) + 0.15*np.sin(2*np.pi*3*f*t) for f in freqs)
    return s * e / len(freqs)

def bass(f, length):
    n = int(length * SR); e, t = env(n, 0.01, 0.4)
    tri = 2/np.pi * np.arcsin(np.sin(2*np.pi*f*t))
    cut = int(n*0.85); e[cut:] *= np.linspace(1, 0, n-cut)
    return (tri + 0.4*np.sin(2*np.pi*f*t)) * e

def kick():
    n = int(0.3*SR); t = np.arange(n)/SR
    f = 50 + 110*np.exp(-t/0.03)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t/0.12)

def clap():
    n = int(0.2*SR); t = np.arange(n)/SR
    nz = rng.standard_normal(n); nz = nz - np.concatenate([[0], nz[:-1]])*0.6
    return nz * np.exp(-t/0.05) * 0.5 + np.sin(2*np.pi*190*t)*np.exp(-t/0.04)*0.4

def hat():
    n = int(0.06*SR); t = np.arange(n)/SR
    nz = rng.standard_normal(n); nz = np.diff(np.concatenate([[0], nz]))
    return nz * np.exp(-t/0.015) * 0.3

def honk(start):
    for d in (0, 0.28):
        n = int(0.22*SR); t = np.arange(n)/SR
        sq = np.sign(np.sin(2*np.pi*392*t)) + np.sign(np.sin(2*np.pi*494*t))
        e = np.ones(n); a = int(0.01*SR); e[:a] = np.linspace(0,1,a); e[-a*3:] = np.linspace(1,0,a*3)
        add(sq*e*0.22, start+d, 0.15)

CHORDS = {
    'C':  (['C3','G3'], ['C4','E4','G4']),
    'G':  (['G2','D3'], ['B3','D4','G4']),
    'Am': (['A2','E3'], ['C4','E4','A4']),
    'F':  (['F2','C3'], ['C4','F4','A4']),
    'Em': (['E3','B3'], ['B3','E4','G4']),
}

A = [
 [('E5',1),('E5',1),('G5',2),('E5',1),('C5',1),('D5',2)],
 [('D5',1),('D5',1),('B4',1),('D5',1),('G5',3),('-',1)],
 [('C5',1),('E5',1),('A5',2),('G5',1),('E5',1),('C5',2)],
 [('F5',1),('E5',1),('D5',1),('C5',1),('D5',3),('-',1)],
 [('E5',1),('E5',1),('G5',2),('C6',2),('B5',1),('A5',1)],
 [('G5',2),('D5',1),('E5',1),('F5',2),('E5',1),('D5',1)],
 [('C5',1),('D5',1),('E5',1),('F5',1),('A5',2),('G5',2)],
 [('C5',4),('-',2),('G4',1),('B4',1)],
]
A_CH = ['C','G','Am','F','C','G','F','C']
B = [
 [('A5',2),('G5',1),('F5',1),('A5',2),('C6',2)],
 [('B5',2),('A5',1),('G5',1),('D5',4)],
 [('G5',1),('E5',1),('G5',1),('E5',1),('B5',2),('G5',2)],
 [('A5',1),('C6',1),('B5',1),('A5',1),('E5',4)],
 [('F5',1),('G5',1),('A5',1),('F5',1),('C6',3),('-',1)],
 [('B5',1),('A5',1),('G5',1),('F5',1),('D5',2),('G4',2)],
 [('C5',1),('E5',1),('G5',1),('C6',1),('G5',1),('E5',1),('C5',2)],
 [('C5',2),('-',6)],
]
B_CH = ['F','G','Em','Am','F','G','C','C']
OUTRO = [A[4], A[5], A[6], [('C5',1),('E5',1),('G5',1),('C6',5)]]
OUTRO_CH = ['C','G','F','C']

# opbouw: intro 2 maten, A, B, A, outro 4 maten = 30 maten
song = [(None,'C'),(None,'G')] + list(zip(A, A_CH)) + list(zip(B, B_CH)) + list(zip(A, A_CH)) + list(zip(OUTRO, OUTRO_CH))
last_bar = len(song) - 1

for bi, (mel, ch) in enumerate(song):
    t0 = bi * BAR
    roots, tri = CHORDS[ch]
    final = bi == last_bar
    # bas: grondtoon / kwint op de tellen
    for beat in range(4):
        if final and beat > 0: break
        f = freq(roots[0] if beat % 2 == 0 else roots[1])
        add(bass(f, 2*E*0.95 if not final else BAR), t0 + beat*2*E, 0, 0.55)
    # akkoord-plukjes op de off-beats
    fr = [freq(n) for n in tri]
    for k in range(4):
        if final and k > 0: break
        add(pluck(fr, 0.45 if not final else 1.8), t0 + (2*k+1)*E if not final else t0, -0.35, 0.42)
    # drums
    if not final:
        for beat in range(4):
            if beat in (0, 2): add(kick(), t0 + beat*2*E, 0, 0.75)
            if beat in (1, 3) and bi >= 2: add(clap(), t0 + beat*2*E, 0.1, 0.32)
        for k in range(8):
            add(hat(), t0 + k*E + (0.02 if k % 2 else 0), 0.4, 0.5 if k % 2 else 0.3)
    else:
        add(kick(), t0, 0, 0.7)
    # melodie
    if mel:
        pos = 0
        for note, ln in mel:
            if note != '-':
                f = freq(note)
                length = ln*E + (1.5 if final and ln > 2 else 0.25)
                add(mallet(f, length, 0.35 if ln < 3 else 0.6), t0 + pos*E, 0.05, 0.6)
                add(glock(f, length), t0 + pos*E, 0.25, 0.12)
            pos += ln

for h in (3.0, 19.0, 34.5, 51.0):
    honk(h)

mix = np.stack([L, R], axis=1)
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.3) / np.tanh(1.3) * 0.89
# fade-in kort, fade-out laatste 1.5 s
fi = int(0.05*SR); mix[:fi] *= np.linspace(0,1,fi)[:,None]
fo = int(1.5*SR); mix[-fo:] *= np.linspace(1,0,fo)[:,None]

out = sys.argv[1] if len(sys.argv) > 1 else 'muziek.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', out)
