#!/bin/bash
# Daily B&W sensory #5 (90 min): Safari Babies – ep/bwd_safari.js (lion cub, baby elephant, giraffe, zebra, yawning hippo, monkey with banana,
# rhino calf, flamingo on one leg, meerkat on its mound, tortoise peeking out; savanna horizon, acacias, turning sun rays, gliding birds;
# outro: sleeping lion cub under a crescent moon) + ep/bwd_safari_music.py (kalimba/guitar/cello, savanna wind, 3/4). Last 20 min slowly dimmer.
set -e; S=2026-11-07-bw-safari-babies; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_safari.js "python3 ep/bwd_safari_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=114 OW=1280 OH=720 node ep/bwd_safari.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Safari Babies" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
