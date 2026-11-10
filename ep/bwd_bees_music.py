"""Music for Daily B&W #9 Butterflies and Bees: kalimba + wooden flute + harp, forest birds. 3/4, light and gentle in E."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=909, leads=['kalimba', 'flute', 'harp'], ambient='forest', key=4, bpm=(60, 68), meter=3)
