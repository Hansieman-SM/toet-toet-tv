#!/bin/bash
# Episode (EN): Toet's Helper Friends – Dottie the Digger (ep/en13_digger.js: Little Truck Toet finds a little tree (root ball in a sack)
# next to a sign "A new tree for the park!" but can't dig; Dottie the Digger (new character: yellow digger on tracks, two-part arm with a
# bucket, orange beacon) helps. Learning moment FIRST / THEN / LAST + counting 1-2-3: FIRST we dig (three scoops onto a dirt pile),
# THEN we plant (Dottie lifts the tree into the hole and pushes the soil back), LAST we water (a smiling rain cloud, "Pitter patter!",
# the tree grows and blossoms, a bluebird lands); recap of the three steps; new music digger_long: mandolin folk stomp in A –
# mandolin lead with tremolo, upright bass, felt-piano off-beats, cajón + foot stomps + soft claps)
set -e; S=2026-11-20-episode-dottie-the-digger; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en13_digger.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en13_digger.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=54.6 OW=1280 OH=720 node ep/en13_digger.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Dottie the Digger" "Dig, plant, water – with Toet!"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
