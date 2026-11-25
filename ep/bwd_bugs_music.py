"""Music for Daily B&W #22 Garden Bugs: nylon guitar + kalimba + wooden flute with soft garden birds. 4/4, gentle and light in A-flat."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=2222, leads=['guitar', 'kalimba', 'flute'], ambient='forest', key=8, bpm=(58, 66), meter=4)
