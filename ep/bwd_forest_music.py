"""Music for Daily B&W #6 Forest Friends: wooden flute + harp + felt piano, soft forest birds. 4/4, slow and gentle."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=606, leads=['flute', 'harp', 'piano'], ambient='forest', key=5, bpm=(52, 60), meter=4)
