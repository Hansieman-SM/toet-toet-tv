"""Music for Daily B&W #23 Space Trip: vibraphone + celesta + soft cello, no ambient. 3/4, slow and floating in E."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=2323, leads=['vibes', 'celesta', 'cello'], ambient='none', key=4, bpm=(54, 62), meter=3)
