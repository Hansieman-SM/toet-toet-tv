"""Music for Daily B&W #16 Dinosaur Babies: cello + kalimba + flute, soft wind ambient. 3/4, gentle and warm in E-flat."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1616, leads=['cello', 'kalimba', 'flute'], ambient='wind', key=3, bpm=(56, 64), meter=3)
