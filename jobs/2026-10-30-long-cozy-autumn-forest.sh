#!/bin/bash
# 90-min calm video: Cozy Autumn Forest (ep/autumn.js + ep/autumn_music.py) + English thumbnail
set -e; S=2026-10-30-long-cozy-autumn-forest; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/autumn.js "python3 ep/autumn_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
STILL=40 OW=1280 OH=720 node ep/autumn.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Cozy Autumn Forest" "Calm Music for Babies & Toddlers"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
