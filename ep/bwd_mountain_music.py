"""Music for Daily B&W #25 Mountain Animals: wooden flute + harp + soft cello, gentle mountain wind. 4/4, calm in D."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=2525, leads=['flute', 'harp', 'cello'], ambient='wind', key=2, bpm=(58, 66), meter=4)
