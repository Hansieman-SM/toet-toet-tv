#!/bin/bash
# Episode (EN): Toet's Helper Friends – Rosie the Recycling Truck (ep/en09_recycle.js: Little Truck Toet finds trash along the road; Rosie the Recycling
# Truck (new character) arrives with three bins – BLUE for paper (newspaper, box), GREEN for glass (3 bottles), YELLOW for plastic (cup, bottle, pot);
# counting 1-2 / 1-2-3 / 1-2-3, flowers pop up on the clean grass, recap of the bins, Rosie reverses away "beep, beep!";
# new music recycle_long: pulse-wave lead, electric piano offbeats, triangle bass, woodblock + soft kick + claps, F major)
set -e; S=2026-11-11-episode-rosie-the-recycling-truck; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en09_recycle.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en09_recycle.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=66.4 OW=1280 OH=720 node ep/en09_recycle.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Rosie the Recycling Truck" "Blue, green, yellow – sort with Toet!"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
