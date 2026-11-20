"""Music for Daily B&W #17 Music Toys: music box + vibes + guitar (the toy instruments themselves), no ambient. 3/4, light and gentle in B-flat."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1717, leads=['musicbox', 'vibes', 'guitar'], ambient='none', key=-2, bpm=(62, 70), meter=3)
