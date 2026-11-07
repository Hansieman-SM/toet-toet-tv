#!/bin/bash
# Daily B&W sensory #6 (90 min): Forest Friends – ep/bwd_forest.js (owl on a branch, fox, hedgehog, deer with little antlers, squirrel with acorn,
# smiling toadstool, waving bear cub, hopping bunny, bouncing acorn, friendly tree with a bird; pine trees, ferns, falling leaves, twinkling stars;
# outro: little fox asleep under a leaf blanket) + ep/bwd_forest_music.py (flute/harp/piano, forest birds, 4/4). Last 20 min slowly dimmer.
set -e; S=2026-11-08-bw-forest-friends; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_forest.js "python3 ep/bwd_forest_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=67 OW=1280 OH=720 node ep/bwd_forest.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Forest Friends" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
