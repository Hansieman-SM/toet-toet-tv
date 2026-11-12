"""Music for Daily B&W #11 Shapes Dance: vibes + kalimba + piano, no ambient. 3/4, light and swaying in F."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=1111, leads=['vibes', 'kalimba', 'piano'], ambient='none', key=5, bpm=(62, 70), meter=3)
