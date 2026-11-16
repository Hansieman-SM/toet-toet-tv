"""Music for Daily B&W #15 Pets: guitar + music box + piano, no ambient. 4/4, warm and playful-calm in A-flat."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1515, leads=['guitar', 'musicbox', 'piano'], ambient='none', key=-4, bpm=(60, 68), meter=4)
