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
elif kind == 'kind': music = kind_long(dur, m.get('shift', 0))
elif kind == 'opposites': music = opp_long(dur, m.get('shift', 0))
elif kind == 'weather': music = weather_long(dur, m.get('shift', 0))
elif kind == 'homes': music = homes_long(dur, m.get('shift', 0))
elif kind == 'music': music = music_long(dur, m.get('shift', 0))
elif kind == 'hide': music = hide_long(dur, m.get('shift', 0))
elif kind == 'picnic': music = picnic_long(dur, m.get('shift', 0))
elif kind == 'leaves': music = leaves_long(dur, m.get('shift', 0))
elif kind == 'abc': music = abc_long(dur, m.get('shift', 0))
elif kind == 'snow': music = snow_long(dur, m.get('shift', 0))
elif kind == 'recycle': music = recycle_long(dur, m.get('shift', 0))
elif kind == 'tower': music = tower_long(dur, m.get('shift', 0))
elif kind == 'animalabc': music = animal_abc_long(dur, m.get('shift', 0))
else: music = lullaby(dur)
events = [(t, make(name), g, pan) for t, name, g, pan in info['events']]
duck = [tuple(d) for d in info['duck']]
render(dur, music, events, sys.argv[2], duck)
print('ok', dur)
