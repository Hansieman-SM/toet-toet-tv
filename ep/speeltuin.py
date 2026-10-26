import sys; sys.path.insert(0, 'lib')
from audiolib import *
import numpy as np

def slide_down(length=1.0):
    n = int(length*SR); t = tt(n)
    f = fcurve([(0, 900), (length, 260)], n)
    s = osc(f, 'sine') * (.8 + .2*np.sin(2*np.pi*10*t)) + .3*osc(f*1.5, 'sine')
    return s * np.minimum(t/.05, 1) * np.clip((length - t)/.2, 0, 1) * .55

ev = []
for a in (5, 16.3, 27.8, 38.8, 49.8): ev.append((a, arpeggio(('C5', 'E5', 'G5', 'C6'), .07), .6))
ev += [(8.5, laugh(), .6), (11.0, laugh(), .5)]
# glijbaan: Kofi glijdt in elke cyclus van 5 s tussen 2,1 en 3,1
for k in range(3, 6):
    t0 = k * 5 + 2.1
    if 14 < t0 < 26: ev += [(t0, slide_down(1.0), .8), (t0 + 1.0, boing(), .5)]
ev.append((18.2, laugh(), .6))
# wipwap: tik als een kant de grond raakt (sin(2.1 t) = +-1)
for k in range(40):
    tt_ = (np.pi/2 + k*np.pi) / 2.1
    if 27 < tt_ < 36: ev.append((tt_, boing(), .35))
ev.append((30.2, laugh(), .6))
# zandbak
for k in range(10): ev.append((39 + k * .6, rustle(.25), .25))
ev += [(44.6, tada(), .6)]
# touwtje: tik bij elke slag op de grond (cos(ph)=1 → t = k/0.9)
for k in range(60):
    tt_ = k / .9
    if 47 < tt_ < 55: ev.append((tt_, tick(), .5))
ev += [(51.2, laugh(), .6), (54.8, tada(), .7)]
render(60, toet_theme(60, shift=5), ev, sys.argv[1], [(18.2, 19.4), (30.2, 31.4), (51.2, 52.4)])
