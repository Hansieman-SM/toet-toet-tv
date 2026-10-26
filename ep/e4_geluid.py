import sys; sys.path.insert(0, 'lib')
from audiolib import *
ev, duck = [], []
for s, key in [(5, 'lion'), (17, 'elephant'), (29, 'rhino'), (41, 'buffalo')]:
    snd = ANIMAL[key]
    for m in (1.5, 4.2): ev.append((s + m, snd(), 1.0)); duck.append((s + m, s + m + 1.9))
    for i in range(3): ev.append((s + 6 + i, tick(), .7))
    ev += [(s + 9.0, tada(), .7), (s + 9.4, snd(), .9)]; duck.append((s + 9.0, s + 11.2))
ev += [(55.6, arpeggio(), .7)]
render(60, safari_theme(60), ev, sys.argv[1], duck)
