"""Music for Daily B&W #7 Sleepy Fruit: music box + celesta + warm cello, no ambient sounds. 3/4, slow rocking lullaby in G."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=707, leads=['musicbox', 'celesta', 'cello'], ambient='none', key=-5, bpm=(58, 66), meter=3)
