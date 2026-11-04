#!/bin/bash
# Daily B&W sensory #3 (90 min): Moon and Stars – ep/bwd_moon.js (smiling full moon, star, comet, ringed planet, rocket, owl on a branch,
# sleepy cloud, sleepy sun with nightcap, heart constellation, paper lantern; star field, slow shooting star, white hills; outro: sleeping star in a crescent moon)
# + ep/bwd_moon_music.py (celesta/vibes/flute, night crickets, 3/4). Last 20 min slowly dimmer.
set -e; S=2026-11-05-bw-moon-and-stars; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_moon.js "python3 ep/bwd_moon_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=114 OW=1280 OH=720 node ep/bwd_moon.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Moon and Stars" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
