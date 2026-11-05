"""Music for Daily B&W #4 Aquarium: kalimba + harp + vibraphone, soft sea/water hush. 4/4, gentle."""
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')); import bwmusic
bwmusic.make(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 120, seed=404, leads=['kalimba', 'harp', 'vibes'], ambient='sea', key=2, bpm=(60, 68), meter=4)
