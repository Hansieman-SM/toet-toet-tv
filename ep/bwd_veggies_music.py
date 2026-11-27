"""Music for Daily B&W #24 Sleepy Vegetables: music box + piano + soft cello, no ambient. 4/4, slow and cosy in C."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=2424, leads=['musicbox', 'piano', 'cello'], ambient='none', key=0, bpm=(56, 64), meter=4)
