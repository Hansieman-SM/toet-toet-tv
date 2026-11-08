#!/bin/bash
# Daily B&W sensory #7 (90 min): Sleepy Fruit – ep/bwd_fruit.js (apple with shine, pear in a striped nightcap, rocking banana, strawberry with seeds,
# two cherries (one awake, one dozing), watermelon slice with tapping feet, rolling orange slice wheel, grapes, pineapple with diamond pattern, yawning lemon;
# checkered tablecloth, bunting, twinkling stars, rising sparkles; outro: apple and pear asleep in a woven basket) + ep/bwd_fruit_music.py
# (music box/celesta/cello, no ambient, 3/4, G). Last 20 min slowly dimmer.
set -e; S=2026-11-09-bw-sleepy-fruit; O=release/$S; mkdir -p $O
DIMLOOPS=5 tools/long.sh ep/bwd_fruit.js "python3 ep/bwd_fruit_music.py" $O 90
rm -f $O/intro.mp4 $O/loop.mp4 $O/outro.mp4 $O/dimin.mp4 $O/dim.mp4 $O/list.txt $O/music.wav $O/music.log
STILL=162 OW=1280 OH=720 node ep/bwd_fruit.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Sleepy Fruit" "Black & White Baby Sensory · 90 min"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
