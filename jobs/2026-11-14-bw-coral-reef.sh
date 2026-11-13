#!/bin/bash
# Daily B&W sensory #12 (90 min): Coral Reef – ep/bwd_reef.js (white reef friends with happy faces: branching coral, striped reef fish, sea turtle
# with a hexagon shell, long dotted eel gliding in a wave, waving anemone, hermit crab with a spiral shell, slowly turning sea urchin, dotty
# boxfish, swirling school of seven tiny fish, little lobster waving its claws; rippling water line, rising plankton, sandy floor with sea-grass
# and coral heads; outro: little striped fish asleep in the anemone under a crescent moon, z z z)
# + ep/bwd_reef_music.py (harp/vibes/cello + sea, 3/4, B). Last 20 min slowly dimmer.
set -e; S=2026-11-14-bw-coral-reef; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_reef.js "python3 ep/bwd_reef_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=66 OW=1280 OH=720 node ep/bwd_reef.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Coral Reef" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
