"""Music for Daily B&W #19 Birds: flute + celesta + guitar with soft forest birds. 3/4, light and airy in D."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1919, leads=['flute', 'celesta', 'guitar'], ambient='forest', key=2, bpm=(60, 66), meter=3)
