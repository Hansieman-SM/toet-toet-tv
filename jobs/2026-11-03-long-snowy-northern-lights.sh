#!/bin/bash
# 90-min calm video: Snowy Northern Lights – polar bear mama + cub, penguin family, seal on an ice floe, beluga, sleeping arctic fox,
# snowy owl, sliding baby penguin, arctic hare, snowman, igloo, pastel aurora (ep/arctic.js) + new felt-piano/glass-pad music (ep/arctic_music.py) + English thumbnail
set -e; S=2026-11-03-long-snowy-northern-lights; O=release/$S; B=out/$S; mkdir -p $O
tools/long.sh ep/arctic.js "python3 ep/arctic_music.py" $B 90
mv $B/$S.mp4 $O/$S.mp4
STILL=24 OW=1280 OH=720 node ep/arctic.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Snowy Northern Lights" "Calm Music for Babies & Toddlers"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/bg.png
ls -la $O
