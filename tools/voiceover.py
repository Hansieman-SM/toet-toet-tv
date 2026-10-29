"""Rustige vertelstem (Kokoro TTS, Apache-2.0) over een aflevering.
python3 tools/voiceover.py <episode_en.js> <muziek+effecten.wav> <uit.wav> --voice af_heart [--speed 0.88] [--until SEC]
Leest alle tekstballonnen, de titel en grote getallen voor; muziek gaat zachter onder de stem.
Vereist (alleen op de GitHub-runner): apt espeak-ng, pip kokoro soundfile."""
import argparse, json, subprocess, os, re, numpy as np, wave
p = argparse.ArgumentParser(); p.add_argument('js'); p.add_argument('bed'); p.add_argument('out')
p.add_argument('--voice', default='af_heart'); p.add_argument('--speed', type=float, default=0.88); p.add_argument('--until', type=float, default=1e9)
a = p.parse_args()
WORDS = {'1': 'One.', '2': 'Two.', '3': 'Three.', '4': 'Four.', '5': 'Five.', '6': 'Six.', '7': 'Seven.', '8': 'Eight.', '9': 'Nine.', '10': 'Ten.'}
info = json.loads(subprocess.run(['node', a.js], capture_output=True, text=True, check=True, env=dict(os.environ, SAYS='1')).stdout)
lines = []
for st, en, who, txt in info['lines']:
    if st > a.until: continue
    t = WORDS.get(txt.strip(), txt).replace('...', ',').replace('…', ',')
    if who == 'title': t = t + '.'
    if re.fullmatch(r'[A-Z!]{3,}', txt.strip()): continue          # schreeuwgeluiden laten we aan de geluidseffecten
    lines.append((st, t))
from kokoro import KPipeline
pipe = KPipeline(lang_code='b' if a.voice.startswith('b') else 'a')
SR = 24000
def tts(text):
    chunks = [np.asarray(audio, dtype=np.float32) for _, _, audio in pipe(text, voice=a.voice, speed=a.speed)]
    return np.concatenate(chunks) if chunks else np.zeros(1, np.float32)
# bed inlezen
w = wave.open(a.bed); bsr = w.getframerate(); ch = w.getnchannels()
bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32).reshape(-1, ch) / 32767; w.close()
if ch == 1: bed = np.repeat(bed, 2, 1)
voice = np.zeros(len(bed), np.float32); cursor = 0
for st, text in lines:
    v = tts(text)
    idx = np.round(np.arange(int(len(v) * bsr / SR)) * SR / bsr).astype(int).clip(0, len(v) - 1); v = v[idx]   # resample
    i = max(int((st + 0.25) * bsr), cursor)
    if i >= len(voice): break
    v = v[:len(voice) - i]; voice[i:i + len(v)] += v; cursor = i + len(v) + int(0.25 * bsr)
    print(f'{st:6.1f}s  {text}', flush=True)
voice /= (np.max(np.abs(voice)) + 1e-9); voice *= 0.85
# ducking: muziek -9 dB waar de stem klinkt, zachte overgangen
env = (np.abs(voice) > 0.01).astype(np.float32)
k = int(0.35 * bsr); env = np.convolve(env, np.ones(k) / k, 'same').clip(0, 1)
gain = 1 - env * (1 - 10 ** (-9 / 20))
mix = bed * gain[:, None] + voice[:, None] * 0.9
mix /= max(1.0, np.max(np.abs(mix)) / 0.95)
o = wave.open(a.out, 'wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(bsr)
o.writeframes((mix * 32767).astype('<i2').tobytes()); o.close()
