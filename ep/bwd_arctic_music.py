"""Music for Daily B&W #8 Arctic Friends: celesta + wooden flute + warm cello, soft arctic wind. 4/4, slow and airy in A."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=808, leads=['celesta', 'flute', 'cello'], ambient='wind', key=-3, bpm=(54, 62), meter=4)
