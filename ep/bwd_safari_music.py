"""Music for Daily B&W #5 Safari Babies: kalimba + nylon guitar + cello, soft savanna wind. 3/4, gentle."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=505, leads=['kalimba', 'guitar', 'cello'], ambient='wind', key=0, bpm=(58, 66), meter=3)
