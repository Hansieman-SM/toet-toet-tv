"""Music for Daily B&W #2 Sleepy Farm: nylon guitar + music box, piano for the sleepy end, soft forest birds. 4/4, slower."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=202, leads=['guitar', 'musicbox', 'piano'], ambient='forest', key=3, bpm=(56, 64), meter=4)
