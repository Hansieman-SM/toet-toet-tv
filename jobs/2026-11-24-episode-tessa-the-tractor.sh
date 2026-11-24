#!/bin/bash
# Episode (EN): Toet's Helper Friends – Tessa the Tractor (ep/en15_tractor.js). Little Truck Toet finds a pumpkin patch next to a little
# farm stand but can't lift the pumpkins; Tessa the Tractor (new character: green ELECTRIC tractor with a lightning badge, big back wheel,
# front loader) helps. Learning moment: sizes SMALL / MEDIUM / BIG and LIGHT vs HEAVY – Tessa scoops the small pumpkin (light) and the
# medium one onto the stand, then slowly lifts the BIG heavy one ("Umph!"); recap small, medium, big; Tessa drives off.
# New music tractor_long: lap-steel country two-step in A, steel-string strums, jug bass, washboard + spoons.
set -e; S=2026-11-24-episode-tessa-the-tractor; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en15_tractor.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en15_tractor.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
THUMBBG=1 STILL=100 OW=1280 OH=720 node ep/en15_tractor.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Tessa the Tractor" "Small, Medium, Big! with Little Truck Toet"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
