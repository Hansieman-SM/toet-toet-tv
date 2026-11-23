"""Music for Daily B&W #20 Bath Time: kalimba + vibes + harp, no ambient. 4/4, bubbly and gentle in G."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=2020, leads=['kalimba', 'vibes', 'harp'], ambient='none', key=7, bpm=(62, 70), meter=4)
