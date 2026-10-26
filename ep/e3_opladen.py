import sys; sys.path.insert(0, 'lib')
from audiolib import *
ev = [(3.0, honk(), .8)]
for tt_ in (11.0, 11.4, 14.0, 14.4): ev.append((tt_, tick(), .6))
ev += [(16.0, sad(), .9), (19.6, arpeggio(('C5', 'E5', 'G5'), .1), .6), (23.0, pop(), .5)]
notes = ['C5', 'D5', 'E5', 'G5', 'C6']
for i, b in enumerate([25, 27, 29, 31, 33]):
    ev += [(b - 1.2, whoosh_up(1.2), .45), (b, chime(notes[i]), .9)]
ev += [(34.0, tada(), .8), (38.0, pop(), .4), (38.8, honk(), .8), (54.6, arpeggio(), .7)]
render(60, toet_theme(60, shift=-2), ev, sys.argv[1], [(16.0, 17.6), (34.0, 35.6)])
