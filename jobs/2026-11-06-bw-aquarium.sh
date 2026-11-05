#!/bin/bash
# Daily B&W sensory #4 (90 min): Aquarium – ep/bwd_aquarium.js (angelfish, fancy goldfish, snail, castle with a peeking fish, toy diver helmet,
# shrimp, guppy family, smiling water plant, clam with a pearl, ray; water surface, air-stone bubbles, pebbles, tank plants; outro: sleepy goldfish)
# + ep/bwd_aquarium_music.py (kalimba/harp/vibes, soft sea hush, 4/4). Last 20 min slowly dimmer.
set -e; S=2026-11-06-bw-aquarium; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_aquarium.js "python3 ep/bwd_aquarium_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=102 OW=1280 OH=720 node ep/bwd_aquarium.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Aquarium" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
