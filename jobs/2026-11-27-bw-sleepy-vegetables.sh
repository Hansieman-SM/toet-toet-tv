#!/bin/bash
# Daily B&W sensory #24 (90 min): Sleepy Vegetables – ep/bwd_veggies.js (white vegetables with sleepy, happy faces on black: carrot with a
# swaying leafy top and a slow yawn, pea pod opening so four tiny peas peek out and bob in turn, broccoli whose florets puff up one by one,
# tomato with a slowly turning star leaf cap, corn cob whose husk leaves open and close, striped pumpkin rocking with a curly vine, sleepy
# potato in a striped night cap (z z z), onion with a curly sprout doing a soft squash-and-stretch hop, bell pepper swaying on its stem,
# cucumber rocking on a cushion; night vegetable garden: soil ridges with little sprouts, twinkling stars, drifting seeds; outro: carrot,
# tomato and pea pod asleep in a woven basket under a crescent moon) + ep/bwd_veggies_music.py (music box/piano/cello, no ambient, 4/4, C).
# Last 20 min slowly dimmer.
set -e; S=2026-11-27-bw-sleepy-vegetables; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_veggies.js "python3 ep/bwd_veggies_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
THUMBDY=96 STILL=90 OW=1280 OH=720 node ep/bwd_veggies.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Sleepy Vegetables" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
