#!/bin/bash
# Daily B&W sensory #8 (90 min): Arctic Friends – ep/bwd_arctic.js (waddling penguin, waving polar bear, seal balancing a striped ball,
# walrus with tusks + moustache, trotting arctic fox with fluffy tail, turning smiling snowflake, igloo with a peeking baby penguin,
# beluga-style whale with a water fountain, flying puffin with a striped beak, smiling iceberg on little waves;
# snow drifts, twinkling stars, slow aurora ribbons, falling snow; outro: baby penguin asleep against a sleeping polar bear under a crescent moon)
# + ep/bwd_arctic_music.py (celesta/flute/cello + soft wind, 4/4, A). Last 20 min slowly dimmer.
set -e; S=2026-11-10-bw-arctic-friends; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_arctic.js "python3 ep/bwd_arctic_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=114 OW=1280 OH=720 node ep/bwd_arctic.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Arctic Friends" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
