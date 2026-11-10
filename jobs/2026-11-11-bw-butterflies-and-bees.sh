#!/bin/bash
# Daily B&W sensory #9 (90 min): Butterflies and Bees – ep/bwd_bees.js (butterfly with patterned wings that slowly flap,
# striped bumble bee flying little loops, ladybird whose spotted shell gently opens, smiling daisy, dragonfly with veined wings,
# caterpillar inching along, snail with a spiral shell + wiggling eye stalks, beehive with a peeking bee and a circling little bee,
# smiling leaf, big sunflower; grass with little flowers, smiling sun, drifting cloud, rising pollen dots;
# outro: caterpillar and butterfly asleep on a big leaf under a crescent moon)
# + ep/bwd_bees_music.py (kalimba/flute/harp + forest birds, 3/4, E). Last 20 min slowly dimmer.
set -e; S=2026-11-11-bw-butterflies-and-bees; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_bees.js "python3 ep/bwd_bees_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=90 OW=1280 OH=720 node ep/bwd_bees.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Butterflies and Bees" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
