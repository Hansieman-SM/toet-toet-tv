import sys; sys.path.insert(0, 'lib')
from audiolib import *
ev = [(3.0, honk(), .8)]
notes = ['C5', 'D5', 'E5', 'G5', 'A5']
for i in range(5):
    at = 11 + i * 5
    ev += [(at, boing(), .6), (at + .3, chime(notes[i]), .8), (at + .9, moo(1 + i * .06), 1.0, -.2 + i * .1)]
for i in range(5): ev.append((37 + i, chime(notes[i]), .9))
ev += [(42.5, tada(), .8)]
for i in range(5): ev.append((44.5 + i * .3, moo(.9 + i * .08), .7, -.4 + i * .2))
ev += [(46.2, honk(), .8), (54.6, arpeggio(), .7)]
duck = [(at + .9, at + 2.3) for at in [11, 16, 21, 26, 31]] + [(44.5, 47.2)]
render(60, toet_theme(60), ev, sys.argv[1], duck)
