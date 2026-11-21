"""Music for Daily B&W #18 Flowers Bloom: harp + piano + flute with soft garden birds (forest ambient). 4/4, gentle and airy in F-sharp."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1818, leads=['harp', 'piano', 'flute'], ambient='forest', key=6, bpm=(60, 68), meter=4)
