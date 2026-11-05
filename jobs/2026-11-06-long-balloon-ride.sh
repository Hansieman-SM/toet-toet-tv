#!/bin/bash
# 90-min calm video: Balloon Ride – striped hot-air balloons drift over pastel hills with waving passengers (bunny, bear cub, piglet, kitten),
# smiling sun, sleepy clouds, turning windmill, geese, pond with mama duck + duckling, grazing sheep + hopping lamb, hedgehog, butterflies (ep/balloons.js)
# + new clarinet / pizzicato / harmonium music in a lilting 6/8 (ep/balloons_music.py) + English thumbnail
set -e; S=2026-11-06-long-balloon-ride; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/balloons.js "python3 ep/balloons_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
THUMBLOW=150 STILL=237 OW=1280 OH=720 node ep/balloons.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Balloon Ride" "Calm Music for Babies & Toddlers"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
