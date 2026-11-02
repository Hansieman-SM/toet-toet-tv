"""Music for Daily B&W #1 Ocean Friends: harp + celesta, cello for the sleepy end, soft sea waves. 3/4."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=101, leads=['harp', 'celesta', 'cello'], ambient='sea', key=-2, bpm=(62, 70), meter=3)
