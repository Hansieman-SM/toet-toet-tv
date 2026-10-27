"""Maakt de geluidsspoor van een aflevering: python3 ep/mix.py <js-bestand> <uit.wav>"""
import sys, json, subprocess, os
sys.path.insert(0, 'lib')
from audio2 import *

info = json.loads(subprocess.run(['node', sys.argv[1]], capture_output=True, text=True, check=True, env=dict(os.environ, EVENTS='1')).stdout)
dur = info['dur']; m = info['music'] or {}
kind = m.get('kind', 'toet')
if kind == 'toet': music = toet_long(dur, m.get('shift', 0), m.get('soft', False))
elif kind == 'shapes': music = shapes_long(dur, m.get('shift', 0))
elif kind == 'safari': music = safari_long(dur, m.get('shift', 0))
else: music = lullaby(dur)
events = [(t, make(name), g, pan) for t, name, g, pan in info['events']]
duck = [tuple(d) for d in info['duck']]
render(dur, music, events, sys.argv[2], duck)
print('ok', dur)
