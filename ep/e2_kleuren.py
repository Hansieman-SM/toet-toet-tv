import sys; sys.path.insert(0, 'lib')
from audiolib import *
ev = [(3.0, honk(), .8)]
for i, at in enumerate([6, 13, 20, 27, 34, 41]):
    p = at + 3.2
    ev += [(p, pop(), 1.0), (p + .04, splash(), .7), (p + .35, arpeggio(('E5', 'G5', 'C6'), .08), .6)]
notes = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6']
for i in range(6): ev.append((48.2 + i * .7, chime(notes[i]), .8))
ev += [(52.6, tada(), .7), (54.9, honk(), .7)]
render(60, toet_theme(60, shift=2), ev, sys.argv[1], [(at + 3.1, at + 4.2) for at in [6, 13, 20, 27, 34, 41]])
