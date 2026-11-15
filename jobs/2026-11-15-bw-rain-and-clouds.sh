#!/bin/bash
# Daily B&W sensory #14 (90 min): Rain and Clouds – ep/bwd_rain.js (white rainy-day friends with happy faces: fluffy cloud dripping little drops,
# bouncing raindrop with squash + splash rings, black-and-white striped umbrella with drops bouncing off, rainbow arc between two little clouds,
# puddle with ripple rings, dotty rain boots stomping in turn, duck in a rain hat paddling, snail with a turning spiral shell and waving eye
# stalks, sun with turning rays peeking out from behind a cloud, frog holding a big leaf as an umbrella; slanted rain streaks, cloud band,
# ripples on the wet ground; outro: a little cloud asleep hugging a tiny raindrop under a crescent moon, z z z)
# + ep/bwd_rain_music.py (piano/celesta/harp + soft rain, 3/4, F#). Last 20 min slowly dimmer.
set -e; S=2026-11-15-bw-rain-and-clouds; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_rain.js "python3 ep/bwd_rain_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=102 OW=1280 OH=720 node ep/bwd_rain.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Rain and Clouds" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
