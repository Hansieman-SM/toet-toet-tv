#!/bin/bash
# Daily B&W sensory #11 (90 min): Shapes Dance – ep/bwd_shapes.js (white shape friends with happy faces: circle with a turning dotted ring,
# square with a tilted square inside, striped triangle, twinkling star, gently beating heart, slowly turning spiral disc, hexagon with a
# honeycomb ring, checkerboard square whose checks breathe, egg with sliding zebra stripes, dotty diamond; small outline shapes drifting
# and turning, tiny rising dots; outro: square, circle and triangle asleep side by side on a long pillow, z z z)
# + ep/bwd_shapes_music.py (vibes/kalimba/piano, no ambient, 3/4, F). Last 20 min slowly dimmer.
set -e; S=2026-11-13-bw-shapes-dance; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_shapes.js "python3 ep/bwd_shapes_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=126 OW=1280 OH=720 node ep/bwd_shapes.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Shapes Dance" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
