#!/bin/bash
# Daily B&W sensory #25 (90 min): Mountain Animals – ep/bwd_mountain.js (white figures with happy faces on black: mountain goat with curly
# horns hopping on a rock, eagle gliding with slow wing flaps, marmot popping out of its burrow and whistling, smiling snowy peak with a
# drifting cloud, shaggy yak with a swaying fringe, snowy pine tree dropping a pinecone, fluffy wolf pup softly howling at a tiny moon,
# round pika with big ears nibbling a flower, alpaca chewing and nodding, cable-car gondola swinging with a waving bunny; mountain ridges,
# stars, drifting snowflakes; outro: goat kid and marmot asleep on a rock ledge under a crescent moon) + ep/bwd_mountain_music.py
# (flute/harp/cello + soft wind, 4/4, D). Last 20 min slowly dimmer.
set -e; S=2026-11-28-bw-mountain-animals; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_mountain.js "python3 ep/bwd_mountain_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=96 STILL=114 OW=1280 OH=720 node ep/bwd_mountain.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Mountain Animals" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
