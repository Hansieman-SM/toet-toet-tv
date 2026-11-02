#!/bin/bash
# Daily B&W sensory #1 (90 min): Ocean Friends – ep/bwd_ocean.js (10 sea animals, bubbles, seaweed) + ep/bwd_ocean_music.py (harp/celesta/cello, sea waves, 3/4). Last 20 min slowly dimmer.
set -e; S=2026-11-03-bw-ocean-friends; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_ocean.js "python3 ep/bwd_ocean_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=66 OW=1280 OH=720 node ep/bwd_ocean.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Ocean Friends" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
