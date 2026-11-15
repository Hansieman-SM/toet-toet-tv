"""Music for Daily B&W #14 Rain and Clouds: piano + celesta + harp over soft rain. 3/4, gentle and light in F#."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1414, leads=['piano', 'celesta', 'harp'], ambient='rain', key=-6, bpm=(58, 66), meter=3)
