"""Music for Daily B&W #12 Coral Reef: harp + vibes + cello over a soft sea hush. 3/4, slow and floaty in B."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1212, leads=['harp', 'vibes', 'cello'], ambient='sea', key=-1, bpm=(56, 64), meter=3)
