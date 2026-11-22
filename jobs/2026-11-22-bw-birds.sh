#!/bin/bash
# Daily B&W sensory #19 (90 min): Birds – ep/bwd_birds.js (white birds + bird things with happy faces on black: singing robin on a twig with
# floating notes, swan gliding on rippling water, woodpecker tapping a tree trunk, hummingbird hovering by a bell flower, peacock slowly fanning
# its eye-spot tail, nest with three baby birds opening their beaks in turn, birdhouse with a heart and a peeking bird, big striped feather
# rocking down, pelican with a little fish peeking from its pouch, three sparrows bobbing on a wire; leafy corner branches, stars, a far-away
# flock, drifting feathers; outro: little bird asleep in its nest under a crescent moon) + ep/bwd_birds_music.py (flute/celesta/guitar + forest
# birds, 3/4, D). Last 20 min slowly dimmer.
set -e; S=2026-11-22-bw-birds; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_birds.js "python3 ep/bwd_birds_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=70 STILL=126 OW=1280 OH=720 node ep/bwd_birds.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Birds" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
