"""Music for Daily B&W #10 Little Vehicles: piano + music box + cello, no ambient. 4/4, calm and warm in D."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1010, leads=['piano', 'musicbox', 'cello'], ambient='none', key=2, bpm=(66, 74), meter=4)
