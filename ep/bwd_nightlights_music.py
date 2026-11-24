"""Music for Daily B&W #21 Night Lights: celesta + cello + music box with soft night crickets. 3/4, slow and dreamy in A."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=2121, leads=['celesta', 'cello', 'musicbox'], ambient='night', key=9, bpm=(54, 62), meter=3)
