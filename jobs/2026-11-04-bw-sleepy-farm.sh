#!/bin/bash
# Daily B&W sensory #2 (90 min): Sleepy Farm – ep/bwd_farm.js (cow, pig, horse, hen, chick, goat, barn, tractor, duck, sleeping cat; stars, drifting clouds, fence + grass)
# rev2: figures fade as one layer (lib/bwlong.js layered()), no see-through parts during fades
# + ep/bwd_farm_music.py (guitar/musicbox/piano, forest birds, 4/4). Last 20 min slowly dimmer.
set -e; S=2026-11-04-bw-sleepy-farm; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_farm.js "python3 ep/bwd_farm_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=115 OW=1280 OH=720 node ep/bwd_farm.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Sleepy Farm" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
