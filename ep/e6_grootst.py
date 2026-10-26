import sys; sys.path.insert(0, 'lib')
from audiolib import *
ev, duck = [], []
for s, key in [(5, 'lion'), (11, 'buffalo'), (17, 'rhino'), (23, 'elephant')]:
    ev.append((s + 3, ANIMAL[key](), 1.0)); duck.append((s + 3, s + 5))
for i, nt in enumerate(['C5', 'E5', 'G5', 'C6']): ev.append((29.5 + i, chime(nt), .8))
ev += [(38.4, squeak(), .9), (40.2, squeak(), .7), (43.0, laugh(), .8), (49.0, tick(), .5), (50.5, tada(), .8), (50.9, trumpet(), .8), (54.9, arpeggio(), .7)]
duck += [(38.4, 39.2), (43.0, 44.4), (50.5, 52.6)]
render(60, safari_theme(60, shift=-2), ev, sys.argv[1], duck)
