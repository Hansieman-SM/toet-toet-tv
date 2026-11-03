#!/bin/bash
# Episode (EN): Little Truck Toet – Who Lives Here? (ep/en05_homes.js: animal homes – bird/nest, bee/hive, rabbit/burrow, fish/pond, Toet's own garage + charging, night recap; new country music homes_long: fiddle, banjo rolls, boom-chick bass, brushes)
set -e; S=2026-11-04-episode-who-lives-here; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en05_homes.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en05_homes.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=91.6 OW=1280 OH=720 node ep/en05_homes.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Who Lives Here?" "Animal homes with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
