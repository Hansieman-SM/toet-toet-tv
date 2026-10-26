import sys; sys.path.insert(0, 'lib')
from audiolib import *
ev, duck = [], []
notes = ['C6', 'D6', 'E6', 'G6']
for i, (s, key) in enumerate([(5, 'lion'), (17, 'elephant'), (29, 'rhino'), (41, 'buffalo')]):
    ev += [(s + 1.5, rustle(1.1), .8), (s + 4.5, rustle(1.1), .8), (s + 6.5, boing(), .9), (s + 7.0, ANIMAL[key](), 1.0), (s + 8.3, chime(notes[i]), .7)]
    duck.append((s + 6.5, s + 9.0))
ev += [(55.6, arpeggio(), .7)]
render(60, safari_theme(60, shift=2), ev, sys.argv[1], duck)
