"""Music for Daily B&W #13 Jungle Night: wooden flute + nylon guitar + cello over soft night crickets. 4/4, slow and warm in C#."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1313, leads=['flute', 'guitar', 'cello'], ambient='night', key=1, bpm=(54, 62), meter=4)
