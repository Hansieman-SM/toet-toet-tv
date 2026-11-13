#!/bin/bash
# Episode (EN): Toet's Helper Friends – Freddie the Fire Truck (ep/en11_firetruck.js: Kiki the kitten is stuck up in a tree; Little Truck Toet
# is too small to reach and asks for help; Freddie the Fire Truck (new character) raises his ladder UP – counting the sections 1-2-3-4-5 – Kiki
# hops onto the platform and rides DOWN; Freddie waters three thirsty flowers with his hose (1-2-3, a little rainbow); recap UP / DOWN +
# "When you need help, just ask!"; new music firetruck_long: little brass-band march – mellow brass lead + off-beat chords, tuba oom-pah,
# snare + bass drum, glockenspiel, B♭; gentle two-tone 'nee-naw' sfx)
set -e; S=2026-11-14-episode-freddie-the-fire-truck; O=release/$S; mkdir -p $O
python3 ep/mix.py ep/en11_firetruck.js $O/audio.wav
SUBSCRIBE=1 OW=2560 OH=1440 node ep/en11_firetruck.js | ffmpeg -v error -y -f rawvideo -pix_fmt rgba -s 2560x1440 -r 30 -i - -i $O/audio.wav -c:v libx264 -preset slow -tune animation -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $O/$S.mp4
STILL=73.9 OW=1280 OH=720 node ep/en11_firetruck.js $O/bg.png
OW=1280 OH=720 node tools/thumb2.js $O/bg.png $O/$S-thumbnail.png "Freddie the Fire Truck" "Up and down – count with Toet!"
ffmpeg -v error -y -i $O/$S-thumbnail.png -q:v 2 $O/$S-thumbnail.jpg
rm -f $O/audio.wav $O/bg.png
