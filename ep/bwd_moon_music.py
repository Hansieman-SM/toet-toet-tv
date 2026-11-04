"""Music for Daily B&W #3 Moon and Stars: celesta + vibraphone + soft flute, gentle night crickets. 3/4, slow."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=313, leads=['celesta', 'vibes', 'flute'], ambient='night', key=-4, bpm=(54, 62), meter=3)
